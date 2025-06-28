const fs = require('fs');
const path = require('path');

const dbFolder = path.join(__dirname, 'db');
const outputFile = path.join(__dirname, 'db.json');

if (!fs.existsSync(dbFolder)) {
  console.error(`Folder ${dbFolder} tidak ditemukan.`);
  process.exit(1);
}

const files = fs.readdirSync(dbFolder).filter(f => f.endsWith('.json'));

if (files.length === 0) {
    console.warn(`Tidak ada file .json ditemukan di folder ${dbFolder}. Membuat db.json kosong.`);
    fs.writeFileSync(outputFile, JSON.stringify({}, null, 2));
    process.exit(0);
}

const combined = {};

files.forEach(file => {
  const key = path.basename(file, '.json');
  const contentPath = path.join(dbFolder, file);
  try {
    const content = fs.readFileSync(contentPath, 'utf-8');
    combined[key] = JSON.parse(content);
  } catch (error) {
    console.error(`Gagal membaca atau parse file ${contentPath}:`, error);
  }
});

fs.writeFileSync(outputFile, JSON.stringify(combined, null, 2));
console.log('Berhasil generate db.json dari folder /db');