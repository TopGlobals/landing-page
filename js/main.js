const mobileMenuButton = document.getElementById("mobile-menu-btn");
const mobileMenu = document.getElementById("mobile-menu");

let currentLanguage = "en";

function getTranslation(key) {
  if (typeof window !== "undefined" && window.translations) {
    const dict = window.translations[currentLanguage] || window.translations.en;
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
    updateMobileMenuAriaLabel();
  };

  mobileMenuButton.addEventListener("click", () => {
    const isExpanded = mobileMenuButton.getAttribute("aria-expanded") === "true";
    mobileMenuButton.setAttribute("aria-expanded", String(!isExpanded));
    mobileMenu.classList.toggle("hidden", isExpanded);
    updateMobileMenuAriaLabel();
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

function setLanguage(lang) {
  if (!window.translations || !window.translations[lang]) {
    lang = "en";
  }
  currentLanguage = lang;

  document.documentElement.lang = lang;

  const t = window.translations[lang];

  // Update Page Title
  if (t.meta_title) {
    document.title = t.meta_title;
  }

  // Update Meta Description
  if (t.meta_description) {
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", t.meta_description);
    }
  }

  // Update text content
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (t[key] !== undefined) {
      if (el.getAttribute("data-i18n-html") === "true") {
        el.innerHTML = t[key];
      } else {
        el.textContent = t[key];
      }
    }
  });

  // Update aria-labels
  document.querySelectorAll("[data-i18n-aria-label]").forEach((el) => {
    const key = el.getAttribute("data-i18n-aria-label");
    if (t[key]) {
      el.setAttribute("aria-label", t[key]);
    }
  });

  // Update alt texts
  document.querySelectorAll("[data-i18n-alt]").forEach((el) => {
    const key = el.getAttribute("data-i18n-alt");
    if (t[key]) {
      el.setAttribute("alt", t[key]);
    }
  });

  // Update language switcher buttons
  document.querySelectorAll(".language-switcher").forEach((switcher) => {
    const languageButtons = switcher.querySelectorAll("[data-language]");
    languageButtons.forEach((option) => {
      const isSelected = option.getAttribute("data-language") === lang;
      option.setAttribute("aria-pressed", String(isSelected));
    });
  });

  // Update mobile menu button label
  updateMobileMenuAriaLabel();

  // Persist preference in localStorage
  try {
    localStorage.setItem("cryovigil_lang", lang);
  } catch (e) {
    // localStorage may be disabled in some environments
  }
}

function getInitialLanguage() {
  try {
    const saved = localStorage.getItem("cryovigil_lang");
    if (saved === "es" || saved === "en") {
      return saved;
    }
  } catch (e) {}

  if (typeof navigator !== "undefined" && navigator.language) {
    if (navigator.language.toLowerCase().startsWith("es")) {
      return "es";
    }
  }

  return "en";
}

// Bind language switcher clicks
document.querySelectorAll(".language-switcher").forEach((switcher) => {
  const languageButtons = switcher.querySelectorAll("[data-language]");

  languageButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const lang = button.getAttribute("data-language");
      if (lang) {
        setLanguage(lang);
      }
    });
  });
});

// Initialize on DOM load
const initialLang = getInitialLanguage();
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    setLanguage(initialLang);
  });
} else {
  setLanguage(initialLang);
}
