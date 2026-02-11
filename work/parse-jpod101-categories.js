// Script to parse jpod101_core100.csv and extract categories
// Run with: node parse-jpod101-categories.js

const fs = require('fs');
const path = require('path');

// Read the CSV file
const csvPath = path.join(__dirname, 'jpod101_core100.csv');
const csv = fs.readFileSync(csvPath, 'utf8');

// Parse CSV (simple parser, assumes well-formed CSV)
const lines = csv.split('\n').filter(line => line.trim());
const header = lines[0].split(',');

// Find column indices
const categoryIndex = 5; // Category column
const subcategoryIndex = 6; // Subcategory column

// Parse all rows
const categories = new Map(); // category -> { subcategories: Set, words: [] }

for (let i = 1; i < lines.length; i++) {
  const line = lines[i];
  if (!line.trim()) continue;

  // Simple CSV parse (won't handle quotes properly but works for this data)
  const parts = line.split(',');
  const category = parts[categoryIndex] || 'Other';
  const subcategory = parts[subcategoryIndex] || '';

  if (!categories.has(category)) {
    categories.set(category, {
      subcategories: new Set(),
      count: 0
    });
  }

  const catData = categories.get(category);
  catData.count++;
  if (subcategory) {
    catData.subcategories.add(subcategory);
  }
}

// Print summary
console.log('=== JPOD101 Core 100 Categories ===\n');
for (const [category, data] of categories) {
  console.log(`${category} (${data.count} words)`);
  if (data.subcategories.size > 0) {
    for (const sub of data.subcategories) {
      console.log(`  - ${sub}`);
    }
  }
}

console.log('\n=== Summary ===');
console.log(`Total categories: ${categories.size}`);
console.log(`Total words: ${lines.length - 1}`);
