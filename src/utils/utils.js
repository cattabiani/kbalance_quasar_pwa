const Utils = {
  getDay(dateint) {
    const date = new Date(dateint);
    return date.getDate().toString().padStart(2, '0');
  },
  getMonth(dateint, isShort = true) {
    const date = new Date(dateint);
    return new Intl.DateTimeFormat('en-GB', {
      month: isShort ? 'short' : 'long',
    }).format(date);
  },
  getYear(dateint) {
    const date = new Date(dateint);
    return date.getFullYear();
  },

  formatCurrency(currency, amount) {
    const formatted = new Intl.NumberFormat('it-CH', {
      maximumFractionDigits: 2,
    }).format(amount / 100);
    return `${currency} ${formatted}`;
  },

  truncate(name, maxLength = null) {
    if (!name || !maxLength) {
      return name;
    }
    if (name.length > maxLength) {
      return name.substring(0, maxLength - 3) + '...';
    }
    return name;
  },

  isDev() {
    return (
      !!import.meta.env.VITE_FIREBASE_API_KEY &&
      !!import.meta.env.VITE_FIREBASE_AUTH_DOMAIN &&
      !!import.meta.env.VITE_FIREBASE_PROJECT_ID &&
      !!import.meta.env.VITE_FIREBASE_STORAGE_BUCKET &&
      !!import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID &&
      !!import.meta.env.VITE_FIREBASE_APP_ID
    );
  },

  isIos() {
    return /iPhone|iPad|iPod/i.test(navigator.userAgent);
  },

  isAppInstalled() {
    return (
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true
    );
  },
};

export default Utils;
