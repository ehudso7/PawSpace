const fs = require('fs');
const path = require('path');

function listFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (entry.name === 'node_modules' || entry.name === '.git') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...listFiles(full));
    } else {
      files.push(full);
    }
  }
  return files;
}

function hasConflictMarkers(content) {
  return content.includes('<<<<<<<') || content.includes('=======') || content.includes('>>>>>>>');
}

function resolveConflictsKeepHead(content) {
  const lines = content.split(/\r?\n/);
  const stack = []; // stack of { inHead: boolean }
  const out = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith('<<<<<<<')) {
      stack.push({ inHead: true });
      continue; // skip marker
    }
    if (line.startsWith('=======')) {
      if (stack.length > 0) stack[stack.length - 1].inHead = false;
      continue; // skip marker
    }
    if (line.startsWith('>>>>>>>')) {
      stack.pop();
      continue; // skip marker
    }
    if (stack.length === 0 || stack[stack.length - 1].inHead) {
      out.push(line);
    }
  }

  return out.join('\n');
}

function main() {
  const root = process.argv[2] || process.cwd();
  const files = listFiles(root);
  const targetFiles = files.filter(f => /(\.(ts|tsx|js|jsx|json|md)|App\.tsx|index\.js)$/i.test(f));

  const backupDir = path.join(root, 'conflict_backups');
  if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir);

  let changed = 0;
  for (const file of targetFiles) {
    const content = fs.readFileSync(file, 'utf8');
    if (!hasConflictMarkers(content)) continue;
    const resolved = resolveConflictsKeepHead(content);
    const rel = path.relative(root, file);
    const destBackup = path.join(backupDir, rel);
    fs.mkdirSync(path.dirname(destBackup), { recursive: true });
    fs.writeFileSync(destBackup, content, 'utf8');
    fs.writeFileSync(file, resolved, 'utf8');
    changed++;
  }
  console.log(`Resolved conflicts in ${changed} files. Backups saved to ${backupDir}`);
}

if (require.main === module) {
  main();
}
