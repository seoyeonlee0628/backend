# 복지체크 - 현재 구현된 기능 목록

> 최종 정리: 2026-06-02

---

## 1. 인증 / 회원 관리 (`/api/auth`)

| 기능 | 메서드 | 엔드포인트 |
|------|--------|-----------|
| 회원가입 | POST | `/api/auth/register` |
| 중복 체크 (아이디/닉네임 등) | GET | `/api/auth/check?field=&value=` |
| 현재 로그인 유저 정보 조회 | GET | `/api/auth/me` |
| 닉네임 변경 | PUT | `/api/auth/nickname` |
| 비밀번호 변경 (현재 비번 확인 후 변경) | PUT | `/api/auth/password` |

- Spring Security 기반 세션 인증
- 역할: `USER`, `ADMIN` (enum)
- 정지(banned) 상태 관리

---

## 2. 복지 자가진단 (`/api/diagnosis`)

| 기능 | 메서드 | 엔드포인트 |
|------|--------|-----------|
| AI 복지 진단 실행 | POST | `/api/diagnosis` |
| 진단 히스토리 조회 (최근 5건) | GET | `/api/diagnosis/history` |
| 취업 로드맵 생성 | POST | `/api/diagnosis/roadmap` |

- Python ML 서버(`localhost:8000`)와 연동
- 비로그인 상태에서도 진단 가능 (히스토리 저장은 로그인 시만)
- 진단 결과: 카테고리 분석 문구, 해당 복지서비스 목록, 지원금액/기간/신청URL

---

## 3. 복지 서비스 API 조회 (`/api/welfare`)

| 기능 | 메서드 | 엔드포인트 |
|------|--------|-----------|
| 중앙부처 복지서비스 목록 | GET | `/api/welfare/central?page=&size=` |
| 지자체 복지서비스 목록 | GET | `/api/welfare/local?region=&page=&size=` |
| 워크넷 채용공고 | GET | `/api/welfare/jobs?job=&region=&page=&size=` |
| HRD-Net 훈련과정 | GET | `/api/welfare/courses?job=&region=&page=&size=` |
| 복지서비스 상세 조회 | GET | `/api/welfare/{serviceId}` |

---

## 4. 커뮤니티 게시판 (`/api/posts`)

| 기능 | 메서드 | 엔드포인트 |
|------|--------|-----------|
| 게시글 목록 (페이지네이션, boardId 필터) | GET | `/api/posts?boardId=&page=&size=` |
| 게시글 상세 | GET | `/api/posts/{id}` |
| 게시글 작성 | POST | `/api/posts` |
| 게시글 수정 | PUT | `/api/posts/{id}` |
| 게시글 삭제 | DELETE | `/api/posts/{id}` |
| 좋아요 토글 | POST | `/api/posts/{id}/like` |
| 북마크 토글 | POST | `/api/posts/{id}/bookmark` |
| 인기글 조회 | GET | `/api/posts/popular` |
| 내가 쓴 글 조회 | GET | `/api/posts/my` |
| 좋아요한 글 목록 | GET | `/api/posts/liked` |
| 북마크한 글 목록 | GET | `/api/posts/bookmarked` |

---

## 5. 댓글 (`/api/posts/{postId}/comments`)

| 기능 | 메서드 | 엔드포인트 |
|------|--------|-----------|
| 댓글 목록 조회 | GET | `/api/posts/{postId}/comments` |
| 댓글 작성 (대댓글: parentId 포함) | POST | `/api/posts/{postId}/comments` |
| 댓글 삭제 | DELETE | `/api/posts/{postId}/comments/{commentId}` |
| 댓글 좋아요 토글 | POST | `/api/posts/{postId}/comments/{commentId}/like` |

---

## 6. 위시리스트 (`/api/wish`)

| 기능 | 메서드 | 엔드포인트 |
|------|--------|-----------|
| 위시리스트 조회 | GET | `/api/wish` |
| 항목 추가 | POST | `/api/wish` |
| 항목 삭제 | DELETE | `/api/wish/{id}` |

---

## 7. 관리자 (`/api/admin`) — ADMIN 권한 전용

| 기능 | 메서드 | 엔드포인트 |
|------|--------|-----------|
| 전체 회원 목록 | GET | `/api/admin/users` |
| 회원 정지 / 해제 토글 | PUT | `/api/admin/users/{id}/ban` |
| 게시글 고정 / 해제 토글 | PUT | `/api/admin/posts/{id}/pin` |
| 게시글 강제 삭제 | DELETE | `/api/admin/posts/{id}` |
| 통계 (총 유저수, 총 게시글수) | GET | `/api/admin/stats` |

---

## 8. Python ML 서버 (FastAPI, `localhost:8000`)

| 기능 | 엔드포인트 |
|------|-----------|
| 복지서비스 추천 (카테고리 분류 → 서비스 랭킹) | `POST /predict` |
| 취업 로드맵 생성 | `POST /roadmap` |
| 서버 상태 / 캐시 서비스 수 확인 | `GET /health` |

**모델 구조**
- 알고리즘: TF-IDF (character n-gram) + OneVsRest 로지스틱 회귀 (multi-label)
- 카테고리 15개: 청년, 출산임신, 노인, 장애인, 아동보육, 청소년, 신혼부부, 한부모, 주거, 취업일자리, 의료건강, 보훈, 저소득, 다자녀, 자립
- 학습 데이터: `categories.py` 합성 데이터 (~180개)
- 실행 순서: `python train.py` → `python server.py` → Spring Boot

---

## 9. 프론트엔드 (SPA, Thymeleaf + Tailwind CSS)

- 단일 `index.html`에서 `goPage()` 함수로 SPA 방식 화면 전환
- 다크모드 지원 (`darkMode: 'class'`)
- 반응형 디자인 (모바일 대응)
- PDF 다운로드: jsPDF + html2canvas
- Spring Security CSRF 토큰 메타태그로 자동 처리
- 커뮤니티 알림 배지 (`notice-nav-badge`)

---

## 10. 주요 엔티티 관계

```
User ─┬─ Post ─── PostLike
      │        └─ Comment ─── CommentLike
      ├─ Bookmark (Post)
      ├─ WishItem
      └─ DiagnosisHistory
```
