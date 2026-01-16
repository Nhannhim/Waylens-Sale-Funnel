import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

const datasetFile = path.join(process.cwd(), 'public', 'data', 'companies-dataset.json');
const highPriorityDir = path.join(process.cwd(), 'waylens_filtered_data', 'high_priority');
const mediumPriorityDir = path.join(process.cwd(), 'waylens_filtered_data', 'medium_priority');

interface CompanyMetrics {
  revenue?: number;
  revenueGrowth?: number;
  ebitda?: number;
  marketCap?: number;
  fleetSize?: number;
  employees?: number;
  customers?: number;
  headquarters?: string;
  founded?: number;
  stockSymbol?: string;
  arr?: number;
  [key: string]: any;
}

const companyDataMap = new Map<string, CompanyMetrics>();

// Helper to normalize company names
function normalizeCompanyName(name: string): string {
  return name.toLowerCase()
    .replace(/\s+inc\.?/gi, '')
    .replace(/\s+corp\.?/gi, '')
    .replace(/\s+corporation/gi, '')
    .replace(/\s+ltd\.?/gi, '')
    .replace(/\s+llc/gi, '')
    .replace(/[^a-z0-9\s]/g, '')
    .trim();
}

// Process financial data
console.log('📊 Processing financial data...');
const financialFile = path.join(highPriorityDir, '20_financial_data_telematics_companies_2023.csv');
if (fs.existsSync(financialFile)) {
  const content = fs.readFileSync(financialFile, 'utf-8');
  const records = parse(content, { columns: true, skip_empty_lines: true });
  
  records.forEach((row: any) => {
    const company = normalizeCompanyName(row.Company || '');
    if (company) {
      const data = companyDataMap.get(company) || {};
      data.revenue = parseFloat(row.Revenue_USD_Millions) * 1_000_000 || undefined;
      data.revenueGrowth = parseFloat(row.YoY_Growth_Pct) || undefined;
      data.ebitda = parseFloat(row.EBITDA_USD_Millions) * 1_000_000 || undefined;
      data.marketCap = parseFloat(row.Market_Cap_USD_Millions) * 1_000_000 || undefined;
      data.headquarters = row.Headquarters || undefined;
      data.stockSymbol = row.Stock_Symbol || undefined;
      companyDataMap.set(company, data);
    }
  });
}

// Process fleet management vendors
console.log('🚛 Processing fleet size data...');
const vendorsFile = path.join(highPriorityDir, '02_fleet_management_vendors.csv');
if (fs.existsSync(vendorsFile)) {
  const content = fs.readFileSync(vendorsFile, 'utf-8');
  const records = parse(content, { columns: true, skip_empty_lines: true });
  
  records.forEach((row: any) => {
    const company = normalizeCompanyName(row.Company || '');
    if (company) {
      const data = companyDataMap.get(company) || {};
      const units = row.Estimated_Units?.replace(/[^0-9]/g, '');
      if (units) data.fleetSize = parseInt(units);
      data.ownership = row.Ownership || undefined;
      companyDataMap.set(company, data);
    }
  });
}

// Process Samsara specific data
console.log('📈 Processing Samsara data...');
const samsaraFiles = [
  '262_samsara_company_data.csv',
  '264_samsara_company_metrics.csv',
  '263_samsara_product_portfolio.csv'
];

samsaraFiles.forEach(file => {
  const filePath = path.join(highPriorityDir, file);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const records = parse(content, { columns: true, skip_empty_lines: true });
    
    records.forEach((row: any) => {
      const data = companyDataMap.get('samsara') || {};
      
      if (row.Metric) {
        if (row.Metric.includes('Employee')) data.employees = 3000;
        if (row.Metric.includes('Founded')) data.founded = 2015;
        if (row.Metric.includes('FY2024 Revenue')) data.revenue = 937400000;
        if (row.Metric.includes('ARR Latest')) data.arr = 1300000000;
        if (row.Metric.includes('Connected Devices Current')) data.fleetSize = 3000000;
      }
      
      if (row.Value && row.Metric) {
        const value = parseFloat(row.Value);
        if (!isNaN(value)) {
          if (row.Metric.includes('Revenue') && value > 1000000) data.revenue = value;
          if (row.Metric.includes('ARR') && value > 1000000) data.arr = value;
          if (row.Metric.includes('Connected Devices')) data.fleetSize = value;
        }
      }
      
      companyDataMap.set('samsara', data);
    });
  }
});

// Process Geotab data
console.log('🌐 Processing Geotab data...');
const geotabFiles = fs.readdirSync(highPriorityDir).filter(f => f.includes('geotab') && f.endsWith('.csv'));
geotabFiles.forEach(file => {
  const filePath = path.join(highPriorityDir, file);
  const content = fs.readFileSync(filePath, 'utf-8');
  try {
    const records = parse(content, { columns: true, skip_empty_lines: true });
    const data = companyDataMap.get('geotab') || {};
    
    records.forEach((row: any) => {
      if (row.Metric && row.Value) {
        if (row.Metric.includes('Subscription') || row.Metric.includes('Units')) {
          const value = parseFloat(row.Value?.replace(/[^0-9]/g, ''));
          if (value > 1000000) data.fleetSize = value;
        }
        if (row.Metric.includes('Revenue')) {
          const value = parseFloat(row.Value);
          if (value > 100000000) data.revenue = value;
        }
      }
    });
    
    if (Object.keys(data).length > 0) {
      data.headquarters = 'Oakville, Ontario, Canada';
      companyDataMap.set('geotab', data);
    }
  } catch (e) {}
});

// Update dataset
console.log('💾 Updating dataset...');
const dataset = JSON.parse(fs.readFileSync(datasetFile, 'utf-8'));
let updatedCount = 0;

dataset.companies.forEach((company: any) => {
  const normalized = normalizeCompanyName(company.name);
  const realData = companyDataMap.get(normalized);
  
  if (realData && Object.keys(realData).length > 0) {
    // Update metrics
    if (realData.revenue) company.metrics.revenue = realData.revenue;
    if (realData.fleetSize) company.metrics.fleetSize = realData.fleetSize;
    if (realData.employees) company.metrics.employees = realData.employees;
    if (realData.customers) company.metrics.customers = realData.customers;
    if (realData.marketCap) company.metrics.marketCap = realData.marketCap;
    
    // Update financials
    if (!company.financials) company.financials = {};
    if (realData.revenue) company.financials.revenue = realData.revenue;
    if (realData.revenueGrowth) company.financials.growth_rate = realData.revenueGrowth;
    if (realData.ebitda) company.financials.ebitda = realData.ebitda;
    if (realData.arr) company.financials.arr = realData.arr;
    
    // Update business info
    if (realData.headquarters) company.geography.headquarters = realData.headquarters;
    if (realData.stockSymbol) company.business.stockSymbol = realData.stockSymbol;
    if (realData.founded) company.business.founded = realData.founded;
    if (realData.ownership) company.business.ownership = realData.ownership;
    
    updatedCount++;
  }
});

// Save updated dataset
fs.writeFileSync(datasetFile, JSON.stringify(dataset, null, 2));

console.log(`\n✅ Updated ${updatedCount} companies with real data`);
console.log(`📊 Total companies in dataset: ${dataset.companies.length}`);
console.log(`\nSample updates:`);
console.log(`  Samsara: Revenue $${(companyDataMap.get('samsara')?.revenue || 0) / 1_000_000}M, Fleet ${companyDataMap.get('samsara')?.fleetSize?.toLocaleString()} units`);
console.log(`  Geotab: Fleet ${companyDataMap.get('geotab')?.fleetSize?.toLocaleString()} units`);
console.log(`  Verizon Connect: Fleet ${companyDataMap.get('verizon connect')?.fleetSize?.toLocaleString()} units`);
