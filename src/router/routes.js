const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        name: "IndexPage",
        component: () => import("pages/IndexPage.vue"),
        meta: { requiresAuth: true, requiresFirebase: true }, // Protect this route
      },
      {
        path: "/sheet",
        name: "SheetPage",
        component: () => import("pages/SheetPage.vue"),
        meta: { requiresAuth: true, requiresFirebase: true }, // Protect this route
      },
      {
        path: "/sheet/people",
        name: "PeoplePage",
        component: () => import("pages/PeoplePage.vue"),
        meta: { requiresAuth: true, requiresFirebase: true }, // Protect this route
      },
      {
        path: "/sheet/transaction",
        name: "TransactionPage",
        component: () => import("pages/TransactionPage.vue"),
        meta: { requiresAuth: true, requiresFirebase: true }, // Protect this route
      },
      {
        path: "/login",
        name: "LoginPage",
        component: () => import("pages/LoginPage.vue"),
      },
      {
        path: "/firebaseSettings",
        name: "FirebaseSettingsPage",
        component: () => import("pages/FirebaseSettingsPage.vue"),
      },
    ],
  },
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
