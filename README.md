# kBalance - Quasar PWA for Balance Sheets Among Friends

**kBalance** is an open-source Progressive Web App (PWA) built with [Quasar](https://quasar.dev/) and powered by [Firebase](https://firebase.google.com/). It allows friends to manage balance sheets effortlessly, offering a simple, privacy-focused alternative to apps like Splitwise—without any payment integrations.

## 🚀 Features

- **Account Creation:** Sign up with Firebase to manage your balance sheets.
- **Friend-Based Access:** Add a friend's Firebase keys to use kBalance on their account.
- **Real-Time Sync:** Firebase ensures data is updated instantly across devices.
- **PWA Installation:** Install the app directly from [GitHub Pages](https://cattabiani.github.io/kbalance_quasar_pwa/).
- **Flexible Firebase Key Input:** Pass Firebase keys at runtime via a JSON-formatted string or QR code (shared by friends with existing data).

## 📦 Source Code

You can find the full source code [here](https://github.com/cattabiani/kbalance_quasar_pwa).

## 🛠️ Installation & Usage

### 📲 Install the App

Visit [GitHub Pages](https://cattabiani.github.io/kbalance_quasar_pwa/) to use or install kBalance as a PWA.  
- **Android users:** The app will prompt for installation automatically.  
- **iPhone users:** Tap the share icon in Safari and select **"Add to Home Screen"**.

### ⚙️ Configure the Firebase Account

- **If a friend has already configured an account:**  
  Easily exchange the necessary Firebase configuration via QR codes or a JSON-formatted string.

- **If you're setting up a new Firebase account:**  
  1. Go to [Firebase Console](https://console.firebase.google.com/).  
  2. Create a new project (takes ~5 mins). The free tier is sufficient.  
  3. Enable **Email/Password** under **Authentication**.  
  4. Set up **Firestore Database** in test mode. For production, secure it using the rules in the [Firestore Security Rules](#-firestore-security-rules) section.  
  5. Copy the Firebase config keys and pass them to the app via JSON or QR code.  
     - **Note:** Firebase provides these keys in `.env` format, but kBalance requires them in JSON. Use an online converter, an AI, or format them manually.  
  6. (Optional) Share the configuration with friends using the in-app QR code feature for easy onboarding.


## 🔐 Firestore Security Rules

Add the following Firestore security rules to secure your database:

```firebase
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // Match the sheets collection
    match /sheets/{docId} {

      // Allow the authenticated user to create a document
      allow create: if request.auth != null;

      // Allow read if the user is present in the users dictionary of the document
      allow read: if request.auth != null && resource.data.users[request.auth.uid] != null;

      // Allow write if the user is the owner in the users dictionary
      allow write: if request.auth != null && resource.data.users[request.auth.uid] == "owner";
    }
    
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    
    function isAddingOneKeyToSheetsMap() {
      // Get the keys that have changed in the 'sheets' map
      let changedKeys = request.resource.data.diff(resource.data).changedKeys();
      let addedKeys = request.resource.data.diff(resource.data).addedKeys();
      let removedKeys = request.resource.data.diff(resource.data).removedKeys();
      
      let changedSheetsKeys = request.resource.data.sheets.diff(resource.data.sheets).changedKeys();
      let addedSheetsKeys = request.resource.data.sheets.diff(resource.data.sheets).addedKeys();
      let removedSheetsKeys = request.resource.data.sheets.diff(resource.data.sheets).removedKeys();
      let newSheetKey = request.resource.data.sheets.keys().removeAll(resource.data.sheets.keys())[0];
			
      return addedKeys.size() == 0 && 
             removedKeys.size() == 0 && 
             changedKeys.hasOnly(["sheets"]) && 
             changedSheetsKeys.size() == 0 && 
             removedSheetsKeys.size() == 0 && 
             addedSheetsKeys.size() == 1 && 
             // workaround to pick up the only value added and check that it is a string
             request.resource.data.sheets[newSheetKey] is map &&
             request.resource.data.sheets[newSheetKey].name is string &&
             request.resource.data.sheets[newSheetKey].timestamp is int
    }
    
    match /users/{docId} {
      allow update: if request.auth != null && isAddingOneKeyToSheetsMap();
    }
  }
}
```

## 📄 License

kBalance is licensed under the [MIT License](LICENSE).
