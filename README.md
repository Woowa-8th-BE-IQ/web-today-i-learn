# Today I Learn 페이지 🌿

아이큐(한동희)의 개인 위키 페이지입니다.  
우아한테크코스 8기 백엔드 과정 중 제작한 HTML/CSS/JS 미션 결과물입니다.

## 🔗 배포 링크

> https://Woowa-8th-BE-IQ.github.io/web-today-i-learn/

## 📁 프로젝트 구조

```
web-today-i-learn/
├── index.html          # 메인 HTML 문서
├── css/
│   ├── main.css        # CSS 진입점 (import 모음)
│   ├── reset.css       # Eric Meyer CSS Reset
│   ├── common.css      # 공통 타이포그래피, 폰트
│   └── wiki-layout.css # 레이아웃, 컴포넌트, 다크모드, 애니메이션
├── js/
│   └── index.js        # DOM 조작 & 이벤트 핸들러
├── images/
│   ├── profile.svg         # 프로필 이미지
│   ├── og-image.svg        # Open Graph 썸네일
│   ├── gallery-1.svg ~ 9   # 갤러리 이미지 (수학·물리학 테마)
│   ├── work-feynman.svg    # 파인만 물리학 강의 커버
│   ├── work-interstellar.svg
│   └── work-music.svg      # folklore 앨범 커버
└── README.md
```

## ✅ 구현된 기능

### 1단계 — HTML 뼈대
- [x] 프로필 영역 (`<img>`, 닉네임, 한 줄 소개)
- [x] 기본 정보 `<table>`
- [x] 자기소개 `<p>` + `<a>` 링크
- [x] 나만의 갤러리 (9장, 수학·물리학 SVG 테마)
- [x] 인생 작품 2가지 이상 (`<ul>` 형태, `<iframe>` 영상 포함)
- [x] TIL 섹션 (날짜, 제목, 내용)
- [x] 상단 내비게이션 (페이지 내 하이퍼링크)
- [x] 시맨틱 태그 활용 (`<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`)
- [x] `<meta charset>`, `<meta viewport>`, Open Graph 태그
- [x] `<img>` alt 속성 전부 작성
- [x] 상대 경로로 리소스 참조

### 2단계 — CSS 꾸미기
- [x] CSS 파일 분리 + `<link>` 연결
- [x] 태그 / 클래스(`.`) / ID(`#`) 선택자 모두 사용
- [x] 갤러리: CSS Grid (`grid-template-columns: repeat(3, 1fr)`)
- [x] CSS 변수(`--primary-color` 등)로 테마 관리
- [x] 다크 모드 (`[data-theme="dark"]`)
- [x] 반응형 레이아웃 (`@media`)
- [x] 스크롤 애니메이션, hover 효과

### 3단계 — JavaScript 동작
- [x] JS 파일 분리 + `<script defer>` 연결
- [x] TIL 폼: `<form>` 안에 날짜/제목/내용 + `<label>`
- [x] 등록 버튼 클릭 → 이벤트 리스너 → TIL 목록 추가
- [x] `document.querySelector()` / `addEventListener()` 활용
- [x] **보너스**: localStorage 저장 (새로고침 후 데이터 유지)
- [x] **보너스**: TIL 항목 삭제 (이벤트 위임)
- [x] **보너스**: 다크 모드 토글 + localStorage 유지
- [x] **보너스**: 갤러리 이미지 클릭 시 라이트박스 확대
- [x] **보너스**: `IntersectionObserver` 스크롤 등장 애니메이션
- [x] **보너스**: 맨 위로 버튼

## 💡 생각해보기 답변

### HTML

**나만의 갤러리 이미지 9장은 어떤 요소로?**  
`<img>` 태그. 갤러리의 각 이미지는 콘텐츠의 일부이므로 `<img alt="...">` 가 적합합니다.  
배경 장식이라면 CSS `background-image`를 쓰겠지만, 설명이 필요한 콘텐츠 이미지이므로 `<img>`가 맞습니다.

**이미지를 로드하는 2가지 방식?**
1. `<img src="...">` — HTML 태그로 직접 삽입
2. CSS `background-image: url(...)` — 스타일시트로 배경 설정  
   이 프로젝트에서는 두 가지 모두 사용합니다.

**XSS와 innerHTML?**  
사용자가 입력한 데이터를 `innerHTML`로 바로 삽입하면 스크립트 주입(XSS) 위험이 있습니다.  
`index.js`에서는 `escapeHtml()` 함수로 특수문자를 이스케이프하여 안전하게 처리합니다.

### CSS

**Flexbox vs CSS Grid?**  
9장의 정사각형 이미지를 균등한 3열로 배치할 때는 **CSS Grid**가 더 적합합니다.  
`grid-template-columns: repeat(3, 1fr)` 한 줄로 해결되고, `gap`으로 간격도 통일됩니다.  
Flexbox는 주로 1차원(행 또는 열) 레이아웃에 적합하고, Grid는 2차원 배치에 강합니다.

### JavaScript

**`getElementById` vs `querySelector`의 차이?**
- `getElementById("id")` — ID만 선택, 빠름
- `querySelector("#id")` — CSS 선택자 문법 사용, 클래스/속성 등 모두 선택 가능  
  이 프로젝트에서는 유연성을 위해 `querySelector`를 사용합니다.

**localStorage와 새로고침?**  
기본 JS로 추가한 DOM 데이터는 새로고침 시 사라집니다. `localStorage`에 직렬화(JSON)하여  
저장하면 브라우저 탭을 닫아도 유지됩니다. 단, GitHub Pages 재배포와는 무관하게  
브라우저 로컬 저장소에 남아 있습니다.

## 🛠 로컬 실행

```bash
# VS Code Live Server 또는 아래 명령어 사용
npx serve .
# 또는
python3 -m http.server 3000
```

## 📄 라이선스

MIT
