import fs from 'fs';
import { SCHEMES_DATABASE } from './src/data/schemes';
import { Scheme } from './src/types';

const files = [
  './temp_pub_safety.json',
  './temp_science_it.json',
  './temp_skills_emp.json',
  './temp_social_welfare.json',
  './temp_sports_culture.json',
  './temp_transport_infra.json',
  './temp_travel_tourism.json',
  './temp_utility_sanitation.json',
  './temp_women_child.json',
];

const categoryCounts: Record<string, number> = {};

// Count from existing database
for (const s of SCHEMES_DATABASE) {
  categoryCounts[s.category] = (categoryCounts[s.category] || 0) + 1;
}

console.log('=== BEFORE TEMP MERGE ===');
console.table(categoryCounts);

const allSchemes: Scheme[] = [...SCHEMES_DATABASE];

for (const file of files) {
  if (fs.existsSync(file)) {
    const data: Scheme[] = JSON.parse(fs.readFileSync(file, 'utf-8'));
    allSchemes.push(...data);
  } else {
    console.log('File missing:', file);
  }
}

const mergedCounts: Record<string, number> = {};
for (const s of allSchemes) {
  let cat = s.category;
  if (cat === 'Skill Development') cat = 'Skills & Employment';
  if (cat === 'Women Empowerment') cat = 'Women & Child';
  mergedCounts[cat] = (mergedCounts[cat] || 0) + 1;
}

console.log('=== AFTER TEMP MERGE (WITH REMAPPING) ===');
Object.entries(mergedCounts).sort((a,b) => b[1] - a[1]).forEach(([cat, count]) => {
  console.log(`${cat.padEnd(45)}: ${count} ${count >= 50 ? '✅' : '❌ NEED MORE'}`);
});
