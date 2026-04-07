const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'client', 'src');

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  if (content.includes('"http://localhost:5000')) {
    content = content.replace(/"http:\/\/localhost:5000/g, '(process.env.REACT_APP_API_BASE_URL || "http://localhost:5000") + "');
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Replaced in ${filePath}`);
  }
}

function walkDir(dir) {
  fs.readdirSync(dir).forEach(file => {
    let fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.js') && !fullPath.includes('api.js')) {
      replaceInFile(fullPath);
    }
  });
}

walkDir(srcDir);
