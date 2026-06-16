# 복지체크 프론트엔드 리디자인 계획 (Green Edition)

> 작성일: 2026-06-02  
> 변경 대상 파일 3개: `main.css` / `index.html` / `app.js`

---

## 디자인 방향 요약

| 항목 | 현재 | 변경 후 |
|------|------|---------|
| 기본 테마 | 다크 (사이언 #06b6d4) | **라이트 아이보리** (#FFF9F4) |
| 메인 컬러 | 사이언 cyan | **프레시 그린** #36A86A |
| 강조 컬러 | cyan-400 (#22d3ee) | **딥 그린** #27905A |
| 포인트 컬러 | 없음 | 소프트 옐로우 #FFD580 |
| 텍스트 | 흰색 (#fafafa) | 다크 브라운 (#2D2926) |
| 다크모드 클래스 | `body.light-mode` | `body.dark-mode` |
| 폰트 | Pretendard (body only) | Pretendard + Plus Jakarta Sans |

---

## 컬러 팔레트

```
Primary:         #36A86A  — 프레시 그린
Primary Deep:    #27905A  — 딥 그린 (hover/강조)
Secondary:       #FFD580  — 소프트 옐로우
Accent (Sage):   #8FD3A8  — 라이트 세이지
Background:      #FFF9F4  — 아이보리 화이트
Card:            #FFFFFF  — 순백
Text Main:       #2D2926  — 다크 브라운
Text Sub:        #8A7E77  — 웜 그레이
Border:          #E6D9D0  — 웜 베이지 테두리

--- 다크모드 ---
Dark BG:         #1E1B18  — 다크 웜 브라운
Dark Card:       #2A2521
Dark Border:     #3D3631
Dark Text:       #F5EFE8
Dark Text Sub:   #B0A89F
```

---

## 1. main.css — 전체 재작성

### `:root` 변수 (라이트 아이보리 그린으로 교체)

```css
:root {
  --background: 30 100% 98%;        /* #FFF9F4 */
  --foreground: 20 12% 16%;         /* #2D2926 */
  --card: 0 0% 100%;                /* #FFFFFF */
  --card-foreground: 20 12% 16%;
  --border: 25 30% 87%;             /* #E6D9D0 */
  --input: 25 30% 87%;
  --primary: 149 52% 44%;           /* #36A86A */
  --primary-foreground: 0 0% 100%;
  --muted: 30 60% 96%;              /* #FBF4EE */
  --muted-foreground: 20 8% 51%;    /* #8A7E77 */
  --accent: 147 38% 69%;            /* #8FD3A8 */
  --accent-foreground: 20 12% 16%;
  --destructive: 0 84% 60%;
  --destructive-foreground: 0 0% 100%;
  --warning: 38 92% 50%;
  --warning-foreground: 0 0% 100%;
  --success: 149 52% 44%;
  --success-foreground: 0 0% 100%;
  --ring: 149 52% 44%;
  --radius: 0.5rem;
  --primary-color: #36A86A;
}
```

### 공통 컴포넌트 색상 변경 (하드코딩 부분)

| 현재 값 | 교체 값 | 설명 |
|---------|---------|------|
| `#0a0a0f` | `#FFF9F4` | 기본 배경 |
| `#16161e` | `#FFFFFF` | 카드 배경 |
| `#27272a` | `#E6D9D0` | 테두리/구분선 |
| `#a1a1aa` | `#8A7E77` | 서브 텍스트 |
| `#fafafa` | `#2D2926` | 메인 텍스트 |
| `#06b6d4` | `#36A86A` | 프라이머리 |
| `#22d3ee` | `#27905A` | 프라이머리 딥 |
| `rgba(6,182,212,...)` | `rgba(54,168,106,...)` | 프라이머리 알파 |

### gradient-text 변경

```css
/* 현재 */
.gradient-text {
  background: linear-gradient(135deg, #06b6d4, #22d3ee);
}

/* 변경 후 — 초록→옐로우 */
.gradient-text {
  background: linear-gradient(135deg, #36A86A, #FFD580);
}
```

### 로드맵 타임라인 라인 색상

```css
/* 현재 */
.tl-line { background: linear-gradient(to right, #1e3a4a, #0e7490, #06b6d4, #22d3ee, ...); }

/* 변경 후 */
.tl-line { background: linear-gradient(to right, #8FD3A8, #36A86A, #27905A, #FFD580, #27905A, #8FD3A8); }
```

### step-card / faq-item 스타일

```css
/* 현재 — 어두운 카드 */
.step-card { background: #16161e; border: 1px solid #27272a; }
.step-card:hover { border-color: rgba(6,182,212,.3); }
.step-example { background: #0f1a1c; border: 1px solid rgba(6,182,212,.15); }

/* 변경 후 — 밝은 카드 + 그린 hover */
.step-card { background: #FFFFFF; border: 1px solid #E6D9D0; border-radius: 1.375rem;
             box-shadow: 0 2px 8px rgba(45,41,38,.05); }
.step-card:hover { border-color: rgba(54,168,106,.35); box-shadow: 0 8px 24px rgba(54,168,106,.12); }
.step-example { background: #F5F0EB; border: 1px solid rgba(54,168,106,.2); color: #8A7E77; }
```

### benefit 탭 active 색상

```css
/* 변경 후 */
.benefit-tab { border: 1px solid #E6D9D0; }
.benefit-tab-0.active { background: #36A86A; color: #ffffff; border-color: #36A86A; }
```

### slider-arrow (슬라이더 버튼)

```css
/* 변경 후 — 흰 배경 + 그린 hover */
.slider-arrow { background: #FFFFFF; border: 1px solid #E6D9D0;
                box-shadow: 0 2px 8px rgba(45,41,38,.08); }
.slider-arrow:hover { background: #F5F0EB; border-color: rgba(54,168,106,.4); }
```

### `body.light-mode` → 전부 제거하고 `body.dark-mode` 로 교체

```css
/* 기존 light-mode 전체 제거 후, dark-mode로 교체 */
body.dark-mode {
  --background: 30 9% 11%;          /* #1E1B18 */
  --foreground: 30 40% 94%;         /* #F5EFE8 */
  --card: 20 9% 14%;                /* #2A2521 */
  --card-foreground: 30 40% 94%;
  --border: 20 9% 22%;              /* #3D3631 */
  --input: 20 9% 22%;
  --primary: 149 52% 44%;           /* #36A86A — 동일 유지 */
  --primary-foreground: 0 0% 100%;
  --muted: 20 9% 18%;               /* #332F2B */
  --muted-foreground: 25 12% 64%;   /* #B0A89F */
  background: #1E1B18 !important;
  color: #F5EFE8 !important;
}
/* 이후 모든 body.light-mode 규칙을 body.dark-mode 로 치환하되
   색상값도 다크 팔레트로 교체 */
```

### 폰트 설정 추가 (main.css)

```css
body {
  font-family: 'Pretendard', 'Plus Jakarta Sans', system-ui, sans-serif;
  line-height: 1.65;
}
h1, h2, h3, h4 {
  font-family: 'Plus Jakarta Sans', 'Pretendard', system-ui, sans-serif;
  letter-spacing: -0.03em;
}
```

---

## 2. index.html — 변경 목록

### `<head>` 폰트 링크 추가

```html
<!-- 기존 Tailwind CDN 위에 추가 -->
<link href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700&display=swap" rel="stylesheet">
```

### Tailwind config 업데이트

```js
tailwind.config = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
          hover: '#27905A',   // ← 추가
          deep: '#27905A',    // ← 추가
        },
        // ... 나머지 동일
      },
      fontFamily: {
        sans: ['Pretendard', 'system-ui', 'sans-serif'],       // ← 추가
        head: ['"Plus Jakarta Sans"', 'Pretendard', 'sans-serif'], // ← 추가
      }
    }
  }
}
```

### `to-cyan-400` 전체 치환 (replace_all)

| 현재 클래스 | 변경 후 |
|------------|---------|
| `from-primary to-cyan-400` | `from-primary to-[#27905A]` |
| `from-primary/50 to-cyan-400/50` | `from-primary/50 to-[#27905A]/50` |
| `bg-cyan-400` (테마 버튼) | `bg-[#36A86A]` |
| `ring-cyan-400` (테마 버튼) | `ring-[#36A86A]` |

> 대상 라인: 96, 133, 161, 199, 203, 480, 546, 565, 614, 670, 719, 743, 845, 1018, 1151, 1211 (총 ~16곳)

### 테마 컬러 기본값 변경 (테마 패널 기본 선택)

```html
<!-- 현재: 시안이 기본 선택 (ring-2 ring-cyan-400) -->
<button onclick="setThemeColor('#06b6d4','cyan')" class="... ring-2 ring-cyan-400">

<!-- 변경 후: 그린이 기본 선택 -->
<button onclick="setThemeColor('#36A86A','green')" class="... ring-2 ring-[#36A86A]">
```

### `color` input 기본값 변경

```html
<!-- 현재 -->
<input type="color" id="custom-color" value="#06b6d4" ...>

<!-- 변경 후 -->
<input type="color" id="custom-color" value="#36A86A" ...>
```

---

## 3. app.js — toggleDarkMode 수정

### 현재 코드 (2190~2197행)

```js
let isLightMode = false;   // 기본: 다크

function toggleDarkMode() {
  isLightMode = !isLightMode;
  document.body.classList.toggle('light-mode', isLightMode);
  document.getElementById('dark-icon').classList.toggle('hidden', isLightMode);
  document.getElementById('light-icon').classList.toggle('hidden', !isLightMode);
}
```

### 변경 후

```js
let isDarkMode = false;    // 기본: 라이트 (아이보리 그린)

function toggleDarkMode() {
  isDarkMode = !isDarkMode;
  document.body.classList.toggle('dark-mode', isDarkMode);
  // moon 아이콘: 라이트 모드일 때 표시 (클릭 → 다크로)
  document.getElementById('dark-icon').classList.toggle('hidden', isDarkMode);
  // sun 아이콘: 다크 모드일 때 표시 (클릭 → 라이트로)
  document.getElementById('light-icon').classList.toggle('hidden', !isDarkMode);
}
```

---

## 작업 순서 (권장)

1. `main.css` 전체 재작성
2. `app.js` toggleDarkMode 5줄 수정
3. `index.html` `<head>` 폰트/Tailwind 설정 수정
4. `index.html` `to-cyan-400` replace_all 치환
5. `index.html` 테마 버튼 기본값 수정
6. 브라우저에서 라이트/다크 토글 검증

---

## 예상 결과

- 페이지 로드 시 **아이보리 흰 배경 + 초록 포인트** 로 표시
- 버튼/CTA: 초록 → 딥 초록 그라디언트
- 로고/포인트 바: 초록 → 옐로우 그라디언트
- `gradient-text` (타이틀 강조): 초록 → 옐로우
- 다크 토글 클릭 시 **웜 다크 브라운** 배경으로 전환 (초록 포인트 유지)
