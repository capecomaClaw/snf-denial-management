# SNF Denial Management Agent

AI-powered claim denial management for Skilled Nursing Facilities (SNFs). Upload denial EOBs or remittance advice, get instant root cause categorization, auto-generated appeal letters, and deadline tracking.

## What It Does

SNFs receive claim denials from Medicare, Medicaid, and private payers. Staff manually categorize each denial, draft appeal letters, and track deadlines. This tool automates that workflow end-to-end.

## Features

- **Upload or Demo**: Upload PDF/text EOBs or load 5 realistic pre-built denial scenarios
- **AI Analysis** (Claude Sonnet): Root cause category, CARC/RARC code decoding, appeal viability rating, required documentation list, deadline calculation
- **Appeal Letter Generator**: Auto-drafts appeal letters from templates, fully editable before export
- **Denial Tracker**: Status management (New → In Appeal → Won/Lost), deadline countdown, win rate, revenue at risk
- **Export**: Download appeal letters as .txt or denial summary as .json

## Denial Categories

- Medical necessity
- Missing documentation
- Coding error
- Prior auth required
- Duplicate claim
- Timely filing
- Eligibility issue
- Coordination of benefits

## Setup

```bash
# 1. Clone and install
npm install

# 2. Set environment variable
cp .env.example .env.local
# Add: ANTHROPIC_API_KEY=your_key_here

# 3. Run locally
npm run dev

# 4. Open http://localhost:3000
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `ANTHROPIC_API_KEY` | Yes | Anthropic API key (claude-sonnet-4-6) |

## Architecture

```
app/
  page.tsx                 — Root page
  layout.tsx               — HTML shell
  api/
    analyze/route.ts       — POST: Claude denial analysis
    demo/route.ts          — GET: Mock denial scenarios
components/
  DenialApp.tsx            — Main layout, state, tabs
  DenialUpload.tsx         — Upload panel + demo trigger
  DenialViewer.tsx         — Denial detail view
  AppealDraft.tsx          — Editable appeal letter
  DenialCard.tsx           — Sidebar denial card
  ExportButton.tsx         — Export letter/JSON
lib/
  types.ts                 — All TypeScript interfaces
  claude.ts                — Anthropic SDK integration
  denialCodes.ts           — CARC/RARC code library
  appealTemplates.ts       — Appeal letter templates by denial type
```

## Workflow

1. **Upload** a denial EOB or click **Demo** to load realistic scenarios
2. Claude analyzes the denial and categorizes the root cause
3. View denial details in the left panel: codes, documentation needed, deadline
4. Review and edit the auto-generated appeal letter in the right panel
5. Export the letter as .txt or denial summary as .json
6. Update status in the **Tracker** tab as appeals progress

## Deploy

```bash
source ~/.openclaw/.env
npm run build
npx vercel --token $VERCEL_TOKEN --yes --prod \
  -e ANTHROPIC_API_KEY=$ANTHROPIC_API_KEY
```

## Deadline Logic

- **Medicare**: 120 days from denial date
- **Medicaid**: 90 days from denial date
- **Private payers**: 180 days from denial date
