if(!self.define){let e,s={};const c=(c,a)=>(c=new URL(c+".js",a).href,s[c]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=c,e.onload=s,document.head.appendChild(e)}else e=c,importScripts(c),s()})).then((()=>{let e=s[c];if(!e)throw new Error(`Module ${c} didn’t register its module`);return e})));self.define=(a,f)=>{const i=e||("document"in self?document.currentScript.src:"")||location.href;if(s[i])return;let r={};const d=e=>c(e,i),n={module:{uri:i},exports:r,require:d};s[i]=Promise.all(a.map((e=>n[e]||d(e)))).then((e=>(f(...e),r)))}}define(["./workbox-37fde244"],(function(e){"use strict";e.setCacheNameDetails({prefix:"kbalance-quasar-pwa"}),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"assets/ErrorNotFound.3db63c06.js",revision:"f635ee7db12d2fb16850a0fa593cfc61"},{url:"assets/favicon.442a6445.ico",revision:"74076c96e38de70509672bd06d38ca5d"},{url:"assets/flUhRq6tzZclQEJ-Vdg-IuiaDsNa.fd84f88b.woff",revision:"3e1afe59fa075c9e04c436606b77f640"},{url:"assets/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.4a4dbc62.woff2",revision:"a4160421d2605545f69a4cd6cd642902"},{url:"assets/focusout.2057f3e0.js",revision:"48d2891ba7d82e88e0398ff81642941b"},{url:"assets/index.10c5e0cb.js",revision:"ffc52d8602ae10c64b0eaff0d1747d37"},{url:"assets/index.375b16e1.css",revision:"49dbdd32e24a9a801207209ae8e052ec"},{url:"assets/IndexPage.9f08a191.js",revision:"f7caaa3a540aeef2c41ddfb92b01e5a1"},{url:"assets/IndexPage.c63e55ef.css",revision:"d41d8cd98f00b204e9800998ecf8427e"},{url:"assets/KFOkCnqEu92Fr1MmgVxIIzQ.34e9582c.woff",revision:"4aa2e69855e3b83110a251c47fdd05fc"},{url:"assets/KFOlCnqEu92Fr1MmEU9fBBc-.9ce7f3ac.woff",revision:"40bcb2b8cc5ed94c4c21d06128e0e532"},{url:"assets/KFOlCnqEu92Fr1MmSU5fBBc-.bf14c7d7.woff",revision:"ea60988be8d6faebb4bc2a55b1f76e22"},{url:"assets/KFOlCnqEu92Fr1MmWUlfBBc-.e0fd57c0.woff",revision:"0774a8b7ca338dc1aba5a0ec8f2b9454"},{url:"assets/KFOlCnqEu92Fr1MmYUtfBBc-.f6537e32.woff",revision:"bcb7c7e2499a055f0e2f93203bdb282b"},{url:"assets/KFOmCnqEu92Fr1Mu4mxM.f2abf7fb.woff",revision:"d3907d0ccd03b1134c24d3bcaf05b698"},{url:"assets/LoginPage.0335ff3d.js",revision:"751c45bedfd8400c28b4e6d4360c2d9e"},{url:"assets/MainLayout.37cc1386.js",revision:"f5ee5d44ff79cc8f7de58e2db7c759bb"},{url:"assets/NewSheetWizardPage.00583d6c.js",revision:"454822583afa18055f8258a1552059b4"},{url:"assets/PeopleDropdown.82b2d0b5.js",revision:"53e4c5698f5420d7a34017bb5278d44a"},{url:"assets/PeopleList.f222cd9d.js",revision:"8de21d2d08ccb900206acec607db37df"},{url:"assets/PeoplePage.636752a3.js",revision:"1b65d00a9f0f82009825d4bcc2243bf2"},{url:"assets/PersonItem.b99a745a.js",revision:"64be78395cfa2d0655917c697d53c9b5"},{url:"assets/plugin-vue_export-helper.21dcd24c.js",revision:"b29b145139fc88e89a46af507277557d"},{url:"assets/QBanner.a796cf53.js",revision:"860c3e4451b3182265f5eb98d86c8c7d"},{url:"assets/QCardActions.37def57f.js",revision:"1591e5b7ff408a5f6df22dc8607df16a"},{url:"assets/QDialog.5a2f0883.js",revision:"60654ffd98303893c4e0ca818e4638d9"},{url:"assets/QForm.51db11fe.js",revision:"b9980559b209fee911abc4a95ef0c82d"},{url:"assets/QPage.f4f11fda.js",revision:"33b4a1cf3f00ba0d67f577b6f29938f0"},{url:"assets/QResizeObserver.5bc0a185.js",revision:"acd548e380d3b8f87ba6f264e4a98c04"},{url:"assets/QSlideItem.6bde9c5e.js",revision:"fcdefdc1a57007d96aa82befdcdbafc0"},{url:"assets/QSpace.a4880b91.js",revision:"4720a35475c27f834bc51455f9f9abf2"},{url:"assets/QToolbarTitle.a3324aa2.js",revision:"cdcc308221dbb42fd4e78b60a1eb6e11"},{url:"assets/ReceiveString.ba4732ce.js",revision:"35f62595affac4611dbfd4b84e31b544"},{url:"assets/rtl.276c3f1b.js",revision:"528db8ee9db59534c84c8fe3314e1c7c"},{url:"assets/scroll.d4340346.js",revision:"fdf1d55664247025b973a68b60421320"},{url:"assets/SettingsPage.21e8e46b.js",revision:"9cf8073137993ed69f5c896032b368b2"},{url:"assets/ShareString.101645f6.js",revision:"efc1ba574890cf997ccc9acb207a6cdc"},{url:"assets/SheetPage.13a7e34f.js",revision:"b72ef903648b9978f00b4b9d72df2d0d"},{url:"assets/TransactionPage.c51fa4f7.js",revision:"98691ef62e026676b2769fc2ba5ac87a"},{url:"favicon.ico",revision:"74076c96e38de70509672bd06d38ca5d"},{url:"icons/apple-icon-120x120.png",revision:"d082235f6e6d2109e84e397f66fa868d"},{url:"icons/apple-icon-152x152.png",revision:"3c728ce3e709b7395be487becf76283a"},{url:"icons/apple-icon-167x167.png",revision:"3fec89672a18e4b402ede58646917c2d"},{url:"icons/apple-icon-180x180.png",revision:"aa47843bd47f34b7ca4b99f65dd25955"},{url:"icons/icon-128x128.png",revision:"ab92df0270f054ca388127c9703a4911"},{url:"icons/icon-192x192.png",revision:"16627987653342ccf2299c0ab32b9a65"},{url:"icons/icon-256x256.png",revision:"cf5ad3498fb6fda43bdafd3c6ce9b824"},{url:"icons/icon-384x384.png",revision:"fdfc1b3612b6833a27a7b260c9990247"},{url:"icons/icon-512x512.png",revision:"094098ff02b33b07ed719c9433a6be97"},{url:"icons/ms-icon-144x144.png",revision:"8de1b0e67a62b881cd22d935f102a0e6"},{url:"icons/safari-pinned-tab.svg",revision:"3e4c3730b00c89591de9505efb73afd3"},{url:"index.html",revision:"8ad51651b8c45d1e854d0b77c9b1227b"},{url:"manifest.json",revision:"31bef8834254853f9480417317171f1b"},{url:"screenshots/screenshot-1.jpeg",revision:"fb3ce7d5fa12822be1868cfe5ced7b6d"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html"),{denylist:[/sw\.js$/,/workbox-(.)*\.js$/]}))}));
