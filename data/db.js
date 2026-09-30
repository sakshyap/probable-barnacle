import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'db.json');

/**
 * Reads data from db.json file
 */
export function readData() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      const initialData = { admin: null, students: [], courses: [], posts: [] };
      fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
      return initialData;
    }
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    if (!parsed.posts) parsed.posts = [];
    return parsed;
  } catch (err) {
    console.error('Error reading db.json:', err);
    return { admin: null, students: [], courses: [], posts: [] };
  }
}

/**
 * Writes data back to db.json file
 */
export function writeData(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing to db.json:', err);
    return false;
  }
}

// ---------------- Admin Data Operations ----------------
export function getAdminUser() {
  const data = readData();
  return data.admin;
}

export function updateAdminPassword(newHash) {
  const data = readData();
  if (data.admin) {
    data.admin.passwordHash = newHash;
    writeData(data);
    return true;
  }
  return false;
}

// ---------------- Students Data Operations ----------------
export function getAllStudents() {
  const data = readData();
  return data.students || [];
}

export function getStudentById(id) {
  const students = getAllStudents();
  return students.find((s) => s.id === id);
}

export function createStudent({ name, email, enrolledCourse }) {
  const data = readData();
  if (!data.students) data.students = [];

  const newStudent = {
    id: `std-${Date.now()}`,
    name: name.trim(),
    email: email.trim().toLowerCase(),
    enrolledCourse: enrolledCourse.trim(),
    createdAt: new Date().toISOString()
  };

  data.students.unshift(newStudent);
  writeData(data);
  return newStudent;
}

export function removeStudent(id) {
  const data = readData();
  if (!data.students) return false;

  const initialLength = data.students.length;
  data.students = data.students.filter((s) => s.id !== id);

  if (data.students.length !== initialLength) {
    writeData(data);
    return true;
  }
  return false;
}

// ---------------- Courses Data Operations ----------------
export function getAllCourses() {
  const data = readData();
  return data.courses || [];
}

export function getCourseById(id) {
  const courses = getAllCourses();
  return courses.find((c) => c.id === id);
}

export function createCourse({ title, seats, active }) {
  const data = readData();
  if (!data.courses) data.courses = [];

  const newCourse = {
    id: `crs-${Date.now()}`,
    title: title.trim(),
    seats: parseInt(seats, 10) || 0,
    active: Boolean(active),
    createdAt: new Date().toISOString()
  };

  data.courses.unshift(newCourse);
  writeData(data);
  return newCourse;
}

export function removeCourse(id) {
  const data = readData();
  if (!data.courses) return false;

  const initialLength = data.courses.length;
  data.courses = data.courses.filter((c) => c.id !== id);

  if (data.courses.length !== initialLength) {
    writeData(data);
    return true;
  }
  return false;
}

// ---------------- Blog Posts Data Operations ----------------
export function getAllPosts() {
  const data = readData();
  return data.posts || [];
}

export function getPostById(id) {
  const posts = getAllPosts();
  return posts.find((p) => p.id === id);
}

export function createPost({ title, author, category, excerpt, content, imageUrl, status }) {
  const data = readData();
  if (!data.posts) data.posts = [];

  const newPost = {
    id: `post-${Date.now()}`,
    title: (title || '').trim(),
    author: (author || '').trim(),
    category: (category || 'Announcements').trim(),
    excerpt: (excerpt || '').trim(),
    content: (content || '').trim(),
    imageUrl: (imageUrl || '').trim(),
    status: status === 'Draft' ? 'Draft' : 'Published',
    createdAt: new Date().toISOString()
  };

  data.posts.unshift(newPost);
  writeData(data);
  return newPost;
}

export function updatePost(id, updateData) {
  const data = readData();
  if (!data.posts) return null;

  const index = data.posts.findIndex((p) => p.id === id);
  if (index === -1) return null;

  const existing = data.posts[index];
  const updatedPost = {
    ...existing,
    ...(updateData.title !== undefined ? { title: updateData.title.trim() } : {}),
    ...(updateData.author !== undefined ? { author: updateData.author.trim() } : {}),
    ...(updateData.category !== undefined ? { category: updateData.category.trim() } : {}),
    ...(updateData.excerpt !== undefined ? { excerpt: updateData.excerpt.trim() } : {}),
    ...(updateData.content !== undefined ? { content: updateData.content.trim() } : {}),
    ...(updateData.imageUrl !== undefined ? { imageUrl: updateData.imageUrl.trim() } : {}),
    ...(updateData.status !== undefined ? { status: updateData.status === 'Draft' ? 'Draft' : 'Published' } : {}),
    updatedAt: new Date().toISOString()
  };

  data.posts[index] = updatedPost;
  writeData(data);
  return updatedPost;
}

export function removePost(id) {
  const data = readData();
  if (!data.posts) return false;

  const initialLength = data.posts.length;
  data.posts = data.posts.filter((p) => p.id !== id);

  if (data.posts.length !== initialLength) {
    writeData(data);
    return true;
  }
  return false;
}

