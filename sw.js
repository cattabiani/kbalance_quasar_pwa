if(!self.define){let e,s={};const a=(a,c)=>(a=new URL(a+".js",c).href,s[a]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=a,e.onload=s,document.head.appendChild(e)}else e=a,importScripts(a),s()})).then((()=>{let e=s[a];if(!e)throw new Error(`Module ${a} didn’t register its module`);return e})));self.define=(c,i)=>{const f=e||("document"in self?document.currentScript.src:"")||location.href;if(s[f])return;let r={};const d=e=>a(e,f),n={module:{uri:f},exports:r,require:d};s[f]=Promise.all(c.map((e=>n[e]||d(e)))).then((e=>(i(...e),r)))}}define(["./workbox-37fde244"],(function(e){"use strict";e.setCacheNameDetails({prefix:"kbalance-quasar-pwa"}),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"assets/ErrorNotFound.d23a5e52.js",revision:"26c89a81de7c4b0f04f3969e2ad93f9b"},{url:"assets/favicon.442a6445.ico",revision:"74076c96e38de70509672bd06d38ca5d"},{url:"assets/FirebaseSettingsPage.bf124e6f.js",revision:"874b663ac8c350f9e167d5e4f9a1ddfd"},{url:"assets/flUhRq6tzZclQEJ-Vdg-IuiaDsNa.fd84f88b.woff",revision:"3e1afe59fa075c9e04c436606b77f640"},{url:"assets/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.4a4dbc62.woff2",revision:"a4160421d2605545f69a4cd6cd642902"},{url:"assets/index.375b16e1.css",revision:"49dbdd32e24a9a801207209ae8e052ec"},{url:"assets/index.926519d6.js",revision:"3b2c1585737ff6bc60d71a7ded43b23b"},{url:"assets/IndexPage.34391467.js",revision:"ed2cafe436c1083ba2e28f70cec8a19e"},{url:"assets/IndexPage.c63e55ef.css",revision:"d41d8cd98f00b204e9800998ecf8427e"},{url:"assets/KFOkCnqEu92Fr1MmgVxIIzQ.34e9582c.woff",revision:"4aa2e69855e3b83110a251c47fdd05fc"},{url:"assets/KFOlCnqEu92Fr1MmEU9fBBc-.9ce7f3ac.woff",revision:"40bcb2b8cc5ed94c4c21d06128e0e532"},{url:"assets/KFOlCnqEu92Fr1MmSU5fBBc-.bf14c7d7.woff",revision:"ea60988be8d6faebb4bc2a55b1f76e22"},{url:"assets/KFOlCnqEu92Fr1MmWUlfBBc-.e0fd57c0.woff",revision:"0774a8b7ca338dc1aba5a0ec8f2b9454"},{url:"assets/KFOlCnqEu92Fr1MmYUtfBBc-.f6537e32.woff",revision:"bcb7c7e2499a055f0e2f93203bdb282b"},{url:"assets/KFOmCnqEu92Fr1Mu4mxM.f2abf7fb.woff",revision:"d3907d0ccd03b1134c24d3bcaf05b698"},{url:"assets/LoginPage.ea102212.js",revision:"d18d62137bd448d938e68406296c4f16"},{url:"assets/MainLayout.977c9cfb.js",revision:"48984ba4f75c6a09ef1ee719e7fb7e94"},{url:"assets/PeoplePage.adb291d2.js",revision:"b00e6cec1458e2b53e307a98fada47f2"},{url:"assets/QCardActions.a3c5bbf3.js",revision:"bdbdce6df9039ab40a4bf1ae56873117"},{url:"assets/QDialog.e32d59db.js",revision:"f2a32a7d10dec5bee6deecc7ea2f3097"},{url:"assets/QForm.95da2e29.js",revision:"0d5db12bc6517bfefdcd515cc932dff7"},{url:"assets/QResizeObserver.0e5554d1.js",revision:"077f0a617454f7863da5c75545220126"},{url:"assets/QSelect.c9d02533.js",revision:"5492a787be69ae9aabe931a57a9fff62"},{url:"assets/QSlideItem.58f75e8f.js",revision:"13028476182099ae455dbea1235c1c76"},{url:"assets/SelectPerson.dffe3b2d.js",revision:"4511adf5c42b59dcb4783f789e4e8a43"},{url:"assets/SheetPage.05686321.js",revision:"28f48d02c25fb5598b5c6ab322b4f38c"},{url:"assets/TransactionPage.7bd5ee7c.js",revision:"7a1569ab77a005c68b5c2eb92d754f38"},{url:"assets/use-quasar.5501894d.js",revision:"13c360f295ba8f7477e61230e7477452"},{url:"favicon.ico",revision:"74076c96e38de70509672bd06d38ca5d"},{url:"icons/apple-icon-120x120.png",revision:"d082235f6e6d2109e84e397f66fa868d"},{url:"icons/apple-icon-152x152.png",revision:"3c728ce3e709b7395be487becf76283a"},{url:"icons/apple-icon-167x167.png",revision:"3fec89672a18e4b402ede58646917c2d"},{url:"icons/apple-icon-180x180.png",revision:"aa47843bd47f34b7ca4b99f65dd25955"},{url:"icons/icon-128x128.png",revision:"ab92df0270f054ca388127c9703a4911"},{url:"icons/icon-192x192.png",revision:"16627987653342ccf2299c0ab32b9a65"},{url:"icons/icon-256x256.png",revision:"cf5ad3498fb6fda43bdafd3c6ce9b824"},{url:"icons/icon-384x384.png",revision:"fdfc1b3612b6833a27a7b260c9990247"},{url:"icons/icon-512x512.png",revision:"094098ff02b33b07ed719c9433a6be97"},{url:"icons/ms-icon-144x144.png",revision:"8de1b0e67a62b881cd22d935f102a0e6"},{url:"icons/safari-pinned-tab.svg",revision:"3e4c3730b00c89591de9505efb73afd3"},{url:"index.html",revision:"f7647d1a6c4f1e9b23e2858fa3cba073"},{url:"manifest.json",revision:"31bef8834254853f9480417317171f1b"},{url:"screenshots/screenshot-1.jpeg",revision:"fb3ce7d5fa12822be1868cfe5ced7b6d"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html"),{denylist:[/sw\.js$/,/workbox-(.)*\.js$/]}))}));
