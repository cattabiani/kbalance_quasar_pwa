const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      {
        path: "",
        name: "IndexPage",
        component: () => import("pages/IndexPage.vue"),
      },
      {
        path: "SheetPage",
        name: "SheetPage",
        component: () => import("pages/SheetPage.vue"),
      },
      {
        path: "PeoplePage",
        name: "PeoplePage",
        component: () => import("pages/PeoplePage.vue"),
      },
      {
        path: "TransactionPage",
        name: "TransactionPage",
        component: () => import("pages/TransactionPage.vue"),
      },
      {
        path: "ResultsPage",
        name: "ResultsPage",
        component: () => import("pages/ResultsPage.vue"),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
