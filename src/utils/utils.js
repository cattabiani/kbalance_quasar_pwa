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
    return `${currency} ${parseFloat(amount / 100).toFixed(2)}`;
  },
};

export default Utils;
