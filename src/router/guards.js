// Decide where a navigation should actually go.
// Returns a route location to redirect to, or null to let it proceed.
//
// `isInitialNavigation` is true only for the first navigation after the app
// starts. That is when we restore the sheet the user had open when they closed
// the app: the PWA always starts at '/', but the store has re-subscribed to the
// persisted currentSheetId, so we send the user straight back into it.
// Sub-pages of the sheet (transaction editing, settle, ...) are not restored:
// the user lands on the sheet itself.
export function resolveNavigation(to, store, isInitialNavigation = false) {
  const requires = (key) => to.matched.some((record) => record.meta[key]);

  if (requires('requiresFirebase') && !store.firebaseReady) {
    return { name: 'SettingsPage' };
  }
  if (requires('requiresAuth') && !store.isReady()) {
    return { name: 'LoginPage' };
  }
  if (requires('requiresSheet') && !store.isSheet) {
    return { name: 'IndexPage' };
  }
  if (
    isInitialNavigation &&
    store.isSheet &&
    to.name !== 'SheetPage' &&
    (to.name === 'IndexPage' || requires('requiresSheet'))
  ) {
    // also from a sub-page (e.g. half-edited transaction): the sheet is enough
    return { name: 'SheetPage' };
  }
  return null;
}
