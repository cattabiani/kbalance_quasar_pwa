# kBalance - Quasar PWA for Balance Sheets Among Friends

**kBalance** is an open-source Progressive Web App (PWA) built with [Quasar](https://quasar.dev/) and powered by [Firebase](https://firebase.google.com/). It allows friends to manage balance sheets effortlessly, offering a simple, privacy-focused and free alternative to apps like Splitwise.

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

The rules live in [`firestore.rules`](firestore.rules). They are not deployed by the app: publish them yourself whenever the file changes.

1. Replace `ADMIN_UID` with your own UID (Firebase console → **Authentication** → **Users** → "User UID"). This makes you the admin of your project. If you leave the placeholder, nobody is admin and the app works normally.
2. Publish, either:
   - paste the file in Firebase console → **Firestore Database** → **Rules** → **Publish**, or
   - run `npx firebase-tools deploy --only firestore:rules` (needs `firebase login` and a `firebase.json` pointing at `firestore.rules`).
3. Test before publishing with the console's **Rules Playground**. If something breaks, the console keeps the history of published rules: roll back from there.

**Trust model:** everyone in a sheet can edit it, remove other members, or delete it. Share sheets only with people you trust with that sheet.

## 🧰 Admin Page: Backup, Migrate, Restore

The app has a maintenance page that is not linked anywhere: open `<app URL>/#/admin` (e.g. [cattabiani.github.io/kbalance_quasar_pwa/#/admin](https://cattabiani.github.io/kbalance_quasar_pwa/#/admin)) after logging in. It only works for the account whose UID is in `firestore.rules` as admin (see above); everyone else, logged out included, gets the regular "not found" page.

- **Status:** how many documents are on each data format version.
- **Backup:** downloads all data as one JSON file. It contains every user's data: keep it private.
- **Migrate:** after an update that changes the data format, rewrites stored documents to the new format. Dry run first, then apply; apply requires a backup from the same visit.
- **Restore:** puts documents back from a backup file, all or only the ones you tick. It downloads the current version of those documents first, so a restore can be undone the same way.

Routine after a data format change: **backup → dry run → apply**. If something looks wrong afterwards: **restore** the affected sheets from the backup.

## 🚀 Testing Locally and Deployment

To test your application locally, you can use the Quasar development server. Run the following command:

```bash
quasar dev
```

This will start the local development server, and you can preview your application in the browser.

Once you're ready to deploy, you can build the app and deploy it with:

```bash
npm run deploy
```

This command will build the app for production and deploy it to the [GitHub Pages](https://cattabiani.github.io/kbalance_quasar_pwa/).

## 📄 License

kBalance is licensed under the [MIT License](LICENSE).
