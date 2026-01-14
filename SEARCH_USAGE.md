# Company Search Usage Guide

## 🔍 Overview

I've created a complete searchable company database with:
- **Autocomplete search bar** with real-time suggestions
- **Dynamic company detail pages** with all data
- **News integration** with links to external sources
- **Click-to-navigate** from search results

## 🚀 Quick Start

### Try the Search Pages

1. **Main Search Page**
   ```
   http://localhost:3000/search
   ```
   - Clean, focused search interface
   - Autocomplete suggestions
   - Search examples

2. **Company Search Demo**
   ```
   http://localhost:3000/company-search
   ```
   - Full search with filters
   - Top companies lists
   - Statistics dashboard

3. **Company Detail Pages**
   ```
   http://localhost:3000/companies/[company-id]
   ```
   - Complete company profile
   - All metrics and data
   - News links
   - Relationships

## 🎯 Features

### 1. Autocomplete Search Bar

Real-time search suggestions as you type:

```tsx
import { CompanySearchBar } from '@/components/company-search-bar';

function MyComponent() {
  return (
    <CompanySearchBar 
      placeholder="Search companies..."
      onSelect={(companyId) => {
        // Optional: Handle selection
        console.log('Selected:', companyId);
      }}
    />
  );
}
```

**Features:**
- ✅ Real-time autocomplete
- ✅ Keyboard navigation (↑↓ arrows, Enter, Escape)
- ✅ Shows revenue, fleet size, location
- ✅ Matched keywords highlighted
- ✅ Click or keyboard to select
- ✅ Auto-navigates to company page

### 2. Company Detail Pages

Comprehensive company profiles at `/companies/[id]`:

**Tabs:**
- **Overview**: Business info, financials, products, categories
- **Markets**: Geographic presence
- **Relationships**: Customers, partners, acquisitions, investors
- **Keywords**: Search tags and data sources
- **News**: External news links and search options

**What's Shown:**
- Revenue, fleet size, valuation, employees
- Geographic markets and regions
- Products and services
- Business relationships
- Auto-generated keywords
- Source CSV files
- News search links

### 3. News Integration

Each company page has a **News tab** with:
- Direct links to Google News, Bing News, Reuters
- Industry-specific sources (FreightWaves, Fleet Owner, etc.)
- Social media search (Twitter, LinkedIn)
- Press release sources (PR Newswire, Business Wire)

**News searches automatically include:**
- Company name
- Industry context (fleet management, telematics)
- Recent timeframe

### 4. Clickable Search Results

All search results are now clickable:
- Click any company card → Navigate to detail page
- Hover effect shows it's clickable
- Chevron icon indicates more details available

## 📋 Examples

### Example 1: Search for Geotab

1. Go to `/search` or `/company-search`
2. Type "Geotab" in the search bar
3. Click the suggestion or press Enter
4. View complete Geotab profile with:
   - Revenue: $560M
   - Fleet Size: 4.5M vehicles
   - Markets: US, Canada, Mexico, and more
   - Products, partners, customers
   - Latest news links

### Example 2: Search for Video Telematics Companies

1. Type "video telematics"
2. See all companies with video telematics products
3. Filter by revenue, fleet size, or geography
4. Click any company to view details

### Example 3: Browse Top Companies

1. Go to `/company-search`
2. Click "Top by Revenue" or "Top by Fleet Size" tab
3. See ranked list of companies
4. Click any company for full profile

### Example 4: Find Companies by Location

1. Search or use filters
2. Select "United States" or any geography
3. See all companies in that market
4. Click to view details and relationships

## 🔧 Integration

### Add Search to Any Page

```tsx
import { CompanySearchBar } from '@/components/company-search-bar';

export default function MyPage() {
  return (
    <div>
      <h1>My Application</h1>
      <CompanySearchBar />
      {/* Rest of your content */}
    </div>
  );
}
```

### Custom Selection Handler

```tsx
<CompanySearchBar 
  onSelect={(companyId) => {
    // Custom action instead of navigation
    loadCompanyData(companyId);
    openModal();
  }}
/>
```

### Styled Search Bar

```tsx
<CompanySearchBar 
  className="max-w-2xl mx-auto"
  placeholder="Find your company..."
/>
```

## 🎨 Pages Created

| Page | URL | Purpose |
|------|-----|---------|
| Main Search | `/search` | Clean search interface |
| Company Search Demo | `/company-search` | Full search with filters |
| Company Detail | `/companies/[id]` | Complete company profile |

## 📱 How It Works

### Search Flow

1. **User types** in search bar
2. **Autocomplete** shows matching companies (debounced 300ms)
3. **User selects** via click or keyboard
4. **Navigate** to company detail page
5. **View data** in organized tabs
6. **Access news** via external links

### Data Displayed

From the generated dataset (`companies-dataset.json`):
- ✅ Company name and headquarters
- ✅ Revenue, fleet size, valuation
- ✅ Employees, customers count
- ✅ Products and services
- ✅ Geographic markets
- ✅ Business relationships
- ✅ Keywords and categories
- ✅ Stock symbols for public companies

### News Links

Links to external sources:
- 🔗 Google News
- 🔗 Bing News
- 🔗 Reuters
- 🔗 FreightWaves (industry)
- 🔗 Fleet Owner (industry)
- 🔗 TechCrunch (tech)
- 🔗 Twitter/LinkedIn (social)
- 🔗 PR Newswire (press)

## 🎯 Key Features Summary

✅ **Instant Search** - Autocomplete as you type  
✅ **Smart Matching** - Find by name, keywords, or industry  
✅ **Rich Previews** - See key metrics in search results  
✅ **Keyboard Navigation** - Use arrows and Enter  
✅ **Detailed Profiles** - Complete company information  
✅ **News Integration** - Links to latest articles  
✅ **Clickable Results** - Navigate with one click  
✅ **Mobile Responsive** - Works on all devices  
✅ **TypeScript** - Fully typed for safety  
✅ **Fast** - Client-side search is instant  

## 🔄 Updating Data

When CSV files are updated:

```bash
npm run generate-dataset
```

This regenerates:
- Company data
- Keywords
- Search indexes
- All company pages (static generation)

## 💡 Tips

1. **Exact matches** appear first in results
2. **Keyword matches** also show relevant companies
3. Use **arrow keys** to navigate suggestions
4. Press **Escape** to close suggestions
5. **Click anywhere** outside to close
6. Search is **case-insensitive**
7. **Partial matches** work (e.g., "video" finds "video telematics")

## 📚 Components

| Component | Location | Purpose |
|-----------|----------|---------|
| `CompanySearchBar` | `components/company-search-bar.tsx` | Autocomplete search |
| `CompanyDetailPage` | `components/company-detail-page.tsx` | Company profile view |
| `CompanyNews` | `components/company-news.tsx` | News links section |
| `CompanySearchDemo` | `components/company-search-demo.tsx` | Full search interface |

## 🎉 You're Ready!

Start searching:
1. Run `npm run dev`
2. Visit `http://localhost:3000/search`
3. Type "Samsara" or any company name
4. Click the result
5. Explore the company profile and news links!

---

**Search is now fully functional with autocomplete, detail pages, and news integration!** 🚀
