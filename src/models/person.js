import { v4 as uuidv4 } from "uuid";

export class Person {
  constructor(name="") {
    this.name = name;
    this.id = uuidv4();
    this.active = true;
  }
}
