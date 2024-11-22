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
};

export default Utils;
