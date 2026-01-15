# Waylens Sales Funnel - Product Requirements Document (PRD)

## Product Vision

An internal sales research tool for Waylens that provides quick, searchable access to fleet management and telematics company data. This is NOT a CRM - it's a research dashboard to help sales teams make better decisions by viewing data from our CSV database.

## Target Users

- Waylens Sales Team
- Business Development Representatives
- Sales Leadership (for market intelligence)

## Data Sources

| Source | Type | Status |
|--------|------|--------|
| 690 CSV Files | Company intelligence, market data, fleet operators | Primary data source |
| Google News API | Real-time industry news | Working |
| Claude AI | News summaries | Working |

---

## Core Features

### 1. Company Search & Discovery
**Goal:** Find companies quickly by name, keyword, industry, or attributes.

**Requirements:**
- Autocomplete search with real-time suggestions
- Full-text search across company names and keywords
- Advanced filtering by:
  - Revenue range (micro, small, medium, large, enterprise)
  - Fleet size range
  - Geography (US, Canada, Mexico, etc.)
  - Products (Video Telematics, ELD, etc.)
  - Ownership (public/private)
  - Valuation range

**Data Source:** CSV files via `companies-dataset.json`

---

### 2. Company Database Browser
**Goal:** Browse and explore all 522 companies in the database.

**Requirements:**
- Grid view of company cards
- Display: name, stock symbol, headquarters, revenue, fleet size
- Click-through to detailed company pages
- Search bar integration

**Data Source:** CSV files via `useCompanyData()` hook

---

### 3. Industry Overview Dashboard
**Goal:** View market statistics and trends for the telematics industry.

**Requirements:**
- Global telematics market stats (total vehicles, connected vehicles, penetration rate, CAGR)
- US telematics market breakdown
- Market verticals (Transportation, Construction, Field Services, etc.)
- Vehicle type distribution (Class 8 trucks, vans, medium-duty, etc.)
- Fleet size distribution
- Regional breakdown (West, South, Midwest, Northeast)
- Visualizations: pie charts, bar charts, tables

**Data Source:** CSV files (currently hard-coded - needs connection)

---

### 4. Company Pages (TSP, Reseller, Insurtech)
**Goal:** View detailed company profiles with business intelligence.

**Requirements:**
- Company summary (name, sector, description, website)
- Financial metrics (revenue, gross margin, operating margin, FCF)
- Fleet size & vehicle breakdown
- Key clients & resellers
- Technology stack & integrations
- Global presence
- Industry verticals breakdown

**Data Source:** CSV files (currently hard-coded - needs connection)

---

### 5. News Integration
**Goal:** Real-time industry news with AI-powered summaries.

**Requirements:**
- News categories: Competitors, Industry Trends, Regulatory, Technology
- AI summaries per category
- Article links with source and timestamp
- Refresh capability
- Time-ago formatting

**Data Source:** Google News API + Claude AI (WORKING)

---

### 6. Clients Page
**Goal:** View client portfolio overview.

**Requirements:**
- Client counts by segment (Enterprise, Mid-Market, SMB)
- Top enterprise clients with details
- Channel partners
- Retention rate & NPS score

**Data Source:** CSV files (currently hard-coded - needs connection)

---

### 7. Outreach Dashboard
**Goal:** View contact and outreach tracking.

**Requirements:**
- Key contacts with details (name, title, company, email, phone)
- Last contact date & notes
- Status tracking (Active, Follow-up, Pending)
- Upcoming meetings calendar
- Quick stats (active contacts, follow-ups, success rate)

**Data Source:** CSV files (currently hard-coded - needs connection)

---

## Technical Requirements

### Data Pipeline
1. CSV files in `waylens_filtered_data/` (690 files, 419 high priority)
2. Data processor converts CSVs to JSON dataset
3. Search engine indexes companies for fast lookup
4. React hooks provide data access to components

### Key Files
- `lib/data-processor.ts` - CSV parsing and company extraction
- `lib/company-search.ts` - Search engine with filtering
- `lib/use-company-data.ts` - React hooks for data access
- `public/data/companies-dataset.json` - Processed company data
- `public/csv-index.json` - CSV file metadata index

### API Routes
- `/api/csv-search` - Search CSV files with previews
- `/api/news` - Fetch news with AI summaries
- `/api/search-documents` - Document search

---

## Success Criteria

1. **No placeholder values** - All displayed data comes from CSV files
2. **Fast search** - Sub-second search results
3. **Accurate data** - Company metrics match source CSVs
4. **Real-time news** - News updates within 24 hours
5. **Usable UI** - Sales team can find information quickly

---

## Out of Scope

- CRM functionality (contact management, deal tracking)
- Email sending or campaign automation
- Calendar integration
- User authentication/roles
- Data editing or updates through UI
