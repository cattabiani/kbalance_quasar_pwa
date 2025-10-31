import { route } from 'quasar/wrappers';
import { createRouter, createWebHashHistory } from 'vue-router';
import routes from './routes';
import { useStore } from 'src/stores/store';

export default route(() => {
  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createWebHashHistory(), // always hash mode
  });

  const store = useStore();
  let isInit = true;

  Router.beforeEach(async (to, from, next) => {
    if (isInit) {
      await store.init();
      isInit = false;
    }

    if (
      to.matched.some((r) => r.meta.requiresFirebase) &&
      !store.firebaseReady
    ) {
      next({ name: 'SettingsPage' });
    } else if (
      to.matched.some((r) => r.meta.requiresAuth) &&
      !store.isReady()
    ) {
      next({ name: 'LoginPage' });
    } else if (to.matched.some((r) => r.meta.requiresSheet) && !store.isSheet) {
      next({ name: 'IndexPage' });
    } else {
      next();
    }
  });

  return Router;
});
