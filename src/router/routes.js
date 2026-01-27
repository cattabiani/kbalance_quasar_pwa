const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '/',
        name: 'IndexPage',
        component: () => import('pages/IndexPage.vue'),
        meta: { requiresAuth: true, requiresFirebase: true }, // Protect this route
      },
      {
        path: '/newSheetWizard',
        name: 'NewSheetWizardPage',
        component: () => import('pages/NewSheetWizardPage.vue'),
        meta: { requiresAuth: true, requiresFirebase: true }, // Protect this route
      },
      {
        path: '/sheet',
        name: 'SheetPage',
        component: () => import('pages/SheetPage.vue'),
        meta: {
          requiresAuth: true,
          requiresFirebase: true,
          requiresSheet: true,
        }, // Protect this route
      },
      {
        path: '/sheet/convert',
        name: 'ConvertPage',
        component: () => import('pages/ConvertPage.vue'),
        meta: {
          requiresAuth: true,
          requiresFirebase: true,
          requiresSheet: true,
        }, // Protect this route
      },
      {
        path: '/sheet/settle',
        name: 'SettlePage',
        component: () => import('pages/SettlePage.vue'),
        meta: {
          requiresAuth: true,
          requiresFirebase: true,
          requiresSheet: true,
        }, // Protect this route
      },
      {
        path: '/sheet/statistics',
        name: 'StatisticsPage',
        component: () => import('pages/StatisticsPage.vue'),
        meta: {
          requiresAuth: true,
          requiresFirebase: true,
          requiresSheet: true,
        }, // Protect this route
      },
      {
        path: '/conversionRatesSettings',
        name: 'ConversionRatesSettingsPage',
        component: () => import('pages/ConversionRatesSettingsPage.vue'),
        meta: {
          requiresAuth: true,
          requiresFirebase: true,
          requiresSheet: false,
        }, // Protect this route
      },
      {
        path: '/sheet/people',
        name: 'PeoplePage',
        component: () => import('pages/PeoplePage.vue'),
        meta: {
          requiresAuth: true,
          requiresFirebase: true,
          requiresSheet: true,
        }, // Protect this route
      },
      {
        path: '/sheet/transaction',
        name: 'TransactionPage',
        component: () => import('pages/TransactionPage.vue'),
        meta: {
          requiresAuth: true,
          requiresFirebase: true,
          requiresSheet: true,
        }, // Protect this route
      },
      {
        path: '/login',
        name: 'LoginPage',
        component: () => import('pages/LoginPage.vue'),
        meta: {
          requiresFirebase: true,
        }, // Protect this route
      },
      {
        path: '/settings',
        name: 'SettingsPage',
        component: () => import('pages/SettingsPage.vue'),
      },
      {
        path: '/landing',
        name: 'LandingPage',
        component: () => import('pages/LandingPage.vue'),
      },
    ],
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
