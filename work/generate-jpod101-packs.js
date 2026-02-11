// Script to generate jpod101VocabPacks.js from CSV
// Run with: node generate-jpod101-packs.js

const fs = require('fs');
const path = require('path');

// Read the CSV file
const csvPath = path.join(__dirname, 'jpod101_core100.csv');
const csv = fs.readFileSync(csvPath, 'utf8');

// Simple CSV parser
function parseCSV(csvText) {
  const lines = csvText.trim().split('\n');
  if (lines.length === 0) return [];

  const header = parseCSVLine(lines[0]);
  const data = [];

  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    const values = parseCSVLine(lines[i]);
    const row = {};
    header.forEach((key, index) => {
      row[key] = values[index] || '';
    });
    data.push(row);
  }

  return data;
}

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current);
  return result;
}

// Parse CSV
const parsedData = parseCSV(csv);

// Convert to vocab format
const vocabData = parsedData.map(row => ({
  kanji: row.Kanji || '',
  kana: row.Kana || '',
  romaji: row.Romaji || '',
  english: row.English || '',
  partOfSpeech: row['Part of Speech'] || '',
  category: row.Category || '',
  subcategory: row.Subcategory || '',
  exampleJP: row['Example (JP)'] || '',
  exampleKana: row['Example (Kana)'] || '',
  exampleRomaji: row['Example (Romaji)'] || '',
  exampleEN: row['Example (EN)'] || '',
}));

// Group by category
function groupByCategory(data) {
  const groups = {};

  data.forEach(word => {
    const category = word.category || 'Other';
    const subcategory = word.subcategory;

    if (!groups[category]) {
      groups[category] = { main: [], subcategories: {} };
    }

    if (subcategory) {
      if (!groups[category].subcategories[subcategory]) {
        groups[category].subcategories[subcategory] = [];
      }
      groups[category].subcategories[subcategory].push(word);
    } else {
      groups[category].main.push(word);
    }
  });

  return groups;
}

const groupedWords = groupByCategory(vocabData);

// Helper to convert word to quiz format
function toQuizFormat(word) {
  const displayWord = word.kanji || word.kana;
  return {
    word: displayWord,
    kana: word.kana,
    romaji: word.romaji,
    translation: word.english,
    furigana: word.kana,
    example: word.exampleJP || '',
    exampleKana: word.exampleKana || '',
    exampleRomaji: word.exampleRomaji || '',
    exampleEN: word.exampleEN || '',
  };
}

// Create packs array
const packs = [];

// Everyday Words
if (groupedWords['Everyday Words']) {
  const everyday = groupedWords['Everyday Words'];

  if (everyday.main.length > 0) {
    packs.push({
      id: 'jpod101_everyday_basic',
      name: 'Everyday Words',
      category: 'basics',
      source: 'JPod101 Core',
      words: everyday.main.map(toQuizFormat),
      price: 20,
    });
  }

  if (everyday.subcategories['Clock']) {
    packs.push({
      id: 'jpod101_time',
      name: 'Time & Clock',
      category: 'time',
      source: 'JPod101 Core',
      words: everyday.subcategories['Clock'].map(toQuizFormat),
      price: 15,
    });
  }

  if (everyday.subcategories['Common Expressions']) {
    packs.push({
      id: 'jpod101_expressions',
      name: 'Common Expressions',
      category: 'basics',
      source: 'JPod101 Core',
      words: everyday.subcategories['Common Expressions'].map(toQuizFormat),
      price: 15,
    });
  }

  if (everyday.subcategories['Days of The Week']) {
    packs.push({
      id: 'jpod101_days',
      name: 'Days of the Week',
      category: 'time',
      source: 'JPod101 Core',
      words: everyday.subcategories['Days of The Week'].map(toQuizFormat),
      price: 15,
    });
  }

  if (everyday.subcategories['Numbers']) {
    packs.push({
      id: 'jpod101_numbers',
      name: 'Numbers (JPod)',
      category: 'numbers',
      source: 'JPod101 Core',
      words: everyday.subcategories['Numbers'].map(toQuizFormat),
      price: 15,
    });
  }
}

// Food and Drink
if (groupedWords['Food and Drink']) {
  const food = groupedWords['Food and Drink'];

  if (food.main.length > 0) {
    packs.push({
      id: 'jpod101_food',
      name: 'Food & Drink',
      category: 'food',
      source: 'JPod101 Core',
      words: food.main.map(toQuizFormat),
      price: 15,
    });
  }

  if (food.subcategories['Meats']) {
    packs.push({
      id: 'jpod101_meats',
      name: 'Meats',
      category: 'food',
      source: 'JPod101 Core',
      words: food.subcategories['Meats'].map(toQuizFormat),
      price: 10,
    });
  }

  if (food.subcategories['Seafood']) {
    packs.push({
      id: 'jpod101_seafood',
      name: 'Seafood',
      category: 'food',
      source: 'JPod101 Core',
      words: food.subcategories['Seafood'].map(toQuizFormat),
      price: 10,
    });
  }
}

// Health and Body
if (groupedWords['Health and Body']) {
  packs.push({
    id: 'jpod101_body',
    name: 'Body Parts',
    category: 'body',
    source: 'JPod101 Core',
    words: [...groupedWords['Health and Body'].main].map(toQuizFormat),
    price: 15,
  });
}

// School and Work
if (groupedWords['School and Work']) {
  const work = groupedWords['School and Work'];

  if (work.subcategories['Occupations']) {
    packs.push({
      id: 'jpod101_occupations',
      name: 'Occupations',
      category: 'work',
      source: 'JPod101 Core',
      words: work.subcategories['Occupations'].map(toQuizFormat),
      price: 15,
    });
  }
}

// Generate JavaScript file
const jsContent = `// Auto-generated from jpod101_core100.csv
// DO NOT EDIT MANUALLY - Run 'node work/generate-jpod101-packs.js' to regenerate

export const jpod101VocabPacks = ${JSON.stringify(packs, null, 2)};

export default jpod101VocabPacks;
`;

const outputPath = path.join(__dirname, '..', 'src', 'data', 'jpod101VocabPacks.js');
fs.writeFileSync(outputPath, jsContent, 'utf8');

console.log(`Generated ${packs.length} vocab packs with ${packs.reduce((sum, p) => sum + p.words.length, 0)} total words`);
console.log(`Output: ${outputPath}`);
