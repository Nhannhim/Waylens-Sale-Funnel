import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

// Read Prospects/Customers.csv and add companies to dataset
const prospectsFile = path.join(process.cwd(), 'Prospects', 'Customers.csv');
const datasetFile = path.join(process.cwd(), 'public', 'data', 'companies-dataset.json');

const csvContent = fs.readFileSync(prospectsFile, 'utf-8');
const records = parse(csvContent, { columns: true, skip_empty_lines: true });

// Extract prospect companies
const prospectCompanies = [
  { name: "GEICO", industry: "Insurance", vertical: "Insurance", region: "US" },
  { name: "Cover Whale", industry: "Insurance", vertical: "Insurance", region: "US" },
  { name: "Moter", industry: "Insurance Tech", vertical: "Insurance", region: "Global" },
  { name: "GPS Insight", industry: "Telematics Provider", vertical: "TSP/Reseller", region: "US" },
  { name: "Descartes", industry: "Supply Chain Software", vertical: "TSP/Reseller", region: "Global" },
  { name: "GPS Trackit", industry: "Fleet Management", vertical: "TSP/Reseller", region: "US" },
  { name: "Orion Fleet Intelligence", industry: "Fleet Telematics", vertical: "TSP/Reseller", region: "US" },
  { name: "Acetech", industry: "EMS Technology", vertical: "TSP/Reseller", region: "US" },
  { name: "Moter.ai", industry: "Insurance Tech", vertical: "TSP/Reseller", region: "US" },
  { name: "Traxero", industry: "Fleet Management", vertical: "TSP/Reseller", region: "US" },
  { name: "Gorilla Safety", industry: "Fleet Safety Solutions", vertical: "TSP/Reseller", region: "US" },
  { name: "Prometheus", industry: "Fleet Technology", vertical: "TSP/Reseller", region: "US" },
  { name: "RPM Global Connect", industry: "Fleet Solutions", vertical: "TSP/Reseller", region: "Global" },
  { name: "Konexial", industry: "Telematics Provider", vertical: "TSP/Reseller", region: "US" },
  { name: "Add On Systems", industry: "Video Telematics", vertical: "TSP/Reseller", region: "US/Canada" },
  { name: "eTrucks", industry: "Trucking Technology", vertical: "TSP/Reseller", region: "US/Canada" },
  { name: "Prophecta", industry: "Fleet Telematics", vertical: "TSP/Reseller", region: "Global" },
  { name: "EZ Fleet Tracking", industry: "Fleet Management", vertical: "TSP/Reseller", region: "Global" },
  { name: "Tourmo", industry: "Transportation Tech", vertical: "TSP/Reseller", region: "Global" },
];

// Load existing dataset
const dataset = JSON.parse(fs.readFileSync(datasetFile, 'utf-8'));
const existingCompanyNames = new Set(dataset.companies.map((c: any) => c.name.toLowerCase()));

let addedCount = 0;
const nextId = dataset.companies.length + 1;

// Add prospect companies that don't already exist
prospectCompanies.forEach((prospect, idx) => {
  if (!existingCompanyNames.has(prospect.name.toLowerCase())) {
    const companyId = `company-${nextId + addedCount}`;
    
    const newCompany = {
      id: companyId,
      name: prospect.name,
      category: [prospect.vertical],
      keywords: [
        prospect.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        prospect.industry.toLowerCase(),
        prospect.vertical.toLowerCase(),
        prospect.region.toLowerCase()
      ],
      metrics: {
        fleetSizeRange: "small"
      },
      geography: {
        markets: [prospect.region],
        region: [prospect.region],
        headquarters: prospect.region
      },
      business: {
        industry: prospect.industry,
        vertical: [prospect.vertical],
        products: [],
        ownership: "Private"
      },
      financials: {},
      relationships: {
        customers: [],
        partners: [],
        acquisitions: [],
        investors: []
      },
      sourceFiles: ["Prospects/Customers.csv"],
      lastUpdated: new Date().toISOString()
    };
    
    dataset.companies.push(newCompany);
    addedCount++;
  }
});

// Save updated dataset
fs.writeFileSync(datasetFile, JSON.stringify(dataset, null, 2));

console.log(`✅ Added ${addedCount} prospect companies to dataset`);
console.log(`📊 Total companies in dataset: ${dataset.companies.length}`);
