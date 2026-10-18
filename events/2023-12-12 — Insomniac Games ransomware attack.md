---
type: event
name: "Insomniac Games ransomware attack (Rhysida)"
date: 2023-12-12
type: security-incident
confidence: verified
priority: 1
priority_rationale: "Major data breach exposing ~1.67 TB employee data including passport scans; significant labor-adjacent event affecting hundreds of workers"
actors:
  - "[[orgs/Insomniac Games]]"
  - "[[orgs/Sony Interactive Entertainment]]"
  - "Rhysida ransomware gang"
sources:
  - "[[sources/2023-12-12 — theverge-insomniac-ransomware-rhysida]]"
  - "[[sources/2023-12-20 — polygon-insomniac-leak-hack-rhysida]]"
  - "[[sources/2024-02-23 — bleepingcomputer-insomniac-employees-data-breach]]"
---

# Insomniac Games ransomware attack (Rhysida)

**December 2023.** The Rhysida ransomware gang breached Insomniac Games and leaked 1.67 TB of data.

## Timeline
- **November 2023**: Initial breach (Rhysida gained access to Insomniac's systems)
- **December 12, 2023**: Rhysida publicly claims the attack; Sony confirms investigation
- **December 2023**: Rhysida publishes 1.67 TB of stolen data, including:
  - Employee passport scans and driver's licenses
  - HR documents (disciplinary records, internal investigations)
  - Game development assets (Spider-Man 3, Wolverine, X-Men games, Ratchet & Clank)
  - Recorded video meetings
  - Employee T-shirt sizes and internal communications
- **February 2024**: Sony officially alerts affected employees about the data breach

## Impact
- Hundreds of Insomniac employees had their personal data exposed (passports, SSNs, driver's licenses) 
- Internal HR investigations and disciplinary records published
- Development assets for several unannounced games leaked
- Rhysida demanded a ransom; after Sony/Insomniac refused to pay, the data was leaked

## Employee impact
- Risk of identity theft and doxxing for affected workers
- The breach was described by Polygon as a "catastrophe" going "way beyond leaked games"
- Employee personal data remains exposed online

## Edges
- `security-incident-at` → Insomniac Games
- `perpetrator` → Rhysida ransomware gang
- `impact` → Employee personal data exposure, game development assets leaked
