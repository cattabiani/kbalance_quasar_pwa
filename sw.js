if(!self.define){let e,s={};const c=(c,a)=>(c=new URL(c+".js",a).href,s[c]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=c,e.onload=s,document.head.appendChild(e)}else e=c,importScripts(c),s()})).then((()=>{let e=s[c];if(!e)throw new Error(`Module ${c} didn’t register its module`);return e})));self.define=(a,i)=>{const r=e||("document"in self?document.currentScript.src:"")||location.href;if(s[r])return;let d={};const f=e=>c(e,r),n={module:{uri:r},exports:d,require:f};s[r]=Promise.all(a.map((e=>n[e]||f(e)))).then((e=>(i(...e),d)))}}define(["./workbox-37fde244"],(function(e){"use strict";e.setCacheNameDetails({prefix:"kbalance-quasar-pwa"}),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"assets/ErrorNotFound.14699959.js",revision:"8e4afb9ca51e1c8af2d618e70c1f7493"},{url:"assets/favicon.442a6445.ico",revision:"74076c96e38de70509672bd06d38ca5d"},{url:"assets/flUhRq6tzZclQEJ-Vdg-IuiaDsNa.fd84f88b.woff",revision:"3e1afe59fa075c9e04c436606b77f640"},{url:"assets/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.4a4dbc62.woff2",revision:"a4160421d2605545f69a4cd6cd642902"},{url:"assets/focusout.df7096de.js",revision:"f0e7d179f3cce87084b8d840c042a9a1"},{url:"assets/index.375b16e1.css",revision:"49dbdd32e24a9a801207209ae8e052ec"},{url:"assets/index.50a7c804.js",revision:"c24e969d2a97c0852c805d8cc55e9648"},{url:"assets/IndexPage.c63e55ef.css",revision:"d41d8cd98f00b204e9800998ecf8427e"},{url:"assets/IndexPage.e5510dce.js",revision:"54f5b959240428f49765f1f98975725b"},{url:"assets/KFOkCnqEu92Fr1MmgVxIIzQ.34e9582c.woff",revision:"4aa2e69855e3b83110a251c47fdd05fc"},{url:"assets/KFOlCnqEu92Fr1MmEU9fBBc-.9ce7f3ac.woff",revision:"40bcb2b8cc5ed94c4c21d06128e0e532"},{url:"assets/KFOlCnqEu92Fr1MmSU5fBBc-.bf14c7d7.woff",revision:"ea60988be8d6faebb4bc2a55b1f76e22"},{url:"assets/KFOlCnqEu92Fr1MmWUlfBBc-.e0fd57c0.woff",revision:"0774a8b7ca338dc1aba5a0ec8f2b9454"},{url:"assets/KFOlCnqEu92Fr1MmYUtfBBc-.f6537e32.woff",revision:"bcb7c7e2499a055f0e2f93203bdb282b"},{url:"assets/KFOmCnqEu92Fr1Mu4mxM.f2abf7fb.woff",revision:"d3907d0ccd03b1134c24d3bcaf05b698"},{url:"assets/LoginPage.a8ad0fb8.js",revision:"70553a4e02888b3ce6268db5aaabb358"},{url:"assets/MainLayout.f6ba25d5.js",revision:"a6d0dc9105e02579b07a0adc3249593f"},{url:"assets/NewSheetWizardPage.53057240.js",revision:"f5be3c919cf25d3f539266853111eec7"},{url:"assets/PeopleDropdown.86f5b369.js",revision:"e05667d7e1021c5d7ec1ade2a1c81ad0"},{url:"assets/PeopleList.26590b59.js",revision:"a2cda64131f78acdfd5b1ff0daf0febb"},{url:"assets/PeoplePage.5ce2cb0a.js",revision:"0b28803ee3df15df27383c6c7e9fb73f"},{url:"assets/PersonItem.59cd2e1e.js",revision:"fed775a59124bfd461c86d3f2a86da8e"},{url:"assets/plugin-vue_export-helper.21dcd24c.js",revision:"b29b145139fc88e89a46af507277557d"},{url:"assets/QCardActions.b588d04c.js",revision:"a19cff6ec96ac052df51d2dbb0779daf"},{url:"assets/QDialog.20c04d79.js",revision:"529044a9b45475f3da5eb3ab6b9c1a40"},{url:"assets/QForm.5c9450b6.js",revision:"e7e3381ae3d58d84abd51632b717de72"},{url:"assets/QMenu.e3f85e23.js",revision:"b72b9bb588cd01abb3c5c5ef87143a43"},{url:"assets/QPage.b3392042.js",revision:"c2ac09a5db22382089e6cdd9b82e038c"},{url:"assets/QResizeObserver.fbdfada7.js",revision:"b49b00df14139c9b48275b3cab8ce908"},{url:"assets/QSlideItem.bf054405.js",revision:"4ce10a98837a90c2148e7e8be59193b8"},{url:"assets/QSpace.dda431fb.js",revision:"122a137b6cd8d0cf589f0447615066ee"},{url:"assets/QToolbarTitle.c1bd9871.js",revision:"c8b3b93215dd381c61eb2e18e132c4f1"},{url:"assets/ReceiveString.23f2e125.js",revision:"7931728a547af7c82c43003c0c73c9c3"},{url:"assets/rtl.276c3f1b.js",revision:"528db8ee9db59534c84c8fe3314e1c7c"},{url:"assets/scroll.cb0d4134.js",revision:"5440324b2cd10218bec8d4415e365cbd"},{url:"assets/SettingsPage.83ada33b.js",revision:"98a4594f9c2d72eb185298efbd302502"},{url:"assets/ShareString.528e7b02.js",revision:"3681891081138660f3d9d67a8066985b"},{url:"assets/SheetPage.fea85ace.js",revision:"6ba9e3a07761e48f906e89471f4cd581"},{url:"assets/TransactionPage.ddf9854c.js",revision:"3a3a0aed0c8bdc82fc65274d6aa6605e"},{url:"favicon.ico",revision:"74076c96e38de70509672bd06d38ca5d"},{url:"icons/apple-icon-120x120.png",revision:"d082235f6e6d2109e84e397f66fa868d"},{url:"icons/apple-icon-152x152.png",revision:"3c728ce3e709b7395be487becf76283a"},{url:"icons/apple-icon-167x167.png",revision:"3fec89672a18e4b402ede58646917c2d"},{url:"icons/apple-icon-180x180.png",revision:"aa47843bd47f34b7ca4b99f65dd25955"},{url:"icons/icon-128x128.png",revision:"ab92df0270f054ca388127c9703a4911"},{url:"icons/icon-192x192.png",revision:"16627987653342ccf2299c0ab32b9a65"},{url:"icons/icon-256x256.png",revision:"cf5ad3498fb6fda43bdafd3c6ce9b824"},{url:"icons/icon-384x384.png",revision:"fdfc1b3612b6833a27a7b260c9990247"},{url:"icons/icon-512x512.png",revision:"094098ff02b33b07ed719c9433a6be97"},{url:"icons/ms-icon-144x144.png",revision:"8de1b0e67a62b881cd22d935f102a0e6"},{url:"icons/safari-pinned-tab.svg",revision:"3e4c3730b00c89591de9505efb73afd3"},{url:"index.html",revision:"976a8991bc7e90ad6d4852739c0046ba"},{url:"manifest.json",revision:"31bef8834254853f9480417317171f1b"},{url:"screenshots/screenshot-1.jpeg",revision:"fb3ce7d5fa12822be1868cfe5ced7b6d"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html"),{denylist:[/sw\.js$/,/workbox-(.)*\.js$/]}))}));
