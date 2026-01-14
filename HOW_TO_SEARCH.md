# 🔍 How to Use the Search Feature

## 3 Ways to Search

### ⚡ Method 1: Autocomplete (Quick)
**Best for: Finding a specific company quickly**

1. Go to `/search`
2. Start typing in the search bar (e.g., "Samsara")
3. See suggestions appear automatically
4. **Click a suggestion** → Go directly to company page
5. **OR press ↓/↑** to select, then **Enter**

**Example:**
```
Type: "Sam"
See: 🏢 Samsara  NYSE: IOT
      💰 $937M  📊 500K fleet
Click → Opens /companies/company-3
```

---

### 📋 Method 2: Search Results Page (View All)
**Best for: Seeing all matching companies**

1. Go to `/search`
2. Type in the search bar (e.g., "Samsara")
3. **Press Enter** (without selecting)
4. See full results page with all matches
5. Click any company to view details

**Example:**
```
Type: "video telematics"
Press: Enter
See: Results page with ALL video telematics companies
     - Samsara
     - Lytx
     - Motive
     - Netradyne
     - etc.
```

**OR use the manual search box:**
```
Type: "Samsara" in the second search box
Click: "Search" button
See: Results page
```

---

### 🎯 Method 3: Example Buttons
**Best for: Exploring**

1. Go to `/search`
2. Click any example button:
   - Geotab
   - Samsara
   - Motive
   - video telematics
   - ELD
   - fleet management
3. See results page instantly

---

## Search Flow

```
┌─────────────────┐
│   /search       │ ← Start here
└────────┬────────┘
         │
    Type "Samsara"
         │
         ├─────────────┬─────────────┐
         │             │             │
    Click result   Press Enter   Click button
         │             │             │
         ↓             ↓             ↓
    /companies/   /search-results  /search-results
    company-3     ?q=Samsara       ?q=Samsara
         │             │             │
         ↓             ↓             ↓
   Company Page   Results Page   Results Page
```

---

## What Happens on Results Page

### When you press Enter or click Search:

1. **Navigate to:** `/search-results?q=YourQuery`

2. **See:**
   - Number of matches
   - List of all matching companies
   - Each company shows:
     - Name and headquarters
     - Revenue, fleet size, valuation
     - Markets and products
     - Match relevance score
     - "View Full Profile" button

3. **Click any company card** → Go to company detail page

---

## Examples

### Example 1: Search for Samsara
```
/search
Type: "Samsara"
Press: Enter
→ /search-results?q=Samsara
Shows: 2 companies
  1. Samsara (company-3)
  2. Mrm Samsara Partnerships (company-310)
```

### Example 2: Search for Video Telematics
```
/search
Type: "video telematics"
Press: Enter
→ /search-results?q=video+telematics
Shows: All companies with video telematics products
```

### Example 3: Search for ELD
```
/search
Type: "ELD"
Press: Enter
→ /search-results?q=ELD
Shows: All ELD solution providers
```

### Example 4: Quick Access
```
/search
Click: "Geotab" button
→ /search-results?q=Geotab
Shows: Geotab company
```

---

## Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| **Navigate dropdown** | ↑ / ↓ arrows |
| **Select from dropdown** | Enter (when highlighted) |
| **Search all results** | Enter (no selection) |
| **Close dropdown** | Escape |

---

## Search Results Page Features

### What You See:
- ✅ **Total count**: "Found 15 companies matching..."
- ✅ **Relevance score**: Shows match percentage
- ✅ **Key metrics**: Revenue, fleet size, valuation
- ✅ **Markets**: Geographic presence
- ✅ **Products**: Products and services
- ✅ **Clickable cards**: Click anywhere to view details

### Search Again:
- Search bar at top of results page
- Type new query and press Enter
- Or select from autocomplete

---

## URL Structure

### Direct Links:
```
Search page:
/search

Results page:
/search-results?q=Samsara
/search-results?q=video+telematics
/search-results?q=fleet+management

Company page:
/companies/company-3
```

### Shareable Links:
You can share result URLs:
```
Share: /search-results?q=Samsara
Anyone who clicks will see Samsara results
```

---

## Tips

### Get Best Results:
1. ✅ **Company names**: "Samsara", "Geotab", "Motive"
2. ✅ **Keywords**: "video telematics", "ELD", "fleet"
3. ✅ **Products**: "video", "tracking", "telematics"
4. ✅ **Industries**: "fleet management", "logistics"

### Quick Navigation:
- **Autocomplete** → Fast (click suggestion)
- **Enter** → See all results
- **Examples** → Instant results

### Multiple Results:
- Press **Enter** to see all matches
- Use **Results page** to compare companies
- Click any company to see full details

---

## Pages Overview

| Page | URL | Purpose |
|------|-----|---------|
| **Search** | `/search` | Start searching |
| **Results** | `/search-results?q=...` | View all matches |
| **Company** | `/companies/[id]` | Company details |
| **Test** | `/test-search` | Debug/test |

---

## Quick Reference

### Want to find a specific company?
→ Use **autocomplete** (type and click)

### Want to see all matching companies?
→ **Press Enter** or use manual search

### Want to explore?
→ Click **example buttons**

### Want to compare companies?
→ Go to **results page**, see all matches

---

## Common Scenarios

### Scenario 1: "I know the exact company"
```
Type: Company name
Click: First suggestion
✓ Done - on company page
```

### Scenario 2: "I want to see all companies in category"
```
Type: "video telematics"
Press: Enter
✓ See all video companies
```

### Scenario 3: "I want to explore"
```
Click: Example button
✓ See instant results
```

### Scenario 4: "I want to compare revenue"
```
Type: Company category
Press: Enter
✓ See all with metrics
✓ Compare side by side
```

---

## Summary

🎯 **Two main paths:**

1. **Fast path**: Type → Click suggestion → Company page
2. **Browse path**: Type → Enter → Results page → Pick company

Both work great! Use autocomplete for speed, use results page for exploration.

---

**Start searching now:**
```
http://localhost:3000/search
```

Type "Samsara" and press **Enter** to see the results page! 🚀
