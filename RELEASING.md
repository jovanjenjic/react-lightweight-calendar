# Releasing

Releases are published to npm by one command. It runs every check first and
publishes only if all of them pass.

```bash
nvm use                       # Node 24 (see .nvmrc)
npm login                     # once, or when the npm token expires
npm run release -- patch      # or: minor, major
```

npm requires two-factor authentication to publish. Enable it once on your npm
account (authenticator app, mode "Authorization and writes"):
https://www.npmjs.com/settings/~/tfa or `npm profile enable-2fa auth-and-writes`.
When the script asks for a code, enter the 6-digit code from the authenticator
app. The 8-digit code npm emails you at login does not work for publishing.

Shortcuts: `npm run release:patch`, `npm run release:minor`, `npm run release:major`.

## What the script does

1. **Preflight**: Node 22+, on `master`, clean working tree, in sync with
   `origin/master`, logged in to npm as a package owner. The next version is
   bumped from whichever is higher, `package.json` or the latest version on npm,
   and must not exist yet on npm or as a git tag.
2. **Checks**: `npm ci`, typecheck, lint, Cypress component tests, build,
   `npm audit` of runtime dependencies, and a check that every entry point in
   `package.json` is in the package.
3. **Publish**: bumps `package.json` and `package-lock.json`, asks for
   confirmation, then runs `npm publish`. If anything fails before the publish,
   the version files are restored.
4. **Git**: commits `chore(release): vX.Y.Z`, tags `vX.Y.Z` and pushes both to
   `origin`.

## Options

| Option             | Effect                                                                                |
| ------------------ | ------------------------------------------------------------------------------------- |
| `--dry-run`        | Runs everything with `npm publish --dry-run`; changes nothing.                        |
| `--yes`            | Skips the confirmation prompt.                                                        |
| `--no-push`        | Commits and tags locally but does not push.                                           |
| `--skip-install`   | Skips the clean `npm ci` install.                                                     |
| `--skip-2fa-check` | Allows publishing without 2FA on the account, for a granular token with "bypass 2FA". |

Example: `npm run release -- minor --dry-run`

Running `npm publish` directly is blocked by the `prepublishOnly` guard, so a
release always goes through these checks.
