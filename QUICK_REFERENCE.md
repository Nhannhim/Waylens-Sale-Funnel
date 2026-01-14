# 🚀 Quick Reference - Company Search

## Try It Now (3 Steps)

```bash
# 1. Start server
npm run dev

# 2. Visit search page
http://localhost:3000/search

# 3. Type "Samsara" and click result
```

---

## 📍 URLs

| Page | URL | Purpose |
|------|-----|---------|
| **Main Search** | `/search` | Clean search page |
| **Full Search** | `/company-search` | With filters |
| **Company Page** | `/companies/[id]` | Detail view |

---

## 🔍 Search Examples

```
"Samsara"         → Find Samsara (exact match)
"video"           → Video telematics companies
"ELD"             → ELD providers
"fleet"           → Fleet management companies
"geotab"          → Find Geotab
```

---

## 📊 Company Page Tabs

1. **Overview** - Metrics, business info, products
2. **Markets** - Geographic presence
3. **Relationships** - Customers, partners, acquisitions
4. **Keywords** - Search tags, data sources
5. **News** - External news links

---

## 🎯 Data Available

✅ 522 companies  
✅ Revenue & growth  
✅ Fleet size  
✅ Valuation  
✅ Geographic markets  
✅ Products/services  
✅ Business relationships  
✅ News links  

---

## 💻 Use in Your Code

```tsx
// Add search bar
import { CompanySearchBar } from '@/components/company-search-bar';

<CompanySearchBar />
```

```tsx
// Link to company
import Link from 'next/link';

<Link href={`/companies/${company.id}`}>
  View Company
</Link>
```

```tsx
// Custom selection
<CompanySearchBar 
  onSelect={(id) => console.log(id)}
/>
```

---

## 🔄 Update Data

```bash
# Regenerate dataset from CSVs
npm run generate-dataset

# Rebuild static pages
npm run build
```

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `↓` | Next result |
| `↑` | Previous result |
| `Enter` | Select result |
| `Escape` | Close suggestions |

---

## 📱 Example Companies

- **Geotab**: `/companies/company-1`
- **Verizon Connect**: `/companies/company-2`
- **Samsara**: `/companies/company-3`
- **CalAmp**: `/companies/company-4`

---

## 🎨 Components

| Component | File |
|-----------|------|
| Search Bar | `components/company-search-bar.tsx` |
| Detail Page | `components/company-detail-page.tsx` |
| News Section | `components/company-news.tsx` |
| Search Demo | `components/company-search-demo.tsx` |

---

## 🔗 Documentation

- **`SEARCH_IMPLEMENTATION.md`** - Complete implementation guide
- **`SEARCH_USAGE.md`** - Usage examples
- **`COMPANY_DATABASE_README.md`** - Database documentation
- **`QUICK_START.md`** - Getting started

---

## ✨ Features

✅ Autocomplete search  
✅ Keyboard navigation  
✅ Click to view details  
✅ News integration  
✅ Advanced filters  
✅ Mobile responsive  
✅ TypeScript typed  
✅ Fast (client-side)  

---

**Start searching at: `/search` 🚀**
