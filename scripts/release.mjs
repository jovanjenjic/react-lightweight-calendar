#!/usr/bin/env node
/**
 * Release script for react-lightweight-calendar.
 *
 *   npm run release -- <patch|minor|major> [--dry-run] [--yes] [--no-push] [--skip-install]
 *
 * 1. Preflight: Node version, git branch/clean tree/in sync with origin, npm login,
 *    next version not taken on npm or as a git tag.
 * 2. Checks: clean install, typecheck, lint, Cypress tests, build, runtime audit,
 *    package contents.
 * 3. Bumps the version, asks for confirmation, publishes to npm.
 * 4. Commits the bump, tags vX.Y.Z and pushes both to origin.
 *
 * Nothing is published, committed or pushed with --dry-run, and package.json is restored.
 */
import { execFileSync, spawnSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { createInterface } from 'node:readline/promises';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const RELEASE_BRANCH = 'master';
const REMOTE = 'origin';
const MIN_NODE_MAJOR = 22;
// `npm publish` outside this script is blocked by the `prepublishOnly` guard.
const GUARD_ENV = 'CALENDAR_RELEASE';
const BUMP_TYPES = ['patch', 'minor', 'major'];
const IS_WINDOWS = process.platform === 'win32';

const color = (code) => (text) =>
  process.stdout.isTTY ? `\x1b[${code}m${text}\x1b[0m` : text;
const bold = color('1');
const green = color('32');
const yellow = color('33');
const red = color('31');
const dim = color('2');

class ReleaseError extends Error {}

// ---------------------------------------------------------------------------
// helpers

function run(cmd, args, { env } = {}) {
  console.log(dim(`$ ${cmd} ${args.join(' ')}`));
  const result = spawnSync(cmd, args, {
    cwd: ROOT,
    stdio: 'inherit',
    shell: IS_WINDOWS,
    env: { ...process.env, ...env },
  });
  if (result.status !== 0) {
    throw new ReleaseError(`"${cmd} ${args.join(' ')}" failed.`);
  }
}

function capture(cmd, args) {
  return execFileSync(cmd, args, {
    cwd: ROOT,
    encoding: 'utf8',
    shell: IS_WINDOWS,
    stdio: ['ignore', 'pipe', 'pipe'],
  }).trimEnd();
}

function tryCapture(cmd, args) {
  try {
    return { ok: true, out: capture(cmd, args) };
  } catch (error) {
    return {
      ok: false,
      out: `${error.stdout ?? ''}${error.stderr ?? ''}`.trim(),
    };
  }
}

let stepNo = 0;
function step(title) {
  stepNo += 1;
  console.log(`\n${bold(`[${stepNo}] ${title}`)}`);
}

const warn = (msg) => console.log(yellow(`! ${msg}`));
const ok = (msg) => console.log(green(`✔ ${msg}`));

function parseVersion(version) {
  const match = /^(\d+)\.(\d+)\.(\d+)$/.exec(version);
  if (!match) {
    throw new ReleaseError(
      `Unsupported version "${version}" (expected X.Y.Z).`,
    );
  }
  return match.slice(1).map(Number);
}

function compareVersions(a, b) {
  const [pa, pb] = [parseVersion(a), parseVersion(b)];
  for (let i = 0; i < 3; i += 1) {
    if (pa[i] !== pb[i]) return pa[i] - pb[i];
  }
  return 0;
}

function bumpVersion(version, type) {
  const [major, minor, patch] = parseVersion(version);
  if (type === 'major') return `${major + 1}.0.0`;
  if (type === 'minor') return `${major}.${minor + 1}.0`;
  return `${major}.${minor}.${patch + 1}`;
}

function readPackage() {
  return JSON.parse(readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
}

function publishedVersions(name) {
  const res = tryCapture('npm', ['view', name, 'versions', '--json']);
  if (!res.ok) {
    if (/E404/.test(res.out)) return [];
    throw new ReleaseError(
      `Could not read published versions from npm:\n${res.out}`,
    );
  }
  const versions = JSON.parse(res.out);
  return (Array.isArray(versions) ? versions : [versions]).filter((v) =>
    /^\d+\.\d+\.\d+$/.test(v),
  );
}

async function confirm(question) {
  if (!process.stdin.isTTY) {
    throw new ReleaseError(
      'No terminal to confirm in. Re-run with --yes to publish.',
    );
  }
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const answer = await rl.question(`${bold(question)} (y/N) `);
  rl.close();
  return /^y(es)?$/i.test(answer.trim());
}

function usage() {
  console.log(`Usage: npm run release -- <${BUMP_TYPES.join('|')}> [options]

Options:
  --dry-run       Run every check and "npm publish --dry-run"; publish/commit/push nothing.
  --yes           Do not ask for confirmation before publishing.
  --no-push       Publish, commit and tag, but do not push to ${REMOTE}.
  --skip-install  Skip the clean "npm ci" install.
  --help          Show this help.`);
}

// ---------------------------------------------------------------------------
// prepublishOnly guard: block plain `npm publish`

if (process.argv.includes('--guard')) {
  if (process.env[GUARD_ENV] !== '1') {
    console.error(
      red(
        'Publishing is done by the release script, which runs all checks first:',
      ),
    );
    console.error('  npm run release -- <patch|minor|major>');
    process.exit(1);
  }
  process.exit(0);
}

// ---------------------------------------------------------------------------
// main

async function main() {
  const args = process.argv.slice(2);
  if (args.includes('--help') || args.includes('-h')) {
    usage();
    return;
  }

  const known = new Set([
    ...BUMP_TYPES,
    '--dry-run',
    '--yes',
    '--no-push',
    '--skip-install',
  ]);
  const unknown = args.filter((a) => !known.has(a));
  const types = args.filter((a) => BUMP_TYPES.includes(a));
  if (unknown.length || types.length !== 1) {
    usage();
    throw new ReleaseError(
      unknown.length
        ? `Unknown argument(s): ${unknown.join(', ')}`
        : 'Pass exactly one of: patch, minor, major.',
    );
  }
  const type = types[0];
  const dryRun = args.includes('--dry-run');
  const autoYes = args.includes('--yes');
  const push = !args.includes('--no-push');
  const install = !args.includes('--skip-install');

  // In a dry run, preflight problems are reported but do not stop the checks.
  const fail = (msg) => {
    if (dryRun) warn(`${msg} (ignored in --dry-run)`);
    else throw new ReleaseError(msg);
  };

  console.log(bold(`Release: ${type}${dryRun ? ' (dry run)' : ''}`));

  // 1. preflight ------------------------------------------------------------
  step('Preflight');

  const nodeMajor = Number(process.versions.node.split('.')[0]);
  if (nodeMajor < MIN_NODE_MAJOR) {
    throw new ReleaseError(
      `Node ${process.versions.node} is too old; need ${MIN_NODE_MAJOR}+. Run "nvm use".`,
    );
  }
  ok(`Node ${process.versions.node}`);

  const branch = capture('git', ['rev-parse', '--abbrev-ref', 'HEAD']);
  if (branch !== RELEASE_BRANCH)
    fail(`On branch "${branch}", releases go from "${RELEASE_BRANCH}".`);
  else ok(`On ${RELEASE_BRANCH}`);

  const dirty = capture('git', ['status', '--porcelain']);
  if (dirty) fail(`Working tree has uncommitted changes:\n${dirty}`);
  else ok('Working tree clean');

  run('git', ['fetch', REMOTE, RELEASE_BRANCH, '--tags', '--quiet']);
  const behind = Number(
    capture('git', [
      'rev-list',
      '--count',
      `HEAD..${REMOTE}/${RELEASE_BRANCH}`,
    ]),
  );
  const ahead = Number(
    capture('git', [
      'rev-list',
      '--count',
      `${REMOTE}/${RELEASE_BRANCH}..HEAD`,
    ]),
  );
  if (behind > 0)
    fail(
      `Local ${branch} is ${behind} commit(s) behind ${REMOTE}/${RELEASE_BRANCH}. Pull first.`,
    );
  else if (ahead > 0)
    warn(
      `${ahead} local commit(s) not on ${REMOTE} yet; they will be pushed with the release.`,
    );
  else ok(`In sync with ${REMOTE}/${RELEASE_BRANCH}`);

  const pkg = readPackage();
  const whoami = tryCapture('npm', ['whoami']);
  if (!whoami.ok) {
    fail('Not logged in to npm (or the token expired). Run "npm login".');
  } else {
    const owners = tryCapture('npm', ['owner', 'ls', pkg.name]);
    if (
      owners.ok &&
      !owners.out.split('\n').some((l) => l.split(' ')[0] === whoami.out)
    ) {
      fail(`npm user "${whoami.out}" is not an owner of ${pkg.name}.`);
    } else {
      ok(`npm user: ${whoami.out}`);
    }
  }

  const published = publishedVersions(pkg.name);
  const latestPublished = published.sort(compareVersions).at(-1);
  let base = pkg.version;
  if (latestPublished && compareVersions(latestPublished, base) > 0) {
    warn(
      `package.json has ${base} but npm already has ${latestPublished}; bumping from ${latestPublished}.`,
    );
    base = latestPublished;
  }
  const next = bumpVersion(base, type);
  const tag = `v${next}`;
  if (published.includes(next))
    throw new ReleaseError(`${pkg.name}@${next} is already on npm.`);
  if (
    tryCapture('git', ['rev-parse', '-q', '--verify', `refs/tags/${tag}`]).ok
  ) {
    throw new ReleaseError(`Git tag ${tag} already exists.`);
  }
  ok(`Next version: ${bold(`${base} -> ${next}`)}`);

  // 2. checks ---------------------------------------------------------------
  if (install) {
    step('Clean install (npm ci)');
    run('npm', ['ci', '--no-audit', '--no-fund']);
  }

  step('Typecheck');
  run('npm', ['run', 'typecheck']);

  step('Lint');
  run('npm', ['run', 'lint']);

  step('Tests (Cypress component tests)');
  run('npm', ['test']);

  step('Build');
  run('npm', ['run', 'build']);

  step('Audit runtime dependencies');
  run('npm', ['audit', '--omit=dev', '--audit-level=high']);

  step('Package contents');
  const [packInfo] = JSON.parse(
    capture('npm', ['pack', '--dry-run', '--json', '--ignore-scripts']),
  );
  const packed = new Set(packInfo.files.map((f) => f.path));
  // Every file an entry point refers to: main/types/module plus all `exports` targets.
  const exportTargets = (value) =>
    typeof value === 'string'
      ? [value]
      : Object.values(value ?? {}).flatMap(exportTargets);
  const required = [
    pkg.main,
    pkg.types,
    pkg.module,
    ...exportTargets(pkg.exports),
    'dist/styles/styles.css',
  ]
    .filter((p) => p && !p.includes('*') && !p.endsWith('package.json'))
    .map((p) => p.replace(/^\.\//, ''));
  const missing = required.filter(
    (p) => !packed.has(p) || !existsSync(path.join(ROOT, p)),
  );
  if (missing.length)
    throw new ReleaseError(`Package is missing: ${missing.join(', ')}`);
  ok(
    `${packInfo.files.length} files, ${(packInfo.size / 1024).toFixed(1)} kB packed`,
  );

  // 3. bump + publish ---------------------------------------------------------
  step(`Bump version to ${next}`);
  const versionFiles = ['package.json', 'package-lock.json'].map((f) =>
    path.join(ROOT, f),
  );
  const originals = versionFiles.map((f) => readFileSync(f, 'utf8'));
  const restoreVersionFiles = () =>
    versionFiles.forEach((f, i) => writeFileSync(f, originals[i]));

  let publishedNow = false;
  try {
    run('npm', [
      'version',
      next,
      '--no-git-tag-version',
      '--allow-same-version',
    ]);

    if (dryRun) {
      step('Publish (dry run)');
      run('npm', ['publish', '--dry-run'], { env: { [GUARD_ENV]: '1' } });
      restoreVersionFiles();
      console.log(
        `\n${green(bold(`Dry run OK: ${pkg.name}@${next} is ready to release.`))}`,
      );
      console.log(`Release for real with: npm run release -- ${type}`);
      return;
    }

    step('Publish');
    if (!autoYes && !(await confirm(`Publish ${pkg.name}@${next} to npm?`))) {
      restoreVersionFiles();
      console.log(yellow('Cancelled. Nothing was published.'));
      return;
    }
    run('npm', ['publish'], { env: { [GUARD_ENV]: '1' } });
    publishedNow = true;
    ok(`Published ${pkg.name}@${next}`);
  } finally {
    if (!publishedNow && !dryRun) restoreVersionFiles();
  }

  // 4. commit, tag, push ------------------------------------------------------
  step(`Commit and tag ${tag}`);
  run('git', ['add', 'package.json', 'package-lock.json']);
  run('git', ['commit', '-m', `chore(release): ${tag}`]);
  run('git', ['tag', '-a', tag, '-m', tag]);

  if (push) {
    step(`Push to ${REMOTE}`);
    try {
      run('git', ['push', '--atomic', REMOTE, RELEASE_BRANCH, tag]);
    } catch {
      throw new ReleaseError(
        `${pkg.name}@${next} IS published, but the push failed. Push manually:\n` +
          `  git push --atomic ${REMOTE} ${RELEASE_BRANCH} ${tag}`,
      );
    }
  } else {
    warn(
      `Not pushed. Push later with: git push --atomic ${REMOTE} ${RELEASE_BRANCH} ${tag}`,
    );
  }

  console.log(`\n${green(bold(`Released ${pkg.name}@${next}`))}`);
  console.log(`https://www.npmjs.com/package/${pkg.name}/v/${next}`);
}

main().catch((error) => {
  console.error(`\n${red(bold('Release aborted:'))} ${error.message}`);
  if (!(error instanceof ReleaseError)) console.error(error);
  process.exit(1);
});
