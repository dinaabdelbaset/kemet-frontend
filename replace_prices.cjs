const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src', 'pages');

const walkSync = function(dir, filelist) {
  let files = fs.readdirSync(dir);
  filelist = filelist || [];
  files.forEach(function(file) {
    if (fs.statSync(path.join(dir, file)).isDirectory()) {
      filelist = walkSync(path.join(dir, file), filelist);
    }
    else {
      filelist.push(path.join(dir, file));
    }
  });
  return filelist;
};

const components = walkSync(srcDir).filter(f => f.endsWith('.tsx'));

let modifiedFiles = 0;

components.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Track if we need to add import PriceDisplay
  let needsImport = false;

  // Replace ${something} 
  // ONLY if it's inside JSX like >${item.price}<
  // Regex looks for: >\$\s*\{([^}]+)\}<
  content = content.replace(/>\$\s*\{([^}]+)\}/g, (match, p1) => {
    needsImport = true;
    return `><PriceDisplay price={Number(${p1})} />`;
  });

  // Replace {something} EGP 
  content = content.replace(/>\{([^}]+)\}\s*EGP/g, (match, p1) => {
    needsImport = true;
    return `><PriceDisplay price={Number(${p1})} />`;
  });

  // Replace {something} جنيه
  content = content.replace(/>\{([^}]+)\}\s*جنيه/g, (match, p1) => {
      needsImport = true;
      return `><PriceDisplay price={Number(${p1})} />`;
  });
  
  if (needsImport && content !== original) {
    if (!content.includes('PriceDisplay')) {
      const importStmt = `import PriceDisplay from "../components/common/PriceDisplay";\n`;
      
      // try to insert after the last import
      const lastImportIndex = content.lastIndexOf('import ');
      if (lastImportIndex !== -1) {
        const insertionIndex = content.indexOf('\n', lastImportIndex) + 1;
        content = content.slice(0, insertionIndex) + importStmt + content.slice(insertionIndex);
      } else {
        content = importStmt + content;
      }
    }
    fs.writeFileSync(file, content, 'utf8');
    console.log('Modified:', path.basename(file));
    modifiedFiles++;
  }
});

console.log(`Updated ${modifiedFiles} files.`);
