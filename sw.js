if(!self.define){let e,s={};const c=(c,a)=>(c=new URL(c+".js",a).href,s[c]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=c,e.onload=s,document.head.appendChild(e)}else e=c,importScripts(c),s()})).then((()=>{let e=s[c];if(!e)throw new Error(`Module ${c} didn’t register its module`);return e})));self.define=(a,i)=>{const r=e||("document"in self?document.currentScript.src:"")||location.href;if(s[r])return;let f={};const n=e=>c(e,r),d={module:{uri:r},exports:f,require:n};s[r]=Promise.all(a.map((e=>d[e]||n(e)))).then((e=>(i(...e),f)))}}define(["./workbox-37fde244"],(function(e){"use strict";e.setCacheNameDetails({prefix:"kbalance-quasar-pwa"}),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"assets/ErrorNotFound.53171181.js",revision:"0181c9bc7ca393484acc4dc39a73753a"},{url:"assets/favicon.442a6445.ico",revision:"74076c96e38de70509672bd06d38ca5d"},{url:"assets/FirebaseSettingsPage.9c914f3e.js",revision:"e688bae02c849aed607e4f3f284ba14c"},{url:"assets/flUhRq6tzZclQEJ-Vdg-IuiaDsNa.fd84f88b.woff",revision:"3e1afe59fa075c9e04c436606b77f640"},{url:"assets/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.4a4dbc62.woff2",revision:"a4160421d2605545f69a4cd6cd642902"},{url:"assets/index.375b16e1.css",revision:"49dbdd32e24a9a801207209ae8e052ec"},{url:"assets/index.e2453849.js",revision:"d1c361761a16e04dbee7dc058968f0e9"},{url:"assets/IndexPage.5588f037.js",revision:"f96635f8121aeadf49612c424f1f392e"},{url:"assets/IndexPage.c63e55ef.css",revision:"d41d8cd98f00b204e9800998ecf8427e"},{url:"assets/KFOkCnqEu92Fr1MmgVxIIzQ.34e9582c.woff",revision:"4aa2e69855e3b83110a251c47fdd05fc"},{url:"assets/KFOlCnqEu92Fr1MmEU9fBBc-.9ce7f3ac.woff",revision:"40bcb2b8cc5ed94c4c21d06128e0e532"},{url:"assets/KFOlCnqEu92Fr1MmSU5fBBc-.bf14c7d7.woff",revision:"ea60988be8d6faebb4bc2a55b1f76e22"},{url:"assets/KFOlCnqEu92Fr1MmWUlfBBc-.e0fd57c0.woff",revision:"0774a8b7ca338dc1aba5a0ec8f2b9454"},{url:"assets/KFOlCnqEu92Fr1MmYUtfBBc-.f6537e32.woff",revision:"bcb7c7e2499a055f0e2f93203bdb282b"},{url:"assets/KFOmCnqEu92Fr1Mu4mxM.f2abf7fb.woff",revision:"d3907d0ccd03b1134c24d3bcaf05b698"},{url:"assets/LoginPage.024be9ba.js",revision:"43ce93667dc2cee16d466dc5a595077e"},{url:"assets/MainLayout.9e7cbc0d.js",revision:"da7106362eedddb3c5ef5eae854b90db"},{url:"assets/PeoplePage.4b46a9a2.js",revision:"2728fa381ffc6c1364b6113fb2691332"},{url:"assets/QCardActions.b1e15bca.js",revision:"c8b3910d4e947f19ee075009e70ae77b"},{url:"assets/QDialog.1159cf9c.js",revision:"8c538834e178ed522d15a5f43a802537"},{url:"assets/QForm.66b357c5.js",revision:"158945d27d12978befe94e66ced487bd"},{url:"assets/QList.267d3372.js",revision:"e837fd8dffaa414eafd32dc61c34f82a"},{url:"assets/QResizeObserver.10ac2ce5.js",revision:"9e6d503448f4979db76706c7ac7e9134"},{url:"assets/QSelect.a2186e0b.js",revision:"ab6fcd7e7aba9edccb6f08c80fc855bd"},{url:"assets/QSlideItem.81c707a1.js",revision:"0123522ef2fbcdadf18eb066c6757546"},{url:"assets/scroll.c721c79a.js",revision:"4a526779022fd39be40439cde070a8aa"},{url:"assets/SelectPerson.be8b436a.js",revision:"06c43d42e70c33003d4fe652b582c57a"},{url:"assets/SheetPage.440c2493.js",revision:"031fb3c12cfa2d3c567bbdf432d079d4"},{url:"assets/TransactionPage.27e1f1ec.js",revision:"13b66e228eef117a1cdf6de15052b5a5"},{url:"assets/use-quasar.15633eb0.js",revision:"6dbff2ab17384356652688225ab1187e"},{url:"favicon.ico",revision:"74076c96e38de70509672bd06d38ca5d"},{url:"icons/apple-icon-120x120.png",revision:"d082235f6e6d2109e84e397f66fa868d"},{url:"icons/apple-icon-152x152.png",revision:"3c728ce3e709b7395be487becf76283a"},{url:"icons/apple-icon-167x167.png",revision:"3fec89672a18e4b402ede58646917c2d"},{url:"icons/apple-icon-180x180.png",revision:"aa47843bd47f34b7ca4b99f65dd25955"},{url:"icons/icon-128x128.png",revision:"ab92df0270f054ca388127c9703a4911"},{url:"icons/icon-192x192.png",revision:"16627987653342ccf2299c0ab32b9a65"},{url:"icons/icon-256x256.png",revision:"cf5ad3498fb6fda43bdafd3c6ce9b824"},{url:"icons/icon-384x384.png",revision:"fdfc1b3612b6833a27a7b260c9990247"},{url:"icons/icon-512x512.png",revision:"094098ff02b33b07ed719c9433a6be97"},{url:"icons/ms-icon-144x144.png",revision:"8de1b0e67a62b881cd22d935f102a0e6"},{url:"icons/safari-pinned-tab.svg",revision:"3e4c3730b00c89591de9505efb73afd3"},{url:"index.html",revision:"7f3cd3d358260263c925ab5279e77813"},{url:"manifest.json",revision:"31bef8834254853f9480417317171f1b"},{url:"screenshots/screenshot-1.jpeg",revision:"fb3ce7d5fa12822be1868cfe5ced7b6d"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html"),{denylist:[/sw\.js$/,/workbox-(.)*\.js$/]}))}));