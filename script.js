document.addEventListener("DOMContentLoaded", function () {
  // Mobile menu
  const menuToggle = document.getElementById("menuToggle");
  const mobileMenu = document.getElementById("mobileMenu");
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
  galleryItems.forEach((item) => {
    item.addEventListener("click", function () {
      modal.style.display = "flex";
      modalImg.src = this.querySelector("img").src;
    });
  });
  if (closeBtn) {
    closeBtn.addEventListener("click", function () {
      modal.style.display = "none";
    });
  }
  window.addEventListener("click", function (event) {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });

  // マップフィルター
  const mapFilters = document.querySelectorAll(".map-filter");
  const mapPins = document.querySelectorAll(".map-pin");
  mapFilters.forEach((filter) => {
    filter.addEventListener("change", function () {
      const filterType = this.getAttribute("data-type");
      const isChecked = this.checked;
      mapPins.forEach((pin) => {
        if (pin.getAttribute("data-type") === filterType) {
          if (isChecked) {
            pin.style.display = "block";
          } else {
            pin.style.display = "none";
          }
        }
      });
    });
  });
  // マップピン情報表示
  const mapInfo = document.getElementById("map-info");
  const mapInfoTitle = document.getElementById("map-info-title");
  const mapInfoDesc = document.getElementById("map-info-desc");
  const pinInfo = {
    大阪城:
      "豊臣秀吉によって築かれた壮大な城郭。春には美しい桜の名所となり、四季折々の景色を楽しめます。",
    道頓堀グルメスポット:
      "大阪の食文化の中心地。グリコの看板やかに道楽など象徴的な看板と共に、多彩なグルメを楽しめます。",
    "ユニバーサル・スタジオ・ジャパン":
      "人気映画のアトラクションが楽しめるテーマパーク。ハリー・ポッターやミニオンなど、世界観に浸れます。",
    心斎橋ショッピングエリア:
      "大阪を代表するショッピングスポット。ブランド店から地元ショップまで様々なお店が軒を連ねます。",
    梅田ホテル地区:
      "大阪駅周辺のホテル集積地。ラグジュアリーからビジネスまで様々なタイプのホテルがあります。",
  };
  mapPins.forEach((pin) => {
    pin.addEventListener("click", function () {
      const pinName = this.getAttribute("data-name");
      mapInfoTitle.textContent = pinName;
      mapInfoDesc.textContent = pinInfo[pinName];
      mapInfo.classList.remove("hidden");
    });
  });

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
});
