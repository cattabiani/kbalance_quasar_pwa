import { v4 as uuidv4 } from "uuid";
import Person from "./person";

const Sheet = {
  make(name, people, users) {
    const id = uuidv4();
    const timestamp = Date.now();
    const transactions = {};
    const newSheet = { name, users, id, people, transactions, timestamp };
    return newSheet;
  },
};

export default Sheet;
