import {
  api,
  clearToken,
  el,
  clear,
  toast,
  formatDate,
  parseList,
  toListText,
  confirmAction,
  LOGIN_URL
} from './portfolio-common.js';

const state = {
  user: null,
  profile: {},
  projects: [],
  skillCategories: [],
  posts: [],
  socials: [],
  navItems: [],
  messages: []
};

const dom = {
  loading: document.getElementById('pf-loading'),
  shell: document.getElementById('pf-shell'),
  nav: document.getElementById('pf-nav'),
  adminEmail: document.getElementById('pf-admin-email'),
  stats: document.getElementById('pf-stats'),
  projectsBody: document.getElementById('pf-projects-body'),
  postsBody: document.getElementById('pf-posts-body'),
  skillsList: document.getElementById('pf-skills-list'),
  messagesList: document.getElementById('pf-messages-list'),
  socialsBody: document.getElementById('pf-socials-body'),
  navBody: document.getElementById('pf-nav-body'),
  unreadBadge: document.getElementById('pf-unread-badge'),
  profileForm: document.getElementById('pf-profile-form'),
  passwordForm: document.getElementById('pf-password-form'),
  modal: document.getElementById('pf-modal'),
  modalForm: document.getElementById('pf-modal-form'),
  modalBody: document.getElementById('pf-modal-body'),
  modalTitle: document.getElementById('pf-modal-title'),
  modalSave: document.getElementById('pf-modal-save')
};

// =====================================================================
// Boot
// =====================================================================

async function boot() {
  try {
    const me = await api('/api/portfolio/auth/me');
    state.user = me.user;
  } catch (err) {
    // portfolio-common already redirects on 401.
    dom.loading.innerHTML = '';
    dom.loading.append(
      el('p', { text: 'Redirecting to sign in...' }),
      el('a', { class: 'pf-btn pf-btn-ghost pf-btn-sm', href: LOGIN_URL, text: 'Sign in' })
    );
    return;
  }

  dom.adminEmail.textContent = state.user.email || '';
  dom.loading.hidden = true;
  dom.shell.hidden = false;

  await loadAll();
  renderAll();
}

async function loadAll() {
  const [content, posts, messages] = await Promise.all([
    api('/api/portfolio/content?drafts=1'),
    api('/api/portfolio/blog'),
    api('/api/portfolio/messages')
  ]);

  const data = content.data || {};
  state.profile = data.profile || {};
  state.projects = data.projects || [];
  state.skillCategories = data.skillCategories || [];
  state.socials = data.socials || [];
  state.navItems = data.navItems || [];
  state.posts = posts.data || [];
  state.messages = messages.data || [];
}

function renderAll() {
  renderOverview();
  renderProfile();
  renderProjects();
  renderSkills();
  renderPosts();
  renderMessages();
  renderLinks();
}

// =====================================================================
// Navigation
// =====================================================================

dom.nav.addEventListener('click', (event) => {
  const button = event.target.closest('.pf-nav-btn');
  if (!button) return;
  showView(button.dataset.view);
});

function showView(view) {
  for (const btn of dom.nav.querySelectorAll('.pf-nav-btn')) {
    btn.classList.toggle('active', btn.dataset.view === view);
  }
  for (const section of document.querySelectorAll('.pf-view')) {
    section.classList.toggle('active', section.dataset.view === view);
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.getElementById('pf-refresh-all').addEventListener('click', async () => {
  try {
    await loadAll();
    renderAll();
    toast('Dashboard refreshed.');
  } catch (err) {
    toast(err.message, 'error');
  }
});

document.getElementById('pf-logout').addEventListener('click', async () => {
  try {
    await api('/api/portfolio/auth/logout', { method: 'POST', auth: false });
  } catch (err) {
    /* the cookie may already be gone - clearing locally is enough */
  }
  clearToken();
  window.location.replace(LOGIN_URL);
});

// =====================================================================
// Overview
// =====================================================================

function renderOverview() {
  const drafts = state.posts.filter((post) => post.status === 'Draft').length;
  const skillCount = state.skillCategories.reduce((total, cat) => total + (cat.items?.length || 0), 0);
  const unread = state.messages.filter((msg) => !msg.read).length;

  const cards = [
    { value: state.projects.length, label: 'Projects' },
    { value: state.skillCategories.length, label: 'Skill groups' },
    { value: skillCount, label: 'Skills listed' },
    { value: state.posts.length - drafts, label: 'Published posts' },
    { value: drafts, label: 'Drafts' },
    { value: unread, label: 'Unread messages' }
  ];

  clear(dom.stats);
  for (const card of cards) {
    dom.stats.appendChild(
      el('div', { class: 'pf-stat' }, [
        el('div', { class: 'pf-stat-value', text: String(card.value) }),
        el('div', { class: 'pf-stat-label', text: card.label })
      ])
    );
  }

  dom.unreadBadge.hidden = unread === 0;
  dom.unreadBadge.textContent = String(unread);
}

// =====================================================================
// Profile
// =====================================================================

const HIGHLIGHT_FIELDS = ['label', 'value', 'detail'];
const PROFILE_SIMPLE = {
  name: 'pf-p-name',
  title: 'pf-p-title',
  shortIntro: 'pf-p-shortIntro',
  location: 'pf-p-location',
  status: 'pf-p-status',
  email: 'pf-p-email',
  bioParagraph1: 'pf-p-bio1',
  bioParagraph2: 'pf-p-bio2'
};

function renderProfile() {
  for (const [key, id] of Object.entries(PROFILE_SIMPLE)) {
    const input = document.getElementById(id);
    if (input) input.value = state.profile[key] ?? '';
  }

  renderRepeater(
    document.getElementById('pf-highlights'),
    state.profile.highlights || [],
    HIGHLIGHT_FIELDS,
    'Highlight'
  );

  renderRepeater(
    document.getElementById('pf-stats-editor'),
    state.profile.stats || [],
    ['number', 'label'],
    'Stat'
  );
}

/**
 * Generic repeatable editor. Each row keeps a live JS object in `rows` and
 * writes straight back into it on input, so the form always submits the
 * latest values without any extra bookkeeping.
 */
function renderRepeater(container, items, fields, noun) {
  clear(container);
  const rows = items.map((item) => ({ ...item }));

  const commit = () => {
    if (container.id === 'pf-highlights') state.profile.highlights = rows;
    else state.profile.stats = rows;
  };

  const redraw = () => {
    renderRepeater(container, rows, fields, noun);
    commit();
  };

  rows.forEach((row, index) => {
    const inputs = fields.map((field) =>
      el('input', {
        class: 'pf-input',
        value: row[field] ?? '',
        placeholder: field,
        onInput: (event) => {
          row[field] = event.target.value;
          commit();
        }
      })
    );

    const wrap = el('div', { class: `pf-repeat pf-row-${Math.min(fields.length, 3)} pf-row` }, [
      el('div', { class: 'pf-repeat-head' }, [
        el('span', { class: 'pf-repeat-title', text: `${noun} ${index + 1}` }),
        el('button', {
          type: 'button',
          class: 'pf-icon-btn danger',
          title: `Remove ${noun.toLowerCase()}`,
          html: '&times;',
          onClick: () => {
            rows.splice(index, 1);
            redraw();
          }
        })
      ]),
      ...fields.map((field, fieldIndex) =>
        el('div', { class: 'pf-field', style: 'margin-bottom: 0;' }, [
          el('label', { text: field }),
          inputs[fieldIndex]
        ])
      )
    ]);

    container.appendChild(wrap);
  });

  if (rows.length === 0) {
    container.appendChild(
      el('div', { class: 'pf-empty', text: `No ${noun.toLowerCase()}s yet.` })
    );
  }
}

document.getElementById('pf-add-highlight').addEventListener('click', () => {
  state.profile.highlights = [...(state.profile.highlights || []), { label: '', value: '', detail: '' }];
  renderProfile();
});

document.getElementById('pf-add-stat').addEventListener('click', () => {
  state.profile.stats = [...(state.profile.stats || []), { number: '', label: '' }];
  renderProfile();
});

dom.profileForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const saveBtn = document.getElementById('pf-profile-save');
  saveBtn.disabled = true;

  const payload = {};
  for (const [key, id] of Object.entries(PROFILE_SIMPLE)) {
    const input = document.getElementById(id);
    if (input) payload[key] = input.value;
  }
  payload.highlights = state.profile.highlights || [];
  payload.stats = state.profile.stats || [];

  try {
    const result = await api('/api/portfolio/profile', { method: 'PUT', body: payload });
    state.profile = result.data;
    toast('Profile saved.');
    renderOverview();
  } catch (err) {
    toast(err.message, 'error');
  } finally {
    saveBtn.disabled = false;
  }
});

// =====================================================================
// Modal plumbing
// =====================================================================

let onModalSubmit = null;

function openModal({ title, fields, submitLabel = 'Save', onSubmit }) {
  dom.modalTitle.textContent = title;
  dom.modalSave.textContent = submitLabel;
  clear(dom.modalBody);
  onModalSubmit = onSubmit;

  for (const field of fields) {
    dom.modalBody.appendChild(buildField(field));
  }

  dom.modal.classList.add('open');
  document.body.style.overflow = 'hidden';
  dom.modalBody.querySelector('input, textarea, select')?.focus();
}

function closeModal() {
  dom.modal.classList.remove('open');
  document.body.style.overflow = '';
  onModalSubmit = null;
}

function buildField(field) {
  const id = `pf-f-${field.name}`;
  let control;

  if (field.type === 'textarea') {
    control = el('textarea', {
      id,
      name: field.name,
      class: 'pf-textarea',
      placeholder: field.placeholder || '',
      style: field.rows ? `min-height:${field.rows * 22}px` : ''
    });
    control.value = field.value ?? '';
  } else if (field.type === 'select') {
    control = el(
      'select',
      { id, name: field.name, class: 'pf-select' },
      field.options.map((option) => el('option', { value: option, text: option }))
    );
    control.value = field.value ?? field.options[0] ?? '';
  } else {
    control = el('input', {
      id,
      name: field.name,
      class: 'pf-input',
      type: field.type || 'text',
      placeholder: field.placeholder || ''
    });
    control.value = field.value ?? '';
  }

  return el('div', { class: 'pf-field' }, [
    field.label ? el('label', { for: id, text: field.label }) : null,
    control,
    field.hint ? el('p', { class: 'pf-hint', text: field.hint }) : null
  ]);
}

function readModalValues() {
  const data = {};
  for (const input of dom.modalBody.querySelectorAll('[name]')) {
    data[input.name] = input.value;
  }
  return data;
}

dom.modalForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!onModalSubmit) return;

  dom.modalSave.disabled = true;
  const originalLabel = dom.modalSave.textContent;
  dom.modalSave.textContent = 'Saving...';

  try {
    await onModalSubmit(readModalValues());
    closeModal();
  } catch (err) {
    toast(err.message, 'error');
  } finally {
    dom.modalSave.disabled = false;
    dom.modalSave.textContent = originalLabel;
  }
});

document.getElementById('pf-modal-close').addEventListener('click', closeModal);
document.getElementById('pf-modal-cancel').addEventListener('click', closeModal);
dom.modal.addEventListener('click', (event) => {
  if (event.target === dom.modal) closeModal();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && dom.modal.classList.contains('open')) closeModal();
});

// =====================================================================
// Projects
// =====================================================================

const PROJECT_CATEGORIES = ['Website Development', 'Game Development', 'AI Video', 'Other'];
const PROJECT_PREVIEWS = ['school', 'game', 'video'];

function projectFields(project = {}) {
  return [
    { name: 'title', label: 'Project title', value: project.title, required: true },
    { name: 'badge', label: 'Badge', value: project.badge, placeholder: 'AI-Powered Education Portal' },
    { name: 'tagline', label: 'Tagline', value: project.tagline, type: 'textarea', rows: 2 },
    { name: 'description', label: 'Short description', value: project.description, type: 'textarea', rows: 3 },
    { name: 'longDescription', label: 'Full description', value: project.longDescription, type: 'textarea', rows: 5 },
    {
      name: 'techStack',
      label: 'Tech stack',
      value: toListText(project.techStack),
      type: 'textarea',
      rows: 3,
      hint: 'One technology per line, or separated by commas.'
    },
    {
      name: 'features',
      label: 'Key features',
      value: toListText(project.features),
      type: 'textarea',
      rows: 4,
      hint: 'One bullet per line.'
    },
    { name: 'category', label: 'Category', type: 'select', options: PROJECT_CATEGORIES, value: project.category },
    {
      name: 'previewType',
      label: 'Preview style',
      type: 'select',
      options: PROJECT_PREVIEWS,
      value: project.previewType,
      hint: 'Controls the animated card preview on your site.'
    },
    { name: 'githubUrl', label: 'GitHub URL', value: project.githubUrl, placeholder: 'https://github.com/...' },
    { name: 'liveUrl', label: 'Live URL', value: project.liveUrl, placeholder: 'https://...' },
    {
      name: 'thumbnailGradient',
      label: 'Card gradient classes',
      value: project.thumbnailGradient,
      placeholder: 'from-violet-900/60 via-indigo-900/40 to-slate-900/80',
      hint: 'Tailwind classes. Leave blank to use the default.'
    },
    {
      name: 'imageUrl',
      label: 'Image URL',
      value: project.imageUrl,
      placeholder: 'https://images.example.com/cover.jpg',
      hint: 'Optional. If empty, the animated preview is used instead.'
    }
  ];
}

function renderProjects() {
  clear(dom.projectsBody);

  if (state.projects.length === 0) {
    dom.projectsBody.appendChild(
      el('tr', {}, [el('td', { colspan: '4' }, [el('div', { class: 'pf-empty', text: 'No projects yet.' })])])
    );
    return;
  }

  for (const project of state.projects) {
    const links = [project.githubUrl && 'GitHub', project.liveUrl && 'Live'].filter(Boolean);

    dom.projectsBody.appendChild(
      el('tr', {}, [
        el('td', {}, [
          el('div', { style: 'font-weight: 700;', text: project.title || 'Untitled' }),
          project.badge ? el('div', { class: 'pf-muted', style: 'font-size:.78rem;', text: project.badge }) : null
        ]),
        el('td', {}, [el('span', { class: 'pf-pill pf-pill-violet', text: project.category || '-' })]),
        el('td', { class: 'pf-muted', text: links.length ? links.join(' + ') : 'None' }),
        el('td', {}, [
          el('div', { class: 'pf-actions' }, [
            el('button', {
              class: 'pf-btn pf-btn-ghost pf-btn-sm',
              text: 'Edit',
              onClick: () => editProject(project)
            }),
            el('button', {
              class: 'pf-btn pf-btn-danger pf-btn-sm',
              text: 'Delete',
              onClick: async () => {
                if (!confirmAction(`Delete "${project.title}"? This cannot be undone.`)) return;
                try {
                  await api(`/api/portfolio/projects/${encodeURIComponent(project.id)}`, { method: 'DELETE' });
                  state.projects = state.projects.filter((item) => item.id !== project.id);
                  renderProjects();
                  renderOverview();
                  toast('Project deleted.');
                } catch (err) {
                  toast(err.message, 'error');
                }
              }
            })
          ])
        ])
      ])
    );
  }
}

function editProject(project = null) {
  openModal({
    title: project ? 'Edit project' : 'New project',
    submitLabel: project ? 'Save changes' : 'Create project',
    fields: projectFields(project || {}),
    onSubmit: async (values) => {
      const body = { ...values, techStack: parseList(values.techStack), features: parseList(values.features) };

      if (project) {
        const result = await api(`/api/portfolio/projects/${encodeURIComponent(project.id)}`, {
          method: 'PUT',
          body
        });
        state.projects = state.projects.map((item) => (item.id === project.id ? result.data : item));
        toast('Project updated.');
      } else {
        const result = await api('/api/portfolio/projects', { method: 'POST', body });
        state.projects.push(result.data);
        toast('Project created.');
      }

      renderProjects();
      renderOverview();
    }
  });
}

document.getElementById('pf-add-project').addEventListener('click', () => editProject(null));

// =====================================================================
// Skills
// =====================================================================

const ACCENT_COLORS = ['purple', 'teal', 'pink', 'blue', 'emerald', 'amber', 'rose'];

function renderSkills() {
  clear(dom.skillsList);

  if (state.skillCategories.length === 0) {
    dom.skillsList.appendChild(el('div', { class: 'pf-card' }, [el('div', { class: 'pf-empty', text: 'No skill categories yet.' })]));
    return;
  }

  for (const category of state.skillCategories) {
    const items = category.items || [];

    const itemRows = items
      .map(
        (item, index) => el('div', { class: 'pf-repeat' }, [
          el('div', { class: 'pf-repeat-head' }, [
            el('span', { class: 'pf-repeat-title', text: item.name || `Skill ${index + 1}` }),
            el('div', { style: 'display:flex; gap:6px;' }, [
              el('button', {
                type: 'button',
                class: 'pf-icon-btn',
                html: '&#9998;',
                title: 'Edit skill',
                onClick: () => editSkill(category, index)
              }),
              el('button', {
                type: 'button',
                class: 'pf-icon-btn danger',
                html: '&times;',
                title: 'Remove skill',
                onClick: () => {
                  items.splice(index, 1);
                  saveSkills(category, 'Skill removed.');
                }
              })
            ])
          ]),
          el('div', { class: 'pf-muted', style: 'font-size:.8rem;', text: item.description || '' }),
          el('div', { style: 'display:flex; gap:6px; flex-wrap:wrap; margin-top:8px;' }, [
            item.level ? el('span', { class: 'pf-pill pf-pill-green', text: item.level }) : null,
            ...(item.tags || []).map((tag) => el('span', { class: 'pf-pill pf-pill-slate', text: tag }))
          ])
        ])
      )
      .filter(Boolean);

    dom.skillsList.appendChild(
      el('div', { class: 'pf-card' }, [
        el('div', { class: 'pf-card-head' }, [
          el('div', {}, [
            el('h2', { text: category.title || 'Untitled category' }),
            el('p', { text: `${category.subtitle || ''} - ${items.length} skill${items.length === 1 ? '' : 's'}` })
          ]),
          el('div', { style: 'display:flex; gap:8px; flex-wrap:wrap;' }, [
            el('span', { class: 'pf-pill pf-pill-violet', text: category.accentColor || 'purple' }),
            el('button', {
              class: 'pf-btn pf-btn-ghost pf-btn-sm',
              text: '+ Skill',
              onClick: () => editSkill(category, null)
            }),
            el('button', {
              class: 'pf-btn pf-btn-ghost pf-btn-sm',
              text: 'Edit',
              onClick: () => editCategory(category)
            }),
            el('button', {
              class: 'pf-btn pf-btn-danger pf-btn-sm',
              text: 'Delete',
              onClick: async () => {
                if (!confirmAction(`Delete "${category.title}" and its ${items.length} skill(s)?`)) return;
                try {
                  await api(`/api/portfolio/skills/${encodeURIComponent(category.id)}`, { method: 'DELETE' });
                  state.skillCategories = state.skillCategories.filter((item) => item.id !== category.id);
                  renderSkills();
                  renderOverview();
                  toast('Category deleted.');
                } catch (err) {
                  toast(err.message, 'error');
                }
              }
            })
          ])
        ]),
        ...(itemRows.length ? itemRows : [el('div', { class: 'pf-empty', text: 'No skills in this category.' })])
      ])
    );
  }
}

function editCategory(category = null) {
  openModal({
    title: category ? 'Edit category' : 'New category',
    submitLabel: category ? 'Save changes' : 'Create category',
    fields: [
      { name: 'title', label: 'Category title', value: category?.title },
      { name: 'subtitle', label: 'Subtitle', value: category?.subtitle },
      { name: 'icon', label: 'Lucide icon name', value: category?.icon, hint: 'For example: Globe, Gamepad2, Video, Bot.' },
      { name: 'accentColor', label: 'Accent colour', type: 'select', options: ACCENT_COLORS, value: category?.accentColor }
    ],
    onSubmit: async (values) => {
      if (category) {
        const result = await api(`/api/portfolio/skills/${encodeURIComponent(category.id)}`, {
          method: 'PUT',
          body: values
        });
        state.skillCategories = state.skillCategories.map((item) =>
          item.id === category.id ? { ...result.data, items: category.items } : item
        );
        toast('Category updated.');
      } else {
        const result = await api('/api/portfolio/skills', { method: 'POST', body: values });
        state.skillCategories.push(result.data);
        toast('Category created.');
      }
      renderSkills();
      renderOverview();
    }
  });
}

function editSkill(category, index) {
  const skill = index === null ? null : category.items[index];

  openModal({
    title: skill ? 'Edit skill' : 'New skill',
    submitLabel: skill ? 'Save changes' : 'Add skill',
    fields: [
      { name: 'name', label: 'Skill name', value: skill?.name },
      { name: 'description', label: 'Description', type: 'textarea', rows: 3, value: skill?.description },
      { name: 'level', label: 'Level badge', value: skill?.level, hint: 'For example: Advanced, Specialist, Daily Driver.' },
      { name: 'badge', label: 'Vendor badge', value: skill?.badge, hint: 'For example: OpenAI, Google, Anthropic.' },
      { name: 'iconName', label: 'Lucide icon name', value: skill?.iconName },
      { name: 'tags', label: 'Tags', type: 'textarea', rows: 2, value: toListText(skill?.tags), hint: 'One tag per line, or separated by commas.' }
    ],
    onSubmit: async (values) => {
      const items = [...category.items];
      const next = {
        name: values.name,
        description: values.description,
        level: values.level,
        badge: values.badge,
        iconName: values.iconName,
        tags: parseList(values.tags)
      };

      if (index === null) items.push(next);
      else items[index] = next;

      await saveSkills(category, index === null ? 'Skill added.' : 'Skill updated.', items);
    }
  });
}

async function saveSkills(category, message, items) {
  const payload = { ...category, items: items ?? category.items };

  try {
    const result = await api(`/api/portfolio/skills/${encodeURIComponent(category.id)}`, {
      method: 'PUT',
      body: payload
    });

    state.skillCategories = state.skillCategories.map((item) => (item.id === category.id ? result.data : item));
    renderSkills();
    renderOverview();
    toast(message);
  } catch (err) {
    toast(err.message, 'error');
  }
}

document.getElementById('pf-add-skill-category').addEventListener('click', () => editCategory(null));

// =====================================================================
// Blog
// =====================================================================

function renderPosts() {
  clear(dom.postsBody);

  if (state.posts.length === 0) {
    dom.postsBody.appendChild(
      el('tr', {}, [el('td', { colspan: '5' }, [el('div', { class: 'pf-empty', text: 'No blog posts yet.' })])])
    );
    return;
  }

  for (const post of state.posts) {
    dom.postsBody.appendChild(
      el('tr', {}, [
        el('td', {}, [
          el('div', { style: 'font-weight:700;', text: post.title || 'Untitled' }),
          el('div', { class: 'pf-muted', style: 'font-size:.78rem;', text: post.author || '' })
        ]),
        el('td', {}, [el('span', { class: 'pf-pill pf-pill-slate', text: post.category || '-' })]),
        el('td', {}, [
          el('span', {
            class: `pf-pill ${post.status === 'Draft' ? 'pf-pill-amber' : 'pf-pill-green'}`,
            text: post.status || 'Published'
          })
        ]),
        el('td', { class: 'pf-muted', style: 'font-size:.78rem;', text: formatDate(post.createdAt) }),
        el('td', {}, [
          el('div', { class: 'pf-actions' }, [
            el('button', {
              class: 'pf-btn pf-btn-ghost pf-btn-sm',
              text: post.status === 'Draft' ? 'Publish' : 'Unpublish',
              onClick: async () => {
                const nextStatus = post.status === 'Draft' ? 'Published' : 'Draft';
                try {
                  const result = await api(`/api/portfolio/blog/${encodeURIComponent(post.id)}`, {
                    method: 'PUT',
                    body: { status: nextStatus }
                  });
                  state.posts = state.posts.map((item) => (item.id === post.id ? result.data : item));
                  renderPosts();
                  renderOverview();
                  toast(nextStatus === 'Published' ? 'Post published.' : 'Post moved to drafts.');
                } catch (err) {
                  toast(err.message, 'error');
                }
              }
            }),
            el('button', { class: 'pf-btn pf-btn-ghost pf-btn-sm', text: 'Edit', onClick: () => editPost(post) }),
            el('button', {
              class: 'pf-btn pf-btn-danger pf-btn-sm',
              text: 'Delete',
              onClick: async () => {
                if (!confirmAction(`Delete "${post.title}"? This cannot be undone.`)) return;
                try {
                  await api(`/api/portfolio/blog/${encodeURIComponent(post.id)}`, { method: 'DELETE' });
                  state.posts = state.posts.filter((item) => item.id !== post.id);
                  renderPosts();
                  renderOverview();
                  toast('Post deleted.');
                } catch (err) {
                  toast(err.message, 'error');
                }
              }
            })
          ])
        ])
      ])
    );
  }
}

function editPost(post = null) {
  openModal({
    title: post ? 'Edit post' : 'New blog post',
    submitLabel: post ? 'Save changes' : 'Publish post',
    fields: [
      { name: 'title', label: 'Title', value: post?.title },
      { name: 'author', label: 'Author', value: post?.author || state.profile.name || '' },
      { name: 'category', label: 'Category', value: post?.category },
      { name: 'excerpt', label: 'Excerpt', type: 'textarea', rows: 2, value: post?.excerpt, hint: 'Short teaser shown on the blog card.' },
      { name: 'content', label: 'Content', type: 'textarea', rows: 9, value: post?.content },
      { name: 'imageUrl', label: 'Cover image URL', value: post?.imageUrl },
      { name: 'status', label: 'Status', type: 'select', options: ['Published', 'Draft'], value: post?.status }
    ],
    onSubmit: async (values) => {
      if (post) {
        const result = await api(`/api/portfolio/blog/${encodeURIComponent(post.id)}`, {
          method: 'PUT',
          body: values
        });
        state.posts = state.posts.map((item) => (item.id === post.id ? result.data : item));
        toast('Post updated.');
      } else {
        const result = await api('/api/portfolio/blog', { method: 'POST', body: values });
        state.posts.unshift(result.data);
        toast('Post created.');
      }
      renderPosts();
      renderOverview();
    }
  });
}

document.getElementById('pf-add-post').addEventListener('click', () => editPost(null));

// =====================================================================
// Messages
// =====================================================================

function renderMessages() {
  clear(dom.messagesList);

  if (state.messages.length === 0) {
    dom.messagesList.appendChild(
      el('div', { class: 'pf-card' }, [
        el('div', { class: 'pf-empty', text: 'No messages yet. Submissions from the contact form land here.' })
      ])
    );
    return;
  }

  for (const message of state.messages) {
    dom.messagesList.appendChild(
      el('div', { class: `pf-msg${message.read ? '' : ' unread'}` }, [
        el('div', { class: 'pf-msg-head' }, [
          el('div', {}, [
            el('div', { class: 'pf-msg-from' }, [
              message.name || 'Anonymous',
              message.read ? null : el('span', { class: 'pf-pill pf-pill-violet', style: 'margin-left:8px;', text: 'New' })
            ]),
            el('a', { class: 'pf-msg-email', href: `mailto:${message.email}`, text: message.email || '' })
          ]),
          el('span', { class: 'pf-msg-time', text: formatDate(message.createdAt) })
        ]),
        message.subject ? el('div', { style: 'font-weight:600; font-size:.85rem; margin-bottom:6px;', text: message.subject }) : null,
        el('div', { class: 'pf-msg-body', text: message.message || '' }),
        el('div', { class: 'pf-msg-actions' }, [
          el('a', {
            class: 'pf-btn pf-btn-ghost pf-btn-sm',
            href: `mailto:${message.email}?subject=${encodeURIComponent(`Re: ${message.subject || 'Your message'}`)}`,
            text: 'Reply'
          }),
          el('button', {
            class: 'pf-btn pf-btn-ghost pf-btn-sm',
            text: message.read ? 'Mark unread' : 'Mark read',
            onClick: async () => {
              try {
                await api(`/api/portfolio/messages/${encodeURIComponent(message.id)}/read`, {
                  method: 'PUT',
                  body: { read: !message.read }
                });
                message.read = !message.read;
                renderMessages();
                renderOverview();
              } catch (err) {
                toast(err.message, 'error');
              }
            }
          }),
          el('button', {
            class: 'pf-btn pf-btn-danger pf-btn-sm',
            text: 'Delete',
            onClick: async () => {
              if (!confirmAction('Delete this message?')) return;
              try {
                await api(`/api/portfolio/messages/${encodeURIComponent(message.id)}`, { method: 'DELETE' });
                state.messages = state.messages.filter((item) => item.id !== message.id);
                renderMessages();
                renderOverview();
                toast('Message deleted.');
              } catch (err) {
                toast(err.message, 'error');
              }
            }
          })
        ])
      ])
    );
  }
}

document.getElementById('pf-refresh-messages').addEventListener('click', async () => {
  try {
    const result = await api('/api/portfolio/messages');
    state.messages = result.data || [];
    renderMessages();
    renderOverview();
    toast('Inbox refreshed.');
  } catch (err) {
    toast(err.message, 'error');
  }
});

// =====================================================================
// Socials & navbar
// =====================================================================

const SOCIAL_ICONS = ['Linkedin', 'Instagram', 'Github', 'Mail', 'Twitter', 'Youtube'];

function renderLinks() {
  clear(dom.socialsBody);

  if (state.socials.length === 0) {
    dom.socialsBody.appendChild(
      el('tr', {}, [el('td', { colspan: '3' }, [el('div', { class: 'pf-empty', text: 'No social profiles yet.' })])])
    );
  } else {
    for (const social of state.socials) {
      dom.socialsBody.appendChild(
        el('tr', {}, [
          el('td', {}, [
            el('span', { style: 'font-weight:700;', text: social.platform }),
            el('div', { class: 'pf-muted pf-mono', style: 'font-size:.72rem;', text: social.iconName })
          ]),
          el('td', {}, [
            el('a', {
              class: 'pf-mono',
              href: social.url,
              target: '_blank',
              rel: 'noreferrer noopener',
              style: 'color: var(--primary-2);',
              text: social.url
            })
          ]),
          el('td', {}, [
            el('div', { class: 'pf-actions' }, [
              el('button', { class: 'pf-btn pf-btn-ghost pf-btn-sm', text: 'Edit', onClick: () => editSocial(social) }),
              el('button', {
                class: 'pf-btn pf-btn-danger pf-btn-sm',
                text: 'Delete',
                onClick: async () => {
                  if (!confirmAction(`Remove the ${social.platform} link?`)) return;
                  try {
                    await api(`/api/portfolio/socials/${encodeURIComponent(social.platform)}`, { method: 'DELETE' });
                    state.socials = state.socials.filter((item) => item.platform !== social.platform);
                    renderLinks();
                    toast('Social link removed.');
                  } catch (err) {
                    toast(err.message, 'error');
                  }
                }
              })
            ])
          ])
        ])
      );
    }
  }

  clear(dom.navBody);

  if (state.navItems.length === 0) {
    dom.navBody.appendChild(
      el('tr', {}, [el('td', { colspan: '3' }, [el('div', { class: 'pf-empty', text: 'No menu items yet.' })])])
    );
  } else {
    for (const item of state.navItems) {
      dom.navBody.appendChild(
        el('tr', {}, [
          el('td', { style: 'font-weight:700;', text: item.label }),
          el('td', { class: 'pf-mono pf-muted', text: item.href }),
          el('td', {}, [
            el('div', { class: 'pf-actions' }, [
              el('button', { class: 'pf-btn pf-btn-ghost pf-btn-sm', text: 'Edit', onClick: () => editNavItem(item) }),
              el('button', {
                class: 'pf-btn pf-btn-danger pf-btn-sm',
                text: 'Delete',
                onClick: async () => {
                  if (!confirmAction(`Remove the "${item.label}" menu item?`)) return;
                  try {
                    await api(`/api/portfolio/socials/nav/${encodeURIComponent(item.id)}`, { method: 'DELETE' });
                    state.navItems = state.navItems.filter((entry) => entry.id !== item.id);
                    renderLinks();
                    toast('Menu item removed.');
                  } catch (err) {
                    toast(err.message, 'error');
                  }
                }
              })
            ])
          ])
        ])
      );
    }
  }
}

function editSocial(social = null) {
  openModal({
    title: social ? 'Edit profile link' : 'New profile link',
    submitLabel: social ? 'Save changes' : 'Add profile',
    fields: [
      { name: 'platform', label: 'Platform', value: social?.platform, hint: 'Shown as the button label, e.g. LinkedIn.' },
      { name: 'url', label: 'URL', value: social?.url, hint: 'Use mailto:you@example.com for email.' },
      { name: 'iconName', label: 'Icon', type: 'select', options: SOCIAL_ICONS, value: social?.iconName },
      { name: 'label', label: 'Hover label', value: social?.label, hint: 'Screen-reader friendly description.' }
    ],
    onSubmit: async (values) => {
      if (social) {
        const result = await api(`/api/portfolio/socials/${encodeURIComponent(social.platform)}`, {
          method: 'PUT',
          body: values
        });
        state.socials = state.socials.map((item) =>
          item.platform === social.platform ? result.data : item
        );
        toast('Profile updated.');
      } else {
        const result = await api('/api/portfolio/socials', { method: 'POST', body: values });
        state.socials.push(result.data);
        toast('Profile added.');
      }
      renderLinks();
    }
  });
}

function editNavItem(item = null) {
  openModal({
    title: item ? 'Edit menu item' : 'New menu item',
    submitLabel: item ? 'Save changes' : 'Add item',
    fields: [
      { name: 'label', label: 'Label', value: item?.label },
      {
        name: 'href',
        label: 'Anchor',
        value: item?.href,
        hint: 'Must match a section id on the page, e.g. #projects.'
      }
    ],
    onSubmit: async (values) => {
      if (item) {
        const result = await api(`/api/portfolio/socials/nav/${encodeURIComponent(item.id)}`, {
          method: 'PUT',
          body: values
        });
        state.navItems = state.navItems.map((entry) => (entry.id === item.id ? result.data : entry));
        toast('Menu item updated.');
      } else {
        const result = await api('/api/portfolio/socials/nav', { method: 'POST', body: values });
        state.navItems.push(result.data);
        toast('Menu item added.');
      }
      renderLinks();
    }
  });
}

document.getElementById('pf-add-social').addEventListener('click', () => editSocial(null));
document.getElementById('pf-add-nav').addEventListener('click', () => editNavItem(null));

// =====================================================================
// Settings
// =====================================================================

dom.passwordForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const currentPassword = document.getElementById('pf-cur-pw').value;
  const newPassword = document.getElementById('pf-new-pw').value;
  const confirmPassword = document.getElementById('pf-confirm-pw').value;

  if (newPassword !== confirmPassword) {
    toast('The new passwords do not match.', 'error');
    return;
  }

  const saveBtn = document.getElementById('pf-pw-save');
  saveBtn.disabled = true;

  try {
    await api('/api/portfolio/auth/password', {
      method: 'PUT',
      body: { currentPassword, newPassword }
    });

    dom.passwordForm.reset();
    toast('Password updated.');
  } catch (err) {
    toast(err.message, 'error');
  } finally {
    saveBtn.disabled = false;
  }
});

boot();
