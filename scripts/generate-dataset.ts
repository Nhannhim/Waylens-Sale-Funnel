import path from 'path';
import { DataProcessor } from '../lib/data-processor';

async function main() {
  console.log('Starting data processing...');

  const dataDir = path.join(process.cwd(), 'waylens_filtered_data', 'high_priority');
  const outputPath = path.join(process.cwd(), 'public', 'data', 'companies-dataset.json');

  const processor = new DataProcessor(dataDir);

  // Process all CSV files
  await processor.processAllFiles();

  // Export to JSON
  processor.exportToJSON(outputPath);

  // Get dataset for statistics
  const dataset = processor.getDataset();
  
  console.log('\n=== Dataset Statistics ===');
  console.log(`Total companies: ${dataset.companies.size}`);
  console.log(`Total keywords: ${dataset.index.byKeyword.size}`);
  console.log(`Revenue ranges: ${Array.from(dataset.index.byRevenueRange.keys()).join(', ')}`);
  console.log(`Fleet size ranges: ${Array.from(dataset.index.byFleetSize.keys()).join(', ')}`);
  console.log(`Valuation ranges: ${Array.from(dataset.index.byValuation.keys()).join(', ')}`);
  console.log(`Geographies: ${dataset.index.byGeography.size}`);

  console.log('\n=== Sample Companies ===');
  let count = 0;
  for (const [id, company] of dataset.companies) {
    if (count >= 5) break;
    console.log(`\n${company.name}:`);
    console.log(`  - Revenue: $${(company.metrics.revenue || 0).toLocaleString()} (${company.metrics.revenueRange || 'N/A'})`);
    console.log(`  - Fleet Size: ${(company.metrics.fleetSize || 0).toLocaleString()} (${company.metrics.fleetSizeRange || 'N/A'})`);
    console.log(`  - Valuation: $${(company.metrics.valuation || 0).toLocaleString()} (${company.metrics.valuationRange || 'N/A'})`);
    console.log(`  - Markets: ${company.geography.markets.slice(0, 3).join(', ')}`);
    console.log(`  - Keywords: ${company.keywords.slice(0, 5).join(', ')}`);
    count++;
  }

  console.log('\nData processing complete!');
}

main().catch(console.error);
