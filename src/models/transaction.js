import { v4 as uuidv4 } from "uuid";

export class Transaction {
  constructor(nPeople, currency) {
    this.name = "";
    this.id = uuidv4();
    this.amount = 0;
    this.payer = nPeople > 0 ? 0 : -1;
    this.currency = currency;
    this.isDebtor = Array(nPeople).fill(true);
    this.owed = Array(nPeople).fill(0);
  }

  updatePeople(nPeople) {
    const addPeople = nPeople - this.owed.length;
    if (addPeople > 0) {
      this.isDebtor.push(...Array(addPeople).fill(false));
      this.owed.push(...Array(addPeople).fill(0));
      if (this.payer === -1) {
        this.payer = 0;
      }
    }
  }
  
  split() {
    const nDebtors = this.isDebtor.filter((value) => value === true).length;
    if (nDebtors == 0) {
      this.owed.fill(0);
      return;
    }

    const q = Math.floor(this.amount / nDebtors);
    let r = this.amount % nDebtors;

    for (let i = this.owed.length - 1; i >= 0; --i) {
      if (this.isDebtor[i]) {
        this.owed[i] = q;
        if (r > 0) {
          this.owed[i] += 1;
          --r;
        }
      } else {
        this.owed[i] = 0;
      }
    }
  }
}
