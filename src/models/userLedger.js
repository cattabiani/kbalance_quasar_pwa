import { currentVersion } from './schema';

const UserLedger = {
  make(name = '') {
    return {
      schemaVersion: currentVersion('users'),
      name,
      friends: {},
      sheets: {},
      showArchivedSheets: false,
    };
  },
};

export default UserLedger;
