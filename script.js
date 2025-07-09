document.addEventListener("DOMContentLoaded", function () {
  // Initialize language manager first
  const languageManager = new LanguageManager();
  window.languageManager = languageManager;
  
  // Wait for language manager to load
  setTimeout(() => {
    initializeApp();
  }, 500);
});

function initializeApp() {
  // Mobile menu
  const menuToggle = document.getElementById("menuToggle");
  const mobileMenu = document.getElementById("mobileMenu");
  
  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener("click", function () {
      mobileMenu.classList.toggle("hidden");
    });
    
    // モバイルメニューのリンクをクリックしたらメニューを閉じる
    const mobileLinks = mobileMenu.querySelectorAll("a");
    mobileLinks.forEach((link) => {
      link.addEventListener("click", function () {
        mobileMenu.classList.add("hidden");
      });
    });
  }

  // Language change handler
  document.addEventListener('languageChanged', function(e) {
    console.log('Language changed to:', e.detail.language);
    // Refresh any dynamic content that needs language updates
    updateDynamicContent();
  });

  // ギャラリーフィルター
  const filterButtons = document.querySelectorAll(".gallery-filter-btn");
  const galleryItems = document.querySelectorAll(".gallery-item");
  
  filterButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const filterValue = this.getAttribute("data-filter");
      // アクティブクラスの切り替え
      filterButtons.forEach((btn) => {
        btn.classList.remove("active", "bg-primary", "text-white");
      });
      this.classList.add("active", "bg-primary", "text-white");
      // アイテムのフィルタリング
      galleryItems.forEach((item) => {
        if (
          filterValue === "all" ||
          item.getAttribute("data-category") === filterValue
        ) {
          item.style.display = "block";
        } else {
          item.style.display = "none";
        }
      });
    });
  });

  // 画像モーダル
  const modal = document.getElementById("imageModal");
  const modalImg = document.getElementById("modalImage");
  const closeBtn = document.getElementsByClassName("close")[0];
  
  if (modal && modalImg) {
    galleryItems.forEach((item) => {
      item.addEventListener("click", function () {
        modal.style.display = "flex";
        modalImg.src = this.querySelector("img").src;
        modalImg.alt = this.querySelector("img").alt;
      });
    });
  }
  
  if (closeBtn) {
    closeBtn.addEventListener("click", function () {
      modal.style.display = "none";
    });
  }
  
  if (modal) {
    window.addEventListener("click", function (event) {
      if (event.target === modal) {
        modal.style.display = "none";
      }
    });
  }

  // Handle image loading animation
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');
  
  lazyImages.forEach(img => {
    img.addEventListener('load', function() {
      this.classList.add('loaded');
    });
    
    // If image is already loaded (cached)
    if (img.complete) {
      img.classList.add('loaded');
    }
  });
  
  // Rest of the existing code...
  setupBookingForm();
  setupSmoothScroll();
}

function updateDynamicContent() {
  // Update gallery filter buttons and other dynamic content
  if (window.languageManager) {
    const filterButtons = document.querySelectorAll('.gallery-filter-btn');
    filterButtons.forEach(btn => {
      const filter = btn.getAttribute('data-filter');
      const translationKey = `gallery.filters.${filter}`;
      const translation = window.languageManager.getTranslation(translationKey);
      if (translation) {
        btn.textContent = translation;
      }
    });
    
    // Update any other dynamic content that needs translation
    updateBookingFormLabels();
    updateGalleryItemTitles();
  }
}

function updateBookingFormLabels() {
  if (!window.languageManager) return;
  
  // Update form placeholders
  const nameInput = document.getElementById('name');
  if (nameInput) {
    const placeholder = window.languageManager.getTranslation('booking.form.name');
    if (placeholder) nameInput.placeholder = placeholder;
  }
  
  const emailInput = document.getElementById('email');
  if (emailInput) {
    const placeholder = window.languageManager.getTranslation('booking.form.email');
    if (placeholder) emailInput.placeholder = placeholder;
  }
}

function updateGalleryItemTitles() {
  if (!window.languageManager) return;
  
  // Update gallery item titles and descriptions
  const galleryItems = document.querySelectorAll('.gallery-item');
  galleryItems.forEach(item => {
    const titleElement = item.querySelector('h4');
    const descElement = item.querySelector('p');
    
    if (titleElement && descElement) {
      const itemKey = titleElement.textContent.toLowerCase().replace(/\s+/g, '');
      // This would need to be mapped to the actual keys in the translation files
      // For now, we'll keep the original Japanese text
    }
  });
}

function setupBookingForm() {
  // 大人数の増減
  const adultsDecrement = document.getElementById("adultsDecrement");
  const adultsIncrement = document.getElementById("adultsIncrement");
  const adultsInput = document.getElementById("adults");
  if (adultsDecrement && adultsIncrement && adultsInput) {
    adultsDecrement.addEventListener("click", function () {
      let value = parseInt(adultsInput.value);
      if (value > 1) {
        adultsInput.value = value - 1;
      }
    });
    adultsIncrement.addEventListener("click", function () {
      let value = parseInt(adultsInput.value);
      if (value < 10) {
        adultsInput.value = value + 1;
      }
    });
  }
  
  // 子供数の増減
  const childrenDecrement = document.getElementById("childrenDecrement");
  const childrenIncrement = document.getElementById("childrenIncrement");
  const childrenInput = document.getElementById("children");
  if (childrenDecrement && childrenIncrement && childrenInput) {
    childrenDecrement.addEventListener("click", function () {
      let value = parseInt(childrenInput.value);
      if (value > 0) {
        childrenInput.value = value - 1;
      }
    });
    childrenIncrement.addEventListener("click", function () {
      let value = parseInt(childrenInput.value);
      if (value < 10) {
        childrenInput.value = value + 1;
      }
    });
  }
  
  // 日付の最小値を今日に設定
  const today = new Date().toISOString().split("T")[0];
  const checkinInput = document.getElementById("checkin");
  const checkoutInput = document.getElementById("checkout");
  if (checkinInput && checkoutInput) {
    checkinInput.min = today;
    checkoutInput.min = today;
    // チェックイン日付が変更されたらチェックアウト日の最小値を更新
    checkinInput.addEventListener("change", function () {
      checkoutInput.min = this.value;
      if (checkoutInput.value < this.value) {
        checkoutInput.value = this.value;
      }
    });
  }
}

function setupSmoothScroll() {
  // スムーズスクロール
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const headerHeight = document.querySelector("header").offsetHeight;
        const targetPosition =
          targetElement.getBoundingClientRect().top +
          window.pageYOffset -
          headerHeight;
        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    });
  });
}
