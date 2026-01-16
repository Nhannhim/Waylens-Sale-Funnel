import fs from 'fs';
import path from 'path';

const prospectsFile = path.join(process.cwd(), 'public', 'data', 'prospects-data.json');
const datasetFile = path.join(process.cwd(), 'public', 'data', 'companies-dataset.json');

const prospects = JSON.parse(fs.readFileSync(prospectsFile, 'utf-8'));
const dataset = JSON.parse(fs.readFileSync(datasetFile, 'utf-8'));

const existingNames = new Set(dataset.companies.map((c: any) => c.name.toLowerCase()));
let addedCount = 0;

Object.keys(prospects).forEach(category => {
  prospects[category].forEach((prospect: any) => {
    if (!existingNames.has(prospect.name.toLowerCase())) {
      const companyId = `company-${dataset.companies.length + 1}`;
      
      const newCompany = {
        id: companyId,
        name: prospect.name,
        category: [category],
        keywords: [
          prospect.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          category.toLowerCase(),
          prospect.verticals?.toLowerCase() || '',
          prospect.region?.toLowerCase() || 'us'
        ].filter(Boolean),
        metrics: {
          fleetSizeRange: "small"
        },
        geography: {
          markets: [prospect.region || "US"],
          region: [prospect.region || "US"],
          headquarters: prospect.region || "US"
        },
        business: {
          industry: prospect.verticals || category,
          vertical: [prospect.verticals || category],
          products: [],
          ownership: "Private"
        },
        financials: {},
        relationships: {
          customers: [],
          partners: prospect.competitors ? prospect.competitors.split(',').map((c: string) => c.trim()) : [],
          acquisitions: [],
          investors: []
        },
        sourceFiles: ["Prospects/*.csv"],
        lastUpdated: new Date().toISOString(),
        prospectData: {
          contacts: prospect.contacts,
          competitors: prospect.competitors,
          priority: prospect.priority,
          notes: prospect.notes
        }
      };
      
      dataset.companies.push(newCompany);
      existingNames.add(prospect.name.toLowerCase());
      addedCount++;
    }
  });
});

fs.writeFileSync(datasetFile, JSON.stringify(dataset, null, 2));

console.log(`✅ Added ${addedCount} new prospect companies`);
console.log(`📊 Total companies in dataset: ${dataset.companies.length}`);
console.log(`\nBreakdown by category:`);
Object.keys(prospects).forEach(cat => {
  console.log(`  ${cat}: ${prospects[cat].length} companies`);
});
