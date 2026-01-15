# Waylens Sales Funnel - Current Progress

**Last Updated:** January 14, 2026

## Overview

This document tracks the implementation status of the Waylens Sales Funnel dashboard. The goal is to have all data pulled dynamically from CSV files - no hard-coded placeholder values.

---

## Status Summary

| Status | Count | Description |
|--------|-------|-------------|
| Working | 3 | Fully connected to data source |
| Hard-coded | 4 | Needs CSV connection |
| Total Components | 7 | Main dashboard sections |

---

## Working Features (Connected to Real Data)

### 1. Company Database Browser
**File:** `components/terminal/company-database.tsx`
**Status:** Working

**What works:**
- Loads 522 companies from `companies-dataset.json`
- Uses `useCompanyData()` hook for data access
- Displays company cards with real data (name, symbol, HQ, revenue, fleet size)
- Search bar with autocomplete
- Click-through to company detail pages

**Data source:** CSV files → `data-processor.ts` → `companies-dataset.json`

---

### 2. News Page
**File:** `components/terminal/news-page.tsx`
**Status:** Working

**What works:**
- Fetches real-time news from `/api/news`
- Google News API integration
- Claude AI generates summaries per category
- Categories: Competitors, Industry Trends, Regulatory, Technology
- Refresh functionality
- Time-ago formatting

**Data source:** Google News API + Claude AI

---

### 3. Company Search
**Files:** `lib/company-search.ts`, `lib/use-company-data.ts`
**Status:** Working

**What works:**
- Full-text search across 522 companies
- Advanced filtering (revenue, fleet size, geography, products, ownership)
- Relevance scoring and ranking
- Keyboard navigation
- Autocomplete suggestions

**Data source:** CSV files → `companies-dataset.json`

---

## Hard-coded Features (Needs CSV Connection)

### 4. Industry Overview
**File:** `components/terminal/company-overview.tsx`
**Status:** Hard-coded

**Hard-coded data:**
- Global telematics market stats (450M vehicles, 126M connected, 28% penetration, 15.8% CAGR)
- US telematics market stats (338M vehicles, 94.6M connected)
- US market verticals (Transportation 32%, Construction 22%, etc.)
- US vehicle types (Class 8 trucks, vans, medium-duty, etc.)
- US fleet size distribution (1-9 vehicles 74%, 10-49 vehicles 19%, etc.)
- US regional breakdown (West 30%, South 28%, etc.)
- Samsara's market position (18,500 customers, 850K vehicles, 0.90% share)

**CSV files to connect:**
- Market statistics files in `waylens_filtered_data/`
- Fleet operator data
- Regional breakdown data

---

### 5. Clients Page
**File:** `components/terminal/clients-page.tsx`
**Status:** Hard-coded

**Hard-coded data:**
- Client counts: 18,500 total, 2,400 enterprise, 8,100 mid-market, 8,000 SMB
- Retention rate: 98%
- NPS score: 72
- Top 8 enterprise clients (DHL, Sysco, Crown Castle, PG&E, Edward Jones, Anheuser-Busch, Republic Services, United Rentals)
- Channel partners (AT&T, Verizon Connect, Element Fleet, Enterprise Fleet)

**CSV files to connect:**
- Customer reference files
- Partnership files
- Client data files

---

### 6. Outreach Page
**File:** `components/terminal/outreach-page.tsx`
**Status:** Hard-coded

**Hard-coded data:**
- Quick stats (147 active contacts, 28 this month, 12 follow-ups, 68% success rate)
- 4 sample contacts with names, titles, emails, phones
- 4 sample upcoming meetings

**CSV files to connect:**
- Contact data (if available in CSVs)
- Or remove this page if contact data isn't in CSV scope

---

### 7. Company Summary (TSP/Reseller Pages)
**File:** `components/terminal/company-summary.tsx`
**Status:** Hard-coded

**Hard-coded data:**
- Company info for AAPL, MSFT, GOOGL, IOT (Samsara)
- Financial metrics (revenue $987.3M, gross margin 73.2%, etc.)
- Income statement highlights (FY 2022-2024)
- Balance sheet highlights
- Valuation metrics (P/S, EV/Revenue, etc.)
- Growth metrics (42.3% revenue growth, 35.8% customer growth)
- Fleet size breakdown (340K commercial trucks, 285K light-duty, etc.)
- Key clients (DHL, Sysco, Crown Castle, etc.)
- Channel partners (AT&T, Verizon Connect, Element Fleet)
- Technology stack (AWS, Google Cloud, Salesforce, etc.)
- Global presence (40+ countries)
- Industry verticals (32% Transportation, 22% Construction, etc.)

**CSV files to connect:**
- Company profile files (e.g., `100_teletrac_navman_company_overview.csv`)
- Financial data files
- Customer files
- Partnership files

---

## Data Pipeline Status

### Working
- `lib/data-processor.ts` - Parses CSV files and extracts company data
- `lib/company-search.ts` - Search engine with filtering
- `lib/use-company-data.ts` - React hooks for component data access
- `scripts/generate-dataset.ts` - Regenerates `companies-dataset.json`
- `public/data/companies-dataset.json` - 522 companies, 417KB
- `public/csv-index.json` - Metadata for 419 CSV files

### Needs Extension
The data processor currently extracts:
- Company names
- Revenue, fleet size, valuation
- Geography
- Products/services
- Business relationships

It needs to also extract:
- Market statistics (global/US)
- Industry vertical breakdowns
- Client lists with details
- Financial metrics (margins, cash flow, etc.)

---

## CSV Files Available

**Total:** 690 files
**High Priority:** 419 files (in `waylens_filtered_data/high_priority/`)
**Medium Priority:** 271 files

### Key file categories:
- Fleet operators (239 files)
- Technology (186 files)
- Competitors (132 files)
- Partnerships (123 files)
- Customer references (106 files)
- Pricing (59 files)
- Market statistics (59 files)
- Vertical markets (58 files)
- Video telematics (42 files)
- Geographic (19 files)

---

## Next Steps

### Priority 1: Connect Industry Overview
1. Identify CSV files with market statistics
2. Update `data-processor.ts` to extract market data
3. Create hook for market statistics
4. Connect `company-overview.tsx` to real data

### Priority 2: Connect Company Summary
1. Map company profiles to CSV files
2. Extract financial metrics from company overview CSVs
3. Build company-specific data loader
4. Connect `company-summary.tsx` to real data

### Priority 3: Connect Clients Page
1. Extract client data from customer reference CSVs
2. Build client summary aggregation
3. Connect `clients-page.tsx` to real data

### Priority 4: Evaluate Outreach Page
1. Check if contact data exists in CSVs
2. If yes, connect to real data
3. If no, consider removing or redesigning this page

---

## Commands

```bash
# Start development server
npm run dev

# Regenerate company dataset from CSVs
npm run generate-dataset

# Build for production
npm run build
```

---

## Key Files Reference

| File | Purpose |
|------|---------|
| `components/terminal/company-overview.tsx` | Industry overview (HARD-CODED) |
| `components/terminal/clients-page.tsx` | Client portfolio (HARD-CODED) |
| `components/terminal/outreach-page.tsx` | Contact tracking (HARD-CODED) |
| `components/terminal/company-summary.tsx` | Company details (HARD-CODED) |
| `components/terminal/company-database.tsx` | Company browser (WORKING) |
| `components/terminal/news-page.tsx` | News feed (WORKING) |
| `lib/data-processor.ts` | CSV parsing |
| `lib/company-search.ts` | Search engine |
| `lib/use-company-data.ts` | React hooks |
