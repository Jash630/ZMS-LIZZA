
const fs = require('fs');
const files = ['frontend/src/i18n/translations/hi.js', 'frontend/src/i18n/translations/gu.js'];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/name: 'Ketan Patel', business: 'Devangin Creation'/g, "name: 'Ashok Makwana', business: 'Tridevi Fashion'");
  content = content.replace(/name: 'Sandeep Shah', business: 'Shah Industries', location: '[^']+'/g, "name: 'Ketan Patel', business: 'Devangini Creation', location: 'Surat, Gujarat'");
  content = content.replace(/name: 'Sandeep Shah', business: 'Shah Industries'/g, "name: 'Ketan Patel', business: 'Devangini Creation'");
  content = content.replace(/Mumbai, Maharashtra|म�qंबई, महाराष�qट�qर|મ�qંબઈ, મહારાષ�qટ�qર/g, 'Surat, Gujarat');
  fs.writeFileSync(file, content);
  console.log('Fixed ', file);
});

