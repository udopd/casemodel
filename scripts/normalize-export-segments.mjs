import fs from 'node:fs';
import path from 'node:path';

const OUT_DIR = path.resolve(process.cwd(), 'out');

/**
 * Normalizes Next.js 16 static export segment directories produced on Windows
 * (`__next.route\__PAGE__.txt` -> `__next.route.__PAGE__.txt`) so static servers
 * match the POSIX filename convention expected by Next.js client navigation.
 */
function normalizeSegmentsInDir(dirPath) {
  if (!fs.existsSync(dirPath)) return;

  for (const entry of fs.readdirSync(dirPath, { withFileTypes: true })) {
    const fullPath = path.join(dirPath, entry.name);
    if (!entry.isDirectory()) continue;

    if (entry.name.startsWith('__next.')) {
      const files = collectNestedFiles(fullPath);
      for (const relFile of files) {
        const flatSuffix = relFile.split(path.sep).join('.');
        const flatName = `${entry.name}.${flatSuffix}`;
        const destPath = path.join(dirPath, flatName);
        fs.copyFileSync(path.join(fullPath, relFile), destPath);
      }
      fs.rmSync(fullPath, { recursive: true, force: true });
    } else if (entry.name !== '_next') {
      normalizeSegmentsInDir(fullPath);
    }
  }
}

function collectNestedFiles(baseDir, currentDir = baseDir) {
  const results = [];
  for (const entry of fs.readdirSync(currentDir, { withFileTypes: true })) {
    const fullPath = path.join(currentDir, entry.name);
    if (entry.isDirectory()) {
      results.push(...collectNestedFiles(baseDir, fullPath));
    } else if (entry.isFile()) {
      results.push(path.relative(baseDir, fullPath));
    }
  }
  return results;
}

normalizeSegmentsInDir(OUT_DIR);
