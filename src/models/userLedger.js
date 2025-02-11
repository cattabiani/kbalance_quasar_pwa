const UserLedger = {
  make(name = '') {
    return {
      name,
      friends: {},
      sheets: {},
    };
  },
};

export default UserLedger;
