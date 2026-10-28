# Private automatic-main preview

This is the approved deployment interlude, **not** the final public release.
Implementation is independently cleared and coordinator post-review checks
passed; a verified push still precedes installation. See
[review evidence](../reviews/private-preview.md). Live activation and actual
Tailscale HTTPS/automatic-update verification remain pending.

## Boundaries

- URL: `https://<node>.<tailnet>.ts.net/hexy/`. Tailscale Serve only; no Funnel.
  Tailnet access policy still controls which devices can connect.
- The existing LAN-only 8443 admin application is completely separate. Never
  restart it, change its mounts/certificates/restrictions, or proxy it.
- A pinned official NGINX container serves only built files and its configuration,
  read-only as UID/GID 101, with no capabilities or Docker socket. Only
  `127.0.0.1:4183` is published. Its internal candidate listener is not published.
- A lingering user timer checks **public HTTPS origin/main**, without credentials,
  60 seconds after the previous check/build finishes. No webhook or Actions runner.
  Fetch/install/build have 120/300/180-second limits; the unit has a 12-minute limit.
  `flock` excludes simultaneous updater/rollback runs and releases on process exit.
- Production state is `~/.local/share/hexy-preview`, outside the developer checkout.
  Each check fetches main into a disposable shallow repository. Each changed
  revision gets fresh `npm ci --ignore-scripts` (build tools are absent in that new
  source tree), then `vite build --base=/hexy/`. No checkout/reset/stash in the
  development tree. Runtime deployment scripts remain pinned at installation;
  app pushes do not silently replace the control scripts or server image.
- Candidate revision, index and every asset are checked through NGINX before the
  atomic symlink switch; the live HTTP endpoint is checked afterward. A failed
  promotion rolls back. A durable pending record recovers an interrupted switch
  on the next invocation. Failed fetches never deploy a cached remote revision.
- HTML and `/version.json` are `no-store`; hashed assets are immutable. Updates
  do not reload browsers, change localStorage, or replace an active game's pack.
  Normal manual reload retains the application's existing recovery semantics.
  Browser data belongs to the HTTPS **origin**, not the `/hexy/` path; a different
  previous localhost origin's storage is not automatically copied.

## Retention and failure policy

Releases contain immutable index/version/asset-hash manifests. Keep the three
most recently created releases plus protected current/target revisions (at most
five). Rollback uses these exact retained bytes, not a rebuild. Hashed assets are
**never automatically deleted**, so an old open page or in-flight index remains
usable across promotions and rollbacks.

The asset store is capped at 512 MiB / 16,384 files; individual builds are capped
at 32 MiB / 512 files. Reaching a cap fails the update and preserves current.
There is only one transient npm/source/cache workspace, removed after each run
and before the next fetch after a crash. Build dependencies come from main's
lockfile; transient install size is not a filesystem quota. Docker logs rotate
at 2 × 5 MiB; updater logs use the host's existing journal retention.

Do not delete old assets while games might still use them. A quota alert requires
an explicitly scheduled maintenance window with players finished, archival of
the whole state directory, and a clean preview installation, or a separately
reviewed quota adjustment. No global prune or broad cleanup command is needed.

## Coordinator installation and activation

Prerequisites: Node >=20.19, npm, Git, GNU `timeout`, `flock`, `ss`, Docker access,
Tailscale with HTTPS permission, and a working lingering user systemd manager.
No system-wide installation or unrelated service change is part of this setup.

From the independently reviewed, post-review-verified and pushed checkout:

```sh
test -z "$(git status --porcelain)"
test "$(git rev-parse HEAD)" = "$(git ls-remote --exit-code origin refs/heads/main | cut -f1)"
loginctl show-user "$USER" -p Linger
node deploy/cli.js check-route
node deploy/cli.js install
```

`install` only prepares runtime files and two user units. It refuses existing
state, unit names, container names, symlinked paths and an occupied 4183; it does
not overwrite existing installations. If preparation fails partway, inspect the
reported HexY paths before removing **only** those newly created files.

Activate only after the above gates:

```sh
STATE="$HOME/.local/share/hexy-preview"
node "$STATE/runtime/cli.js" start
systemctl --user daemon-reload
systemctl --user start hexy-preview-update.service
curl --fail --silent http://127.0.0.1:4183/version.json
node "$STATE/runtime/cli.js" check-route
timeout --kill-after=5s 30s tailscale serve --bg --https=443 --set-path=/hexy/ http://127.0.0.1:4183
```

Stop on any failure; do not continue later commands blindly. If TLS permission is
missing, preserve the actionable Tailscale diagnostic for the coordinator.
Do not enable Funnel, reset Serve, or accept unrelated configuration changes.
Inspect `tailscale serve status --json` after a timeout: the scoped route might
already have been applied. Recheck immediately before mutation; preflight cannot
lock out another administrator changing Tailscale simultaneously.

Verify **actual HTTPS**, not just local root HTTP:

```sh
URL="https://<node>.<tailnet>.ts.net/hexy"
curl --fail --silent --show-error "$URL/version.json"
curl --fail --silent --show-error -D - "$URL/"
tailscale serve status
systemctl --user enable --now hexy-preview-update.timer
systemctl --user list-timers hexy-preview-update.timer
```

Open the HTTPS page from an authorized tailnet device, play a game, and inspect
its `/hexy/assets/...` requests. Verify the version equals freshly fetched main.
After the next authorized main push, observe automatic revision change within
one check interval plus build time, with the already-open game unchanged.
Confirm Docker restart policy/user timer persistence; actual reboot verification
requires a separately authorized maintenance opportunity, not rebooting this
shared host for a preview test.

## Status, rollback and disable

```sh
STATE="$HOME/.local/share/hexy-preview"
cat "$STATE/status.json" # last check, fetched upstream (null on fetch failure), served SHA, error
readlink "$STATE/site/current"
ls "$STATE/site/releases"
systemctl --user status hexy-preview-update.timer hexy-preview-update.service
journalctl --user -u hexy-preview-update.service -n 80 --no-pager
docker logs --tail 40 hexy-private-preview
```

An inactive successful oneshot between timer ticks is normal. An update failure
is not success: the journal/unit and `status.json` report it while last good stays
available. Correct the cause, then start the updater service again. Do not remove
a kernel lock file to bypass an active updater.

For deliberate rollback, stop automatic updates first:

```sh
systemctl --user stop hexy-preview-update.timer hexy-preview-update.service
node "$STATE/runtime/cli.js" rollback "$STATE" <retained-40-character-sha>
curl --fail --silent http://127.0.0.1:4183/version.json
```

Restarting the timer deliberately returns to remote main; rollback is not a pin.
To disable this preview only, inspect Serve first and confirm `/hexy/` still
targets this preview, then:

```sh
systemctl --user disable --now hexy-preview-update.timer
systemctl --user stop hexy-preview-update.service
timeout --kill-after=5s 30s tailscale serve --bg --https=443 --set-path=/hexy/ off
docker stop hexy-private-preview
```

Keep state for rollback. Never use `tailscale serve reset`, `docker system prune`,
or commands targeting the admin service. To reenable an existing stopped
container, inspect its HexY label/mounts first, then `docker start
hexy-private-preview`; `cli.js start` intentionally refuses an occupied name.

## Repeatable checks and serving references

```sh
npm run test:preview
LD_LIBRARY_PATH="$PWD/.artifacts/browser-libs/usr/lib/x86_64-linux-gnu" npm run test:preview:docker
```

The second command uses named, non-restarting test containers on loopback
4185/4186 and isolated `.artifacts/preview-*` state. It builds real fetched main
and its predecessor, serves the real UI in Chromium, updates/rolls back, checks
old assets and saved-game recovery, and cleans up. Run sequentially with other
browser suites. It needs network access, the pinned image and existing Chromium.
The path-stripping proxy emulates Serve; it does **not** certify live Tailscale.

- [Tailscale Serve CLI](https://tailscale.com/kb/1242/tailscale-serve):
  `--bg` persistence, private Serve, scoped `--set-path`.
- [Tailscale proxy source](https://github.com/tailscale/tailscale/blob/main/ipn/ipnlocal/serve.go):
  `http.StripPrefix(strings.TrimSuffix(mountPoint, "/"), h)` removes `/hexy`
  before proxying. NGINX therefore serves `/`, while Vite emits `/hexy/assets/`.
  Installed CLI inspected: 1.104.2; exact live HTTPS remains an activation gate.
- [NGINX official image](https://hub.docker.com/_/nginx), stable
  `1.30.6-alpine-slim`, pinned in `deploy/io.js` by registry digest;
  [NGINX two-clause BSD license](https://nginx.org/LICENSE).
  Image/package notices remain in the upstream image; no third-party source is
  copied into the application. Digest upgrades require review/testing.
