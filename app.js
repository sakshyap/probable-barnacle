import express from 'express';
import dotenv from 'dotenv';

// Load environment variables from .env (local dev only - on Vercel the values
// come from the project's Environment Variables and this call is a no-op).
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

/**
 * The API half of the application, with no static file serving and no listener.
 *
 * Kept separate from server.js so exactly the same Express app can be mounted by
 * two very different hosts:
 *
 *   - server.js          Render / `npm start` - a long-lived Node process that
 *                        also serves public/ and dist/.
 *   - api/[...path].js   Vercel - a serverless function that only ever answers
 *                        /api/*, because Vercel serves the built site from the
 *                        `dist` output directory itself.
 *
 * Anything added here runs on every host. Anything that touches the filesystem
 * belongs in server.js instead, since the serverless bundle cannot rely on it.
 */
export const app = express();

// Render (and every other PaaS) terminates TLS and forwards the request, so
// without this `req.ip` is the proxy's address for every visitor and the login
// rate limiter would lock out the whole site after a handful of bad attempts.
// Vercel sets the same forwarding headers, so this is correct for both hosts.
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
 * healthy, only its database is not, and a failing health check would take the
 * whole deploy down with it.
 */
app.get('/api/health', async (req, res) => {
  const report = await checkSupabaseConnection();
  res.status(200).json({
    success: true,
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

/**
 * Last line of defence. A missing Supabase configuration becomes a 503 that
 * names the variables to fill in; anything else becomes a 500 with the detail
 * kept on the server. Nothing here re-throws, so one bad request can never take
 * the process down.
 *
 * Exported rather than registered here so each host can mount it *last* - after
 * its own static/SPA middleware, which is added after this module's routes.
 */
export function errorHandler(err, req, res, next) {
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
}

export default app;
