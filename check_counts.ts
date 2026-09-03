import fs from 'fs';
import { SCHEMES_DATABASE } from './src/data/schemes';

const counts: Record<string, number> = {};
for (const s of SCHEMES_DATABASE) {
  counts[s.category] = (counts[s.category] || 0) + 1;
}

console.log('--- EXISTING SCHEMES IN SRC/DATA/SCHEMES.TS ---');
console.log(counts);
