import { app, errorHandler } from '../app.js';

/**
 * Vercel serverless function for the whole API surface.
 *
 * The catch-all filename is what makes this work: Vercel matches
 * `api/[...path].js` against `/api/<anything>` before it ever considers
 * `vercel.json` rewrites, so `/api/portfolio/blog`, `/api/health` and every
 * other endpoint land here without a per-route function.
 *
 * Only /api/* reaches this function. Vercel serves the built React app from the
 * `dist` output directory itself, so this file deliberately does no static file
 * or SPA handling - that is server.js's job on Render.
 *
 * SUPABASE_SERVICE_ROLE_KEY is read from the function's server-side
 * environment. It is never prefixed with VITE_ and never reaches the browser:
 * app.js only touches it inside getSupabase() in data/supabase.js, and nothing
 * under src/ imports that module.
 */
app.use(errorHandler);

export default function handler(req, res) {
  return app(req, res);
}
