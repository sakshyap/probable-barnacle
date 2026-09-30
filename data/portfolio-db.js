import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'portfolio-db.json');

const COLLECTIONS = [
  'socials',
  'navItems',
  'skillCategories',
  'projects',
  'posts',
  'messages'
];

function emptyData() {
  return {
    admin: null,
    profile: {},
    socials: [],
    navItems: [],
    skillCategories: [],
    projects: [],
    posts: [],
    messages: []
  };
}

/**
 * Reads the portfolio store, backfilling any collection added in a later version
 * so a partially written file never crashes a request.
 */
export function readPortfolioData() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      const initial = emptyData();
      fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf-8');
      return initial;
    }

    const parsed = JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
    const data = { ...emptyData(), ...parsed };

    for (const key of COLLECTIONS) {
      if (!Array.isArray(data[key])) data[key] = [];
    }
    if (!data.profile || typeof data.profile !== 'object') data.profile = {};

    return data;
  } catch (err) {
    console.error('Error reading portfolio-db.json:', err);
    return emptyData();
  }
}

export function writePortfolioData(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing portfolio-db.json:', err);
    return false;
  }
}

function toTrimmedString(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function toStringArray(value) {
  if (Array.isArray(value)) {
    return value.map(toTrimmedString).filter(Boolean);
  }
  if (typeof value === 'string' && value.trim()) {
    return value
      .split(',')
      .map((part) => part.trim())
      .filter(Boolean);
  }
  return [];
}

// ---------------- Admin ----------------

export function getPortfolioAdmin() {
  return readPortfolioData().admin;
}

export function updatePortfolioAdmin(fields) {
  const data = readPortfolioData();
  if (!data.admin) return null;
  data.admin = { ...data.admin, ...fields, updatedAt: new Date().toISOString() };
  writePortfolioData(data);
  return data.admin;
}

// ---------------- Profile ----------------

export function getProfile() {
  return readPortfolioData().profile;
}

/**
 * Merges only the keys the caller actually sent, so a partial form
 * never blanks out fields the admin did not open.
 */
export function updateProfile(patch) {
  const data = readPortfolioData();
  data.profile = { ...data.profile, ...patch, updatedAt: new Date().toISOString() };
  writePortfolioData(data);
  return data.profile;
}

// ---------------- Generic collection helpers ----------------

function findIndexById(list, id) {
  return list.findIndex((item) => item.id === id);
}

function removeFromCollection(collection, id) {
  const data = readPortfolioData();
  const list = data[collection];
  if (!Array.isArray(list)) return null;

  const index = findIndexById(list, id);
  if (index === -1) return null;

  const [removed] = list.splice(index, 1);
  writePortfolioData(data);
  return removed;
}

function replaceCollection(collection, nextList) {
  const data = readPortfolioData();
  data[collection] = nextList;
  writePortfolioData(data);
  return nextList;
}

function slugify(value, fallback) {
  const slug = toTrimmedString(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return slug || fallback;
}

function uniqueId(collection, seed) {
  const data = readPortfolioData();
  const list = data[collection] || [];
  if (!list.some((item) => item.id === seed)) return seed;
  return `${seed}-${Date.now().toString(36)}`;
}

// ---------------- Socials ----------------

export function getSocials() {
  return readPortfolioData().socials;
}

export function createSocial(payload) {
  const data = readPortfolioData();
  const social = {
    platform: toTrimmedString(payload.platform),
    url: toTrimmedString(payload.url),
    iconName: toTrimmedString(payload.iconName) || 'Mail',
    label: toTrimmedString(payload.label) || toTrimmedString(payload.platform)
  };
  data.socials.push(social);
  writePortfolioData(data);
  return social;
}

export function updateSocial(platform, payload) {
  const data = readPortfolioData();
  const index = findIndexById(data.socials, platform);
  if (index === -1) return null;
  data.socials[index] = {
    ...data.socials[index],
    platform: toTrimmedString(payload.platform) || data.socials[index].platform,
    url: payload.url !== undefined ? toTrimmedString(payload.url) : data.socials[index].url,
    iconName: payload.iconName !== undefined ? toTrimmedString(payload.iconName) : data.socials[index].iconName,
    label: payload.label !== undefined ? toTrimmedString(payload.label) : data.socials[index].label
  };
  writePortfolioData(data);
  return data.socials[index];
}

export function removeSocial(platform) {
  return removeFromCollection('socials', platform);
}

// ---------------- Nav items ----------------

export function getNavItems() {
  return readPortfolioData().navItems;
}

export function createNavItem(payload) {
  const data = readPortfolioData();
  const label = toTrimmedString(payload.label);
  const item = {
    id: toTrimmedString(payload.id) || slugify(label, `nav-${Date.now().toString(36)}`),
    label,
    href: toTrimmedString(payload.href) || '#'
  };
  data.navItems.push(item);
  writePortfolioData(data);
  return item;
}

export function updateNavItem(id, payload) {
  const data = readPortfolioData();
  const index = findIndexById(data.navItems, id);
  if (index === -1) return null;
  data.navItems[index] = {
    ...data.navItems[index],
    label: payload.label !== undefined ? toTrimmedString(payload.label) : data.navItems[index].label,
    href: payload.href !== undefined ? toTrimmedString(payload.href) : data.navItems[index].href
  };
  writePortfolioData(data);
  return data.navItems[index];
}

export function removeNavItem(id) {
  return removeFromCollection('navItems', id);
}

// ---------------- Skill categories ----------------

export function getSkillCategories() {
  return readPortfolioData().skillCategories;
}

function normalizeSkillItems(rawItems) {
  if (!Array.isArray(rawItems)) return [];
  return rawItems
    .filter((item) => item && toTrimmedString(item.name))
    .map((item) => ({
      name: toTrimmedString(item.name),
      iconName: toTrimmedString(item.iconName) || 'Sparkles',
      description: toTrimmedString(item.description),
      badge: toTrimmedString(item.badge),
      tags: toStringArray(item.tags),
      level: toTrimmedString(item.level)
    }));
}

function normalizeSkillCategory(payload, existing = {}) {
  return {
    id: toTrimmedString(payload.id) || toTrimmedString(existing.id) || slugify(payload.title, `skills-${Date.now().toString(36)}`),
    title: toTrimmedString(payload.title) ?? toTrimmedString(existing.title),
    subtitle: toTrimmedString(payload.subtitle) ?? toTrimmedString(existing.subtitle),
    icon: toTrimmedString(payload.icon) || toTrimmedString(existing.icon) || 'Sparkles',
    accentColor: toTrimmedString(payload.accentColor) || toTrimmedString(existing.accentColor) || 'purple',
    items: payload.items !== undefined ? normalizeSkillItems(payload.items) : existing.items || []
  };
}

export function createSkillCategory(payload) {
  const data = readPortfolioData();
  const category = normalizeSkillCategory(payload);
  category.id = uniqueId('skillCategories', category.id);
  data.skillCategories.push(category);
  writePortfolioData(data);
  return category;
}

export function updateSkillCategory(id, payload) {
  const data = readPortfolioData();
  const index = findIndexById(data.skillCategories, id);
  if (index === -1) return null;
  const category = normalizeSkillCategory(payload, data.skillCategories[index]);
  category.id = id;
  data.skillCategories[index] = category;
  writePortfolioData(data);
  return category;
}

export function removeSkillCategory(id) {
  return removeFromCollection('skillCategories', id);
}

export function reorderSkillCategories(orderedIds) {
  const data = readPortfolioData();
  const byId = new Map(data.skillCategories.map((item) => [item.id, item]));
  const ordered = [];
  for (const id of orderedIds) {
    if (byId.has(id)) {
      ordered.push(byId.get(id));
      byId.delete(id);
    }
  }
  return replaceCollection('skillCategories', [...ordered, ...byId.values()]);
}

// ---------------- Projects ----------------

export function getProjects() {
  return readPortfolioData().projects;
}

export function getProjectById(id) {
  return getProjects().find((project) => project.id === id) || null;
}

function normalizeProject(payload, existing = {}) {
  return {
    id: toTrimmedString(payload.id) || toTrimmedString(existing.id) || slugify(payload.title, `project-${Date.now().toString(36)}`),
    title: toTrimmedString(payload.title) ?? toTrimmedString(existing.title),
    badge: toTrimmedString(payload.badge) ?? toTrimmedString(existing.badge),
    tagline: toTrimmedString(payload.tagline) ?? toTrimmedString(existing.tagline),
    description: toTrimmedString(payload.description) ?? toTrimmedString(existing.description),
    longDescription: toTrimmedString(payload.longDescription) ?? toTrimmedString(existing.longDescription),
    techStack: toStringArray(payload.techStack ?? existing.techStack),
    features: toStringArray(payload.features ?? existing.features),
    category: toTrimmedString(payload.category) || toTrimmedString(existing.category) || 'Website Development',
    githubUrl: toTrimmedString(payload.githubUrl ?? existing.githubUrl),
    liveUrl: toTrimmedString(payload.liveUrl ?? existing.liveUrl),
    thumbnailGradient:
      toTrimmedString(payload.thumbnailGradient ?? existing.thumbnailGradient) ||
      'from-violet-900/60 via-indigo-900/40 to-slate-900/80',
    previewType: toTrimmedString(payload.previewType ?? existing.previewType) || 'school',
    imageUrl: toTrimmedString(payload.imageUrl ?? existing.imageUrl)
  };
}

export function createProject(payload) {
  const data = readPortfolioData();
  const project = normalizeProject(payload);
  project.id = uniqueId('projects', project.id);
  data.projects.push(project);
  writePortfolioData(data);
  return project;
}

export function updateProject(id, payload) {
  const data = readPortfolioData();
  const index = findIndexById(data.projects, id);
  if (index === -1) return null;
  const project = normalizeProject(payload, data.projects[index]);
  project.id = id;
  data.projects[index] = project;
  writePortfolioData(data);
  return project;
}

export function removeProject(id) {
  return removeFromCollection('projects', id);
}

export function reorderProjects(orderedIds) {
  const data = readPortfolioData();
  const byId = new Map(data.projects.map((item) => [item.id, item]));
  const ordered = [];
  for (const id of orderedIds) {
    if (byId.has(id)) {
      ordered.push(byId.get(id));
      byId.delete(id);
    }
  }
  return replaceCollection('projects', [...ordered, ...byId.values()]);
}

// ---------------- Blog posts ----------------

export function getPosts({ includeDrafts = true } = {}) {
  const posts = readPortfolioData().posts;
  return includeDrafts ? posts : posts.filter((post) => post.status === 'Published');
}

export function getPostById(id) {
  return getPosts().find((post) => post.id === id) || null;
}

function normalizePost(payload, existing = {}) {
  return {
    id: toTrimmedString(payload.id) || toTrimmedString(existing.id) || `post-${Date.now()}`,
    title: toTrimmedString(payload.title) ?? toTrimmedString(existing.title),
    author: toTrimmedString(payload.author) ?? toTrimmedString(existing.author),
    category: toTrimmedString(payload.category) || toTrimmedString(existing.category) || 'Announcements',
    excerpt: toTrimmedString(payload.excerpt ?? existing.excerpt),
    content: toTrimmedString(payload.content ?? existing.content),
    imageUrl: toTrimmedString(payload.imageUrl ?? existing.imageUrl),
    status: (toTrimmedString(payload.status ?? existing.status) === 'Draft' ? 'Draft' : 'Published')
  };
}

export function createPost(payload) {
  const data = readPortfolioData();
  const post = {
    ...normalizePost(payload),
    id: uniqueId('posts', toTrimmedString(payload.id) || `post-${Date.now()}`),
    createdAt: new Date().toISOString()
  };
  data.posts.unshift(post);
  writePortfolioData(data);
  return post;
}

export function updatePost(id, payload) {
  const data = readPortfolioData();
  const index = findIndexById(data.posts, id);
  if (index === -1) return null;
  data.posts[index] = {
    ...normalizePost(payload, data.posts[index]),
    id,
    createdAt: data.posts[index].createdAt,
    updatedAt: new Date().toISOString()
  };
  writePortfolioData(data);
  return data.posts[index];
}

export function removePost(id) {
  return removeFromCollection('posts', id);
}

// ---------------- Contact messages ----------------

export function getMessages() {
  return readPortfolioData().messages;
}

export function createMessage(payload) {
  const data = readPortfolioData();
  const message = {
    id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name: toTrimmedString(payload.name),
    email: toTrimmedString(payload.email).toLowerCase(),
    subject: toTrimmedString(payload.subject),
    message: toTrimmedString(payload.message),
    read: false,
    createdAt: new Date().toISOString()
  };
  data.messages.unshift(message);
  writePortfolioData(data);
  return message;
}

export function markMessageRead(id, read = true) {
  const data = readPortfolioData();
  const index = findIndexById(data.messages, id);
  if (index === -1) return null;
  data.messages[index] = { ...data.messages[index], read: Boolean(read) };
  writePortfolioData(data);
  return data.messages[index];
}

export function removeMessage(id) {
  return removeFromCollection('messages', id);
}

// ---------------- Aggregate ----------------

/**
 * Everything the public portfolio needs, drafts excluded.
 */
export function getPublicContent() {
  const data = readPortfolioData();
  return {
    profile: data.profile,
    socials: data.socials,
    navItems: data.navItems,
    skillCategories: data.skillCategories,
    projects: data.projects,
    posts: data.posts.filter((post) => post.status === 'Published')
  };
}
