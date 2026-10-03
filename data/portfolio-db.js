import {
  getSupabase,
  selectAll,
  unwrap,
  toCamelCase,
  toSnakeCase
} from './supabase.js';

// ---------------------------------------------------------------------------
// Row <-> object helpers
// ---------------------------------------------------------------------------

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

function slugify(value, fallback) {
  const slug = toTrimmedString(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return slug || fallback;
}

/**
 * Appends a short suffix instead of failing when the caller-supplied id is
 * already taken, mirroring the behaviour the JSON store had.
 */
async function uniqueId(table, seed) {
  const { data } = await getSupabase()
    .from(table)
    .select('id')
    .eq('id', seed)
    .maybeSingle();
  if (!data) return seed;
  return `${seed}-${Date.now().toString(36)}`;
}

/**
 * Assigns the next free `position` so new rows land at the end of the list
 * unless the payload carries an explicit one.
 */
async function nextPosition(table) {
  const { data } = await getSupabase()
    .from(table)
    .select('position')
    .order('position', { ascending: false })
    .limit(1)
    .maybeSingle();
  return (data?.position ?? -1) + 1;
}

/**
 * Writes an explicit ordering. Ids that are not in the database are ignored,
 * and rows missing from `orderedIds` keep their current position.
 */
async function applyOrder(table, orderedIds) {
  const supabase = getSupabase();
  const ids = orderedIds.filter((id) => typeof id === 'string' && id);

  await Promise.all(
    ids.map((id, index) =>
      supabase.from(table).update({ position: index, updated_at: new Date().toISOString() }).eq('id', id)
    )
  );

  return selectAll(table, '*', { column: 'position', ascending: true });
}

async function removeById(table, id) {
  const supabase = getSupabase();
  const { data: existing } = await supabase.from(table).select('*').eq('id', id).maybeSingle();
  if (!existing) return null;

  const { error } = await supabase.from(table).delete().eq('id', id);
  if (error) throw new Error(`Supabase request failed: ${error.message}`);

  return toCamelCase(existing);
}

// ---------------- Profile ----------------

const EMPTY_PROFILE = {
  name: '',
  title: '',
  shortIntro: '',
  location: '',
  email: '',
  status: '',
  bioParagraph1: '',
  bioParagraph2: '',
  highlights: [],
  stats: []
};

export async function getProfile() {
  const supabase = getSupabase();
  const { data } = await supabase.from('profile').select('*').eq('id', 'main').maybeSingle();

  if (!data) return { ...EMPTY_PROFILE };
  const { id, updatedAt, ...rest } = toCamelCase(data);
  return rest;
}

/**
 * Accepts a partial patch and writes only the keys the caller actually sent,
 * so an admin form that never opens the location field cannot blank it out.
 */
export async function updateProfile(patch) {
  const supabase = getSupabase();
  const payload = toSnakeCase({
    ...patch,
    updated_at: new Date().toISOString()
  });

  const { data, error } = await supabase
    .from('profile')
    .update(payload)
    .eq('id', 'main')
    .select()
    .maybeSingle();

  if (error) throw new Error(`Supabase request failed: ${error.message}`);

  const { id, updatedAt, ...rest } = toCamelCase(data || {});
  return rest;
}

// ---------------- Socials ----------------

export async function getSocials() {
  return selectAll('socials', '*', { column: 'position', ascending: true });
}

export async function createSocial(payload) {
  const supabase = getSupabase();
  const platform = toTrimmedString(payload.platform);
  const position = await nextPosition('socials');

  const { data, error } = await supabase
    .from('socials')
    .insert({
      platform,
      url: toTrimmedString(payload.url),
      icon_name: toTrimmedString(payload.iconName) || 'Mail',
      label: toTrimmedString(payload.label) || platform,
      position
    })
    .select()
    .single();

  if (error) throw new Error(`Supabase request failed: ${error.message}`);
  return toCamelCase(data);
}

export async function updateSocial(platform, payload) {
  const supabase = getSupabase();

  const { data: existing } = await supabase
    .from('socials')
    .select('*')
    .eq('platform', platform)
    .maybeSingle();
  if (!existing) return null;

  const current = toCamelCase(existing);
  const patch = toSnakeCase({
    url: payload.url !== undefined ? toTrimmedString(payload.url) : current.url,
    iconName: payload.iconName !== undefined ? toTrimmedString(payload.iconName) : current.iconName,
    label: payload.label !== undefined ? toTrimmedString(payload.label) : current.label,
    updated_at: new Date().toISOString()
  });

  const { data, error } = await supabase
    .from('socials')
    .update(patch)
    .eq('platform', platform)
    .select()
    .single();

  if (error) throw new Error(`Supabase request failed: ${error.message}`);
  return toCamelCase(data);
}

export async function removeSocial(platform) {
  const supabase = getSupabase();
  const { data: existing } = await supabase
    .from('socials')
    .select('*')
    .eq('platform', platform)
    .maybeSingle();
  if (!existing) return null;

  const { error } = await supabase.from('socials').delete().eq('platform', platform);
  if (error) throw new Error(`Supabase request failed: ${error.message}`);

  return toCamelCase(existing);
}

// ---------------- Nav items ----------------

export async function getNavItems() {
  return selectAll('nav_items', '*', { column: 'position', ascending: true });
}

export async function createNavItem(payload) {
  const supabase = getSupabase();
  const label = toTrimmedString(payload.label);
  const seed = toTrimmedString(payload.id) || slugify(label, `nav-${Date.now().toString(36)}`);
  const position = await nextPosition('nav_items');

  const { data, error } = await supabase
    .from('nav_items')
    .insert({
      id: await uniqueId('nav_items', seed),
      label,
      href: toTrimmedString(payload.href) || '#',
      position
    })
    .select()
    .single();

  if (error) throw new Error(`Supabase request failed: ${error.message}`);
  return toCamelCase(data);
}

export async function updateNavItem(id, payload) {
  const supabase = getSupabase();

  const { data: existing } = await supabase.from('nav_items').select('*').eq('id', id).maybeSingle();
  if (!existing) return null;

  const current = toCamelCase(existing);
  const patch = toSnakeCase({
    label: payload.label !== undefined ? toTrimmedString(payload.label) : current.label,
    href: payload.href !== undefined ? toTrimmedString(payload.href) : current.href,
    updated_at: new Date().toISOString()
  });

  const { data, error } = await supabase
    .from('nav_items')
    .update(patch)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(`Supabase request failed: ${error.message}`);
  return toCamelCase(data);
}

export async function removeNavItem(id) {
  return removeById('nav_items', id);
}

// ---------------- Skill categories ----------------

export async function getSkillCategories() {
  return selectAll('skill_categories', '*', { column: 'position', ascending: true });
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

export async function createSkillCategory(payload) {
  const supabase = getSupabase();
  const seed =
    toTrimmedString(payload.id) ||
    slugify(payload.title, `skills-${Date.now().toString(36)}`);

  const { data, error } = await supabase
    .from('skill_categories')
    .insert({
      id: await uniqueId('skill_categories', seed),
      title: toTrimmedString(payload.title),
      subtitle: toTrimmedString(payload.subtitle),
      icon: toTrimmedString(payload.icon) || 'Sparkles',
      accent_color: toTrimmedString(payload.accentColor) || 'purple',
      items: normalizeSkillItems(payload.items),
      position: await nextPosition('skill_categories')
    })
    .select()
    .single();

  if (error) throw new Error(`Supabase request failed: ${error.message}`);
  return toCamelCase(data);
}

export async function updateSkillCategory(id, payload) {
  const supabase = getSupabase();

  const { data: existing } = await supabase
    .from('skill_categories')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (!existing) return null;

  const current = toCamelCase(existing);
  const patch = toSnakeCase({
    title: payload.title !== undefined ? toTrimmedString(payload.title) : current.title,
    subtitle: payload.subtitle !== undefined ? toTrimmedString(payload.subtitle) : current.subtitle,
    icon: payload.icon !== undefined ? toTrimmedString(payload.icon) : current.icon,
    accentColor:
      payload.accentColor !== undefined ? toTrimmedString(payload.accentColor) : current.accentColor,
    items: payload.items !== undefined ? normalizeSkillItems(payload.items) : current.items,
    updated_at: new Date().toISOString()
  });

  const { data, error } = await supabase
    .from('skill_categories')
    .update(patch)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(`Supabase request failed: ${error.message}`);
  return toCamelCase(data);
}

export async function removeSkillCategory(id) {
  return removeById('skill_categories', id);
}

export async function reorderSkillCategories(orderedIds) {
  return applyOrder('skill_categories', orderedIds);
}

// ---------------- Projects ----------------

export async function getProjects() {
  return selectAll('projects', '*', { column: 'position', ascending: true });
}

export async function getProjectById(id) {
  const { data } = await getSupabase().from('projects').select('*').eq('id', id).maybeSingle();
  return data ? toCamelCase(data) : null;
}

export async function createProject(payload) {
  const supabase = getSupabase();
  const seed =
    toTrimmedString(payload.id) ||
    slugify(payload.title, `project-${Date.now().toString(36)}`);

  const { data, error } = await supabase
    .from('projects')
    .insert({
      id: await uniqueId('projects', seed),
      title: toTrimmedString(payload.title),
      badge: toTrimmedString(payload.badge),
      tagline: toTrimmedString(payload.tagline),
      description: toTrimmedString(payload.description),
      long_description: toTrimmedString(payload.longDescription),
      tech_stack: toStringArray(payload.techStack),
      features: toStringArray(payload.features),
      category: toTrimmedString(payload.category) || 'Website Development',
      github_url: toTrimmedString(payload.githubUrl),
      live_url: toTrimmedString(payload.liveUrl),
      thumbnail_gradient:
        toTrimmedString(payload.thumbnailGradient) ||
        'from-violet-900/60 via-indigo-900/40 to-slate-900/80',
      preview_type: toTrimmedString(payload.previewType) || 'school',
      image_url: toTrimmedString(payload.imageUrl),
      position: await nextPosition('projects')
    })
    .select()
    .single();

  if (error) throw new Error(`Supabase request failed: ${error.message}`);
  return toCamelCase(data);
}

export async function updateProject(id, payload) {
  const supabase = getSupabase();

  const { data: existing } = await supabase.from('projects').select('*').eq('id', id).maybeSingle();
  if (!existing) return null;

  const current = toCamelCase(existing);
  const patch = toSnakeCase({
    title: payload.title !== undefined ? toTrimmedString(payload.title) : current.title,
    badge: payload.badge !== undefined ? toTrimmedString(payload.badge) : current.badge,
    tagline: payload.tagline !== undefined ? toTrimmedString(payload.tagline) : current.tagline,
    description:
      payload.description !== undefined ? toTrimmedString(payload.description) : current.description,
    longDescription:
      payload.longDescription !== undefined
        ? toTrimmedString(payload.longDescription)
        : current.longDescription,
    techStack:
      payload.techStack !== undefined ? toStringArray(payload.techStack) : current.techStack,
    features: payload.features !== undefined ? toStringArray(payload.features) : current.features,
    category: payload.category !== undefined ? toTrimmedString(payload.category) : current.category,
    githubUrl:
      payload.githubUrl !== undefined ? toTrimmedString(payload.githubUrl) : current.githubUrl,
    liveUrl: payload.liveUrl !== undefined ? toTrimmedString(payload.liveUrl) : current.liveUrl,
    thumbnailGradient:
      payload.thumbnailGradient !== undefined
        ? toTrimmedString(payload.thumbnailGradient)
        : current.thumbnailGradient,
    previewType:
      payload.previewType !== undefined ? toTrimmedString(payload.previewType) : current.previewType,
    imageUrl: payload.imageUrl !== undefined ? toTrimmedString(payload.imageUrl) : current.imageUrl,
    updated_at: new Date().toISOString()
  });

  const { data, error } = await supabase
    .from('projects')
    .update(patch)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(`Supabase request failed: ${error.message}`);
  return toCamelCase(data);
}

export async function removeProject(id) {
  return removeById('projects', id);
}

export async function reorderProjects(orderedIds) {
  return applyOrder('projects', orderedIds);
}

// ---------------- Blog posts ----------------

export async function getPosts({ includeDrafts = true } = {}) {
  const supabase = getSupabase();

  let query = supabase.from('portfolio_posts').select('*').order('created_at', { ascending: false });
  if (!includeDrafts) query = query.eq('status', 'Published');

  const rows = await unwrap(query);
  return (rows || []).map(toCamelCase);
}

export async function getPostById(id) {
  const { data } = await getSupabase()
    .from('portfolio_posts')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  return data ? toCamelCase(data) : null;
}

export async function createPost(payload) {
  const supabase = getSupabase();
  const seed = toTrimmedString(payload.id) || `post-${Date.now()}`;

  const { data, error } = await supabase
    .from('portfolio_posts')
    .insert({
      id: await uniqueId('portfolio_posts', seed),
      title: toTrimmedString(payload.title),
      author: toTrimmedString(payload.author),
      category: toTrimmedString(payload.category) || 'Announcements',
      excerpt: toTrimmedString(payload.excerpt),
      content: toTrimmedString(payload.content),
      image_url: toTrimmedString(payload.imageUrl),
      status: toTrimmedString(payload.status) === 'Draft' ? 'Draft' : 'Published',
      created_at: new Date().toISOString()
    })
    .select()
    .single();

  if (error) throw new Error(`Supabase request failed: ${error.message}`);
  return toCamelCase(data);
}

export async function updatePost(id, payload) {
  const supabase = getSupabase();

  const { data: existing } = await supabase
    .from('portfolio_posts')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (!existing) return null;

  const current = toCamelCase(existing);
  const patch = toSnakeCase({
    title: payload.title !== undefined ? toTrimmedString(payload.title) : current.title,
    author: payload.author !== undefined ? toTrimmedString(payload.author) : current.author,
    category: payload.category !== undefined ? toTrimmedString(payload.category) : current.category,
    excerpt: payload.excerpt !== undefined ? toTrimmedString(payload.excerpt) : current.excerpt,
    content: payload.content !== undefined ? toTrimmedString(payload.content) : current.content,
    imageUrl: payload.imageUrl !== undefined ? toTrimmedString(payload.imageUrl) : current.imageUrl,
    status:
      payload.status !== undefined
        ? toTrimmedString(payload.status) === 'Draft'
          ? 'Draft'
          : 'Published'
        : current.status,
    updated_at: new Date().toISOString()
  });

  const { data, error } = await supabase
    .from('portfolio_posts')
    .update(patch)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(`Supabase request failed: ${error.message}`);
  return toCamelCase(data);
}

export async function removePost(id) {
  return removeById('portfolio_posts', id);
}

// ---------------- Contact messages ----------------

export async function getMessages() {
  const rows = await unwrap(
    getSupabase().from('messages').select('*').order('created_at', { ascending: false })
  );
  return (rows || []).map(toCamelCase);
}

export async function createMessage(payload) {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from('messages')
    .insert({
      id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: toTrimmedString(payload.name),
      email: toTrimmedString(payload.email).toLowerCase(),
      subject: toTrimmedString(payload.subject),
      message: toTrimmedString(payload.message),
      read: false,
      created_at: new Date().toISOString()
    })
    .select()
    .single();

  if (error) throw new Error(`Supabase request failed: ${error.message}`);
  return toCamelCase(data);
}

export async function markMessageRead(id, read = true) {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from('messages')
    .update({ read: Boolean(read) })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    // A missing row surfaces as PGRST116 rather than an empty result.
    if (error.code === 'PGRST116') return null;
    throw new Error(`Supabase request failed: ${error.message}`);
  }

  return toCamelCase(data);
}

export async function removeMessage(id) {
  return removeById('messages', id);
}

// ---------------- Aggregate ----------------

/**
 * Everything the public portfolio renders, in one round trip's worth of
 * parallel queries. Drafts are excluded.
 */
export async function getPublicContent() {
  const [profile, socials, navItems, skillCategories, projects, publishedPosts] = await Promise.all([
    getProfile(),
    getSocials(),
    getNavItems(),
    getSkillCategories(),
    getProjects(),
    getPosts({ includeDrafts: false })
  ]);

  return {
    profile,
    socials,
    navItems,
    skillCategories,
    projects,
    posts: publishedPosts
  };
}