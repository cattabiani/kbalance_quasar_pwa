const UserLedger = {
  make(name = '') {
    return {
      name,
      friends: {},
      sheets: {},
      showArchivedSheets: false,
    };
  },
};

export default UserLedger;
