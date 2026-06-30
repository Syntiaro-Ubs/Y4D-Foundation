/**
 * Production build script for y4d-india branch
 *
 * Before building: comments out localhost fallback URLs and activates
 * production URLs (https://y4d.ngo/dev/api) in src/config/api.js.
 * After building: restores the original file so dev still works.
 *
 * Run via: npm run build
 */

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const apiConfigPath = path.join(__dirname, '../src/config/api.js');

const original = readFileSync(apiConfigPath, 'utf8');

// Swap localhost lines (active → commented) and production lines (commented → active)
const swapped = original
  .replace(
    `const API_BASE_URL = getEnvVar('VITE_API_BASE_URL', 'http://localhost:5000/api');`,
    `// const API_BASE_URL = getEnvVar('VITE_API_BASE_URL', 'http://localhost:5000/api');`
  )
  .replace(
    `const UPLOADS_BASE_URL = getEnvVar('VITE_UPLOADS_BASE_URL','http://localhost:5000/api/uploads');`,
    `// const UPLOADS_BASE_URL = getEnvVar('VITE_UPLOADS_BASE_URL','http://localhost:5000/api/uploads');`
  )
  .replace(
    `// const API_BASE_URL = getEnvVar('VITE_API_BASE_URL', 'https://y4d.ngo/dev/api');`,
    `const API_BASE_URL = getEnvVar('VITE_API_BASE_URL', 'https://y4d.ngo/dev/api');`
  )
  .replace(
    `// const UPLOADS_BASE_URL = getEnvVar('VITE_UPLOADS_BASE_URL', 'https://y4d.ngo/dev/api/uploads'); `,
    `const UPLOADS_BASE_URL = getEnvVar('VITE_UPLOADS_BASE_URL', 'https://y4d.ngo/dev/api/uploads');`
  );

if (original === swapped) {
  console.error('❌ No URL swap occurred — check that api.js matches expected format.');
  process.exit(1);
}

writeFileSync(apiConfigPath, swapped, 'utf8');
console.log('✅ Switched api.js to production URLs (https://y4d.ngo/dev/api)');

try {
  execSync('npx vite build', { stdio: 'inherit', cwd: path.join(__dirname, '..') });
  console.log('✅ Production build complete');
} finally {
  writeFileSync(apiConfigPath, original, 'utf8');
  console.log('✅ Restored api.js to development URLs (localhost:5000)');
}
