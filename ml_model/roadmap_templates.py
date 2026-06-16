"""
직군별 취업 로드맵 템플릿
기간: 3개월, 6개월, 1년
"""

COLORS = ['#06b6d4', '#8b5cf6', '#f59e0b', '#f43f5e', '#10b981',
          '#06b6d4', '#8b5cf6', '#f59e0b', '#f43f5e', '#10b981',
          '#06b6d4', '#8b5cf6']

# 카테고리 → 초기 행정 태스크 매핑
WELFARE_TASKS = {
    "default":  ["고용센터 방문 · 구직촉진수당 신청", "내일배움카드 신청", "워크넷 프로필 등록"],
    "주거":     ["고용센터 방문 · 구직촉진수당 신청", "청년 월세 특별지원 신청"],
    "저소득":   ["고용센터 방문 · 구직촉진수당 신청", "청년내일저축계좌 신청 (소득 기준 확인)"],
    "자립":     ["자립준비청년 지원 신청", "고용센터 방문 · 취업 지원 서비스 등록"],
}

INCOME_BY_MONTH = {
    1: ("구직촉진수당 50만원", 50),
    2: ("구직촉진수당 50만원", 50),
    3: ("구직촉진수당 50만원", 50),
    4: ("구직촉진수당 50만원", 50),
    5: ("구직촉진수당 50만원 + 면접비", 60),
    6: ("구직촉진수당 50만원 + 면접비", 60),
    7: ("수당 유지", 50),
    8: ("수당 유지", 50),
    9: ("수당 마무리", 50),
    10: ("면접비", 30),
    11: ("면접비", 30),
    12: ("초봉 200~300만원", 250),
}

# ── 개발자 ────────────────────────────────────────────────────────
DEVELOPER = {
    "3개월": [
        {"title": "기반 다지기", "checkpoint": "수당 신청 완료 · 개발환경 세팅",
         "tasks": [
             {"category": "📋 행정", "items": ["구직촉진수당 신청", "내일배움카드 신청", "워크넷 프로필 등록"]},
             {"category": "💻 학습", "items": ["개발환경 세팅 (VS Code, Git)", "HTML/CSS 기초", "코딩 커뮤니티 가입"]},
             {"category": "🎯 목표", "items": ["정적 웹페이지 1개 완성"]},
         ]},
        {"title": "JavaScript 정복", "checkpoint": "미니 프로젝트 2개 GitHub 업로드",
         "tasks": [
             {"category": "💻 학습", "items": ["JavaScript ES6+ 문법", "DOM 조작 · 이벤트", "비동기 처리 (Promise, async/await)"]},
             {"category": "🛠️ 프로젝트", "items": ["Todo 앱 제작", "날씨 앱 (API 연동)"]},
             {"category": "💰 복지", "items": ["청년내일저축계좌 신청"]},
         ]},
        {"title": "포트폴리오 & 취준", "checkpoint": "포트폴리오 배포 · 지원 시작",
         "tasks": [
             {"category": "💻 학습", "items": ["React 기초 · 컴포넌트", "포트폴리오 사이트 제작"]},
             {"category": "📝 취준", "items": ["이력서 초안 작성", "채용 플랫폼 프로필 등록", "주 5곳 이상 지원 시작"]},
             {"category": "🎯 목표", "items": ["서류 통과 1곳 이상", "코딩테스트 준비 시작"]},
         ]},
    ],
    "6개월": [
        {"title": "기반 다지기", "checkpoint": "수당 입금 확인 · 학습 루틴 확립",
         "tasks": [
             {"category": "📋 행정", "items": ["구직촉진수당 신청", "내일배움카드 신청", "워크넷 프로필 등록"]},
             {"category": "💻 학습", "items": ["개발환경 세팅 (VS Code, Git)", "HTML/CSS 기초", "코딩 커뮤니티 가입"]},
         ]},
        {"title": "CSS 심화 & JS 기초", "checkpoint": "클론코딩 2개 GitHub 업로드",
         "tasks": [
             {"category": "💻 학습", "items": ["CSS Flexbox/Grid 완전 정복", "JavaScript 기초 문법", "반응형 디자인"]},
             {"category": "🛠️ 프로젝트", "items": ["클론코딩 2개 완성"]},
             {"category": "💰 복지", "items": ["청년내일저축계좌 신청 ⚠️"]},
         ]},
        {"title": "JavaScript 심화", "checkpoint": "미니 프로젝트 3개 완성",
         "tasks": [
             {"category": "💻 학습", "items": ["ES6+ 완전 정복", "DOM · 이벤트 · 비동기", "REST API 연동"]},
             {"category": "🛠️ 프로젝트", "items": ["날씨 앱", "Todo 앱", "영화 검색 앱"]},
         ]},
        {"title": "React + 팀 프로젝트", "checkpoint": "팀프로젝트 1개 완성 · 포트폴리오 초안",
         "tasks": [
             {"category": "💻 학습", "items": ["React 컴포넌트 · State · Props", "useEffect · useState · Context", "React Router"]},
             {"category": "🤝 협업", "items": ["오픈소스 팀 프로젝트 참여", "GitHub 협업 (PR, 코드리뷰)"]},
         ]},
        {"title": "본격 취준 돌입", "checkpoint": "서류 통과 3곳 이상 목표",
         "tasks": [
             {"category": "📝 취준", "items": ["이력서 · 자기소개서 완성", "포트폴리오 최종 다듬기", "배포 (Vercel/Netlify)"]},
             {"category": "🎯 지원", "items": ["주 10곳 이상 서류 지원", "코딩테스트 매일 1문제", "면접 스터디 참여"]},
         ]},
        {"title": "최종 목표 달성", "checkpoint": "🎊 취업 성공!",
         "tasks": [
             {"category": "🎯 면접", "items": ["최종 면접 준비", "포트폴리오 발표 연습", "연봉 협상 준비"]},
             {"category": "🎉 취업 후", "items": ["청년도약계좌 즉시 신청", "취업성공수당 신청 (최대 150만원)", "건강보험 직장가입자 전환"]},
         ]},
    ],
    "1년": [
        {"title": "기반 다지기", "checkpoint": "수당 신청 · 학습 루틴 확립",
         "tasks": [{"category": "📋 행정", "items": ["구직촉진수당 신청", "내일배움카드 신청"]}, {"category": "💻 학습", "items": ["HTML/CSS 기초", "개발환경 세팅"]}]},
        {"title": "HTML/CSS 완성", "checkpoint": "클론코딩 3개 완성",
         "tasks": [{"category": "💻 학습", "items": ["CSS Flexbox/Grid", "반응형 디자인", "클론코딩 3개"]}, {"category": "💰 복지", "items": ["청년내일저축계좌 신청"]}]},
        {"title": "JavaScript 기초", "checkpoint": "JS 미니 프로젝트 완성",
         "tasks": [{"category": "💻 학습", "items": ["JS 문법", "DOM 조작", "미니 프로젝트"]}]},
        {"title": "JavaScript 심화", "checkpoint": "API 연동 프로젝트 완성",
         "tasks": [{"category": "💻 학습", "items": ["비동기 처리", "API 연동", "앱 3개 제작"]}]},
        {"title": "React 입문", "checkpoint": "React 기본 앱 제작",
         "tasks": [{"category": "💻 학습", "items": ["React 기초", "State/Props", "Hooks"]}]},
        {"title": "React 심화", "checkpoint": "팀 프로젝트 1개 완성",
         "tasks": [{"category": "💻 학습", "items": ["Context API", "React Router", "상태관리"]}, {"category": "🤝 협업", "items": ["팀 프로젝트 참여"]}]},
        {"title": "백엔드 기초", "checkpoint": "간단한 API 서버 제작",
         "tasks": [{"category": "💻 학습", "items": ["Node.js 기초", "Express", "REST API 설계"]}]},
        {"title": "DB & 풀스택", "checkpoint": "풀스택 프로젝트 1개",
         "tasks": [{"category": "💻 학습", "items": ["MySQL/MongoDB", "풀스택 프로젝트"]}]},
        {"title": "포트폴리오 완성", "checkpoint": "포트폴리오 완성 · 배포",
         "tasks": [{"category": "🛠️ 작업", "items": ["포트폴리오 사이트 완성", "프로젝트 3개 배포", "README 작성"]}]},
        {"title": "취준 본격 시작", "checkpoint": "서류 통과 5곳 이상",
         "tasks": [{"category": "📝 취준", "items": ["이력서 완성", "100곳 지원 목표"]}, {"category": "🎯 준비", "items": ["코딩테스트", "기술 면접"]}]},
        {"title": "면접 집중", "checkpoint": "최종 면접 합격 목표",
         "tasks": [{"category": "🎯 면접", "items": ["기술 면접 집중 준비", "포트폴리오 발표 연습", "연봉 협상 준비"]}]},
        {"title": "취업 성공! 🎉", "checkpoint": "🎊 취업 & 새 출발!",
         "tasks": [{"category": "🎉 취업 후", "items": ["청년도약계좌 신청", "취업성공수당 신청", "직장 적응"]}]},
    ],
}

# ── 디자이너 ──────────────────────────────────────────────────────
DESIGNER = {
    "3개월": [
        {"title": "디자인 기초", "checkpoint": "Figma 기본 UI 제작",
         "tasks": [
             {"category": "📋 행정", "items": ["구직촉진수당 신청", "내일배움카드 신청"]},
             {"category": "🎨 학습", "items": ["Figma 기초", "UI 컴포넌트", "디자인 원칙 (여백·색상·타이포)"]},
         ]},
        {"title": "포트폴리오 제작", "checkpoint": "포트폴리오 작업물 2개",
         "tasks": [
             {"category": "🎨 학습", "items": ["UX 리서치", "와이어프레임", "프로토타입"]},
             {"category": "🛠️ 작업", "items": ["앱 리디자인 1개", "웹사이트 디자인"]},
             {"category": "💰 복지", "items": ["청년내일저축계좌 신청"]},
         ]},
        {"title": "취업 도전", "checkpoint": "서류 통과 1곳 이상",
         "tasks": [
             {"category": "🛠️ 작업", "items": ["포트폴리오 정리", "Behance 업로드"]},
             {"category": "📝 취준", "items": ["채용 지원 시작", "포트폴리오 발표 연습"]},
         ]},
    ],
    "6개월": [
        {"title": "디자인 기초", "checkpoint": "Figma 기본 UI 제작",
         "tasks": [
             {"category": "📋 행정", "items": ["구직촉진수당 신청", "내일배움카드 신청"]},
             {"category": "🎨 학습", "items": ["Figma 기초", "디자인 원칙", "UI 컴포넌트"]},
         ]},
        {"title": "UX 이해", "checkpoint": "앱 와이어프레임 완성",
         "tasks": [{"category": "🎨 학습", "items": ["UX 리서치", "와이어프레임", "프로토타입"]}]},
        {"title": "포트폴리오 시작", "checkpoint": "포트폴리오 작업물 2개",
         "tasks": [{"category": "🛠️ 작업", "items": ["앱 리디자인 1개", "웹사이트 디자인"]}]},
        {"title": "심화 & 브랜딩", "checkpoint": "브랜딩 프로젝트 완성",
         "tasks": [{"category": "🎨 학습", "items": ["브랜드 아이덴티티", "Adobe 포토샵", "모션 기초"]}, {"category": "💰 복지", "items": ["청년내일저축계좌 신청"]}]},
        {"title": "포트폴리오 완성", "checkpoint": "포트폴리오 완성 · 지원 시작",
         "tasks": [{"category": "🛠️ 작업", "items": ["포트폴리오 사이트 제작", "작업물 5개 이상", "Behance 정리"]}, {"category": "📝 취준", "items": ["채용 지원 시작"]}]},
        {"title": "취업 성공", "checkpoint": "취업 성공",
         "tasks": [{"category": "🎯 면접", "items": ["포트폴리오 발표 연습", "디자인 과제 준비"]}, {"category": "🎉 취업 후", "items": ["청년도약계좌 신청"]}]},
    ],
    "1년": [
        {"title": "디자인 기초", "checkpoint": "Figma 기본 완성",
         "tasks": [{"category": "📋 행정", "items": ["구직촉진수당 신청", "내일배움카드 신청"]}, {"category": "🎨 학습", "items": ["Figma 기초", "UI 원칙"]}]},
        {"title": "UI 심화", "checkpoint": "UI 키트 제작",
         "tasks": [{"category": "🎨 학습", "items": ["컴포넌트 시스템", "타이포그래피", "컬러 이론"]}]},
        {"title": "UX 리서치", "checkpoint": "UX 케이스스터디 1개",
         "tasks": [{"category": "🎨 학습", "items": ["사용자 리서치", "페르소나", "유저 저니맵"]}]},
        {"title": "프로토타이핑", "checkpoint": "인터랙티브 프로토타입",
         "tasks": [{"category": "🎨 학습", "items": ["Figma 프로토타입", "인터랙션 디자인"]}, {"category": "🛠️ 작업", "items": ["앱 리디자인 1개"]}]},
        {"title": "브랜딩", "checkpoint": "브랜딩 프로젝트 완성",
         "tasks": [{"category": "🎨 학습", "items": ["브랜드 아이덴티티", "로고 디자인", "포토샵"]}, {"category": "💰 복지", "items": ["청년내일저축계좌 신청"]}]},
        {"title": "모션 & 심화", "checkpoint": "모션 작업물 1개",
         "tasks": [{"category": "🎨 학습", "items": ["모션 기초", "After Effects", "마이크로 인터랙션"]}]},
        {"title": "웹 기초 이해", "checkpoint": "개발 협업 이해",
         "tasks": [{"category": "🎨 학습", "items": ["HTML/CSS 기초 이해", "개발자와 협업법", "Figma 핸드오프"]}]},
        {"title": "포트폴리오 제작", "checkpoint": "포트폴리오 배포",
         "tasks": [{"category": "🛠️ 작업", "items": ["포트폴리오 사이트 제작", "작업물 6개 이상"]}]},
        {"title": "포트폴리오 다듬기", "checkpoint": "포트폴리오 완성",
         "tasks": [{"category": "🛠️ 작업", "items": ["케이스스터디 작성", "Behance 업로드", "Notion 포트폴리오"]}]},
        {"title": "취준 본격 시작", "checkpoint": "서류 통과 3곳 이상",
         "tasks": [{"category": "📝 취준", "items": ["이력서 완성", "자기소개서 작성", "채용 지원 시작"]}]},
        {"title": "면접 집중", "checkpoint": "최종 면접 합격 목표",
         "tasks": [{"category": "🎯 면접", "items": ["포트폴리오 발표 연습", "디자인 과제 준비", "연봉 협상"]}]},
        {"title": "취업 성공", "checkpoint": "취업 & 새 출발",
         "tasks": [{"category": "🎉 취업 후", "items": ["청년도약계좌 신청", "취업성공수당 신청"]}]},
    ],
}

# ── 마케터 ────────────────────────────────────────────────────────
MARKETER = {
    "3개월": [
        {"title": "마케팅 기초", "checkpoint": "SNS 채널 개설 · 콘텐츠 5개 발행",
         "tasks": [
             {"category": "📋 행정", "items": ["구직촉진수당 신청", "내일배움카드 신청"]},
             {"category": "📊 학습", "items": ["디지털 마케팅 기초", "SNS 채널 운영", "카피라이팅"]},
         ]},
        {"title": "실무 스킬 강화", "checkpoint": "캠페인 기획안 1개 완성",
         "tasks": [
             {"category": "📊 학습", "items": ["구글 애널리틱스", "퍼포먼스 마케팅", "콘텐츠 마케팅"]},
             {"category": "🛠️ 실습", "items": ["개인 블로그 운영", "인스타그램 성장 실험"]},
             {"category": "💰 복지", "items": ["청년내일저축계좌 신청"]},
         ]},
        {"title": "포트폴리오 & 취준", "checkpoint": "서류 통과 1곳 이상",
         "tasks": [
             {"category": "🛠️ 작업", "items": ["마케팅 포트폴리오 정리", "성과 지표 수치화"]},
             {"category": "📝 취준", "items": ["이력서 완성", "채용 지원 시작"]},
         ]},
    ],
    "6개월": [
        {"title": "마케팅 기초", "checkpoint": "SNS 채널 개설 · 콘텐츠 5개",
         "tasks": [{"category": "📋 행정", "items": ["구직촉진수당 신청", "내일배움카드 신청"]}, {"category": "📊 학습", "items": ["디지털 마케팅 기초", "SNS 운영", "카피라이팅"]}]},
        {"title": "데이터 분석", "checkpoint": "GA4 분석 보고서 1개 작성",
         "tasks": [{"category": "📊 학습", "items": ["구글 애널리틱스 GA4", "데이터 기반 의사결정", "A/B 테스트"]}, {"category": "💰 복지", "items": ["청년내일저축계좌 신청"]}]},
        {"title": "퍼포먼스 마케팅", "checkpoint": "광고 캠페인 1개 실습",
         "tasks": [{"category": "📊 학습", "items": ["페이스북·인스타 광고", "구글 광고 (GDN/검색)", "예산 최적화"]}]},
        {"title": "콘텐츠 & 브랜드", "checkpoint": "콘텐츠 캘린더 1개월치 기획",
         "tasks": [{"category": "🛠️ 실습", "items": ["브랜드 SNS 채널 운영", "콘텐츠 마케팅 전략", "인플루언서 협업 기획"]}]},
        {"title": "포트폴리오 완성", "checkpoint": "포트폴리오 완성 · 지원 시작",
         "tasks": [{"category": "🛠️ 작업", "items": ["마케팅 포트폴리오 정리", "성과 수치화"]}, {"category": "📝 취준", "items": ["이력서 완성", "채용 지원 시작"]}]},
        {"title": "취업 성공", "checkpoint": "취업 성공",
         "tasks": [{"category": "🎯 면접", "items": ["마케팅 케이스스터디 준비", "포트폴리오 발표 연습"]}, {"category": "🎉 취업 후", "items": ["청년도약계좌 신청"]}]},
    ],
    "1년": [
        {"title": "마케팅 기초", "checkpoint": "기초 완성",
         "tasks": [{"category": "📋 행정", "items": ["구직촉진수당 신청", "내일배움카드 신청"]}, {"category": "📊 학습", "items": ["디지털 마케팅 기초", "SNS 운영"]}]},
        {"title": "콘텐츠 마케팅", "checkpoint": "블로그 10개 발행",
         "tasks": [{"category": "📊 학습", "items": ["SEO 기초", "콘텐츠 전략", "카피라이팅 심화"]}, {"category": "💰 복지", "items": ["청년내일저축계좌 신청"]}]},
        {"title": "데이터 분석", "checkpoint": "GA4 보고서 작성",
         "tasks": [{"category": "📊 학습", "items": ["구글 애널리틱스 GA4", "데이터 시각화", "KPI 설정"]}]},
        {"title": "퍼포먼스 마케팅", "checkpoint": "광고 캠페인 실습",
         "tasks": [{"category": "📊 학습", "items": ["메타 광고", "구글 광고", "예산 최적화"]}]},
        {"title": "이메일 & CRM", "checkpoint": "이메일 캠페인 기획",
         "tasks": [{"category": "📊 학습", "items": ["이메일 마케팅", "CRM 툴 활용", "고객 세분화"]}]},
        {"title": "브랜드 마케팅", "checkpoint": "브랜드 기획안 완성",
         "tasks": [{"category": "📊 학습", "items": ["브랜드 아이덴티티", "오프라인 마케팅", "PR 기초"]}]},
        {"title": "마케팅 자동화", "checkpoint": "자동화 캠페인 1개",
         "tasks": [{"category": "📊 학습", "items": ["마케팅 오토메이션", "챗봇 활용", "리타겟팅"]}]},
        {"title": "포트폴리오 제작", "checkpoint": "포트폴리오 초안",
         "tasks": [{"category": "🛠️ 작업", "items": ["성과 수치화", "케이스스터디 작성"]}]},
        {"title": "포트폴리오 완성", "checkpoint": "포트폴리오 완성",
         "tasks": [{"category": "🛠️ 작업", "items": ["포트폴리오 사이트 제작", "LinkedIn 정리"]}]},
        {"title": "취준 시작", "checkpoint": "서류 통과 3곳 이상",
         "tasks": [{"category": "📝 취준", "items": ["이력서 완성", "채용 지원 시작"]}]},
        {"title": "면접 집중", "checkpoint": "최종 면접 목표",
         "tasks": [{"category": "🎯 면접", "items": ["케이스스터디 준비", "포트폴리오 발표 연습"]}]},
        {"title": "취업 성공", "checkpoint": "취업 & 새 출발",
         "tasks": [{"category": "🎉 취업 후", "items": ["청년도약계좌 신청", "취업성공수당 신청"]}]},
    ],
}

# ── 기획자 ────────────────────────────────────────────────────────
PLANNER = {
    "3개월": [
        {"title": "기획 기초", "checkpoint": "서비스 기획서 1개 완성",
         "tasks": [
             {"category": "📋 행정", "items": ["구직촉진수당 신청", "내일배움카드 신청"]},
             {"category": "📝 학습", "items": ["서비스 기획 방법론", "UX 기초", "시장 조사법"]},
         ]},
        {"title": "도구 & 실무 스킬", "checkpoint": "프로토타입 1개 완성",
         "tasks": [
             {"category": "📝 학습", "items": ["Figma 와이어프레임", "Notion 문서화", "JIRA/협업 툴"]},
             {"category": "🛠️ 실습", "items": ["사이드 프로젝트 기획", "사용자 인터뷰 3회"]},
         ]},
        {"title": "포트폴리오 & 취준", "checkpoint": "서류 통과 1곳 이상",
         "tasks": [
             {"category": "🛠️ 작업", "items": ["기획 포트폴리오 정리", "케이스스터디 작성"]},
             {"category": "📝 취준", "items": ["이력서 완성", "채용 지원 시작"]},
         ]},
    ],
    "6개월": [
        {"title": "기획 기초", "checkpoint": "기획 방법론 이해",
         "tasks": [{"category": "📋 행정", "items": ["구직촉진수당 신청", "내일배움카드 신청"]}, {"category": "📝 학습", "items": ["서비스 기획 방법론", "UX 기초", "시장 조사"]}]},
        {"title": "리서치 & 분석", "checkpoint": "경쟁사 분석 보고서 완성",
         "tasks": [{"category": "📝 학습", "items": ["사용자 리서치", "데이터 분석 기초", "경쟁사 분석"]}, {"category": "💰 복지", "items": ["청년내일저축계좌 신청"]}]},
        {"title": "기획 실무", "checkpoint": "PRD 문서 1개 작성",
         "tasks": [{"category": "📝 학습", "items": ["PRD 작성법", "Figma 와이어프레임", "스토리보드"]}, {"category": "🛠️ 실습", "items": ["사이드 프로젝트 기획"]}]},
        {"title": "데이터 & 협업", "checkpoint": "A/B 테스트 기획 완성",
         "tasks": [{"category": "📝 학습", "items": ["SQL 기초", "JIRA · 노션 협업", "A/B 테스트 설계"]}]},
        {"title": "포트폴리오 완성", "checkpoint": "포트폴리오 완성 · 지원 시작",
         "tasks": [{"category": "🛠️ 작업", "items": ["포트폴리오 정리", "케이스스터디 작성"]}, {"category": "📝 취준", "items": ["채용 지원 시작"]}]},
        {"title": "취업 성공", "checkpoint": "취업 성공",
         "tasks": [{"category": "🎯 면접", "items": ["기획 케이스스터디 준비", "포트폴리오 발표 연습"]}, {"category": "🎉 취업 후", "items": ["청년도약계좌 신청"]}]},
    ],
    "1년": [
        {"title": "기획 기초", "checkpoint": "기초 완성",
         "tasks": [{"category": "📋 행정", "items": ["구직촉진수당 신청", "내일배움카드 신청"]}, {"category": "📝 학습", "items": ["서비스 기획 방법론", "UX 기초"]}]},
        {"title": "사용자 리서치", "checkpoint": "사용자 인터뷰 5회 완료",
         "tasks": [{"category": "📝 학습", "items": ["사용자 리서치 방법론", "페르소나 설정", "유저 저니맵"]}, {"category": "💰 복지", "items": ["청년내일저축계좌 신청"]}]},
        {"title": "와이어프레임", "checkpoint": "앱 와이어프레임 완성",
         "tasks": [{"category": "📝 학습", "items": ["Figma 와이어프레임", "정보 구조 설계", "플로우차트"]}]},
        {"title": "PRD 작성", "checkpoint": "PRD 문서 1개 완성",
         "tasks": [{"category": "📝 학습", "items": ["PRD/BRD 작성법", "기능 명세서", "우선순위 설정"]}]},
        {"title": "데이터 분석", "checkpoint": "SQL 기초 완성",
         "tasks": [{"category": "📝 학습", "items": ["SQL 기초", "구글 애널리틱스", "데이터 기반 의사결정"]}]},
        {"title": "애자일 & 협업", "checkpoint": "스프린트 기획 1회 경험",
         "tasks": [{"category": "📝 학습", "items": ["스크럼/칸반", "JIRA 활용", "스탠드업 미팅"]}]},
        {"title": "사이드 프로젝트", "checkpoint": "서비스 기획 완성",
         "tasks": [{"category": "🛠️ 실습", "items": ["사이드 프로젝트 기획 · 실행", "팀 협업 경험"]}]},
        {"title": "포트폴리오 제작", "checkpoint": "포트폴리오 초안",
         "tasks": [{"category": "🛠️ 작업", "items": ["케이스스터디 작성", "포트폴리오 구성"]}]},
        {"title": "포트폴리오 완성", "checkpoint": "포트폴리오 완성",
         "tasks": [{"category": "🛠️ 작업", "items": ["포트폴리오 사이트 제작", "Notion 포트폴리오"]}]},
        {"title": "취준 시작", "checkpoint": "서류 통과 3곳 이상",
         "tasks": [{"category": "📝 취준", "items": ["이력서 완성", "채용 지원 시작"]}]},
        {"title": "면접 집중", "checkpoint": "최종 면접 목표",
         "tasks": [{"category": "🎯 면접", "items": ["케이스스터디 준비", "포트폴리오 발표 연습"]}]},
        {"title": "취업 성공", "checkpoint": "취업 & 새 출발",
         "tasks": [{"category": "🎉 취업 후", "items": ["청년도약계좌 신청", "취업성공수당 신청"]}]},
    ],
}

# ── 공무원 ────────────────────────────────────────────────────────
CIVIL_SERVANT = {
    "3개월": [
        {"title": "시험 정보 파악", "checkpoint": "목표 직렬 확정 · 응시 일정 등록",
         "tasks": [
             {"category": "📋 행정", "items": ["구직촉진수당 신청", "워크넷 프로필 등록", "고용센터 취업 지원 등록"]},
             {"category": "📚 준비", "items": ["9급/7급 목표 직렬 확정", "시험 일정 달력 정리", "기출문제 분석"]},
             {"category": "🎯 학습", "items": ["국어·영어·한국사 기초 점검", "인강 수강 시작"]},
         ]},
        {"title": "기본기 다지기", "checkpoint": "필수 3과목 기초 완성",
         "tasks": [
             {"category": "📚 학습", "items": ["한국사능력검정시험 2급 이상 취득", "국어 문법·독해 집중", "영어 기초 문법 완성"]},
             {"category": "💰 복지", "items": ["청년내일저축계좌 신청"]},
         ]},
        {"title": "집중 학습 & 모의고사", "checkpoint": "모의고사 평균 70점 이상",
         "tasks": [
             {"category": "📚 학습", "items": ["전 과목 1회독 완료", "취약과목 집중 보완", "모의고사 주 1회 응시"]},
             {"category": "🎯 목표", "items": ["필기시험 원서 접수"]},
         ]},
    ],
    "6개월": [
        {"title": "시험 정보 파악 & 행정", "checkpoint": "목표 직렬 확정 · 수당 신청",
         "tasks": [
             {"category": "📋 행정", "items": ["구직촉진수당 신청", "워크넷 프로필 등록", "내일배움카드 신청"]},
             {"category": "📚 준비", "items": ["직렬 확정 (행정·세무·교육 등)", "시험 일정 달력 정리", "기출 경향 분석"]},
         ]},
        {"title": "기본 3과목 기초", "checkpoint": "국·영·한 기초 완성",
         "tasks": [
             {"category": "📚 학습", "items": ["국어 기초 (문법·독해)", "영어 기초 (단어·문법)", "한국사능력검정 2급 취득"]},
             {"category": "💰 복지", "items": ["청년내일저축계좌 신청 ⚠️"]},
         ]},
        {"title": "전공 과목 시작", "checkpoint": "선택과목 1회독",
         "tasks": [
             {"category": "📚 학습", "items": ["선택과목 1회독 (행정학·법학 등)", "기출문제 분석 시작"]},
             {"category": "🎯 루틴", "items": ["하루 8시간 학습 루틴 확립", "스터디 가입"]},
         ]},
        {"title": "집중 심화 학습", "checkpoint": "전 과목 2회독 완료",
         "tasks": [
             {"category": "📚 학습", "items": ["전 과목 2회독", "취약과목 집중 보완", "모의고사 주 2회"]},
             {"category": "🎯 목표", "items": ["평균 75점 이상 달성"]},
         ]},
        {"title": "실전 모의고사 집중", "checkpoint": "모의고사 평균 80점 이상",
         "tasks": [
             {"category": "📚 학습", "items": ["실전 모의고사 매주 응시", "오답노트 작성·복습", "기출 완전 정복"]},
             {"category": "🎯 목표", "items": ["원서 접수 완료"]},
         ]},
        {"title": "최종 마무리", "checkpoint": "필기 합격 목표",
         "tasks": [
             {"category": "📚 학습", "items": ["최종 정리 및 암기", "면접 기본 준비 시작"]},
             {"category": "🎉 합격 후", "items": ["취업성공수당 신청 (최대 150만원)", "청년도약계좌 신청"]},
         ]},
    ],
    "1년": [
        {"title": "준비 기반 다지기", "checkpoint": "직렬 확정 · 학습 환경 세팅",
         "tasks": [{"category": "📋 행정", "items": ["구직촉진수당 신청", "내일배움카드 신청"]}, {"category": "📚 준비", "items": ["직렬 확정", "기출 경향 분석", "수험 환경 구축"]}]},
        {"title": "국어 집중", "checkpoint": "국어 1회독 완료",
         "tasks": [{"category": "📚 학습", "items": ["국어 문법 완성", "독해 훈련", "어휘 암기"]}, {"category": "💰 복지", "items": ["청년내일저축계좌 신청"]}]},
        {"title": "영어 집중", "checkpoint": "영어 기초·독해 완성",
         "tasks": [{"category": "📚 학습", "items": ["영어 단어 3000개", "문법 완성", "독해 훈련"]}]},
        {"title": "한국사 + 선택과목", "checkpoint": "한국사능력검정 1급",
         "tasks": [{"category": "📚 학습", "items": ["한국사 완성 → 검정시험 응시", "선택과목 1회독 시작"]}]},
        {"title": "선택과목 심화", "checkpoint": "선택과목 2회독",
         "tasks": [{"category": "📚 학습", "items": ["행정학·법학 등 2회독", "기출문제 풀이 시작"]}]},
        {"title": "전과목 통합 복습", "checkpoint": "취약 과목 집중 보완",
         "tasks": [{"category": "📚 학습", "items": ["전 과목 취약점 파악", "집중 보완", "스터디 활용"]}]},
        {"title": "모의고사 시작", "checkpoint": "모의고사 평균 70점",
         "tasks": [{"category": "📚 학습", "items": ["주 1회 실전 모의고사", "오답 분석·복습"]}]},
        {"title": "실전 집중", "checkpoint": "모의고사 평균 80점",
         "tasks": [{"category": "📚 학습", "items": ["주 2회 모의고사", "기출 완전 정복", "취약 부분 최종 보완"]}]},
        {"title": "원서 접수 & 최종 정리", "checkpoint": "원서 접수 완료",
         "tasks": [{"category": "🎯 목표", "items": ["필기시험 원서 접수", "최종 암기 정리"]}]},
        {"title": "필기 시험", "checkpoint": "필기 합격 목표",
         "tasks": [{"category": "📚 학습", "items": ["마지막 총정리", "컨디션 관리"]}]},
        {"title": "면접 준비", "checkpoint": "면접 합격 목표",
         "tasks": [{"category": "🎯 면접", "items": ["공직가치관 정리", "기출 면접 연습", "최근 정책 이슈 공부"]}]},
        {"title": "최종 합격 🎉", "checkpoint": "공무원 임용 & 새 출발",
         "tasks": [{"category": "🎉 합격 후", "items": ["취업성공수당 신청", "청년도약계좌 신청", "공무원 연금 가입"]}]},
    ],
}

# ── 프리랜서 ──────────────────────────────────────────────────────
FREELANCER = {
    "3개월": [
        {"title": "프리랜서 기반 다지기", "checkpoint": "플랫폼 프로필 완성 · 첫 제안서 발송",
         "tasks": [
             {"category": "📋 행정", "items": ["사업자등록 또는 프리랜서 신고", "구직촉진수당 신청 (해당 시)", "국민연금·건강보험 지역가입자 전환"]},
             {"category": "🛠️ 준비", "items": ["크몽/탈잉/숨고 프로필 등록", "포트폴리오 최소 3개 제작", "서비스 단가 설정"]},
             {"category": "🎯 목표", "items": ["첫 수주 1건 달성"]},
         ]},
        {"title": "클라이언트 확보", "checkpoint": "리뷰 5개 이상 · 월 수익 50만원",
         "tasks": [
             {"category": "🛠️ 실무", "items": ["프로젝트 성공적으로 납품", "리뷰 · 평점 관리", "단골 클라이언트 확보"]},
             {"category": "📊 관리", "items": ["세금계산서 발행 연습", "수입·지출 엑셀 관리"]},
             {"category": "💰 복지", "items": ["청년내일저축계좌 신청"]},
         ]},
        {"title": "단가 올리기", "checkpoint": "월 수익 100만원 달성",
         "tasks": [
             {"category": "🛠️ 실무", "items": ["전문성 어필 · 포트폴리오 업그레이드", "단가 20% 인상 시도", "패키지 상품 기획"]},
             {"category": "📝 마케팅", "items": ["SNS 전문가 채널 운영 시작", "블로그·브런치 글쓰기"]},
         ]},
    ],
    "6개월": [
        {"title": "프리랜서 기반 다지기", "checkpoint": "플랫폼 프로필 완성",
         "tasks": [
             {"category": "📋 행정", "items": ["사업자등록 또는 프리랜서 신고", "구직촉진수당 신청 (해당 시)", "국민연금·건강보험 지역가입자 전환"]},
             {"category": "🛠️ 준비", "items": ["크몽/탈잉/숨고 프로필 등록", "포트폴리오 최소 3개 제작", "서비스 단가 설정"]},
         ]},
        {"title": "첫 수주 달성", "checkpoint": "첫 수주 1건 완료 · 리뷰 3개",
         "tasks": [
             {"category": "🛠️ 실무", "items": ["적극적인 제안서 발송 (주 10건)", "낮은 단가로 경험 쌓기", "첫 클라이언트 만족도 극대화"]},
             {"category": "💰 복지", "items": ["청년내일저축계좌 신청"]},
         ]},
        {"title": "포트폴리오 강화", "checkpoint": "포트폴리오 5개 이상",
         "tasks": [
             {"category": "🛠️ 실무", "items": ["다양한 프로젝트 유형 경험", "포트폴리오 지속 업데이트", "리뷰 · 평점 관리"]},
             {"category": "📊 관리", "items": ["세금계산서 발행", "수입 관리 엑셀 정리"]},
         ]},
        {"title": "단가 인상 & 전문화", "checkpoint": "월 수익 100만원",
         "tasks": [
             {"category": "🛠️ 실무", "items": ["전문 분야 집중 (니치 공략)", "단가 30% 인상", "패키지 상품 기획"]},
             {"category": "📝 마케팅", "items": ["SNS 전문가 채널 운영", "블로그 콘텐츠 발행"]},
         ]},
        {"title": "안정적 수익 구조", "checkpoint": "월 수익 150만원 · 단골 클라이언트 확보",
         "tasks": [
             {"category": "🛠️ 실무", "items": ["재계약 클라이언트 확보", "월 고정 수익 계약 추진", "외주 서브 프리랜서 협업"]},
             {"category": "📊 세금", "items": ["종합소득세 신고 준비", "경비 처리 항목 정리"]},
         ]},
        {"title": "사업화 준비", "checkpoint": "월 수익 200만원 · 브랜드 구축",
         "tasks": [
             {"category": "🛠️ 성장", "items": ["개인 브랜드 사이트 제작", "유료 강의·전자책 기획", "네트워크 확장 (프리랜서 커뮤니티)"]},
             {"category": "🎉 복지", "items": ["청년도약계좌 신청 (조건 확인)", "취업성공수당 확인"]},
         ]},
    ],
    "1년": [
        {"title": "기반 다지기", "checkpoint": "플랫폼 등록 · 사업자 신고",
         "tasks": [{"category": "📋 행정", "items": ["사업자등록·프리랜서 신고", "구직촉진수당 신청"]}, {"category": "🛠️ 준비", "items": ["포트폴리오 3개 제작", "플랫폼 프로필 등록"]}]},
        {"title": "첫 수주", "checkpoint": "첫 프로젝트 완료",
         "tasks": [{"category": "🛠️ 실무", "items": ["주 10건 제안서 발송", "첫 클라이언트 만족 납품"]}, {"category": "💰 복지", "items": ["청년내일저축계좌 신청"]}]},
        {"title": "리뷰 쌓기", "checkpoint": "리뷰 10개 달성",
         "tasks": [{"category": "🛠️ 실무", "items": ["다양한 유형 프로젝트 수행", "리뷰·평점 5점 유지"]}]},
        {"title": "포트폴리오 강화", "checkpoint": "포트폴리오 8개 이상",
         "tasks": [{"category": "🛠️ 실무", "items": ["포트폴리오 업그레이드", "전문 분야 집중"]}]},
        {"title": "단가 인상", "checkpoint": "단가 50% 인상",
         "tasks": [{"category": "🛠️ 실무", "items": ["니치 마켓 공략", "패키지 상품 기획", "단가 인상 시도"]}]},
        {"title": "SNS 마케팅", "checkpoint": "팔로워 500명",
         "tasks": [{"category": "📝 마케팅", "items": ["SNS 전문가 채널 운영", "블로그·브런치 글쓰기", "유튜브 쇼츠 도전"]}]},
        {"title": "안정적 수익", "checkpoint": "월 수익 150만원",
         "tasks": [{"category": "🛠️ 실무", "items": ["단골 클라이언트 확보", "재계약 비율 높이기"]}, {"category": "📊 세금", "items": ["종합소득세 준비"]}]},
        {"title": "월 고정 계약", "checkpoint": "월 고정 계약 1건 이상",
         "tasks": [{"category": "🛠️ 실무", "items": ["리테이너 계약 제안", "외주 협업 파트너 확보"]}]},
        {"title": "개인 브랜딩", "checkpoint": "개인 사이트·브랜드 구축",
         "tasks": [{"category": "📝 성장", "items": ["포트폴리오 사이트 제작", "개인 브랜드 정체성 확립"]}]},
        {"title": "지식 상품화", "checkpoint": "강의·전자책 기획",
         "tasks": [{"category": "🛠️ 성장", "items": ["온라인 강의 기획 (클래스101/탈잉)", "전자책 출판"]}]},
        {"title": "사업 확장", "checkpoint": "월 수익 250만원",
         "tasks": [{"category": "🛠️ 성장", "items": ["소규모 에이전시화 검토", "파트너십 구축"]}]},
        {"title": "프리랜서 독립 선언", "checkpoint": "안정적 프리랜서 라이프스타일 구축",
         "tasks": [{"category": "🎉 성과", "items": ["청년도약계좌 신청", "취업성공수당 확인", "국민연금·건강보험 최적화"]}]},
    ],
}

# ── 유튜버/크리에이터 ──────────────────────────────────────────────
YOUTUBER = {
    "3개월": [
        {"title": "채널 기획 & 개설", "checkpoint": "채널 개설 · 영상 3개 업로드",
         "tasks": [
             {"category": "📋 행정", "items": ["구직촉진수당 신청 (해당 시)", "사업자등록 검토 (추후)", "워크넷 취업지원 등록"]},
             {"category": "🎬 채널 준비", "items": ["채널 컨셉·타겟 설정", "채널 아트·썸네일 디자인", "영상 기획·촬영 장비 준비"]},
             {"category": "🎯 목표", "items": ["영상 3개 업로드 · 구독자 50명"]},
         ]},
        {"title": "콘텐츠 제작 습관화", "checkpoint": "영상 10개 업로드 · 구독자 200명",
         "tasks": [
             {"category": "🎬 제작", "items": ["주 1~2회 업로드 루틴 확립", "섬네일 A/B 테스트", "인트로·아웃트로 제작"]},
             {"category": "📊 분석", "items": ["YouTube 스튜디오 데이터 분석", "조회수 높은 영상 패턴 파악"]},
             {"category": "💰 복지", "items": ["청년내일저축계좌 신청"]},
         ]},
        {"title": "성장 & 수익화 준비", "checkpoint": "구독자 500명 돌파",
         "tasks": [
             {"category": "🎬 성장", "items": ["SEO 최적화 (제목·태그·설명)", "커뮤니티·SNS 연동", "콜라보 채널 섭외"]},
             {"category": "💵 수익화", "items": ["수익화 조건 확인 (구독자 500/시청 3000)", "애드센스 계정 준비"]},
         ]},
    ],
    "6개월": [
        {"title": "채널 기획 & 개설", "checkpoint": "채널 개설 · 영상 3개 업로드",
         "tasks": [
             {"category": "📋 행정", "items": ["구직촉진수당 신청 (해당 시)", "사업자등록 검토", "워크넷 취업지원 등록"]},
             {"category": "🎬 채널 준비", "items": ["채널 컨셉·타겟 설정", "채널 아트·썸네일 디자인", "장비 세팅 (스마트폰 OK)"]},
         ]},
        {"title": "콘텐츠 루틴 확립", "checkpoint": "영상 10개 · 구독자 200명",
         "tasks": [
             {"category": "🎬 제작", "items": ["주 1회 이상 업로드", "섬네일 디자인 강화", "인트로·아웃트로 제작"]},
             {"category": "💰 복지", "items": ["청년내일저축계좌 신청"]},
         ]},
        {"title": "데이터 분석 & 개선", "checkpoint": "영상 20개 · CTR 5% 이상",
         "tasks": [
             {"category": "📊 분석", "items": ["YouTube 스튜디오 분석", "클릭률·시청 지속시간 개선", "인기 영상 패턴 복제"]},
             {"category": "🎬 성장", "items": ["SEO 최적화 (제목·태그)", "커뮤니티 탭 활용"]},
         ]},
        {"title": "수익화 조건 달성", "checkpoint": "구독자 500명 · 시청시간 3000시간",
         "tasks": [
             {"category": "🎬 성장", "items": ["업로드 빈도 증가 (주 2~3회)", "콜라보 콘텐츠 기획", "SNS 채널 연동"]},
             {"category": "💵 수익화", "items": ["YouTube 파트너 프로그램 신청", "애드센스 연동"]},
         ]},
        {"title": "수익 다각화", "checkpoint": "월 광고 수익 발생 · 협찬 1건",
         "tasks": [
             {"category": "💵 수익화", "items": ["광고 수익 첫 정산", "협찬·PPL 협상 시작", "채널 멤버십 기획"]},
             {"category": "📊 세금", "items": ["종합소득세 신고 준비", "사업자등록 (수익 발생 시)"]},
         ]},
        {"title": "구독자 1000명 돌파", "checkpoint": "구독자 1000명 · 지속 수익 구조",
         "tasks": [
             {"category": "🎬 성장", "items": ["구독자 커뮤니티 관리", "팬 이벤트 기획", "외부 플랫폼 확장 (인스타·틱톡)"]},
             {"category": "🎉 수익", "items": ["청년도약계좌 신청 검토", "수익 안정화 전략 수립"]},
         ]},
    ],
    "1년": [
        {"title": "채널 기획", "checkpoint": "채널 개설 · 컨셉 확정",
         "tasks": [{"category": "📋 행정", "items": ["구직촉진수당 신청", "사업자등록 검토"]}, {"category": "🎬 준비", "items": ["채널 컨셉·타겟 설정", "장비 세팅"]}]},
        {"title": "초기 콘텐츠", "checkpoint": "영상 5개 업로드",
         "tasks": [{"category": "🎬 제작", "items": ["주 1회 업로드 루틴", "섬네일 제작"]}, {"category": "💰 복지", "items": ["청년내일저축계좌 신청"]}]},
        {"title": "콘텐츠 루틴 확립", "checkpoint": "영상 10개 · 구독자 100명",
         "tasks": [{"category": "🎬 제작", "items": ["업로드 일정 고정화", "인트로·아웃트로 제작"]}]},
        {"title": "데이터 분석", "checkpoint": "CTR 4% 이상",
         "tasks": [{"category": "📊 분석", "items": ["YouTube 스튜디오 분석", "인기 영상 패턴 파악", "SEO 최적화"]}]},
        {"title": "성장 가속화", "checkpoint": "구독자 300명",
         "tasks": [{"category": "🎬 성장", "items": ["업로드 주 2회", "콜라보 1건", "SNS 연동"]}]},
        {"title": "수익화 조건 달성", "checkpoint": "구독자 500명 · 시청 3000시간",
         "tasks": [{"category": "💵 수익화", "items": ["YouTube 파트너 프로그램 신청", "애드센스 연동"]}]},
        {"title": "첫 수익 달성", "checkpoint": "광고 수익 첫 정산",
         "tasks": [{"category": "💵 수익화", "items": ["광고 수익 정산", "협찬 문의 시작"]}, {"category": "📊 세금", "items": ["사업자등록 검토"]}]},
        {"title": "구독자 1000명", "checkpoint": "구독자 1000명 돌파",
         "tasks": [{"category": "🎬 성장", "items": ["업로드 주 2~3회", "팬 커뮤니티 관리"]}]},
        {"title": "수익 다각화", "checkpoint": "협찬 2건 이상 · 멤버십",
         "tasks": [{"category": "💵 수익화", "items": ["채널 멤버십 개설", "PPL·협찬 계약", "굿즈 기획"]}]},
        {"title": "구독자 3000명", "checkpoint": "구독자 3000명",
         "tasks": [{"category": "🎬 성장", "items": ["외부 플랫폼 확장 (인스타·틱톡)", "쇼츠 콘텐츠 제작"]}]},
        {"title": "브랜딩 & 확장", "checkpoint": "월 수익 100만원",
         "tasks": [{"category": "🎬 성장", "items": ["개인 브랜드화", "온라인 강의·전자책 기획"]}]},
        {"title": "크리에이터 독립", "checkpoint": "월 수익 200만원 · 지속 성장",
         "tasks": [{"category": "🎉 성과", "items": ["청년도약계좌 신청", "종합소득세 신고", "수익 구조 안정화"]}]},
    ],
}

# ── 의료/보건 ──────────────────────────────────────────────────────
HEALTHCARE = {
    "3개월": [
        {"title": "기반 다지기", "checkpoint": "수당 신청 · 시험 일정 확인",
         "tasks": [
             {"category": "📋 행정", "items": ["구직촉진수당 신청", "내일배움카드 신청", "워크넷 등록"]},
             {"category": "📚 준비", "items": ["국가고시/자격증 응시 자격 확인", "시험 일정 파악", "교재 구입 · 기출 분석"]},
         ]},
        {"title": "핵심 과목 집중", "checkpoint": "교재 1회독 · 오답노트 시작",
         "tasks": [
             {"category": "📚 학습", "items": ["핵심 과목 1회독 완료", "오답 노트 관리", "스터디 그룹 가입"]},
             {"category": "💰 복지", "items": ["청년내일저축계좌 신청"]},
         ]},
        {"title": "실전 준비 · 지원", "checkpoint": "원서 접수 · 이력서 완성",
         "tasks": [
             {"category": "📚 학습", "items": ["실전 문제 풀이 집중", "모의고사 응시", "원서 접수"]},
             {"category": "📝 취준", "items": ["이력서 작성", "희망 병원/기관 리서치", "지원 시작"]},
         ]},
    ],
    "6개월": [
        {"title": "기반 다지기", "checkpoint": "수당 신청 · 시험 일정 등록",
         "tasks": [
             {"category": "📋 행정", "items": ["구직촉진수당 신청", "내일배움카드 신청", "워크넷 등록"]},
             {"category": "📚 준비", "items": ["국가고시/자격증 응시 자격 확인", "시험 일정 파악", "교재 구입 · 학습 계획 수립"]},
         ]},
        {"title": "기초 이론 정복", "checkpoint": "기초 교재 1회독 완료",
         "tasks": [
             {"category": "📚 학습", "items": ["기초 이론 교재 학습", "핵심 개념 정리 노트", "관련 법규 암기"]},
             {"category": "💰 복지", "items": ["청년내일저축계좌 신청"]},
         ]},
        {"title": "심화 학습 · 반복", "checkpoint": "전 과목 2회독 · 모의고사 첫 응시",
         "tasks": [
             {"category": "📚 학습", "items": ["심화 과목 집중 학습", "2회독 완료", "모의고사 1회 응시"]},
             {"category": "🤝 스터디", "items": ["스터디 그룹 운영", "선배 인터뷰 · 합격 전략 수집"]},
         ]},
        {"title": "실전 문제 풀이", "checkpoint": "합격권 성적 · 원서 접수",
         "tasks": [
             {"category": "📚 학습", "items": ["기출 5개년 집중 풀이", "취약 파트 집중 보완", "원서 접수"]},
             {"category": "📝 취준", "items": ["희망 병원/의료기관 리서치", "취업 공고 파악"]},
         ]},
        {"title": "시험 마무리 · 이력서", "checkpoint": "시험 응시 · 이력서 완성",
         "tasks": [
             {"category": "📚 학습", "items": ["최종 마무리 정리", "시험 응시"]},
             {"category": "📝 취준", "items": ["이력서 · 자기소개서 완성", "희망 기관 목록 정리"]},
         ]},
        {"title": "취업 활동", "checkpoint": "면접 통과 · 최종 입사",
         "tasks": [
             {"category": "🎯 지원", "items": ["병원/의료기관 적극 지원", "면접 예상 질문 준비", "실습 경험 어필 전략"]},
             {"category": "💰 복지", "items": ["취업성공패키지 연계 확인"]},
         ]},
    ],
    "1년": [
        {"title": "기반 다지기", "checkpoint": "수당 신청 · 학습 계획 수립",
         "tasks": [{"category": "📋 행정", "items": ["구직촉진수당 신청", "내일배움카드 신청", "워크넷 등록"]}, {"category": "📚 준비", "items": ["자격증/국가고시 전략 수립", "교재 구입", "학습 루틴 확립"]}]},
        {"title": "기초 이론", "checkpoint": "기초 교재 완독",
         "tasks": [{"category": "📚 학습", "items": ["기초 이론 완독", "개념 노트 정리"]}, {"category": "💰 복지", "items": ["청년내일저축계좌 신청"]}]},
        {"title": "심화 학습", "checkpoint": "심화 과목 완료",
         "tasks": [{"category": "📚 학습", "items": ["심화 과목 학습", "관련 법규 암기", "최신 트렌드 파악"]}]},
        {"title": "문제 풀이", "checkpoint": "기출 5개년 완료",
         "tasks": [{"category": "📚 학습", "items": ["기출 5개년 풀이", "취약 파트 정리", "스터디 운영"]}]},
        {"title": "모의고사 집중", "checkpoint": "합격권 성적 달성",
         "tasks": [{"category": "📚 학습", "items": ["실전 모의고사 반복", "오답 분석"]}, {"category": "📝 취준", "items": ["희망 기관 리서치 시작"]}]},
        {"title": "원서 접수", "checkpoint": "원서 접수 완료",
         "tasks": [{"category": "📚 학습", "items": ["최종 마무리", "원서 접수"]}, {"category": "📝 취준", "items": ["이력서 초안 작성"]}]},
        {"title": "시험 응시", "checkpoint": "시험 완료",
         "tasks": [{"category": "🎯 시험", "items": ["시험 응시", "결과 확인"]}]},
        {"title": "취업 준비", "checkpoint": "이력서 완성 · 지원 시작",
         "tasks": [{"category": "📝 취준", "items": ["이력서 · 자소서 완성", "지원 시작", "면접 준비"]}]},
        {"title": "면접 집중", "checkpoint": "면접 3곳 이상",
         "tasks": [{"category": "🎯 면접", "items": ["면접 예상 질문 정리", "모의 면접", "전문 용어 복습"]}]},
        {"title": "최종 입사", "checkpoint": "합격 · 입사 준비",
         "tasks": [{"category": "🎉 입사", "items": ["최종 합격", "입사 서류 준비", "건강검진"]}]},
        {"title": "입사 적응", "checkpoint": "수습 완료",
         "tasks": [{"category": "🌱 성장", "items": ["수습 적응", "추가 자격증 계획"]}]},
        {"title": "전문성 강화", "checkpoint": "1년 완주",
         "tasks": [{"category": "🌱 성장", "items": ["관련 학회/세미나 참여", "멘토링 프로그램 참여"]}]},
    ],
}

# ── 건설/토목/건축 ─────────────────────────────────────────────────
CONSTRUCTION = {
    "3개월": [
        {"title": "기반 다지기", "checkpoint": "자격증 선택 · 수당 신청",
         "tasks": [
             {"category": "📋 행정", "items": ["구직촉진수당 신청", "내일배움카드 신청", "워크넷 등록"]},
             {"category": "📚 준비", "items": ["목표 자격증 선택 (건설기사·토목기사·건축기사 등)", "시험 일정 확인", "기출문제 분석"]},
         ]},
        {"title": "필기 집중", "checkpoint": "필기 1회독 · 모의고사 응시",
         "tasks": [
             {"category": "📚 학습", "items": ["필기 교재 학습", "과목별 핵심 공식 암기", "기출문제 반복 풀이"]},
             {"category": "💰 복지", "items": ["청년내일저축계좌 신청"]},
         ]},
        {"title": "필기 합격 · 실기 준비", "checkpoint": "필기 합격 · 실기 접수",
         "tasks": [
             {"category": "📚 학습", "items": ["필기 응시 · 합격 확인", "실기 교재 시작", "현장 실습 정보 수집"]},
             {"category": "📝 취준", "items": ["건설사/시공사 채용 공고 파악"]},
         ]},
    ],
    "6개월": [
        {"title": "기반 다지기", "checkpoint": "자격증 전략 수립 · 수당 신청",
         "tasks": [
             {"category": "📋 행정", "items": ["구직촉진수당 신청", "내일배움카드 신청", "워크넷 등록"]},
             {"category": "📚 준비", "items": ["목표 자격증 선택", "시험 일정 파악", "필기 교재 구입"]},
         ]},
        {"title": "필기 기초", "checkpoint": "핵심 과목 1회독",
         "tasks": [
             {"category": "📚 학습", "items": ["과목별 기초 이론 학습", "공식·법규 암기 시작"]},
             {"category": "💰 복지", "items": ["청년내일저축계좌 신청"]},
         ]},
        {"title": "필기 심화", "checkpoint": "기출 5개년 완료 · 원서 접수",
         "tasks": [
             {"category": "📚 학습", "items": ["기출문제 5개년 풀이", "취약 과목 집중 보완", "원서 접수"]},
         ]},
        {"title": "필기 합격 · 실기 시작", "checkpoint": "필기 합격 · 실기 교재 시작",
         "tasks": [
             {"category": "📚 학습", "items": ["필기 응시", "실기 교재 학습 시작", "도면 읽기 연습"]},
             {"category": "📝 취준", "items": ["건설/시공 관련 기업 리서치"]},
         ]},
        {"title": "실기 집중 · 현장 경험", "checkpoint": "실기 준비 완료 · 현장 경험 1회",
         "tasks": [
             {"category": "📚 학습", "items": ["실기 집중 훈련", "현장 실습 or 인턴 지원"]},
             {"category": "📝 취준", "items": ["이력서 작성", "자격증 취득 예정 명시"]},
         ]},
        {"title": "실기 합격 · 취업", "checkpoint": "자격증 취득 · 취업 활동",
         "tasks": [
             {"category": "🎯 목표", "items": ["실기 응시 · 합격", "건설사/공공기관 적극 지원", "면접 준비"]},
             {"category": "💰 복지", "items": ["취업성공패키지 연계"]},
         ]},
    ],
    "1년": [
        {"title": "기반 다지기", "checkpoint": "자격증 로드맵 수립",
         "tasks": [{"category": "📋 행정", "items": ["구직촉진수당 신청", "내일배움카드 신청"]}, {"category": "📚 준비", "items": ["목표 자격증 2개 선택", "학습 계획 수립"]}]},
        {"title": "1차 자격증 필기", "checkpoint": "1차 필기 합격",
         "tasks": [{"category": "📚 학습", "items": ["필기 교재 학습", "기출 반복 풀이", "원서 접수"]}, {"category": "💰 복지", "items": ["청년내일저축계좌 신청"]}]},
        {"title": "1차 자격증 실기", "checkpoint": "1차 자격증 취득",
         "tasks": [{"category": "📚 학습", "items": ["실기 집중 훈련", "도면·계산 연습", "실기 합격"]}]},
        {"title": "현장 경험 쌓기", "checkpoint": "현장 실습/인턴 완료",
         "tasks": [{"category": "🛠️ 경험", "items": ["인턴·현장 실습 지원", "현장 실무 경험", "포트폴리오 축적"]}]},
        {"title": "2차 자격증 준비", "checkpoint": "2차 자격증 필기 시작",
         "tasks": [{"category": "📚 학습", "items": ["2차 자격증 필기 학습", "기출 풀이"]}]},
        {"title": "2차 자격증 취득", "checkpoint": "2차 자격증 취득",
         "tasks": [{"category": "📚 학습", "items": ["실기 완료", "자격증 취득"]}]},
        {"title": "취업 준비", "checkpoint": "이력서 완성 · 지원 시작",
         "tasks": [{"category": "📝 취준", "items": ["이력서·자소서 완성", "건설사/공공기관 지원 시작"]}]},
        {"title": "면접 집중", "checkpoint": "면접 3곳 이상",
         "tasks": [{"category": "🎯 면접", "items": ["면접 예상 질문 준비", "현장 경험 어필 전략", "모의 면접"]}]},
        {"title": "최종 취업", "checkpoint": "합격 · 입사",
         "tasks": [{"category": "🎉 입사", "items": ["최종 합격", "입사 서류 준비"]}]},
        {"title": "현장 적응", "checkpoint": "수습 완료",
         "tasks": [{"category": "🌱 성장", "items": ["현장 업무 적응", "추가 자격증 계획"]}]},
        {"title": "전문성 강화 1", "checkpoint": "전문 기술 향상",
         "tasks": [{"category": "🌱 성장", "items": ["전문 기술 향상", "학회·세미나 참여"]}]},
        {"title": "전문성 강화 2", "checkpoint": "1년 완주",
         "tasks": [{"category": "🌱 성장", "items": ["팀 내 역할 확대", "장기 경력 계획 수립"]}]},
    ],
}

# ── 회계/세무/금융/재무 ────────────────────────────────────────────
FINANCE = {
    "3개월": [
        {"title": "기반 다지기", "checkpoint": "목표 자격증 선택 · 수당 신청",
         "tasks": [
             {"category": "📋 행정", "items": ["구직촉진수당 신청", "내일배움카드 신청", "워크넷 등록"]},
             {"category": "📚 준비", "items": ["목표 자격증 선택 (전산세무·회계·CFA 등)", "시험 일정 파악", "교재 구입"]},
         ]},
        {"title": "자격증 집중 학습", "checkpoint": "교재 1회독 · 모의고사 응시",
         "tasks": [
             {"category": "📚 학습", "items": ["회계 원리 / 세무 기초 학습", "기출문제 풀이", "계산 문제 반복"]},
             {"category": "💰 복지", "items": ["청년내일저축계좌 신청"]},
         ]},
        {"title": "자격증 취득 · 취업", "checkpoint": "자격증 취득 · 지원 시작",
         "tasks": [
             {"category": "📚 학습", "items": ["실전 문제 집중", "시험 응시 · 합격"]},
             {"category": "📝 취준", "items": ["이력서 완성", "회계법인/기업 재무팀 지원 시작"]},
         ]},
    ],
    "6개월": [
        {"title": "기반 다지기", "checkpoint": "자격증 전략 수립 · 수당 신청",
         "tasks": [
             {"category": "📋 행정", "items": ["구직촉진수당 신청", "내일배움카드 신청", "워크넷 등록"]},
             {"category": "📚 준비", "items": ["목표 자격증 선택 (전산세무 1·2급, 세무사, 공인회계사 등)", "시험 일정 파악", "교재 구입"]},
         ]},
        {"title": "회계 기초 정복", "checkpoint": "회계 원리 완전 이해",
         "tasks": [
             {"category": "📚 학습", "items": ["회계 원리 학습", "분개·결산 연습", "재무제표 이해"]},
             {"category": "💰 복지", "items": ["청년내일저축계좌 신청"]},
         ]},
        {"title": "세무·금융 심화", "checkpoint": "세무 기초 완료 · 모의고사",
         "tasks": [
             {"category": "📚 학습", "items": ["세무 관련 법규 학습", "실전 문제 풀이", "모의고사 응시"]},
         ]},
        {"title": "자격증 취득", "checkpoint": "1차 자격증 합격",
         "tasks": [
             {"category": "📚 학습", "items": ["실전 집중 훈련", "원서 접수 · 시험 응시", "합격 확인"]},
             {"category": "📝 취준", "items": ["회계법인/기업 채용 공고 파악"]},
         ]},
        {"title": "Excel·ERP 실무", "checkpoint": "실무 툴 역량 확보",
         "tasks": [
             {"category": "📚 학습", "items": ["Excel 회계 실무 (VLOOKUP·피벗)", "ERP 기초 (SAP·더존 등)", "실무 사례 분석"]},
             {"category": "📝 취준", "items": ["이력서 · 자소서 완성"]},
         ]},
        {"title": "취업 활동", "checkpoint": "서류 통과 3곳 이상",
         "tasks": [
             {"category": "🎯 지원", "items": ["회계법인·세무법인·기업 재무팀 지원", "면접 예상 질문 준비", "숫자 감각 면접 대비"]},
             {"category": "💰 복지", "items": ["취업성공패키지 연계"]},
         ]},
    ],
    "1년": [
        {"title": "기반 다지기", "checkpoint": "자격증 로드맵 수립",
         "tasks": [{"category": "📋 행정", "items": ["구직촉진수당 신청", "내일배움카드 신청"]}, {"category": "📚 준비", "items": ["자격증 단계별 로드맵 수립", "교재 구입"]}]},
        {"title": "회계 기초", "checkpoint": "회계 원리 완료",
         "tasks": [{"category": "📚 학습", "items": ["회계 원리 완독", "분개 연습"]}, {"category": "💰 복지", "items": ["청년내일저축계좌 신청"]}]},
        {"title": "1차 자격증 준비", "checkpoint": "전산세무/회계 자격증 취득",
         "tasks": [{"category": "📚 학습", "items": ["전산세무·회계 집중 학습", "기출 풀이", "시험 응시"]}]},
        {"title": "세무 심화", "checkpoint": "세무 심화 완료",
         "tasks": [{"category": "📚 학습", "items": ["세무 관련 법규 심화", "부가가치세·소득세 학습"]}]},
        {"title": "2차 자격증 준비", "checkpoint": "세무사/CPA 1차 준비",
         "tasks": [{"category": "📚 학습", "items": ["고급 자격증 필기 준비", "스터디 그룹 운영"]}]},
        {"title": "실무 스킬", "checkpoint": "Excel·ERP 역량 확보",
         "tasks": [{"category": "📚 학습", "items": ["Excel 실무 고급", "ERP 학습 (더존·SAP)"]}]},
        {"title": "인턴 경험", "checkpoint": "인턴/실습 완료",
         "tasks": [{"category": "🛠️ 경험", "items": ["회계법인·기업 인턴 지원", "실무 경험 축적"]}]},
        {"title": "취업 준비", "checkpoint": "이력서 완성 · 지원 시작",
         "tasks": [{"category": "📝 취준", "items": ["이력서·자소서 완성", "지원 시작"]}]},
        {"title": "면접 집중", "checkpoint": "면접 3곳 이상",
         "tasks": [{"category": "🎯 면접", "items": ["재무·회계 면접 준비", "숫자·사례 문제 연습"]}]},
        {"title": "최종 취업", "checkpoint": "합격 · 입사",
         "tasks": [{"category": "🎉 입사", "items": ["최종 합격", "입사 서류 준비"]}]},
        {"title": "실무 적응", "checkpoint": "수습 완료",
         "tasks": [{"category": "🌱 성장", "items": ["실무 적응", "추가 자격증 계획"]}]},
        {"title": "전문성 강화", "checkpoint": "1년 완주",
         "tasks": [{"category": "🌱 성장", "items": ["세무사/CPA 계속 준비", "전문가 네트워크 구축"]}]},
    ],
}

# ── 교육/교사/강사 ────────────────────────────────────────────────
EDUCATION = {
    "3개월": [
        {"title": "방향 설정", "checkpoint": "임용 vs 사립/학원 방향 확정",
         "tasks": [
             {"category": "📋 행정", "items": ["구직촉진수당 신청", "내일배움카드 신청", "워크넷 등록"]},
             {"category": "📚 준비", "items": ["임용고시 vs 사립·학원 취업 방향 확정", "시험 일정/채용 공고 파악", "학습 계획 수립"]},
         ]},
        {"title": "전공 & 교육학 학습", "checkpoint": "전공·교육학 1회독",
         "tasks": [
             {"category": "📚 학습", "items": ["전공 핵심 내용 정리", "교육학 이론 학습", "기출문제 분석"]},
             {"category": "💰 복지", "items": ["청년내일저축계좌 신청"]},
         ]},
        {"title": "실전 준비 · 지원", "checkpoint": "모의고사 응시 · 지원 시작",
         "tasks": [
             {"category": "📚 학습", "items": ["실전 문제 풀이", "논술·면접 준비"]},
             {"category": "📝 취준", "items": ["이력서 완성", "학교/학원 지원 시작"]},
         ]},
    ],
    "6개월": [
        {"title": "방향 설정 · 기반", "checkpoint": "진로 방향 확정 · 수당 신청",
         "tasks": [
             {"category": "📋 행정", "items": ["구직촉진수당 신청", "내일배움카드 신청", "워크넷 등록"]},
             {"category": "📚 준비", "items": ["임용고시 vs 사립·학원 방향 확정", "시험 일정 파악", "교재 구입"]},
         ]},
        {"title": "전공 기초 정복", "checkpoint": "전공 1회독 완료",
         "tasks": [
             {"category": "📚 학습", "items": ["전공 핵심 내용 1회독", "개념 정리 노트", "기출 경향 분석"]},
             {"category": "💰 복지", "items": ["청년내일저축계좌 신청"]},
         ]},
        {"title": "교육학 & 전공 심화", "checkpoint": "교육학 완료 · 모의고사",
         "tasks": [
             {"category": "📚 학습", "items": ["교육학 이론 완료 (교육심리·교육과정·교육행정)", "전공 심화 학습", "모의고사 응시"]},
         ]},
        {"title": "실전 반복 · 논술", "checkpoint": "논술 5회 이상 작성",
         "tasks": [
             {"category": "📚 학습", "items": ["실전 문제 풀이 집중", "논술 작성 훈련", "스터디 그룹 운영"]},
             {"category": "📝 취준", "items": ["학원·사립학교 채용 공고 파악"]},
         ]},
        {"title": "면접 준비 · 지원", "checkpoint": "면접 준비 완료 · 지원 시작",
         "tasks": [
             {"category": "📚 학습", "items": ["면접 예상 질문 정리", "수업 시연 연습", "교육 철학 정리"]},
             {"category": "📝 취준", "items": ["이력서·자소서 완성", "적극 지원 시작"]},
         ]},
        {"title": "최종 취업", "checkpoint": "합격 · 입사",
         "tasks": [
             {"category": "🎯 면접", "items": ["최종 면접 응시", "수업 시연 최종 연습"]},
             {"category": "💰 복지", "items": ["취업성공패키지 마무리"]},
         ]},
    ],
    "1년": [
        {"title": "방향 설정", "checkpoint": "진로 방향 확정",
         "tasks": [{"category": "📋 행정", "items": ["구직촉진수당 신청", "내일배움카드 신청"]}, {"category": "📚 준비", "items": ["임용 vs 사립·학원 방향 확정", "시험 일정 파악"]}]},
        {"title": "전공 기초", "checkpoint": "전공 1회독",
         "tasks": [{"category": "📚 학습", "items": ["전공 교재 1회독", "핵심 개념 정리"]}, {"category": "💰 복지", "items": ["청년내일저축계좌 신청"]}]},
        {"title": "교육학 학습", "checkpoint": "교육학 완료",
         "tasks": [{"category": "📚 학습", "items": ["교육심리·교육과정·교육행정", "교육학 기출 분석"]}]},
        {"title": "전공 심화", "checkpoint": "전공 2회독",
         "tasks": [{"category": "📚 학습", "items": ["전공 심화 학습", "전공 스터디 운영"]}]},
        {"title": "실전 문제 풀이", "checkpoint": "기출 5개년 완료",
         "tasks": [{"category": "📚 학습", "items": ["기출 5개년 풀이", "취약 파트 집중"]}]},
        {"title": "논술 집중", "checkpoint": "논술 10회 이상",
         "tasks": [{"category": "📚 학습", "items": ["논술 집중 훈련", "첨삭 받기"]}]},
        {"title": "모의고사 집중", "checkpoint": "합격권 성적",
         "tasks": [{"category": "📚 학습", "items": ["실전 모의고사 반복", "오답 분석"]}, {"category": "📝 취준", "items": ["학원·사립학교 공고 파악"]}]},
        {"title": "수업 시연 준비", "checkpoint": "수업 시연 5회 이상",
         "tasks": [{"category": "📚 학습", "items": ["수업 시연 연습", "교육 철학 정리"]}]},
        {"title": "지원 시작", "checkpoint": "이력서 완성 · 지원 10곳",
         "tasks": [{"category": "📝 취준", "items": ["이력서·자소서 완성", "지원 시작"]}]},
        {"title": "면접 집중", "checkpoint": "면접 5곳 이상",
         "tasks": [{"category": "🎯 면접", "items": ["면접 예상 질문", "수업 시연 최종"]}]},
        {"title": "최종 취업", "checkpoint": "합격",
         "tasks": [{"category": "🎉 입사", "items": ["합격 확인", "입사 준비"]}]},
        {"title": "교직 적응", "checkpoint": "1년 완주",
         "tasks": [{"category": "🌱 성장", "items": ["교직 적응", "추가 연수 계획"]}]},
    ],
}

# ── 일반 직군 (영업/인사/물류/요리/미용/체육 등) ──────────────────
GENERAL_BUSINESS = {
    "3개월": [
        {"title": "방향 설정 · 기반", "checkpoint": "목표 명확화 · 수당 신청",
         "tasks": [
             {"category": "📋 행정", "items": ["구직촉진수당 신청", "내일배움카드 신청", "워크넷 등록"]},
             {"category": "📚 준비", "items": ["관련 자격증·자격 조건 조사", "채용 공고 분석 (5~10곳)", "업계 현황 파악"]},
         ]},
        {"title": "역량 강화", "checkpoint": "핵심 스킬 1개 습득",
         "tasks": [
             {"category": "📚 학습", "items": ["직무 관련 온라인 강의 수강 (내일배움카드 활용)", "관련 자격증 준비", "업계 용어·트렌드 학습"]},
             {"category": "💰 복지", "items": ["청년내일저축계좌 신청"]},
         ]},
        {"title": "취업 활동", "checkpoint": "서류 통과 2곳 이상",
         "tasks": [
             {"category": "📝 취준", "items": ["이력서·자기소개서 완성", "포트폴리오/경험 정리"]},
             {"category": "🎯 지원", "items": ["관련 기업 적극 지원", "면접 예상 질문 준비"]},
         ]},
    ],
    "6개월": [
        {"title": "방향 설정", "checkpoint": "직무 목표 명확화 · 수당 신청",
         "tasks": [
             {"category": "📋 행정", "items": ["구직촉진수당 신청", "내일배움카드 신청", "워크넷 등록"]},
             {"category": "📚 준비", "items": ["목표 직무 구체화", "관련 자격증 조사", "채용 공고 10곳 분석"]},
         ]},
        {"title": "기초 역량 쌓기", "checkpoint": "관련 강의 수강 완료",
         "tasks": [
             {"category": "📚 학습", "items": ["직무 기초 강의 수강", "업계 트렌드 파악", "관련 커뮤니티 가입"]},
             {"category": "💰 복지", "items": ["청년내일저축계좌 신청"]},
         ]},
        {"title": "자격증 준비", "checkpoint": "1차 자격증 취득",
         "tasks": [
             {"category": "📚 학습", "items": ["직무 관련 자격증 집중 학습", "시험 응시 · 합격"]},
         ]},
        {"title": "실무 경험 쌓기", "checkpoint": "인턴/프로젝트 1회",
         "tasks": [
             {"category": "🛠️ 경험", "items": ["인턴·아르바이트 지원", "자원봉사·사이드 프로젝트 참여", "업무 포트폴리오 작성"]},
         ]},
        {"title": "취업 준비", "checkpoint": "이력서 완성 · 지원 시작",
         "tasks": [
             {"category": "📝 취준", "items": ["이력서·자소서 완성", "포트폴리오 정리", "관련 기업 30곳 리스트업"]},
             {"category": "🎯 지원", "items": ["적극 지원 시작"]},
         ]},
        {"title": "면접 집중 · 취업", "checkpoint": "최종 합격",
         "tasks": [
             {"category": "🎯 면접", "items": ["면접 예상 질문 50개 준비", "모의 면접 연습", "직무 관련 사례 준비"]},
             {"category": "💰 복지", "items": ["취업성공패키지 연계"]},
         ]},
    ],
    "1년": [
        {"title": "방향 설정", "checkpoint": "목표 직무 확정",
         "tasks": [{"category": "📋 행정", "items": ["구직촉진수당 신청", "내일배움카드 신청"]}, {"category": "📚 준비", "items": ["목표 직무 확정", "업계 분석"]}]},
        {"title": "기초 역량", "checkpoint": "기초 강의 완료",
         "tasks": [{"category": "📚 학습", "items": ["직무 기초 강의", "트렌드 파악"]}, {"category": "💰 복지", "items": ["청년내일저축계좌 신청"]}]},
        {"title": "1차 자격증", "checkpoint": "자격증 취득",
         "tasks": [{"category": "📚 학습", "items": ["자격증 집중 학습", "시험 응시"]}]},
        {"title": "심화 학습", "checkpoint": "심화 역량 확보",
         "tasks": [{"category": "📚 학습", "items": ["직무 심화 학습", "케이스스터디 분석"]}]},
        {"title": "인턴/실습", "checkpoint": "인턴 완료",
         "tasks": [{"category": "🛠️ 경험", "items": ["인턴·아르바이트 지원", "실무 경험 축적"]}]},
        {"title": "2차 자격증", "checkpoint": "2차 자격증 취득",
         "tasks": [{"category": "📚 학습", "items": ["추가 자격증 취득"]}]},
        {"title": "포트폴리오", "checkpoint": "포트폴리오 완성",
         "tasks": [{"category": "🛠️ 작업", "items": ["업무 포트폴리오 완성", "경험 정리"]}]},
        {"title": "취업 준비", "checkpoint": "이력서 완성",
         "tasks": [{"category": "📝 취준", "items": ["이력서·자소서 완성", "지원 시작"]}]},
        {"title": "지원 집중", "checkpoint": "서류 10곳 이상",
         "tasks": [{"category": "🎯 지원", "items": ["30곳 이상 지원", "서류 피드백 반영"]}]},
        {"title": "면접 집중", "checkpoint": "면접 5곳 이상",
         "tasks": [{"category": "🎯 면접", "items": ["면접 예상 질문 준비", "모의 면접"]}]},
        {"title": "최종 취업", "checkpoint": "합격",
         "tasks": [{"category": "🎉 입사", "items": ["최종 합격", "입사 준비"]}]},
        {"title": "직무 적응", "checkpoint": "1년 완주",
         "tasks": [{"category": "🌱 성장", "items": ["업무 적응", "장기 경력 계획"]}]},
    ],
}

JOB_TEMPLATES = {
    "개발자":   DEVELOPER,
    "디자이너": DESIGNER,
    "마케터":   MARKETER,
    "기획자":   PLANNER,
    "공무원":   CIVIL_SERVANT,
    "프리랜서": FREELANCER,
    "유튜버":   YOUTUBER,
    "의료":     HEALTHCARE,
    "건설":     CONSTRUCTION,
    "회계":     FINANCE,
    "교육":     EDUCATION,
    "일반":     GENERAL_BUSINESS,
    "기타":     GENERAL_BUSINESS,
}

JOB_ALIASES = {
    # 개발자 계열
    "개발": "개발자", "프로그래머": "개발자", "엔지니어": "개발자", "코딩": "개발자",
    "소프트웨어": "개발자", "데이터": "개발자", "ai": "개발자", "머신러닝": "개발자",
    # 디자이너 계열
    "디자인": "디자이너", "ux": "디자이너", "ui": "디자이너", "그래픽": "디자이너",
    "일러스트": "디자이너", "웹디자인": "디자이너",
    # 마케터 계열
    "마케팅": "마케터", "광고": "마케터", "브랜드": "마케터", "sns": "마케터", "콘텐츠": "마케터",
    # 기획자 계열
    "기획": "기획자", "pm": "기획자", "po": "기획자", "서비스기획": "기획자",
    # 공무원 계열
    "공무원": "공무원", "공시": "공무원", "행정": "공무원", "국가직": "공무원", "지방직": "공무원",
    # 프리랜서 계열
    "프리랜서": "프리랜서", "freelance": "프리랜서", "번역": "프리랜서",
    # 유튜버 계열
    "유튜버": "유튜버", "유튜브": "유튜버", "크리에이터": "유튜버", "youtuber": "유튜버", "방송": "유튜버",
    # 의료/보건 계열
    "간호": "의료", "간호사": "의료", "의료": "의료", "의사": "의료", "약사": "의료",
    "물리치료": "의료", "임상": "의료", "방사선": "의료", "치위생": "의료",
    # 건설/토목 계열
    "건설": "건설", "토목": "건설", "건축": "건설", "시공": "건설", "인테리어": "건설",
    "설계": "건설", "감리": "건설",
    # 회계/세무/금융 계열
    "회계": "회계", "세무": "회계", "경리": "회계", "재무": "회계", "금융": "회계",
    "은행": "회계", "증권": "회계", "보험": "회계", "cpa": "회계",
    # 법무/법률 계열
    "법무": "일반", "법률": "일반", "변호사": "일반", "법원": "일반", "법학": "일반",
    # 교육 계열
    "교사": "교육", "교육": "교육", "강사": "교육", "선생": "교육", "임용": "교육",
    "학원": "교육", "과외": "교육",
    # 영업/인사/경영 계열
    "영업": "일반", "세일즈": "일반", "sales": "일반",
    "hr": "일반", "인사": "일반", "경영": "일반", "경영지원": "일반",
    # 물류/유통/무역 계열
    "물류": "일반", "유통": "일반", "무역": "일반", "수출": "일반", "수입": "일반",
    # 요리/식품 계열
    "요리": "일반", "쉐프": "일반", "조리": "일반", "식품": "일반", "제과": "일반",
    # 미용 계열
    "미용": "일반", "헤어": "일반", "네일": "일반", "피부": "일반",
    # 체육/스포츠 계열
    "체육": "일반", "스포츠": "일반", "트레이너": "일반", "pt": "일반", "운동": "일반",
}


def resolve_job(job: str) -> str:
    j = job.strip().lower()
    for alias, canon in JOB_ALIASES.items():
        if alias in j:
            return canon
    # JOB_TEMPLATES에 있는 직군이면 그대로
    if job.strip() in JOB_TEMPLATES:
        return job.strip()
    return "기타"  # 기본값 — 개발자 하드코딩 방지


def resolve_period(period: str) -> str:
    p = period.strip()
    if "3" in p:
        return "3개월"
    if "1년" in p or "12" in p:
        return "1년"
    return "6개월"


def build_roadmap(job: str, period: str, user_cats: list) -> dict:
    canon_job    = resolve_job(job)
    canon_period = resolve_period(period)

    template = JOB_TEMPLATES.get(canon_job, DEVELOPER)
    steps    = template.get(canon_period, template["6개월"])

    # 첫 번째 행정 태스크를 사용자 카테고리에 맞게 조정
    welfare_key = next((c for c in user_cats if c in WELFARE_TASKS), "default")
    admin_items = WELFARE_TASKS[welfare_key]

    months = []
    for i, step in enumerate(steps):
        month_num = i + 1
        inc_text, inc_amt = INCOME_BY_MONTH.get(month_num, ("확인 필요", 0))
        tasks = []
        for t in step["tasks"]:
            # 첫 번째 행정 태스크는 복지 종류에 맞게 교체
            if t["category"].endswith("행정") and month_num == 1:
                tasks.append({"category": t["category"], "items": admin_items})
            else:
                tasks.append(t)
        months.append({
            "month":      month_num,
            "title":      step["title"],
            "color":      COLORS[i % len(COLORS)],
            "income":     inc_text,
            "incomeAmt":  inc_amt,
            "checkpoint": step["checkpoint"],
            "tasks":      tasks,
        })

    return {"months": months}
