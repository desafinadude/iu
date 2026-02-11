// Script to convert jlptN5Data.json to CSV format
// Run with: node convert-jlpt-to-csv.js

const fs = require('fs');
const path = require('path');

// Read the JLPT N5 data
const jlptData = require('../src/data/jlptN5Data.json');

// CSV header matching jpod101 format
const header = 'Kanji,Kana,Romaji,English,Part of Speech,Category,Subcategory,Example (JP),Example (Kana),Example (Romaji),Example (EN)';

// Convert vocabulary to CSV rows
const rows = jlptData.vocabulary.map(entry => {
  // Extract kanji from word if it contains kanji, otherwise use word
  const hasKanji = /[\u4e00-\u9faf]/.test(entry.word);
  const kanji = hasKanji ? entry.word : '';
  const kana = entry.furigana || entry.word;
  const romaji = entry.romaji || '';
  const english = entry.meaning || '';
  const partOfSpeech = ''; // Not provided in jlptN5Data
  const category = entry.category || 'general';
  const subcategory = '';

  // Example sentences (not available in jlptN5Data, will be empty)
  const exampleJP = '';
  const exampleKana = '';
  const exampleRomaji = '';
  const exampleEN = '';

  // Escape commas and quotes in CSV fields
  const escapeCSV = (field) => {
    if (!field) return '';
    if (field.includes(',') || field.includes('"') || field.includes('\n')) {
      return `"${field.replace(/"/g, '""')}"`;
    }
    return field;
  };

  return [
    escapeCSV(kanji),
    escapeCSV(kana),
    escapeCSV(romaji),
    escapeCSV(english),
    escapeCSV(partOfSpeech),
    escapeCSV(category),
    escapeCSV(subcategory),
    escapeCSV(exampleJP),
    escapeCSV(exampleKana),
    escapeCSV(exampleRomaji),
    escapeCSV(exampleEN)
  ].join(',');
});

// Combine header and rows
const csv = [header, ...rows].join('\n');

// Write to file
const outputPath = path.join(__dirname, 'jlptN5_vocab.csv');
fs.writeFileSync(outputPath, '\ufeff' + csv, 'utf8'); // Add BOM for Excel compatibility

console.log(`Converted ${rows.length} vocabulary entries to ${outputPath}`);
console.log('Note: Example sentences are not available in the source data and will need to be added manually.');
