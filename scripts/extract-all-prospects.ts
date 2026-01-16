import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

const prospectsDir = path.join(process.cwd(), 'Prospects');
const outputFile = path.join(process.cwd(), 'public', 'data', 'prospects-data.json');

interface ProspectCompany {
  name: string;
  category: string;
  contacts?: string;
  region?: string;
  verticals?: string;
  competitors?: string;
  priority?: string;
  notes?: string;
}

const allProspects: { [category: string]: ProspectCompany[] } = {
  "Insurance Companies & MGAs": [],
  "Geotab Resellers": [],
  "TSPs & Other Resellers": [],
  "Insurtech & Technology Partners": [],
  "Current Customers": []
};

// Read all CSV files
const files = fs.readdirSync(prospectsDir).filter(f => f.endsWith('.csv'));

files.forEach(file => {
  const filePath = path.join(prospectsDir, file);
  const content = fs.readFileSync(filePath, 'utf-8');
  
  try {
    const lines = content.split('\n');
    let currentCategory = "";
    
    lines.forEach((line, idx) => {
      const trimmed = line.trim();
      
      // Skip empty or header lines
      if (!trimmed || trimmed.startsWith('Unnamed') || trimmed.startsWith('ORGS,')) return;
      
      // Detect category headers
      if (trimmed.includes('INSURANCE') && !trimmed.startsWith(',')) {
        currentCategory = "Insurance Companies & MGAs";
      } else if (trimmed.includes('GEOTAB') && trimmed.includes('RESELLER')) {
        currentCategory = "Geotab Resellers";
      } else if (trimmed.includes('TSPs') || trimmed.includes('RESELLER')) {
        currentCategory = "TSPs & Other Resellers";
      } else if (trimmed.includes('Ins') && trimmed.includes('Tech')) {
        currentCategory = "Insurtech & Technology Partners";
      } else if (trimmed.includes('CURRENT CUSTOMER')) {
        currentCategory = "Current Customers";
      }
      
      // Extract company name (first column)
      const parts = line.split(',');
      const companyName = parts[0]?.trim();
      
      if (companyName && 
          companyName.length > 2 && 
          !companyName.includes('PRIORITY') &&
          !companyName.includes('ORGS') &&
          !companyName.match(/^[A-Z\s&]+$/) && // Skip all-caps headers
          currentCategory) {
        
        const company: ProspectCompany = {
          name: companyName,
          category: currentCategory,
          contacts: parts[1]?.trim() || undefined,
          priority: parts[1]?.trim() || "Medium",
          region: parts[5]?.trim() || "US",
          verticals: parts[6]?.trim() || undefined,
          competitors: parts[7]?.trim() || undefined,
          notes: parts[9]?.trim() || undefined
        };
        
        if (allProspects[currentCategory]) {
          allProspects[currentCategory].push(company);
        }
      }
    });
  } catch (error) {
    console.error(`Error processing ${file}:`, error);
  }
});

// Save to JSON
fs.writeFileSync(outputFile, JSON.stringify(allProspects, null, 2));

// Print summary
Object.keys(allProspects).forEach(category => {
  console.log(`${category}: ${allProspects[category].length} companies`);
});

console.log(`\n✅ Total prospects extracted: ${Object.values(allProspects).reduce((sum, arr) => sum + arr.length, 0)}`);
console.log(`📄 Saved to: ${outputFile}`);
