# Conventions — Project Gamecraft

> Naming, linking, citation, and workflow rules. The "how to not mess it up" file.
> Last updated: 2026-10-15

## Scope (confirmed 2026-10-15)
- **Geography: US + Canada only.** Japan/Asia deprioritized (capture only if a top-tier US/CA org has a material Asia asset).
- **Tier: top-tier first**, then expand to the indie space. Schema must support indie (indie studios, indie investors, aggregators/labels) from day one.
- **Capital: PE firms + big-name VCs** are the priority. Micro funds only when they surface in a top-tier studio's cap table.
- **Lens:** this is a **union-leader's power map**, not a drama file. Conflict is captured only where it reveals leverage, money flow, or labor power.

## Naming
- **People:** `people/[Last, First] — [primary title].md` → e.g. `people/Brafman, Rob — CEO Take-Two.md`. Disambiguate by primary title (most senior/most recent).
- **Orgs:** `orgs/[Canonical Name].md` → e.g. `orgs/Empire Company.md`, `orgs/UVW-CWA Local 9433.md`. Keep the human name, not the ticker.
- **Events:** `events/YYYY — [short slug].md` → e.g. `events/2023 — Activision Microsoft close.md`.
- **Sources:** `sources/YYYY-MM-DD — [outlet-slug].md` → e.g. `sources/2024-03-01 — wsj-take2-ceo.md`.
- **Stable filenames.** If you rename a node, repair all `[[wikilinks]]` to it (search the vault for the old name).

## Linking (Obsidian `[[wikilinks]]`)
- Use `[[wikilinks]]`, not raw URLs, for entity↔entity links. Raw URLs appear only in `sources/*.md` (`canonical_url` frontmatter).
- **Bidirectional:** when A→B is recorded, record B→A (mirror edge). Use Obsidian backlinks to verify.
- A `[[wikilink]]` to a not-yet-researched entity is **allowed** — it creates an unresolved link that the node creation fills in. But prefer creating the stub immediately (see workflow) so links resolve.
- Every node body should have a **Sources** section listing its `[[sources/...]]` nodes.

## Citation format (non-negotiable)
- Claim in body → immediately followed by `[[sources/YYYY-MM-DD — outlet-slug]]`.
- Numbers → `value (as of YYYY-MM-DD, [[sources/...]])`.
- Quotes → exact text in quotes, attributed, then `[[sources/...]]`.
- **Never pad.** If a mechanic isn't documented in the sources, omit it. Do not narrate absence.
- Omit, don't hedge. If you're unsure, mark the node `confidence: single-source` and note the gap — but don't invent.

## Confidence scale
- `verified` — ≥2 independent sources, or a primary document (filing, union statement).
- `reported` — single reputable outlet.
- `single-source` — one source, not yet corroborated. (Queue for follow-up.)
- `speculation` — inference, clearly flagged. Rare. Use sparingly and always say what it's inferred from.

## Workflow (per entity)
1. **Discover** — web_search the entity; cross-reference (Wikipedia structure, trade press current power, filings money, union pages labor, LP lists for capital).
2. **Archive** — fetch each source URL → `sources/raw/`. Write the `sources/*.md` stub: canonical URL, fetch date, outlet, status (http-200/paywall/dead), what it corroborates, key quotes. **Verify HTTP 200 + content-matches-claim before citing.**
3. **Extract** — facts, dates, named people, relationships into the entity node. **Date-stamp every number.** For leaders, fill `key_decisions`. Mirror each relationship into the counterparty node.
4. **Coalesce** — contradiction? Keep both, note the discrepancy inline, set the lower `confidence`. New entity discovered mid-research? Create the stub now (resolve the link), mark `single-source`, add to `_meta/queue.md` STUBS.
5. **Commit** — git commit per entity or small batch; message names what was added (e.g. `gamecraft: Empire Company node + 3 sources; promote to priority 1`).

## Capital-first backbone (the main thread)
For each PE/VC with US/CA game-studio portfolios, build the chain:
1. **LPs** → pensions, endowments, family offices, corporate LPs (the pocket-book layer).
2. → **the fund** (AUM, vintage, strategy, game-studio allocation).
3. → **portfolio studios** (ownership %, acquisition date, board seats installed).
4. → **leaders** at those studios (tenure + key_decisions).
5. → **labor** at those studios (UVW-CWA Local 9433, IWF, 3A status, strikes, contracts, membership, **layoffs, hiring sprees** — all date-stamped).

This chain is what "see how the money is connected" means. Build it node by node, edge by edge.

## Labor-flow tracking (required for studios/publishers)
- **Every layoff and hiring spree** at a studio/publisher must be:
  1. Captured in the org node's `labour.layoffs` / `labour.hiring` arrays (date-stamped, source-cited).
  2. Created as a **dedicated event node** in `events/` (type: `layoff` or `hiring-spree`).
  3. Linked bidirectionally (org ↔ event).
- **Net labor flow** summary in the org node: a one-line "X jobs cut, Y added, net -Z" over the tracked period.
- **Layoff events** are high-priority (P=1 or P=2) — they're the labor-leverage signals that drive the union-leader's map.

## What NOT to do
- No subagents. Sequential, main-session work (standing rule).
- No Google Drive. Everything in this git repo.
- No drama-first framing. Labor, money, structure first.
- No number without an as-of date.
- No un-cited claim.
