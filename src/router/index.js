import { route } from "quasar/wrappers";
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory,
} from "vue-router";
import routes from "./routes";
import { useStore } from "src/stores/store";
// import { auth } from "src/firebase/firebase";
// import { watch } from "vue";

export default route(() => {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === "history"
    ? createWebHistory
    : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });

  const store = useStore();
  let firstPass = true;

  console.log("TODO set watch");

  // // Watch the currentSheet in the store
  // watch(
  //   () => store.currentSheet,
  //   (newValue) => {
  //     if (newValue === null) {
  //       // If currentSheet is null, replace the path immediately to IndexPage
  //       Router.replace({ name: "IndexPage" });
  //     }
  //   },
  //   { immediate: true } // Ensure the watch runs immediately to react to the initial state
  // );

  // Protect routes with an auth check
  Router.beforeEach(async (to, from, next) => {
    if (firstPass) {
      firstPass = false;
      await store.init();
    }

    if (
      to.matched.some((record) => record.meta.requiresFirebase) &&
      !store.isFbActive()
    ) {
      next({ name: "FirebaseSettingsPage" });
    } else if (
      to.matched.some((record) => record.meta.requiresAuth) &&
      !store.isAuthenticated()
    ) {
      next({ name: "LoginPage" });
    } else {
      next();
    }
  });

  return Router;
});
