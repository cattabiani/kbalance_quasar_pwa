import { v4 as uuidv4 } from "uuid";
import Person from "./person";

const Sheet = {
  make(userid) {
    const id = uuidv4();
    const timestamp = Date.now();
    const newPerson = Person.make("", userid);
    const people = { [newPerson.id]: newPerson };
    const transactions = {};
    const users = { [userid]: "owner" };
    const newSheet = { users, id, people, transactions };
    const name = "";
    let nusers = 1;
    let ntransactions = 0;
    const newSheetLedger = { name, timestamp, nusers, ntransactions };
    return [newSheet, newSheetLedger];
  },
};

export default Sheet;
