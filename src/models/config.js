const Config = {
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

  isCompatible(config) {
    if (!config) {
      return false;
    }

    // Define the required fields
    const requiredFields = [
      'apiKey',
      'authDomain',
      'projectId',
      'storageBucket',
      'messagingSenderId',
      'appId',
    ];

    // Check if all required fields are present and not empty
    return requiredFields.every(
      (field) => config[field] && config[field].trim() !== '',
    );
  },
};

export default Config;
