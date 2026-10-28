# Private-preview interlude developer handoff

**Current: PV-A1 corrective candidate frozen for same-reviewer re-review.** The
original candidate was subsequently cleared and pushed as `b4a2c75`, then real
activation failed on the lingering manager's missing Docker supplementary group.
The existing installed container/runtime/state are preserved; timer and
Tailscale remain disabled. See the corrective handoff appended below.

## Original developer handoff (historical)

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

## PV-A1 corrective handoff

Baseline: `b4a2c75457d26cbad94c82949f827396f812d8d9`. Only the coordinator's
activation-finding append in `reviews/private-preview.md` was initially dirty;
that append and all original clearance/post-review evidence are preserved.
No app/content, dependency versions or coverage policy changed.

### Fix and rationale

Removed Docker from updater health checks rather than using `sg` to acquire a
powerful, otherwise unnecessary group. Both candidate and current checks now
use identical binary-safe HTTP revision/index/asset verification. Docker binds
current to `127.0.0.1:4183` and candidate to `127.0.0.1:4184`; only current may
be a Tailscale target. Both ports are checked for conflicts before installation/
container creation. NGINX listens on 8081 inside its isolated container so the
loopback host mapping reaches it. No Docker socket, capabilities or mutable
serving mounts were added.

Changed production files: `deploy/{io,server,install,cli}.js` and `nginx.conf`.
`update.js`, release promotion/rollback, lock, timer/service definitions and all
app code remain unchanged. Tests extend `private-preview.test.js` and
`private-preview-docker.js`; `private-preview-service.js` adds the exact legacy
failure and corrected real-service regression. One npm command selects it.
No metric exception or additional dependency is needed.

The [operations guide](private-preview.md#pv-a1-existing-install-migration-coordinator-only)
contains a guarded, reversible migration for the failed existing installation:
stage reviewed runtime, stop only HexY units/container, retain the old container
and runtime under explicit names, replace runtime, recreate only HexY with both
loopback mappings, and first verify the real user service. Keep all release/
asset state; do not rerun `install`, restart the manager, alter groups/socket
permissions, or enable timer/Tailscale before real activation checks.
**The developer did not perform this live migration.**

### Actual service-context evidence

`npm run test:preview:service` used one named, bounded `systemd-run --user`
transient service with the existing manager's inherited groups, not `sg`, root,
or the interactive shell's Docker group. Inside that service:

1. The original `b4a2c75` candidate probe, loaded unchanged from Git, failed
   with Docker socket permission denied, reproducing PV-A1.
2. The corrected candidate HTTP probe succeeded with exactly the same groups.
3. The real updater fetched main, installed locked build tools, built, checked
   candidate bytes, promoted and verified live bytes: `status=0/SUCCESS`.

Real revisions: fetched main ancestor `7e01b7f` to main `b4a2c75`. The real
Chromium game stayed open with no navigation or localStorage change; old assets,
manual recovery, rollback and injected post-switch failure also passed.
The service uses isolated test ports (4185/4186 and proxy 4187); only health
endpoint numbers differ from production. No build/engine/Docker permission was
mocked. The owned transient unit was collected and test container removed.
This regression is explicitly host-specific: its original-failure assertion
requires the stale-manager/no-Docker-access precondition.

Log: `.artifacts/private-preview-pva1-service.log`. Final focused suite:
**35/35 PASS**, including added current/candidate binary HTTP verification,
HTTP failure rejection and occupied-candidate-port protection.
Log: `.artifacts/private-preview-pva1-focused.log`.

### Final corrective gates and freeze

All passed on the final code, with the full application checks/browser suite
run sequentially after deployment-specific validation:

```sh
npm run test:preview
LD_LIBRARY_PATH="$PWD/.artifacts/browser-libs/usr/lib/x86_64-linux-gnu" npm run test:preview:service
LD_LIBRARY_PATH="$PWD/.artifacts/browser-libs/usr/lib/x86_64-linux-gnu" npm run test:preview:docker
TMPDIR="$PWD/.artifacts" npm run check
LD_LIBRARY_PATH="$PWD/.artifacts/browser-libs/usr/lib/x86_64-linux-gnu" npm run test:browser
git diff --check
```

Results: **35 focused tests; both real Docker/service integrations; 250 unit/DOM
tests in 19 files; 143 Chromium journeys (4.7m)**. Format/lint/JSDoc/build and
all 47-source coverage gates pass, with exact fractions unchanged from the
table above. Logs: `.artifacts/private-preview-pva1-{focused,service,docker,check,browser}.log`.
Both documented migration/recovery shell blocks also passed `bash -n` via stdin
without execution.

Closure checks: all installed runtime/config bytes still exactly match pushed
`b4a2c75`; original failed status remains `served: null` with its Docker permission
error. Existing live container ID/start time and admin ID/start/restart count
match their pre-correction evidence. Timer remains inactive/disabled; Serve
remains `{}`. Owned transient units/test containers are gone. Ports 4182 and
4184–4187 are closed; only the coordinator's unchanged 4183 container remains.
No commits, pushes, live migration, new grants, socket changes, manager restart
or admin operation occurred.

After-writing manifests:
`.artifacts/private-preview-pva1-snapshot.sha256` (changed/new corrective files)
and `.artifacts/private-preview-snapshot.sha256` (complete canonical deliverable
set). The preceding canonical manifest is preserved as
`.artifacts/private-preview-before-pva1-snapshot.sha256`.
Next: the same independent reviewer; coordinator post-review checks and push;
only then the documented existing-install migration and real HTTPS/timer/push
verification. PV-A1 operational clearance remains pending. Developer stops writing.
