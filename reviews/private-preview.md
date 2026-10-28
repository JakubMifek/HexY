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
