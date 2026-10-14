const mobileMenuButton = document.getElementById("mobile-menu-btn");
const mobileMenu = document.getElementById("mobile-menu");

let currentLanguage = "en_US";

function getTranslation(key) {
  if (typeof window !== "undefined" && window.translations) {
    const dict =
      window.translations[currentLanguage] || window.translations.en_US;
    if (dict && dict[key] !== undefined) {
      return dict[key];
    }
  }
  return "";
}

function updateMobileMenuAriaLabel() {
  if (!mobileMenuButton) return;
  const isExpanded = mobileMenuButton.getAttribute("aria-expanded") === "true";
  const labelKey = isExpanded ? "nav_mobile_btn_close" : "nav_mobile_btn_open";
  const translated = getTranslation(labelKey);
  if (translated) {
    mobileMenuButton.setAttribute("aria-label", translated);
  }
}

if (mobileMenuButton && mobileMenu) {
  const closeMobileMenu = () => {
    mobileMenu.classList.add("hidden");
    mobileMenuButton.setAttribute("aria-expanded", "false");
    mobileMenuButton.setAttribute("aria-label", "Open navigation");
  };

  mobileMenuButton.addEventListener("click", () => {
    const isExpanded = mobileMenuButton.getAttribute("aria-expanded") === "true";
    mobileMenuButton.setAttribute("aria-expanded", String(!isExpanded));
    mobileMenuButton.setAttribute("aria-label", isExpanded ? "Open navigation" : "Close navigation");
    mobileMenu.classList.toggle("hidden", isExpanded);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMobileMenu();
    }
  });

  mobileMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMobileMenu);
  });

  window.matchMedia("(min-width: 768px)").addEventListener("change", closeMobileMenu);
}

document.querySelectorAll(".language-switcher").forEach((switcher) => {
  const languageButtons = switcher.querySelectorAll("[data-language]");

  languageButtons.forEach((button) => {
    button.addEventListener("click", () => {
      languageButtons.forEach((option) => {
        option.setAttribute("aria-pressed", String(option === button));
      });
    });
  });
});
