# 🔧 Troubleshooting Search Issues

## Issue: Search Bar Not Working / Can't Type

### Symptoms
- Search bar is grayed out / disabled
- Can't type in the search field
- No results appear when typing
- Search seems stuck in "loading" state

### Causes & Solutions

#### 1. **Dataset Not Loading** (Most Common)

**Check:**
```bash
# Verify dataset file exists
ls -lh public/data/companies-dataset.json

# Should show: -rw-r--r-- ... 417K ... companies-dataset.json
```

**Fix:**
```bash
# Regenerate the dataset
npm run generate-dataset

# Restart dev server
npm run dev
```

#### 2. **Dev Server Not Running**

**Check:**
```bash
# Make sure dev server is running
# You should see: "Local: http://localhost:3000"
```

**Fix:**
```bash
# Kill any existing processes
pkill -f "next dev"

# Start fresh
npm run dev
```

#### 3. **Browser Console Errors**

**Check:**
1. Open browser DevTools (F12 or Cmd+Option+I)
2. Go to Console tab
3. Look for red errors

**Common Errors:**

**Error: "Failed to load dataset"**
- Dataset file missing or path wrong
- Solution: Regenerate dataset

**Error: "404 Not Found: /data/companies-dataset.json"**
- File not in public folder
- Solution: Move file to `public/data/` folder

**Error: "Unexpected token in JSON"**
- Dataset file corrupted
- Solution: Regenerate dataset

#### 4. **Test Page for Debugging**

Visit the test page to see what's happening:
```
http://localhost:3000/test-search
```

This page shows:
- Loading state
- Error messages
- Dataset status
- Sample companies
- Direct search test

### Quick Fixes

#### Fix 1: Hard Refresh
```
Windows/Linux: Ctrl + Shift + R
Mac: Cmd + Shift + R
```

#### Fix 2: Clear Browser Cache
```
1. Open DevTools (F12)
2. Right-click refresh button
3. Select "Empty Cache and Hard Reload"
```

#### Fix 3: Restart Everything
```bash
# Kill server
Ctrl + C (in terminal)

# Clear Next.js cache
rm -rf .next

# Regenerate dataset
npm run generate-dataset

# Start fresh
npm run dev
```

### Verification Steps

#### Step 1: Check Dataset
```bash
# Should return "Samsara"
grep -i "samsara" public/data/companies-dataset.json | head -1
```

#### Step 2: Test Direct URL
Visit: `http://localhost:3000/data/companies-dataset.json`

You should see JSON data (not a 404 error)

#### Step 3: Check Test Page
Visit: `http://localhost:3000/test-search`

Should show:
- Loading: No
- Error: None
- Dataset Loaded: Yes
- Search Available: Yes
- Total Companies: 522

#### Step 4: Try Search
1. Go to: `http://localhost:3000/search`
2. Search field should NOT be grayed out
3. Type "Samsara"
4. Results should appear after 300ms

### Debug Mode

I've added debug logging to the search bar. Check the browser console for:
```
Search bar state: { loading: false, hasSearch: true, error: null }
```

If you see:
- `loading: true` stuck → Dataset not loading
- `hasSearch: false` → CompanySearch class not initializing
- `error: "..."` → Check error message

### Common Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| Gray/disabled input | Still loading | Wait 2-3 seconds or refresh |
| "Loading database..." | Dataset loading | Wait or check console |
| No suggestions appear | Search not initialized | Check test page |
| "No companies found" | Typo or missing data | Try "Geotab" or "Samsara" |
| Blank dropdown | Results empty | Check dataset has data |

### Manual Test

Open browser console and run:
```javascript
// Test if dataset loads
fetch('/data/companies-dataset.json')
  .then(r => r.json())
  .then(d => console.log('Dataset companies:', d.companies.length))
  .catch(e => console.error('Error:', e));
```

Should log: `Dataset companies: 522`

### Still Not Working?

1. **Check file location:**
   ```
   public/
     data/
       companies-dataset.json  ← Must be here
   ```

2. **Check file size:**
   ```bash
   ls -lh public/data/companies-dataset.json
   # Should be around 417KB
   ```

3. **Verify JSON is valid:**
   ```bash
   # Should not error
   cat public/data/companies-dataset.json | jq . > /dev/null
   ```

4. **Try simple search page:**
   Visit `/search` instead of `/company-search`

5. **Check terminal output:**
   Look for errors in the terminal where `npm run dev` is running

### Emergency Reset

If nothing works:
```bash
# 1. Stop server
Ctrl + C

# 2. Clean everything
rm -rf .next
rm -rf node_modules/.cache
rm -rf public/data/companies-dataset.json

# 3. Regenerate
npm run generate-dataset

# 4. Rebuild
npm run build

# 5. Start dev
npm run dev
```

### Get Help

If issue persists:
1. Visit `/test-search` page
2. Take screenshot of debug info
3. Check browser console for errors
4. Check terminal for errors
5. Share the error messages

### Success Checklist

✅ Dataset file exists: `public/data/companies-dataset.json`  
✅ File size is ~417KB  
✅ Dev server running on port 3000  
✅ Can access `/data/companies-dataset.json` in browser  
✅ Test page shows all green: `/test-search`  
✅ Search input is NOT grayed out  
✅ Can type in search field  
✅ Results appear after typing  

### Quick Test

Run this one command to test everything:
```bash
npm run dev &
sleep 5
curl http://localhost:3000/data/companies-dataset.json | grep -q "Samsara" && echo "✅ Working!" || echo "❌ Problem!"
```

---

**Most Common Fix:** Just regenerate the dataset and refresh the browser!
```bash
npm run generate-dataset
# Then refresh browser with Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
```
