/**
 * EduPortal Script
 * Manages students, courses, blog posts, and interactive UI state
 * Seamless open access (no admin login barrier required)
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Verify Authentication Token
  const token = localStorage.getItem('admin_token');
  if (!token) {
    window.location.href = '/admin';
    return;
  }

  // State Management
  let currentSection = 'students';
  let studentsData = [];
  let coursesData = [];
  let postsData = [];
  let itemToDelete = null; // { type: 'student' | 'course' | 'blog post', id: string, name: string }

  // DOM Elements - Navigation & Layout
  const navStudents = document.getElementById('nav-students');
  const navCourses = document.getElementById('nav-courses');
  const navBlog = document.getElementById('nav-blog');

  const sectionStudents = document.getElementById('section-students');
  const sectionCourses = document.getElementById('section-courses');
  const sectionBlog = document.getElementById('section-blog');

  const sectionHeading = document.getElementById('section-heading');
  const sectionSubheading = document.getElementById('section-subheading');
  const btnQuickAdd = document.getElementById('btn-quick-add');
  const btnQuickText = document.getElementById('btn-quick-text');
  const mobileToggle = document.getElementById('mobile-toggle');
  const sidebar = document.getElementById('sidebar');
  const logoutBtn = document.getElementById('logout-btn');

  // DOM Elements - User info
  const userNameEl = document.getElementById('user-name');
  const userEmailEl = document.getElementById('user-email');
  const userAvatarEl = document.getElementById('user-avatar');

  // DOM Elements - Stats
  const statTotalStudents = document.getElementById('stat-total-students');
  const statTotalCourses = document.getElementById('stat-total-courses');
  const statTotalPosts = document.getElementById('stat-total-posts');
  const statActiveCourses = document.getElementById('stat-active-courses');
  const statTotalSeats = document.getElementById('stat-total-seats');

  const badgeStudentsCount = document.getElementById('badge-students-count');
  const badgeCoursesCount = document.getElementById('badge-courses-count');
  const badgePostsCount = document.getElementById('badge-posts-count');

  // DOM Elements - Tables & Searches
  const searchStudentsInput = document.getElementById('search-students');
  const studentsTbody = document.getElementById('students-tbody');
  const studentsEmpty = document.getElementById('students-empty');

  const searchCoursesInput = document.getElementById('search-courses');
  const coursesTbody = document.getElementById('courses-tbody');
  const coursesEmpty = document.getElementById('courses-empty');

  const searchPostsInput = document.getElementById('search-posts');
  const postsTbody = document.getElementById('posts-tbody');
  const postsEmpty = document.getElementById('posts-empty');

  // DOM Elements - Modals
  const modalStudent = document.getElementById('modal-student');
  const formAddStudent = document.getElementById('form-add-student');
  const studentCourseSelect = document.getElementById('student-course');
  const studentModalAlert = document.getElementById('student-modal-alert');
  const openStudentModalBtn = document.getElementById('open-student-modal');

  const modalCourse = document.getElementById('modal-course');
  const formAddCourse = document.getElementById('form-add-course');
  const courseModalAlert = document.getElementById('course-modal-alert');
  const openCourseModalBtn = document.getElementById('open-course-modal');

  const modalPost = document.getElementById('modal-post');
  const formPost = document.getElementById('form-post');
  const modalPostTitle = document.getElementById('modal-post-title');
  const postIdInput = document.getElementById('post-id');
  const postTitleInput = document.getElementById('post-title');
  const postAuthorInput = document.getElementById('post-author');
  const postCategorySelect = document.getElementById('post-category');
  const postStatusSelect = document.getElementById('post-status');
  const postImageInput = document.getElementById('post-image');
  const postExcerptInput = document.getElementById('post-excerpt');
  const postContentInput = document.getElementById('post-content');
  const postModalAlert = document.getElementById('post-modal-alert');
  const openPostModalBtn = document.getElementById('open-post-modal');
  const btnSavePost = document.getElementById('btn-save-post');

  // Modal: Read Article
  const modalReadPost = document.getElementById('modal-read-post');
  const readPostTitle = document.getElementById('read-post-title');
  const readPostAuthor = document.getElementById('read-post-author');
  const readPostCategory = document.getElementById('read-post-category');
  const readPostStatus = document.getElementById('read-post-status');
  const readPostDate = document.getElementById('read-post-date');
  const readPostImageWrap = document.getElementById('read-post-image-wrap');
  const readPostImage = document.getElementById('read-post-image');
  const readPostExcerpt = document.getElementById('read-post-excerpt');
  const readPostContent = document.getElementById('read-post-content');

  const modalDelete = document.getElementById('modal-delete');
  const deletePromptText = document.getElementById('delete-prompt-text');
  const btnConfirmDelete = document.getElementById('btn-confirm-delete');
  const toastContainer = document.getElementById('toast-container');

  // =========================================================================
  // API Fetch Helper with Authorization Header
  // =========================================================================
  async function apiRequest(url, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(options.headers || {})
    };

    try {
      const response = await fetch(url, { ...options, headers });

      // If token expired or unauthorized, clean up and redirect to /admin
      if (response.status === 401) {
        showToast('Session expired. Redirecting to login...', 'error');
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        setTimeout(() => {
          window.location.href = '/admin';
        }, 1200);
        throw new Error('Unauthorized');
      }

      const data = await response.json();
      return { ok: response.ok, status: response.status, data };
    } catch (err) {
      if (err.message !== 'Unauthorized') {
        console.error(`API Error on ${url}:`, err);
      }
      throw err;
    }
  }

  // =========================================================================
  // Authenticate & Load User Profile
  // =========================================================================
  async function loadAdminProfile() {
    try {
      const storedUser = localStorage.getItem('admin_user');
      if (storedUser) {
        try {
          const user = JSON.parse(storedUser);
          applyUserProfile(user);
        } catch (_) {}
      }

      const res = await apiRequest('/api/auth/me');
      if (res.ok && res.data.user) {
        applyUserProfile(res.data.user);
      }
    } catch (err) {
      console.warn('Could not load profile from server');
    }
  }

  function applyUserProfile(user) {
    if (user.name) userNameEl.textContent = user.name;
    if (user.email) {
      userEmailEl.textContent = user.email;
      userAvatarEl.textContent = (user.name || user.email).charAt(0).toUpperCase();
    }
  }

  // =========================================================================
  // Toast Notification System
  // =========================================================================
  function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    const icon = type === 'success' ? '✓' : 'ℹ️';
    toast.innerHTML = `<span>${icon}</span><span>${escapeHtml(message)}</span>`;

    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(30px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // =========================================================================
  // Section Switching
  // =========================================================================
  function switchSection(section) {
    currentSection = section;

    // Reset active states
    navStudents.classList.remove('active');
    navCourses.classList.remove('active');
    if (navBlog) navBlog.classList.remove('active');

    sectionStudents.classList.remove('active');
    sectionCourses.classList.remove('active');
    if (sectionBlog) sectionBlog.classList.remove('active');

    if (section === 'students') {
      navStudents.classList.add('active');
      sectionStudents.classList.add('active');
      sectionHeading.textContent = 'Students Directory';
      sectionSubheading.textContent = 'View and enroll registered students in academy courses';
      btnQuickText.textContent = 'Add Student';
    } else if (section === 'courses') {
      navCourses.classList.add('active');
      sectionCourses.classList.add('active');
      sectionHeading.textContent = 'Course Catalog';
      sectionSubheading.textContent = 'Browse available courses, capacity seats, and enrollment status';
      btnQuickText.textContent = 'Add Course';
    } else if (section === 'blog') {
      if (navBlog) navBlog.classList.add('active');
      if (sectionBlog) sectionBlog.classList.add('active');
      sectionHeading.textContent = 'Blog & Articles';
      sectionSubheading.textContent = 'Read, search, and publish articles, news, and learning tips';
      btnQuickText.textContent = 'Add Post';
    }

    // Close mobile drawer on navigation
    sidebar.classList.remove('open');
  }

  navStudents.addEventListener('click', () => switchSection('students'));
  navCourses.addEventListener('click', () => switchSection('courses'));
  if (navBlog) navBlog.addEventListener('click', () => switchSection('blog'));

  btnQuickAdd.addEventListener('click', () => {
    if (currentSection === 'students') {
      openStudentModal();
    } else if (currentSection === 'courses') {
      openCourseModal();
    } else if (currentSection === 'blog') {
      openPostModalForCreate();
    }
  });

  // Mobile drawer toggle
  mobileToggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
  });

  // Logout handler
  logoutBtn.addEventListener('click', async () => {
    try {
      await apiRequest('/api/auth/logout', { method: 'POST' });
    } catch (_) {}
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    document.cookie = 'admin_token=; path=/; max-age=0';
    showToast('Logged out successfully', 'success');
    setTimeout(() => {
      window.location.href = '/admin';
    }, 400);
  });

  // =========================================================================
  // Load & Render Data
  // =========================================================================
  async function loadData() {
    await Promise.all([fetchStudents(), fetchCourses(), fetchPosts()]);
    updateStats();
  }

  // Fetch Students
  async function fetchStudents() {
    try {
      const res = await apiRequest('/api/students');
      if (res.ok && res.data.data) {
        studentsData = res.data.data;
        renderStudentsTable();
      }
    } catch (err) {
      console.error('Failed to load students', err);
    }
  }

  // Fetch Courses
  async function fetchCourses() {
    try {
      const res = await apiRequest('/api/courses');
      if (res.ok && res.data.data) {
        coursesData = res.data.data;
        renderCoursesTable();
        populateCourseDropdown();
      }
    } catch (err) {
      console.error('Failed to load courses', err);
    }
  }

  // Fetch Blog Posts
  async function fetchPosts() {
    try {
      const res = await apiRequest('/api/blog');
      if (res.ok && res.data.data) {
        postsData = res.data.data;
        renderPostsTable();
      }
    } catch (err) {
      console.error('Failed to load blog posts', err);
    }
  }

  // Update Stats Counters
  function updateStats() {
    statTotalStudents.textContent = studentsData.length;
    badgeStudentsCount.textContent = studentsData.length;

    statTotalCourses.textContent = coursesData.length;
    badgeCoursesCount.textContent = coursesData.length;

    if (statTotalPosts) {
      statTotalPosts.textContent = postsData.length;
    }
    if (badgePostsCount) {
      badgePostsCount.textContent = postsData.length;
    }

    const activeCount = coursesData.filter(c => c.active).length;
    statActiveCourses.textContent = activeCount;

    const totalSeats = coursesData.reduce((acc, c) => acc + (parseInt(c.seats, 10) || 0), 0);
    statTotalSeats.textContent = totalSeats;
  }

  // Populate Course Dropdown for "Add Student" Modal
  function populateCourseDropdown() {
    const currentValue = studentCourseSelect.value;
    studentCourseSelect.innerHTML = '<option value="">Select a course...</option>';

    coursesData.forEach(c => {
      const option = document.createElement('option');
      option.value = c.title;
      option.textContent = `${c.title} (${c.active ? 'Active' : 'Inactive'})`;
      studentCourseSelect.appendChild(option);
    });

    if (currentValue) {
      studentCourseSelect.value = currentValue;
    }
  }

  // =========================================================================
  // Render Students Table
  // =========================================================================
  function renderStudentsTable() {
    const query = (searchStudentsInput.value || '').trim().toLowerCase();
    const filtered = studentsData.filter(s =>
      s.name.toLowerCase().includes(query) ||
      s.email.toLowerCase().includes(query) ||
      s.enrolledCourse.toLowerCase().includes(query)
    );

    studentsTbody.innerHTML = '';

    if (filtered.length === 0) {
      studentsEmpty.style.display = 'block';
      return;
    }

    studentsEmpty.style.display = 'none';

    filtered.forEach(student => {
      const tr = document.createElement('tr');
      const formattedDate = student.createdAt
        ? new Date(student.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })
        : 'N/A';

      tr.innerHTML = `
        <td>
          <div style="font-weight: 600; color: #0f172a;">${escapeHtml(student.name)}</div>
        </td>
        <td>
          <span style="color: #64748b;">${escapeHtml(student.email)}</span>
        </td>
        <td>
          <span class="badge badge-course">${escapeHtml(student.enrolledCourse)}</span>
        </td>
        <td style="color: #94a3b8; font-size: 0.85rem;">
          ${formattedDate}
        </td>
        <td style="text-align: right;">
          <button type="button" class="btn btn-danger btn-delete-student" data-id="${student.id}" data-name="${escapeHtml(student.name)}">
            Delete
          </button>
        </td>
      `;

      studentsTbody.appendChild(tr);
    });

    // Attach delete listeners
    document.querySelectorAll('.btn-delete-student').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const name = btn.getAttribute('data-name');
        promptDelete('student', id, name);
      });
    });
  }

  // =========================================================================
  // Render Courses Table
  // =========================================================================
  function renderCoursesTable() {
    const query = (searchCoursesInput.value || '').trim().toLowerCase();
    const filtered = coursesData.filter(c =>
      c.title.toLowerCase().includes(query)
    );

    coursesTbody.innerHTML = '';

    if (filtered.length === 0) {
      coursesEmpty.style.display = 'block';
      return;
    }

    coursesEmpty.style.display = 'none';

    filtered.forEach(course => {
      const tr = document.createElement('tr');
      const formattedDate = course.createdAt
        ? new Date(course.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })
        : 'N/A';

      const statusBadge = course.active
        ? '<span class="badge badge-active">Active</span>'
        : '<span class="badge badge-inactive">Inactive</span>';

      tr.innerHTML = `
        <td>
          <div style="font-weight: 600; color: #0f172a;">${escapeHtml(course.title)}</div>
        </td>
        <td>
          <span style="font-weight: 600; color: #334155;">${course.seats} seats</span>
        </td>
        <td>
          ${statusBadge}
        </td>
        <td style="color: #94a3b8; font-size: 0.85rem;">
          ${formattedDate}
        </td>
        <td style="text-align: right;">
          <div class="table-actions">
            <button type="button" class="btn btn-edit btn-enroll-course" data-title="${escapeHtml(course.title)}">
              🎓 Enroll
            </button>
            <button type="button" class="btn btn-danger btn-delete-course" data-id="${course.id}" data-name="${escapeHtml(course.title)}">
              Delete
            </button>
          </div>
        </td>
      `;

      coursesTbody.appendChild(tr);
    });

    // Attach Enroll listeners
    document.querySelectorAll('.btn-enroll-course').forEach(btn => {
      btn.addEventListener('click', () => {
        const title = btn.getAttribute('data-title');
        openStudentModal();
        studentCourseSelect.value = title;
      });
    });

    // Attach delete listeners
    document.querySelectorAll('.btn-delete-course').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const name = btn.getAttribute('data-name');
        promptDelete('course', id, name);
      });
    });
  }

  // =========================================================================
  // Render Blog Posts Table
  // =========================================================================
  function renderPostsTable() {
    if (!postsTbody) return;

    const query = (searchPostsInput ? searchPostsInput.value : '').trim().toLowerCase();
    const filtered = postsData.filter(p =>
      p.title.toLowerCase().includes(query)
    );

    postsTbody.innerHTML = '';

    if (filtered.length === 0) {
      if (postsEmpty) postsEmpty.style.display = 'block';
      return;
    }

    if (postsEmpty) postsEmpty.style.display = 'none';

    filtered.forEach(post => {
      const tr = document.createElement('tr');
      const formattedDate = post.createdAt
        ? new Date(post.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })
        : 'N/A';

      const isPublished = post.status === 'Published';
      const statusBadge = isPublished
        ? '<span class="badge badge-published">Published</span>'
        : '<span class="badge badge-draft">Draft</span>';

      tr.innerHTML = `
        <td>
          <div class="post-title-link" data-id="${post.id}" style="font-weight: 600; color: #0f172a; max-width: 280px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; cursor: pointer;">
            ${escapeHtml(post.title)}
          </div>
          ${post.excerpt ? `<div style="font-size: 0.78rem; color: #64748b; max-width: 280px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${escapeHtml(post.excerpt)}</div>` : ''}
        </td>
        <td>
          <span style="color: #334155; font-size: 0.88rem;">${escapeHtml(post.author)}</span>
        </td>
        <td>
          <span class="badge badge-category">${escapeHtml(post.category)}</span>
        </td>
        <td>
          ${statusBadge}
        </td>
        <td style="color: #94a3b8; font-size: 0.85rem; white-space: nowrap;">
          ${formattedDate}
        </td>
        <td style="text-align: right;">
          <div class="table-actions">
            <button type="button" class="btn btn-edit btn-read-post" data-id="${post.id}" title="Read Article">
              👁️ Read
            </button>
            <button type="button" class="btn btn-edit btn-edit-post" data-id="${post.id}" title="Edit Article">
              ✏️ Edit
            </button>
            <button type="button" class="btn btn-danger btn-delete-post" data-id="${post.id}" data-name="${escapeHtml(post.title)}" title="Delete Article">
              Delete
            </button>
          </div>
        </td>
      `;

      postsTbody.appendChild(tr);
    });

    // Attach Read post listeners
    document.querySelectorAll('.btn-read-post, .post-title-link').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const post = postsData.find(p => p.id === id);
        if (post) {
          openPostModalForRead(post);
        }
      });
    });

    // Attach Edit post listeners
    document.querySelectorAll('.btn-edit-post').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const post = postsData.find(p => p.id === id);
        if (post) {
          openPostModalForEdit(post);
        }
      });
    });

    // Attach Delete post listeners
    document.querySelectorAll('.btn-delete-post').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const name = btn.getAttribute('data-name');
        promptDelete('blog post', id, name);
      });
    });
  }

  // Search input listeners
  searchStudentsInput.addEventListener('input', renderStudentsTable);
  searchCoursesInput.addEventListener('input', renderCoursesTable);
  if (searchPostsInput) {
    searchPostsInput.addEventListener('input', renderPostsTable);
  }

  // =========================================================================
  // Modal Management
  // =========================================================================
  function openModal(modalEl) {
    if (modalEl) modalEl.classList.add('show');
  }

  function closeModal(modalEl) {
    if (!modalEl) return;
    modalEl.classList.remove('show');
    // Clear any modal errors
    const alert = modalEl.querySelector('.alert');
    if (alert) {
      alert.style.display = 'none';
      alert.textContent = '';
    }
  }

  // Generic modal close handler for [data-close-modal]
  document.querySelectorAll('[data-close-modal]').forEach(el => {
    el.addEventListener('click', () => {
      const modalId = el.getAttribute('data-close-modal');
      const targetModal = document.getElementById(modalId);
      if (targetModal) closeModal(targetModal);
    });
  });

  // Close modals when clicking backdrop
  [modalStudent, modalCourse, modalPost, modalReadPost, modalDelete].forEach(modal => {
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal(modal);
      });
    }
  });

  // Open Add Student Modal
  function openStudentModal() {
    formAddStudent.reset();
    populateCourseDropdown();
    studentModalAlert.style.display = 'none';
    openModal(modalStudent);
  }
  openStudentModalBtn.addEventListener('click', openStudentModal);

  // Open Add Course Modal
  function openCourseModal() {
    formAddCourse.reset();
    document.getElementById('course-active').checked = true;
    courseModalAlert.style.display = 'none';
    openModal(modalCourse);
  }
  openCourseModalBtn.addEventListener('click', openCourseModal);

  // =========================================================================
  // Blog Post Modals: Read, Create & Edit
  // =========================================================================
  function openPostModalForRead(post) {
    readPostTitle.textContent = post.title || 'Untitled Post';
    readPostAuthor.textContent = post.author || 'Anonymous';
    readPostCategory.textContent = post.category || 'General';

    const isPublished = post.status === 'Published';
    readPostStatus.textContent = post.status;
    readPostStatus.className = `badge badge-${isPublished ? 'published' : 'draft'}`;

    readPostDate.textContent = post.createdAt
      ? new Date(post.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      : '';

    if (post.imageUrl && post.imageUrl.startsWith('http')) {
      readPostImage.src = post.imageUrl;
      readPostImageWrap.style.display = 'block';
    } else {
      readPostImageWrap.style.display = 'none';
    }

    if (post.excerpt) {
      readPostExcerpt.textContent = post.excerpt;
      readPostExcerpt.style.display = 'block';
    } else {
      readPostExcerpt.style.display = 'none';
    }

    readPostContent.textContent = post.content || '';
    openModal(modalReadPost);
  }

  function openPostModalForCreate() {
    formPost.reset();
    postIdInput.value = '';
    modalPostTitle.textContent = 'Add New Blog Post';
    btnSavePost.textContent = 'Save Post';
    postStatusSelect.value = 'Published';
    postCategorySelect.value = 'AI';
    postModalAlert.style.display = 'none';
    openModal(modalPost);
  }

  function openPostModalForEdit(post) {
    formPost.reset();
    postIdInput.value = post.id;
    modalPostTitle.textContent = 'Edit Blog Post';
    btnSavePost.textContent = 'Update Post';

    postTitleInput.value = post.title || '';
    postAuthorInput.value = post.author || '';
    postCategorySelect.value = post.category || 'AI';
    postStatusSelect.value = post.status || 'Published';
    postImageInput.value = post.imageUrl || '';
    postExcerptInput.value = post.excerpt || '';
    postContentInput.value = post.content || '';

    postModalAlert.style.display = 'none';
    openModal(modalPost);
  }

  if (openPostModalBtn) {
    openPostModalBtn.addEventListener('click', openPostModalForCreate);
  }

  // =========================================================================
  // Add Student Submission
  // =========================================================================
  formAddStudent.addEventListener('submit', async (e) => {
    e.preventDefault();
    studentModalAlert.style.display = 'none';

    const name = document.getElementById('student-name').value.trim();
    const email = document.getElementById('student-email').value.trim();
    const enrolledCourse = studentCourseSelect.value.trim();

    if (!name || !email || !enrolledCourse) {
      studentModalAlert.textContent = 'Please fill out all fields.';
      studentModalAlert.style.display = 'block';
      return;
    }

    const saveBtn = document.getElementById('btn-save-student');
    saveBtn.disabled = true;
    saveBtn.textContent = 'Enrolling...';

    try {
      const res = await apiRequest('/api/students', {
        method: 'POST',
        body: JSON.stringify({ name, email, enrolledCourse })
      });

      if (res.ok && res.data.success) {
        closeModal(modalStudent);
        showToast(`Student "${name}" enrolled successfully!`, 'success');
        await fetchStudents();
        updateStats();
      } else {
        studentModalAlert.textContent = res.data.error || 'Failed to add student.';
        studentModalAlert.style.display = 'block';
      }
    } catch (err) {
      studentModalAlert.textContent = 'Failed to submit form. Please try again.';
      studentModalAlert.style.display = 'block';
    } finally {
      saveBtn.disabled = false;
      saveBtn.textContent = 'Save Student';
    }
  });

  // =========================================================================
  // Add Course Submission
  // =========================================================================
  formAddCourse.addEventListener('submit', async (e) => {
    e.preventDefault();
    courseModalAlert.style.display = 'none';

    const title = document.getElementById('course-title').value.trim();
    const seats = parseInt(document.getElementById('course-seats').value, 10);
    const active = document.getElementById('course-active').checked;

    if (!title || isNaN(seats) || seats < 1) {
      courseModalAlert.textContent = 'Please enter a valid title and positive seats count.';
      courseModalAlert.style.display = 'block';
      return;
    }

    const saveBtn = document.getElementById('btn-save-course');
    saveBtn.disabled = true;
    saveBtn.textContent = 'Creating...';

    try {
      const res = await apiRequest('/api/courses', {
        method: 'POST',
        body: JSON.stringify({ title, seats, active })
      });

      if (res.ok && res.data.success) {
        closeModal(modalCourse);
        showToast(`Course "${title}" added successfully!`, 'success');
        await fetchCourses();
        updateStats();
      } else {
        courseModalAlert.textContent = res.data.error || 'Failed to create course.';
        courseModalAlert.style.display = 'block';
      }
    } catch (err) {
      courseModalAlert.textContent = 'Failed to submit form. Please try again.';
      courseModalAlert.style.display = 'block';
    } finally {
      saveBtn.disabled = false;
      saveBtn.textContent = 'Save Course';
    }
  });

  // =========================================================================
  // Blog Post Submission (Add or Edit)
  // =========================================================================
  if (formPost) {
    formPost.addEventListener('submit', async (e) => {
      e.preventDefault();
      postModalAlert.style.display = 'none';

      const id = postIdInput.value.trim();
      const isEditing = Boolean(id);

      const title = postTitleInput.value.trim();
      const author = postAuthorInput.value.trim();
      const category = postCategorySelect.value.trim();
      const status = postStatusSelect.value.trim();
      const imageUrl = postImageInput.value.trim();
      const excerpt = postExcerptInput.value.trim();
      const content = postContentInput.value.trim();

      if (!title || !author || !category || !content) {
        postModalAlert.textContent = 'Please fill out all required fields (Title, Author, Category, Content).';
        postModalAlert.style.display = 'block';
        return;
      }

      btnSavePost.disabled = true;
      btnSavePost.textContent = isEditing ? 'Updating...' : 'Saving...';

      const endpoint = isEditing ? `/api/blog/${id}` : '/api/blog';
      const method = isEditing ? 'PUT' : 'POST';

      try {
        const res = await apiRequest(endpoint, {
          method,
          body: JSON.stringify({
            title,
            author,
            category,
            status,
            imageUrl,
            excerpt,
            content
          })
        });

        if (res.ok && res.data.success) {
          closeModal(modalPost);
          showToast(
            isEditing ? `Post "${title}" updated successfully!` : `Post "${title}" published to blog!`,
            'success'
          );
          await fetchPosts();
          updateStats();
        } else {
          postModalAlert.textContent = res.data.error || 'Failed to save blog post.';
          postModalAlert.style.display = 'block';
        }
      } catch (err) {
        postModalAlert.textContent = 'Failed to submit form. Please try again.';
        postModalAlert.style.display = 'block';
      } finally {
        btnSavePost.disabled = false;
        btnSavePost.textContent = isEditing ? 'Update Post' : 'Save Post';
      }
    });
  }

  // =========================================================================
  // Delete Item Confirmation & Handling
  // =========================================================================
  function promptDelete(type, id, name) {
    itemToDelete = { type, id, name };
    deletePromptText.textContent = `Are you sure you want to permanently delete ${type} "${name}"? This action cannot be undone.`;
    openModal(modalDelete);
  }

  btnConfirmDelete.addEventListener('click', async () => {
    if (!itemToDelete) return;

    btnConfirmDelete.disabled = true;
    btnConfirmDelete.textContent = 'Deleting...';

    let endpoint = '';
    if (itemToDelete.type === 'student') {
      endpoint = `/api/students/${itemToDelete.id}`;
    } else if (itemToDelete.type === 'course') {
      endpoint = `/api/courses/${itemToDelete.id}`;
    } else if (itemToDelete.type === 'blog post' || itemToDelete.type === 'post') {
      endpoint = `/api/blog/${itemToDelete.id}`;
    }

    try {
      const res = await apiRequest(endpoint, { method: 'DELETE' });

      if (res.ok && res.data.success) {
        const label = itemToDelete.type.charAt(0).toUpperCase() + itemToDelete.type.slice(1);
        showToast(`${label} deleted successfully!`, 'success');
        closeModal(modalDelete);

        if (itemToDelete.type === 'student') {
          await fetchStudents();
        } else if (itemToDelete.type === 'course') {
          await fetchCourses();
        } else {
          await fetchPosts();
        }
        updateStats();
      } else {
        showToast(res.data.error || 'Failed to delete item.', 'error');
      }
    } catch (err) {
      showToast('Error during deletion.', 'error');
    } finally {
      btnConfirmDelete.disabled = false;
      btnConfirmDelete.textContent = 'Delete Permanently';
      itemToDelete = null;
    }
  });

  // Initialize Data
  loadAdminProfile();
  loadData();
});
