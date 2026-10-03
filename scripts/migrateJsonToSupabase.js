/**
 * One-time migration of the old local JSON data into Supabase.
 *
 *   data/portfolio-db.json  ->  profile, socials, nav_items, skill_categories,
 *                              projects, portfolio_posts, messages
 *   data/db.json            ->  students, courses, admin_posts
 *
 * The JSON files are left untouched, so this can be re-run safely: every table
 * is upserted on its primary key and a row is never duplicated. Pass --fresh
 * to delete the existing rows of the migrated tables first.
 *
 * Usage:
 *   npm run migrate
 *   npm run migrate -- --dry-run     # show the plan, write nothing
 *   npm run migrate -- --fresh       # wipe the target tables, then import
 *   npm run migrate -- --only=portfolio   # or --only=students
 *
 * Note: the two JSON files both contain a "posts" array. They are NOT the same
 * data - portfolio-db.json posts go to portfolio_posts (the public blog) and
 * db.json posts go to admin_posts (the students panel blog). Both keep their own
 * ids so nothing collides.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { getSupabase, checkSupabaseConnection } from '../data/supabase.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.resolve(__dirname, '..', 'data');

dotenv.config({ path: path.resolve(__dirname, '..', '.env'), quiet: true });

const DRY_RUN = process.argv.includes('--dry-run');
const FRESH = process.argv.includes('--fresh');

function readJson(file, fallback) {
  const full = path.join(DATA_DIR, file);
  if (!fs.existsSync(full)) {
    console.warn(`  (skipped ${file} - file not found)`);
    return fallback;
  }
  try {
    return JSON.parse(fs.readFileSync(full, 'utf-8'));
  } catch (err) {
    console.error(`  Could not parse ${file}: ${err.message}`);
    return fallback;
  }
}

const text = (value) => (typeof value === 'string' ? value.trim() : value == null ? '' : String(value).trim());
const asStringArray = (value) => {
  if (Array.isArray(value)) return value.map(text).filter(Boolean);
  if (typeof value === 'string' && value.trim()) {
    return value.split(',').map((part) => part.trim()).filter(Boolean);
  }
  return [];
};
const toInt = (value, fallback = 0) => {
  const parsed = parseInt(value, 10);
  return Number.isNaN(parsed) ? fallback : parsed;
};
const toBool = (value) => value === true || value === 'true' || value === 'on' || value === 1;

/**
 * The shape of the old profile object maps 1:1 onto the `profile` table, which
 * holds a single row with id = 'main'.
 */
function portfolioProfileRows(source = {}) {
  const profile = source.profile || {};
  return [
    {
      id: 'main',
      name: text(profile.name),
      title: text(profile.title),
      short_intro: text(profile.shortIntro),
      location: text(profile.location),
      email: text(profile.email),
      status: text(profile.status),
      bio_paragraph1: text(profile.bioParagraph1),
      bio_paragraph2: text(profile.bioParagraph2),
      highlights: Array.isArray(profile.highlights) ? profile.highlights : [],
      stats: Array.isArray(profile.stats) ? profile.stats : [],
      avatar_url: text(profile.avatarUrl) || null,
      updated_at: text(profile.updatedAt) || new Date().toISOString()
    }
  ];
}

function portfolioSocialRows(source = {}) {
  return (source.socials || []).map((item, index) => ({
    platform: text(item.platform),
    url: text(item.url),
    icon_name: text(item.iconName) || 'Mail',
    label: text(item.label) || text(item.platform),
    position: toInt(item.position, index),
    updated_at: new Date().toISOString()
  }));
}

function portfolioNavRows(source = {}) {
  return (source.navItems || []).map((item, index) => ({
    id: text(item.id) || `nav-${index}`,
    label: text(item.label),
    href: text(item.href) || '#',
    position: toInt(item.position, index),
    updated_at: new Date().toISOString()
  }));
}

function portfolioSkillRows(source = {}) {
  return (source.skillCategories || []).map((item, index) => ({
    id: text(item.id) || `skills-${index}`,
    title: text(item.title),
    subtitle: text(item.subtitle),
    icon: text(item.icon) || 'Sparkles',
    accent_color: text(item.accentColor) || 'purple',
    items: Array.isArray(item.items)
      ? item.items.map((skill) => ({
          name: text(skill.name),
          iconName: text(skill.iconName) || 'Sparkles',
          description: text(skill.description),
          badge: text(skill.badge),
          tags: asStringArray(skill.tags),
          level: text(skill.level)
        }))
      : [],
    position: toInt(item.position, index),
    updated_at: new Date().toISOString()
  }));
}

function portfolioProjectRows(source = {}) {
  return (source.projects || []).map((item, index) => ({
    id: text(item.id) || `project-${index}`,
    title: text(item.title),
    badge: text(item.badge),
    tagline: text(item.tagline),
    description: text(item.description),
    long_description: text(item.longDescription),
    tech_stack: asStringArray(item.techStack),
    features: asStringArray(item.features),
    category: text(item.category) || 'Website Development',
    github_url: text(item.githubUrl),
    live_url: text(item.liveUrl),
    thumbnail_gradient:
      text(item.thumbnailGradient) || 'from-violet-900/60 via-indigo-900/40 to-slate-900/80',
    preview_type: text(item.previewType) || 'school',
    image_url: text(item.imageUrl),
    position: toInt(item.position, index),
    created_at: text(item.createdAt) || new Date().toISOString(),
    updated_at: new Date().toISOString()
  }));
}

function portfolioPostRows(source = {}) {
  return (source.posts || []).map((item, index) => ({
    id: text(item.id) || `post-${index}`,
    title: text(item.title),
    author: text(item.author),
    category: text(item.category) || 'Announcements',
    excerpt: text(item.excerpt),
    content: text(item.content),
    image_url: text(item.imageUrl),
    status: text(item.status) === 'Draft' ? 'Draft' : 'Published',
    created_at: text(item.createdAt) || new Date().toISOString(),
    updated_at: text(item.updatedAt) || new Date().toISOString()
  }));
}

function portfolioMessageRows(source = {}) {
  return (source.messages || []).map((item, index) => ({
    id: text(item.id) || `msg-migration-${index}`,
    name: text(item.name),
    email: text(item.email).toLowerCase(),
    subject: text(item.subject),
    message: text(item.message),
    read: toBool(item.read),
    created_at: text(item.createdAt) || new Date().toISOString()
  }));
}

function studentsRows(source = {}) {
  return (source.students || []).map((item, index) => ({
    id: text(item.id) || `std-${index}`,
    name: text(item.name),
    email: text(item.email).toLowerCase(),
    enrolled_course: text(item.enrolledCourse),
    created_at: text(item.createdAt) || new Date().toISOString()
  }));
}

function coursesRows(source = {}) {
  return (source.courses || []).map((item, index) => ({
    id: text(item.id) || `crs-${index}`,
    title: text(item.title),
    seats: toInt(item.seats, 0),
    active: toBool(item.active),
    created_at: text(item.createdAt) || new Date().toISOString()
  }));
}

function adminPostRows(source = {}) {
  return (source.posts || []).map((item, index) => ({
    id: text(item.id) || `post-${index}`,
    title: text(item.title),
    author: text(item.author),
    category: text(item.category) || 'Announcements',
    excerpt: text(item.excerpt),
    content: text(item.content),
    image_url: text(item.imageUrl),
    status: text(item.status) === 'Draft' ? 'Draft' : 'Published',
    created_at: text(item.createdAt) || new Date().toISOString(),
    updated_at: text(item.updatedAt) || new Date().toISOString()
  }));
}

function tableSpec(name, primaryKey, build) {
  return { name, primaryKey, build };
}

async function main() {
  console.log('Reading the local JSON data store...');
  const portfolioJson = readJson('portfolio-db.json', {});
  const legacyJson = readJson('db.json', {});

  const specs = [
    tableSpec('profile', 'id', () => portfolioProfileRows(portfolioJson)),
    tableSpec('socials', 'platform', () => portfolioSocialRows(portfolioJson)),
    tableSpec('nav_items', 'id', () => portfolioNavRows(portfolioJson)),
    tableSpec('skill_categories', 'id', () => portfolioSkillRows(portfolioJson)),
    tableSpec('projects', 'id', () => portfolioProjectRows(portfolioJson)),
    tableSpec('portfolio_posts', 'id', () => portfolioPostRows(portfolioJson)),
    tableSpec('messages', 'id', () => portfolioMessageRows(portfolioJson)),
    tableSpec('students', 'id', () => studentsRows(legacyJson)),
    tableSpec('courses', 'id', () => coursesRows(legacyJson)),
    tableSpec('admin_posts', 'id', () => adminPostRows(legacyJson))
  ];

  console.log('');
  if (DRY_RUN) {
    console.log('DRY RUN - nothing will be written.');
    for (const spec of specs) {
      const rows = spec.build().filter((row) => row[spec.primaryKey]);
      console.log(`  ${spec.name.padEnd(18)} ${String(rows.length).padStart(3)} row(s)`);
    }
    console.log('');
    console.log('Run without --dry-run to write this data to Supabase.');
    return;
  }

  const health = await checkSupabaseConnection();
  if (!health.configured) {
    console.error(health.message);
    console.error('Add the values to your .env file (see .env.example) and try again.');
    process.exit(1);
  }
  if (!health.reachable) {
    console.error(health.message);
    process.exit(1);
  }

  const supabase = getSupabase();
  let total = 0;

  for (const spec of specs) {
    const rows = spec.build().filter((row) => row[spec.primaryKey]);

    if (!rows.length) {
      console.log(`  ${spec.name.padEnd(18)} skipped (nothing to import)`);
      continue;
    }

    if (FRESH) {
      const { error } = await supabase.from(spec.name).delete().neq(spec.primaryKey, '___never___');
      if (error) {
        console.error(`  ${spec.name}: could not clear the table - ${error.message}`);
        process.exit(1);
      }
    }

    const { data, error } = await supabase
      .from(spec.name)
      .upsert(rows, { onConflict: spec.primaryKey });

    if (error) {
      console.error(`  ${spec.name}: import failed - ${error.message}`);
      process.exit(1);
    }

    const written = Array.isArray(data) ? data.length : rows.length;
    total += written;
    console.log(`  ${spec.name.padEnd(18)} ${String(written).padStart(3)} row(s) imported`);
  }

  console.log('');
  console.log(`✔ Migration complete. ${total} row(s) written to Supabase.`);
  console.log('');
  console.log('The old admin account lived in the JSON files as a bcrypt hash.');
  console.log('Supabase Auth hashes passwords itself, so create the login with:');
  console.log('  npm run seed -- --email you@example.com --password "Your@Passw0rd"');
}

main().catch((err) => {
  console.error('Migration failed:', err.message);
  process.exit(1);
});
