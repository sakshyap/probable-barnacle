import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { app, errorHandler } from './app.js';

/**
 * Long-lived Node host for Render and `npm start`.
 *
 * The API itself lives in app.js so that Vercel's serverless function and this
 * process run identical Express routes. Everything here is about serving files,
 * which only makes sense when one process owns the whole origin - on Vercel the
 * `dist` output directory is served by the platform instead.
 */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;

// Production is opt-in, so `npm run dev` keeps HMR even when a dist/ folder
// happens to exist locally. Render sets NODE_ENV=production (render.yaml does
// it explicitly), which is what switches the frontend to the built bundle.
const isProduction = process.env.NODE_ENV === 'production';

const DIST_DIR = path.join(__dirname, 'dist');
const INDEX_HTML = path.join(DIST_DIR, 'index.html');

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

// Mounted last so it also catches anything thrown by the middleware above.
app.use(errorHandler);

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
