import { route } from 'quasar/wrappers';
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from 'vue-router';
import routes from './routes';
import { useStore } from 'src/stores/store';
import { useQuasar } from 'quasar';

export default route(() => {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
    ? createWebHistory
    : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });

  const store = useStore();
  let isInit = true;

  // Protect routes with an auth check
  Router.beforeEach(async (to, from, next) => {
    if (isInit) {
      await store.init();
      isInit = false;
    }

    if (
      to.matched.some((record) => record.meta.requiresFirebase) &&
      !store.firebaseReady
    ) {
      next({ name: 'SettingsPage' });
    } else if (
      to.matched.some((record) => record.meta.requiresAuth) &&
      !store.isReady()
    ) {
      next({ name: 'LoginPage' });
    } else if (
      to.matched.some((record) => record.meta.requiresSheet) &&
      !store.isSheet
    ) {
      next({ name: 'IndexPage' });
    } else {
      next();
    }
  });

  return Router;
});