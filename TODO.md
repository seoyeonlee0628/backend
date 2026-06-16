# 복지체크 작업 현황

## 지금 하고 있는 것
- [ ] 로드맵 생성 오류 수정 (Python `/roadmap` 엔드포인트 연결 문제)
- [ ] 다크모드 글씨 안 보이는 문제 수정

---

## 해야 할 것

### 버그 / UI
- [ ] 로딩 화면 최소 표시 시간 추가 (로컬모델이 너무 빨라서 로딩이 안 보임)
- [ ] 다크모드 텍스트 가시성 문제 (어떤 영역인지 특정 필요)
- [ ] 로드맵 생성 실패 문제 해결

### API 키 발급 필요 (data.go.kr)
- [ ] **워크넷 채용정보** — 검색어: `워크넷 채용정보`
- [ ] **HRD-Net 훈련과정** — 검색어: `직업능력개발훈련과정`
- [ ] **복지로 중앙부처** — 현재 키로 500 에러, 별도 승인 필요할 수 있음

### 기능
- [ ] 추천 서비스 개수 사용자 설정 가능하게 (현재 10개 고정)
- [ ] 진단 히스토리 UI 개선
- [ ] 워크넷·HRD-Net API 키 발급 후 프론트에서 채용공고·훈련과정 탭 추가

---

## 완료된 것

### 버그 수정
- [x] `CommentService.toggleLike()` — 항상 +1만 하던 거 실제 토글로 수정
- [x] `CommentController` — 인증 없이 댓글 좋아요 무한 증가 가능했던 보안 문제
- [x] `DataInitializer` — admin 비밀번호 하드코딩 → 환경변수로 분리
- [x] `SecurityConfig` — `alwaysRemember(true)` 제거
- [x] `PostService` — 읽기 메서드에 `@Transactional(readOnly=true)` 추가
- [x] `PostController` — 좋아요/북마크 try-catch 누락 추가
- [x] `CommentLike` 엔티티 + 레포지토리 신규 생성
- [x] YAML 중복 키 오류 수정
- [x] MySQL `allowPublicKeyRetrieval` 추가

### 환경변수 분리
- [x] Gemini API 키 → `${GEMINI_API_KEY}`
- [x] 복지로 API 키 → `${WELFARE_API_KEY}`
- [x] Admin 초기 비밀번호 → `${ADMIN_INITIAL_PASSWORD}`
- [x] `.env` 파일 생성, `.gitignore` 추가
- [x] Spring Boot `.env` 자동 로드 (`spring-dotenv` 의존성)
- [x] Python 서버 `.env` 자동 로드 (`python-dotenv`)

### 로컬 모델
- [x] `train.py` — TF-IDF + 로지스틱 회귀 분류기 학습
- [x] `server.py` — FastAPI 서버 (`/predict`, `/roadmap`, `/health`)
- [x] `roadmap_templates.py` — 직군별(개발자/디자이너/마케터/기획자) × 기간별 로드맵 템플릿
- [x] `LocalModelService.java` — Spring → Python 서버 연결 (`/predict`, `/roadmap`)
- [x] `DiagnosisController` — 진단·로드맵 모두 Gemini → LocalModel로 교체
- [x] 추천 서비스 5개 → 10개로 확대
- [x] 캐시 서비스 250개 → 500개로 확대 (페이지 5 → 10)
- [x] `reason` 필드 — 서비스 설명 잘라붙이기 → 사용자 상황 연결한 개인화 문장
- [x] `parse` 필드 — 카테고리 나열 → 자연어 요약

### API 연동
- [x] 복지로 지자체 API — 정상 작동 확인
- [x] `WelfareController` — `/jobs`, `/courses` 엔드포인트 추가 (키 발급 시 활성화)
- [x] 복지로 중앙부처 URL 수정 (500 에러 중, 키 승인 대기)

---

## 현재 실행 상태
| 서버 | 포트 | 상태 |
|---|---|---|
| Spring Boot | 8080 | ✅ 실행 중 |
| Python ML 서버 | 8000 | ✅ 실행 중 (서비스 500개 캐시) |
| MySQL | 3306 | ✅ 연결됨 |
