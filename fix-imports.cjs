// Fix ESM imports by adding .js extensions
const fs = require('fs');
const path = require('path');

function fixImports(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Fix relative imports: './src/xxx' -> './src/xxx.js'
  content = content.replace(/from ['"](\.\/.+?)['"];/g, (match, p1) => {
    if (!p1.endsWith('.js') && !p1.endsWith('.json')) {
      modified = true;
      return `from '${p1}.js';`;
    }
    return match;
  });

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed: ${filePath}`);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory() && file !== 'node_modules' && file !== 'dist') {
      walkDir(filePath);
    } else if (file.endsWith('.ts') && !file.endsWith('.d.ts')) {
      fixImports(filePath);
    }
  }
}

console.log('Fixing imports...');
walkDir(__dirname);
console.log('Done!');
