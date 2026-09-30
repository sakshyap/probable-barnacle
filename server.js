import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

// Load environment variables from .env
dotenv.config();

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

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

// Serve static assets for the admin panel (CSS, JS inside public/) without serving index.html
app.use(express.static(path.join(__dirname, 'public'), { index: false }));

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

// Vite middleware handles the portfolio SPA on "/" and other frontend routes
const vite = await createViteServer({
  server: { middlewareMode: true },
  appType: 'spa'
});
app.use(vite.middlewares);

// Start Express server on 0.0.0.0 so it binds properly in all environments
app.listen(PORT, '0.0.0.0', () => {
  console.log(`===============================================`);
  console.log(` Server is running on port ${PORT}`);
  console.log(` Portfolio Website:    http://localhost:${PORT}/`);
  console.log(` Portfolio Admin:      http://localhost:${PORT}/portfolio-admin`);
  console.log(` Legacy Admin:         http://localhost:${PORT}/admin`);
  console.log(`===============================================`);
});

export default app;
