# Release readiness — 2026-10-29

**Plan finished by owner decision; public release deferred.** Phases 1–7 are independently cleared; the fresh
[phase-8 cross-phase review](../reviews/phase-08.md) found no implementation
defects but returned BLOCKED on public-hosting and naming gates. The owner
subsequently authorized commit/push and closed the plan with these remaining
gates retained as follow-up work, not represented as passed. This document records
the owner's limited-device scope approval without claiming physical verification.
The [developer handoff](phase-08-handoff.md) maps the entire product acceptance
list to evidence. All 36 packs / 1,008 entries retain their cleared bytes.

## Follow-up work

Owner instruction on 2026-10-29: "commit and push. keep these as followup work.
Plan is finished". Current delivery remains private-only. These follow-ups do
not hold the current plan open or authorize automatic further implementation.

| ID    | Follow-up                                           | Completion condition                                                                                                                                                                                         |
| ----- | --------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| F8-01 | Proper HexY naming-conflict assessment              | Assess authoritative rights/status and relevant goods/territories; record an informed publication decision. Current research is not legal clearance.                                                         |
| F8-02 | Concrete public-hosting approval and deployment     | Owner approves hostname and scoped hosting changes; verify external no-login HTTPS, assets/refresh/cache behavior, update/open-game preservation and rollback. Preserve private preview and unrelated admin. |
| F8-03 | Physical controller/tablet verification             | Exercise actual Xbox/tablet hardware before removing the unverified/experimental labels. The owner-approved limited-release alternative remains valid.                                                       |
| F8-04 | Remaining browser/accessibility/client verification | Verify Safari/WebKit, human screen-reader use and remote Windows Edge/WSL access; retain explicit gaps until actual evidence exists.                                                                         |

The historical review remains BLOCKED against the original public-release gate.
Owner acceptance closes the current private-delivery plan, not those publication
requirements. Final delivery evidence is in [the review report](../reviews/phase-08.md#owner-authorized-closure-and-delivery).

## Owner decisions recorded after the candidate freeze

- **Name:** keep HexY; public release remains blocked pending proper conflict
  assessment. The research below is neither legal clearance nor an infringement
  determination.
- **Devices:** authorize a future limited initial release with controller/tablet
  support unverified/experimental and the stated browser/accessibility gaps.
  Physical Xbox/tablet, human screen-reader, Safari/WebKit and remote Windows
  client verification remain unavailable. This does not authorize publication.
- **Hosting:** keep private preview only for now; public hostname is undecided.
  No public configuration, DNS/TLS, ingress or Funnel change is authorized.

The table below preserves the options/evidence presented before that decision.
Its public-host proposal is not an approved implementation.

## Decision context

| Decision                                                                                                      | Evidence and recommendation                                                                                                                                                                                                                                                                                          | Consequence                                                                                                                                                                                                                                                                            |
| ------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Name:** retain HexY pending a proper conflict assessment, or choose a more distinctive candidate?           | There are existing **Hexy!**, **hexy.games** and **Hexy Studio / Hexy Tools** uses in games/software. Recommend keeping the preview private and assessing a more distinctive candidate before public promotion; alternatively obtain qualified CZ/EU trademark advice/search for retaining HexY.                     | No automatic rename and no declaration of infringement. Naming remains blocked until the owner records the chosen path and resolves the material uncertainty; changing capitalization is not clearance.                                                                                |
| **Hardware:** wait for physical Xbox/tablet verification, or explicitly authorize a limited initial release?  | Current proof is real desktop-browser software, mocked gamepads and emulated touch, not an actual Xbox or tablet. Recommend verifying intended devices. A limited alternative must explicitly label controller/tablet support unverified/experimental and defer the original physical gate with owner approval.      | Neither developer nor reviewer can silently reduce the agreed tablet/controller scope. If limitations are chosen, update the plan/support claims and review them before release. Human screen-reader verification is also outstanding; no WCAG certification is claimed.               |
| **Public hosting:** approve a dedicated hostname and isolated static release, or retain private preview only? | Recommended shape: `https://quiz.<owner-controlled-domain>/hexy/`, with a separately approved public HTTPS proxy/static release and **reviewed-release pinning**, not exposing the existing automatic-main preview. The exact owned hostname, DNS/TLS authority and permitted ingress are not yet supplied/verified. | Once the hostname and operational permission are approved, the coordinator can inspect/configure that narrowly scoped arrangement, verify it externally and preserve rollback. No DNS, certificate, firewall, proxy, container, timer or Funnel change is authorized by this proposal. |

These were owner choices, not requests to perform developer work. The chosen
private-only operation does not clear phase 8 or meet the
no-login public-hosting requirement. The laptop's Windows Edge/WSL access method
has not been confirmed from the remote client; server-local HTTPS is not that test.

## Preliminary naming evidence

Public sources read on **2026-10-29**. This is a bounded availability/confusion
screen, **not legal advice, a register clearance or proof of infringement**.
No rights holder was contacted. Same/similar wording alone does not establish
legal conflict; territory, priority, status, goods/services and presentation matter.

| Verified source                                                                                                            | Observed use and relevance                                                                                                                                                                                                              | Limits                                                                                                                                                                                                                                                                                                                                           |
| -------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [Apple Czech storefront: Hexy!](https://apps.apple.com/cz/app/hexy/id1155497019)                                           | A hexagon-based puzzle game, “Designed for iPad”; provider **Aleksandr Filatov**, copyright **TIGRIDO, INC.**; listing shows version 1.2.4, 27 May 2017, Czech prices. Same spoken/case-insensitive name in consumer games.             | A readable Czech storefront listing is not proof of a trademark, current installability, continuous sales or exact rights ownership. App not installed.                                                                                                                                                                                          |
| [hexy.games](https://hexy.games/), [about](https://hexy.games/about/), [game descriptions](https://hexy.games/games-desc/) | Live site offers free online **Hex and Havannah**, with hexagonal boards and connection goals. This is particularly close in browser-game vocabulary and discoverability, although it is not this quiz's gameplay.                      | Operator, first-use dates, registered rights and target territories not established. Not a claim that the mechanics are proprietary or that all hex games conflict.                                                                                                                                                                              |
| [Hexy Studio](https://hexy.studio/)                                                                                        | Operator's own page describes a Warsaw/Poland studio producing board-game trailers and 3D assets, plus “Hexy Tools” browser tools for game designers/publishers. Its structured organization data self-identifies **ZYMZYM sp. z o.o.** | The corporate identity is the site's statement, not an independently inspected company register or trademark record. `web_fetch` returned 406; ordinary curl successfully retrieved and read the actual page. [Steam group](https://steamcommunity.com/groups/hexy-studio) also lists Poland, but is only corroborating public self-description. |

EUIPO-maintained TMview additionally returned specific records. Its own footer
warns that TMview is **not an official register** and its information has no
legal effect. The unfiltered **Contains “Hexy”** query returned 285 results; the
first 30 were inspected, not all similar marks worldwide. Reproduce using the
[saved public query](https://www.tmdn.org/tmview/#/tmview/results?page=1&pageSize=30&criteria=C&basicSearch=Hexy).

| Record displayed by TMview                                                                             | Observed fields                                                                                                                                                                                         | Interpretation limit                                                                                                                                                                                                                                                                                                                                  |
| ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [EUIPO **HEXY**, application 017672437](https://www.tmdn.org/tmview/#/tmview/detail/EM500000017672437) | Applicant **GPS Tuner Systems Kft.**; application 10 January 2018; classes **9, 12, 25**; displayed status **Registered**. UK counterpart **UK00917672437** also appeared with those classes/applicant. | Class 9 is potentially software-relevant, making a closer assessment important. The detail page returned “Error loading data for trade mark”; exact goods/services, registration/priority dates and current legally authoritative status were **not** verified. It is not justified to infer all software or games are covered from the class number. |
| EUIPO **Hexy**, application **017884739**                                                              | Applicant **Heuchelberg Weingärtner eG**; application 9 April 2018; classes **32, 33**; displayed status **Registered**.                                                                                | Beverage classes illustrate why the same name does not automatically imply a game/software conflict. Exact scope/status still requires the register, not this summary.                                                                                                                                                                                |

Official-register attempts and their exact limitations:

- [Czech ÚPV database guidance](https://upv.gov.cz/informacni-zdroje/narodni-databaze/databaze-ochrannych-znamek)
  states coverage of ÚPV applications, EUIPO and WIPO designations for CZ/EU,
  warns of foreign-data inaccuracies, and identifies Czech goods/services text
  as authoritative for national marks. Its current linked
  [search interface](https://isdv.upv.cz/webapp/!resdb.oza.frm) hit a redirect loop
  in this environment. No record/result list was obtained.
- [EUIPO search entry](https://www.euipo.europa.eu/en/search-ip) returned 403.
  [Direct eSearch record](https://euipo.europa.eu/eSearch/#details/trademarks/017672437)
  failed at transport level. TMview initially returned only a JavaScript shell;
  waiting for client initialization in real Chromium enabled the query and
  record-list inspection above, but not the detailed record. The
  [UK counterpart's official page](https://trademarks.ipo.gov.uk/ipo-tmcase/page/Results/1/UK00917672437)
  also returned 403. No authoritative goods/services extract was obtained.
- [WIPO Global Brand Database guidance](https://www.wipo.int/en/web/global-brand-database)
  explicitly recommends also searching national/regional registers and possibly
  consulting a trademark attorney. The [live search](https://branddb.wipo.int/en/quicksearch)
  presented a verification challenge; it was not bypassed. No result or status
  was obtained.

**The displayed application numbers/applicants/classes/status above are TMview
observations, not certified registration facts or legal clearance.** Search-engine
silence is not a negative register search. Further assessment should examine exact and similar
word/figurative marks, CZ national rights, EU rights and international
designations; likely relevant goods/services include downloadable game software
(class 9), games (28), entertainment/online games (41) and software services
(42), with classification and scope determined by the actual offerings.
Unregistered use/confusion can also matter. The existing uses above are enough
to require an informed owner decision, not to decide the legal result.

## Hosting proposal and unchanged boundaries

Read-only observation of the approved private arrangement confirmed:

- Private Tailscale **Serve**, `/hexy/` only, targeting loopback 4183; no Funnel.
- `hexy-private-preview` is read-only UID/GID 101, restart policy
  `unless-stopped`; current/candidate ports 4183/4184 bind only loopback.
- Enabled active user timer; actual HTTPS revision
  `aa465b980eb0ec17d53fa89be8db1806ed2556d0`, HTML/version `no-store`,
  hashed JS/CSS `public, max-age=31536000, immutable`.
- Listener inspection found tailnet HTTPS and the separate LAN admin listener,
  not an established public website ingress. It does not prove public DNS,
  NAT/firewall reachability or permission to bind a new public address.
  Existing admin, installed runtime, containers and service configuration were
  left untouched.

The recommended dedicated origin avoids sharing browser-local saves/imports
with unrelated public applications. `/hexy/` preserves the already reviewed
build contract (`vite build --base=/hexy/`); the proxy strips that prefix before
serving the static root. `/hexy` should redirect to `/hexy/`. There is no client
route tree: refresh the application entry, return 404 for unrelated paths.
Do **not** point a new public proxy at the existing automatic-main preview:
that would both publish it and couple release approval to every preview push.
Use separately approved release storage/serving with an explicit reviewed SHA.

Alternatives requiring their own approval:

- A root-path dedicated site (`https://quiz.<domain>/`) uses `--base=/`, but the
  existing preview validator is deliberately `/hexy/`-specific. Do not repurpose
  its installed updater or claim root support from its current checks.
- A subpath on another public site shares its origin/storage and needs review
  of that site's proxy/location rules; it must not overwrite those rules.
- Public Tailscale Funnel would be a **new exposure decision**, not a way to
  avoid domain/permission discussion. It is not enabled or recommended here as
  an implicit extension of private Serve.

## Required public acceptance after approval

The implementer/reviewer, not the owner, performs these checks after permission:

1. Verify the approved public hostname, valid HTTPS certificate and no-login
   access from outside the tailnet, including an actual remote client.
2. Verify entry/trailing-slash redirects, `/hexy/assets/` MIME types and exact
   bytes, manual refresh and absence of external runtime requests; the retained
   MIT/CC BY notices must accompany the production HTML.
3. Keep HTML/version uncached (`no-store`); retain content-hashed immutable
   assets. No service worker or forced reload is present. Prove an already-open
   question/game and its locked content survive an authorized update; reload
   retains the original deadline.
4. Promote only verified complete releases atomically; test a failed candidate
   preserving the previous release. Keep retained release bytes and old hashed
   assets needed by open clients.
5. Verify a rollback to a retained SHA through the actual public URL and stop
   its update mechanism first so it does not immediately repromote. Document
   exact scoped commands after the approved architecture exists.

The private preview's [existing rollback procedure](private-preview.md#status-rollback-and-disable)
and independently reviewed update/rollback evidence remain valid **for that
private service**. They are a design reference, not a performed public rollback.
No public deployment, service mutation, commit or push occurred in this phase-8
developer work.
