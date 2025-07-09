/**
 * Language Manager for Osaka Guide
 * Handles multi-language support with localStorage persistence
 */

class LanguageManager {
  constructor() {
    this.currentLanguage = localStorage.getItem('language') || 'ja';
    this.translations = {};
    this.supportedLanguages = ['ja', 'en'];
    this.init();
  }

  async init() {
    // Load current language
    await this.loadLanguage(this.currentLanguage);
    
    // Apply translations
    this.applyTranslations();
    
    // Setup language toggle
    this.setupLanguageToggle();
    
    // Update language indicator
    this.updateLanguageIndicator();
  }

  async loadLanguage(lang) {
    if (this.supportedLanguages.includes(lang)) {
      try {
        const response = await fetch(`lang/${lang}.json`);
        this.translations = await response.json();
        this.currentLanguage = lang;
        localStorage.setItem('language', lang);
      } catch (error) {
        console.error(`Error loading language ${lang}:`, error);
        // Fallback to Japanese
        if (lang !== 'ja') {
          await this.loadLanguage('ja');
        }
      }
    }
  }

  applyTranslations() {
    console.log('Applying translations for language:', this.currentLanguage);
    console.log('Translations loaded:', this.translations);
    
    // Update document title and meta tags
    document.title = this.translations.site.title;
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.content = this.translations.site.description;
    }
    
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords) {
      metaKeywords.content = this.translations.site.keywords;
    }

    // Apply translations to elements with data-translate attribute
    document.querySelectorAll('[data-translate]').forEach(element => {
      const key = element.getAttribute('data-translate');
      const translation = this.getTranslation(key);
      console.log(`Translating key: ${key}, translation: ${translation}`);
      if (translation) {
        if (element.tagName === 'INPUT' && element.type === 'text') {
          element.placeholder = translation;
        } else {
          element.textContent = translation;
        }
      }
    });

    // Apply translations to placeholders
    document.querySelectorAll('[data-translate-placeholder]').forEach(element => {
      const key = element.getAttribute('data-translate-placeholder');
      const translation = this.getTranslation(key);
      if (translation) {
        element.placeholder = translation;
      }
    });
  }

  getTranslation(key) {
    const keys = key.split('.');
    let translation = this.translations;
    
    for (const k of keys) {
      if (translation && translation[k]) {
        translation = translation[k];
      } else {
        return null;
      }
    }
    
    return translation;
  }

  setupLanguageToggle() {
    const languageToggle = document.getElementById('languageToggle');
    if (languageToggle) {
      languageToggle.addEventListener('change', async (e) => {
        if (e.target.checked) {
          await this.changeLanguage('en');
        } else {
          await this.changeLanguage('ja');
        }
      });
    }

    // Add Vietnamese language option (can be expanded later)
    this.createLanguageSelector();
  }

  createLanguageSelector() {
    // This creates a more advanced language selector
    // For now, we'll keep the simple toggle but can expand later
    const languageContainer = document.querySelector('.language-container');
    if (languageContainer) {
      // Future implementation for dropdown language selector
    }
  }

  async changeLanguage(lang) {
    if (this.supportedLanguages.includes(lang)) {
      await this.loadLanguage(lang);
      this.applyTranslations();
      this.updateLanguageIndicator();
      
      // Trigger custom event for other components
      document.dispatchEvent(new CustomEvent('languageChanged', {
        detail: { language: lang }
      }));
    }
  }

  updateLanguageIndicator() {
    const languageToggle = document.getElementById('languageToggle');
    if (languageToggle) {
      languageToggle.checked = this.currentLanguage === 'en';
    }
  }

  // Utility method to get current language
  getCurrentLanguage() {
    return this.currentLanguage;
  }

  // Method to get translation for dynamic content
  t(key, params = {}) {
    let translation = this.getTranslation(key);
    
    if (translation && typeof translation === 'string') {
      // Replace parameters in translation
      Object.keys(params).forEach(param => {
        translation = translation.replace(`{${param}}`, params[param]);
      });
    }
    
    return translation || key;
  }
}

// Initialize language manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.languageManager = new LanguageManager();
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = LanguageManager;
}
