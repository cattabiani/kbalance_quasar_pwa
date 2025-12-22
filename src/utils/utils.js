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

  add(a, b, multi = 1) {
    for (let i = 0; i < a.length; ++i) {
      a[i] += multi * b[i];
    }
  },

  convertArray(arr, rate) {
    if (!arr || arr.length === 0) return arr;

    const floats = arr.map((v) => v * rate);
    const floors = floats.map((v) => Math.floor(v));

    const floatSum = floats.reduce((a, b) => a + b, 0);
    const floorSum = floors.reduce((a, b) => a + b, 0);
    let diff = Math.round(floatSum - floorSum);

    if (diff === 0) return floors;

    // largest fractional parts first
    const fractions = floats.map((v, i) => ({ i, frac: v - floors[i] }));
    fractions.sort((a, b) => b.frac - a.frac);

    const result = [...floors];

    // distribute remainder
    for (let k = 0; k < diff; k++) {
      result[fractions[k].i] += 1;
    }

    return result;
  },
};

export default Utils;
