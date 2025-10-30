const fs = require('fs');
const path = require('path');

const ROOT = '/workspace';
const TEXT_EXTS = new Set(['.ts', '.tsx', '.js', '.jsx', '.json', '.md', '.css', '.scss', '.mjs', '.cjs']);
const IGNORE_DIRS = new Set(['node_modules', '.git', '.expo', 'build', 'dist']);

function hasAnyMarkers(content) {
  return content.includes('<<<<<<<') || content.includes('=======') || content.includes('>>>>>>>');
}

function resolveConflictsKeepHead(content) {
  // First, replace all well-formed conflict blocks by keeping the HEAD side
  const conflictBlock = /<<<<<<< HEAD\r?\n([\s\S]*?)\r?\n=======\r?\n([\s\S]*?)\r?\n>>>>>>>(?: .*)?\r?\n?/g;
  let replaced = content.replace(conflictBlock, '$1');

  // In case of edge cases (EOF without newline), try a second regex variant
  const conflictBlockEOF = /<<<<<<< HEAD\r?\n([\s\S]*?)\r?\n=======\r?\n([\s\S]*?)\r?\n?>>>>>>>(?: .*)?/g;
  replaced = replaced.replace(conflictBlockEOF, '$1');

  // Remove any stray markers that might remain
  replaced = replaced.replace(/^<<<<<<<.*$\n?/gm, '');
  replaced = replaced.replace(/^=======$\n?/gm, '');
  replaced = replaced.replace(/^>>>>>>>.*$\n?/gm, '');

  return replaced;
}

function shouldProcessFile(filePath) {
  const ext = path.extname(filePath);
  if (!TEXT_EXTS.has(ext)) return false;
  return true;
}

function walkAndFix(targetDir) {
  const entries = fs.readdirSync(targetDir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(targetDir, entry.name);
    if (entry.isDirectory()) {
      if (IGNORE_DIRS.has(entry.name)) continue;
      walkAndFix(fullPath);
    } else if (entry.isFile()) {
      if (!shouldProcessFile(fullPath)) continue;
      try {
        const content = fs.readFileSync(fullPath, 'utf8');
        if (hasAnyMarkers(content)) {
          const resolved = resolveConflictsKeepHead(content);
          if (resolved !== content) {
            fs.writeFileSync(fullPath, resolved, 'utf8');
            process.stdout.write(`Cleaned markers in ${fullPath}\n`);
          }
        }
      } catch (err) {
        process.stderr.write(`Error processing ${fullPath}: ${err.message}\n`);
      }
    }
  }
}

function main() {
  const base = ROOT;
  walkAndFix(base);
}

if (require.main === module) {
  main();
}
