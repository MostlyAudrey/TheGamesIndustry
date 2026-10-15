# Schema — Project Gamecraft

> The contract every node in the vault obeys. If a node violates this, it's broken.
> Last updated: 2026-10-15

## Node types

| Type | Directory | One per | Filename |
|---|---|---|---|
| `person` | `people/` | a human actor | `[Last, First] — [primary title].md` |
| `org` | `orgs/` | a studio, publisher, PE/VC fund, union, trade body | `[Name].md` |
| `event` | `events/` | a deal, strike, layoff, board change, acquisition | `YYYY — [short slug].md` |
| `source` | `sources/` | one article/filing/page actually used | `YYYY-MM-DD — [outlet-slug].md` |

**Raw source artifacts** (untouched HTML/PDF) live in `sources/raw/`. The `sources/*.md` node is the *curated* stub that links back to the raw file and states what it corroborates.

## Node types & their role in the power map

- **org** — the backbone. PE/VC funds, publishers, studios, unions, trade bodies.
- **person** — the actors. Leadership, funders, union officers.
- **event** — what makes this a *power* map, not a directory. The deals, strikes, layoffs, board changes.
- **source** — the evidence layer. Every claim traces here.

## Power lives in the EDGES

Relationships are recorded bidirectionally (each side names the other). Allowed edge types:

| Edge | Meaning | Example |
|---|---|---|
| `funded-by` | org ← capital | studio ← PE fund |
| `portfolio-of` | fund → studio | fund → studio (mirror of funded-by) |
| `acquired-by` / `acquired` | M&A | Activision ← Microsoft |
| `board-member-of` | person → org | CEO → board |
| `was-CEO-of` / `was-CFO-of` / `was-President-of` | person → org + tenure | — |
| `succeeded-by` / `succeeded` | person → person | — |
| `unionized-with` | studio ↔ union | studio ↔ UVW-CWA Local 9433 |
| `recruited` / `fired` | person → person (big decisions) | — |
| `negotiated-with` | union ↔ studio (labor) | — |
| `reported-to` | person → person | — |
| `lp-in` | LP (pension/endowment/corporate) → fund | **the pocket-book layer** |

## Frontmatter (required fields by type)

### Common (all nodes)
```yaml
---
type: person | org | event | source
name: "..."
confidence: verified | reported | single-source | speculation
priority: 1-5            # 1 = highest. impact × union leverage (see prioritization)
priority_rationale: "one line why this score"
sources: ["[[sources/...]]"]
last_reviewed: YYYY-MM-DD
---
```

### person
```yaml
role: "CEO / CFO / investor / union leader"
orgs: ["[[orgs/X]]", "[[orgs/Y]]"]
tenure: "2018-2024"        # primary seat
key_decisions:             # REQUIRED for any person with a leadership/founder/union-officer role
  - "2023-04: [decision] (as of 2023-04-18, [[sources/...]])"
  - "2024-01: [appointment/hire/fire/closure/deal] (as of 2024-01-05, [[sources/...]])"
labour:                    # if union-relevant
  - "negotiated 2023-24 strike settlement at [studio] (as of 2024-01-13, [[sources/...]])"
```

### org
```yaml
sector: publisher | studio | pe-fund | vc-fund | union | trade-body | aggregator | indie-investor
region: US | CA | both      # US/Canada only, per scope
ownership: "public / private / PE-owned / VC-backed"
funding:
  - "raised $X (as of YYYY-MM-DD, [[sources/...]])"
portfolio: ["[[orgs/studio]]"]   # for pe-fund / vc-fund
lp: ["[[orgs/LP]]"]              # the pocket-book layer
labour:
  union: "[[orgs/UVW-CWA Local 9433]]"   # if applicable
  status: organized | in-formation | none
  strike: "2023-24 (as of ...)"
  membership: "[N] (as of YYYY-MM-DD, [[sources/...]])"
  layoffs:                    # REQUIRED for studios/publishers with labor events
    - "YYYY-MM: [N] jobs (as of YYYY-MM-DD, [[sources/...]])"
  hiring:                     # REQUIRED for studios/publishers with hiring sprees
    - "YYYY-MM: [N] new roles (as of YYYY-MM-DD, [[sources/...]])"
  net_labor_flow: "[summary of labor movement over time]"
key_decisions:             # for orgs: big moves during leadership tenures
  - "2023: [layoff/closure/price-hike/acquisition] (as of YYYY-MM-DD, [[sources/...]])"
```

### event
```yaml
date: YYYY-MM-DD            # as-of date the event was accurate/reported
type: acquisition | layoff | hiring-spree | strike | board-change | deal | appointment
actors: ["[[orgs/...]]", "[[people/...]]"]
amount: "[value] (as of YYYY-MM-DD, [[sources/...]])"   # if a number
labour:                     # REQUIRED if type is layoff or hiring-spree
  jobs: "[N] (as of YYYY-MM-DD, [[sources/...]])"
  affected: "[studios/departments/regions]"
  reason: "[stated reason, if any]"
```

### source
```yaml
canonical_url: "https://..."
fetched: YYYY-MM-DD
outlet: "..."
status: http-200 | paywall | dead
corroborates: "what claim(s) this supports"
raw: "sources/raw/[file]"
```

## Prioritization system (required)

Every node scores **priority 1–5** where **1 = build first**. Score = industry impact × relevance to union leverage, 1–5 each, then a composite judgment.

- **1 — Tier 1 (build first):** PE/VC with US/CA game-studio portfolios; top-10 US/CA publishers; studios with active UVW/IWF/3A organizing or a recent strike/layoff; key leaders at those studios; big LPs behind those funds.
- **2 — Tier 2:** second-wave PE/VCs; mid-tier US/CA studios; leaders with high-tenure-impact; LPs with large allocations.
- **3 — Tier 3:** indie studios + indie-focused investors + aggregators/labels; long-tail labor.
- **4–5 — deferred:** peripheral, single-source, or low-leverage.

**Re-rank on signal:** a new buyout, strike, or large LP surfaces → promote/demote the node, update its `priority` + `priority_rationale`, and refresh `00-INDEX.md` and `_meta/queue.md`.

## Number rule (non-negotiable)

**Every number carries an "as of" date + source.** Format: `value (as of YYYY-MM-DD, [[sources/...]])`. If it's a range or estimate, say so. A number without a date is not allowed in a node body or frontmatter.

## Citation rule (non-negotiable)

- Every factual claim in a node body links to a `[[sources/...]]` node.
- Before citing: confirm the URL returns HTTP 200 **and** the content actually corroborates the claim (Burgundy rule).
- ≥1 source per significant claim; significant claims (deals, strikes, numbers, tenure decisions) should have ≥2 independent sources.
