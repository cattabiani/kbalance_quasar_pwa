# Working on kBalance

This is a solo/personal project. Default workflow:

- Commit directly to `main`. No feature branches needed for routine work
  (bug fixes, small features, refactors, config changes).
- Only create a branch for big/risky features, at the user's request.
- Run `npm run lint` and `npm run test` before committing; keep both green.
- The user tests changes manually in the browser before or after commit —
  flag anything that needs manual verification (UI behavior, Firebase
  interactions) rather than assuming it works from tests alone.
