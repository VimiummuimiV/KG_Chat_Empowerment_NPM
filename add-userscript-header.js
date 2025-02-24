const fs = require('fs');

// Read files
const header = fs.readFileSync('userscript-header.js', 'utf8');
const script = fs.readFileSync(process.env.USERSCRIPT, 'utf8');

// Prepend and overwrite script.js
fs.writeFileSync(process.env.USERSCRIPT, header + script);
