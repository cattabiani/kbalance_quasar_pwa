if(!self.define){let e,s={};const a=(a,c)=>(a=new URL(a+".js",c).href,s[a]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=a,e.onload=s,document.head.appendChild(e)}else e=a,importScripts(a),s()})).then((()=>{let e=s[a];if(!e)throw new Error(`Module ${a} didn’t register its module`);return e})));self.define=(c,i)=>{const r=e||("document"in self?document.currentScript.src:"")||location.href;if(s[r])return;let d={};const f=e=>a(e,r),n={module:{uri:r},exports:d,require:f};s[r]=Promise.all(c.map((e=>n[e]||f(e)))).then((e=>(i(...e),d)))}}define(["./workbox-37fde244"],(function(e){"use strict";e.setCacheNameDetails({prefix:"kbalance-quasar-pwa"}),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"assets/browser.445c5f4b.js",revision:"cf16b6237c65636de588e8902f91f8c1"},{url:"assets/ClosePopup.30f3ec8b.js",revision:"66bbae486d67c6cd865f129b9b641f46"},{url:"assets/ConvertPage.af6ce2a9.js",revision:"ccf8a84658738860c839cee405319230"},{url:"assets/ErrorNotFound.91ca2cad.js",revision:"02836df4cbe6e7b7f9f030868a668c38"},{url:"assets/favicon.442a6445.ico",revision:"74076c96e38de70509672bd06d38ca5d"},{url:"assets/flUhRq6tzZclQEJ-Vdg-IuiaDsNa.fd84f88b.woff",revision:"3e1afe59fa075c9e04c436606b77f640"},{url:"assets/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.4a4dbc62.woff2",revision:"a4160421d2605545f69a4cd6cd642902"},{url:"assets/focusout.5d103ae2.js",revision:"3de14a750d24a75852edde0f385d2896"},{url:"assets/index.375b16e1.css",revision:"49dbdd32e24a9a801207209ae8e052ec"},{url:"assets/index.56516dd5.js",revision:"e08c4226b92180ab8d0d973eefa41e81"},{url:"assets/index.c45f6171.js",revision:"664fab7b7d82e9831e0840a5f53cba63"},{url:"assets/IndexPage.2bf49d51.css",revision:"c3d2f19b2afa9c1a54e2ba30baa44796"},{url:"assets/IndexPage.9737744f.js",revision:"25f10cf2e7256f9f79c0e6616cd63ad6"},{url:"assets/KFOkCnqEu92Fr1MmgVxIIzQ.34e9582c.woff",revision:"4aa2e69855e3b83110a251c47fdd05fc"},{url:"assets/KFOlCnqEu92Fr1MmEU9fBBc-.9ce7f3ac.woff",revision:"40bcb2b8cc5ed94c4c21d06128e0e532"},{url:"assets/KFOlCnqEu92Fr1MmSU5fBBc-.bf14c7d7.woff",revision:"ea60988be8d6faebb4bc2a55b1f76e22"},{url:"assets/KFOlCnqEu92Fr1MmWUlfBBc-.e0fd57c0.woff",revision:"0774a8b7ca338dc1aba5a0ec8f2b9454"},{url:"assets/KFOlCnqEu92Fr1MmYUtfBBc-.f6537e32.woff",revision:"bcb7c7e2499a055f0e2f93203bdb282b"},{url:"assets/KFOmCnqEu92Fr1Mu4mxM.f2abf7fb.woff",revision:"d3907d0ccd03b1134c24d3bcaf05b698"},{url:"assets/LandingPage.c7d1d30b.js",revision:"36569633e75fa5c5f36689ed8201022e"},{url:"assets/LoginPage.9af6a9b2.js",revision:"16d04d5b1a52013c13c9037a70cac732"},{url:"assets/MainLayout.6e38e3cf.js",revision:"3b5293634d0b24c9c810a0ce8c53e0e9"},{url:"assets/NewSheetWizardPage.2182db24.js",revision:"0da3c97333c972e879032b94df36027e"},{url:"assets/PeopleDropdown.baf39dad.js",revision:"959a6d769d8d588a1e1c5a45aead5c6b"},{url:"assets/PeopleList.6ab6b3e8.js",revision:"1d1fff2a006370468ddaf7ed5d3436f4"},{url:"assets/PeoplePage.78a44641.js",revision:"aefe26c8c344e06de855f2514bc98282"},{url:"assets/PersonItem.afba27ec.js",revision:"bb0eaa8c6b335db43691a6d83c12205b"},{url:"assets/plugin-vue_export-helper.21dcd24c.js",revision:"b29b145139fc88e89a46af507277557d"},{url:"assets/QBanner.4b06d949.js",revision:"c728e7d1032f1adc36ea014e0619291c"},{url:"assets/QCard.a5c030ad.js",revision:"1e00bb2cea5c49415ea44379d17bd1e7"},{url:"assets/QCardActions.19b45b45.js",revision:"4694426756dd016296de156ee4f03fc6"},{url:"assets/QDialog.6690453a.js",revision:"e338d972e90ab12f03863453261f2b7d"},{url:"assets/QForm.4258e827.js",revision:"39a0dc783673e9a9d2dc9435ac96f0f3"},{url:"assets/QHeader.0a5123ae.js",revision:"12fad4049494b8b60c8a8c34a4672bec"},{url:"assets/QImg.3fd091ae.js",revision:"d72fb90654773cb9f3771e6a7c9f2759"},{url:"assets/QPage.611bcdab.js",revision:"895ffee93e62cc56e906d20ddf8aed11"},{url:"assets/QResizeObserver.cfbe9964.js",revision:"d50fd3cc52fb0a5316cac030f20147d0"},{url:"assets/QSelect.0d7f5dc7.js",revision:"8ee06c6a8955ffe2af02c97611794586"},{url:"assets/QSlideItem.b4212206.js",revision:"f251955c876657c8248402734575e6ad"},{url:"assets/QSpace.6a9f53c4.js",revision:"44a0a79f1e07133f0eb8f6016a271561"},{url:"assets/QToolbarTitle.7d5ceb63.js",revision:"ed454eaab51f89471b6fb2aa43006eab"},{url:"assets/ReceiveString.a4dd98a7.js",revision:"4f07bef621cc333345d0a034feb38f19"},{url:"assets/rtl.276c3f1b.js",revision:"528db8ee9db59534c84c8fe3314e1c7c"},{url:"assets/scroll.18d8999f.js",revision:"453b5d80ae418e8d08a897ee0c48c724"},{url:"assets/selection.6fd22d31.js",revision:"4b203383bdf97df5638ee0ee81c9357f"},{url:"assets/SettingsPage.83a3d461.js",revision:"a0b8fcdde093acb1b32aaebcebbefcc2"},{url:"assets/ShareString.f3bd6d52.js",revision:"697ec9a620f4d841a6400b6eef0e90a2"},{url:"assets/SheetPage.3cbc8ee1.js",revision:"c524d4f0a637e0494b741b8d0a933cd4"},{url:"assets/TransactionList.0766114a.js",revision:"28c8aafaf50dc7632b402d6ff401867a"},{url:"assets/TransactionPage.d309d580.js",revision:"eaf26895b23ca982de32835b50c4485b"},{url:"assets/use-render-cache.770e5fe8.js",revision:"a62d49482d621ff95a95a9b940fdc1d8"},{url:"favicon.ico",revision:"74076c96e38de70509672bd06d38ca5d"},{url:"icons/apple-icon-120x120.png",revision:"d082235f6e6d2109e84e397f66fa868d"},{url:"icons/apple-icon-152x152.png",revision:"3c728ce3e709b7395be487becf76283a"},{url:"icons/apple-icon-167x167.png",revision:"3fec89672a18e4b402ede58646917c2d"},{url:"icons/apple-icon-180x180.png",revision:"aa47843bd47f34b7ca4b99f65dd25955"},{url:"icons/icon-128x128.png",revision:"ab92df0270f054ca388127c9703a4911"},{url:"icons/icon-192x192.png",revision:"16627987653342ccf2299c0ab32b9a65"},{url:"icons/icon-256x256.png",revision:"cf5ad3498fb6fda43bdafd3c6ce9b824"},{url:"icons/icon-384x384.png",revision:"fdfc1b3612b6833a27a7b260c9990247"},{url:"icons/icon-512x512.png",revision:"094098ff02b33b07ed719c9433a6be97"},{url:"icons/ms-icon-144x144.png",revision:"8de1b0e67a62b881cd22d935f102a0e6"},{url:"icons/safari-pinned-tab.svg",revision:"3e4c3730b00c89591de9505efb73afd3"},{url:"index.html",revision:"919817f6440af79b163c1eebd2fc0e37"},{url:"manifest.json",revision:"bc448bfaafdc7a8e985bfe516328b92a"},{url:"screenshots/conversion.jpeg",revision:"40cbaf92bf0a821cb3e2d9fc40b5def7"},{url:"screenshots/index.jpeg",revision:"7a3d040b94cfbd1f9392879a45f59564"},{url:"screenshots/newPageWizard.jpeg",revision:"77dfd21c1224edf44b60abff128c8414"},{url:"screenshots/sheet.jpeg",revision:"3d348dafee511cff21c2e0047805286d"},{url:"screenshots/transaction.jpeg",revision:"0a61eeaac54066eabfc6e40caf6fdc8a"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html"),{denylist:[/sw\.js$/,/workbox-(.)*\.js$/]}))}));
