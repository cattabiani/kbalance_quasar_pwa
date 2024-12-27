import { v4 as uuidv4 } from "uuid";

const Person = {
  make(id = "", name = "", email = "", timestamp = null) {
    if (!id) {
      id = uuidv4();
    }
    let active = true;
    if (!timestamp) {
      timestamp = Date.now();
    }
    return { id, name, active, email, timestamp };
  },
  user2person(user) {
    return this.make(user.id, user.name, user.email);
  },
  makeUser(id = "", name = "", email = "") {
    return { id, name, email };
  },

  username(person) {
    return person?.name || person?.email;
  },

  compare(a, b) {
    const usernameA = this.username(a).toLowerCase();
    const usernameB = this.username(b).toLowerCase();
    return usernameA.localeCompare(usernameB);
  },
};

export default Person;
