import { writeBatch } from "firebase/firestore";
import { db } from "src/firebase/firebase";

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

  async autoBatch(fn, ...args) {
    const isStandalone = !args[args.length - 1];
    if (isStandalone) {
      args[args.length - 1] = writeBatch(db); // Create a new batch if not provided
    }

    // Call the original function with the provided arguments and batch
    const result = await fn.apply(this, args);

    // Commit the batch if it was created internally
    if (isStandalone) {
      await args[args.length - 1].commit();
    }

    return result;
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
};

export default Utils;
