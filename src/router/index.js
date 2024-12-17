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
      console.log("I call init!")
      await store.init();
      console.log("done!", store.isFbActive)
    }

    if (
      to.matched.some((record) => record.meta.requiresFirebase) &&
      !store.isFbActive
    ) {
      console.log("go to firebase")
      next({ name: "FirebaseSettingsPage" });
    } else if (
      to.matched.some((record) => record.meta.requiresAuth) &&
      !store.isReady
    ) {
      console.log("go to index")
      next({ name: "LoginPage" });
    } else {
      next();
    }

    // if (to.name === "FirebaseSettingsPage") {
    //   next();
    // }
    // else {
      
    // }
    // // Wait until the auth state is determined
    // await store.init();

    // const isAuthenticated = store.isReady && !!auth.currentUser; // Check if the user is logged in
    // if (
    //   to.matched.some((record) => record.meta.requiresAuth) &&
    //   !isAuthenticated
    // ) {
    //   next({ name: "LoginPage" }); // Redirect to login if not authenticated
    // } else {
    //   next(); // Proceed as normal
    // }
  });

  return Router;
});
