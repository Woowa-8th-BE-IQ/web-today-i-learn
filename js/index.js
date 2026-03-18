/* =============================================
   아이큐 - Today I Learn
   index.js : DOM 조작 & 이벤트 핸들러
   =============================================

   기능 목록:
   1. TIL 폼 등록 (핵심 요구사항)
   2. TIL 항목 삭제
   3. localStorage 저장 / 불러오기
   4. 다크 모드 토글 (localStorage 유지)
   5. 갤러리 라이트박스 (이미지 클릭 확대)
   6. IntersectionObserver 스크롤 애니메이션
   7. 내비게이션 스크롤 효과
   8. '맨 위로' 버튼 표시/숨기기
   ============================================= */

// ─────────────────────────────────────────────
// 1. DOM 요소 선택
// ─────────────────────────────────────────────
const tilForm        = document.querySelector("#til-form");
const tilList        = document.querySelector("#til-list");
const themeToggle    = document.querySelector("#theme-toggle");
const topNav         = document.querySelector("#top-nav");
const scrollTopBtn   = document.querySelector("#scroll-top");
const lightbox       = document.querySelector("#lightbox");
const lightboxImg    = document.querySelector("#lightbox-img");
const galleryGrid    = document.querySelector(".gallery-grid");

// ─────────────────────────────────────────────
// 2. 유틸리티 함수
// ─────────────────────────────────────────────

/**
 * 날짜를 "YYYY-MM-DD" 포맷으로 반환합니다.
 * @param {Date} date
 * @returns {string}
 */
function formatDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/**
 * XSS 방지를 위해 문자열의 특수문자를 이스케이프합니다.
 * innerHTML 대신 textContent를 사용하는 것이 원칙이나,
 * 동적 HTML 생성 시 이 함수로 사용자 입력을 안전하게 처리합니다.
 * @param {string} str
 * @returns {string}
 */
function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

// ─────────────────────────────────────────────
// 3. TIL 항목 생성 & 렌더링
// ─────────────────────────────────────────────

/**
 * TIL 데이터를 받아 article 엘리먼트를 생성합니다.
 * @param {{ id: number, date: string, title: string, content: string }} item
 * @returns {HTMLElement}
 */
function createTilElement(item) {
  const article = document.createElement("article");
  article.className = "til-item";
  article.dataset.id = item.id;

  article.innerHTML = `
    <div class="til-item-header">
      <time datetime="${escapeHtml(item.date)}">${escapeHtml(item.date)}</time>
      <button class="til-delete-btn" aria-label="TIL 항목 삭제">✕</button>
    </div>
    <h3>${escapeHtml(item.title)}</h3>
    <p>${escapeHtml(item.content)}</p>
  `;

  return article;
}

/**
 * localStorage에서 TIL 목록을 불러와 화면에 렌더링합니다.
 * 저장된 데이터가 없으면 기존 HTML 예시 항목을 유지합니다.
 */
function loadTilFromStorage() {
  const saved = localStorage.getItem("til-items");
  if (!saved) {
    // 초기 로드: HTML에 작성된 예시 항목에 삭제 버튼 이벤트만 연결
    attachDeleteEvents();
    return;
  }

  const items = JSON.parse(saved);
  if (items.length === 0) {
    renderEmptyState();
    return;
  }

  // 기존 HTML 예시 항목 제거 후 저장된 데이터로 교체
  tilList.innerHTML = "";
  items.forEach((item) => {
    tilList.appendChild(createTilElement(item));
  });
  attachDeleteEvents();
}

/**
 * 현재 TIL 목록을 localStorage에 저장합니다.
 */
function saveTilToStorage() {
  const items = [];
  document.querySelectorAll(".til-item[data-id]").forEach((el) => {
    items.push({
      id: el.dataset.id,
      date: el.querySelector("time").getAttribute("datetime"),
      title: el.querySelector("h3").textContent,
      content: el.querySelector("p").textContent,
    });
  });
  localStorage.setItem("til-items", JSON.stringify(items));
}

/**
 * TIL 목록이 비었을 때 빈 상태 UI를 표시합니다.
 */
function renderEmptyState() {
  tilList.innerHTML = `
    <div class="til-empty">
      <span class="empty-icon">📝</span>
      아직 기록된 TIL이 없습니다.<br />위 폼으로 오늘 배운 것을 기록해보세요!
    </div>
  `;
}

// ─────────────────────────────────────────────
// 4. 핵심 요구사항: TIL 폼 submit 이벤트
// ─────────────────────────────────────────────
tilForm.addEventListener("submit", function (event) {
  event.preventDefault(); // 페이지 새로고침 방지

  // 입력값 가져오기
  const dateInput    = document.querySelector("#til-date");
  const titleInput   = document.querySelector("#til-title");
  const contentInput = document.querySelector("#til-content");

  const date    = dateInput.value.trim();
  const title   = titleInput.value.trim();
  const content = contentInput.value.trim();

  // 간단한 유효성 검사
  if (!date || !title || !content) {
    alert("날짜, 제목, 내용을 모두 입력해주세요.");
    return;
  }

  // 빈 상태 메시지 제거
  const emptyEl = tilList.querySelector(".til-empty");
  if (emptyEl) emptyEl.remove();

  // 새 TIL 아이템 생성
  const newItem = {
    id: Date.now(),
    date,
    title,
    content,
  };

  const newElement = createTilElement(newItem);

  // 목록 맨 위에 추가 (최신 순)
  tilList.insertBefore(newElement, tilList.firstChild);

  // 삭제 이벤트 연결
  attachDeleteEvents();

  // localStorage 저장
  saveTilToStorage();

  // 폼 초기화
  tilForm.reset();

  // 새 항목으로 부드럽게 스크롤
  newElement.scrollIntoView({ behavior: "smooth", block: "nearest" });
});

// ─────────────────────────────────────────────
// 5. TIL 항목 삭제
// ─────────────────────────────────────────────

/**
 * 모든 삭제 버튼에 이벤트를 연결합니다.
 * (이벤트 위임 방식으로 단순화)
 */
function attachDeleteEvents() {
  // 이벤트 위임: tilList 자체에 한 번만 리스너를 달고
  // 버블링으로 클릭 이벤트를 잡습니다.
}

// 이벤트 위임 방식으로 삭제 처리
tilList.addEventListener("click", function (event) {
  const deleteBtn = event.target.closest(".til-delete-btn");
  if (!deleteBtn) return;

  const tilItem = deleteBtn.closest(".til-item");
  if (!tilItem) return;

  // 삭제 확인
  const title = tilItem.querySelector("h3")?.textContent ?? "이 항목";
  if (!confirm(`"${title}"을(를) 삭제할까요?`)) return;

  // 페이드아웃 후 제거
  tilItem.style.transition = "opacity 0.3s ease, transform 0.3s ease";
  tilItem.style.opacity = "0";
  tilItem.style.transform = "translateX(-20px)";

  setTimeout(() => {
    tilItem.remove();
    saveTilToStorage();

    // 목록이 비었으면 빈 상태 표시
    if (tilList.querySelectorAll(".til-item").length === 0) {
      renderEmptyState();
    }
  }, 300);
});

// ─────────────────────────────────────────────
// 6. 다크 모드 토글
// ─────────────────────────────────────────────

/**
 * 현재 테마를 적용합니다.
 * @param {"light" | "dark"} theme
 */
function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  themeToggle.textContent = theme === "dark" ? "☀️" : "🌙";
  localStorage.setItem("theme", theme);
}

// 저장된 테마 불러오기 (없으면 시스템 설정 우선)
const savedTheme = localStorage.getItem("theme");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
applyTheme(savedTheme ?? (prefersDark ? "dark" : "light"));

themeToggle.addEventListener("click", function () {
  const current = document.documentElement.getAttribute("data-theme");
  applyTheme(current === "dark" ? "light" : "dark");
});

// ─────────────────────────────────────────────
// 7. 갤러리 라이트박스
// ─────────────────────────────────────────────
if (galleryGrid && lightbox) {
  // 갤러리 이미지 클릭 → 라이트박스 열기
  galleryGrid.addEventListener("click", function (event) {
    const img = event.target.closest("img");
    if (!img) return;

    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightbox.classList.add("open");
    document.body.style.overflow = "hidden";
  });

  // 라이트박스 클릭 → 닫기
  lightbox.addEventListener("click", function () {
    closeLightbox();
  });

  // ESC 키로 닫기
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && lightbox.classList.contains("open")) {
      closeLightbox();
    }
  });
}

function closeLightbox() {
  lightbox.classList.remove("open");
  document.body.style.overflow = "";
}

// ─────────────────────────────────────────────
// 8. IntersectionObserver — 스크롤 애니메이션
// ─────────────────────────────────────────────
const revealElements = document.querySelectorAll(".reveal");

if (revealElements.length > 0 && "IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            revealObserver.unobserve(entry.target); // 한 번만 실행
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -40px 0px",
      }
  );

  revealElements.forEach((el) => revealObserver.observe(el));
} else {
  // IntersectionObserver 미지원 브라우저 폴백
  revealElements.forEach((el) => el.classList.add("visible"));
}

// ─────────────────────────────────────────────
// 9. 내비게이션 스크롤 효과
// ─────────────────────────────────────────────
window.addEventListener("scroll", function () {
  const scrollY = window.scrollY;

  // 내비게이션 그림자
  if (scrollY > 20) {
    topNav.classList.add("scrolled");
  } else {
    topNav.classList.remove("scrolled");
  }

  // '맨 위로' 버튼 표시 (300px 이상 스크롤 시)
  if (scrollY > 300) {
    scrollTopBtn.classList.add("visible");
  } else {
    scrollTopBtn.classList.remove("visible");
  }
}, { passive: true });

// ─────────────────────────────────────────────
// 10. '맨 위로' 버튼
// ─────────────────────────────────────────────
if (scrollTopBtn) {
  scrollTopBtn.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// ─────────────────────────────────────────────
// 11. TIL 날짜 기본값: 오늘
// ─────────────────────────────────────────────
const tilDateInput = document.querySelector("#til-date");
if (tilDateInput) {
  tilDateInput.value = formatDate(new Date());
}

// ─────────────────────────────────────────────
// 12. 초기 로드
// ─────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", function () {
  loadTilFromStorage();
});
