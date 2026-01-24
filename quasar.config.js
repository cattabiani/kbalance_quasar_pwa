// quasar.config.js
import { configure } from 'quasar/wrappers';
import checker from 'vite-plugin-checker';

export default configure(() => ({
  boot: ['apexcharts'],

  css: ['app.scss'],

  extras: ['roboto-font', 'material-icons'],

  build: {
    target: {
      browser: ['es2019', 'edge88', 'firefox78', 'chrome87', 'safari13.1'],
      node: 'node20',
    },

    vueRouterMode: 'hash', // hash mode works best for GH Pages
    publicPath: '/kbalance_quasar_pwa/',
    vitePlugins: [],
  },

  devServer: {
    open: true,
  },

  framework: {
    config: {},
    plugins: ['Notify'],
  },

  animations: [],

  ssr: {
    pwa: true,
    prodPort: 3000,
    middlewares: ['render'],
  },

  pwa: {
    workboxMode: 'GenerateSW',
    injectPwaMetaTags: true,
    swFilename: 'sw.js',
    manifestFilename: 'manifest.json',
    useCredentialsForManifestTag: false,

    workboxOptions: {
      skipWaiting: true,
      clientsClaim: true,
    },

    extendManifestJson(json) {
      Object.assign(json, {
        name: 'kBalance',
        short_name: 'kBalance',
        description: 'A simple balance-tracking app to manage finances.',
        display: 'standalone',
        start_url: './',
        theme_color: '#1976D2',
        background_color: '#ffffff',
        icons: [
          {
            src: 'icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
        screenshots: [
          {
            src: 'screenshots/sheet.jpeg',
            sizes: '985x2048',
            type: 'image/jpeg',
          },
          {
            src: 'screenshots/transaction.jpeg',
            sizes: '985x2048',
            type: 'image/jpeg',
          },
          {
            src: 'screenshots/newPageWizard.jpeg',
            sizes: '985x2048',
            type: 'image/jpeg',
          },
          {
            src: 'screenshots/convert.jpeg',
            sizes: '985x2048',
            type: 'image/jpeg',
          },
        ],
      });
    },
  },

  cordova: {},
  capacitor: { hideSplashscreen: true },

  electron: {
    inspectPort: 5858,
    bundler: 'packager',
    packager: {},
    builder: { appId: 'kbalance-quasar-pwa' },
  },

  bex: { contentScripts: ['my-content-script'] },
}));
