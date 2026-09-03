import fs from 'fs';
import path from 'path';
import { SCHEMES_DATABASE } from './src/data/schemes';
import { Scheme } from './src/types';

// Read all 9 generated JSON files
const pubSafety: Scheme[] = JSON.parse(fs.readFileSync('./temp_pub_safety.json', 'utf-8'));
const scienceIt: Scheme[] = JSON.parse(fs.readFileSync('./temp_science_it.json', 'utf-8'));
const skillsEmp: Scheme[] = JSON.parse(fs.readFileSync('./temp_skills_emp.json', 'utf-8'));
const socialWelfare: Scheme[] = JSON.parse(fs.readFileSync('./temp_social_welfare.json', 'utf-8'));
const sportsCulture: Scheme[] = JSON.parse(fs.readFileSync('./temp_sports_culture.json', 'utf-8'));
const transportInfra: Scheme[] = JSON.parse(fs.readFileSync('./temp_transport_infra.json', 'utf-8'));
const travelTourism: Scheme[] = JSON.parse(fs.readFileSync('./temp_travel_tourism.json', 'utf-8'));
const utilitySanitation: Scheme[] = JSON.parse(fs.readFileSync('./temp_utility_sanitation.json', 'utf-8'));
const womenChild: Scheme[] = JSON.parse(fs.readFileSync('./temp_women_child.json', 'utf-8'));

const newBatches = [
  ...pubSafety,
  ...scienceIt,
  ...skillsEmp,
  ...socialWelfare,
  ...sportsCulture,
  ...transportInfra,
  ...travelTourism,
  ...utilitySanitation,
  ...womenChild,
];

// Normalize category names from older existing database entries if any
const normalizedExistingDatabase = SCHEMES_DATABASE.map(scheme => {
  let category = scheme.category;
  if (category === 'Women Empowerment') category = 'Women & Child';
  if (category === 'Skill Development') category = 'Skills & Employment';
  return { ...scheme, category };
});

console.log('Existing schemes in database:', normalizedExistingDatabase.length);
console.log('New schemes to append:', newBatches.length);

const existingIds = new Set(normalizedExistingDatabase.map(s => s.id));
const deduplicatedNew: Scheme[] = [];

for (const scheme of newBatches) {
  if (existingIds.has(scheme.id)) {
    console.warn('Duplicate ID skipped:', scheme.id);
  } else {
    existingIds.add(scheme.id);
    deduplicatedNew.push(scheme);
  }
}

const finalDatabase = [...normalizedExistingDatabase, ...deduplicatedNew];
console.log('Total combined schemes:', finalDatabase.length);

// Verify count by category
const categoryCounts: Record<string, number> = {};
for (const scheme of finalDatabase) {
  categoryCounts[scheme.category] = (categoryCounts[scheme.category] || 0) + 1;
}

console.log('\n--- SCHEME COUNTS BY CATEGORY ---');
Object.entries(categoryCounts).sort((a,b) => b[1] - a[1]).forEach(([cat, count]) => {
  console.log(`${cat}: ${count}`);
});

const fileContent = `import { Scheme } from '../types';

export const SCHEMES_DATABASE: Scheme[] = ${JSON.stringify(finalDatabase, null, 2)};
`;

fs.writeFileSync('./src/data/schemes.ts', fileContent, 'utf-8');
console.log('\nSuccessfully wrote updated SCHEMES_DATABASE to /src/data/schemes.ts!');

