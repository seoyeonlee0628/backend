
tailwind.config = {
  theme: {
    extend: {
      colors: {
        background: '#0a0a0f', foreground: '#fafafa',
        card: '#16161e', 'card-foreground': '#fafafa',
        primary: '#06b6d4', 'primary-hover': '#22d3ee',
        muted: '#27272a', 'muted-foreground': '#a1a1aa',
        border: '#27272a', accent: '#1e293b',
        success: '#10b981', warning: '#f59e0b', destructive: '#ef4444',
      },
      fontFamily: { sans: ['Pretendard', 'system-ui', 'sans-serif'] }
    }
  }
}


// 브라우저 스크롤 복원 비활성화 (SPA에서 이전 스크롤 위치 복원 방지)
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
window.scrollTo(0, 0);

// ============================================================
// 상태 (State)
// ============================================================
let currentUser = null;
function _lsK(key) {
  var u = currentUser ? currentUser.username : '__g__';
  return u + ':' + key;
}
let currentBoardId = 1;
let currentPage = 1;
let currentPostId = null;
let editingPostId = null;
let editingCommentId = null;
const PAGE_SIZE = 10;

const users = [
  { id:1, username:'admin',  nickname:'관리자', password:'admin', role:'admin', banned:false, timeout:null },
  { id:2, username:'user1',  nickname:'취준청년', password:'1234',  role:'user',  banned:false, timeout:null },
  { id:3, username:'user2',  nickname:'복지왕', password:'1234',  role:'user',  banned:false, timeout:null },
];
let nextUserId = 4;

const boards = [
  { id:1, name:'공지사항',       adminOnly:true  },
  { id:2, name:'복지 신청 후기', adminOnly:false },
  { id:3, name:'질문/답변',      adminOnly:false },
];
let nextBoardId = 4;

const posts = {
  1: [
    { id:1,  boardId:1, title:'[공지] 서비스 정식 오픈 안내',         content:'안녕하세요, 복지체크 팀입니다.\n\n2025년 4월 1일부로 서비스가 정식 오픈되었습니다.\n많은 이용 부탁드립니다.\n\n주요 기능:\n- AI 복지 자가진단\n- 커뮤니티 게시판\n- 맞춤 복지 가이드', authorId:1, pinned:true,  views:420, createdAt:'2025-04-01' },
    { id:2,  boardId:1, title:'[공지] 개인정보처리방침 업데이트',      content:'개인정보처리방침이 2025년 4월 15일부로 업데이트되었습니다.\n자세한 내용은 하단 링크를 참고하세요.', authorId:1, pinned:true,  views:130, createdAt:'2025-04-15' },
    { id:3,  boardId:1, title:'[안내] 복지 DB 정기 업데이트 완료',    content:'2025년 1분기 복지 데이터베이스 정기 업데이트가 완료되었습니다.', authorId:1, pinned:false, views:88,  createdAt:'2025-04-20' },
  ],
  2: [
    { id:4,  boardId:2, title:'구직촉진수당 실제로 받았어요! 후기 공유합니다', content:'안녕하세요! 드디어 구직촉진수당 승인받았습니다.\n\n저는 졸업 후 8개월째 구직 중인 26살인데요,\n복지체크에서 진단받고 바로 신청했더니 2주 만에 승인났어요.\n\n월 50만원씩 6개월간 받을 수 있다고 하네요.\n신청 서류는 다음과 같아요:\n- 주민등록등본\n- 졸업증명서\n- 구직활동확인서\n\n고용센터 직접 방문해야 해서 좀 귀찮긴 한데, 그래도 받을 수 있어서 좋아요!', authorId:2, pinned:false, views:341, createdAt:'2025-04-10' },
    { id:5,  boardId:2, title:'청년내일저축계좌 신청 성공 + 팁 공유',        content:'청년내일저축계좌 신청했어요.\n\n소득 기준이 중위소득 100% 이하여서 저는 딱 걸렸는데,\n주의할 점은 근로/사업 소득이 있어야 한다는 점이에요.\n\n저는 파트타임으로 월 80만원 정도 버는데 OK 받았습니다.\n서류 준비하는 데 생각보다 오래 걸렸어요.', authorId:3, pinned:false, views:215, createdAt:'2025-04-12' },
    { id:6,  boardId:2, title:'주거급여 분리지급 신청 거절당한 후기',         content:'슬픈 후기 공유합니다ㅠㅠ\n부모님이랑 같은 주소지인데 분리지급 안된다고 하더라고요.\n실제로 따로 살아도 주소 분리가 안 되어있으면 안된다고...\n먼저 주소 이전부터 하고 다시 도전해야겠어요.', authorId:2, pinned:false, views:188, createdAt:'2025-04-18' },
    { id:7,  boardId:2, title:'국민취업지원제도 취업성공수당 받은 분 계세요?',  content:'취업성공수당 요건이 어떻게 되는지 아시는 분?', authorId:3, pinned:false, views:94,  createdAt:'2025-04-22' },
  ],
  3: [
    { id:8,  boardId:3, title:'구직촉진수당이랑 청년구직활동지원금 중복 수령 가능한가요?', content:'둘 다 신청하려고 하는데 중복 수령이 가능한지 모르겠어요.\n아는 분 계시면 알려주세요!', authorId:3, pinned:false, views:167, createdAt:'2025-04-14' },
    { id:9,  boardId:3, title:'내일배움카드 훈련 중에 구직촉진수당 받을 수 있나요?',    content:'내일배움카드로 학원 다니면서 구직촉진수당도 같이 받을 수 있나요?', authorId:2, pinned:false, views:122, createdAt:'2025-04-19' },
    { id:10, boardId:3, title:'AI 진단 결과가 실제랑 다른 경우가 있나요?',           content:'진단 결과 믿어도 될까요? 실제 신청했는데 거절된 분 있나요?', authorId:3, pinned:false, views:78,  createdAt:'2025-04-24' },
  ],
};
let nextPostId = 11;

const comments = {
  4:  [
    { id:1,  postId:4, authorId:3, content:'저도 받았어요! 고용센터 예약하고 가면 대기 없이 빠르게 되더라고요', parentId:null, createdAt:'2025-04-11', deleted:false },
    { id:2,  postId:4, authorId:2, content:'예약은 고용24 앱에서 할 수 있어요!', parentId:1, createdAt:'2025-04-11', deleted:false },
    { id:3,  postId:4, authorId:1, content:'좋은 후기 감사합니다. 많은 분들에게 도움이 되길 바랍니다!', parentId:null, createdAt:'2025-04-12', deleted:false },
  ],
  5:  [
    { id:4,  postId:5, authorId:2, content:'소득 기준 자세히 알려주셔서 감사해요', parentId:null, createdAt:'2025-04-13', deleted:false },
  ],
  8:  [
    { id:5,  postId:8, authorId:1, content:'중복 수령은 불가합니다. 구직촉진수당과 청년구직활동지원금은 중복 적용 불가 사업입니다.', parentId:null, createdAt:'2025-04-15', deleted:false },
    { id:6,  postId:8, authorId:3, content:'감사합니다 관리자님!', parentId:5, createdAt:'2025-04-15', deleted:false },
  ],
};
let nextCommentId = 10;

// ============================================================
// 페이지 네비게이션
// ============================================================

function switchMyTab(tabId) {
  ['my-posts-tab','my-likes-tab','my-bookmarks-tab'].forEach(function(id) {
    document.getElementById(id).classList.add('hidden');
  });
  document.getElementById(tabId).classList.remove('hidden');

  // 탭 버튼 스타일
  var btnMap = {'my-posts-tab':'tab-my-posts','my-likes-tab':'tab-my-likes','my-bookmarks-tab':'tab-my-bookmarks'};
  Object.keys(btnMap).forEach(function(tid) {
    var btn = document.getElementById(btnMap[tid]);
    if (tid === tabId) {
      btn.className = 'px-4 py-2 rounded-xl text-sm font-medium bg-primary/10 text-primary transition-all';
    } else {
      btn.className = 'px-4 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground transition-all';
    }
  });

  renderMyTab(tabId);
}

function renderMyTab(tabId) {
  if (!currentUser) return;

  // posts 객체 → 배열로 flatten
  var allPosts = [];
  for (var k in posts) {
    if (Array.isArray(posts[k])) {
      allPosts = allPosts.concat(posts[k]);
    }
  }

  function makeItem(p) {
    var author = users.find(function(u){ return u.id === p.authorId; });
    var authorName = author ? author.nickname : '알수없음';
    var el = document.createElement('div');
    el.style.cssText = 'display:flex;align-items:center;justify-content:space-between;padding:12px 0;border-bottom:1px solid rgba(0,0,0,0.06);cursor:pointer;';
    el.onclick = function() { goPage('community'); setTimeout(function(){ openPost(p.id); }, 150); };
    el.innerHTML =
      '<div style="flex:1;min-width:0;">' +
      '<div style="font-size:13px;font-weight:500;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">' + p.title + '</div>' +
      '<div style="font-size:11px;color:#a1a1aa;margin-top:2px;">' + (p.createdAt||'') + ' · ' + authorName + ' · ♥ ' + (postLikes[p.id]||{count:0}).count + '</div>' +
      '</div>' +
      '<svg style="width:14px;height:14px;flex-shrink:0;margin-left:8px;opacity:0.4;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>';
    return el.outerHTML;
  }

  function empty(msg) {
    return '<div style="text-align:center;padding:32px 0;font-size:13px;color:#a1a1aa;">' + msg + '</div>';
  }

  if (tabId === 'my-posts-tab') {
    var mine = allPosts.filter(function(p) { return p.authorId === currentUser.id; });
    document.getElementById('my-posts-content').innerHTML = mine.length ? mine.map(makeItem).join('') : empty('작성한 게시글이 없어요');

  } else if (tabId === 'my-likes-tab') {
    var liked = allPosts.filter(function(p) { return postLikes[p.id] && postLikes[p.id].liked; });
    document.getElementById('my-likes-content').innerHTML = liked.length ? liked.map(makeItem).join('') : empty('좋아요한 게시글이 없어요');

  } else if (tabId === 'my-bookmarks-tab') {
    var marked = allPosts.filter(function(p) { return typeof bookmarks !== 'undefined' && bookmarks.has(p.id); });
    document.getElementById('my-bookmarks-content').innerHTML = marked.length ? marked.map(makeItem).join('') : empty('북마크한 게시글이 없어요');
  }
}

// 내 정보 페이지 진입 시 탭 렌더
var _origGoPageMypage = null;

function requireLoginThenCommunity() {
  if (typeof markNoticeRead === "function") markNoticeRead();
  if (!currentUser) {
    showToast('커뮤니티는 로그인 후 이용 가능합니다', 'info');
    openModal('modal-login');
    return;
  }
  goPage('community');
}

function toggleFaq(summaryEl) {
  const item = summaryEl.closest('.faq-item');
  const body = item.querySelector('.faq-body');
  const isOpen = item.classList.contains('open');

  // 다른 열린 항목 모두 닫기
  document.querySelectorAll('.faq-item.open').forEach(el => {
    el.classList.remove('open');
    el.querySelector('.faq-body').classList.remove('open');
  });

  // 현재 항목 토글
  if (!isOpen) {
    item.classList.add('open');
    body.classList.add('open');
  }
}

function requireLoginThenDiagnosis() {
  if (!currentUser) {
    showToast('로그인 후 이용 가능합니다', 'info');
    openModal('modal-login');
    return;
  }
  // 메인 입력창 텍스트 가져오기
  var heroInput = document.getElementById('hero-input');
  var heroText = heroInput ? heroInput.value.trim() : '';
  goPage('diagnosis');
  if (heroText) {
    setTimeout(function() {
      var diagInput = document.getElementById('diag-input');
      if (diagInput) {
        diagInput.value = heroText;
        // 바로 분석 실행
        var diagBtn = document.getElementById('diag-btn');
        if (diagBtn) diagBtn.click();
      }
    }, 100);
  }
}

function goHomeAnchor(sectionId) {
  goPage('home');
  setTimeout(() => {
    const el = document.getElementById(sectionId);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }, 50);
}

// 슬라이더 상태
const sliderState = { current: 0 };

function switchBenefitTab(idx, btn) {
  document.querySelectorAll('.benefit-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  for (let i = 0; i < 4; i++) {
    const panel = document.getElementById('benefit-panel-' + i);
    if (!panel) continue;
    panel.classList.toggle('hidden', i !== idx);
    // 모든 패널 카드 transform 리셋
    panel.querySelectorAll('.benefit-card').forEach(c => {
      c.style.transition = 'none';
      c.style.transform = 'translateX(0)';
    });
    // 화살표 가시성: 현재 탭만 보이도록
    const lBtn = document.getElementById('slider-left-' + i);
    const rBtn = document.getElementById('slider-right-' + i);
    if (lBtn) lBtn.classList.toggle('hidden', i !== idx);
    if (rBtn) rBtn.classList.toggle('hidden', i !== idx);
  }
  sliderState.current = 0;
  // 현재 탭 화살표 상태 업데이트
  setTimeout(() => updateSlider(idx), 10);
}

function updateSlider(tabIdx) {
  const panel = document.getElementById('benefit-panel-' + tabIdx);
  if (!panel) return;
  const cards = Array.from(panel.querySelectorAll('.benefit-card'));
  const visible = getVisibleCount();
  const max = Math.max(0, cards.length - visible);
  sliderState.current = Math.min(sliderState.current, max);
  const cardW = cards[0] ? cards[0].offsetWidth : 280;
  const gap = 16;
  cards.forEach(c => {
    c.style.transform = `translateX(calc(-${sliderState.current * (cardW + gap)}px))`;
  });
  const lBtn = document.getElementById('slider-left-' + tabIdx);
  const rBtn = document.getElementById('slider-right-' + tabIdx);
  if (lBtn) lBtn.disabled = sliderState.current === 0;
  if (rBtn) rBtn.disabled = sliderState.current >= max;
}

function getVisibleCount() {
  return window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 3;
}

function slideCards(tabIdx, dir) {
  const panel = document.getElementById('benefit-panel-' + tabIdx);
  if (!panel) return;
  const cards = Array.from(panel.querySelectorAll('.benefit-card'));
  const visible = getVisibleCount();
  const max = Math.max(0, cards.length - visible);
  sliderState.current = Math.max(0, Math.min(max, sliderState.current + dir));
  const cardW = cards[0] ? cards[0].offsetWidth : 280;
  const gap = 16;
  cards.forEach(c => {
    c.style.transition = 'transform .4s cubic-bezier(0.4,0,0.2,1)';
    c.style.transform = `translateX(calc(-${sliderState.current * (cardW + gap)}px))`;
  });
  const lBtn = document.getElementById('slider-left-' + tabIdx);
  const rBtn = document.getElementById('slider-right-' + tabIdx);
  if (lBtn) lBtn.disabled = sliderState.current === 0;
  if (rBtn) rBtn.disabled = sliderState.current >= max;
}

function initSliders() {
  const scrollWrap = document.getElementById('benefit-scroll-wrap');
  if (!scrollWrap) return;

  for (let i = 0; i < 4; i++) {
    const panel = document.getElementById('benefit-panel-' + i);
    if (!panel) continue;

    // 각 탭마다 독립된 화살표 쌍 생성 (중복 방지)
    if (!document.getElementById('slider-left-' + i)) {
      const lBtn = document.createElement('button');
      lBtn.id = 'slider-left-' + i;
      // 현재 탭만 표시 (다른 탭은 switchBenefitTab에서 관리)
      lBtn.className = 'slider-arrow left' + (i !== 0 ? ' hidden' : '');
      lBtn.innerHTML = '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg>';
      lBtn.onclick = () => slideCards(i, -1);

      const rBtn = document.createElement('button');
      rBtn.id = 'slider-right-' + i;
      rBtn.className = 'slider-arrow right' + (i !== 0 ? ' hidden' : '');
      rBtn.innerHTML = '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>';
      rBtn.onclick = () => slideCards(i, 1);

      scrollWrap.appendChild(lBtn);
      scrollWrap.appendChild(rBtn);
    }
    updateSlider(i);
  }
}

// 중복확인 상태
const dupChecked = { id: false, nick: false, email: false };

async function checkDuplicate(field) {
  const inputMap  = { id: 'reg-id', nick: 'reg-nick', email: 'reg-email' };
  const fieldMap  = { id: 'username', nick: 'nickname', email: 'email' };
  const msgMap    = { id: 'reg-id-msg', nick: 'reg-nick-msg', email: 'reg-email-msg' };
  const val    = document.getElementById(inputMap[field]).value.trim();
  const msgEl  = document.getElementById(msgMap[field]);
  msgEl.classList.remove('hidden');

  if (!val) {
    msgEl.textContent = '값을 입력해주세요';
    msgEl.className = 'text-xs mt-1 text-destructive';
    dupChecked[field] = false;
    return;
  }

  // 로딩 표시
  msgEl.textContent = '확인 중...';
  msgEl.className = 'text-xs mt-1 text-muted-foreground';

  try {
    const res = await apiCheckDuplicate(fieldMap[field], val);
    if (res.available) {
      msgEl.textContent = '사용 가능합니다 ✓';
      msgEl.className = 'text-xs mt-1 text-success';
      dupChecked[field] = true;
    } else {
      msgEl.textContent = '이미 사용 중입니다 ✗';
      msgEl.className = 'text-xs mt-1 text-destructive';
      dupChecked[field] = false;
    }
  } catch (e) {
    msgEl.textContent = '확인 실패, 다시 시도해주세요';
    msgEl.className = 'text-xs mt-1 text-destructive';
    dupChecked[field] = false;
  }
}

function goPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const pg = document.getElementById('page-' + name);
  if (pg) {
    pg.classList.add('active');
    window.scrollTo(0, 0);
    document.body.style.overflow = (name === 'diagnosis') ? 'hidden' : '';
  }
  if (name === 'community') renderCommunity();
  if (name === 'admin') { checkAdminAccess(); renderAdmin(); }
  if (name === 'calendar') setTimeout(renderCalendar, 0);
  if (name === 'home') setTimeout(renderRetentionWidget, 0);
}

function checkAdminAccess() {
  if (!currentUser || currentUser.role !== 'ADMIN') {
    goPage('home');
    showToast('관리자만 접근할 수 있습니다', 'error');
  }
}

// ============================================================
// 인증
// ============================================================
async function doLogin() {
  const id = document.getElementById('login-id').value.trim();
  const pw = document.getElementById('login-pw').value;
  const errEl = document.getElementById('login-err');
  errEl.classList.add('hidden');

  if (!id || !pw) {
    errEl.textContent = '아이디와 비밀번호를 입력해주세요';
    errEl.classList.remove('hidden');
    return;
  }

  try {
    const ok = await apiLogin(id, pw);
    if (!ok) {
      errEl.textContent = '아이디 또는 비밀번호가 올바르지 않습니다';
      errEl.classList.remove('hidden');
      return;
    }
    // 로그인 성공 후 내 정보 가져오기
    const me = await apiGetMe();
    if (!me || !me.loggedIn || !me.user) {
      errEl.textContent = '로그인 정보를 불러오지 못했습니다';
      errEl.classList.remove('hidden');
      return;
    }
    currentUser = me.user;
    reloadUserStorage();
    updateNavUI();
    closeModal('modal-login');
    document.getElementById('login-id').value = '';
    document.getElementById('login-pw').value = '';
    showToast(`${currentUser.nickname || currentUser.username}님 환영합니다!`, 'success');
    renderCommunity();
  } catch (e) {
    if (e.message !== 'Unauthorized') {
      errEl.textContent = '로그인 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
      errEl.classList.remove('hidden');
    }
  }
}

async function doRegister() {
  const id    = document.getElementById('reg-id').value.trim();
  const nick  = document.getElementById('reg-nick').value.trim();
  const email = document.getElementById('reg-email').value.trim();
  const pw    = document.getElementById('reg-pw').value;
  const pw2   = document.getElementById('reg-pw2').value;
  const errEl = document.getElementById('reg-err');
  errEl.classList.add('hidden');

  if (!id || !nick || !email || !pw) { errEl.textContent = '모든 항목을 입력해주세요'; errEl.classList.remove('hidden'); return; }
  if (id.length < 4 || id.length > 12) { errEl.textContent = '아이디는 4~12자여야 합니다'; errEl.classList.remove('hidden'); return; }
  if (nick.length < 2 || nick.length > 10) { errEl.textContent = '닉네임은 2~10자여야 합니다'; errEl.classList.remove('hidden'); return; }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { errEl.textContent = '올바른 이메일 형식이 아닙니다'; errEl.classList.remove('hidden'); return; }
  if (pw.length < 4) { errEl.textContent = '비밀번호는 4자 이상이어야 합니다'; errEl.classList.remove('hidden'); return; }
  if (pw !== pw2) { errEl.textContent = '비밀번호가 일치하지 않습니다'; errEl.classList.remove('hidden'); return; }
  if (!dupChecked.id)    { errEl.textContent = '아이디 중복확인을 해주세요'; errEl.classList.remove('hidden'); return; }
  if (!dupChecked.nick)  { errEl.textContent = '닉네임 중복확인을 해주세요'; errEl.classList.remove('hidden'); return; }
  if (!dupChecked.email) { errEl.textContent = '이메일 중복확인을 해주세요'; errEl.classList.remove('hidden'); return; }

  try {
    const res = await apiRegister({ username: id, nickname: nick, email, password: pw });
    if (!res || !res.success) {
      errEl.textContent = (res && res.message) ? res.message : '회원가입에 실패했습니다.';
      errEl.classList.remove('hidden');
      return;
    }
    // 가입 후 자동 로그인
    await apiLogin(id, pw);
    const me = await apiGetMe();
    currentUser = (me && me.loggedIn && me.user) ? me.user : me;
    reloadUserStorage();
    dupChecked.id = false; dupChecked.nick = false; dupChecked.email = false;
    updateNavUI();
    ['reg-id','reg-nick','reg-email','reg-pw','reg-pw2'].forEach(i => document.getElementById(i).value = '');
    ['reg-id-msg','reg-nick-msg','reg-email-msg'].forEach(i => document.getElementById(i).classList.add('hidden'));
    showToast(`${nick}님 가입을 환영합니다!`, 'success');
    goPage('home');
  } catch (e) {
    errEl.textContent = '회원가입 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
    errEl.classList.remove('hidden');
  }
}

async function logout() {
  try {
    await apiLogout();
  } catch (e) {
    // 로그아웃 API 실패해도 클라이언트 상태는 초기화
  }
  currentUser = null;
  reloadUserStorage();
  updateNavUI();
  goPage('home');
  showToast('로그아웃 되었습니다', 'info');
}

function updateNavUI() {
  const isLoggedIn = !!currentUser;
  document.getElementById('nav-guest').classList.toggle('hidden', isLoggedIn);
  document.getElementById('nav-user').classList.toggle('hidden', !isLoggedIn);
  document.getElementById('nav-user').classList.toggle('flex', isLoggedIn);
  if (isLoggedIn) document.getElementById('nav-username').textContent = currentUser.nickname;
  const adminBtn = document.getElementById('nav-admin-btn');
  adminBtn.classList.toggle('hidden', !(isLoggedIn && currentUser.role === 'ADMIN'));
}

// ============================================================
// 커뮤니티 렌더링
// ============================================================
function renderCommunity() {
  setTimeout(function(){ if(typeof renderPopularPosts==="function") renderPopularPosts(); }, 0);
  renderBoardTabs();
  renderBoard();
  // 글쓰기 버튼
  const btn = document.getElementById('btn-write-post');
  const board = boards.find(b => b.id === currentBoardId);
  const canWrite = currentUser && !(board && board.adminOnly && currentUser.role !== 'ADMIN');
  btn.classList.toggle('hidden', !canWrite);
  btn.classList.toggle('flex', canWrite);
  // 게시판 추가 버튼
  const addBtn = document.getElementById('btn-add-board');
  addBtn.classList.toggle('hidden', !(currentUser && currentUser.role === 'ADMIN'));
}

function renderBoardTabs() {
  const tabs = document.getElementById('board-tabs');
  tabs.innerHTML = boards.map(b => `
    <button onclick="switchBoard(${b.id})" class="tab-btn px-5 py-3 text-sm font-medium text-muted-foreground whitespace-nowrap ${b.id === currentBoardId ? 'active' : ''}">
      ${b.name}
      ${b.adminOnly ? '<span class="ml-1 text-[10px] text-primary/60">[공지]</span>' : ''}
    </button>`).join('');
}

function switchBoard(id) {
  currentBoardId = id;
  currentPage = 1;
  document.getElementById('board-search').value = '';
  renderCommunity();
}

function renderBoard() {
  const board = boards.find(b => b.id === currentBoardId);
  const q = document.getElementById('board-search').value.toLowerCase();
  let allPosts = posts[currentBoardId] || [];

  if (q) allPosts = allPosts.filter(p => p.title.toLowerCase().includes(q) || p.content.toLowerCase().includes(q));

  const pinned   = allPosts.filter(p => p.pinned);
  const normal   = allPosts.filter(p => !p.pinned);
  const totalNormal = normal.length;
  const totalPages = Math.max(1, Math.ceil(totalNormal / PAGE_SIZE));
  currentPage = Math.min(currentPage, totalPages);

  const pageNormal = normal.slice((currentPage-1)*PAGE_SIZE, currentPage*PAGE_SIZE);
  const display = [...pinned, ...pageNormal];

  const body = document.getElementById('post-list-body');
  if (display.length === 0) {
    body.innerHTML = `<div class="text-center py-16 text-muted-foreground text-sm">게시글이 없습니다</div>`;
  } else {
    body.innerHTML = display.map((p, i) => {
      const author = users.find(u => u.id === p.authorId);
      const commentCount = (comments[p.id] || []).filter(c => !c.deleted).length;
      const rowNum = p.pinned ? '' : (totalNormal - (currentPage-1)*PAGE_SIZE - (pageNormal.indexOf(p)));
      const authorDisplay = p.author || (author ? author.nickname : '알수없음');
      const authorEmoji = p.authorEmoji || (author ? author.nicknameEmoji || '' : '');
      return `
      <div class="post-row grid border-b border-border/50 last:border-0 px-5 py-3.5 cursor-pointer ${p.pinned ? 'pinned' : ''}"
           onclick="openPost(${p.id})"
           style="grid-template-columns:60px 1fr 100px 70px 60px 60px">
        <span class="text-xs text-muted-foreground flex items-center gap-1.5">
          ${p.pinned ? '<span class="badge-pin">공지</span>' : rowNum}
        </span>
        <span class="text-sm font-medium truncate pr-4 flex items-center gap-2">
          ${p.title}
          ${commentCount > 0 ? `<span class="text-primary text-xs font-bold">[${commentCount}]</span>` : ''}
        </span>
        <span class="text-xs text-muted-foreground flex items-center">
          ${authorEmoji ? authorEmoji + ' ' : ''}${authorDisplay}
          ${author && author.role === 'ADMIN' ? '<span class="badge-admin ml-1">관리자</span>' : ''}
        </span>
        <span class="text-xs text-muted-foreground text-center flex items-center justify-center">${p.createdAt.slice(5)}</span>
        <span class="text-xs text-muted-foreground text-center flex items-center justify-center">${p.views}</span>
        <span class="text-xs text-muted-foreground text-center flex items-center justify-center">${commentCount}</span>
      </div>`;
    }).join('');
  }

  // 페이지네이션 (일반 글만)
  renderPagination(totalPages);
}

function renderPagination(totalPages) {
  const pg = document.getElementById('pagination');
  if (totalPages <= 1) { pg.innerHTML = ''; return; }
  let html = '';
  const start = Math.max(1, currentPage - 4);
  const end   = Math.min(totalPages, currentPage + 4);
  if (currentPage > 1) html += `<button onclick="changePage(${currentPage-1})" class="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground border border-border rounded-lg transition-colors">‹</button>`;
  for (let i = start; i <= end; i++) {
    html += `<button onclick="changePage(${i})" class="px-3 py-1.5 text-sm border rounded-lg transition-colors ${i===currentPage ? 'bg-primary text-background border-primary font-semibold' : 'text-muted-foreground hover:text-foreground border-border'}">${i}</button>`;
  }
  if (currentPage < totalPages) html += `<button onclick="changePage(${currentPage+1})" class="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground border border-border rounded-lg transition-colors">›</button>`;
  pg.innerHTML = html;
}

function changePage(p) {
  currentPage = p;
  renderBoard();
  window.scrollTo(0, 0);
}

// ============================================================
// 게시글 상세
// ============================================================
function openPost(postId) {
  currentPostId = postId;
  let post = null;
  for (const bid in posts) {
    post = posts[bid].find(p => p.id === postId);
    if (post) break;
  }
  if (!post) return;

  // 조회수 증가
  post.views++;

  const author = users.find(u => u.id === post.authorId);
  const board  = boards.find(b => b.id === post.boardId);
  const isOwner = currentUser && (currentUser.id === post.authorId || currentUser.role === 'ADMIN');
  const isAdmin = currentUser && currentUser.role === 'ADMIN';
  const postAuthorName = post.author || (author ? author.nickname : '알수없음');
  const postAuthorEmoji = post.authorEmoji || (author ? author.nicknameEmoji || '' : '');

  document.getElementById('post-detail-content').innerHTML = `
    <div class="bg-card border border-border rounded-2xl overflow-hidden mb-8">
      <div class="p-6 border-b border-border">
        <div class="flex items-start gap-3 mb-4">
          <span class="px-2.5 py-1 bg-primary/10 text-primary text-xs font-medium rounded-lg">${board ? board.name : ''}</span>
          ${post.pinned ? '<span class="badge-pin px-2.5 py-1 rounded-lg text-xs">📌 고정</span>' : ''}
        </div>
        <h1 class="text-xl font-bold mb-4">${post.title}</h1>
        <div class="flex items-center justify-between flex-wrap gap-3">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary">${postAuthorEmoji || postAuthorName[0] || '?'}</div>
            <div>
              <div class="text-sm font-medium flex items-center gap-1.5">
                ${postAuthorEmoji ? postAuthorEmoji + ' ' : ''}${postAuthorName}
                ${author && author.role === 'ADMIN' ? '<span class="badge-admin">관리자</span>' : ''}
              </div>
              <div class="text-xs text-muted-foreground">${post.createdAt} · 조회 ${post.views}</div>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <button onclick="toggleLikePost()" id="like-btn-post" class="flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-lg text-xs text-muted-foreground hover:border-rose-400/40 hover:text-rose-400 transition-all">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
              <span id="like-count-post">0</span>
            </button>
            <button onclick="toggleBookmarkPost()" id="bookmark-btn-post" class="flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-lg text-xs text-muted-foreground hover:border-yellow-400/40 hover:text-yellow-400 transition-all">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/></svg>
            </button>
            ${isAdmin ? `<button onclick="togglePin(${post.id})" class="px-3 py-1.5 text-xs border border-border rounded-lg hover:bg-muted/50 transition-colors">${post.pinned ? '📌 고정해제' : '📌 고정'}</button>` : ''}
            ${currentUser && currentUser.id === post.authorId ? `<button onclick="goEditPost(${post.id})" class="px-3 py-1.5 text-xs border border-border rounded-lg hover:bg-muted/50 transition-colors">수정</button>` : ''}
            ${currentUser && currentUser.id === post.authorId ? `<button onclick="boostPost(${post.id})" class="px-3 py-1.5 text-xs bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors" title="50P로 3일간 상단 노출">⚡ 부스트</button>` : ''}
            ${isOwner ? `<button onclick="deletePost(${post.id})" class="px-3 py-1.5 text-xs bg-destructive/10 text-destructive rounded-lg hover:bg-destructive/20 transition-colors">삭제</button>` : ''}
          </div>
        </div>
      </div>
      <div class="p-6">
        <div class="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap">${escHtml(post.content)}</div>
      </div>
    </div>`;

  renderComments(postId);

  // 댓글 폼
  const formWrap = document.getElementById('comment-form-wrap');
  const loginNotice = document.getElementById('comment-login-notice');
  if (currentUser) {
    formWrap.classList.remove('hidden');
    loginNotice.classList.add('hidden');
    const _commentEmoji = currentUser.nicknameEmoji || '';
    document.getElementById('comment-avatar').textContent = _commentEmoji || (currentUser.nickname[0] || '?');
    document.getElementById('comment-author-name').textContent = _commentEmoji ? _commentEmoji + ' ' + currentUser.nickname : currentUser.nickname;
    document.getElementById('comment-input').value = '';
  } else {
    formWrap.classList.add('hidden');
    loginNotice.classList.remove('hidden');
  }

  goPage('post-detail');
}

function renderComments(postId) {
  const allComments = (comments[postId] || []);
  const roots = allComments.filter(c => !c.parentId && !c.deleted);
  const label = document.getElementById('comment-count-label');
  const total = allComments.filter(c => !c.deleted).length;
  label.textContent = `댓글 ${total}개`;

  const list = document.getElementById('comment-list');
  if (allComments.filter(c => !c.deleted).length === 0) {
    list.innerHTML = `<div class="text-center py-8 text-sm text-muted-foreground">아직 댓글이 없습니다</div>`;
    return;
  }

  list.innerHTML = roots.map(c => renderComment(c, allComments)).join('');
}

function renderComment(c, allComments) {
  const author = users.find(u => u.id === c.authorId);
  const isOwner = currentUser && (currentUser.id === c.authorId || currentUser.role === 'ADMIN');
  const replies = allComments.filter(r => r.parentId === c.id && !r.deleted);
  const cAuthorName = c.author || (author ? author.nickname : '알수없음');
  const cAuthorEmoji = c.authorEmoji || (author ? author.nicknameEmoji || '' : '');

  return `
    <div class="bg-card border border-border rounded-xl p-4">
      <div class="flex items-start gap-3">
        <div class="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center text-xs font-bold text-primary flex-shrink-0">${cAuthorEmoji || cAuthorName[0] || '?'}</div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 mb-1.5">
            <span class="text-sm font-medium">${cAuthorEmoji ? cAuthorEmoji + ' ' : ''}${cAuthorName}</span>
            ${author && author.role === 'ADMIN' ? '<span class="badge-admin">관리자</span>' : ''}
            <span class="text-xs text-muted-foreground">${c.createdAt}</span>
          </div>
          <p class="text-sm text-foreground/90 leading-relaxed">${escHtml(c.content)}</p>
          <div class="flex items-center gap-3 mt-2.5">
            ${currentUser ? `<button onclick="openReplyModal(${c.id},'${cAuthorName}')" class="text-xs text-muted-foreground hover:text-primary transition-colors">↩ 대댓글</button>` : ''}
            ${currentUser && currentUser.id === c.authorId ? `<button onclick="editComment(${c.id})" class="text-xs text-muted-foreground hover:text-foreground transition-colors">수정</button>` : ''}
            ${isOwner ? `<button onclick="deleteComment(${c.id})" class="text-xs text-muted-foreground hover:text-destructive transition-colors">삭제</button>` : ''}
          </div>
        </div>
      </div>
      ${replies.length > 0 ? `<div class="reply-indent mt-3 space-y-3">${replies.map(r => renderReply(r)).join('')}</div>` : ''}
    </div>`;
}

function renderReply(r) {
  const author = users.find(u => u.id === r.authorId);
  const isOwner = currentUser && (currentUser.id === r.authorId || currentUser.role === 'ADMIN');
  const rAuthorName = r.author || (author ? author.nickname : '알수없음');
  const rAuthorEmoji = r.authorEmoji || (author ? author.nicknameEmoji || '' : '');
  return `
    <div class="flex items-start gap-3">
      <div class="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground flex-shrink-0">${rAuthorEmoji || rAuthorName[0] || '?'}</div>
      <div class="flex-1">
        <div class="flex items-center gap-2 mb-1">
          <span class="text-sm font-medium">${rAuthorEmoji ? rAuthorEmoji + ' ' : ''}${rAuthorName}</span>
          ${author && author.role === 'ADMIN' ? '<span class="badge-admin">관리자</span>' : ''}
          <span class="text-xs text-muted-foreground">${r.createdAt}</span>
        </div>
        <p class="text-sm text-foreground/90">${escHtml(r.content)}</p>
        <div class="flex items-center gap-3 mt-2">
          ${isOwner ? `<button onclick="deleteComment(${r.id})" class="text-xs text-muted-foreground hover:text-destructive transition-colors">삭제</button>` : ''}
        </div>
      </div>
    </div>`;
}

function togglePin(postId) {
  for (const bid in posts) {
    const p = posts[bid].find(p => p.id === postId);
    if (p) { p.pinned = !p.pinned; break; }
  }
  openPost(postId);
  showToast(posts[Object.keys(posts).find(bid => posts[bid].find(p => p.id === postId))]?.find(p => p.id === postId)?.pinned ? '공지가 고정되었습니다' : '고정이 해제되었습니다', 'success');
}

function deletePost(postId) {
  if (!confirm('게시글을 삭제하시겠습니까?')) return;
  for (const bid in posts) {
    const idx = posts[bid].findIndex(p => p.id === postId);
    if (idx !== -1) { posts[bid].splice(idx, 1); break; }
  }
  delete comments[postId];
  showToast('게시글이 삭제되었습니다', 'success');
  goPage('community');
}

// ============================================================
// 댓글
// ============================================================
function submitComment(parentId) {
  if (!currentUser) { openModal('modal-login'); return; }
  const input = document.getElementById('comment-input');
  const text = input.value.trim();
  if (!text) { showToast('댓글을 입력해주세요', 'error'); return; }

  if (!comments[currentPostId]) comments[currentPostId] = [];
  comments[currentPostId].push({
    id: nextCommentId++, postId: currentPostId, authorId: currentUser.id,
    author: currentUser.nickname || currentUser.username,
    authorEmoji: currentUser.nicknameEmoji || '',
    content: text, parentId: parentId, createdAt: today(), deleted: false
  });
  input.value = '';
  renderComments(currentPostId);
  showToast('댓글이 등록되었습니다', 'success');
}

function openReplyModal(commentId, targetNick) {
  if (!currentUser) { openModal('modal-login'); return; }
  document.getElementById('reply-target-comment-id').value = commentId;
  document.getElementById('reply-to-label').textContent = `@${targetNick} 에게 답글`;
  document.getElementById('reply-input').value = '';
  openModal('modal-reply');
}

function submitReply() {
  const commentId = parseInt(document.getElementById('reply-target-comment-id').value);
  const text = document.getElementById('reply-input').value.trim();
  if (!text) { showToast('내용을 입력해주세요', 'error'); return; }

  if (!comments[currentPostId]) comments[currentPostId] = [];
  comments[currentPostId].push({
    id: nextCommentId++, postId: currentPostId, authorId: currentUser.id,
    author: currentUser.nickname || currentUser.username,
    authorEmoji: currentUser.nicknameEmoji || '',
    content: text, parentId: commentId, createdAt: today(), deleted: false
  });
  closeModal('modal-reply');
  renderComments(currentPostId);
  showToast('대댓글이 등록되었습니다', 'success');
}

function editComment(commentId) {
  const allComments = comments[currentPostId] || [];
  const c = allComments.find(c => c.id === commentId);
  if (!c) return;
  const newText = prompt('댓글 수정:', c.content);
  if (newText === null || newText.trim() === '') return;
  c.content = newText.trim();
  renderComments(currentPostId);
  showToast('댓글이 수정되었습니다', 'success');
}

function deleteComment(commentId) {
  if (!confirm('댓글을 삭제하시겠습니까?')) return;
  const allComments = comments[currentPostId] || [];
  const c = allComments.find(c => c.id === commentId);
  if (c) c.deleted = true;
  renderComments(currentPostId);
  showToast('댓글이 삭제되었습니다', 'success');
}

// ============================================================
// 게시글 작성/수정
// ============================================================
function goWritePost() {
  if (!currentUser) { openModal('modal-login'); return; }
  editingPostId = null;
  document.getElementById('write-page-title').textContent = '글쓰기';
  document.getElementById('write-submit-btn').textContent = '등록';
  document.getElementById('write-title').value = '';
  document.getElementById('write-content').value = '';
  document.getElementById('write-err').classList.add('hidden');

  // 게시판 셀렉트 채우기
  const sel = document.getElementById('write-board');
  const writableBoards = boards.filter(b => !b.adminOnly || (currentUser && currentUser.role === 'ADMIN'));
  sel.innerHTML = writableBoards.map(b => `<option value="${b.id}" ${b.id === currentBoardId ? 'selected' : ''}>${b.name}</option>`).join('');

  goPage('post-write');
}

function goEditPost(postId) {
  if (!currentUser) return;
  let post = null;
  for (const bid in posts) { post = posts[bid].find(p => p.id === postId); if (post) break; }
  if (!post) return;

  editingPostId = postId;
  document.getElementById('write-page-title').textContent = '게시글 수정';
  document.getElementById('write-submit-btn').textContent = '수정 완료';
  document.getElementById('write-title').value = post.title;
  document.getElementById('write-content').value = post.content;
  document.getElementById('write-err').classList.add('hidden');

  const sel = document.getElementById('write-board');
  sel.innerHTML = boards.map(b => `<option value="${b.id}" ${b.id === post.boardId ? 'selected' : ''}>${b.name}</option>`).join('');
  sel.disabled = true;

  goPage('post-write');
}

function submitPost() {
  const title   = document.getElementById('write-title').value.trim();
  const content = document.getElementById('write-content').value.trim();
  const boardId = parseInt(document.getElementById('write-board').value);
  const errEl   = document.getElementById('write-err');
  errEl.classList.add('hidden');

  if (!title) { errEl.textContent = '제목을 입력해주세요'; errEl.classList.remove('hidden'); return; }
  if (!content) { errEl.textContent = '내용을 입력해주세요'; errEl.classList.remove('hidden'); return; }
  if (!currentUser) { openModal('modal-login'); return; }

  if (editingPostId) {
    // 수정
    for (const bid in posts) {
      const p = posts[bid].find(p => p.id === editingPostId);
      if (p) { p.title = title; p.content = content; break; }
    }
    showToast('게시글이 수정되었습니다', 'success');
    openPost(editingPostId);
  } else {
    // 신청
    const board = boards.find(b => b.id === boardId);
    if (board && board.adminOnly && currentUser.role !== 'ADMIN') {
      errEl.textContent = '관리자만 작성할 수 있는 게시판입니다'; errEl.classList.remove('hidden'); return;
    }
    const newPost = { id: nextPostId++, boardId, title, content, authorId: currentUser.id, pinned: false, views: 0, createdAt: today() };
    if (!posts[boardId]) posts[boardId] = [];
    posts[boardId].unshift(newPost);
    currentBoardId = boardId;
    showToast('게시글이 등록되었습니다', 'success');
    goPage('community');
  }
  document.getElementById('write-board').disabled = false;
}

// ============================================================
// 관리자
// ============================================================
function switchAdminTab(tab) {
  document.querySelectorAll('.admin-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
  document.getElementById('admin-tab-boards').classList.toggle('hidden', tab !== 'boards');
  document.getElementById('admin-tab-users').classList.toggle('hidden', tab !== 'users');
  if (tab === 'boards') renderAdminBoards();
  if (tab === 'users')  renderAdminUsers();
}

function renderAdmin() {
  renderAdminBoards();
  renderAdminUsers();
}

function renderAdminBoards() {
  const el = document.getElementById('admin-board-list');
  el.innerHTML = boards.map(b => `
    <div class="flex items-center justify-between px-6 py-4 border-b border-border/50 last:border-0">
      <div class="flex items-center gap-3">
        <span class="font-medium text-sm">${b.name}</span>
        ${b.adminOnly ? '<span class="badge-pin">공지전용</span>' : ''}
      </div>
      <div class="flex items-center gap-2">
        <span class="text-xs text-muted-foreground">${(posts[b.id] || []).length}개 글</span>
        ${b.id > 3 ? `<button onclick="deleteBoard(${b.id})" class="px-3 py-1.5 text-xs bg-destructive/10 text-destructive rounded-lg hover:bg-destructive/20 transition-colors">삭제</button>` : '<span class="text-xs text-muted-foreground/50 px-3">기본 게시판</span>'}
      </div>
    </div>`).join('');
}

function renderAdminUsers() {
  const el = document.getElementById('admin-user-list');
  el.innerHTML = users.map(u => {
    const isSelf = currentUser && u.id === currentUser.id;
    const timeoutStr = u.timeout ? `(${u.timeout}까지)` : '';
    return `
    <div class="flex items-center justify-between px-6 py-4 border-b border-border/50 last:border-0 ${u.banned ? 'opacity-50' : ''}">
      <div class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center text-sm font-bold text-primary">${u.nickname[0]}</div>
        <div>
          <div class="text-sm font-medium flex items-center gap-1.5">
            ${u.nickname}
            ${u.role === 'admin' ? '<span class="badge-admin">관리자</span>' : ''}
            ${u.banned ? '<span class="badge-banned">강제탈퇴</span>' : ''}
            ${!u.banned && u.timeout && new Date(u.timeout) > new Date() ? `<span class="badge-timeout">정지중 ${timeoutStr}</span>` : ''}
          </div>
          <div class="text-xs text-muted-foreground">@${u.username}</div>
        </div>
      </div>
      ${isSelf || u.role === 'admin' ? '<span class="text-xs text-muted-foreground">본인/관리자</span>' : `
      <div class="flex items-center gap-2">
        ${u.banned ? `<button onclick="unbanUser(${u.id})" class="px-3 py-1.5 text-xs border border-border rounded-lg hover:bg-muted/50 transition-colors">복구</button>` : `
          <button onclick="openTimeoutModal(${u.id})" class="px-3 py-1.5 text-xs bg-warning/10 text-warning rounded-lg hover:bg-warning/20 transition-colors">정지</button>
          <button onclick="banUser(${u.id})" class="px-3 py-1.5 text-xs bg-destructive/10 text-destructive rounded-lg hover:bg-destructive/20 transition-colors">강제탈퇴</button>`}
      </div>`}
    </div>`;
  }).join('');
}

function openAddBoard() {
  document.getElementById('new-board-name').value = '';
  document.getElementById('new-board-admin-only').checked = false;
  openModal('modal-add-board');
}

function doAddBoard() {
  const name = document.getElementById('new-board-name').value.trim();
  if (!name) { showToast('게시판 이름을 입력해주세요', 'error'); return; }
  const adminOnly = document.getElementById('new-board-admin-only').checked;
  const newBoard = { id: nextBoardId++, name, adminOnly };
  boards.push(newBoard);
  posts[newBoard.id] = [];
  closeModal('modal-add-board');
  showToast(`'${name}' 게시판이 생성되었습니다`, 'success');
  currentBoardId = newBoard.id;
  renderCommunity();
  renderAdminBoards();
}

function deleteBoard(boardId) {
  if (!confirm('게시판을 삭제하면 모든 게시글도 삭제됩니다. 계속하시겠습니까?')) return;
  const idx = boards.findIndex(b => b.id === boardId);
  if (idx !== -1) boards.splice(idx, 1);
  delete posts[boardId];
  if (currentBoardId === boardId) currentBoardId = boards[0]?.id || 1;
  showToast('게시판이 삭제되었습니다', 'success');
  renderAdminBoards();
  renderCommunity();
}

function openTimeoutModal(userId) {
  document.getElementById('timeout-target-id').value = userId;
  openModal('modal-timeout');
}

function doTimeout() {
  const userId = parseInt(document.getElementById('timeout-target-id').value);
  const days   = parseInt(document.querySelector('input[name="timeout-dur"]:checked').value);
  const user   = users.find(u => u.id === userId);
  if (!user) return;
  const until = new Date(); until.setDate(until.getDate() + days);
  user.timeout = until.toISOString().slice(0,10);
  closeModal('modal-timeout');
  showToast(`${user.nickname}님이 ${days}일 정지되었습니다`, 'success');
  renderAdminUsers();
}

function banUser(userId) {
  const user = users.find(u => u.id === userId);
  if (!user) return;
  if (!confirm(`${user.nickname}님을 강제탈퇴 시키겠습니까?`)) return;
  user.banned = true;
  showToast(`${user.nickname}님이 강제탈퇴 처리되었습니다`, 'success');
  renderAdminUsers();
}

function unbanUser(userId) {
  const user = users.find(u => u.id === userId);
  if (!user) return;
  user.banned = false; user.timeout = null;
  showToast(`${user.nickname}님이 복구되었습니다`, 'success');
  renderAdminUsers();
}

// ============================================================
// AI 진단 (기존 로직 유지)
// ============================================================
const MOCK = {
  default: {
    parse:'미취업 졸업생 · 부모 동거 가구 · 비정기 소득 · 구직기간 6개월로 파악했어요',
    count:3, amount:'연 312만원', deadline:'D-14',
    services:[
      { num:'01', name:'구직촉진수당', badge:'자격 확인됨', badgeCls:'bg-success/10 text-success',
        desc:'고용보험 미가입 구직자 대상. 워크넷 구직 등록 후 고용센터 방문 신청. 월 50만원 × 최대 6개월.',
        tags:[{t:'D-14 마감',c:'bg-destructive/10 text-destructive'},{t:'주민등록등본',c:'bg-blue-500/10 text-blue-400'},{t:'졸업증명서',c:'bg-blue-500/10 text-blue-400'}],
        amtLbl:'최대 수령액', amt:'300만원', url:'https://www.work.go.kr' },
      { num:'02', name:'청년내일저축계좌', badge:'소득 기준 검토', badgeCls:'bg-warning/10 text-warning',
        desc:'월 10만원 저축 시 정부 월 30만원 매칭. 3년 만기 후 1,440만원.',
        tags:[{t:'소득확인서류',c:'bg-blue-500/10 text-blue-400'},{t:'통장사본',c:'bg-blue-500/10 text-blue-400'}],
        amtLbl:'3년 만기', amt:'1,440만원', url:'https://www.bokjiro.go.kr' },
      { num:'03', name:'청년 월세 특별지원', badge:'조건부 가능', badgeCls:'bg-muted text-muted-foreground',
        desc:'독립 거주 청년 대상. 현재 부모 동거 중이므로 독립 후 즉시 신청 가능.',
        tags:[{t:'임대차계약서',c:'bg-blue-500/10 text-blue-400'},{t:'독립 거주 필요',c:'bg-muted text-muted-foreground'}],
        amtLbl:'월 최대', amt:'20만원', url:'https://www.bokjiro.go.kr' },
    ]
  },
  freelancer: {
    parse:'27세 프리랜서 · 독립 거주 · 월 100만원 소득 · 중위소득 60% 이하 추정',
    count:2, amount:'연 240만원', deadline:'D-30',
    services:[
      { num:'01', name:'청년 월세 특별지원', badge:'자격 확인됨', badgeCls:'bg-success/10 text-success',
        desc:'독립 거주 청년 대상. 월 소득 기준 충족. 월 최대 20만원 최대 12개월.',
        tags:[{t:'D-30 마감',c:'bg-destructive/10 text-destructive'},{t:'임대차계약서',c:'bg-blue-500/10 text-blue-400'}],
        amtLbl:'연간 최대', amt:'240만원', url:'https://www.bokjiro.go.kr' },
      { num:'02', name:'청년내일저축계좌', badge:'자격 확인됨', badgeCls:'bg-success/10 text-success',
        desc:'프리랜서 소득 100만원은 중위소득 기준 충족. 월 10만원 저축 시 정부 30만원 매칭.',
        tags:[{t:'소득확인서류',c:'bg-blue-500/10 text-blue-400'},{t:'통장사본',c:'bg-blue-500/10 text-blue-400'}],
        amtLbl:'3년 만기', amt:'1,440만원', url:'https://www.bokjiro.go.kr' },
    ]
  }
};

function resetDiagnosis() {
  const input = document.getElementById('diag-input');
  if (input) { input.value = ''; input.focus(); }
  showDiagState('s-empty');
}

function showDiagState(id) {
  ['s-empty','s-loading','s-result'].forEach(s => {
    const el = document.getElementById(s); el.classList.add('hidden'); el.classList.remove('flex');
  });
  const t = document.getElementById(id); t.classList.remove('hidden'); t.classList.add('flex');
}

async function runDiagnosis() {
  const v = document.getElementById('diag-input').value.trim();
  if (!v) { document.getElementById('diag-input').focus(); return; }

  document.getElementById('diag-btn').disabled = true;
  showDiagState('s-loading');
  const loadStart = Date.now();

  const waitRemaining = () => {
    const elapsed = Date.now() - loadStart;
    return elapsed < 800 ? new Promise(r => setTimeout(r, 800 - elapsed)) : Promise.resolve();
  };

  try {
    const res = await apiDiagnose(v);
    if (!res || !res.success) {
      throw new Error(res && res.message ? res.message : 'AI 분석에 실패했습니다.');
    }
    await waitRemaining();
    const d = res.result;
    renderDiagnosisResult(d, v);
  } catch (e) {
    await waitRemaining();
    showDiagState('s-empty');
    showToast(e.message || 'AI 분석 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.', 'error');
  } finally {
    document.getElementById('diag-btn').disabled = false;
  }
}

function renderDiagnosisResult(d, inputText) {
  document.getElementById('r-parse').textContent = d.parse || '';
  document.getElementById('r-count').textContent = d.count || 0;
  document.getElementById('r-amount').textContent = d.amount || '정보 없음';
  document.getElementById('r-deadline').textContent = d.deadline || '상시';
  document.getElementById('r-title').textContent = `수혜 목록 — ${d.count || 0}건`;

  const services = Array.isArray(d.services) ? d.services : [];
  window._diagServices = services;
  document.getElementById('r-cards').innerHTML = services.map((s, idx) => {
    const isWished = Array.isArray(wishList) && wishList.some(w => w.name === s.name);
    const wishStyle = isWished
      ? 'color:#f43f5e;border-color:rgba(244,63,94,0.4);background:rgba(244,63,94,0.1);'
      : '';
    const heartFill = isWished ? 'currentColor' : 'none';
    const startDate = today();
    const endDate = todayPlusDays ? todayPlusDays(180) : today();
    const num = String(idx + 1).padStart(2, '0');
    const url = s.url || 'https://www.bokjiro.go.kr';
    const safeAttr = (v) => (v || '').replace(/'/g, '&#39;');
    return `
    <div class="bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/30 transition-colors">
      <div class="p-6">
        <div class="flex items-center gap-3 mb-3 flex-wrap">
          <span class="text-xs text-muted-foreground font-mono">${num}</span>
          <h3 class="font-bold text-lg">${escHtml(s.name || '')}</h3>
          <span class="text-xs px-2.5 py-1 rounded-full font-medium bg-success/10 text-success">자격 확인됨</span>
        </div>
        <p class="text-sm text-muted-foreground leading-relaxed mb-4">${escHtml(s.reason || '')}</p>
        <div class="flex flex-wrap gap-2 mb-4">
          ${s.period ? `<span class="text-xs px-2.5 py-1 rounded-lg bg-primary/10 text-primary">${escHtml(s.period)}</span>` : ''}
          ${s.deadline && s.deadline !== '정보 없음' ? `<span class="text-xs px-2.5 py-1 rounded-lg bg-destructive/10 text-destructive">마감: ${escHtml(s.deadline)}</span>` : ''}
        </div>
        <div class="flex items-center justify-between pt-4 border-t border-border">
          <div>
            <div class="text-xs text-muted-foreground mb-1">지원 금액</div>
            <div class="text-xl font-bold text-primary">${escHtml(s.amt || '정보 없음')}</div>
          </div>
          <div class="flex items-center gap-2">
            <button onclick="toggleWish(event,'${safeAttr(s.name)}','${safeAttr(s.amt)}','${startDate}','${endDate}')"
              class="wish-btn w-9 h-9 rounded-xl border border-border flex items-center justify-center hover:bg-rose-500/10 hover:border-rose-500/40 transition-colors"
              style="${wishStyle}" data-name="${safeAttr(s.name)}" title="찜하기">
              <svg class="w-4 h-4" fill="${heartFill}" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
            </button>
            <button onclick="openBenefitDetail(${idx})"
              class="px-4 py-2 bg-primary/10 text-primary text-sm font-medium rounded-xl hover:bg-primary/20 transition-colors">
              상세보기
            </button>
          </div>
        </div>
      </div>
    </div>`;
  }).join('');

  showDiagState('s-result');
  document.getElementById('right-panel').scrollTop = 0;

  // 찜 상태 동기화
  if (Array.isArray(wishList)) {
    wishList.forEach(w => {
      document.querySelectorAll('.wish-btn[data-name="' + w.name + '"]').forEach(b => {
        b.querySelector('svg').setAttribute('fill', 'currentColor');
        b.style.color = '#f43f5e';
        b.style.borderColor = 'rgba(244,63,94,0.4)';
        b.style.background = 'rgba(244,63,94,0.1)';
      });
    });
  }

  const simWrap = document.getElementById('similar-wrap');
  if (simWrap) simWrap.classList.remove('hidden');
  if (typeof renderSimilarCases === 'function') renderSimilarCases(inputText);
  if (typeof saveDiagHistory === 'function') saveDiagHistory(inputText, d);
}

// ============================================================
// 유틸
// ============================================================
function openModal(id) { document.getElementById(id).classList.add('open'); }
function closeModal(id) { const el = document.getElementById(id); el.classList.remove('open'); el.style.display = ''; }
function handleOverlayClick(e, id) { if (e.target === document.getElementById(id)) closeModal(id); }

let toastTimer;
function showToast(msg, type='info') {
  const icons = { success:'✓', error:'✕', info:'ℹ' };
  const colors = { success:'text-success', error:'text-destructive', info:'text-primary' };
  document.getElementById('toast-icon').className = colors[type] + ' font-bold';
  document.getElementById('toast-icon').textContent = icons[type];
  document.getElementById('toast-msg').textContent = msg;
  const t = document.getElementById('toast');
  t.classList.remove('hidden');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.add('hidden'), 3000);
}

function today() { return new Date().toISOString().slice(0,10); }
function escHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// 이벤트 초기화
document.querySelectorAll('.example-query').forEach(btn => {
  btn.addEventListener('click', () => document.getElementById('hero-input').value = btn.textContent.trim());
});
document.querySelectorAll('.quick-prompt').forEach(btn => {
  btn.addEventListener('click', () => document.getElementById('diag-input').value = btn.textContent.trim());
});
document.getElementById('diag-input').addEventListener('keydown', e => {
  if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) runDiagnosis();
});

// 타이핑 애니메이션
const phrases = ['졸업하고 6개월째 구직 중이에요...','부모님이랑 같이 살고 있어요','월세가 너무 부담돼요','취업 준비하면서 알바 중이에요'];
let pi=0,ci=0,del=false;
function type() {
  const input = document.getElementById('hero-input');
  if (!input || document.activeElement === input) { setTimeout(type, 500); return; }
  const phrase = phrases[pi];
  if (del) { input.placeholder = phrase.substring(0,ci-1); ci--; }
  else { input.placeholder = phrase.substring(0,ci+1); ci++; }
  let speed = del ? 50 : 100;
  if (!del && ci === phrase.length) { del=true; speed=2000; }
  else if (del && ci === 0) { del=false; pi=(pi+1)%phrases.length; speed=500; }
  setTimeout(type, speed);
}
setTimeout(type, 1000);

// 초기 렌더 + 세션 복원 (새로고침 시 로그인 상태 유지)
// 주의: 실제 세션 복원은 api-bridge.js의 initApp()에서 처리함
// 여기서는 커뮤니티 초기 렌더만 담당
(async function initSession() {
  try {
    const me = await apiGetMe();
    if (me && me.loggedIn && me.user) {
      currentUser = me.user;
      reloadUserStorage();
      updateNavUI();
    }
  } catch (e) {
    // 미로그인 상태 — 무시
  } finally {
    renderCommunity();
  }
})();

// ============================================================
// 취업 로드맵
// ============================================================
function requireLoginThenRoadmap() {
  if (!currentUser) { showToast('로그인 후 이용 가능합니다', 'info'); openModal('modal-login'); return; }
  goPage('roadmap');
}

let selectedJob = '';
let selectedPeriod = '6개월';

function toggleJobTag(btn, job) {
  if (btn.dataset.locked === 'true') {
    showToast(`🔒 ${job} 로드맵은 잠겨있어요. 뱃지 샵에서 80P로 해금하세요!`, 'info');
    openBadgeShop();
    return;
  }
  document.querySelectorAll('.job-tag').forEach(b => {
    b.classList.remove('bg-primary/10', 'text-primary', 'border-primary/40');
    b.classList.add('text-muted-foreground');
  });
  btn.classList.add('bg-primary/10', 'text-primary', 'border-primary/40');
  btn.classList.remove('text-muted-foreground');
  selectedJob = job;
  const jobText = document.getElementById('roadmap-job-text');
  if (jobText) jobText.value = '';
}

async function unlockRoadmap(job) {
  if (!currentUser) { showToast('로그인 후 이용 가능합니다', 'info'); return; }
  const res = await apiUnlockRoadmap(job);
  if (!res.success) { showToast(res.message || '해금 실패', 'error'); return; }
  showToast(`🎉 ${job} 로드맵이 해금됐어요!`, 'success');
  const tagId = 'job-tag-' + job;
  const btn = document.getElementById(tagId);
  if (btn) {
    btn.dataset.locked = 'false';
    btn.classList.remove('border-purple-500/30', 'text-purple-400/60', 'border-red-500/30', 'text-red-400/60', 'locked-job');
    btn.classList.add('border-border', 'text-muted-foreground');
    btn.textContent = btn.textContent.replace('🔒 ', job === '프리랜서' ? '💼 ' : '🎬 ');
  }
  const shopBtnId = job === '프리랜서' ? 'shop-btn-freelancer' : 'shop-btn-youtuber';
  const shopBtn = document.getElementById(shopBtnId);
  if (shopBtn) { shopBtn.textContent = '✅ 해금됨'; shopBtn.disabled = true; shopBtn.classList.add('opacity-50'); }
  const el = document.getElementById('shop-my-points');
  if (el) el.textContent = res.remainPoints;
}

async function buyEmoji(emoji) {
  if (!currentUser) { showToast('로그인 후 이용 가능합니다', 'info'); return; }
  const res = await apiBuyEmoji(emoji);
  if (!res.success) { showToast(res.message || '구매 실패', 'error'); return; }
  showToast(`${emoji} 이모지가 닉네임에 적용됐어요!`, 'success');
  const el = document.getElementById('shop-my-points');
  if (el) el.textContent = res.remainPoints;
  const navEl = document.getElementById('nav-username');
  if (navEl && currentUser) {
    const nick = currentUser.nickname || currentUser.username;
    navEl.textContent = emoji + ' ' + nick;
  }
  if (currentUser) currentUser.nicknameEmoji = emoji;
}

function togglePeriodTag(btn, period) {
  document.querySelectorAll('.period-tag').forEach(b => {
    b.classList.remove('bg-primary/10', 'text-primary', 'border-primary/40');
    b.classList.add('text-muted-foreground');
  });
  btn.classList.add('bg-primary/10', 'text-primary', 'border-primary/40');
  btn.classList.remove('text-muted-foreground');
  selectedPeriod = period;
}

// 기본 기간 선택
document.addEventListener('DOMContentLoaded', function() {
  const defaultPeriod = document.querySelector('.active-period');
  if (defaultPeriod) {
    defaultPeriod.classList.remove('active-period');
    defaultPeriod.classList.add('bg-primary/10', 'text-primary', 'border-primary/40');
    defaultPeriod.classList.remove('text-muted-foreground');
  }
});

// Mock 로드맵 데이터 생성
const ROADMAP_MOCK = {
  '개발자': {
    analysis: [
      { icon:'👤', label:'나이', value:'27세' },
      { icon:'📚', label:'배경', value:'문과 비전공자' },
      { icon:'⏱️', label:'공백기', value:'8개월' },
      { icon:'🏠', label:'거주', value:'부모님과 동거' },
      { icon:'💰', label:'추정 소득', value:'중위소득 40% 이하' },
    ],
    welfare: [
      { name:'구직촉진수당', amt:'월 50만원 × 6개월', deadline:'D-14', color:'text-destructive', bg:'bg-destructive/10' },
      { name:'내일배움카드', amt:'최대 500만원', deadline:'상시', color:'text-primary', bg:'bg-primary/10' },
      { name:'청년내일저축계좌', amt:'최대 1,440만원', deadline:'연 2회', color:'text-success', bg:'bg-success/10' },
    ],
    months: {
      '3개월': [
        {
          month: 1, title: '기반 다지기',
          emoji: '🏗️',
          color: '#06b6d4',
          tasks: [
            { category: '📋 행정', items: ['고용센터 방문 · 구직촉진수당 신청', '내일배움카드 신청', '워크넷 프로필 등록'] },
            { category: '💻 학습', items: ['개발환경 세팅 (VS Code, Git)', 'HTML/CSS 기초 시작', '코딩 커뮤니티 가입'] },
            { category: '🎯 목표', items: ['간단한 정적 웹페이지 1개 완성'] },
          ],
          checkpoint: '수당 입금 확인 · 부트캠프 등록 완료',
          income: '구직촉진수당 50만원',
          incomeAmt: 50,
        },
        {
          month: 2, title: 'JavaScript 정복',
          emoji: '⚡',
          color: '#f59e0b',
          tasks: [
            { category: '💻 학습', items: ['JavaScript ES6+ 문법', 'DOM 조작 · 이벤트', '비동기 처리 (Promise, async/await)', 'REST API 연동'] },
            { category: '🛠️ 프로젝트', items: ['Todo 앱 만들기', '날씨 앱 만들기 (API 연동)'] },
            { category: '💰 복지', items: ['청년내일저축계좌 신청 (놓치면 손해!)'] },
          ],
          checkpoint: '미니 프로젝트 2개 GitHub 업로드',
          income: '구직촉진수당 50만원',
          incomeAmt: 50,
        },
        {
          month: 3, title: '포트폴리오 & 취준',
          emoji: '🚀',
          color: '#10b981',
          tasks: [
            { category: '💻 학습', items: ['React 기초 · 컴포넌트', '포트폴리오 사이트 제작'] },
            { category: '📝 취준', items: ['이력서 초안 작성', '채용 플랫폼 프로필 등록', '주 5곳 이상 지원 시작'] },
            { category: '🎯 목표', items: ['서류 통과 1곳 이상', '코딩테스트 준비 시작'] },
          ],
          checkpoint: '포트폴리오 배포 완료 · 지원 시작',
          income: '구직촉진수당 50만원 + 면접비',
          incomeAmt: 55,
        },
      ],
      '6개월': [
        {
          month: 1, title: '기반 다지기',
          emoji: '🏗️',
          color: '#06b6d4',
          tasks: [
            { category: '📋 행정', items: ['고용센터 방문 · 구직촉진수당 신청', '내일배움카드 신청', '워크넷 프로필 등록'] },
            { category: '💻 학습', items: ['개발환경 세팅 (VS Code, Git)', 'HTML/CSS 기초', '코딩 커뮤니티 가입'] },
            { category: '🎯 목표', items: ['정적 웹페이지 1개 완성'] },
          ],
          checkpoint: '수당 입금 확인 · 학습 루틴 확립',
          income: '구직촉진수당 50만원',
          incomeAmt: 50,
        },
        {
          month: 2, title: 'CSS 심화 & JS 기초',
          emoji: '🎨',
          color: '#8b5cf6',
          tasks: [
            { category: '💻 학습', items: ['CSS Flexbox/Grid 완전 정복', 'JavaScript 기초 문법', '반응형 디자인'] },
            { category: '🛠️ 프로젝트', items: ['클론코딩 2개 완성', 'GitHub 꾸준히 커밋'] },
            { category: '💰 복지', items: ['청년내일저축계좌 신청 ⚠️'] },
          ],
          checkpoint: '클론코딩 2개 GitHub 업로드',
          income: '구직촉진수당 50만원',
          incomeAmt: 50,
        },
        {
          month: 3, title: 'JavaScript 심화',
          emoji: '⚡',
          color: '#f59e0b',
          tasks: [
            { category: '💻 학습', items: ['ES6+ 완전 정복', 'DOM · 이벤트 · 비동기', 'REST API 연동', 'fetch/axios'] },
            { category: '🛠️ 프로젝트', items: ['날씨 앱', 'Todo 앱', '영화 검색 앱'] },
          ],
          checkpoint: '미니 프로젝트 3개 완성',
          income: '구직촉진수당 50만원',
          incomeAmt: 50,
        },
        {
          month: 4, title: 'React + 팀프로젝트',
          emoji: '⚛️',
          color: '#06b6d4',
          tasks: [
            { category: '💻 학습', items: ['React 컴포넌트 · State · Props', 'useEffect · useState · Context', 'React Router'] },
            { category: '🤝 협업', items: ['오픈소스 팀 프로젝트 참여', 'GitHub 협업 (PR, 코드리뷰)'] },
            { category: '🛠️ 프로젝트', items: ['React로 포트폴리오 사이트 제작'] },
          ],
          checkpoint: '팀프로젝트 1개 완성 · 포트폴리오 초안',
          income: '구직촉진수당 50만원',
          incomeAmt: 50,
        },
        {
          month: 5, title: '본격 취준 돌입',
          emoji: '📝',
          color: '#f43f5e',
          tasks: [
            { category: '📝 취준', items: ['이력서 · 자기소개서 완성', '포트폴리오 최종 다듬기', '배포 (Vercel/Netlify)'] },
            { category: '🎯 지원', items: ['주 10곳 이상 서류 지원', '코딩테스트 매일 1문제', '면접 스터디 참여'] },
            { category: '💡 준비', items: ['기술 면접 예상질문 정리', 'CS 기초 정리'] },
          ],
          checkpoint: '서류 통과 3곳 이상 목표',
          income: '구직촉진수당 50만원 + 면접비',
          incomeAmt: 60,
        },
        {
          month: 6, title: '최종 목표 달성',
          emoji: '🎉',
          color: '#10b981',
          tasks: [
            { category: '🎯 면접', items: ['최종 면접 준비', '포트폴리오 발표 연습', '연봉 협상 준비'] },
            { category: '🎉 취업 후', items: ['청년도약계좌 즉시 신청', '취업성공수당 신청 (최대 150만원)', '건강보험 직장가입자 전환'] },
          ],
          checkpoint: '🎊 취업 성공!',
          income: '초봉 200~280만원',
          incomeAmt: 250,
        },
      ],
      '1년': [
        { month: 1, title: '기반 다지기', emoji: '🏗️', color: '#06b6d4', tasks: [{ category: '📋 행정', items: ['구직촉진수당 신청', '내일배움카드 신청'] }, { category: '💻 학습', items: ['HTML/CSS 기초', '개발환경 세팅'] }], checkpoint: '학습 루틴 확립', income: '구직촉진수당 50만원', incomeAmt: 50 },
        { month: 2, title: 'HTML/CSS 완성', emoji: '🎨', color: '#8b5cf6', tasks: [{ category: '💻 학습', items: ['CSS 심화', '반응형 디자인', '클론코딩 3개'] }], checkpoint: '클론코딩 완성', income: '구직촉진수당 50만원', incomeAmt: 50 },
        { month: 3, title: 'JavaScript 기초', emoji: '⚡', color: '#f59e0b', tasks: [{ category: '💻 학습', items: ['JS 문법', 'DOM 조작', '미니 프로젝트'] }, { category: '💰 복지', items: ['청년내일저축계좌 신청'] }], checkpoint: 'JS 미니 프로젝트 완성', income: '구직촉진수당 50만원', incomeAmt: 50 },
        { month: 4, title: 'JavaScript 심화', emoji: '🔥', color: '#f43f5e', tasks: [{ category: '💻 학습', items: ['비동기 처리', 'API 연동', '앱 3개 제작'] }], checkpoint: 'API 연동 프로젝트 완성', income: '구직촉진수당 50만원', incomeAmt: 50 },
        { month: 5, title: 'React 입문', emoji: '⚛️', color: '#06b6d4', tasks: [{ category: '💻 학습', items: ['React 기초', 'State/Props', 'Hooks'] }], checkpoint: 'React 기본 앱 제작', income: '부트캠프 수료', incomeAmt: 50 },
        { month: 6, title: 'React 심화', emoji: '🚀', color: '#10b981', tasks: [{ category: '💻 학습', items: ['Context API', 'React Router', '상태관리'] }, { category: '🤝 협업', items: ['팀 프로젝트 참여'] }], checkpoint: '팀 프로젝트 1개 완성', income: '구직촉진수당 (2차)', incomeAmt: 50 },
        { month: 7, title: '백엔드 기초', emoji: '🖥️', color: '#8b5cf6', tasks: [{ category: '💻 학습', items: ['Node.js 기초', 'Express', 'REST API 설계'] }], checkpoint: '간단한 API 서버 제작', income: '수당 유지', incomeAmt: 50 },
        { month: 8, title: 'DB & 풀스택', emoji: '🗄️', color: '#f59e0b', tasks: [{ category: '💻 학습', items: ['MySQL/MongoDB', '풀스택 프로젝트'] }], checkpoint: '풀스택 프로젝트 1개', income: '수당 유지', incomeAmt: 50 },
        { month: 9, title: '포트폴리오 완성', emoji: '✨', color: '#f43f5e', tasks: [{ category: '🛠️ 작업', items: ['포트폴리오 사이트 완성', '프로젝트 3개 배포', 'README 작성'] }], checkpoint: '포트폴리오 완성 · 배포', income: '수당 마무리', incomeAmt: 50 },
        { month: 10, title: '취준 본격 시작', emoji: '📝', color: '#06b6d4', tasks: [{ category: '📝 취준', items: ['이력서 완성', '100곳 지원 목표'] }, { category: '🎯 준비', items: ['코딩테스트', '기술 면접'] }], checkpoint: '서류 통과 5곳 이상', income: '면접비', incomeAmt: 30 },
        { month: 11, title: '면접 집중', emoji: '🎤', color: '#10b981', tasks: [{ category: '🎯 면접', items: ['기술 면접 집중 준비', '포트폴리오 발표 연습', '연봉 협상 준비'] }], checkpoint: '최종 면접 합격 목표', income: '면접비', incomeAmt: 30 },
        { month: 12, title: '취업 성공! 🎉', emoji: '🎊', color: '#f59e0b', tasks: [{ category: '🎉 취업 후', items: ['청년도약계좌 신청', '취업성공수당 신청', '직장 적응'] }], checkpoint: '🎊 취업 & 새 출발!', income: '초봉 200~280만원', incomeAmt: 250 },
      ]
    }
  },
  '디자이너': {
    analysis: [{ icon:'🎨', label:'목표', value:'UI/UX 디자이너' }, { icon:'🛠️', label:'주요 툴', value:'Figma · 포토샵' }, { icon:'💰', label:'추정 초봉', value:'200~260만원' }],
    welfare: [{ name:'구직촉진수당', amt:'월 50만원 × 6개월', deadline:'D-14', color:'text-destructive', bg:'bg-destructive/10' }, { name:'내일배움카드', amt:'최대 500만원', deadline:'상시', color:'text-primary', bg:'bg-primary/10' }],
    months: {
      '3개월': [
        { month:1, title:'디자인 기초', color:'#8b5cf6', tasks:[{ category:'행정', items:['구직촉진수당 신청', '내일배움카드 신청'] }, { category:'학습', items:['Figma 기초', 'UI 컴포넌트', '디자인 원칙'] }], checkpoint:'Figma 기본 UI 제작', income:'구직촉진수당 50만원', incomeAmt:50 },
        { month:2, title:'포트폴리오 제작', color:'#06b6d4', tasks:[{ category:'학습', items:['UX 리서치', '와이어프레임', '프로토타입'] }, { category:'작업', items:['앱 리디자인 1개', '웹사이트 디자인'] }], checkpoint:'포트폴리오 작업물 2개', income:'구직촉진수당 50만원', incomeAmt:50 },
        { month:3, title:'취업 도전', color:'#10b981', tasks:[{ category:'작업', items:['포트폴리오 정리', 'Behance 업로드'] }, { category:'취준', items:['채용 지원 시작', '포트폴리오 발표 연습'] }], checkpoint:'서류 통과 1곳 이상', income:'구직촉진수당 50만원', incomeAmt:50 },
      ],
      '6개월': [
        { month:1, title:'디자인 기초', color:'#8b5cf6', tasks:[{ category:'행정', items:['구직촉진수당 신청', '내일배움카드 신청'] }, { category:'학습', items:['Figma 기초', '디자인 원칙', 'UI 컴포넌트'] }], checkpoint:'Figma 기본 UI 제작', income:'구직촉진수당 50만원', incomeAmt:50 },
        { month:2, title:'UX 이해', color:'#06b6d4', tasks:[{ category:'학습', items:['UX 리서치', '와이어프레임', '프로토타입'] }], checkpoint:'앱 와이어프레임 완성', income:'구직촉진수당 50만원', incomeAmt:50 },
        { month:3, title:'포트폴리오 시작', color:'#f59e0b', tasks:[{ category:'작업', items:['앱 리디자인 1개', '웹사이트 디자인'] }], checkpoint:'포트폴리오 작업물 2개', income:'구직촉진수당 50만원', incomeAmt:50 },
        { month:4, title:'심화 & 브랜딩', color:'#f43f5e', tasks:[{ category:'학습', items:['브랜드 아이덴티티', 'Adobe 포토샵', '모션 기초'] }], checkpoint:'브랜딩 프로젝트 완성', income:'구직촉진수당 50만원', incomeAmt:50 },
        { month:5, title:'포트폴리오 완성', color:'#10b981', tasks:[{ category:'작업', items:['포트폴리오 사이트 제작', '작업물 5개 이상', 'Behance 정리'] }, { category:'취준', items:['채용 지원 시작'] }], checkpoint:'포트폴리오 완성 · 지원 시작', income:'구직촉진수당 50만원', incomeAmt:50 },
        { month:6, title:'취업 성공', color:'#06b6d4', tasks:[{ category:'면접', items:['포트폴리오 발표 연습', '디자인 과제 준비'] }, { category:'취업 후', items:['청년도약계좌 신청'] }], checkpoint:'취업 성공', income:'초봉 200~260만원', incomeAmt:230 },
      ],
      '1년': [
        { month:1, title:'디자인 기초', color:'#8b5cf6', tasks:[{ category:'행정', items:['구직촉진수당 신청', '내일배움카드 신청'] }, { category:'학습', items:['Figma 기초', 'UI 원칙'] }], checkpoint:'Figma 기본 완성', income:'구직촉진수당 50만원', incomeAmt:50 },
        { month:2, title:'UI 심화', color:'#06b6d4', tasks:[{ category:'학습', items:['컴포넌트 시스템', '타이포그래피', '컬러 이론'] }], checkpoint:'UI 키트 제작', income:'구직촉진수당 50만원', incomeAmt:50 },
        { month:3, title:'UX 리서치', color:'#f59e0b', tasks:[{ category:'학습', items:['사용자 리서치', '페르소나', '유저 저니맵'] }], checkpoint:'UX 케이스스터디 1개', income:'구직촉진수당 50만원', incomeAmt:50 },
        { month:4, title:'프로토타이핑', color:'#f43f5e', tasks:[{ category:'학습', items:['Figma 프로토타입', '인터랙션 디자인'] }, { category:'작업', items:['앱 리디자인 1개'] }], checkpoint:'인터랙티브 프로토타입', income:'구직촉진수당 50만원', incomeAmt:50 },
        { month:5, title:'브랜딩', color:'#8b5cf6', tasks:[{ category:'학습', items:['브랜드 아이덴티티', '로고 디자인', '포토샵'] }], checkpoint:'브랜딩 프로젝트 완성', income:'수당 유지', incomeAmt:50 },
        { month:6, title:'모션 & 심화', color:'#06b6d4', tasks:[{ category:'학습', items:['모션 기초', 'After Effects', '마이크로 인터랙션'] }], checkpoint:'모션 작업물 1개', income:'수당 유지', incomeAmt:50 },
        { month:7, title:'웹 기초 이해', color:'#f59e0b', tasks:[{ category:'학습', items:['HTML/CSS 기초 이해', '개발자와 협업법', 'Zeplin/Figma 핸드오프'] }], checkpoint:'개발 협업 이해', income:'수당 유지', incomeAmt:50 },
        { month:8, title:'포트폴리오 제작', color:'#f43f5e', tasks:[{ category:'작업', items:['포트폴리오 사이트 제작', '작업물 6개 이상'] }], checkpoint:'포트폴리오 배포', income:'수당 유지', incomeAmt:50 },
        { month:9, title:'포트폴리오 다듬기', color:'#10b981', tasks:[{ category:'작업', items:['케이스스터디 작성', 'Behance 업로드', 'Notion 포트폴리오'] }], checkpoint:'포트폴리오 완성', income:'수당 마무리', incomeAmt:50 },
        { month:10, title:'취준 본격 시작', color:'#8b5cf6', tasks:[{ category:'취준', items:['이력서 완성', '자기소개서 작성', '채용 지원 시작'] }], checkpoint:'서류 통과 3곳 이상', income:'면접비', incomeAmt:30 },
        { month:11, title:'면접 집중', color:'#06b6d4', tasks:[{ category:'면접', items:['포트폴리오 발표 연습', '디자인 과제 준비', '연봉 협상'] }], checkpoint:'최종 면접 합격 목표', income:'면접비', incomeAmt:30 },
        { month:12, title:'취업 성공', color:'#f59e0b', tasks:[{ category:'취업 후', items:['청년도약계좌 신청', '취업성공수당 신청'] }], checkpoint:'취업 & 새 출발', income:'초봉 200~260만원', incomeAmt:230 },
      ]
    }
  },
};

function getDefaultRoadmap(job, period) {
  const key = ROADMAP_MOCK[job] ? job : null;
  if (!key) {
    // 지원하지 않는 직군 — 빈 데이터 반환 (개발자 하드코딩 방지)
    return { analysis: [], welfare: [], months: [] };
  }
  const data = ROADMAP_MOCK[key];
  const months = data.months[period] || data.months['6개월'];
  return { analysis: data.analysis, welfare: data.welfare, months };
}

function handleJobTextInput(value) {
  if (value.trim()) {
    document.querySelectorAll('.job-tag').forEach(b => {
      b.classList.remove('bg-primary/10', 'text-primary', 'border-primary/40');
      b.classList.add('text-muted-foreground');
    });
    selectedJob = value.trim();
  }
}

const loadingMsgs = [
  'AI가 상황을 분석하고 있어요...',
  '맞춤 복지 혜택을 연결하고 있어요...',
  '취업 로드맵을 설계하고 있어요...',
  '마지막으로 다듬는 중이에요...',
];

async function generateRoadmap() {
  const input = document.getElementById('roadmap-input').value.trim();
  if (!input) { showToast('현재 상황을 입력해주세요', 'error'); return; }
  if (!selectedJob) { showToast('목표 직군을 선택해주세요', 'error'); return; }

  document.getElementById('roadmap-input-section').classList.add('hidden');
  document.getElementById('roadmap-loading').classList.remove('hidden');
  document.getElementById('roadmap-result').classList.add('hidden');

  let msgIdx = 0;
  const msgInterval = setInterval(() => {
    msgIdx = (msgIdx + 1) % loadingMsgs.length;
    const msgEl = document.getElementById('roadmap-loading-msg');
    if (msgEl) msgEl.textContent = loadingMsgs[msgIdx];
  }, 800);

  try {
    const res = await apiGenerateRoadmap(selectedJob, selectedPeriod, input);
    clearInterval(msgInterval);

    let data;
    if (res && res.success && res.roadmap) {
      // API 응답을 renderRoadmap이 기대하는 형식으로 변환
      const aiRoadmap = typeof res.roadmap === 'string' ? JSON.parse(res.roadmap) : res.roadmap;
      data = convertAiRoadmapToDisplay(aiRoadmap, selectedJob, selectedPeriod);
    } else {
      // API 실패 시 Mock 폴백
      data = getDefaultRoadmap(selectedJob, selectedPeriod);
    }
    renderRoadmap(data);
  } catch (e) {
    clearInterval(msgInterval);
    // 네트워크 오류 등 — Mock 폴백
    const data = getDefaultRoadmap(selectedJob, selectedPeriod);
    renderRoadmap(data);
    showToast('AI 로드맵 생성에 실패하여 기본 로드맵을 표시합니다', 'info');
  } finally {
    document.getElementById('roadmap-loading').classList.add('hidden');
    document.getElementById('roadmap-result').classList.remove('hidden');
  }
}

// AI 응답 형식 → renderRoadmap 형식 변환
function convertAiRoadmapToDisplay(aiRoadmap, job, period) {
  if (!aiRoadmap || !Array.isArray(aiRoadmap.months) || aiRoadmap.months.length === 0) {
    return getDefaultRoadmap(job, period);
  }

  const colors = ['#06b6d4','#8b5cf6','#f59e0b','#f43f5e','#10b981','#06b6d4','#8b5cf6','#f59e0b','#f43f5e','#10b981','#06b6d4','#8b5cf6'];
  const months = aiRoadmap.months.map((m, i) => {
    const tasks = Array.isArray(m.tasks) ? m.tasks.map(t => ({
      category: t.category || '할 일',
      items: Array.isArray(t.items) ? t.items : []
    })) : [];
    return {
      month: m.month || (i + 1),
      title: m.title || `${i + 1}개월차`,
      color: m.color || colors[i % colors.length],
      income: m.income || '',
      incomeAmt: m.incomeAmt || 0,
      checkpoint: m.checkpoint || '',
      tasks
    };
  });

  // 분석 카드: 서버 데이터 우선 — 없으면 빈 배열 (개발자 Mock 하드코딩 방지)
  const analysis = Array.isArray(aiRoadmap.analysis) && aiRoadmap.analysis.length > 0
    ? aiRoadmap.analysis
    : [];

  // 복지 카드: 서버 데이터 우선 — 없으면 빈 배열
  const welfare = Array.isArray(aiRoadmap.welfare) && aiRoadmap.welfare.length > 0
    ? aiRoadmap.welfare.map(w => ({
        name:     w.name,
        amt:      w.amt || '확인 필요',
        deadline: w.deadline || '상시',
        color:    'text-primary',
        bg:       'bg-primary/10',
        url:      w.url || 'https://www.bokjiro.go.kr',
      }))
    : [];

  return { analysis, welfare, months };
}

function renderRoadmap(data) {
  // 분석 요약
  const analysisEl = document.getElementById('roadmap-analysis');
  analysisEl.innerHTML = data.analysis.length > 0
    ? data.analysis.map(a =>
        `<div class="flex items-center justify-between py-1.5 border-b border-border/50 last:border-0">
          <span class="text-xs text-muted-foreground">${a.icon || ''} ${a.label}</span>
          <span class="text-xs font-semibold">${a.value}</span>
        </div>`
      ).join('')
    : '<p class="text-xs text-muted-foreground">상황을 입력하면 분석 결과가 나타나요</p>';

  // 복지 혜택
  const welfareEl = document.getElementById('roadmap-welfare');
  if (data.welfare.length === 0) {
    welfareEl.innerHTML = '<p class="text-xs text-muted-foreground">상황을 입력하면 복지 혜택 추천이 나타나요</p>';
  } else {
  welfareEl.innerHTML = data.welfare.map(w =>
    `<div class="flex items-center justify-between p-3 rounded-xl border border-border bg-background">
      <div class="flex items-center gap-2">
        <span class="text-xs font-semibold px-2 py-0.5 rounded-full ${w.bg} ${w.color}">${w.deadline}</span>
        <span class="text-sm font-medium">${w.name}</span>
      </div>
      <span class="text-xs text-primary font-semibold">${w.amt}</span>
    </div>`
  ).join('');
  }

  // 기간 라벨 + 진행률 바 초기화
  document.getElementById('roadmap-period-label').textContent = '총 ' + selectedPeriod + ' · ' + data.months.length + '단계';
  setTimeout(updateRoadmapProgress, 100);

  // 가로 타임라인
  var timeline = document.getElementById('roadmap-timeline');
  var nodesHtml = data.months.map(function(m, i) {
    var isTop = i % 2 === 0;
    var card = '<div class="tl-card" onclick="openTlPanel(' + i + ')">' +
      '<div style="font-size:10px;font-weight:700;color:' + m.color + ';margin-bottom:4px;letter-spacing:.08em;">' + String(m.month).padStart(2,'0') + '개월차</div>' +
      '<div style="font-size:13px;font-weight:700;color:#fafafa;margin-bottom:3px;line-height:1.3;">' + m.title + '</div>' +
      '<div style="font-size:10px;color:#a1a1aa;">' + m.income + '</div>' +
      '</div>';
    var dot = '<div class="tl-dot" style="background:' + m.color + ';" onclick="openTlPanel(' + i + ')"></div>';
    var vline = '<div class="tl-vline" style="background:linear-gradient(' + (isTop?'to bottom':'to top') + ',' + m.color + ',' + m.color + '60);"></div>';
    var empty = '<div style="height:160px;"></div>';
    if (isTop) {
      return '<div class="tl-node" id="tl-node-' + i + '">' +
        '<div class="tl-top">' + card + '</div>' +
        vline + dot +
        '<div class="tl-bottom">' + empty + '</div></div>';
    } else {
      return '<div class="tl-node" id="tl-node-' + i + '">' +
        '<div class="tl-top">' + empty + '</div>' +
        dot + vline +
        '<div class="tl-bottom">' + card + '</div></div>';
    }
  }).join('');
  // 전역으로 상태 관리
  window._tlData = data;
  // perPage: 전체 개월수가 6이하면 전체, 초과면 6개씩
  window._tlPerPage = data.months.length <= 6 ? data.months.length : 6;
  window._tlCurrentPage = 0;
  window._tlTotalPages = Math.ceil(data.months.length / window._tlPerPage);
  window._tlTimeline = timeline;

  function renderTlPage() {
    var data = window._tlData;
    var perPage = window._tlPerPage;
    var currentPage_tl = window._tlCurrentPage;
    var totalPages = window._tlTotalPages;
    var totalMonths = data.months.length;
    var timeline = window._tlTimeline;
    var start = currentPage_tl * perPage;
    var pageMonths = data.months.slice(start, start + perPage);

    var pageNodes = pageMonths.map(function(m, i) {
      var realIdx = start + i;
      var isTop = realIdx % 2 === 0;
      // 6개월 이하: flex로 균등 분배 / 초과: 고정 너비
      var pageSize = pageMonths.length;
      var nodeStyle = totalMonths <= 6 ? 'flex:1;min-width:0;max-width:' + Math.floor(100/pageSize) + '%;' : 'width:180px;flex-shrink:0;';
      var cardStyle = totalMonths <= 6 ? 'width:calc(100% - 8px);' : 'width:155px;';
      var card = '<div class="tl-card" style="' + cardStyle + 'border-color:' + m.color + '40;cursor:pointer;" onclick="openTlPanel(' + realIdx + ')">' +
        '<div style="font-size:10px;font-weight:700;color:' + m.color + ';margin-bottom:4px;">' + String(m.month).padStart(2,'0') + '개월차</div>' +
        '<div style="font-size:13px;font-weight:700;margin-bottom:3px;line-height:1.3;">' + m.title + '</div>' +
        '<div style="font-size:10px;color:#a1a1aa;">' + m.income + '</div>' +
        '</div>';
      var dot = '<div class="tl-dot" style="background:' + m.color + ';cursor:pointer;" onclick="openTlPanel(' + realIdx + ')"></div>';
      var vline = '<div class="tl-vline" style="background:linear-gradient(' + (isTop?'to bottom':'to top') + ',' + m.color + ',' + m.color + '60);"></div>';
      var empty = '<div style="height:160px;"></div>';
      var delay = (i * 0.15) + 's';
      if (isTop) {
        return '<div class="tl-node" style="' + nodeStyle + '">' +
          '<div class="tl-top tl-node-top-hidden" data-tl-anim="top" style="width:100%;align-items:center;animation-delay:' + delay + '">' + card + '</div>' +
          '<div style="width:2px;height:28px;flex-shrink:0;background:linear-gradient(to bottom,' + m.color + ',' + m.color + '60);"></div>' +
          '<div class="tl-dot-hidden" data-tl-anim="dot" style="width:16px;height:16px;border-radius:50%;border:3px solid #0a0a0f;background:' + m.color + ';z-index:2;flex-shrink:0;cursor:pointer;animation-delay:' + delay + ';" onclick="openTlPanel(' + realIdx + ')"></div>' +
          '<div class="tl-bottom" style="width:100%;"></div></div>';
      } else {
        return '<div class="tl-node" style="' + nodeStyle + '">' +
          '<div class="tl-top" style="width:100%;"></div>' +
          '<div class="tl-dot-hidden" data-tl-anim="dot" style="width:16px;height:16px;border-radius:50%;border:3px solid #0a0a0f;background:' + m.color + ';z-index:2;flex-shrink:0;cursor:pointer;animation-delay:' + delay + ';" onclick="openTlPanel(' + realIdx + ')"></div>' +
          '<div style="width:2px;height:28px;flex-shrink:0;background:linear-gradient(to top,' + m.color + ',' + m.color + '60);"></div>' +
          '<div class="tl-bottom tl-node-bottom-hidden" data-tl-anim="bottom" style="width:100%;align-items:center;animation-delay:' + delay + '">' + card + '</div></div>';
      }
    }).join('');

    var arrowsHtml = totalMonths > 6 ? (
      '<div class="tl-arrows">' +
      '<button class="tl-arrow" onclick="tlPrev()" ' + (currentPage_tl===0?'disabled':'') + '>' +
      '<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/></svg></button>' +
      '<span style="font-size:12px;color:#a1a1aa;min-width:50px;text-align:center;">' + (currentPage_tl+1) + ' / ' + totalPages + '</span>' +
      '<button class="tl-arrow" onclick="tlNext()" ' + (currentPage_tl>=totalPages-1?'disabled':'') + '>' +
      '<svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg></button>' +
      '</div>'
    ) : '';

    // tl-track을 flex로 - 6개월이면 꽉 채움, 초과면 고정
    var trackStyle = totalMonths <= 6
      ? 'display:flex;align-items:center;position:relative;padding:0 16px;width:100%;box-sizing:border-box;'
      : 'display:flex;align-items:center;position:relative;padding:0 16px;min-width:max-content;';

    timeline.innerHTML =
      '<div class="tl-wrap"><div class="tl-track" style="' + trackStyle + '">' +
      '<div class="tl-line tl-line-anim" style="animation-duration:0.8s;"></div>' + pageNodes +
      '</div></div>' + arrowsHtml;
  }

  window.tlPrev = function() {
    if (window._tlCurrentPage > 0) { window._tlCurrentPage--; renderTlPage(); setTimeout(initTlObserver,100); }
  };
  window.tlNext = function() {
    if (window._tlCurrentPage < window._tlTotalPages-1) { window._tlCurrentPage++; renderTlPage(); setTimeout(initTlObserver,100); }
  };

  renderTlPage();
  setTimeout(initTlObserver, 100);

  currentRmData = data;
  if (typeof renderCerts === 'function') renderCerts(selectedJob || '개발자');
}

var openItems = new Set();
var currentRmData = null;
function toggleRoadmapItem(idx) { openTlPanel(idx); }


// ============================================================
// PDF 저장
// ============================================================
async function downloadPDF() {
  const btn = document.getElementById('roadmap-pdf-btn');
  const origHTML = btn.innerHTML;
  btn.innerHTML = '<svg class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg> 생성 중...';
  btn.disabled = true;

  try {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const nickname = currentUser ? currentUser.nickname : '사용자';
    const pageW = 210, margin = 15, contentW = pageW - margin * 2;
    let y = margin;

    const addText = (text, size, color, bold, maxW) => {
      pdf.setFontSize(size);
      pdf.setTextColor(...color);
      pdf.setFont('helvetica', bold ? 'bold' : 'normal');
      const lines = pdf.splitTextToSize(text, maxW || contentW);
      if (y + lines.length * size * 0.4 > 280) { pdf.addPage(); y = margin; }
      pdf.text(lines, margin, y);
      y += lines.length * size * 0.4 + 2;
      return lines.length * size * 0.4 + 2;
    };

    const addLine = (color) => {
      pdf.setDrawColor(...(color || [200,200,200]));
      pdf.line(margin, y, pageW - margin, y);
      y += 4;
    };

    // 제목
    addText('복지체크 취업 로드맵', 22, [15,15,15], true);
    addText(`${nickname} · ${selectedJob||'개발자'} · ${selectedPeriod}`, 11, [120,120,120], false);
    addText(new Date().toLocaleDateString('ko-KR'), 9, [160,160,160], false);
    y += 4;
    addLine([6,182,212]);
    y += 4;

    // 복지 혜택
    addText('지금 신청할 복지', 13, [15,15,15], true);
    y += 2;
    const welfareEls = document.querySelectorAll('#roadmap-welfare > div');
    welfareEls.forEach(el => {
      const name = el.querySelector('.font-medium')?.textContent || '';
      const amt = el.querySelector('.text-primary')?.textContent || '';
      addText('• ' + name + '  ' + amt, 10, [50,50,50], false);
    });
    y += 6;
    addLine();
    y += 4;

    // 로드맵
    addText('월별 취업 로드맵', 13, [15,15,15], true);
    y += 3;

    const items = document.querySelectorAll('.roadmap-item');
    items.forEach((item, idx) => {
      const header = item.querySelector('.font-bold.tracking-tight');
      const monthLabel = item.querySelector('.font-mono');
      const title = (monthLabel?.textContent || '') + '  ' + (header?.textContent || '');

      if (y > 260) { pdf.addPage(); y = margin; }
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'bold');
      pdf.setTextColor(15,15,15);
      pdf.text(title, margin, y);
      y += 6;

      const taskDivs = item.querySelectorAll('[class*="space-y-2"] > div');
      const cats = item.querySelectorAll('.uppercase.tracking-widest');
      cats.forEach((cat, ci) => {
        addText('  [ ' + cat.textContent.trim() + ' ]', 9, [100,100,100], true);
        const taskItems = cat.nextElementSibling?.querySelectorAll('.text-sm');
        taskItems?.forEach(t => {
          addText('    - ' + t.textContent.trim(), 9, [60,60,60], false);
        });
      });

      const checkpoint = item.querySelector('.font-medium:last-of-type')?.textContent;
      if (checkpoint) {
        addText('  → ' + checkpoint, 9, [6,182,212], false);
      }
      y += 4;
      if (idx < items.length - 1) addLine([230,230,230]);
      y += 3;
    });

    // 자격증
    y += 4;
    addLine([6,182,212]);
    y += 4;
    addText('추천 자격증', 13, [15,15,15], true);
    y += 2;
    const certCards = document.querySelectorAll('[id^="cert-card-"]');
    certCards.forEach(card => {
      const name = card.querySelector('.font-semibold')?.textContent || '';
      const desc = card.querySelector('.text-muted-foreground.leading-relaxed')?.textContent || '';
      const schedule = card.querySelector('.rounded-full.bg-muted')?.textContent || '';
      addText('• ' + name.trim(), 10, [15,15,15], true);
      addText('  ' + desc.trim(), 9, [100,100,100], false);
      addText('  ' + schedule.trim(), 9, [120,120,120], false);
      y += 2;
    });

    // 하단
    y += 6;
    addLine();
    addText('본 로드맵은 복지체크 AI가 생성한 참고용 자료입니다. 실제 복지 신청 여부는 담당 기관에서 확인하세요.', 8, [160,160,160], false);

    pdf.save('복지체크_취업로드맵_' + nickname + '_' + selectedPeriod + '.pdf');
    showToast('PDF가 저장되었습니다!', 'success');
  } catch(e) {
    console.error(e);
    showToast('PDF 생성 중 오류가 발생했습니다', 'error');
  }

  btn.innerHTML = origHTML;
  btn.disabled = false;
}

// ============================================================
// 자격증 추천
// ============================================================


function renderCerts(job) {
  const key = CERT_DATA[job] ? job : '기타';
  const certs = CERT_DATA[key];
  const container = document.getElementById('roadmap-certs');
  if (!container) return;

  container.innerHTML = certs.map(c => {
    const stars = '★'.repeat(c.difficulty) + '☆'.repeat(5 - c.difficulty);
    const isWished = wishedCerts.has(c.id);
    return `
    <div class="border border-border rounded-xl overflow-hidden" id="cert-card-${c.id}">
      <div class="p-4">
        <div class="flex items-start justify-between gap-3">
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-1 flex-wrap">
              <span class="font-semibold text-sm">${c.name}</span>
              <span class="text-xs text-muted-foreground">${stars}</span>
            </div>
            <p class="text-xs text-muted-foreground leading-relaxed mb-2">${c.desc}</p>
            <div class="flex items-center gap-3 flex-wrap">
              <span class="text-xs px-2 py-0.5 rounded-full bg-muted/50 text-muted-foreground">${c.schedule}</span>
              <span class="text-xs text-muted-foreground">시험일 ${c.examDate}</span>
            </div>
          </div>
          <div class="flex items-center gap-2 flex-shrink-0">
            <a href="${c.url}" target="_blank"
               class="text-xs px-3 py-1.5 border border-border rounded-lg text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors">
              자세히
            </a>
            <button onclick="toggleCertWish('${c.id}','${c.name}','${c.regDate}','${c.examDate}')"
              id="cert-btn-${c.id}"
              class="w-8 h-8 rounded-xl border flex items-center justify-center transition-all ${isWished ? 'bg-rose-500/10 border-rose-500/40 text-rose-400' : 'border-border text-muted-foreground hover:border-rose-400/40 hover:text-rose-400'}"
              title="${isWished ? '찜 해제' : '찜하기'}">
              <svg class="w-4 h-4" fill="${isWished ? 'currentColor' : 'none'}" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>`;
  }).join('');
}

function toggleCertWish(id, name, regDate, examDate) {
  if (!currentUser) { showToast('로그인 후 이용 가능합니다', 'info'); openModal('modal-login'); return; }
  const btn = document.getElementById('cert-btn-' + id);
  if (wishedCerts.has(id)) {
    wishedCerts.delete(id);
    const idx = wishList.findIndex(w => w.name === name);
    if (idx !== -1) wishList.splice(idx, 1);
    btn.querySelector('svg').setAttribute('fill','none');
    btn.className = 'w-8 h-8 rounded-xl border flex items-center justify-center transition-all border-border text-muted-foreground hover:border-rose-400/40 hover:text-rose-400';
    showToast(name + ' 찜 해제', 'info');
  } else {
    wishedCerts.add(id);
    wishList.push({ name: name + ' 시험', amt: '자격증', startDate: regDate, endDate: examDate });
    btn.querySelector('svg').setAttribute('fill','currentColor');
    btn.className = 'w-8 h-8 rounded-xl border flex items-center justify-center transition-all bg-rose-500/10 border-rose-500/40 text-rose-400';
    showToast(name + ' 캘린더에 추가됐어요! 📅', 'success');
  }
}

function resetRoadmap() {
  document.getElementById('roadmap-input-section').classList.remove('hidden');
  document.getElementById('roadmap-result').classList.add('hidden');
  document.getElementById('roadmap-input').value = '';
  openItems.clear();
}


// ============================================================
// 진단 패널 드래그 리사이저
// ============================================================
(function() {
  const resizer = document.getElementById('diag-resizer');
  const leftPanel = document.getElementById('diag-left');
  if (!resizer || !leftPanel) return;

  let isResizing = false;
  let startX = 0;
  let startWidth = 0;

  resizer.addEventListener('mousedown', function(e) {
    isResizing = true;
    startX = e.clientX;
    startWidth = leftPanel.offsetWidth;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
    resizer.style.background = 'rgba(6,182,212,0.6)';
    e.preventDefault();
  });

  document.addEventListener('mousemove', function(e) {
    if (!isResizing) return;
    const dx = e.clientX - startX;
    const newWidth = Math.min(600, Math.max(240, startWidth + dx));
    leftPanel.style.width = newWidth + 'px';
  });

  document.addEventListener('mouseup', function() {
    if (!isResizing) return;
    isResizing = false;
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
    resizer.style.background = 'transparent';
  });
})();


// ============================================================
// 찜 기능
// ============================================================
let wishList = []; // { name, amt, startDate, endDate }

function todayPlusDays(n) {
  const d = new Date(); d.setDate(d.getDate() + n);
  return d.toISOString().slice(0,10);
}

function toggleWish(e, name, amt, startDate, endDate) {
  e.stopPropagation();
  if (!currentUser) { showToast('로그인 후 이용 가능합니다', 'info'); openModal('modal-login'); return; }
  const idx = wishList.findIndex(w => w.name === name);
  const btn = e.currentTarget;
  if (idx !== -1) {
    wishList.splice(idx, 1);
    // 하트 off
    btn.querySelector('svg').setAttribute('fill', 'none');
    btn.style.color = '';
    btn.style.borderColor = '';
    btn.style.background = '';
    showToast(name + ' 찜 해제', 'info');
  } else {
    wishList.push({ name, amt, startDate, endDate });
    // 하트 on
    btn.querySelector('svg').setAttribute('fill', 'currentColor');
    btn.style.color = '#f43f5e';
    btn.style.borderColor = 'rgba(244,63,94,0.4)';
    btn.style.background = 'rgba(244,63,94,0.1)';
    showToast(name + ' 찜 완료! 캘린더에 추가됐어요 🎉', 'success');
  }
  // 같은 이름의 다른 버튼도 동기화
  document.querySelectorAll('.wish-btn[data-name="' + name + '"]').forEach(b => {
    const wished = wishList.some(w => w.name === name);
    b.querySelector('svg').setAttribute('fill', wished ? 'currentColor' : 'none');
    b.style.color = wished ? '#f43f5e' : '';
    b.style.borderColor = wished ? 'rgba(244,63,94,0.4)' : '';
    b.style.background = wished ? 'rgba(244,63,94,0.1)' : '';
  });
}

// ============================================================
// 캘린더
// ============================================================
let calYear = new Date().getFullYear();
let calMonth = new Date().getMonth();

function changeCalMonth(delta) {
  calMonth += delta;
  if (calMonth < 0) { calMonth = 11; calYear--; }
  if (calMonth > 11) { calMonth = 0; calYear++; }
  renderCalendar();
}

// 이벤트 색상
const EVENT_COLORS = [
  { bg:'rgba(6,182,212,0.18)', text:'#06b6d4', border:'rgba(6,182,212,0.5)' },
  { bg:'rgba(16,185,129,0.18)', text:'#10b981', border:'rgba(16,185,129,0.5)' },
  { bg:'rgba(139,92,246,0.18)', text:'#8b5cf6', border:'rgba(139,92,246,0.5)' },
  { bg:'rgba(244,63,94,0.18)', text:'#f43f5e', border:'rgba(244,63,94,0.5)' },
  { bg:'rgba(245,158,11,0.18)', text:'#f59e0b', border:'rgba(245,158,11,0.5)' },
];

function renderCalendar() {
  var months = ['1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'];
  document.getElementById('cal-title').textContent = calYear + '년 ' + months[calMonth];
  var firstDay = new Date(calYear, calMonth, 1).getDay();
  var daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  var _today = new Date();
  var todayStr = _today.getFullYear() + '-' + String(_today.getMonth()+1).padStart(2,'0') + '-' + String(_today.getDate()).padStart(2,'0');
  var curMonthStr = calYear + '-' + String(calMonth+1).padStart(2,'0');
  var colorMap = {};
  wishList.forEach(function(w, i) { colorMap[w.name] = EVENT_COLORS[i % EVENT_COLORS.length]; });
  var totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;
  var grid = document.getElementById('cal-grid');
  var t = '<table style="width:100%;border-collapse:collapse;table-layout:fixed;">';
  for (var week = 0; week < totalCells/7; week++) {
    t += '<tr>';
    for (var col = 0; col < 7; col++) {
      var day = week * 7 + col - firstDay + 1;
      var isValid = day >= 1 && day <= daysInMonth;
      var dateStr = isValid ? curMonthStr + '-' + String(day).padStart(2,'0') : '';
      var isToday = dateStr === todayStr;
      var dayEvents = isValid ? wishList.filter(function(w){
        return w.startDate && w.endDate   // 날짜 없는 항목 완전 제외
            && w.endDate >= todayStr      // 이미 지난 마감 제외
            && w.startDate <= dateStr && w.endDate >= dateStr;
      }) : [];
      t += '<td style="border:1px solid rgba(255,255,255,0.08);padding:4px 3px 3px;width:' + (100/7) + '%;vertical-align:top;height:80px;overflow:hidden;' + (isToday?'background:rgba(6,182,212,0.05);':'') + '">';
      if (isValid) {
        if (isToday) {
          t += '<div style="display:inline-flex;align-items:center;justify-content:center;width:22px;height:22px;border-radius:50%;background:#06b6d4;color:#0a0a0f;font-size:11px;font-weight:700;margin-bottom:3px;">' + day + '</div>';
        } else {
          t += '<div style="font-size:11px;font-weight:600;margin-bottom:3px;' + (col===0?'color:#f43f5e;':col===6?'color:#3b82f6;':'color:#a1a1aa;') + '">' + day + '</div>';
        }
        dayEvents.slice(0,2).forEach(function(w) {
          var color = colorMap[w.name];
          var isWStart = w.startDate === dateStr || col === 0;
          var isWEnd = w.endDate === dateStr || col === 6 || day === daysInMonth;
          var mL = isWStart ? '-3px' : '-4px';
          var mR = isWEnd ? '-3px' : '-4px';
          var brL = isWStart ? '4px' : '0';
          var brR = isWEnd ? '4px' : '0';
          t += '<div style="height:13px;margin-bottom:2px;margin-left:' + mL + ';margin-right:' + mR + ';background:' + color.bg + ';border-top:1px solid ' + color.border + ';border-bottom:1px solid ' + color.border + ';' + (isWStart?'border-left:1px solid '+color.border+';':'') + (isWEnd?'border-right:1px solid '+color.border+';':'') + 'border-radius:' + brL + ' ' + brR + ' ' + brR + ' ' + brL + ';display:flex;align-items:center;padding:0 4px;overflow:hidden;">' +
            (w.startDate===dateStr ? '<span style="font-size:9px;color:' + color.text + ';font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + w.name + '</span>' : '') +
            '</div>';
        });
        if (dayEvents.length > 2) t += '<div style="font-size:9px;color:#a1a1aa;">+' + (dayEvents.length-2) + '개</div>';
      }
      t += '</td>';
    }
    t += '</tr>';
  }
  t += '</table>';
  grid.innerHTML = t;
  renderWishList();
}

function renderWishList() {
  var list = document.getElementById('wish-list');
  var empty = document.getElementById('wish-empty');
  var count = document.getElementById('wish-count');
  if (!list) return;
  count.textContent = wishList.length;
  if (wishList.length === 0) { list.innerHTML=''; empty.classList.remove('hidden'); return; }
  empty.classList.add('hidden');

  // 마감순 정렬
  var sortMode = document.getElementById('wish-sort-btn') ? document.getElementById('wish-sort-btn').dataset.mode : 'deadline';
  var sorted = wishList.slice().map(function(w,i){return {w:w,i:i};});
  if (sortMode === 'deadline') {
    sorted.sort(function(a,b){ return new Date(a.w.endDate) - new Date(b.w.endDate); });
  }

  list.innerHTML = sorted.map(function(item) {
    var w = item.w; var i = item.i;
    var dday = typeof calcDday==='function' ? calcDday(w.endDate) : {label:'',color:'#a1a1aa'};
    var link = getWelfareLink(w.name);
    var hasDeadline = w.endDate && w.endDate !== 'null' && w.endDate !== '';
    return '<div class="bg-card border border-border rounded-xl p-4">' +
      '<div class="flex items-center justify-between mb-2">' +
      '<div class="flex items-center gap-2 flex-wrap">' +
      '<span class="font-medium text-sm">' + w.name + '</span>' +
      '<span style="font-size:11px;font-weight:700;color:' + dday.color + ';">' + dday.label + '</span>' +
      '</div>' +
      '<button onclick="removeWish(' + i + ')" class="w-7 h-7 rounded-lg border border-border flex items-center justify-center hover:bg-destructive/10 hover:border-destructive/40 hover:text-destructive transition-colors text-muted-foreground flex-shrink-0">' +
      '<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg></button>' +
      '</div>' +
      '<div class="text-xs text-muted-foreground mb-2">' + (hasDeadline ? (w.startDate + ' ~ ' + w.endDate) : '마감일 탐색 중...') + '</div>' +
      '<div class="flex items-center justify-between gap-2">' +
      '<span class="text-xs text-primary font-semibold">' + w.amt + '</span>' +
      '<div class="flex items-center gap-2">' +
      (link ? '<a href="' + link.url + '" target="_blank" class="text-xs px-2.5 py-1 border border-primary/30 text-primary rounded-lg hover:bg-primary/10 transition-colors">신청 →</a>' : '') +
      '</div></div></div>';
  }).join('');
}


function getWelfareLink(name) {
  var links = {
    '구직촉진수당': {url:'https://www.work.go.kr/jobSupport/apply/NationalEmployment.do', label:'워크넷'},
    '청년내일저축계좌': {url:'https://www.bokjiro.go.kr', label:'복지로'},
    '청년 월세 특별지원': {url:'https://www.bokjiro.go.kr', label:'복지로'},
    '내일배움카드': {url:'https://www.hrd.go.kr', label:'HRD넷'},
    '청년도약계좌': {url:'https://ylaccount.kinfa.or.kr', label:'서민금융진흥원'},
    '청년내일채움공제': {url:'https://www.work.go.kr', label:'워크넷'},
    '취업성공패키지': {url:'https://www.work.go.kr', label:'워크넷'},
    '국민취업지원제도': {url:'https://www.kua.go.kr', label:'국민취업지원'},
  };
  for (var key in links) {
    if (name.includes(key)) return links[key];
  }
  return {url:'https://www.bokjiro.go.kr', label:'복지로'};
}


async function removeWish(idx) {
  var removed = wishList[idx];
  wishList.splice(idx, 1);
  if (removed) {
    document.querySelectorAll('.wish-btn[data-name="' + removed.name + '"]').forEach(function(b) {
      b.querySelector('svg').setAttribute('fill','none');
      b.style.color=''; b.style.borderColor=''; b.style.background='';
    });
    // 서버에도 삭제
    if (removed.id) {
      try { await apiRemoveWish(removed.id); } catch(e) { console.warn('서버 삭제 실패', e); }
    }
  }
  renderCalendar();
  renderMypageWish();
  renderWishList();
  if (typeof checkUrgentBanner==='function') checkUrgentBanner();
}

// ============================================================
// 내 정보
// ============================================================
let myNickChecked = false;

function openMyPage() {
  if (!currentUser) { openModal('modal-login'); return; }
  var _myEmoji = currentUser.nicknameEmoji || '';
  document.getElementById('mypage-avatar').textContent = _myEmoji || currentUser.nickname[0];
  document.getElementById('mypage-nickname').textContent = currentUser.nickname;
  var _emojiEl = document.getElementById('mypage-nickname-emoji');
  if (_emojiEl) _emojiEl.textContent = _myEmoji;
  document.getElementById('mypage-username').textContent = `@${currentUser.username}`;
  document.getElementById('mypage-role').textContent = currentUser.role === 'ADMIN' ? '👑 관리자' : '일반 회원';
  document.getElementById('my-new-nick').value = '';
  document.getElementById('my-nick-msg').classList.add('hidden');
  document.getElementById('my-cur-pw').value = '';
  document.getElementById('my-new-pw').value = '';
  document.getElementById('my-new-pw2').value = '';
  document.getElementById('my-pw-err').classList.add('hidden');
  myNickChecked = false;
  renderMypageWish();
  if (currentUser && typeof apiAttendanceStatus === 'function') {
    apiAttendanceStatus().then(function(s) {
      _attendanceStatus = s;
      refreshMypagePoints();
    }).catch(function(){});
  }
  _origGoPage('mypage');
}

function renderMypageWish() {
  const list = document.getElementById('mypage-wish-list');
  const empty = document.getElementById('mypage-wish-empty');
  if (!list) return;
  if (wishList.length === 0) {
    list.innerHTML = '';
    empty.classList.remove('hidden');
    return;
  }
  empty.classList.add('hidden');
  list.innerHTML = wishList.map((w,i) => `
    <div class="flex items-center justify-between p-3 bg-background rounded-xl border border-border">
      <div>
        <div class="text-sm font-medium">${w.name}</div>
        <div class="text-xs text-primary">${w.amt}</div>
      </div>
      <button onclick="removeWish(${i});renderMypageWish()" class="text-xs text-muted-foreground hover:text-destructive transition-colors">삭제</button>
    </div>`).join('');
}

async function checkMyNick() {
  const val = document.getElementById('my-new-nick').value.trim();
  const msgEl = document.getElementById('my-nick-msg');
  msgEl.classList.remove('hidden');
  if (!val) { msgEl.textContent = '닉네임을 입력해주세요'; msgEl.className = 'text-xs mt-1 text-destructive'; myNickChecked = false; return; }
  if (val === currentUser.nickname) { msgEl.textContent = '현재 닉네임과 동일합니다'; msgEl.className = 'text-xs mt-1 text-destructive'; myNickChecked = false; return; }
  msgEl.textContent = '확인 중...'; msgEl.className = 'text-xs mt-1 text-muted-foreground';
  try {
    const res = await apiCheckDuplicate('nickname', val);
    if (res.available) { msgEl.textContent = '사용 가능한 닉네임입니다'; msgEl.className = 'text-xs mt-1 text-success'; myNickChecked = true; }
    else { msgEl.textContent = '이미 사용 중인 닉네임입니다'; msgEl.className = 'text-xs mt-1 text-destructive'; myNickChecked = false; }
  } catch(e) { msgEl.textContent = '확인 실패, 다시 시도해주세요'; msgEl.className = 'text-xs mt-1 text-destructive'; myNickChecked = false; }
}

async function changeNickname() {
  if (!myNickChecked) { showToast('닉네임 중복확인을 해주세요', 'error'); return; }
  const val = document.getElementById('my-new-nick').value.trim();
  if (!val) { showToast('닉네임을 입력해주세요', 'error'); return; }
  try {
    const res = await apiFetch('/api/auth/nickname', { method: 'PUT', body: JSON.stringify({ nickname: val }) });
    if (!res.success) { showToast(res.message || '닉네임 변경 실패', 'error'); return; }
    currentUser.nickname = val;
    var _e = currentUser.nicknameEmoji || '';
    document.getElementById('nav-username').textContent = _e ? _e + ' ' + val : val;
    document.getElementById('mypage-nickname').textContent = val;
    document.getElementById('mypage-avatar').textContent = _e || val[0];
    document.getElementById('my-new-nick').value = '';
    document.getElementById('my-nick-msg').classList.add('hidden');
    myNickChecked = false;
    showToast('닉네임이 변경되었습니다', 'success');
  } catch(e) { showToast('닉네임 변경 중 오류가 발생했습니다', 'error'); }
}

async function changePassword() {
  const cur = document.getElementById('my-cur-pw').value;
  const nw  = document.getElementById('my-new-pw').value;
  const nw2 = document.getElementById('my-new-pw2').value;
  const errEl = document.getElementById('my-pw-err');
  errEl.classList.add('hidden');
  if (!cur) { errEl.textContent = '현재 비밀번호를 입력해주세요'; errEl.classList.remove('hidden'); return; }
  if (nw.length < 4) { errEl.textContent = '새 비밀번호는 4자 이상이어야 합니다'; errEl.classList.remove('hidden'); return; }
  if (nw !== nw2) { errEl.textContent = '새 비밀번호가 일치하지 않습니다'; errEl.classList.remove('hidden'); return; }
  try {
    const res = await apiFetch('/api/auth/password', { method: 'PUT', body: JSON.stringify({ currentPassword: cur, newPassword: nw }) });
    if (!res.success) { errEl.textContent = res.message || '비밀번호 변경 실패'; errEl.classList.remove('hidden'); return; }
    document.getElementById('my-cur-pw').value = '';
    document.getElementById('my-new-pw').value = '';
    document.getElementById('my-new-pw2').value = '';
    showToast('비밀번호가 변경되었습니다', 'success');
  } catch(e) { errEl.textContent = '비밀번호 변경 중 오류가 발생했습니다'; errEl.classList.remove('hidden'); }
}

// ============================================================
// 다크/라이트 모드
// ============================================================
// ============================================================
// 혜택 상세보기 모달
// ============================================================
let _bdIdx = -1;

function openBenefitDetail(idx) {
  const s = (window._diagServices || [])[idx];
  if (!s) return;
  _bdIdx = idx;

  document.getElementById('bd-title').textContent = s.name || '';
  document.getElementById('bd-desc').textContent = s.reason || '';
  document.getElementById('bd-amt').textContent = s.amt || '정보 없음';
  document.getElementById('bd-period').textContent = s.period || '정보 없음';
  document.getElementById('bd-deadline').textContent = s.deadline || '상시 접수';
  document.getElementById('bd-org').textContent = s.organization || s.org || '중앙부처 · 고용노동부';
  document.getElementById('bd-link').href = s.url || 'https://www.bokjiro.go.kr';
  document.getElementById('bd-category').textContent = s.category || s.type || '복지혜택';

  const wished = Array.isArray(wishList) && wishList.some(w => w.name === s.name);
  _bdSetHeart(wished);

  const overlay = document.getElementById('benefit-detail-overlay');
  const panel = document.getElementById('benefit-detail-panel');
  overlay.style.display = 'block';
  panel.style.display = 'block';
  requestAnimationFrame(() => {
    panel.style.transform = 'translate(-50%,-50%) scale(1)';
    panel.style.opacity = '1';
  });
  document.body.style.overflow = 'hidden';
}

function closeBenefitDetail() {
  const panel = document.getElementById('benefit-detail-panel');
  panel.style.transform = 'translate(-50%,-52%) scale(0.95)';
  panel.style.opacity = '0';
  setTimeout(() => {
    document.getElementById('benefit-detail-overlay').style.display = 'none';
    panel.style.display = 'none';
    document.body.style.overflow = '';
  }, 200);
}

function _bdSetHeart(on) {
  const btn = document.getElementById('bd-wish-btn');
  const svg = document.getElementById('bd-heart');
  if (on) {
    svg.setAttribute('fill', '#f43f5e'); svg.setAttribute('stroke', '#f43f5e');
    btn.style.cssText = 'width:44px;height:44px;flex-shrink:0;border-radius:12px;border:1.5px solid rgba(244,63,94,0.4);background:rgba(244,63,94,0.08);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .2s;';
  } else {
    svg.setAttribute('fill', 'none'); svg.setAttribute('stroke', '#94a3b8');
    btn.style.cssText = 'width:44px;height:44px;flex-shrink:0;border-radius:12px;border:1.5px solid #e2e8f0;background:#ffffff;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .2s;';
  }
}

function bdToggleWish() {
  const s = (window._diagServices || [])[_bdIdx];
  if (!s) return;
  const startDate = typeof today === 'function' ? today() : '';
  const endDate = typeof todayPlusDays === 'function' ? todayPlusDays(180) : '';
  toggleWish({ stopPropagation: () => {} }, s.name, s.amt, startDate, endDate);
  const wished = Array.isArray(wishList) && wishList.some(w => w.name === s.name);
  _bdSetHeart(wished);
  const cardBtn = document.querySelector(`.wish-btn[data-name="${s.name.replace(/"/g, '\\"')}"]`);
  if (cardBtn) {
    cardBtn.querySelector('svg').setAttribute('fill', wished ? 'currentColor' : 'none');
    cardBtn.style.color = wished ? '#f43f5e' : '';
    cardBtn.style.borderColor = wished ? 'rgba(244,63,94,0.4)' : '';
    cardBtn.style.background = wished ? 'rgba(244,63,94,0.1)' : '';
  }
}


let isLightMode = true;

function toggleDarkMode() {
  isLightMode = !isLightMode;
  document.body.classList.toggle('light-mode', isLightMode);
  document.getElementById('dark-icon').classList.toggle('hidden', isLightMode);
  document.getElementById('light-icon').classList.toggle('hidden', !isLightMode);
}

// ============================================================
// 스크롤 애니메이션 (IntersectionObserver)
// ============================================================
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('revealed'), i * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

function initScrollReveal() {
  document.querySelectorAll('#page-home section:not(:first-child), #page-home .step-card, #page-home .faq-item, #page-home .bg-card.border').forEach(el => {
    el.classList.add('scroll-reveal');
    revealObserver.observe(el);
  });
}

// ============================================================
// goPage 오버라이드 (캘린더/마이페이지 처리)
// ============================================================
const _origGoPage = goPage;
window.goPage = function(name) {
  if (name === 'calendar') {
    if (!currentUser) { showToast('로그인 후 이용 가능합니다', 'info'); openModal('modal-login'); return; }
    _origGoPage('calendar');
    calYear = new Date().getFullYear();
    calMonth = new Date().getMonth();
    return;
  }
  if (name === 'mypage') { /* openMyPage 직접 호출 */ return; }
  _origGoPage(name);
}

// doRegister 후 홈으로 이동 (이미 doRegister에서 goPage('home') 호출하지만 확인)
// doLogin 후에도 이미 home 유지

function toggleWishSort() {
  var btn = document.getElementById('wish-sort-btn');
  if (!btn) return;
  btn.dataset.mode = btn.dataset.mode === 'deadline' ? 'added' : 'deadline';
  btn.textContent = btn.dataset.mode === 'deadline' ? '마감순 ↑' : '추가순';
  renderWishList();
}





var bookmarks = new Set();
function toggleBookmarkPost() {
  if (!currentUser) { showToast('로그인 후 이용 가능합니다','info'); return; }
  toggleBookmark(currentPostId);
  var btn = document.getElementById('bookmark-btn-post');
  if (btn) {
    var isB = bookmarks.has(currentPostId);
    btn.querySelector('svg').setAttribute('fill', isB ? 'currentColor' : 'none');
    btn.style.color = isB ? '#f59e0b' : '';
    btn.style.borderColor = isB ? 'rgba(245,158,11,0.4)' : '';
  }
}
function toggleBookmark(postId) {
  if (!currentUser) { showToast('로그인 후 이용 가능합니다','info'); return; }
  if (bookmarks.has(postId)) {
    bookmarks.delete(postId);
    showToast('북마크 해제','info');
  } else {
    bookmarks.add(postId);
    showToast('북마크에 추가됐어요!','success');
  }
  var btn = document.getElementById('bookmark-btn-' + postId);
  if (btn) {
    btn.querySelector('svg').setAttribute('fill', bookmarks.has(postId) ? 'currentColor' : 'none');
    btn.style.color = bookmarks.has(postId) ? '#f59e0b' : '';
  }
}

var commentLikes = {};
function toggleCommentLike(commentId) {
  if (!currentUser) { showToast('로그인 후 이용 가능합니다','info'); return; }
  if (!commentLikes[commentId]) commentLikes[commentId] = {count:0, liked:false};
  var lk = commentLikes[commentId];
  lk.liked = !lk.liked; lk.count += lk.liked ? 1 : -1;
  var btn = document.getElementById('clk-' + commentId);
  var cnt = document.getElementById('clk-cnt-' + commentId);
  if (btn) { btn.style.color = lk.liked ? '#f43f5e' : ''; btn.querySelector('svg').setAttribute('fill', lk.liked ? 'currentColor' : 'none'); }
  if (cnt) cnt.textContent = lk.count;
}

function showMyPosts() {
  if (!currentUser) { showToast('로그인 후 이용 가능합니다','info'); return; }
  var myPosts = posts.filter(function(p){ return p.author === currentUser.nickname; });
  var modal = document.getElementById('my-posts-modal');
  if (!modal) return;
  document.getElementById('my-posts-list').innerHTML = myPosts.length === 0
    ? '<div class="text-sm text-muted-foreground text-center py-8">작성한 게시글이 없어요</div>'
    : myPosts.map(function(p){
        return '<div onclick="closeMyPosts();openPost('+p.id+')" class="flex items-center justify-between py-3 border-b border-border/50 last:border-0 cursor-pointer hover:text-primary transition-colors">' +
          '<div class="flex-1 min-w-0"><div class="text-sm font-medium truncate">'+p.title+'</div>' +
          '<div class="text-xs text-muted-foreground mt-0.5">'+p.date+' · 댓글 '+p.comments.length+'</div></div>' +
          '<svg class="w-4 h-4 text-muted-foreground flex-shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>' +
          '</div>';
      }).join('');
  modal.style.display = 'flex';
}
function closeMyPosts() {
  var modal = document.getElementById('my-posts-modal');
  if (modal) modal.style.display = 'none';
}

function calcTotalBenefit() {
  var amtMap = {
    '구직촉진수당': 300,
    '청년내일저축계좌': 1440,
    '청년 월세 특별지원': 2400,
    '내일배움카드': 500,
    '청년도약계좌': 5000,
    '청년내일채움공제': 1200,
    '취업성공수당': 150,
    '국민취업지원제도': 300,
  };
  var total = 0;
  wishList.forEach(function(w) {
    for (var key in amtMap) {
      if (w.name.includes(key)) { total += amtMap[key]; break; }
    }
  });
  var el = document.getElementById('total-benefit-calc');
  if (el) el.textContent = total > 0 ? '최대 ' + total.toLocaleString() + '만원' : '찜한 혜택이 없어요';
}

function initTlObserver() {
  // 가로선
  var line = document.getElementById('tl-line-el');
  if (line) {
    var lineObs = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.remove('tl-line-hidden');
          entry.target.classList.add('tl-line-visible');
          lineObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    lineObs.observe(line);
  }

  // 카드 & 점
  var obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        var el = entry.target;
        var type = el.dataset.tlAnim;
        if (type === 'top') {
          el.classList.remove('tl-node-top-hidden');
          el.classList.add('tl-node-top-visible');
        } else if (type === 'bottom') {
          el.classList.remove('tl-node-bottom-hidden');
          el.classList.add('tl-node-bottom-visible');
        } else if (type === 'dot') {
          el.classList.remove('tl-dot-hidden');
          el.classList.add('tl-dot-visible');
        }
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.2, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('[data-tl-anim]').forEach(function(el) {
    obs.observe(el);
  });
}

function updateInlineColors(hex) {
  var oldColor = '06b6d4';
  // 기존 색상 패턴들
  var patterns = [
    { find: '#06b6d4', replace: hex },
    { find: 'rgba(6,182,212,', replace: 'rgba(' + parseInt(hex.slice(1,3),16) + ',' + parseInt(hex.slice(3,5),16) + ',' + parseInt(hex.slice(5,7),16) + ',' },
  ];

  // 동적으로 생성된 요소들 (타임라인 카드, 트래커 등)
  document.querySelectorAll('[style]').forEach(function(el) {
    var style = el.getAttribute('style');
    if (!style) return;
    var newStyle = style;
    patterns.forEach(function(p) {
      newStyle = newStyle.split(p.find).join(p.replace);
    });
    if (newStyle !== style) el.setAttribute('style', newStyle);
  });

  // 로드맵 다시 렌더 (색상 반영)
  if (typeof renderTlPage === 'function' && window._tlData) {
    window._tlData.months.forEach(function(m) { m.color = hex; });
    renderTlPage();
    if (typeof initTlObserver === 'function') setTimeout(initTlObserver, 100);
  }
}

// 초기화
setTimeout(() => { initScrollReveal(); initSliders(); }, 100);

// ========== 추가 기능 ==========
function calcDday(endDate) {
  var today = new Date(); today.setHours(0,0,0,0);
  var end = new Date(endDate); end.setHours(0,0,0,0);
  var diff = Math.ceil((end - today) / 86400000);
  if (diff < 0) return {label:'마감',color:'#a1a1aa'};
  if (diff === 0) return {label:'D-day',color:'#ef4444'};
  if (diff <= 7) return {label:'D-'+diff,color:'#ef4444'};
  if (diff <= 30) return {label:'D-'+diff,color:'#f59e0b'};
  return {label:'D-'+diff,color:'#a1a1aa'};
}
function checkUrgentBanner() {
  var urgent = wishList.filter(function(w) {
    return Math.ceil((new Date(w.endDate)-new Date())/86400000) <= 7 &&
           Math.ceil((new Date(w.endDate)-new Date())/86400000) >= 0;
  });
  var banner = document.getElementById('urgent-banner');
  if (!banner) {
    banner = document.createElement('div');
    banner.id = 'urgent-banner';
    banner.style.cssText = 'position:fixed;top:64px;left:0;right:0;z-index:40;transition:all .3s;transform:translateY(-100%);opacity:0;';
    document.body.appendChild(banner);
  }
  if (!urgent.length) { banner.style.transform='translateY(-100%)'; banner.style.opacity='0'; return; }
  var item = urgent[0];
  var dday = calcDday(item.endDate);
  banner.style.transform = 'translateY(0)'; banner.style.opacity = '1';
  var div = document.createElement('div');
  div.style.cssText = 'background:rgba(239,68,68,0.1);border-bottom:1px solid rgba(239,68,68,0.3);padding:8px 24px;display:flex;align-items:center;justify-content:space-between;';
  var left = document.createElement('div');
  left.style.cssText = 'display:flex;align-items:center;gap:12px;';
  left.innerHTML = '<span style="font-size:12px;font-weight:700;color:#ef4444;">⚠ 마감 임박</span>' +
    '<span style="font-size:12px;color:#fafafa;">' + item.name + '</span>' +
    '<span style="font-size:11px;font-weight:700;color:#ef4444;">' + dday.label + '</span>' +
    (urgent.length > 1 ? '<span style="font-size:11px;color:#a1a1aa;">외 ' + (urgent.length-1) + '건</span>' : '');
  var closeBtn = document.createElement('button');
  closeBtn.style.cssText = 'background:none;border:none;cursor:pointer;color:#a1a1aa;font-size:16px;';
  closeBtn.textContent = '✕';
  closeBtn.onclick = function() { banner.style.opacity='0'; };
  div.appendChild(left); div.appendChild(closeBtn);
  banner.innerHTML = '';
  banner.appendChild(div);
}
function updateNoticeBadge() {
  if (!Array.isArray(posts)) return;
  var lastSeen=0; try{lastSeen=parseInt(localStorage.getItem('lastSeenNoticeId')||'0');}catch(e){}
  var cnt=posts.filter(function(p){return p.board==='notice'&&p.id>lastSeen;}).length;
  var badge=document.getElementById('notice-nav-badge');
  if (!badge) return;
  if (cnt>0){badge.textContent=cnt>9?'9+':cnt;badge.classList.remove('hidden');}else badge.classList.add('hidden');
}
function markNoticeRead() {
  if (!Array.isArray(posts)||!posts.length) return;
  var notices=posts.filter(function(p){return p.board==='notice';});
  var maxId=notices.length?Math.max.apply(null,notices.map(function(p){return p.id;})):0;
  try{localStorage.setItem('lastSeenNoticeId',maxId);}catch(e){} updateNoticeBadge();
}
var postLikes={};
function initLikes(){ if(!Array.isArray(posts))return; posts.forEach(function(p){if(!postLikes[p.id])postLikes[p.id]={count:Math.floor(Math.random()*15),liked:false};}); }
function toggleLikePost(){
  if(!currentUser){showToast('로그인 후 이용 가능합니다','info');return;}
  if(!postLikes[currentPostId])postLikes[currentPostId]={count:0,liked:false};
  var lk=postLikes[currentPostId]; lk.liked=!lk.liked; lk.count+=lk.liked?1:-1;
  var btn=document.getElementById('like-btn-post'),cnt=document.getElementById('like-count-post');
  if(btn){btn.style.color=lk.liked?'#f43f5e':'';btn.style.borderColor=lk.liked?'rgba(244,63,94,0.4)':'';btn.style.background=lk.liked?'rgba(244,63,94,0.1)':'';btn.querySelector('svg').setAttribute('fill',lk.liked?'currentColor':'none');}
  if(cnt)cnt.textContent=lk.count;
}
var diagHistory=(function(){try{return JSON.parse(localStorage.getItem(_lsK('diagHistory'))||'[]');}catch(e){return [];}})();
function saveDiagHistory(inputText,result){
  var today=new Date().toISOString().slice(0,10);
  diagHistory.unshift({date:today,input:inputText,result:result});
  if(diagHistory.length>5)diagHistory.pop();
  try{localStorage.setItem(_lsK('diagHistory'),JSON.stringify(diagHistory));localStorage.setItem(_lsK('lastDiagDate'),today);}catch(e){}
  renderDiagHistory();
  renderRetentionWidget();
}
function renderDiagHistory(){
  var el=document.getElementById('diag-history-list'); if(!el)return;
  if(!diagHistory.length){el.innerHTML='<div class="text-xs text-muted-foreground text-center py-3">이전 진단 기록이 없어요</div>';return;}
  el.innerHTML=diagHistory.map(function(h,i){return '<button onclick="loadDiagHistory('+i+')" class="w-full text-left px-3 py-2.5 rounded-xl border border-border hover:border-primary/40 hover:bg-muted/30 transition-all"><div class="flex items-center justify-between mb-1"><span class="text-xs text-primary font-medium">'+h.result.count+'개 혜택</span><span class="text-xs text-muted-foreground">'+h.date+'</span></div><div class="text-xs text-muted-foreground truncate">'+h.input+'</div></button>';}).join('');
}
function loadDiagHistory(idx){
  var h=diagHistory[idx]; if(!h)return;
  document.getElementById('diag-input').value=h.input;
  var d=h.result;
  document.getElementById('r-parse').textContent=d.parse;
  document.getElementById('r-count').textContent=d.count;
  document.getElementById('r-amount').textContent=d.amount;
  document.getElementById('r-deadline').textContent=d.deadline;
  document.getElementById('r-title').textContent='수혜 목록 — '+d.count+'건';
  showDiagState('s-result');
}
var checklistState={};
var CHECKLIST_STEPS={'구직촉진수당':['워크넷 구직 등록','고용센터 방문 예약','신분증+졸업증명서 준비','신청서 제출'],'청년내일저축계좌':['소득 기준 확인','주민센터 방문','통장 사본 준비','신청서 제출'],'청년 월세 특별지원':['임대차계약서 준비','주민센터 방문','서류 제출','결과 확인'],'청년도약계좌':['은행 방문 또는 앱 신청','소득 증빙 준비','계좌 개설','자동이체 설정']};
function buildChecklist(serviceName){
  var steps=['자격 조건 확인','필요 서류 준비','신청서 작성','제출 및 결과 확인'];
  var keys=Object.keys(CHECKLIST_STEPS);
  for(var k=0;k<keys.length;k++){if(serviceName.includes(keys[k])||keys[k].includes(serviceName)){steps=CHECKLIST_STEPS[keys[k]];break;}}
  return steps.map(function(step,i){
    var key=(serviceName+i).replace(/[^a-zA-Z0-9가-힣]/g,'_');
    var done=checklistState[key]||false;
    return '<div data-key="'+key+'" onclick="toggleCheck(this.dataset.key,this)" style="display:flex;align-items:center;gap:8px;cursor:pointer;padding:4px 0;">' +
      '<div style="width:14px;height:14px;border-radius:3px;border:1px solid '+(done?'rgba(6,182,212,0.5)':'#27272a')+';flex-shrink:0;display:flex;align-items:center;justify-content:center;background:'+(done?'rgba(6,182,212,0.15)':'transparent')+';transition:all .2s;">' +
      '<svg style="width:9px;height:9px;opacity:'+(done?'1':'0')+';" fill="none" stroke="#06b6d4" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg></div>' +
      '<span style="font-size:12px;'+(done?'text-decoration:line-through;color:#a1a1aa;':'')+'">' + step + '</span></div>';
  }).join('');
}
function toggleCheck(key,el){
  checklistState[key]=!checklistState[key]; var done=checklistState[key];
  var box=el.querySelector('div'),text=el.querySelector('span');
  if(box){box.style.background=done?'rgba(6,182,212,0.15)':'transparent';box.style.borderColor=done?'rgba(6,182,212,0.5)':'#27272a';box.querySelector('svg').style.opacity=done?'1':'0';}
  if(text)text.style.textDecoration=done?'line-through':'';
}
var roadmapChecks=(function(){try{return JSON.parse(localStorage.getItem(_lsK('rmChecks'))||'{}');}catch(e){return {};}})();
function toggleRoadmapCheck(key,el){
  roadmapChecks[key]=!roadmapChecks[key]; var done=roadmapChecks[key];
  try{localStorage.setItem(_lsK('rmChecks'),JSON.stringify(roadmapChecks));}catch(e){}
  var box=el.querySelector('.rm-chk-box'),text=el.querySelector('.rm-chk-text');
  if(box){box.style.background=done?'rgba(6,182,212,0.15)':'';box.style.borderColor=done?'rgba(6,182,212,0.5)':'';box.querySelector('svg').style.opacity=done?'1':'0';}
  if(text)text.style.textDecoration=done?'line-through':'';
  updateRoadmapProgress();
}
function updateRoadmapProgress(){
  if(!currentRmData)return;
  var total=0,done=0;
  currentRmData.months.forEach(function(m,mi){
    m.tasks.forEach(function(t,ci){
      t.items.forEach(function(item,ii){
        total++;
        var ck=m.month+'-'+ci+'-'+ii;
        if(roadmapChecks[ck])done++;
      });
    });
  });
  var pct=total?Math.round(done/total*100):0;
  var barEl=document.getElementById('roadmap-progress-bar');
  var txtEl=document.getElementById('roadmap-progress-text');
  if(barEl)barEl.style.width=pct+'%';
  if(txtEl)txtEl.textContent=done+' / '+total+' 완료 ('+pct+'%)';
  try{localStorage.setItem(_lsK('rmProgress'),JSON.stringify({done:done,total:total,job:selectedJob||'',period:selectedPeriod||'',date:new Date().toISOString().slice(0,10)}));}catch(e){}
  renderRetentionWidget();
}

function reloadUserStorage(){
  try{diagHistory=JSON.parse(localStorage.getItem(_lsK('diagHistory'))||'[]');}catch(e){diagHistory=[];}
  try{roadmapChecks=JSON.parse(localStorage.getItem(_lsK('rmChecks'))||'{}');}catch(e){roadmapChecks={};}
  wishList=[];
  renderDiagHistory();
}
function renderRetentionWidget(){
  var el=document.getElementById('retention-widget');
  if(!el)return;
  var rmProg=null;
  try{rmProg=JSON.parse(localStorage.getItem(_lsK('rmProgress'))||'null');}catch(e){}
  var lastDiag=null;
  try{lastDiag=localStorage.getItem(_lsK('lastDiagDate'));}catch(e){}
  var diagDays=lastDiag?Math.floor((new Date()-new Date(lastDiag))/86400000):null;
  var urgentWish=wishList.filter(function(w){
    if(!w.endDate)return false;
    var diff=Math.ceil((new Date(w.endDate)-new Date())/86400000);
    return diff>=0&&diff<=14;
  }).sort(function(a,b){return new Date(a.endDate)-new Date(b.endDate);});
  var hasData=(rmProg&&rmProg.total>0)||(diagDays!==null)||urgentWish.length||wishList.length;
  if(!hasData){el.classList.add('hidden');return;}
  el.classList.remove('hidden');
  var rows=[];
  if(rmProg&&rmProg.total>0){
    var pct=Math.round(rmProg.done/rmProg.total*100);
    var jobLabel=rmProg.job?(rmProg.job+' · '):'';
    rows.push('<div class="flex items-center gap-3 py-2.5 border-b border-border/40 last:border-0">'+
      '<span class="text-xl flex-shrink-0">🗺️</span>'+
      '<div class="flex-1 min-w-0">'+
      '<div class="flex items-center justify-between mb-1.5">'+
      '<span class="text-xs font-semibold">로드맵 진행</span>'+
      '<span class="text-xs text-muted-foreground">'+rmProg.done+' / '+rmProg.total+' 완료</span>'+
      '</div>'+
      '<div class="h-1.5 bg-muted rounded-full overflow-hidden">'+
      '<div class="h-1.5 bg-primary rounded-full transition-all duration-500" style="width:'+pct+'%"></div>'+
      '</div>'+
      '<div class="text-xs text-muted-foreground mt-1">'+jobLabel+rmProg.period+'</div>'+
      '</div>'+
      '<button onclick="goPage(\'roadmap\')" class="flex-shrink-0 text-xs text-primary font-semibold hover:underline whitespace-nowrap">이어하기 →</button>'+
      '</div>');
  }
  if(diagDays!==null){
    var diagText=diagDays===0?'오늘 진단하셨어요':diagDays+'일 전 진단';
    var nudge=diagDays>=14?' · 상황이 바뀌셨나요?':diagDays>=7?' · 다시 확인해보세요':'';
    rows.push('<div class="flex items-center gap-3 py-2.5 border-b border-border/40 last:border-0">'+
      '<span class="text-xl flex-shrink-0">🔍</span>'+
      '<div class="flex-1 min-w-0">'+
      '<span class="text-xs font-medium">'+diagText+'</span>'+
      (nudge?'<span class="text-xs text-muted-foreground">'+nudge+'</span>':'')+
      '</div>'+
      (diagDays>=7?'<button onclick="goPage(\'diagnosis\')" class="flex-shrink-0 text-xs text-primary font-semibold hover:underline whitespace-nowrap">재진단 →</button>':'')+
      '</div>');
  }
  if(urgentWish.length){
    var w=urgentWish[0];
    var diff=Math.ceil((new Date(w.endDate)-new Date())/86400000);
    var ddayColor=diff<=3?'#ef4444':diff<=7?'#f59e0b':'#06b6d4';
    rows.push('<div class="flex items-center gap-3 py-2.5 border-b border-border/40 last:border-0">'+
      '<span class="text-xl flex-shrink-0">⏰</span>'+
      '<div class="flex-1 min-w-0">'+
      '<span class="text-xs font-bold" style="color:'+ddayColor+'">D-'+diff+'</span>'+
      '<span class="text-xs text-muted-foreground ml-1.5">'+w.name+(urgentWish.length>1?' 외 '+(urgentWish.length-1)+'건':'')+' 마감 임박</span>'+
      '</div>'+
      '<button onclick="goPage(\'calendar\')" class="flex-shrink-0 text-xs text-primary font-semibold hover:underline whitespace-nowrap">확인 →</button>'+
      '</div>');
  } else if(wishList.length){
    rows.push('<div class="flex items-center gap-3 py-2.5 border-b border-border/40 last:border-0">'+
      '<span class="text-xl flex-shrink-0">♡</span>'+
      '<div class="flex-1 min-w-0"><span class="text-xs text-muted-foreground">찜한 서비스 '+wishList.length+'건</span></div>'+
      '<button onclick="goPage(\'calendar\')" class="flex-shrink-0 text-xs text-primary font-semibold hover:underline whitespace-nowrap">캘린더 →</button>'+
      '</div>');
  }
  if(!rows.length){el.classList.add('hidden');return;}
  el.innerHTML='<div class="max-w-2xl mx-auto px-4"><div class="bg-card border border-border rounded-2xl px-5 pt-4 pb-2">'+
    '<div class="flex items-center gap-2 mb-1"><span class="text-sm font-bold">내 취업 준비 현황</span></div>'+
    rows.join('')+'</div></div>';
}
function renderPopularPosts(){
  var el=document.getElementById('popular-posts'); if(!el||!Array.isArray(posts))return;
  var sorted=posts.slice().filter(function(p){return !p.pinned;}).sort(function(a,b){return ((postLikes[b.id]||{count:0}).count+b.comments.length*2)-((postLikes[a.id]||{count:0}).count+a.comments.length*2);}).slice(0,5);
  if(!sorted.length){el.innerHTML='<div class="text-xs text-muted-foreground text-center py-3">게시글이 없어요</div>';return;}
  el.innerHTML=sorted.map(function(p,i){return '<button onclick="openPost('+p.id+')" class="w-full text-left flex items-start gap-2 py-2 border-b border-border/50 last:border-0 hover:text-primary transition-colors"><span class="text-xs font-bold text-muted-foreground w-4 flex-shrink-0">'+(i+1)+'</span><div class="flex-1 min-w-0"><div class="text-xs font-medium truncate">'+p.title+'</div><div class="flex gap-2 mt-0.5"><span class="text-[10px] text-muted-foreground">♥ '+(postLikes[p.id]||{count:0}).count+'</span><span class="text-[10px] text-muted-foreground">댓글 '+p.comments.length+'</span></div></div></button>';}).join('');
}
var activeTag='';
function toggleTag(tag){
  activeTag=activeTag===tag?'':tag;
  document.querySelectorAll('.search-tag').forEach(function(t){var on=t.dataset.tag===activeTag;t.style.background=on?'rgba(6,182,212,0.15)':'';t.style.borderColor=on?'rgba(6,182,212,0.5)':'';t.style.color=on?'#06b6d4':'';});
  filterPosts();
}
function filterPosts(){
  var keyword=((document.getElementById('search-input')||{value:''}).value||'').trim().toLowerCase();
  var filtered=posts.filter(function(p){if(p.board!==currentBoard)return false;var matchTag=!activeTag||p.title.includes(activeTag)||p.content.includes(activeTag);var matchKw=!keyword||p.title.toLowerCase().includes(keyword)||p.content.toLowerCase().includes(keyword);return matchTag&&matchKw;});
  var listEl=document.getElementById('post-list-body'); if(!listEl){renderCommunity();return;}
  if(!filtered.length){listEl.innerHTML='<div class="px-6 py-12 text-center text-muted-foreground text-sm">검색 결과가 없어요</div>';return;}
  var paged=filtered.slice((currentPage-1)*PAGE_SIZE,currentPage*PAGE_SIZE);
  listEl.innerHTML=paged.map(function(p,i){return '<div onclick="openPost('+p.id+')" class="grid grid-cols-12 px-6 py-4 border-b border-border/50 hover:bg-muted/20 cursor-pointer transition-colors last:border-b-0"><div class="col-span-1 text-center text-sm text-muted-foreground">'+(filtered.length-(currentPage-1)*PAGE_SIZE-i)+'</div><div class="col-span-7 flex items-center gap-2">'+(p.pinned?'<span class="text-xs px-1.5 py-0.5 bg-warning/10 text-warning rounded">📌</span>':'')+'<span class="text-sm font-medium truncate">'+p.title+'</span>'+(p.comments.length?'<span class="text-xs text-primary">['+p.comments.length+']</span>':'')+'<span class="text-xs text-muted-foreground">♥ '+(postLikes[p.id]||{count:0}).count+'</span></div><div class="col-span-2 text-center text-sm text-muted-foreground">'+p.author+'</div><div class="col-span-2 text-center text-xs text-muted-foreground">'+p.date+'</div></div>';}).join('');
}
function shareDiagResult(){
  var count=(document.getElementById('r-count')||{textContent:'0'}).textContent;
  if(!count||count==='0'){showToast('먼저 진단을 실행해주세요','info');return;}
  var text='[복지체크] 복지 진단 결과\n신청 가능 혜택: '+count+'건\n연간 최대: '+(document.getElementById('r-amount')||{textContent:''}).textContent;
  if(navigator.share)navigator.share({title:'복지체크',text:text}).catch(function(){});
  else navigator.clipboard.writeText(text).then(function(){showToast('클립보드에 복사됐어요!','success');}).catch(function(){showToast('복사 실패','error');});
}
function shareRoadmap(){
  if(!currentRmData){showToast('먼저 로드맵을 생성해주세요','info');return;}
  var text='[복지체크] 취업 로드맵\n직군: '+(selectedJob||'개발자')+'\n기간: '+(selectedPeriod||'6개월');
  if(navigator.share)navigator.share({title:'복지체크 로드맵',text:text}).catch(function(){});
  else navigator.clipboard.writeText(text).then(function(){showToast('클립보드에 복사됐어요!','success');}).catch(function(){showToast('복사 실패','error');});
}
var OB_STEPS=[
  {img:'🎯',title:'복지체크에 오신 것을 환영해요',desc:'복잡한 복지 신청, AI가 대신 찾아드려요. 딱 3분이면 내가 받을 수 있는 혜택을 모두 확인할 수 있어요.'},
  {img:'🤖',title:'상황을 말로 설명하면 돼요',desc:'"졸업하고 6개월째 백수에요" 처럼 자연어로 입력하면 AI가 자격요건을 분석해요.'},
  {img:'❤️',title:'혜택을 찜하고 캘린더에 등록해요',desc:'마음에 드는 혜택은 하트를 눌러 찜하세요. 캘린더에 신청 기간이 자동으로 등록돼요.'},
  {img:'🗺️',title:'취업 로드맵도 받아보세요',desc:'복지 혜택과 연결된 나만의 취업 로드맵을 AI가 설계해드려요.'},
];
var obStep=0;
function showOnboarding(){var modal=document.getElementById('onboarding-modal');if(!modal)return;obStep=0;renderObStep();modal.style.display='flex';}
function renderObStep(){
  var s=OB_STEPS[obStep];
  document.getElementById('ob-img').textContent=s.img;
  document.getElementById('ob-title').textContent=s.title;
  document.getElementById('ob-desc').textContent=s.desc;
  document.getElementById('ob-counter').textContent=(obStep+1)+' / '+OB_STEPS.length;
  document.getElementById('ob-prev').style.opacity=obStep===0?'0':'1';
  document.getElementById('ob-prev').style.pointerEvents=obStep===0?'none':'auto';
  document.getElementById('ob-next').textContent=obStep===OB_STEPS.length-1?'시작하기 🚀':'다음 →';
  document.querySelectorAll('.ob-dot').forEach(function(d,i){d.style.background=i===obStep?'#06b6d4':'#27272a';d.style.width=i===obStep?'20px':'6px';});
}
function obNext(){if(obStep<OB_STEPS.length-1){obStep++;renderObStep();}else closeOnboarding();}
function obPrev(){if(obStep>0){obStep--;renderObStep();}}
function closeOnboarding(){var modal=document.getElementById('onboarding-modal');if(modal)modal.style.display='none';try{localStorage.setItem('obDone','1');}catch(e){}}
function checkOnboarding(){var done=false;try{done=localStorage.getItem('obDone')==='1';}catch(e){}if(!done)setTimeout(showOnboarding,1000);}
var SIMILAR_DATA=[
  {tag:'부모',label:'부모님과 함께 사는 취준생',services:['구직촉진수당','청년내일저축계좌','내일배움카드']},
  {tag:'자취',label:'혼자 자취하는 취준생',services:['청년 월세 특별지원','구직촉진수당','청년주거급여']},
  {tag:'프리랜서',label:'프리랜서 청년',services:['청년 월세 특별지원','청년내일저축계좌','국민취업지원제도']},
  {tag:'저소득',label:'저소득 가구 청년',services:['구직촉진수당','청년도약계좌','청년 마음건강 바우처']},
];
function renderSimilarCases(inputText){
  var el=document.getElementById('similar-cases'); if(!el)return;
  var matched=SIMILAR_DATA.filter(function(c){return inputText.includes(c.tag);});
  if(!matched.length)matched=SIMILAR_DATA.slice(0,2);
  el.innerHTML=matched.slice(0,2).map(function(c){return '<div style="background:rgba(255,255,255,0.03);border:1px solid #27272a;border-radius:12px;padding:12px 14px;margin-bottom:8px;"><div style="font-size:11px;font-weight:600;color:#06b6d4;margin-bottom:8px;">'+c.label+'이 많이 받은 혜택</div><div style="display:flex;flex-wrap:wrap;gap:6px;">'+c.services.map(function(s){return '<span style="font-size:11px;padding:3px 8px;background:#16161e;border:1px solid #27272a;border-radius:8px;">'+s+'</span>';}).join('')+'</div></div>';}).join('');
}
var CERT_DATA={
  '개발자':[{id:'c1',name:'정보처리기사',desc:'개발자 취업 시 우대. 국가공인',schedule:'연 2회 (5월·11월)',difficulty:3,regDate:'2026-03-01',examDate:'2026-05-25'},{id:'c2',name:'SQLD',desc:'백엔드·데이터 직군 우대',schedule:'연 3회',difficulty:2,regDate:'2026-03-01',examDate:'2026-06-15'},{id:'c3',name:'AWS Cloud Practitioner',desc:'클라우드 기초. IT기업 필수',schedule:'상시',difficulty:2,regDate:'2026-03-01',examDate:'2026-04-30'}],
  '디자이너':[{id:'c5',name:'GTQ',desc:'포토샵·일러스트 공인',schedule:'연 4회',difficulty:2,regDate:'2026-03-01',examDate:'2026-04-20'},{id:'c6',name:'컬러리스트 산업기사',desc:'패션·인테리어 직군 우대',schedule:'연 3회',difficulty:3,regDate:'2026-03-01',examDate:'2026-05-10'},{id:'c7',name:'웹디자인기능사',desc:'웹 UI 디자인 국가기술자격',schedule:'연 4회',difficulty:2,regDate:'2026-04-01',examDate:'2026-05-30'}],
  '마케터':[{id:'c8',name:'구글 애널리틱스(GAIQ)',desc:'디지털 마케팅 필수. 무료',schedule:'상시',difficulty:1,regDate:'2026-03-01',examDate:'2026-03-15'},{id:'c9',name:'SNS광고마케터',desc:'SNS 광고 운영 공인 자격',schedule:'연 4회',difficulty:2,regDate:'2026-03-01',examDate:'2026-04-15'}],
  '공무원':[{id:'c11',name:'한국사능력검정시험',desc:'공무원 시험 필수 조건',schedule:'연 6회',difficulty:2,regDate:'2026-03-01',examDate:'2026-04-05'},{id:'c12',name:'컴퓨터활용능력 1급',desc:'공무원 가산점',schedule:'상시',difficulty:3,regDate:'2026-03-01',examDate:'2026-05-01'}],
  '기타':[{id:'c14',name:'컴퓨터활용능력 2급',desc:'사무직 전반 우대',schedule:'상시',difficulty:1,regDate:'2026-03-01',examDate:'2026-04-01'},{id:'c15',name:'MOS',desc:'사무직 엑셀·워드 능력 증명',schedule:'상시',difficulty:1,regDate:'2026-03-01',examDate:'2026-03-20'},{id:'c16',name:'한국사능력검정시험',desc:'공공기관 가산점. 다양한 직군 우대',schedule:'연 6회',difficulty:2,regDate:'2026-03-01',examDate:'2026-04-05'},{id:'c17',name:'TOEIC 700점 이상',desc:'외국계·무역 직군 우대',schedule:'월 1~2회',difficulty:3,regDate:'2026-03-01',examDate:'2026-05-01'}],
};
var wishedCerts=new Set();


function openTlPanel(idx){
  if(!currentRmData)return;
  var m=currentRmData.months[idx]; if(!m)return;
  var panel=document.getElementById('tl-panel'),overlay=document.getElementById('tl-overlay');
  if(!panel)return;
  var header=document.getElementById('tl-panel-header');
  header.innerHTML='';
  var dot=document.createElement('div'); dot.style.cssText='width:10px;height:10px;border-radius:50%;background:'+m.color+';flex-shrink:0;';
  var ms=document.createElement('span'); ms.style.cssText='font-size:11px;color:#a1a1aa;font-family:monospace;'; ms.textContent=String(m.month).padStart(2,'0')+'개월차';
  var ts=document.createElement('span'); ts.style.fontWeight='700'; ts.textContent=m.title;
  var is=document.createElement('span'); is.style.cssText='font-size:12px;color:#a1a1aa;'; is.textContent=m.income;
  [dot,ms,ts,is].forEach(function(el){header.appendChild(el);});
  var body=document.getElementById('tl-panel-body'); body.innerHTML='';
  var grid=document.createElement('div'); grid.style.cssText='display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:16px;margin-bottom:16px;';
  m.tasks.forEach(function(t,ci){
    var col=document.createElement('div');
    var catName=t.category.replace(/[^\w\s가-힣·\/()]/g,'').trim();
    col.innerHTML='<div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;color:#a1a1aa;margin-bottom:8px;padding-bottom:6px;border-bottom:1px solid #27272a;">'+catName+'</div>';
    var itemsDiv=document.createElement('div'); itemsDiv.style.cssText='display:flex;flex-direction:column;gap:8px;';
    t.items.forEach(function(item,ii){
      var ck=m.month+'-'+ci+'-'+ii; var done=roadmapChecks[ck]||false;
      var row=document.createElement('div'); row.style.cssText='display:flex;align-items:flex-start;gap:8px;cursor:pointer;'; row.dataset.ck=ck;
      row.onclick=function(){toggleRoadmapCheck(this.dataset.ck,this);};
      row.innerHTML='<div class="rm-chk-box" style="width:14px;height:14px;border-radius:3px;border:1px solid '+(done?'rgba(6,182,212,0.5)':'#27272a')+';flex-shrink:0;margin-top:3px;display:flex;align-items:center;justify-content:center;transition:all .2s;background:'+(done?'rgba(6,182,212,0.15)':'')+';"><svg style="width:9px;height:9px;opacity:'+(done?'1':'0')+';" fill="none" stroke="#06b6d4" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg></div><span class="rm-chk-text" style="font-size:13px;line-height:1.5;'+(done?'text-decoration:line-through;color:#a1a1aa;':'')+'">'+item+'</span>';
      itemsDiv.appendChild(row);
    });
    col.appendChild(itemsDiv); grid.appendChild(col);
  });
  body.appendChild(grid);
  var ck=document.createElement('div'); ck.style.cssText='display:flex;align-items:center;gap:10px;padding-top:12px;border-top:1px solid #27272a;';
  ck.innerHTML='<div style="width:16px;height:16px;border-radius:4px;background:'+m.color+'20;border:1px solid '+m.color+'50;display:flex;align-items:center;justify-content:center;flex-shrink:0;"><svg width="10" height="10" fill="none" stroke="'+m.color+'" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg></div><span style="font-size:11px;color:#a1a1aa;">이달의 목표</span><span style="font-size:12px;font-weight:600;">'+m.checkpoint+'</span>';
  body.appendChild(ck);
  panel.style.display='block'; if(overlay)overlay.style.display='block';
}
function closeTlPanel(){
  var p=document.getElementById('tl-panel'),o=document.getElementById('tl-overlay');
  if(p)p.style.display='none'; if(o)o.style.display='none';
}
setTimeout(function(){
  initLikes(); updateNoticeBadge(); checkUrgentBanner();
  setInterval(checkUrgentBanner,5000); checkOnboarding();
},500);



// ========== 면접 준비 ==========
var INTERVIEW_DATA = {
  '개발자': {
    checklist: ['이력서 최종 검토','포트폴리오 링크 확인','GitHub 정리','복장 준비','회사 서비스 사전 조사'],
    questions: [
      {q:'자기소개 해주세요.', a:'1분 자기소개: 이름, 전공, 프로젝트 경험, 지원 동기 순으로 간결하게. 숫자나 성과로 구체화하면 좋아요.', tags:['공통','필수']},
      {q:'본인의 강점과 약점은?', a:'강점은 직무 연관성 있게, 약점은 개선 노력과 함께 말하세요.', tags:['공통']},
      {q:'React와 Vue의 차이점은?', a:'React는 라이브러리, Vue는 프레임워크. React는 JSX, 단방향 데이터 흐름. Vue는 템플릿 문법, 양방향 바인딩(v-model).', tags:['기술','프론트엔드']},
      {q:'RESTful API란 무엇인가요?', a:'HTTP 메서드(GET/POST/PUT/DELETE)를 활용해 자원을 다루는 아키텍처 스타일. Stateless, 자원 중심 URL 설계가 핵심.', tags:['기술','백엔드']},
      {q:'Git 브랜치 전략을 설명해주세요.', a:'Git Flow: main/develop/feature/release/hotfix 브랜치. 팀 규모와 배포 주기에 따라 GitHub Flow도 많이 사용.', tags:['기술']},
      {q:'가장 어려웠던 프로젝트 경험은?', a:'STAR 기법: 상황(Situation), 과제(Task), 행동(Action), 결과(Result) 순으로 구체적으로.', tags:['경험']},
    ]
  },
  '디자이너': {
    checklist: ['포트폴리오 PDF 준비','피그마 파일 정리','작업 과정 설명 준비','복장 준비','회사 디자인 스타일 분석'],
    questions: [
      {q:'자기소개 해주세요.', a:'디자인 철학과 주요 프로젝트 중심으로. 어떤 문제를 어떻게 해결했는지 강조.', tags:['공통','필수']},
      {q:'UX와 UI의 차이는?', a:'UX는 사용자 경험 전반(리서치, 플로우, 사용성). UI는 시각적 인터페이스(컬러, 타이포, 컴포넌트).', tags:['기술']},
      {q:'디자인 결정 과정을 설명해주세요.', a:'리서치 → 와이어프레임 → 프로토타입 → 테스트 → 반영. 데이터 기반 의사결정 강조.', tags:['프로세스']},
      {q:'피드백을 어떻게 처리하나요?', a:'비판적 피드백도 사용자 중심으로 수용. 의견 충돌 시 데이터나 사용자 테스트로 검증.', tags:['소통']},
    ]
  },
  '마케터': {
    checklist: ['포트폴리오/성과 지표 정리','SNS 계정 점검','업계 트렌드 파악','복장 준비','회사 마케팅 캠페인 분석'],
    questions: [
      {q:'자기소개 해주세요.', a:'수치로 성과를 보여주세요. "CTR 15% 개선", "팔로워 2000명 증가" 등 구체적 성과 중심.', tags:['공통','필수']},
      {q:'성공적인 캠페인 경험이 있나요?', a:'목표 설정 → 전략 수립 → 실행 → 성과 측정 과정을 STAR 기법으로. 수치 반드시 포함.', tags:['경험']},
      {q:'퍼포먼스 마케팅이란?', a:'데이터 기반으로 광고 효율을 측정·최적화. CPC, CPA, ROAS 등 지표로 성과를 즉시 확인.', tags:['기술']},
      {q:'콘텐츠 마케팅 전략은?', a:'타겟 설정 → 채널 선정 → 콘텐츠 캘린더 → 제작 → 배포 → 분석. SEO 연계도 중요.', tags:['전략']},
    ]
  },
  '공무원': {
    checklist: ['지원 직렬 업무 파악','최근 정책 이슈 공부','공직가치관 정리','복장(단정하게)','면접 기출 문제 연습'],
    questions: [
      {q:'공무원 지원 동기는?', a:'공직가치(국민 봉사, 공익 추구)와 연결해서. 개인 경험과 연계하면 더 설득력 있음.', tags:['필수']},
      {q:'갈등 상황 해결 경험은?', a:'실제 경험 기반으로 STAR 기법. 팀워크와 소통 능력 강조.', tags:['경험']},
      {q:'민원인이 욕설을 한다면?', a:'감정적으로 대응하지 않고 경청 → 문제 파악 → 해결책 제시. 필요시 상급자 보고.', tags:['상황']},
      {q:'최근 관심 있는 정책 이슈는?', a:'지원 직렬과 연관된 최신 정책 1~2개 공부해두기. 본인 의견도 준비.', tags:['시사']},
    ]
  }
};

var currentInterviewJob = '개발자';
var interviewChecks = {};

function loadInterviewQ(job) {
  currentInterviewJob = job;
  document.querySelectorAll('[id^="iq-tab-"]').forEach(function(b) {
    b.classList.toggle('active', b.id === 'iq-tab-' + job);
  });
  var data = INTERVIEW_DATA[job];
  
  // 체크리스트
  var cl = document.getElementById('interview-checklist');
  cl.innerHTML = data.checklist.map(function(item, i) {
    var key = job + '-' + i;
    var done = interviewChecks[key] || false;
    return '<div data-key="' + key + '" onclick="toggleIvCheck(this.dataset.key,this)" style="display:flex;align-items:center;gap:10px;cursor:pointer;padding:6px 0;">' +
      '<div style="width:16px;height:16px;border-radius:4px;border:1px solid ' + (done?'#06b6d4':'#27272a') + ';flex-shrink:0;display:flex;align-items:center;justify-content:center;background:' + (done?'rgba(6,182,212,0.15)':'') + ';">' +
      '<svg style="width:10px;height:10px;opacity:' + (done?'1':'0') + ';" fill="none" stroke="#06b6d4" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg></div>' +
      '<span style="font-size:13px;' + (done?'text-decoration:line-through;color:#a1a1aa;':'') + '">' + item + '</span></div>';
  }).join('');

  // 질문
  var qlist = document.getElementById('interview-questions');
  qlist.innerHTML = data.questions.map(function(q, i) {
    return '<div class="interview-card">' +
      '<div style="display:flex;align-items:start;justify-content:space-between;gap:8px;cursor:pointer;" onclick="toggleIvQ(' + i + ',this)">' +
      '<div class="interview-q">Q. ' + q.q + '</div>' +
      '<svg style="width:16px;height:16px;flex-shrink:0;color:#a1a1aa;transition:transform .2s;" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/></svg></div>' +
      '<div class="flex gap-1 flex-wrap mt-2 mb-0">' + q.tags.map(function(t){ return '<span class="interview-tag">' + t + '</span>'; }).join('') + '</div>' +
      '<div class="interview-a" id="iva-' + i + '" style="margin-top:10px;padding-top:10px;border-top:1px solid #27272a;">💡 ' + q.a + '</div>' +
      '</div>';
  }).join('');
}

function toggleIvQ(i, el) {
  var a = document.getElementById('iva-' + i);
  var svg = el.querySelector('svg');
  a.classList.toggle('open');
  if (svg) svg.style.transform = a.classList.contains('open') ? 'rotate(180deg)' : '';
}

function toggleIvCheck(key, el) {
  interviewChecks[key] = !interviewChecks[key];
  var done = interviewChecks[key];
  var box = el.querySelector('div');
  var text = el.querySelector('span');
  var svg = el.querySelector('svg');
  if (box) { box.style.borderColor = done?'#06b6d4':'#27272a'; box.style.background = done?'rgba(6,182,212,0.15)':''; }
  if (svg) svg.style.opacity = done?'1':'0';
  if (text) text.style.textDecoration = done?'line-through':'';
}

// ========== 지역별 혜택 ==========
var REGION_DATA = {
  '서울': [
    {name:'서울청년수당', amt:'월 50만원 × 6개월', desc:'서울 거주 만 19~34세 미취업 청년. 구직활동 지원금.', link:'https://youth.seoul.go.kr'},
    {name:'서울 희망두배 청년통장', amt:'최대 1,080만원', desc:'저소득 청년 근로자 저축 지원. 2년 만기 매칭 지원.', link:'https://youth.seoul.go.kr'},
    {name:'서울 청년 월세 지원', amt:'월 20만원 × 10개월', desc:'서울 거주 만 19~39세 1인 가구 청년.', link:'https://youth.seoul.go.kr'},
  ],
  '경기': [
    {name:'경기도 청년 기본소득', amt:'분기 25만원(연 100만원)', desc:'경기도 거주 만 24세 청년 전원. 지역화폐 지급.', link:'https://biso.gg.go.kr'},
    {name:'경기도 청년 복지포인트', amt:'연 120만원', desc:'경기도 중소기업 재직 청년. 복지 용도 사용.', link:'https://www.jobaba.net'},
  ],
  '부산': [
    {name:'부산청년드림카드', amt:'월 20만원 × 6개월', desc:'부산 거주 미취업 청년. 구직활동 지원.', link:'https://www.busan.go.kr'},
    {name:'부산 청년 전세보증금 지원', amt:'최대 1,000만원', desc:'부산 거주 청년 전세 보증금 무이자 대출.', link:'https://www.busan.go.kr'},
  ],
  '인천': [
    {name:'인천 청년 월세 지원', amt:'월 10만원 × 12개월', desc:'인천 거주 만 19~39세 청년 1인 가구.', link:'https://www.incheon.go.kr'},
    {name:'인천 청년 내일채움공제', amt:'3년 3,000만원', desc:'인천 중소기업 재직 청년 자산 형성.', link:'https://www.incheon.go.kr'},
  ],
  '대구': [
    {name:'대구 청년취업 지원금', amt:'월 30만원 × 3개월', desc:'대구 거주 미취업 청년 구직활동 지원.', link:'https://www.daegu.go.kr'},
  ],
  '광주': [
    {name:'광주 청년 드림 수당', amt:'월 50만원 × 6개월', desc:'광주 거주 만 18~34세 미취업 청년.', link:'https://www.gwangju.go.kr'},
  ],
  '대전': [
    {name:'대전 청년 월세 지원', amt:'월 10만원 × 12개월', desc:'대전 거주 만 19~39세 청년 1인 가구.', link:'https://www.daejeon.go.kr'},
  ],
};

function loadRegion(region) {
  document.querySelectorAll('[id^="rgn-"]').forEach(function(b) {
    b.classList.toggle('active', b.id === 'rgn-' + region);
  });
  var list = document.getElementById('region-list');
  var data = REGION_DATA[region] || [];
  if (!data.length) { list.innerHTML = '<div style="text-align:center;padding:40px;color:#a1a1aa;font-size:13px;">준비 중이에요</div>'; return; }
  list.innerHTML = data.map(function(b) {
    return '<div class="region-benefit">' +
      '<div style="display:flex;align-items:start;justify-content:space-between;gap:8px;">' +
      '<div><div style="font-size:14px;font-weight:600;margin-bottom:4px;">' + b.name + '</div>' +
      '<div style="font-size:11px;color:#06b6d4;font-weight:600;margin-bottom:6px;">' + b.amt + '</div>' +
      '<div style="font-size:12px;color:#a1a1aa;">' + b.desc + '</div></div>' +
      '<a href="' + b.link + '" target="_blank" style="flex-shrink:0;font-size:11px;padding:6px 12px;border:1px solid rgba(6,182,212,0.3);border-radius:8px;color:#06b6d4;text-decoration:none;white-space:nowrap;">신청 →</a>' +
      '</div></div>';
  }).join('');
}

// ========== 신청 트래커 ==========
var trackerItems = [
  {name:'구직촉진수당', steps:['서류 제출','심사 중','승인','수령 완료'], current:1},
  {name:'내일배움카드', steps:['신청','카드 발급','훈련 등록','훈련 완료'], current:2},
];

function renderTracker() {
  var list = document.getElementById('tracker-list');
  list.innerHTML = trackerItems.map(function(item, ti) {
    return '<div class="bg-card border border-border rounded-2xl p-5">' +
      '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;">' +
      '<div style="font-size:14px;font-weight:700;">' + item.name + '</div>' +
      '<span style="font-size:11px;color:#06b6d4;">' + item.steps[item.current] + '</span></div>' +
      item.steps.map(function(step, i) {
        var cls = i < item.current ? 'done' : i === item.current ? 'current' : 'pending';
        var icon = i < item.current ? '✓' : i + 1;
        return '<div class="tracker-step ' + cls + '">' +
          '<div class="tracker-dot">' + icon + '</div>' +
          '<div><div style="font-size:13px;font-weight:500;">' + step + '</div>' +
          (i === item.current ? '<div style="font-size:11px;color:#a1a1aa;">진행 중</div>' : '') +
          '</div>' +
          (i === item.current ? '<button onclick="advanceTracker(' + ti + ')" style="margin-left:auto;font-size:11px;padding:4px 10px;border:1px solid rgba(6,182,212,0.4);border-radius:8px;color:#06b6d4;background:rgba(6,182,212,0.1);cursor:pointer;">다음 단계</button>' : '') +
          '</div>';
      }).join('') +
      '</div>';
  }).join('');
}

function advanceTracker(ti) {
  if (trackerItems[ti].current < trackerItems[ti].steps.length - 1) {
    trackerItems[ti].current++;
    renderTracker();
    if (typeof showToast === 'function') showToast('단계가 업데이트됐어요!', 'success');
  }
}

function addTrackerItem() {
  var name = prompt('혜택 이름을 입력하세요:');
  if (!name) return;
  trackerItems.push({name:name, steps:['서류 제출','심사 중','승인','수령 완료'], current:0});
  renderTracker();
}

// ========== 챗봇 ==========
var CHAT_QA = [
  {k:['구직촉진수당','구직촉진'], a:'구직촉진수당은 국민취업지원제도 1유형으로 월 50만원씩 6개월(최대 300만원)을 지원해요. 15세~69세 저소득 구직자가 대상이에요. 고용센터에 방문하거나 work.go.kr에서 신청하세요!'},
  {k:['내일배움카드','훈련'], a:'내일배움카드는 직업훈련 비용을 지원하는 제도예요. 1인당 300~500만원 한도로 다양한 훈련과정을 수강할 수 있어요. HRD넷(www.hrd.go.kr)에서 신청하세요!'},
  {k:['청년도약계좌','도약'], a:'청년도약계좌는 월 최대 70만원 저축 시 정부가 매칭 지원하는 상품이에요. 5년 만기로 최대 5,000만원을 모을 수 있어요. 만 19~34세 청년이 대상이에요.'},
  {k:['월세','주거'], a:'청년 월세 특별지원은 월 최대 20만원씩 12개월간 지원해요. 만 19~34세 무주택 청년 1인 가구가 대상이에요. 복지로(www.bokjiro.go.kr)에서 신청하세요!'},
  {k:['자격증','시험'], a:'취준생에게 추천하는 자격증: 정보처리기사(개발자), GTQ(디자이너), GAIQ(마케터), 컴활(사무직). 로드맵 메뉴에서 직군별 추천 자격증을 확인하세요!'},
  {k:['안녕','반가워','ㅎㅇ'], a:'안녕하세요! 👋 복지체크 챗봇이에요. 복지 혜택, 신청 방법, 자격증 등 취준생 관련 궁금한 것들을 물어보세요!'},
];

var chatHistory = [];

function initChat() {
  var msgs = document.getElementById('chat-messages');
  msgs.innerHTML = '';
  addChatBubble('ai', '안녕하세요! 👋 저는 복지체크 AI 챗봇이에요.\n궁금한 복지 혜택이나 취업 준비에 관해 자유롭게 물어보세요!');
}

function addChatBubble(type, text) {
  var msgs = document.getElementById('chat-messages');
  var div = document.createElement('div');
  div.className = 'chat-bubble ' + type;
  div.style.cssText = 'max-width:80%;padding:12px 16px;border-radius:16px;font-size:13px;line-height:1.6;margin-bottom:4px;white-space:pre-wrap;' +
    (type === 'ai' ? 'background:#16161e;border:1px solid #27272a;color:#fafafa;align-self:flex-start;border-bottom-left-radius:4px;' :
     'background:rgba(6,182,212,0.15);border:1px solid rgba(6,182,212,0.3);color:#fafafa;align-self:flex-end;border-bottom-right-radius:4px;margin-left:auto;');
  div.textContent = text;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

function showTyping() {
  var msgs = document.getElementById('chat-messages');
  var div = document.createElement('div');
  div.id = 'typing-indicator';
  div.style.cssText = 'display:flex;gap:4px;align-items:center;padding:12px 16px;background:#16161e;border:1px solid #27272a;border-radius:16px;border-bottom-left-radius:4px;width:fit-content;';
  div.innerHTML = '<span style="width:6px;height:6px;border-radius:50%;background:#06b6d4;display:inline-block;animation:typing 1.2s infinite;"></span>' +
    '<span style="width:6px;height:6px;border-radius:50%;background:#06b6d4;display:inline-block;animation:typing 1.2s .2s infinite;"></span>' +
    '<span style="width:6px;height:6px;border-radius:50%;background:#06b6d4;display:inline-block;animation:typing 1.2s .4s infinite;"></span>';
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

function removeTyping() {
  var el = document.getElementById('typing-indicator');
  if (el) el.remove();
}

function sendChat() {
  var input = document.getElementById('chat-input');
  var text = input.value.trim();
  if (!text) return;
  input.value = '';
  addChatBubble('user', text);
  showTyping();

  setTimeout(function() {
    removeTyping();
    var lower = text.toLowerCase();
    var answer = null;
    for (var i = 0; i < CHAT_QA.length; i++) {
      var qa = CHAT_QA[i];
      for (var j = 0; j < qa.k.length; j++) {
        if (lower.includes(qa.k[j])) { answer = qa.a; break; }
      }
      if (answer) break;
    }
    if (!answer) answer = '죄송해요, 잘 모르겠어요 😅\n조금 더 구체적으로 물어봐주시거나, 복지 진단 기능을 이용해보세요!\n예: "구직촉진수당 신청 방법", "월세 지원 조건"';
    addChatBubble('ai', answer);
  }, 800);
}

// ========== 월별 리포트 ==========
var reportMonth = new Date();

function changeReportMonth(dir) {
  reportMonth.setMonth(reportMonth.getMonth() + dir);
  renderReport();
}

function renderReport() {
  var y = reportMonth.getFullYear();
  var m = reportMonth.getMonth() + 1;
  document.getElementById('report-month').textContent = y + '년 ' + m + '월 활동 리포트';

  // 통계 (wishList 연동)
  var wishCount = typeof wishList !== 'undefined' ? wishList.length : 0;
  document.getElementById('rpt-wish').textContent = wishCount;
  document.getElementById('rpt-diag').textContent = typeof diagHistory !== 'undefined' ? diagHistory.length : 0;
  document.getElementById('rpt-post').textContent = 0;

  // 예상 수혜액
  var amtMap = {'구직촉진수당':300,'청년내일저축계좌':1440,'청년 월세 특별지원':2400,'내일배움카드':500,'청년도약계좌':5000};
  var total = 0;
  if (typeof wishList !== 'undefined') {
    wishList.forEach(function(w) {
      for (var k in amtMap) { if (w.name.includes(k)) { total += amtMap[k]; break; } }
    });
  }
  document.getElementById('rpt-amt').textContent = total.toLocaleString();

  // 활동 바
  var bars = [
    {label:'복지 진단', val: typeof diagHistory !== 'undefined' ? Math.min(diagHistory.length * 20, 100) : 0},
    {label:'혜택 찜하기', val: Math.min(wishCount * 15, 100)},
    {label:'커뮤니티 활동', val: 30},
    {label:'로드맵 진행', val: 50},
  ];
  document.getElementById('report-bars').innerHTML = bars.map(function(b) {
    return '<div><div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:4px;">' +
      '<span>' + b.label + '</span><span style="color:#06b6d4;">' + b.val + '%</span></div>' +
      '<div class="report-bar"><div class="report-bar-fill" style="width:' + b.val + '%;"></div></div></div>';
  }).join('');

  // 추천 팁
  var tips = [];
  if (wishCount === 0) tips.push('💡 복지 진단을 해보고 혜택을 찜해보세요!');
  if (wishCount > 0 && total > 0) tips.push('💰 찜한 혜택으로 최대 ' + total.toLocaleString() + '만원을 받을 수 있어요!');
  tips.push('📚 내일배움카드로 무료 강의를 수강해보세요!');
  tips.push('🎯 취업 로드맵에서 이번 달 목표를 체크해보세요!');

  document.getElementById('report-tips').innerHTML = tips.map(function(t) {
    return '<div style="font-size:13px;padding:10px 12px;background:rgba(6,182,212,0.05);border:1px solid rgba(6,182,212,0.15);border-radius:10px;">' + t + '</div>';
  }).join('');
}

// ========== 네비 연동 ==========
// goPage 오버라이드해서 새 페이지 초기화
goPage = function(name) {
  if (_origGoPage) _origGoPage(name);
  // 새 페이지 초기화
  if (name === 'interview') { loadInterviewQ('개발자'); }
  else if (name === 'region') { loadRegion('서울'); }
  else if (name === 'tracker') { renderTracker(); }
  else if (name === 'chatbot') { if (!document.getElementById('chat-messages').children.length) initChat(); }
  else if (name === 'report') { renderReport(); }
};

// 새 페이지 표시 처리 (기존 goPage가 page-* id 기준이라 새 페이지도 동일하게)
goPage = function(name) {
  var newPages = ['interview','region','tracker','chatbot','report'];
  if (newPages.includes(name)) {
    // 기존 페이지 숨기기
    document.querySelectorAll('.page').forEach(function(p) { p.classList.remove('active'); });
    var pg = document.getElementById('page-' + name);
    if (pg) {
      pg.classList.add('active');
      window.scrollTo(0, 0);
    }
    // 초기화
    if (name === 'interview') loadInterviewQ('개발자');
    else if (name === 'region') loadRegion('서울');
    else if (name === 'tracker') renderTracker();
    else if (name === 'chatbot') { if (!document.getElementById('chat-messages').children.length) initChat(); }
    else if (name === 'report') renderReport();
  } else {
    if (_origGoPage) _origGoPage(name);
  }
};


function toggleDrawer() {
  var d = document.getElementById('drawer'), o = document.getElementById('drawer-overlay');
  var isOpen = d.style.transform === 'translateX(0%)';
  if (isOpen) { closeDrawer(); } else { d.style.transform = 'translateX(0%)'; o.style.display = 'block'; }
}
function closeDrawer() {
  document.getElementById('drawer').style.transform = 'translateX(100%)';
  document.getElementById('drawer-overlay').style.display = 'none';
}
function drawerGo(page) { closeDrawer(); setTimeout(function(){ goPage(page); }, 200); }


// ========== D-day 위젯 (홈 화면) ==========
function renderDdayWidget() {
  var section = document.getElementById('how');
  if (!section || typeof wishList === 'undefined' || !wishList.length) return;
  var existing = document.getElementById('dday-widget');
  if (existing) existing.remove();

  var urgent = wishList.filter(function(w) {
    var diff = Math.ceil((new Date(w.endDate) - new Date()) / 86400000);
    return diff >= 0 && diff <= 30;
  }).sort(function(a,b) { return new Date(a.endDate) - new Date(b.endDate); }).slice(0,3);

  if (!urgent.length) return;

  var widget = document.createElement('div');
  widget.id = 'dday-widget';
  widget.style.cssText = 'max-width:900px;margin:0 auto 48px;padding:0 24px;';
  widget.innerHTML = '<div style="background:linear-gradient(135deg,rgba(6,182,212,0.08),rgba(6,182,212,0.03));border:1px solid rgba(6,182,212,0.2);border-radius:20px;padding:20px 24px;">' +
    '<div style="font-size:12px;font-weight:700;color:#06b6d4;letter-spacing:.1em;text-transform:uppercase;margin-bottom:14px;">⏰ 마감 임박 혜택</div>' +
    '<div style="display:flex;gap:12px;flex-wrap:wrap;">' +
    urgent.map(function(w) {
      var diff = Math.ceil((new Date(w.endDate) - new Date()) / 86400000);
      var color = diff <= 7 ? '#ef4444' : diff <= 14 ? '#f59e0b' : '#06b6d4';
      return '<div style="flex:1;min-width:180px;background:rgba(0,0,0,0.2);border-radius:12px;padding:14px 16px;">' +
        '<div style="font-size:11px;color:#a1a1aa;margin-bottom:4px;">' + w.name + '</div>' +
        '<div style="font-size:24px;font-weight:800;color:' + color + ';">D-' + diff + '</div>' +
        '<div style="font-size:10px;color:#a1a1aa;margin-top:2px;">' + w.endDate + ' 마감</div></div>';
    }).join('') +
    '</div></div>';
  section.parentNode.insertBefore(widget, section);
}

// ========== 스크랩북 ==========
var scrapList = [];
function renderScrapList() {
  var list = document.getElementById('scrap-list');
  var empty = document.getElementById('scrap-empty');
  if (!list) return;
  if (!scrapList.length) { list.innerHTML=''; empty.style.display='block'; return; }
  empty.style.display='none';
  list.innerHTML = scrapList.map(function(s,i) {
    return '<div style="background:#16161e;border:1px solid #27272a;border-radius:14px;padding:16px 18px;">' +
      '<div style="display:flex;align-items:start;justify-content:space-between;gap:8px;">' +
      '<div style="flex:1;min-width:0;">' +
      '<div style="font-size:14px;font-weight:600;margin-bottom:4px;">' + s.title + '</div>' +
      (s.memo ? '<div style="font-size:12px;color:#a1a1aa;margin-bottom:6px;">' + s.memo + '</div>' : '') +
      (s.url ? '<a href="' + s.url + '" target="_blank" style="font-size:11px;color:#06b6d4;text-decoration:none;">' + s.url + ' →</a>' : '') +
      '</div>' +
      '<button onclick="deleteScrap(' + i + ')" style="background:none;border:none;cursor:pointer;color:#a1a1aa;font-size:16px;flex-shrink:0;">×</button>' +
      '</div></div>';
  }).join('');
}
function openScrapAdd() { document.getElementById('scrap-modal').style.display='flex'; }
function closeScrapAdd() { document.getElementById('scrap-modal').style.display='none'; }
function saveScrap() {
  var title = document.getElementById('scrap-title').value.trim();
  if (!title) { alert('제목을 입력하세요'); return; }
  scrapList.unshift({ title:title, url:document.getElementById('scrap-url').value.trim(), memo:document.getElementById('scrap-memo').value.trim(), date:new Date().toISOString().slice(0,10) });
  closeScrapAdd();
  document.getElementById('scrap-title').value='';
  document.getElementById('scrap-url').value='';
  document.getElementById('scrap-memo').value='';
  renderScrapList();
  if (typeof showToast==='function') showToast('스크랩에 저장됐어요!','success');
}
function deleteScrap(i) { scrapList.splice(i,1); renderScrapList(); }

// ========== 알림 설정 ==========
var notifDays = [1,3,7,14];
var notifSelected = [7];
function renderNotifSettings() {
  var opts = document.getElementById('notif-options');
  if (!opts) return;
  opts.innerHTML = notifDays.map(function(d) {
    var on = notifSelected.includes(d);
    return '<label style="display:flex;align-items:center;gap:10px;cursor:pointer;">' +
      '<input type="checkbox" ' + (on?'checked':'') + ' onchange="toggleNotifDay(' + d + ',this.checked)" style="accent-color:#06b6d4;">' +
      '<span style="font-size:13px;">마감 <strong>' + d + '일 전</strong></span></label>';
  }).join('');

  var wlist = document.getElementById('notif-wish-list');
  if (!wlist) return;
  if (typeof wishList === 'undefined' || !wishList.length) {
    wlist.innerHTML = '<div style="font-size:13px;color:#a1a1aa;text-align:center;padding:16px;">찜한 혜택이 없어요</div>';
    return;
  }
  wlist.innerHTML = wishList.map(function(w) {
    var diff = Math.ceil((new Date(w.endDate) - new Date()) / 86400000);
    var color = diff<=7?'#ef4444':diff<=14?'#f59e0b':'#a1a1aa';
    return '<div style="display:flex;align-items:center;justify-content:space-between;padding:10px 0;border-bottom:1px solid #27272a;">' +
      '<span style="font-size:13px;">' + w.name + '</span>' +
      '<span style="font-size:11px;font-weight:700;color:' + color + ';">D-' + diff + '</span></div>';
  }).join('');
}
function toggleNotifDay(d, on) {
  if (on) { if (!notifSelected.includes(d)) notifSelected.push(d); }
  else { notifSelected = notifSelected.filter(function(x){return x!==d;}); }
}
function saveNotifSettings() {
  if (typeof showToast==='function') showToast('알림 설정이 저장됐어요!','success');
  if (Notification && Notification.permission === 'default') Notification.requestPermission();
}

// ========== 같은 상황 친구 찾기 ==========
var MATCH_TAGS = ['백수 6개월 이상','자취중','부모님과 거주','프리랜서','알바중','공무원 준비','개발자 준비','디자이너 준비','마케터 준비','저소득 가구'];
var MATCH_USERS = [
  {nick:'취준청년A', tags:['백수 6개월 이상','자취중'], bio:'같이 구직 활동 하실 분!', post:12},
  {nick:'개발희망B', tags:['개발자 준비','부모님과 거주'], bio:'프론트엔드 공부 중이에요', post:8},
  {nick:'복지왕C', tags:['저소득 가구','자취중'], bio:'복지 혜택 다 받아보기 도전 중', post:25},
  {nick:'공시생D', tags:['공무원 준비','부모님과 거주'], bio:'9급 공무원 준비 2년차', post:5},
  {nick:'디자인러E', tags:['디자이너 준비','알바중'], bio:'포트폴리오 작업 중입니다', post:17},
];
var selectedMatchTags = [];
function renderMatchTags() {
  var el = document.getElementById('match-tags');
  if (!el) return;
  el.innerHTML = MATCH_TAGS.map(function(t) {
    var on = selectedMatchTags.includes(t);
    var btn = '<button data-tag="' + t + '" onclick="toggleMatchTag(this,this.dataset.tag)" style="padding:6px 14px;border-radius:20px;border:1px solid ' + (on?'rgba(6,182,212,0.5)':'#27272a') + ';background:' + (on?'rgba(6,182,212,0.1)':'transparent') + ';color:' + (on?'#06b6d4':'#a1a1aa') + ';font-size:12px;cursor:pointer;transition:all .2s;">' + t + '</button>'; return btn;
  }).join('');
}
function toggleMatchTag(btn, tag) {
  if (selectedMatchTags.includes(tag)) {
    selectedMatchTags = selectedMatchTags.filter(function(t){return t!==tag;});
    btn.style.borderColor='#27272a'; btn.style.background='transparent'; btn.style.color='#a1a1aa';
  } else {
    selectedMatchTags.push(tag);
    btn.style.borderColor='rgba(6,182,212,0.5)'; btn.style.background='rgba(6,182,212,0.1)'; btn.style.color='#06b6d4';
  }
}
function findMatch() {
  var res = document.getElementById('match-results');
  if (!selectedMatchTags.length) { res.innerHTML='<div style="text-align:center;color:#a1a1aa;font-size:13px;padding:32px;">상황 태그를 선택해주세요</div>'; return; }
  var matched = MATCH_USERS.filter(function(u) {
    return u.tags.some(function(t){ return selectedMatchTags.includes(t); });
  });
  if (!matched.length) { res.innerHTML='<div style="text-align:center;color:#a1a1aa;font-size:13px;padding:32px;">조건에 맞는 친구가 없어요</div>'; return; }
  res.innerHTML = matched.map(function(u) {
    var common = u.tags.filter(function(t){return selectedMatchTags.includes(t);});
    return '<div style="background:#16161e;border:1px solid #27272a;border-radius:14px;padding:16px 18px;display:flex;align-items:center;gap:14px;">' +
      '<div style="width:44px;height:44px;border-radius:50%;background:rgba(6,182,212,0.15);display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:700;color:#06b6d4;flex-shrink:0;">' + u.nick[0] + '</div>' +
      '<div style="flex:1;min-width:0;">' +
      '<div style="font-size:14px;font-weight:600;margin-bottom:3px;">' + u.nick + ' <span style="font-size:11px;color:#a1a1aa;">게시글 ' + u.post + '개</span></div>' +
      '<div style="font-size:12px;color:#a1a1aa;margin-bottom:6px;">' + u.bio + '</div>' +
      '<div style="display:flex;gap:4px;flex-wrap:wrap;">' + common.map(function(t){return '<span style="font-size:10px;padding:2px 8px;background:rgba(6,182,212,0.1);border:1px solid rgba(6,182,212,0.3);border-radius:10px;color:#06b6d4;">'+t+'</span>';}).join('') + '</div>' +
      '</div>' +
      '<button data-action="community" onclick="goPage(this.dataset.action)" style="padding:6px 14px;border:1px solid rgba(6,182,212,0.3);border-radius:10px;color:#06b6d4;background:rgba(6,182,212,0.05);font-size:12px;cursor:pointer;">커뮤니티 보기</button>' +
      '</div>';
  }).join('');
}

// ========== 혜택 계산기 ==========
var calcStatusSel = '';
var calcHousingSel = '';
function renderCalcOptions() {
  var statusEl = document.getElementById('calc-status');
  var housingEl = document.getElementById('calc-housing');
  if (!statusEl || !housingEl) return;
  var statuses = ['미취업','알바중','프리랜서','취업준비생'];
  var housings = ['자취','부모님과 거주','기숙사','고시원'];
  statusEl.innerHTML = '';
  statuses.forEach(function(s) {
    var on = calcStatusSel===s;
    var btn = document.createElement('button');
    btn.textContent = s;
    btn.dataset.s = s;
    btn.style.cssText = 'padding:6px 14px;border-radius:20px;border:1px solid ' + (on?'rgba(6,182,212,0.5)':'#27272a') + ';background:' + (on?'rgba(6,182,212,0.1)':'transparent') + ';color:' + (on?'#06b6d4':'#a1a1aa') + ';font-size:12px;cursor:pointer;margin:2px;';
    btn.onclick = function(){ calcStatusSel=this.dataset.s; renderCalcOptions(); };
    statusEl.appendChild(btn);
  });
  housingEl.innerHTML = '';
  housings.forEach(function(h) {
    var on = calcHousingSel===h;
    var btn = document.createElement('button');
    btn.textContent = h;
    btn.dataset.h = h;
    btn.style.cssText = 'padding:6px 14px;border-radius:20px;border:1px solid ' + (on?'rgba(6,182,212,0.5)':'#27272a') + ';background:' + (on?'rgba(6,182,212,0.1)':'transparent') + ';color:' + (on?'#06b6d4':'#a1a1aa') + ';font-size:12px;cursor:pointer;margin:2px;';
    btn.onclick = function(){ calcHousingSel=this.dataset.h; renderCalcOptions(); };
    housingEl.appendChild(btn);
  });

}
function calcBenefit() {
  var age = parseInt(document.getElementById('calc-age').value) || 0;
  var income = parseInt(document.getElementById('calc-income').value) || 0;
  var result = [];
  var total = 0;
  if (age >= 15 && age <= 69 && (calcStatusSel==='미취업'||calcStatusSel==='취업준비생') && income < 60) { result.push({name:'구직촉진수당',amt:300,desc:'월 50만원 × 6개월'}); total+=300; }
  if (age >= 19 && age <= 34 && income < 100) { result.push({name:'청년내일저축계좌',amt:1440,desc:'3년 최대 1,440만원'}); total+=1440; }
  if (age >= 19 && age <= 34 && calcHousingSel==='자취') { result.push({name:'청년 월세 특별지원',amt:240,desc:'월 20만원 × 12개월'}); total+=240; }
  if (age >= 15 && age <= 74) { result.push({name:'내일배움카드',amt:500,desc:'최대 500만원 훈련비'}); total+=500; }
  if (age >= 19 && age <= 34 && income < 70) { result.push({name:'청년도약계좌',amt:5000,desc:'5년 최대 5,000만원'}); total+=5000; }
  if (!result.length) { if (typeof showToast==='function') showToast('조건에 맞는 혜택이 없어요','info'); return; }
  document.getElementById('calc-result').classList.remove('hidden');
  document.getElementById('calc-total').textContent = '연간 최대 ' + total.toLocaleString() + '만원';
  document.getElementById('calc-items').innerHTML = result.map(function(r) {
    return '<div style="display:flex;align-items:center;justify-content:space-between;padding:12px 0;border-bottom:1px solid #27272a;">' +
      '<div><div style="font-size:13px;font-weight:600;">' + r.name + '</div><div style="font-size:11px;color:#a1a1aa;">' + r.desc + '</div></div>' +
      '<div style="font-size:14px;font-weight:700;color:#06b6d4;">' + r.amt.toLocaleString() + '만원</div></div>';
  }).join('');
}

// ========== 서류 체크리스트 ==========
var DOC_DATA = {
  '이력서': [
    {title:'기본 정보', items:['이름·연락처·이메일 기재','사진 첨부 (증명사진)','생년월일 기재']},
    {title:'학력', items:['최종 학력 기재 (졸업/재학/수료 구분)','전공 및 학점 기재','편입/복수전공 있으면 기재']},
    {title:'경력/경험', items:['인턴·알바 경험 기재','프로젝트 경험 기재','봉사/대외활동 기재']},
    {title:'기술', items:['사용 가능 언어/툴 기재','자격증 기재','어학 점수 기재']},
  ],
  '자기소개서': [
    {title:'성장 과정', items:['직무 연관 경험 중심','구체적 에피소드 포함','결론(직무 연계) 명확히']},
    {title:'지원 동기', items:['회사 조사 후 구체적으로','본인 역량과 연결','직군 선택 이유 포함']},
    {title:'직무 역량', items:['STAR 기법 사용','수치로 성과 표현','실패 경험 및 극복 포함']},
    {title:'입사 후 계획', items:['단기/장기 목표 구분','회사 비전과 연계','현실적인 계획 제시']},
  ],
  '포트폴리오': [
    {title:'구성', items:['표지 (이름·직군·연락처)','목차 포함','PDF 형식으로 저장']},
    {title:'프로젝트', items:['프로젝트 배경 및 목적','본인 역할 명시','결과물 스크린샷/링크 첨부']},
    {title:'마무리', items:['PDF 용량 10MB 이하','오탈자 최종 검토','링크 동작 확인']},
  ],
};
var docChecks = {};
var currentDocTab = '이력서';
function renderDocTabs() {
  var tabs = document.getElementById('doc-tabs');
  if (!tabs) return;
  tabs.innerHTML = '';
  Object.keys(DOC_DATA).forEach(function(k) {
    var on = k === currentDocTab;
    var btn = document.createElement('button');
    btn.textContent = k;
    btn.dataset.k = k;
    btn.style.cssText = 'padding:8px 20px;border-radius:10px;border:1px solid ' + (on?'rgba(6,182,212,0.5)':'#27272a') + ';background:' + (on?'rgba(6,182,212,0.1)':'transparent') + ';color:' + (on?'#06b6d4':'#a1a1aa') + ';font-size:13px;font-weight:' + (on?'700':'400') + ';cursor:pointer;';
    btn.onclick = function(){ switchDocTab(this.dataset.k); };
    tabs.appendChild(btn);
  });
  renderDocContent();
}
function switchDocTab(tab) { currentDocTab = tab; renderDocTabs(); }
function renderDocContent() {
  var el = document.getElementById('doc-content');
  if (!el) return;
  var sections = DOC_DATA[currentDocTab];
  el.innerHTML = sections.map(function(sec) {
    return '<div style="background:#16161e;border:1px solid #27272a;border-radius:14px;padding:18px 20px;">' +
      '<div style="font-size:12px;font-weight:700;color:#06b6d4;margin-bottom:12px;text-transform:uppercase;letter-spacing:.05em;">' + sec.title + '</div>' +
      sec.items.map(function(item) {
        var key = currentDocTab + '-' + sec.title + '-' + item;
        var done = docChecks[key] || false;
        return '<div data-key="' + key + '" onclick="toggleDocCheck(this.dataset.key,this)" style="display:flex;align-items:center;gap:10px;cursor:pointer;padding:7px 0;border-bottom:1px solid rgba(255,255,255,0.04);">' +
          '<div style="width:16px;height:16px;border-radius:4px;border:1px solid ' + (done?'#06b6d4':'#27272a') + ';flex-shrink:0;display:flex;align-items:center;justify-content:center;background:' + (done?'rgba(6,182,212,0.15)':'') + ';transition:all .2s;">' +
          '<svg style="width:10px;height:10px;opacity:' + (done?'1':'0') + ';" fill="none" stroke="#06b6d4" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg></div>' +
          '<span style="font-size:13px;' + (done?'text-decoration:line-through;color:#a1a1aa;':'') + '">' + item + '</span></div>';
      }).join('') + '</div>';
  }).join('');
}
function toggleDocCheck(key, el) {
  docChecks[key] = !docChecks[key];
  var done = docChecks[key];
  var box = el.querySelector('div');
  var text = el.querySelector('span');
  var svg = el.querySelector('svg');
  if (box) { box.style.borderColor=done?'#06b6d4':'#27272a'; box.style.background=done?'rgba(6,182,212,0.15)':''; }
  if (svg) svg.style.opacity=done?'1':'0';
  if (text) text.style.textDecoration=done?'line-through':'';
}

// ============================================================
// 출석 / 포인트 / 뱃지
// ============================================================
var _attendanceStatus = null;

function openBadgeShop() {
  var modal = document.getElementById('modal-badge-shop');
  if (!modal) return;
  var pts = document.getElementById('shop-my-points');
  if (pts && _attendanceStatus) pts.textContent = _attendanceStatus.points;
  modal.style.display = 'flex';
}

async function buyBadge(badgeName) {
  if (!currentUser) { showToast('로그인이 필요합니다', 'info'); return; }
  try {
    var res = await apiBuyBadge(badgeName);
    if (res.success) {
      showToast(res.badge + ' 뱃지를 획득했어요!', 'success');
      if (_attendanceStatus) _attendanceStatus.points = res.remainPoints;
      var pts = document.getElementById('shop-my-points');
      if (pts) pts.textContent = res.remainPoints;
      refreshMypagePoints();
    } else {
      showToast(res.message || '구매 실패', 'error');
    }
  } catch(e) {
    showToast('구매 중 오류가 발생했습니다', 'error');
  }
}

async function boostPost(postId) {
  if (!currentUser) { showToast('로그인이 필요합니다', 'info'); return; }
  if (!confirm('50P를 사용해 게시글을 3일간 상단에 노출할까요?')) return;
  try {
    var res = await apiBoostPost(postId);
    if (res.success) {
      showToast('게시글이 3일간 부스트됩니다! (남은 포인트: ' + res.remainPoints + 'P)', 'success');
      if (_attendanceStatus) _attendanceStatus.points = res.remainPoints;
      refreshMypagePoints();
    } else {
      showToast(res.message || '부스트 실패', 'error');
    }
  } catch(e) {
    showToast('부스트 중 오류가 발생했습니다', 'error');
  }
}

function refreshMypagePoints() {
  if (!_attendanceStatus) return;
  var pts1 = document.getElementById('mypage-points');
  var pts2 = document.getElementById('mypage-points-big');
  var str1 = document.getElementById('mypage-streak');
  var str2 = document.getElementById('mypage-streak-big');
  if (pts1) pts1.textContent = _attendanceStatus.points + 'P';
  if (pts2) pts2.textContent = _attendanceStatus.points;
  if (str1) str1.textContent = _attendanceStatus.streak + '일 연속 출석 🔥';
  if (str2) str2.textContent = _attendanceStatus.streak;
  var badgesEl = document.getElementById('mypage-badges');
  if (badgesEl && Array.isArray(_attendanceStatus.badges) && _attendanceStatus.badges.length) {
    var EMOJI = {'첫걸음':'🌱','열정가득':'🔥','취준불꽃':'⚡','출석왕':'🏆','복지마스터':'💎','취준챔피언':'🎯'};
    badgesEl.innerHTML = _attendanceStatus.badges.map(function(b) {
      var e = EMOJI[b.trim()] || '🏅';
      return '<span class="inline-flex items-center gap-1 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-xs font-semibold">' + e + ' ' + b.trim() + '</span>';
    }).join('');
  }
  // 닉네임 이모지 표시 + 장착 그리드 하이라이트
  var curEmoji = _attendanceStatus.nicknameEmoji || '';
  var emojiEl = document.getElementById('mypage-nickname-emoji');
  if (emojiEl) emojiEl.textContent = curEmoji;
  if (currentUser) currentUser.nicknameEmoji = curEmoji;
  var navEl = document.getElementById('nav-username');
  if (navEl && currentUser) {
    var nick = currentUser.nickname || currentUser.username;
    navEl.textContent = curEmoji ? curEmoji + ' ' + nick : nick;
  }
  var curEmojiDisplay = document.getElementById('mypage-current-emoji-display');
  if (curEmojiDisplay) curEmojiDisplay.textContent = curEmoji || '없음';
  document.querySelectorAll('.equip-emoji-btn').forEach(function(b) {
    var active = b.dataset.emoji === curEmoji;
    b.classList.toggle('border-primary', active);
    b.classList.toggle('bg-primary/10', active);
    b.classList.toggle('border-border', !active);
  });
}

async function equipEmojiFromMypage(emoji) {
  if (!currentUser) { openModal('modal-login'); return; }
  try {
    var res = await apiEquipEmoji(emoji);
    if (res.success) {
      if (_attendanceStatus) _attendanceStatus.nicknameEmoji = emoji;
      refreshMypagePoints();
      showToast(emoji ? emoji + ' 이모지 장착 완료!' : '이모지를 해제했어요', 'success');
    } else {
      showToast(res.message || '장착 실패', 'error');
    }
  } catch(e) {
    showToast('오류가 발생했습니다', 'error');
  }
}

// ========== goPage 연동 ==========
var _origGoPage2 = goPage;
goPage = function(name) {
  var newPages2 = ['scrapbook','notifications','matching','calculator','documents'];
  if (newPages2.includes(name)) {
    document.querySelectorAll('.page').forEach(function(p){p.classList.remove('active');});
    var pg = document.getElementById('page-' + name);
    if (pg) { pg.classList.add('active'); window.scrollTo(0,0); }
    if (name==='notifications') renderNotifSettings();
    else if (name==='matching') renderMatchTags();
    else if (name==='calculator') renderCalcOptions();
    else if (name==='documents') renderDocTabs();
    else if (name==='scrapbook') renderScrapList();
  } else {
    _origGoPage2(name);
    if (name==='home') setTimeout(renderDdayWidget, 300);
    if (name==='welfare' && typeof loadWelfareData === 'function') loadWelfareData();
  }
};

// 홈 이동 시 D-day 위젯 렌더
setTimeout(renderDdayWidget, 1000);
