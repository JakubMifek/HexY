# Private-preview interlude developer handoff

Starting main: `7e01b7ff9b7427257651baaea7457d9ebe5d1b91`.
Scope: user-approved private Docker/Tailscale automatic-main preview before
phase 6, not public release. **Frozen for fresh review; not cleared or activated.**
Coordinator edits to `PLAN.md` and the phase ledger are preserved. No phase-5
source/content corrections, review reports or historical evidence were changed.

## Acceptance mapping and implementation

| Requirement                                | Implementation and evidence                                                                                                                                                                                         |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Only fetched pushed main; isolated builds  | `deploy/update.js`, `io.js`: fixed public HTTPS main ref, shallow disposable source, fresh locked dependencies, sanitized child environment; real fetched predecessor and current main built in Docker integration  |
| Periodic persistence without admin changes | `install.js`: scoped user service/timer, 60 s after completion, lingering manager prerequisite; `server.js`: private named container, restart policy, loopback-only port; no live unit/route installation performed |
| Locking, failures and recovery             | Kernel flock CLI; command/unit timeouts; status includes upstream/served/error; staged manifests, candidate and live HTTP health, atomic symlink/rollback and interrupted-promotion recovery                        |
| Immutable old assets and no forced reload  | Shared capped append-only hash store, `no-store` HTML/version and immutable assets; real old page continues its saved game through update, old URLs still work, manual reload retains locked pack and board         |
| `/hexy/` routing                           | Vite base plus native NGINX root; source-confirmed Serve prefix stripping reproduced by isolated test proxy; actual Tailscale HTTPS verification is a remaining activation gate                                     |
| Safe isolation and cleanup                 | Read-only UID 101 container with no caps/socket/source mounts; explicit owned paths, traversal/symlink rejection, bounded retained releases/assets, no unrelated cleanup or route replacement                       |
| Operational handoff                        | `docs/private-preview.md`: exact gated install/start, route, status, rollback, disable, quota and TLS-permission steps, references and limitations                                                                  |

Changed/new implementation: `deploy/{io,releases,server,update,install,cli}.js`
and `deploy/nginx.conf`. Durable tests:
`tests/private-preview{.test,-fixtures,-docker}.js`. npm scripts add focused unit
and Docker integration commands; JSDoc checking additionally includes `deploy/`.
README links operations and this handoff. No runtime dependency or app logic
change, and no coverage exclusion/policy change.

## Verification

- Focused failure-injection suite covers fetch/install/build and incomplete
  release rejection, exact last-good preservation, real kernel lock contention,
  interrupted promotion, rollback, source/current/asset symlinks, path traversal,
  hash collisions, quotas, retained assets, installation conflicts and public/
  overlapping Serve configuration rejection.
- Real Docker integration passed against fetched main ancestor
  `92659db1660856ade7c00b81952936f66d4c43e8` and pushed main `7e01b7f`.
  It checked actual native NGINX boundaries, both HTML URL forms, version/cache
  headers, real Chromium gameplay, update without navigation/storage mutation,
  old index assets, manual reload recovery and rollback/post-switch failure.
  Log: `.artifacts/preview-docker.log`; screenshot:
  `.artifacts/preview-docker-live-game.png`.
- Initial iterations exposed expected npm `.bin` symlinks during cleanup, test
  listener contention, browser-path initialization and normal recovery metadata
  rotation. Fixed cleanup without following symlinks, isolated test ports,
  initialized browser environment before import and asserted the existing
  session/revision recovery contract while preserving all gameplay/content.
  No app behavior/assertions were weakened; no browser/system packages installed.
- A real artifact-only installer smoke check also exposed systemd's nonzero
  exit for unmatched unit filters and its user-bus environment requirement.
  The installer now filters a successful complete unit listing, and only
  non-build commands receive the user-bus location. Real `install()` into owned
  `.artifacts/preview-install-*` directories and
  `systemd-analyze --user verify <generated.service> <generated.timer>` passed;
  those artifact-only units were removed without loading or starting them.
- Final `npm run test:preview`: **32/32 PASS**, log
  `.artifacts/preview-focused.log`.
- Final, sequential commands both **PASS**:
  `TMPDIR="$PWD/.artifacts" npm run check` (format/lint/types, **247 tests /
  19 files**, separate V8 gates and production build), then
  `LD_LIBRARY_PATH="$PWD/.artifacts/browser-libs/usr/lib/x86_64-linux-gnu" npm run test:browser`
  (**143/143 Chromium journeys, 4.7m**).
  Logs: `.artifacts/preview-{check,browser}.log`.
- `LD_LIBRARY_PATH="$PWD/.artifacts/browser-libs/usr/lib/x86_64-linux-gnu" npm run test:preview:docker`
  **PASS** on the final code before those full sequential checks.
- `node deploy/cli.js check-route`: **PASS**, read-only; no existing Serve route
  or 443 listener. `git diff --check`: **PASS**.

The deploy code is separately linted/JSDoc-checked and behavior-tested. Existing
application V8 scope remains all 47 executable modules (26 critical/21 remaining);
operational scripts are not misrepresented as app runtime coverage.

| Scope     | Lines              | Statements         | Functions      | Branches         |
| --------- | ------------------ | ------------------ | -------------- | ---------------- |
| Critical  | 2831/2842 (99.61%) | 2860/2871 (99.62%) | 211/211 (100%) | 880/901 (97.67%) |
| Remaining | 2488/2498 (99.60%) | 2503/2513 (99.60%) | 85/87 (97.70%) | 360/376 (95.74%) |

## Decisions and remaining gates

Native official NGINX `1.30.6-alpine-slim` is pinned by registry digest; its
two-clause BSD license and Alpine package notices remain upstream. No custom
production HTTP server, framework or new runtime package. Source references and
the exact image digest are in the operations guide and `deploy/io.js`.
No size/complexity exceptions are requested.

Keeping hashed assets until an explicit maintenance window is intentional:
automatic expiry cannot guarantee an arbitrarily long open game's dependencies.
At the documented quota, updates fail rather than silently break those games.
Transient npm install size follows the trusted lockfile, not a filesystem quota.

Next: fresh independent review; coordinator post-review full checks on the same
snapshot; authorized commit/push and remote verification; only then installation,
private HTTPS permission/route and automatic-after-push verification. Tailnet
TLS permission may need operator enablement; it was not requested or changed.
User timer/restart configuration is tested/configured in code, not claimed as
live reboot evidence. Actual shared-host reboot is outside this interlude's
developer permission. Phase 6 remains not started.

No persistent live container, user unit/timer, Tailscale route, Funnel, commit or
push was performed. All test containers use `restart=no` and are removed.
The existing admin application's identity/start time/restart count are unchanged.
Ports 4182–4186 are closed; no owned test container remains. No HexY user units
were installed in the user manager and Serve remains unconfigured. The approved
pinned NGINX image remains in Docker's cache; no global image cleanup was run.
Final frozen manifest: `.artifacts/private-preview-snapshot.sha256`, generated
after all tracked/untracked nonignored changes, including documentation.
