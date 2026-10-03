import { SupabaseNotConfiguredError } from '../data/supabase.js';

/**
 * Single place where a thrown error becomes an HTTP response.
 *
 * Route handlers stay free of status-code bookkeeping and every endpoint
 * behaves the same way:
 *
 *   - Supabase env vars missing  -> 503 + a message naming the variables
 *   - Supabase query failed      -> the handler's own fallback message (500)
 *
 * Nothing is re-thrown, so a broken database degrades the API instead of
 * crashing the process.
 */
export function sendError(res, err, fallbackMessage) {
  if (err instanceof SupabaseNotConfiguredError || err?.code === 'SUPABASE_NOT_CONFIGURED') {
    console.error('Supabase is not configured:', err.message);
    return res.status(503).json({ success: false, error: err.message });
  }

  console.error(fallbackMessage, err);
  return res.status(500).json({ success: false, error: fallbackMessage });
}

/**
 * Wraps an async route handler so a rejected promise reaches `sendError`
 * instead of becoming an unhandled rejection that can take the server down.
 * Handlers that already have their own try/catch do not need it.
 */
export function asyncRoute(handler) {
  return (req, res, next) => {
    Promise.resolve(handler(req, res, next)).catch((err) => {
      if (res.headersSent) return next(err);
      return sendError(res, err, 'Something went wrong while handling this request.');
    });
  };
}
