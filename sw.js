if(!self.define){let e,s={};const a=(a,c)=>(a=new URL(a+".js",c).href,s[a]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=a,e.onload=s,document.head.appendChild(e)}else e=a,importScripts(a),s()})).then((()=>{let e=s[a];if(!e)throw new Error(`Module ${a} didn’t register its module`);return e})));self.define=(c,i)=>{const d=e||("document"in self?document.currentScript.src:"")||location.href;if(s[d])return;let r={};const f=e=>a(e,d),n={module:{uri:d},exports:r,require:f};s[d]=Promise.all(c.map((e=>n[e]||f(e)))).then((e=>(i(...e),r)))}}define(["./workbox-37fde244"],(function(e){"use strict";e.setCacheNameDetails({prefix:"kbalance-quasar-pwa"}),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"assets/ClosePopup.c4d59952.js",revision:"8e5e64bc53b7b6c396c246b51db99001"},{url:"assets/ConvertPage.a8464a15.js",revision:"7951148e150af09ae67509d6af3030e4"},{url:"assets/ErrorNotFound.a6d4ba88.js",revision:"04ed280d182a1e2ad4e53ae527b2b7e8"},{url:"assets/flUhRq6tzZclQEJ-Vdg-IuiaDsNa.fd84f88b.woff",revision:"3e1afe59fa075c9e04c436606b77f640"},{url:"assets/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.4a4dbc62.woff2",revision:"a4160421d2605545f69a4cd6cd642902"},{url:"assets/focusout.4915fb52.js",revision:"a2b369fe9ab27a643fb2119e5e5b7a94"},{url:"assets/index.375b16e1.css",revision:"49dbdd32e24a9a801207209ae8e052ec"},{url:"assets/index.56516dd5.js",revision:"e08c4226b92180ab8d0d973eefa41e81"},{url:"assets/index.a37d1ab0.js",revision:"df4e723340fb202230864adfeadd7118"},{url:"assets/IndexPage.325afe37.js",revision:"991c2fa723d22e5345b70adac451b9e4"},{url:"assets/IndexPage.c63e55ef.css",revision:"d41d8cd98f00b204e9800998ecf8427e"},{url:"assets/KFOkCnqEu92Fr1MmgVxIIzQ.34e9582c.woff",revision:"4aa2e69855e3b83110a251c47fdd05fc"},{url:"assets/KFOlCnqEu92Fr1MmEU9fBBc-.9ce7f3ac.woff",revision:"40bcb2b8cc5ed94c4c21d06128e0e532"},{url:"assets/KFOlCnqEu92Fr1MmSU5fBBc-.bf14c7d7.woff",revision:"ea60988be8d6faebb4bc2a55b1f76e22"},{url:"assets/KFOlCnqEu92Fr1MmWUlfBBc-.e0fd57c0.woff",revision:"0774a8b7ca338dc1aba5a0ec8f2b9454"},{url:"assets/KFOlCnqEu92Fr1MmYUtfBBc-.f6537e32.woff",revision:"bcb7c7e2499a055f0e2f93203bdb282b"},{url:"assets/KFOmCnqEu92Fr1Mu4mxM.f2abf7fb.woff",revision:"d3907d0ccd03b1134c24d3bcaf05b698"},{url:"assets/LandingPage.de0afdff.js",revision:"d55b1f12e09b7578e3f6e99b111dd7e0"},{url:"assets/LoginPage.9ff87582.js",revision:"84a491c0e79349dd904e302d1bd9fcfb"},{url:"assets/MainLayout.ff463c8a.js",revision:"532dd7787b200a63c500d7cf327f2cee"},{url:"assets/NewSheetWizardPage.ecde8fe8.js",revision:"e9a7c1dd362d65eeca1547ab0cdcc730"},{url:"assets/PeopleDropdown.1b22bda8.js",revision:"ab5e9f25d49304fdbc335cfaa857151c"},{url:"assets/PeopleList.ac56f46a.js",revision:"5b34689d91e68ec7279ae8a18e68cf92"},{url:"assets/PeoplePage.8a470ada.js",revision:"54ce0ddda62158ea858e94ec7c8f501b"},{url:"assets/PersonItem.1bee8759.js",revision:"73d56f315da8b6aa28c6ea743ac0167a"},{url:"assets/plugin-vue_export-helper.21dcd24c.js",revision:"b29b145139fc88e89a46af507277557d"},{url:"assets/QBanner.d5af499f.js",revision:"91c3147ce6869aa2c4cee065261ef4a4"},{url:"assets/QCardActions.18b41466.js",revision:"c89f68dcac846a6eb7e4d7e12686a583"},{url:"assets/QDialog.e5c15440.js",revision:"adc7254ba5b5d5f96371c774b00a7fcf"},{url:"assets/QForm.e1e944b1.js",revision:"6836e9cad602d594eecd3d6fb49de18d"},{url:"assets/QPage.9f023bc7.js",revision:"617c59dac1d33230e0cff3ad60932b71"},{url:"assets/QResizeObserver.91a9543d.js",revision:"932b72d3599a8259c6b66217133f80de"},{url:"assets/QSelect.0855c53b.js",revision:"d34b6a48abaf625e5f4af3a4c00e9c72"},{url:"assets/QSlideItem.05d97f2e.js",revision:"8d91ef04aa78ae0b90e09c16646e2b5e"},{url:"assets/QSpace.eeecc271.js",revision:"61303ea849eff942ba04b36d098b42e3"},{url:"assets/QToolbarTitle.2ccb4bd8.js",revision:"5ee88412942fe88c6373dc030eaeffce"},{url:"assets/ReceiveString.69baf653.js",revision:"2799601a281def15ad96704770aa5b84"},{url:"assets/rtl.276c3f1b.js",revision:"528db8ee9db59534c84c8fe3314e1c7c"},{url:"assets/scroll.997cf621.js",revision:"a0ea8ffa94f32699cf54426009a5d414"},{url:"assets/SettingsPage.2ae9ba7a.js",revision:"59d03075a1a66c0ade6b057617260d59"},{url:"assets/ShareString.d5f19b64.js",revision:"d9fb89b9f0eb6c36313334d006438e5e"},{url:"assets/SheetPage.30396eb9.js",revision:"38415fa7bdca21d80203fd0bd3f7baed"},{url:"assets/TransactionList.8a89fca1.js",revision:"a8a6510f9aff8bd29037e25eda220435"},{url:"assets/TransactionPage.f9c305d6.js",revision:"52e218a1b98da6d7c1ccd713baf3284d"},{url:"assets/use-quasar.d666003e.js",revision:"6f7fa3bf520cf37def7a50756218df6a"},{url:"favicon.ico",revision:"74076c96e38de70509672bd06d38ca5d"},{url:"icons/apple-icon-120x120.png",revision:"d082235f6e6d2109e84e397f66fa868d"},{url:"icons/apple-icon-152x152.png",revision:"3c728ce3e709b7395be487becf76283a"},{url:"icons/apple-icon-167x167.png",revision:"3fec89672a18e4b402ede58646917c2d"},{url:"icons/apple-icon-180x180.png",revision:"aa47843bd47f34b7ca4b99f65dd25955"},{url:"icons/icon-128x128.png",revision:"ab92df0270f054ca388127c9703a4911"},{url:"icons/icon-192x192.png",revision:"16627987653342ccf2299c0ab32b9a65"},{url:"icons/icon-256x256.png",revision:"cf5ad3498fb6fda43bdafd3c6ce9b824"},{url:"icons/icon-384x384.png",revision:"fdfc1b3612b6833a27a7b260c9990247"},{url:"icons/icon-512x512.png",revision:"094098ff02b33b07ed719c9433a6be97"},{url:"icons/ms-icon-144x144.png",revision:"8de1b0e67a62b881cd22d935f102a0e6"},{url:"icons/safari-pinned-tab.svg",revision:"3e4c3730b00c89591de9505efb73afd3"},{url:"index.html",revision:"d0a3e42c9c0000768cd3d5c61bc73daf"},{url:"manifest.json",revision:"31bef8834254853f9480417317171f1b"},{url:"screenshots/screenshot-1.jpeg",revision:"fb3ce7d5fa12822be1868cfe5ced7b6d"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html"),{denylist:[/sw\.js$/,/workbox-(.)*\.js$/]}))}));
