import { describe, it, expect } from 'vitest';
import { createRouter, createMemoryHistory } from 'vue-router';
import routes from 'src/router/routes';
import { resolveNavigation } from 'src/router/guards';

// resolve() matches against the real route table (and its meta flags)
// without loading any page component
const router = createRouter({ history: createMemoryHistory(), routes });
const to = (name) => router.resolve({ name });

const makeStore = ({
  firebaseReady = true,
  loggedIn = true,
  isSheet = false,
} = {}) => ({
  firebaseReady,
  isSheet,
  isReady: () => firebaseReady && loggedIn,
});

describe('restoring the last open sheet on app start', () => {
  it('opens the sheet that was open when the app was closed', () => {
    const store = makeStore({ isSheet: true });
    expect(resolveNavigation(to('IndexPage'), store, true)).toEqual({
      name: 'SheetPage',
    });
  });

  it('opens the sheet list when no sheet was open', () => {
    const store = makeStore({ isSheet: false });
    expect(resolveNavigation(to('IndexPage'), store, true)).toBeNull();
  });

  it('lets the user go back to the sheet list after the restore', () => {
    const store = makeStore({ isSheet: true });
    expect(resolveNavigation(to('IndexPage'), store, false)).toBeNull();
  });

  it.each(['TransactionPage', 'SettlePage', 'ConvertPage', 'PeoplePage'])(
    'opens the sheet itself, not %s, when the app starts there',
    (page) => {
      const store = makeStore({ isSheet: true });
      expect(resolveNavigation(to(page), store, true)).toEqual({
        name: 'SheetPage',
      });
    },
  );

  it('does not redirect the sheet page to itself', () => {
    const store = makeStore({ isSheet: true });
    expect(resolveNavigation(to('SheetPage'), store, true)).toBeNull();
  });

  it('does not hijack non-sheet pages on app start', () => {
    const store = makeStore({ isSheet: true });
    expect(resolveNavigation(to('SettingsPage'), store, true)).toBeNull();
  });

  it('goes to login when not logged in, even with a remembered sheet', () => {
    const store = makeStore({ loggedIn: false, isSheet: true });
    expect(resolveNavigation(to('IndexPage'), store, true)).toEqual({
      name: 'LoginPage',
    });
  });

  it('goes to settings when firebase is not configured', () => {
    const store = makeStore({ firebaseReady: false, isSheet: true });
    expect(resolveNavigation(to('IndexPage'), store, true)).toEqual({
      name: 'SettingsPage',
    });
  });
});

describe('route protection', () => {
  it('sends sheet pages back to the list when no sheet is loaded', () => {
    const store = makeStore({ isSheet: false });
    expect(resolveNavigation(to('SheetPage'), store)).toEqual({
      name: 'IndexPage',
    });
  });

  it('lets public pages through', () => {
    const store = makeStore({ firebaseReady: false, loggedIn: false });
    expect(resolveNavigation(to('SettingsPage'), store)).toBeNull();
    expect(resolveNavigation(to('LandingPage'), store)).toBeNull();
  });
});
