
// ===================================================
// API 연동 모듈 (Spring Boot 백엔드 연동)
// ===================================================

const API_BASE = '';

// 공통 fetch 함수
async function apiFetch(url, options = {}) {
  const defaultOptions = {
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    ...options
  };
  const response = await fetch(API_BASE + url, defaultOptions);
  if (response.status === 401 || response.status === 403) {
    throw new Error('Unauthorized');
  }
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    throw new Error(`서버 오류 (${response.status})`);
  }
  return response.json();
}

// ===== 인증 API =====
async function apiLogin(username, password) {
  const formData = new FormData();
  formData.append('username', username);
  formData.append('password', password);
  const res = await fetch('/api/auth/login', {
    method: 'POST', body: formData, credentials: 'include'
  });
  return res.ok;
}

async function apiLogout() {
  await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
}

async function apiRegister(data) {
  return apiFetch('/api/auth/register', { method: 'POST', body: JSON.stringify(data) });
}

async function apiGetMe() {
  return apiFetch('/api/auth/me');
}

async function apiCheckDuplicate(field, value) {
  return apiFetch(`/api/auth/check?field=${encodeURIComponent(field)}&value=${encodeURIComponent(value)}`);
}

// ===== 게시글 API =====
async function apiGetPosts(boardId, page = 0) {
  return apiFetch(`/api/posts?boardId=${boardId}&page=${page}&size=15`);
}

async function apiGetPost(id) {
  return apiFetch(`/api/posts/${id}`);
}

async function apiCreatePost(data) {
  return apiFetch('/api/posts', { method: 'POST', body: JSON.stringify(data) });
}

async function apiUpdatePost(id, data) {
  return apiFetch(`/api/posts/${id}`, { method: 'PUT', body: JSON.stringify(data) });
}

async function apiDeletePost(id) {
  return apiFetch(`/api/posts/${id}`, { method: 'DELETE' });
}

async function apiToggleLike(id) {
  return apiFetch(`/api/posts/${id}/like`, { method: 'POST' });
}

async function apiToggleBookmark(id) {
  return apiFetch(`/api/posts/${id}/bookmark`, { method: 'POST' });
}

async function apiGetPopularPosts() {
  return apiFetch('/api/posts/popular');
}

async function apiGetMyPosts() { return apiFetch('/api/posts/my'); }
async function apiGetLikedPosts() { return apiFetch('/api/posts/liked'); }
async function apiGetBookmarkedPosts() { return apiFetch('/api/posts/bookmarked'); }

// ===== 진단 API =====
async function apiDiagnose(input) {
  return apiFetch('/api/diagnosis', { method: 'POST', body: JSON.stringify({ input }) });
}

async function apiGetDiagHistory() {
  return apiFetch('/api/diagnosis/history');
}

async function apiGenerateRoadmap(job, period, input = '') {
  return apiFetch('/api/diagnosis/roadmap', {
    method: 'POST', body: JSON.stringify({ job, period, input })
  });
}

// ===== 찜 API =====
async function apiGetWishList() { return apiFetch('/api/wish'); }

async function apiAddWish(data) {
  return apiFetch('/api/wish', { method: 'POST', body: JSON.stringify(data) });
}

async function apiRemoveWish(id) {
  return apiFetch(`/api/wish/${id}`, { method: 'DELETE' });
}

// ===== 복지로 API =====
async function apiGetWelfare(page = 1) {
  return apiFetch(`/api/welfare/central?page=${page}`);
}

async function apiGetLocalWelfare(region) {
  return apiFetch(`/api/welfare/local?region=${encodeURIComponent(region)}`);
}

// ===== 출석/포인트 API =====
async function apiAttendanceCheck() {
  return apiFetch('/api/attendance/check', { method: 'POST' });
}
async function apiAttendanceStatus() {
  return apiFetch('/api/attendance/status');
}
async function apiBuyBadge(badge) {
  return apiFetch('/api/attendance/badge/buy', { method: 'POST', body: JSON.stringify({ badge }) });
}
async function apiBoostPost(postId) {
  return apiFetch(`/api/posts/${postId}/boost`, { method: 'POST' });
}
async function apiUnlockRoadmap(job) {
  return apiFetch('/api/attendance/roadmap/unlock', { method: 'POST', body: JSON.stringify({ job }) });
}
async function apiBuyEmoji(emoji) {
  return apiFetch('/api/attendance/emoji/buy', { method: 'POST', body: JSON.stringify({ emoji }) });
}
async function apiEquipEmoji(emoji) {
  return apiFetch('/api/attendance/emoji/equip', { method: 'POST', body: JSON.stringify({ emoji }) });
}
