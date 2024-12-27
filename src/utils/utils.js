const Utils = {
  getDay(dateint) {
    const date = new Date(dateint);
    return date.getDate().toString().padStart(2, "0");
  },
  getMonth(dateint) {
    const date = new Date(dateint);
    return new Intl.DateTimeFormat("en-GB", { month: "short" }).format(date);
  },
  getYear(dateint) {
    const date = new Date(dateint);
    return date.getFullYear();
  },

  displayCurrency(currency, amount) {
    return `${currency} ${parseFloat(amount / 100)}`;
  },

  truncate(name) {
    if (!name) {
      return name;
    }
    const maxLength = 40;
    if (name.length > maxLength) {
      return name.substring(0, maxLength - 3) + "...";
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
};

export default Utils;
