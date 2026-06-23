const fs = require('fs');
const path = require('path');

const localesDir = path.join(__dirname, 'src/locales');
const languages = ['fa', 'en', 'ar'];

function toCamelCase(str) {
  return str.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); });
}

languages.forEach(lang => {
  const personasDir = path.join(localesDir, lang, 'personas');
  const indexFile = path.join(localesDir, lang, 'index.ts');
  
  if (!fs.existsSync(personasDir)) return;

  const files = fs.readdirSync(personasDir).filter(f => f.endsWith('.json'));
  
  let imports = `import ui from './ui.json';\n`;
  let exportsObj = `const ${lang}Translation = {\n  ui,\n  personas: {\n`;

  files.forEach(file => {
    const slug = file.replace('.json', '');
    let varName = toCamelCase(slug);
    
    // Some variable names might be duplicate or invalid if they have weird characters, 
    // but the slugs are clean (e.g. kaysan-abu-amra)
    imports += `import ${varName} from './personas/${file}';\n`;
    exportsObj += `    "${slug}": ${varName},\n`;
  });

  exportsObj += `  }\n};\n\nexport default ${lang}Translation;\n`;

  fs.writeFileSync(indexFile, imports + '\n' + exportsObj);
  console.log(`Updated ${indexFile} with ${files.length} personas.`);
});
