// ===================================================
// API Bridge - 기존 Mock 함수를 실제 API로 연결
// ===================================================

// 네비 UI 업데이트 (app.js의 updateNavUI와 통합)
function updateNavUI() {
  const isLoggedIn = !!currentUser;
  // nav-guest / nav-user (app.js HTML 구조에 맞게)
  const guestEl = document.getElementById('nav-guest');
  const userEl  = document.getElementById('nav-user');
  if (guestEl) guestEl.classList.toggle('hidden', isLoggedIn);
  if (userEl)  { userEl.classList.toggle('hidden', !isLoggedIn); userEl.classList.toggle('flex', isLoggedIn); }
  // 사용자 이름 (닉네임 이모지 포함)
  const usernameEl = document.getElementById('nav-username');
  if (usernameEl && currentUser) {
    const nick = currentUser.nickname || currentUser.username || '';
    const emoji = currentUser.nicknameEmoji || '';
    usernameEl.textContent = emoji ? emoji + ' ' + nick : nick;
  }
  // 관리자 버튼
  const adminBtn = document.getElementById('nav-admin-btn');
  if (adminBtn) adminBtn.classList.toggle('hidden', !(isLoggedIn && currentUser.role === 'ADMIN'));
}

// 페이지 로드 시 로그인 상태 확인
// 출석 체크 공통 로직 (initApp + 로그인 직후 모두 호출)
async function _triggerAttendanceCheck() {
  const checkin = await apiAttendanceCheck();
  if (checkin.success) {
    const status2 = await apiAttendanceStatus();
    applyUnlockedRoadmaps(status2.unlockedRoadmaps || []);
    const modal = document.getElementById('modal-checkin');
    if (modal) {
      document.getElementById('checkin-emoji').textContent = checkin.streak >= 7 ? '⚡' : checkin.streak >= 3 ? '🔥' : '🎉';
      document.getElementById('checkin-streak').textContent = checkin.streak + '일 연속 출석 중!';
      document.getElementById('checkin-points').textContent = '+' + checkin.earned + 'P';
      document.getElementById('checkin-total').textContent = checkin.totalPoints;
      const bonusEl = document.getElementById('checkin-bonus');
      if (checkin.bonus) { bonusEl.textContent = '🎊 ' + checkin.bonus; bonusEl.classList.remove('hidden'); }
      else bonusEl.classList.add('hidden');
      const badgesEl = document.getElementById('checkin-badges');
      if (badgesEl) badgesEl.innerHTML = checkin.newBadges && checkin.newBadges.length
        ? checkin.newBadges.map(b => '<span class="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-xs font-semibold">' + b + ' 획득!</span>').join('')
        : '';
      modal.style.display = 'flex';
      _attendanceStatus = { points: checkin.totalPoints, streak: checkin.streak, badges: [] };
    }
  } else {
    const status = await apiAttendanceStatus();
    _attendanceStatus = status;
    applyUnlockedRoadmaps(status.unlockedRoadmaps || []);
  }
}

(async function initApp() {
  try {
    const res = await apiGetMe();
    if (res.loggedIn && res.user) {
      currentUser = res.user;
      updateNavUI();
      await loadWishListFromServer();
      try { await _triggerAttendanceCheck(); } catch(e2) { console.log('출석 체크 실패', e2); }
    }
  } catch(e) {
    console.log('비로그인 상태');
  }
})();

// 찜 목록 서버에서 불러오기
// LocalDate가 [2026,6,2] 배열로 오는 경우와 "2026-06-02" 문자열 모두 처리
function toDateStr(val) {
  if (!val) return '';
  if (Array.isArray(val)) {
    return val[0] + '-' + String(val[1]).padStart(2,'0') + '-' + String(val[2]).padStart(2,'0');
  }
  return String(val);
}

async function loadWishListFromServer() {
  try {
    const data = await apiGetWishList();
    if (Array.isArray(data)) {
      wishList = data.map(item => ({
        id: item.id,
        name: item.name,
        amt: item.amount || '',
        startDate: toDateStr(item.startDate),
        endDate: toDateStr(item.endDate),
        applyUrl: item.applyUrl || ''
      }));
      renderCalendar();
      if (typeof renderRetentionWidget === 'function') renderRetentionWidget();
    }
  } catch(e) {
    console.log('찜 목록 불러오기 실패 - 로컬 사용');
  }
}

// ===== 로그인 =====
async function loginUser() {
  const username = document.getElementById('login-username')?.value?.trim();
  const password = document.getElementById('login-password')?.value?.trim();
  if (!username || !password) { showToast('아이디와 비밀번호를 입력해주세요', 'info'); return; }
  try {
    const success = await apiLogin(username, password);
    if (success) {
      const res = await apiGetMe();
      if (res.loggedIn) {
        currentUser = res.user;
        closeModal('modal-login');
        updateNavUI();
        await loadWishListFromServer();
        try { await _triggerAttendanceCheck(); } catch(e2) {}
        showToast(currentUser.nickname + '님 환영해요! 👋', 'success');
        if (typeof openMyPage === 'function') openMyPage();
      }
    } else {
      showToast('아이디 또는 비밀번호가 올바르지 않습니다', 'error');
    }
  } catch(e) {
    showToast('로그인 중 오류가 발생했습니다', 'error');
  }
}

// ===== 로그아웃 =====
async function logoutUser() {
  try {
    await apiLogout();
    currentUser = null;
    wishList = [];
    updateNavUI();
    goPage('home');
    showToast('로그아웃됐어요', 'info');
  } catch(e) {
    showToast('로그아웃 중 오류가 발생했습니다', 'error');
  }
}

// ===== 회원가입 =====
async function registerUser() {
  const username = document.getElementById('reg-username')?.value?.trim();
  const password = document.getElementById('reg-password')?.value?.trim();
  const nickname = document.getElementById('reg-nickname')?.value?.trim();
  const email = document.getElementById('reg-email')?.value?.trim();
  if (!username || !password || !nickname || !email) {
    showToast('모든 항목을 입력해주세요', 'info'); return;
  }
  try {
    const res = await apiRegister({ username, password, nickname, email });
    if (res.success) {
      showToast('회원가입 완료! 로그인해주세요 🎉', 'success');
      goPage('home');
      openModal('modal-login');
    } else {
      showToast(res.message || '회원가입 실패', 'error');
    }
  } catch(e) {
    showToast('회원가입 중 오류가 발생했습니다', 'error');
  }
}

// ===== 복지 진단 로딩 애니메이션 =====
let _diagStepTimers = [];
const _DIAG_MSGS = [
  'AI가 분석 중입니다',
  '입력 상황 파악 중',
  '복지 DB 조회 중',
  '맞춤 혜택 생성 중',
  '거의 다 됐어요',
];

function _startDiagStepAnimation() {
  let idx = 0;
  const el = document.getElementById('diag-loading-text');
  const cycle = () => {
    if (!el) return;
    idx = (idx + 1) % _DIAG_MSGS.length;
    el.style.opacity = '0';
    _diagStepTimers.push(setTimeout(() => {
      if (el) { el.textContent = _DIAG_MSGS[idx]; el.style.opacity = '1'; }
    }, 300));
  };
  if (el) { el.textContent = _DIAG_MSGS[0]; el.style.transition = 'opacity 0.3s'; }
  _diagStepTimers.push(setInterval(cycle, 1600));
}

function _stopDiagStepAnimation() {
  _diagStepTimers.forEach(t => { clearTimeout(t); clearInterval(t); });
  _diagStepTimers = [];
}

// HTML 특수문자 이스케이프 (XSS 방지)
function _escHtml(str) {
  return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
// URL 검증 (javascript: 프로토콜 차단)
function _safeUrl(url) {
  return url && /^https?:\/\//i.test(url) ? url : 'https://www.bokjiro.go.kr';
}

// ===== 복지 진단 =====
async function runDiagnosis() {
  const input = document.getElementById('diag-input')?.value?.trim();
  if (!input) { showToast('상황을 입력해주세요', 'info'); return; }

  showDiagState('s-loading');
  _startDiagStepAnimation();
  const btn = document.getElementById('diag-btn');
  if (btn) btn.disabled = true;

  const loadStart = Date.now();
  const waitRemaining = () => {
    const elapsed = Date.now() - loadStart;
    return elapsed < 2000 ? new Promise(r => setTimeout(r, 2000 - elapsed)) : Promise.resolve();
  };

  try {
    const res = await apiDiagnose(input);
    if (res.success && res.result) {
      const d = res.result;
      document.getElementById('r-parse').textContent = d.parse || '';
      document.getElementById('r-count').textContent = d.count || 0;
      document.getElementById('r-amount').textContent = d.amount || '';
      document.getElementById('r-deadline').textContent = d.deadline || '-';
      document.getElementById('r-title').textContent = '수혜 목록 — ' + (d.count || 0) + '건';

      const cardsEl = document.getElementById('r-cards');
      if (cardsEl && d.services) {
        cardsEl.innerHTML = d.services.map((s, i) => {
          const colors = ['#06b6d4','#8b5cf6','#f59e0b','#10b981','#f43f5e','#3b82f6'];
          const color = colors[i % colors.length];
          const safeOnclick = 'addToWishFromDiag(' + JSON.stringify(s.name) + ',' + JSON.stringify(s.amt||'') + ',' + JSON.stringify(s.deadline||'') + ', this)';
          const amtHtml = s.amt && s.amt !== '확인 필요'
            ? '<div style="font-size:12px;color:' + color + ';font-weight:600;margin-bottom:4px;">' + _escHtml(s.amt) + '</div>'
            : '';
          return '<div class="service-card" style="border-left:3px solid ' + color + ';background:#16161e;border-radius:12px;padding:14px;margin-bottom:10px;">' +
            '<div style="display:flex;align-items:start;justify-content:space-between;gap:8px;">' +
            '<div style="flex:1;min-width:0;"><div style="font-size:14px;font-weight:700;color:#fafafa;margin-bottom:4px;">' + _escHtml(s.name) + '</div>' +
            amtHtml +
            '<div style="font-size:12px;color:#a1a1aa;line-height:1.5;">' + _escHtml(s.reason || '') + '</div></div>' +
            '<button onclick=\'' + safeOnclick + '\' ' +
            'class="wish-btn" data-name="' + _escHtml(s.name) + '" ' +
            'style="flex-shrink:0;margin-left:10px;padding:6px 12px;border:1px solid #27272a;border-radius:8px;background:transparent;cursor:pointer;font-size:16px;color:#a1a1aa;transition:all .2s;">♡</button>' +
            '</div>' +
            (s.url ? '<a href="' + _safeUrl(s.url) + '" target="_blank" style="font-size:11px;color:#06b6d4;margin-top:8px;display:inline-block;">신청하기 →</a>' : '') +
            '</div>';
        }).join('');
      }

      await waitRemaining();
      showDiagState('s-result');
      if (typeof renderSimilarCases === 'function') renderSimilarCases(input);
      if (typeof saveDiagHistory === 'function') saveDiagHistory(input, d);
    } else {
      await waitRemaining();
      showToast(res.message || '분석 실패', 'error');
      showDiagState('s-empty');
    }
  } catch(e) {
    console.error('진단 오류:', e);
    await waitRemaining();
    showToast('진단 중 오류가 발생했습니다', 'error');
    showDiagState('s-empty');
  } finally {
    _stopDiagStepAnimation();
    if (btn) btn.disabled = false;
  }
}

// 찜 토글 (추가 / 해제)
async function addToWishFromDiag(name, amt, deadline, btn) {
  if (!currentUser) {
    showToast('로그인 후 이용 가능합니다', 'info');
    openModal('modal-login');
    return;
  }

  const alreadyIdx = wishList.findIndex(w => w.name === name);

  // ── 찜 해제 ──────────────────────────────────────────────────
  if (alreadyIdx !== -1) {
    const item = wishList[alreadyIdx];
    try {
      if (item.id) await apiRemoveWish(item.id);
      wishList.splice(alreadyIdx, 1);
      renderCalendar();
      if (btn) {
        btn.textContent = '♡';
        btn.style.color = '';
        btn.style.borderColor = '';
        btn.dataset.wished = 'false';
      }
      showToast(name + ' 찜 해제됐어요', 'info');
    } catch(e) {
      showToast('찜 해제 실패', 'error');
    }
    return;
  }

  // ── 찜 추가 ──────────────────────────────────────────────────
  try {
    const today = new Date().toISOString().slice(0,10);

    // "2025.12.31" / "2025-12-31" / "2025/12/31" 모두 ISO(YYYY-MM-DD)로 정규화
    const toISODeadline = (d) => {
      if (!d) return '';
      const m = d.match(/^(\d{4})[.\-\/](\d{1,2})[.\-\/](\d{1,2})$/);
      if (!m) return '';
      return m[1] + '-' + m[2].padStart(2,'0') + '-' + m[3].padStart(2,'0');
    };
    const isoDeadline = toISODeadline(deadline);
    const isValidDate = !!isoDeadline && isoDeadline >= today; // 이미 지난 마감도 무시

    let startDate = '', endDate = '';
    if (isValidDate) {
      endDate = isoDeadline;
      const deadlineMs = new Date(isoDeadline).getTime();
      const startMs = Math.max(new Date(today).getTime(), deadlineMs - 30*24*60*60*1000);
      startDate = new Date(startMs).toISOString().slice(0, 10);
    }
    // 마감일 없으면 startDate/endDate 를 빈 문자열로 전송 → 서버에 null 저장 → 캘린더 미표시

    const res = await apiAddWish({ name, amount: amt, startDate, endDate });
    if (res.success) {
      wishList.push({ id: res.item?.id, name, amt, startDate, endDate });
      renderCalendar();
      if (btn) {
        btn.textContent = '❤';
        btn.style.color = '#f43f5e';
        btn.style.borderColor = '#f43f5e';
        btn.dataset.wished = 'true';
      }
      showToast(name + ' 찜했어요! 캘린더에 추가됐어요', 'success');
    } else {
      showToast(res.message || '찜 추가 실패', 'error');
    }
  } catch(e) {
    if (e.message === 'Unauthorized') {
      showToast('로그인이 필요합니다', 'info');
      openModal('modal-login');
    } else {
      showToast('찜 추가 실패: ' + (e.message || ''), 'error');
    }
  }
}

// 찜 제거
async function removeWishApi(id, idx) {
  if (!currentUser) { wishList.splice(idx, 1); renderCalendar(); return; }
  try {
    await apiRemoveWish(id);
    wishList.splice(idx, 1);
    renderCalendar();
    showToast('찜 해제됐어요', 'info');
  } catch(e) {
    showToast('찜 해제 실패', 'error');
  }
}

// ===== 로드맵 =====
function showRoadmapState(state) {
  const map = { 's-form': 'roadmap-input-section', 's-loading': 'roadmap-loading', 's-result': 'roadmap-result' };
  Object.values(map).forEach(id => { const el = document.getElementById(id); if (el) el.classList.add('hidden'); });
  const targetId = map[state];
  if (targetId) { const el = document.getElementById(targetId); if (el) el.classList.remove('hidden'); }
}

window.generateRoadmap = async function() {
  const jobText = document.getElementById('roadmap-job-text')?.value?.trim();
  const jobTag  = typeof selectedJob !== 'undefined' ? selectedJob : '';
  const job = jobText || jobTag;
  if (!job) { showToast('목표 직군을 선택하거나 직접 입력해주세요', 'error'); return; }
  const period = typeof selectedPeriod !== 'undefined' && selectedPeriod ? selectedPeriod : '6개월';
  const input = document.getElementById('roadmap-input')?.value || '';
  showRoadmapState('s-loading');
  const loadStart = Date.now();
  const waitRemaining = () => {
    const elapsed = Date.now() - loadStart;
    return elapsed < 800 ? new Promise(r => setTimeout(r, 800 - elapsed)) : Promise.resolve();
  };
  try {
    const res = await apiGenerateRoadmap(job, period, input);
    if (res.success) {
      let roadmapData;
      try {
        // res.roadmap이 string이면 JSON.parse, 이미 객체면 그대로
        if (typeof res.roadmap === 'string') {
          // 마크다운 코드블록 제거 후 파싱
          const cleaned = res.roadmap.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
          roadmapData = JSON.parse(cleaned);
        } else {
          roadmapData = res.roadmap;
        }
        // months 배열 확인 (없으면 상위 키에서 찾기)
        if (!roadmapData.months && Array.isArray(roadmapData)) {
          roadmapData = { months: roadmapData };
        }
        if (!roadmapData.months || !Array.isArray(roadmapData.months) || roadmapData.months.length === 0) {
          throw new Error('months 배열 없음');
        }
      } catch(e) {
        console.error('로드맵 파싱 오류:', e, '\n원본:', res.roadmap);
        await waitRemaining();
        showToast('로드맵 데이터 파싱 실패: ' + e.message, 'error');
        showRoadmapState('s-form');
        return;
      }
      await waitRemaining();
      const displayData = typeof convertAiRoadmapToDisplay === 'function'
        ? convertAiRoadmapToDisplay(roadmapData, job, period)
        : roadmapData;
      renderRoadmap(displayData);
      showRoadmapState('s-result');
    } else {
      await waitRemaining();
      showToast(res.message || '로드맵 생성 실패', 'error');
      showRoadmapState('s-form');
    }
  } catch(e) {
    await waitRemaining();
    showToast('로드맵 생성 중 오류가 발생했습니다', 'error');
    showRoadmapState('s-form');
  }
};

// ===== 커뮤니티 =====
const _origRenderCommunity = typeof renderCommunity === 'function' ? renderCommunity : null;
window.renderCommunity = async function() {
  try {
    const boardId = typeof currentBoardId !== 'undefined' ? currentBoardId : (typeof currentBoard !== 'undefined' ? currentBoard : 1);
    const page = typeof currentPage !== 'undefined' ? Math.max(0, currentPage - 1) : 0;
    const res = await apiGetPosts(boardId, page);
    if (res && res.content) {
      const serverPosts = {};
      res.content.forEach(p => {
        if (!serverPosts[p.boardId]) serverPosts[p.boardId] = [];
        serverPosts[p.boardId].push({
          id: p.id, boardId: p.boardId, title: p.title, content: p.content,
          author: p.author, authorEmoji: p.authorEmoji || '', authorId: p.authorId,
          date: p.createdAt ? p.createdAt.slice(0,10) : '',
          views: p.views, likeCount: p.likeCount, comments: [], pinned: p.pinned
        });
      });
      Object.assign(posts, serverPosts);
    }
  } catch(e) {
    console.warn('커뮤니티 서버 로드 실패', e.message);
  }
  if (_origRenderCommunity) _origRenderCommunity();
};

// ===== 마이페이지 탭 =====
const _origRenderMyTab = typeof renderMyTab === 'function' ? renderMyTab : null;
window.renderMyTab = async function(tabId) {
  if (!currentUser) return;
  try {
    let posts_data = [];
    if (tabId === 'my-posts-tab') posts_data = await apiGetMyPosts();
    else if (tabId === 'my-likes-tab') posts_data = await apiGetLikedPosts();
    else if (tabId === 'my-bookmarks-tab') posts_data = await apiGetBookmarkedPosts();

    const contentId = tabId.replace('-tab', '-content');
    const el = document.getElementById(contentId);
    if (el) {
      el.innerHTML = posts_data.length
        ? posts_data.map(p =>
            '<div style="display:flex;align-items:center;justify-content:space-between;padding:12px 0;border-bottom:1px solid rgba(255,255,255,0.06);cursor:pointer;" onclick="goPage(\'community\');setTimeout(()=>openPost(' + p.id + '),150)">' +
            '<div style="flex:1;min-width:0;"><div style="font-size:13px;font-weight:500;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">' + p.title + '</div>' +
            '<div style="font-size:11px;color:#a1a1aa;margin-top:2px;">' + (p.createdAt||'').slice(0,10) + ' · ♥ ' + (p.likeCount||0) + '</div></div></div>'
          ).join('')
        : '<div style="text-align:center;padding:32px 0;font-size:13px;color:#a1a1aa;">데이터가 없어요</div>';
    }
  } catch(e) {
    if (_origRenderMyTab) _origRenderMyTab(tabId);
  }
};

// ===== 게시글 작성/수정/삭제 (서버 연동) =====
const _origSubmitPost = typeof submitPost === 'function' ? submitPost : null;
window.submitPost = async function() {
  const title   = document.getElementById('write-title')?.value?.trim();
  const content = document.getElementById('write-content')?.value?.trim();
  const boardId = parseInt(document.getElementById('write-board')?.value);
  const errEl   = document.getElementById('write-err');
  if (errEl) errEl.classList.add('hidden');

  if (!title) { if (errEl) { errEl.textContent = '제목을 입력해주세요'; errEl.classList.remove('hidden'); } return; }
  if (!content) { if (errEl) { errEl.textContent = '내용을 입력해주세요'; errEl.classList.remove('hidden'); } return; }
  if (!currentUser) { openModal('modal-login'); return; }

  const editingId = typeof editingPostId !== 'undefined' ? editingPostId : null;

  try {
    if (editingId) {
      const res = await apiUpdatePost(editingId, { title, content, boardId });
      if (res && (res.post || res.id || res.success !== false)) {
        for (const bid in posts) {
          const p = posts[bid].find(p => p.id === editingId);
          if (p) { p.title = title; p.content = content; break; }
        }
        showToast('게시글이 수정되었습니다', 'success');
        openPost(editingId);
      } else { showToast(res?.message || '수정 실패', 'error'); }
    } else {
      const board = typeof boards !== 'undefined' ? boards.find(b => b.id === boardId) : null;
      if (board && board.adminOnly && currentUser.role !== 'ADMIN') {
        if (errEl) { errEl.textContent = '관리자만 작성할 수 있는 게시판입니다'; errEl.classList.remove('hidden'); } return;
      }
      const res = await apiCreatePost({ boardId, title, content });
      if (res && (res.post || res.success !== false)) {
        const p = res.post || res;
        const newPost = {
          id: p.id, boardId: p.boardId || boardId, title: p.title || title,
          content: p.content || content, authorId: p.authorId || currentUser.id,
          author: p.author || currentUser.nickname, authorEmoji: p.authorEmoji || currentUser.nicknameEmoji || '',
          pinned: false, views: 0, likeCount: 0, createdAt: p.createdAt || new Date().toISOString().slice(0,10)
        };
        if (!posts[boardId]) posts[boardId] = [];
        posts[boardId].unshift(newPost);
        if (typeof currentBoardId !== 'undefined') window.currentBoardId = boardId;
        showToast('게시글이 등록되었습니다', 'success');
        goPage('community');
      } else { showToast(res?.message || '등록 실패', 'error'); }
    }
  } catch(e) {
    showToast('오류가 발생했습니다', 'error');
  }
  const writeBoard = document.getElementById('write-board');
  if (writeBoard) writeBoard.disabled = false;
};

// 게시글 삭제 서버 연동
const _origDeletePost = typeof deletePost === 'function' ? deletePost : null;
window.deletePost = async function(postId) {
  if (!confirm('게시글을 삭제하시겠습니까?')) return;
  try {
    await apiDeletePost(postId);
  } catch(e) {}
  for (const bid in posts) {
    const idx = posts[bid].findIndex(p => p.id === postId);
    if (idx !== -1) { posts[bid].splice(idx, 1); break; }
  }
  delete comments[postId];
  showToast('게시글이 삭제되었습니다', 'success');
  goPage('community');
};

// 댓글 작성 서버 연동
const _origSubmitComment = typeof submitComment === 'function' ? submitComment : null;
window.submitComment = async function(parentId = null) {
  if (!currentUser) { openModal('modal-login'); return; }
  const input = document.getElementById('comment-input');
  const text = input?.value?.trim();
  if (!text) { showToast('댓글을 입력해주세요', 'error'); return; }
  const postId = typeof currentPostId !== 'undefined' ? currentPostId : null;
  if (!postId) return;
  try {
    const res = await apiFetch(`/api/posts/${postId}/comments`, { method: 'POST', body: JSON.stringify({ content: text }) });
    const c = res.comment || res;
    if (!comments[postId]) comments[postId] = [];
    comments[postId].push({
      id: c.id || Date.now(), postId,
      authorId: c.authorId || currentUser.id,
      author: c.author || currentUser.nickname,
      authorEmoji: c.authorEmoji || currentUser.nicknameEmoji || '',
      content: text, parentId: parentId, createdAt: c.createdAt ? c.createdAt.slice(0,10) : (new Date().toISOString().slice(0,10)), deleted: false
    });
    if (input) input.value = '';
    renderComments(postId);
    showToast('댓글이 등록되었습니다', 'success');
  } catch(e) {
    showToast('댓글 등록 실패', 'error');
  }
};

// 게시글 좋아요 서버 연동
const _origToggleLikePost = typeof toggleLikePost === 'function' ? toggleLikePost : null;
window.toggleLikePost = async function() {
  if (!currentUser) { showToast('로그인이 필요합니다', 'info'); openModal('modal-login'); return; }
  const postId = typeof currentPostId !== 'undefined' ? currentPostId : null;
  if (!postId) return;
  try {
    const res = await apiToggleLike(postId);
    const likeBtn = document.getElementById('like-btn-post');
    if (likeBtn) {
      likeBtn.innerHTML = (res.liked ? '❤' : '♡') + ' 공감 ' + (res.likeCount || 0);
    }
    for (const bid in posts) {
      const p = posts[bid].find(p => p.id === postId);
      if (p) { p.likeCount = res.likeCount || 0; break; }
    }
  } catch(e) {
    if (_origToggleLikePost) _origToggleLikePost();
  }
};

// ===== 게시글 상세 열기 (서버 댓글 로드) =====
const _origOpenPost = typeof openPost === 'function' ? openPost : null;
window.openPost = async function(postId) {
  // 서버에서 최신 댓글 로드
  try {
    const serverComments = await apiFetch(`/api/posts/${postId}/comments`);
    if (Array.isArray(serverComments)) {
      const flat = [];
      serverComments.forEach(c => {
        flat.push({
          id: c.id, postId, authorId: c.authorId,
          author: c.author, authorEmoji: c.authorEmoji || '',
          content: c.content, parentId: c.parentId || null,
          createdAt: c.createdAt ? c.createdAt.slice(0,10) : '', deleted: false,
          likeCount: c.likeCount || 0
        });
        (c.replies || []).forEach(r => flat.push({
          id: r.id, postId, authorId: r.authorId,
          author: r.author, authorEmoji: r.authorEmoji || '',
          content: r.content, parentId: c.id,
          createdAt: r.createdAt ? r.createdAt.slice(0,10) : '', deleted: false,
          likeCount: r.likeCount || 0
        }));
      });
      comments[postId] = flat;
    }
  } catch(e) {}
  if (_origOpenPost) _origOpenPost(postId);
};

// 해금된 로드맵 태그 UI 업데이트
function applyUnlockedRoadmaps(unlockedRoadmaps) {
  if (!Array.isArray(unlockedRoadmaps)) return;
  const config = {
    '프리랜서': { btnId: 'shop-btn-freelancer', emoji: '💼 ' },
    '유튜버':   { btnId: 'shop-btn-youtuber',   emoji: '🎬 ' },
  };
  unlockedRoadmaps.forEach(job => {
    const cfg = config[job];
    if (!cfg) return;
    const tagBtn = document.getElementById('job-tag-' + job);
    if (tagBtn) {
      tagBtn.dataset.locked = 'false';
      tagBtn.classList.remove('border-purple-500/30', 'text-purple-400/60', 'border-red-500/30', 'text-red-400/60', 'locked-job');
      tagBtn.classList.add('border-border', 'text-muted-foreground');
      tagBtn.textContent = cfg.emoji + job;
    }
    const shopBtn = document.getElementById(cfg.btnId);
    if (shopBtn) { shopBtn.textContent = '✅ 해금됨'; shopBtn.disabled = true; shopBtn.classList.add('opacity-50'); }
  });
}

// 뱃지 샵 열기 (서버에서 최신 포인트 & 해금 로드맵 반영)
const _origOpenBadgeShop = typeof openBadgeShop === 'function' ? openBadgeShop : null;
window.openBadgeShop = async function() {
  if (!currentUser) { openModal('modal-login'); return; }
  if (_origOpenBadgeShop) _origOpenBadgeShop();
  try {
    const status = await apiAttendanceStatus();
    const el = document.getElementById('shop-my-points');
    if (el) el.textContent = status.points || 0;
    applyUnlockedRoadmaps(status.unlockedRoadmaps || []);
  } catch(e) {}
};

console.log('✅ API Bridge 로드 완료');