# Student & Course Admin Portal

A complete, production-ready Admin Panel built with a **Node.js + Express** backend and **vanilla HTML/CSS/JavaScript** frontend (no heavy frontend frameworks required).

---

## 🚀 Features

- **🔐 Robust Authentication:**
  - Login page at `/admin`
  - Password hashing with `bcryptjs`
  - Stateless JSON Web Tokens (`jsonwebtoken`), expiring in 8 hours
  - Route guard middleware verifying JWT for all protected admin API endpoints
  - Automatic redirect to `/admin` if unauthorized or expired

- **📊 Interactive Dashboard:**
  - Dedicated view at `/admin/dashboard`
  - Dark sidebar navigation with active indicators
  - Metrics cards (Total Students, Total Courses, Active Courses, Total Capacity Seats)
  - One-click logout that clears authentication state and redirects to `/admin`

- **🎓 Student Management:**
  - View all enrolled students in a styled table with course and registration date
  - Instant client-side search by student name, email, or course
  - Modal form to enroll new students with dynamic course dropdown
  - Row deletion with safety confirmation dialog
  - Protected API: `GET /api/students`, `POST /api/students`, `DELETE /api/students/:id`

- **📚 Course Management:**
  - Course catalog table displaying title, seats capacity, and status badges (Active/Inactive)
  - Search filter by course title
  - Modal form to create new courses with customizable capacity and status
  - Row deletion with confirmation dialog
  - Protected API: `GET /api/courses`, `POST /api/courses`, `DELETE /api/courses/:id`

- **💾 File-Based Data Persistence (`data/db.json`):**
  - Stored locally in JSON format with zero database setup required
  - Modular data access layer (`data/db.js`) designed for trivial swapping to MongoDB or MySQL

- **🎨 Modern, Professional UI:**
  - Dark theme sidebar (`#0f172a`, `#1e293b`)
  - Crisp, modern white content area with rounded cards and subtle drop shadows
  - Fully responsive layout with mobile drawer menu
  - Real-time toast notifications for user actions

---

## 📁 Directory Structure

```text
├── .env                     # Local environment variables (PORT, JWT_SECRET)
├── .env.example             # Template for environment configuration
├── package.json             # NPM package scripts and dependencies
├── server.js                # Express application entry point & static server
├── data/
│   ├── db.json              # Local JSON data store (Admin, Students, Courses)
│   └── db.js                # Data abstraction layer (CRUD helper functions)
├── middleware/
│   └── auth.js              # JWT verification middleware for protected routes
├── routes/
│   ├── auth.js              # Authentication endpoints (/api/auth/login, etc.)
│   ├── students.js          # Student CRUD endpoints (/api/students)
│   └── courses.js           # Course CRUD endpoints (/api/courses)
├── scripts/
│   └── hashPassword.js      # CLI tool to generate bcrypt password hashes
└── public/
    ├── login.html           # Admin login interface (/admin)
    ├── dashboard.html       # Admin dashboard interface (/admin/dashboard)
    ├── css/
    │   └── style.css        # Professional responsive CSS styling
    └── js/
        ├── auth.js          # Login client script & JWT handler
        └── dashboard.js     # Dashboard state, CRUD operations & modals
```

---

## 🛠️ Installation & Setup

### 1. Prerequisites
- **Node.js** (v18.0.0 or higher recommended)
- **npm** (comes bundled with Node.js)

### 2. Clone / Download & Install Dependencies
Open your terminal in the project directory and run:

```bash
npm install
```

### 3. Configure Environment Variables
Copy the example environment file:

```bash
cp .env.example .env
```

Open `.env` and verify or customize the variables:

```env
PORT=3000
JWT_SECRET=supersecret_admin_jwt_key_2026_change_in_production
```

### 4. Default Admin Credentials
The database comes pre-seeded with an initial administrator:
- **Email:** `admin@example.com`
- **Password:** `admin123`

---

## 🔑 Generate New Password Hash (Optional)

To generate a new bcrypt password hash for a different password, use the included helper script:

```bash
# Print hash to terminal:
node scripts/hashPassword.js "myNewPassword"

# Automatically update admin password in data/db.json:
node scripts/hashPassword.js "myNewPassword" --save
```

---

## ▶️ Running the Application

### Start Production Server:
```bash
npm start
```

### Start Development Server:
```bash
npm run dev
```

The server will start on port `3000` (or the port defined in your `.env` file).

- **Login Page:** [http://localhost:3000/admin](http://localhost:3000/admin)
- **Dashboard:** [http://localhost:3000/admin/dashboard](http://localhost:3000/admin/dashboard)
- Any visit to root `http://localhost:3000/` automatically redirects to `/admin`.

---

## 📡 API Endpoints Reference

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Public | Authenticates admin credentials, returns 8h JWT |
| `GET` | `/api/auth/me` | Protected | Returns profile of current logged-in admin |
| `POST` | `/api/auth/logout` | Protected | Acknowledges session sign out |
| `GET` | `/api/students` | Protected | Returns all students |
| `POST` | `/api/students` | Protected | Adds new student `{ name, email, enrolledCourse }` |
| `DELETE` | `/api/students/:id` | Protected | Deletes student by ID |
| `GET` | `/api/courses` | Protected | Returns all courses |
| `POST` | `/api/courses` | Protected | Adds new course `{ title, seats, active }` |
| `DELETE` | `/api/courses/:id` | Protected | Deletes course by ID |

---

## 🔄 Migrating from JSON to MongoDB / MySQL

The project uses a clean repository pattern in `data/db.js`. To migrate to a real database:
1. Keep the exported functions in `data/db.js` (`getAllStudents`, `createStudent`, `removeStudent`, etc.) with identical signatures.
2. Replace the `fs.readFileSync` / `fs.writeFileSync` logic inside `data/db.js` with your Mongoose model calls (`StudentModel.find()`) or MySQL query calls (`pool.query('SELECT ...')`).
3. No route or controller changes are needed!
