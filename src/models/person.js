import { v4 as uuidv4 } from "uuid";

const Person = {
  make(name = null, id = null) {
    if (!id) {
      id = uuidv4();
    }
    let active = true;
    const timestamp = Date.now();
    return { name, id, active, timestamp };
  },
};

export default Person;
