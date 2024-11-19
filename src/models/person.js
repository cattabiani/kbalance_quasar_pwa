import { v4 as uuidv4 } from "uuid";

const Person = {
  make(name = "") {
    const id = uuidv4();
    let active = true;
    return { name, id, active };
  },
};

export default Person;
