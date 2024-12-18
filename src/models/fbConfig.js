const FbConfig = {
  make() {
    return {
      apiKey: null,
      authDomain: null,
      projectId: null,
      storageBucket: null,
      messagingSenderId: null,
      appId: null,
    };
  },

  isEmpty(config) {
    return (
      !!!config.apiKey &&
      !!!config.authDomain &&
      !!!config.projectId &&
      !!!config.storageBucket &&
      !!!config.messagingSenderId &&
      !!!config.appId
    );
  },

  isCompatible(config) {
        // Define the required fields
    const requiredFields = [
      'apiKey',
      'authDomain',
      'projectId',
      'storageBucket',
      'messagingSenderId',
      'appId'
    ];

    // Check if all required fields are present and not empty
    return requiredFields.every(field => config[field] && config[field].trim() !== '');
  }
};

export default FbConfig;
