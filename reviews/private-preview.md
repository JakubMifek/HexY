# Private-preview independent review

Verdict: **CLEARED — implementation candidate only**.
Reviewer: `e7c0365b-20cc-4708-9db6-f2e5f95f7b2d`.
Developer: `bb8de96b-65d8-43be-bc43-57ba04fee357`.
Baseline: `7e01b7ff9b7427257651baaea7457d9ebe5d1b91`.
No blocker, major or minor findings; no exceptions.
Live activation and automatic-after-push proof remain required.

## Snapshot and acceptance

All 17 changed/new deliverables and relevant integration reviewed.
Changed manifest fingerprint:
`db20e9cb40a7ef6b18c0f1b03247733e64f0d34ed84efe57937ba63398c06801`.
Coordinator full-manifest fingerprint:
`a81df73574a06e29d7e4fb79c1fdbd6bf6283681e31e4bbbfbb49d7466264564`.
Both verified unchanged before/after review; no source/docs/test/config edits.

| Requirement                   | Independent evidence                                                                                                                                                     |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Pushed remote main only       | Fixed public HTTPS ref, fresh shallow repository, detached fetched revision, isolated locked install/build; actual predecessor/main builds passed.                       |
| Main advances during build    | Injected advance completes fetched revision, then newer main on next invocation; fetch failure never substitutes stale cache.                                            |
| Persistent scoped operation   | Artifact-only installation and real generated-unit verification passed; 60-second timer, bounded service/control-group lifetime and restart policy correct.              |
| Atomic last-good preservation | Candidate/live health, locking, pending recovery and exact rollback verified; extra first-promotion/null-previous crash probes passed.                                   |
| Safe paths and cleanup        | Scoped deletion, traversal/symlink rejection, immutable collisions, quotas and retention inspected; dangling installer/status-link probes preserved state.               |
| Serving and active games      | Real NGINX/Chromium integration verified prefix simulation, version/cache, old assets, unchanged open-game navigation/storage, exact locked-content reload and rollback. |
| Isolation                     | UID/GID 101, read-only root/mounts, dropped capabilities, loopback publication and no source/socket mounts confirmed. Overlapping/public routes rejected.                |
| Documentation                 | Installation/status/failure/rollback/disable instructions match implementation; live TLS, reboot and final public release not claimed.                                   |

## Six lenses

Correctness passes direct tracing, failure tests, independent edge probes and
real Docker/browser integration. Usability evidence includes the Docker-served
game screenshot, English/Czech dark-theme interactions and full both-theme/
language desktop/tablet browser regression coverage. Updates do not navigate
or mutate live game storage.

Readability: cohesive modules and explicit errors, deployment maxima 179 module
lines, 56 function lines, complexity 10, nesting 3. OOP: direct functions are
appropriate; no artificial classes/god object, and deployment resources remain
separate from serializable game state. Patterns: native filesystem, flock,
systemd and NGINX solve present requirements without a generic framework or
runtime dependency. Content/rights: prior content/reviews unchanged; official
NGINX image tag/digest, two-clause license and installed-version Tailscale prefix
stripping independently verified. No legal/public-release clearance inferred.

## Independent verification

- `npm run test:preview`: 32/32 passed.
- Documented `npm run test:preview:docker`: real integration passed.
- Artifact-only install and `systemd-analyze --user verify`: passed without
  loading live units.
- `node deploy/cli.js check-route`: passed.
- Full sequential `TMPDIR="$PWD/.artifacts" npm run check`, documented
  Chromium suite and `git diff --check`: passed, **247 tests / 19 files**,
  **143 browser journeys**, formatting/lint/types/build.
- Ten negative coverage/membership probes rejected deficient reports;
  coverage restored byte-for-byte.

| Application scope     | Lines              | Statements         | Functions      | Branches         |
| --------------------- | ------------------ | ------------------ | -------------- | ---------------- |
| Critical, 26 modules  | 2831/2842 (99.61%) | 2860/2871 (99.62%) | 211/211 (100%) | 880/901 (97.67%) |
| Remaining, 21 modules | 2488/2498 (99.60%) | 2503/2513 (99.60%) | 85/87 (97.70%) | 360/376 (95.74%) |

All 47 executable app modules included; only type-only declarations excluded.
Deployment scripts are separately linted/typechecked/tested, not claimed as
app V8 coverage. Logs:
`.artifacts/private-preview-independent-{docker,check,browser}.log`.

Owned test resources removed; ports 4182–4186 closed. Serve remained empty,
no live HexY units installed. Existing admin container identity/start time/
restart count unchanged. No installations, delegation, commits or deployments.

## Coordinator post-review verification

Full frozen hashes matched before/after sequential:

```sh
LD_LIBRARY_PATH="$PWD/.artifacts/browser-libs/usr/lib/x86_64-linux-gnu" npm run test:preview:docker > .artifacts/private-preview-post-review-docker.log 2>&1
TMPDIR="$PWD/.artifacts" npm run check > .artifacts/private-preview-post-review-check.log 2>&1
LD_LIBRARY_PATH="$PWD/.artifacts/browser-libs/usr/lib/x86_64-linux-gnu" npm run test:browser > .artifacts/private-preview-post-review-browser.log 2>&1
git diff --check
```

All passed: real Docker update/rollback, 247 tests including 32 deployment cases,
143 browser journeys, format/lint/types/build. Measured app coverage exactly
matches the independent table above. No implementation changes after clearance;
only factual delivery documentation follows these checks.

Next: commit/push and remote verification, then approved private activation,
actual HTTPS/assets/revision verification and automatic refresh after a real
push. Hardware, actual shared-host reboot and public-release gates remain
separate. This report does not claim live deployment yet.

## Activation finding — PV-A1

Implementation committed/pushed as `b4a2c75457d26cbad94c82949f827396f812d8d9`.
Installation and isolated serving container start succeeded, but the first
real user-service update failed during candidate HTTP probing through
`docker exec`: permission denied on `/var/run/docker.sock`.

The interactive process and configured account have Docker group 989; the
already-running lingering user manager does not. Artifact-only unit verification
and interactive Docker tests did not exercise this runtime distinction.
Status correctly reports fetched upstream and `served: null`; no Tailscale
route or timer was enabled. No release was falsely declared served.

This reopens operational readiness. Correct only HexY's installation/probing
arrangement, add focused regression and actual user-service evidence, then
obtain same-reviewer re-review and post-review verification. Do not restart the
shared user manager, alter Docker socket permissions or touch the admin service.
Existing installed HexY state/container must be handled explicitly, not deleted
or silently overwritten. Phase 6 remains paused.

### PV-A1 developer response — corrective candidate

Removed the updater's Docker dependency: candidate and current health now both
use verified loopback HTTP bytes. Added a second host-loopback-only candidate
mapping at 4184, conflict checks for both ports and no new privileges. Only 4183
is eligible for the approved Tailscale route. The immutable release/asset store,
promotion/rollback, timer unit and app remain unchanged.

New `test:preview:service` reproduced the unchanged `b4a2c75` Docker probe's
permission denial inside an actual bounded transient user service, then fetched/
built/promoted real main using corrected HTTP checks in the same inherited
groups. The service exited `0/SUCCESS`; the real open Chromium game/storage and
old assets survived. No `sg`, manager restart, socket/group modification or live
migration was used. Detailed evidence and final gates are recorded in
`docs/private-preview-handoff.md`; log:
`.artifacts/private-preview-pva1-service.log`.

`docs/private-preview.md` documents the guarded, reversible existing-install
migration for the coordinator after review, post-review checks and a verified
push. Existing installed runtime/container/state are preserved; the timer and
Tailscale remain disabled. **Operational readiness remains reopened/pending
same-reviewer re-review**, not cleared by this developer response.

Final corrective developer gates passed: 35 focused tests, real Docker and
actual lingering-user-service integrations, then sequential full check
(250 tests/19 files, unchanged 47-source coverage, format/lint/types/build)
and 143 Chromium journeys. Migration shell syntax and `git diff --check` pass.
Original installed runtime/config bytes, failed status and container/admin
identities remain unchanged; timer inactive/disabled and no Serve configuration.
Owned transient units/test containers are cleaned up. Corrective frozen hashes:
`.artifacts/private-preview-pva1-snapshot.sha256`; canonical manifest updated
with its prior version preserved. No live migration/commit/push was performed.

## PV-A1 independent re-review — CLEARED

Same reviewer `e7c0365b-20cc-4708-9db6-f2e5f95f7b2d` cleared the corrective
implementation without new findings. This does not yet clear live activation.
All 13 corrective files reviewed against `b4a2c75`; before/after hashes matched:

- Correction: `b9a09d220aa23763bd70aaed1c71665f089421175dce3cf7ffd5250f97e1d37e`.
- Coordinator full snapshot:
  `1d0e839dddda00c0998da94bd1ea06c6870f9d1c0a8a51e60f21dde3ce478d3b`.
- Complete canonical 19-file manifest:
  `95456a28e7758c06d1efcd28c2188f2e3b45b2c4b9a802933f3e7ffac48ada0a`.

Independently reproduced legacy permission denial inside the real lingering-user
service, then fetched/built/verified/promoted successfully with identical
credentials lacking Docker group 989. No grant, sg, manager restart or socket
change. Service exited 0/SUCCESS in 59.947 seconds. HTTP candidate/live checks
need no Docker privilege. Both ports bind only loopback; candidate refused LAN
connections. Alternate-release/runtime/manifest requests returned 404.

Independent real-HTTP probes rejected candidate 503, wrong revision and
corrupted current responses while preserving/restoring last-good. Both Docker
integrations retained active games, storage/navigation, old assets, exact
recovery and rollback. Migration shell syntax and actual ownership/mount/port/
path/disabled-timer guards passed; baseline installed bytes matched and recovery
branches were traced, without executing migration.

All six lenses pass: correctness proven under actual service credentials;
fresh gameplay screenshot and full bilingual/theme/layout journeys inspected;
health checks simplified with maxima 179 module lines/51 function lines/
complexity 10/nesting 3, no exceptions; operator container management remains
separate from privilege-free update checks; one loopback endpoint solves the
actual need without framework/dependency; content/rights/pins and prior evidence
unchanged, live/public-release limitations explicit.

Independent focused suite 35/35, real Docker and actual service integrations,
then full check (250 tests / 19 files, formatting/lint/types/build) and 143
Chromium journeys all passed. Application coverage matches the original table:
all 47 runtime files included, operational tests not misrepresented as app
coverage. Logs:
`.artifacts/private-preview-pva1-independent-{focused,docker,service,check,browser}.log`.

Installed runtime/state bytes and both installed preview/admin identities,
start/restart counts unchanged. Test resources cleaned up; only old preview
4183 remains listening. Timer disabled/inactive; Serve empty.

## PV-A1 coordinator post-review verification

Frozen hashes verified before/after sequential real Docker and service-context
integrations, full `npm run check`, documented Chromium suite and whitespace
check. All passed: **250 tests**, **143 browser journeys**, type/lint/format/build,
35 focused deployment cases and unchanged app coverage fractions above.

Logs: `.artifacts/private-preview-pva1-post-review-{docker,service,check,browser}.log`.
No source edits after clearance; only factual report/status additions.
Next: commit/push correction, guarded migration, actual HTTPS and automatic-push
verification. Existing admin and shared user manager must remain untouched.
