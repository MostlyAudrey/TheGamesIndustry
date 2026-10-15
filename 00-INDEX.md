# 00 — Master Index

> Machine-readable registry of every entity in the vault. The "database." Updated every batch.
> Sorted by priority (1 = build first). Confidence + source count per node.
> Last updated: 2026-10-15 (batch 1 + 2a + 2b).

## How to read
- **P** = priority (1 = build first). **Conf** = verified / reported / single-source / speculation.
- **Src** = count of `[[sources/...]]` nodes attached.

## Orgs
| Node | Sector | Region | P | Conf | Src | Note |
|---|---|---|---|---|---|---|
| [[orgs/Silver Lake Partners]] | pe-fund | US | 1 | verified | 3 | EA anchor; ~$102bn AUM; SLP VII $20.5B; LPs: AZ+NJ pensions |
| [[orgs/Public Investment Fund of Saudi Arabia]] | sovereign-wealth-fund | SA→US | 1 | verified | 2 | EA anchor; Savvy platform; $38B gaming mandate |
| [[orgs/Affinity Partners]] | pe-fund | US | 1 | verified | 1 | Kushner PE; EA anchor |
| [[orgs/Andreessen Horowitz (a16z)]] | vc-fund | US | 1 | verified | 3 | Games Fund I+II >$1.2B; Mythical Games, Bonfire Studios |
| [[orgs/Electronic Arts]] | publisher | US | 1 | verified | 2 | Anchor studio; ~14,500 employees |
| [[orgs/Canada Pension Plan Investment Board]] | sovereign-pension-LP | CA | 1 | verified | 1 | In-scope LP; Keywords deal |
| [[orgs/CVC Capital Partners]] | pe-fund | EU+US | 2 | verified | 1 | Jagex (2024), Dream Games (~$5B, 2025) |
| [[orgs/EQT]] | pe-fund | EU+US | 2 | verified | 1 | Keywords Studios (~$2.8B, 2024) |
| [[orgs/Keywords Studios]] | studio (services) | UK+US | 2 | verified | 1 | Gaming services; EQT+CPP+Temasek |
| [[orgs/Jagex]] | studio | UK+US | 2 | verified | 1 | RuneScape; CVC+Haveli (2024) |
| [[orgs/Behaviour Interactive]] | studio | CA | 2 | verified | 1 | Dead by Daylight; Haveli (Montreal) |
| [[orgs/Scopely]] | studio (mobile) | US | 2 | verified | 1 | Culver City CA; PIF/Savvy |
| [[orgs/Arizona State Retirement System]] | sovereign-pension-LP | US | 3 | verified | 1 | SLP VII LP (EA deal) |
| [[orgs/New Jersey Retirement System]] | sovereign-pension-LP | US | 3 | verified | 1 | SLP VII LP (EA deal) |
| [[orgs/Mythical Games]] | studio (blockchain) | US | 3 | verified | 1 | Sherman Oaks CA; a16z; 150+ emp |
| [[orgs/Bonfire Studios]] | studio | US | 3 | verified | 1 | Irvine CA; a16z; 51-200 emp |
| [[orgs/Haveli Investments]] | pe-fund | US | 3 | verified | 1 | Austin TX gaming fund |
| [[orgs/Temasek]] | sovereign-wealth-LP | SG | 3 | verified | 1 | Keywords LP |
| [[orgs/ESL FACEIT Group]] | esports | US/CA+EU | 3 | verified | 1 | Savvy platform |
| [[orgs/Dream Games]] | studio (mobile) | TR+US | 3 | reported | 0 | CVC ~$5B (2025) — source to archive |
| [[orgs/Candivore]] | studio (mobile) | IL | 4 | verified | 1 | Haveli portfolio |
| [[orgs/Omeda Studios]] | studio | UK | 4 | verified | 1 | Haveli portfolio |
| [[orgs/Steer Studios]] | studio | TBD | 4 | reported | 0 | Savvy portfolio — to verify |

## People
| Node | Role | Orgs | P | Conf | Src | Note |
|---|---|---|---|---|---|---|
| [[people/Andrew Wilson — CEO EA]] | CEO | EA | 1 | verified | 2 | CEO since 2013; tenure ledger built |

## Events
| Node | Date | Type | Actors | P | Conf | Src |
|---|---|---|---|---|---|---|
| [[events/2025 — EA take-private (Silver Lake + PIF + Affinity)]] | 2025-09-29 | acquisition | EA, Silver Lake, PIF, Affinity | 1 | verified | 2 |

## Sources
| Node | Outlet | Fetched | Status | Corroborates |
|---|---|---|---|---|
| [[sources/2025-09-30 — nbc-ea-52-5b-pe-buyout]] | NBC/AP | 2026-10-15 | http-200 | EA deal, $210/sh, PIF 9.9%, Wilson CEO, 14,500 emp |
| [[sources/2025-09-29 — latimes-ea-55b-take-private]] | LA Times | 2026-10-15 | http-200 | EA ~$55B, Respawn 100, $1.67B Q1, Scopely, $38B PIF |
| [[sources/2024-02-09 — prnewswire-cvc-haveli-jagex]] | CVC/PR | 2026-10-15 | http-200 | Jagex, CVC €188bn, Haveli portfolio |
| [[sources/2024-10-24 — keywords-studios-eqt-cpp-temasek]] | Keywords | 2026-10-15 | http-200 | Keywords ~$2.8B, EQT+CPP+Temasek, Bodson |
| [[sources/2025-06-18 — a16z-7-2b-new-funds-games-600m]] | a16z | 2026-10-15 | http-200 | a16z $7.2B incl. $600M Games |
| [[sources/2024-04-16 — gamesbeat-a16z-games-fund-two-600m]] | GamesBeat | 2026-10-15 | http-200 | A16z Games Fund Two $600M, >$1.2B AUM, Jon Lai |
| [[sources/2026-01-15 — a16z-investment-list]] | a16z | 2026-10-15 | http-200 | a16z full roster |
| [[sources/2024-05-08 — silverlake-slp-vii-20-5b-close]] | Silver Lake | 2026-10-15 | http-200 | SLP VII $20.5B, $102bn AUM, 44 LPs, AZ/NJ pensions |
| [[sources/2024-01-31 — nj-treasury-slp-vii]] | NJ Treasury | 2026-10-15 | http-200 | NJ pension reviewing SLP VII (2024-01-31) |

## Counts
- orgs: 23
- people: 1
- events: 1
- sources: 9

## Priority distribution
- T1 (P=1): 7
- T2 (P=2): 6
- T3 (P=3): 8 (AZ, NJ pensions + Mythical, Bonfire, Haveli, Temasek, ESL FACEIT, Dream)
- T4 (P=4): 2 (Candivore, Omeda, Steer)
