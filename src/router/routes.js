const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        name: "IndexPage",
        component: () => import("pages/IndexPage.vue"),
        meta: { requiresAuth: true }, // Protect this route
      },
      {
        path: "SheetPage",
        name: "SheetPage",
        component: () => import("pages/SheetPage.vue"),
        meta: { requiresAuth: true }, // Protect this route
      },
      {
        path: "PeoplePage",
        name: "PeoplePage",
        component: () => import("pages/PeoplePage.vue"),
        meta: { requiresAuth: true }, // Protect this route
      },
      {
        path: "TransactionPage",
        name: "TransactionPage",
        component: () => import("pages/TransactionPage.vue"),
        meta: { requiresAuth: true }, // Protect this route
      },
      // {
      //   path: "/register",
      //   name: "RegisterPage",
      //   component: () => import("pages/RegisterPage.vue"),
      // },
      {
        path: "/login",
        name: "LoginPage",
        component: () => import("pages/LoginPage.vue"),
      },
    ],
  },
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
