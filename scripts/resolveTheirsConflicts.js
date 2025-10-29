#!/usr/bin/env node
/* Resolve Git conflict markers by keeping the 'theirs' section (after =======).
   Applies to all files under cwd excluding node_modules and .git. */
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();

function shouldSkipDir(dirName) {
  return dirName === 'node_modules' || dirName === '.git' || dirName === '.expo';
}

function listFiles(dir) {
  const res = [];
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (shouldSkipDir(ent.name)) continue;
      res.push(...listFiles(full));
    } else if (ent.isFile()) {
      res.push(full);
    }
  }
  return res;
}

function resolveTheirs(content) {
  const conflictRegex = /^<<<<<<< HEAD\r?\n([\s\S]*?)^=======\r?\n([\s\S]*?)^>>>>>>> .*\r?$/m;
  let out = content;
  let changed = false;
  let guard = 0;
  while (conflictRegex.test(out)) {
    out = out.replace(conflictRegex, (match, ours, theirs) => {
      changed = true;
      return theirs.replace(/\r?\n$/, '');
    });
    guard++;
    if (guard > 1000) break;
  }
  return { content: out, changed };
}

function stripMarkers(content) {
  const lines = content.split(/\r?\n/);
  const filtered = lines.filter((line) => !(line.startsWith('<<<<<<<') || line.startsWith('=======') || line.startsWith('>>>>>>>')));
  const changed = filtered.length !== lines.length;
  return { content: filtered.join('\n'), changed };
}

function main() {
  const files = listFiles(ROOT);
  let changedFiles = 0;
  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    if (['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.ico', '.ttf', '.otf', '.mp3', '.mp4', '.zip', '.gz'].includes(ext)) continue;
    let content;
    try { content = fs.readFileSync(file, 'utf8'); } catch { continue; }
    if (!content.includes('<<<<<<< HEAD')) continue;
    const { content: resolved, changed } = resolveTheirs(content);
    if (changed) {
      fs.writeFileSync(file, resolved, 'utf8');
      console.log(`Resolved (theirs) in: ${path.relative(ROOT, file)}`);
      changedFiles++;
    } else {
      // Attempt to strip lone markers if malformed
      const { content: stripped, changed: strippedChanged } = stripMarkers(content);
      if (strippedChanged) {
        fs.writeFileSync(file, stripped, 'utf8');
        console.log(`Stripped markers in: ${path.relative(ROOT, file)}`);
        changedFiles++;
      }
    }
  }
  console.log(`Done. Files updated: ${changedFiles}`);
}

if (require.main === module) main();
