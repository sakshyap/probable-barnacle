import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables from .env
dotenv.config({ quiet: true });

// Supabase must be loaded after dotenv so process.env is already populated.
import { checkSupabaseConnection, SupabaseNotConfiguredError } from './data/supabase.js';

// Route imports
import authRouter from './routes/auth.js';
import studentsRouter from './routes/students.js';
import coursesRouter from './routes/courses.js';
import blogRouter from './routes/blog.js';
import portfolioRouter from './routes/portfolio.js';
import portfolioAuthRouter from './routes/portfolio-auth.js';
import portfolioProfileRouter from './routes/portfolio-profile.js';
import portfolioSocialsRouter from './routes/portfolio-socials.js';
import portfolioProjectsRouter from './routes/portfolio-projects.js';
import portfolioSkillsRouter from './routes/portfolio-skills.js';
import portfolioBlogRouter from './routes/portfolio-blog.js';
import portfolioMessagesRouter from './routes/portfolio-messages.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Production is opt-in, so `npm run dev` keeps HMR even when a dist/ folder
// happens to exist locally. Render sets NODE_ENV=production (render.yaml does
// it explicitly), which is what switches the frontend to the built bundle.
const isProduction = process.env.NODE_ENV === 'production';

const DIST_DIR = path.join(__dirname, 'dist');
const INDEX_HTML = path.join(DIST_DIR, 'index.html');

// Render (and every other PaaS) terminates TLS and forwards the request, so
// without this `req.ip` is the proxy's address for every visitor and the login
// rate limiter would lock out the whole site after a handful of bad attempts.
app.set('trust proxy', true);
app.disable('x-powered-by');

// Body parsing middleware
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  next();
});

/**
 * GET /api/health
 *
 * Never throws. Reports whether the Supabase environment variables are filled
 * in and whether the database actually answers, which makes "did I paste the
 * keys and run schema.sql yet?" a one-line check instead of a debugging hunt.
 *
 * Deliberately answers 200 even when Supabase is unreachable: the process is
 * healthy, only its database is not, and a failing health check on Render would
 * take the whole deploy down with it.
 */
app.get('/api/health', async (req, res) => {
  const report = await checkSupabaseConnection();
  res.status(200).json({
    success: true,
    mode: isProduction ? 'production' : 'development',
    supabase: report
  });
});

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/students', studentsRouter);
app.use('/api/courses', coursesRouter);
app.use('/api/blog', blogRouter);

// Portfolio Admin API (public portfolio content + protected editing)
app.use('/api/portfolio/auth', portfolioAuthRouter);
app.use('/api/portfolio/profile', portfolioProfileRouter);
app.use('/api/portfolio/socials', portfolioSocialsRouter);
app.use('/api/portfolio/projects', portfolioProjectsRouter);
app.use('/api/portfolio/skills', portfolioSkillsRouter);
app.use('/api/portfolio/blog', portfolioBlogRouter);
app.use('/api/portfolio/messages', portfolioMessagesRouter);
app.use('/api/portfolio', portfolioRouter);

// Unknown /api/* paths must answer with JSON, never with the HTML shell.
app.use('/api', (req, res) => {
  res.status(404).json({ success: false, error: `No API route matches ${req.method} ${req.originalUrl}.` });
});

// Serve static assets for the admin panels (CSS, JS inside public/) without serving index.html
app.use(express.static(path.join(__dirname, 'public'), { index: false, maxAge: '1h' }));

// Admin Panel Routes
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/admin/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/admin/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// Portfolio Admin Panel (kept separate from the legacy /admin panel)
app.get('/portfolio-admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'portfolio-login.html'));
});

app.get('/portfolio-admin/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'portfolio-login.html'));
});

app.get('/portfolio-admin/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'portfolio-dashboard.html'));
});

if (isProduction) {
  if (!fs.existsSync(INDEX_HTML)) {
    console.error('No frontend build found at dist/index.html - run "npm run build" before "npm start".');
  }

  // `npm run build` output. Hashed files under /assets are immutable, HTML is
  // revalidated so a redeploy is picked up on the next load.
  app.use(
    express.static(DIST_DIR, {
      index: false,
      setHeaders(res, filePath) {
        const isHtml = filePath.endsWith('.html');
        res.setHeader('Cache-Control', isHtml ? 'no-cache' : 'public, max-age=31536000, immutable');
      }
    })
  );

  // SPA fallback: any non-API GET renders the portfolio shell.
  app.get('*', (req, res) => {
    res.setHeader('Cache-Control', 'no-cache');
    res.sendFile(INDEX_HTML);
  });
} else {
  // Dev server handles the portfolio SPA on "/" and other frontend routes
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa'
  });
  app.use(vite.middlewares);
}

/**
 * Last line of defence. A missing Supabase configuration becomes a 503 that
 * names the variables to fill in; anything else becomes a 500 with the detail
 * kept on the server. Nothing here re-throws, so one bad request can never take
 * the process down.
 */
app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);

  if (err instanceof SupabaseNotConfiguredError) {
    console.error('Supabase is not configured:', err.missing.join(', '));
    return res.status(503).json({ success: false, error: err.message });
  }

  console.error('Unhandled error:', err);
  return res.status(500).json({
    success: false,
    error: req.originalUrl.startsWith('/api/')
      ? 'Something went wrong while handling this request.'
      : 'Internal server error.'
  });
});

const server = app.listen(PORT, '0.0.0.0', () => {
  const mode = isProduction ? 'production (built bundle)' : 'development (vite middleware)';
  console.log(`===============================================`);
  console.log(` Server is running on port ${PORT}  [${mode}]`);
  console.log(` Portfolio Website:    http://localhost:${PORT}/`);
  console.log(` Portfolio Admin:      http://localhost:${PORT}/portfolio-admin`);
  console.log(` Legacy Admin:         http://localhost:${PORT}/admin`);
  console.log(` Health check:         http://localhost:${PORT}/api/health`);
  console.log(`===============================================`);
});

// Render sends SIGTERM on every deploy and redeploy; finish in-flight requests
// instead of dropping them mid-response.
for (const signal of ['SIGTERM', 'SIGINT']) {
  process.on(signal, () => {
    console.log(`\n${signal} received, closing server...`);
    server.close(() => process.exit(0));
    setTimeout(() => process.exit(0), 10000).unref();
  });
}

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled promise rejection:', reason);
});

export default app;
