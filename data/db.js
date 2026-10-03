import { getSupabase, unwrap, toCamelCase } from './supabase.js';

// ---------------------------------------------------------------------------
// Students
// ---------------------------------------------------------------------------

export async function getAllStudents() {
  const rows = await unwrap(
    getSupabase().from('students').select('*').order('created_at', { ascending: false })
  );
  return (rows || []).map(toCamelCase);
}

export async function getStudentById(id) {
  const { data } = await getSupabase().from('students').select('*').eq('id', id).maybeSingle();
  return data ? toCamelCase(data) : null;
}

export async function createStudent({ name, email, enrolledCourse }) {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from('students')
    .insert({
      id: `std-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
      name: String(name || '').trim(),
      email: String(email || '').trim().toLowerCase(),
      enrolled_course: String(enrolledCourse || '').trim(),
      created_at: new Date().toISOString()
    })
    .select()
    .single();

  if (error) throw new Error(`Supabase request failed: ${error.message}`);
  return toCamelCase(data);
}

export async function removeStudent(id) {
  const { error } = await getSupabase().from('students').delete().eq('id', id);
  if (error) throw new Error(`Supabase request failed: ${error.message}`);
  return true;
}

// ---------------------------------------------------------------------------
// Courses
// ---------------------------------------------------------------------------

export async function getAllCourses() {
  const rows = await unwrap(
    getSupabase().from('courses').select('*').order('created_at', { ascending: false })
  );
  return (rows || []).map(toCamelCase);
}

export async function getCourseById(id) {
  const { data } = await getSupabase().from('courses').select('*').eq('id', id).maybeSingle();
  return data ? toCamelCase(data) : null;
}

export async function createCourse({ title, seats, active }) {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from('courses')
    .insert({
      id: `crs-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
      title: String(title || '').trim(),
      seats: parseInt(seats, 10) || 0,
      active: Boolean(active),
      created_at: new Date().toISOString()
    })
    .select()
    .single();

  if (error) throw new Error(`Supabase request failed: ${error.message}`);
  return toCamelCase(data);
}

export async function removeCourse(id) {
  const { error } = await getSupabase().from('courses').delete().eq('id', id);
  if (error) throw new Error(`Supabase request failed: ${error.message}`);
  return true;
}

// ---------------------------------------------------------------------------
// Blog posts for the students panel
// ---------------------------------------------------------------------------

function normalizePostPayload(payload, current = {}) {
  const text = (value) => String(value || '').trim();

  return {
    title: payload.title !== undefined ? text(payload.title) : current.title || '',
    author: payload.author !== undefined ? text(payload.author) : current.author || '',
    category:
      payload.category !== undefined ? text(payload.category) : current.category || 'Announcements',
    excerpt: payload.excerpt !== undefined ? text(payload.excerpt) : current.excerpt || '',
    content: payload.content !== undefined ? text(payload.content) : current.content || '',
    image_url:
      payload.imageUrl !== undefined ? text(payload.imageUrl) : current.imageUrl || '',
    status:
      payload.status !== undefined
        ? payload.status === 'Draft'
          ? 'Draft'
          : 'Published'
        : current.status || 'Draft'
  };
}

export async function getAllPosts() {
  const rows = await unwrap(
    getSupabase().from('admin_posts').select('*').order('created_at', { ascending: false })
  );
  return (rows || []).map(toCamelCase);
}

export async function getPostById(id) {
  const { data } = await getSupabase().from('admin_posts').select('*').eq('id', id).maybeSingle();
  return data ? toCamelCase(data) : null;
}

export async function createPost(payload) {
  const supabase = getSupabase();

  const { data, error } = await supabase
    .from('admin_posts')
    .insert({
      id: `post-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
      ...normalizePostPayload(payload),
      created_at: new Date().toISOString()
    })
    .select()
    .single();

  if (error) throw new Error(`Supabase request failed: ${error.message}`);
  return toCamelCase(data);
}

export async function updatePost(id, updateData) {
  const supabase = getSupabase();

  const { data: existing } = await supabase.from('admin_posts').select('*').eq('id', id).maybeSingle();
  if (!existing) return null;

  const { data, error } = await supabase
    .from('admin_posts')
    .update({
      ...normalizePostPayload(updateData, toCamelCase(existing)),
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(`Supabase request failed: ${error.message}`);
  return toCamelCase(data);
}

export async function removePost(id) {
  const { error } = await getSupabase().from('admin_posts').delete().eq('id', id);
  if (error) throw new Error(`Supabase request failed: ${error.message}`);
  return true;
}