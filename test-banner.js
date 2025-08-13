const fs = require('fs');
const path = require('path');

console.log('🔍 CHECKING BANNER PAGE SETUP...\n');

// Check banner page exists
const bannerPagePath = path.join(__dirname, 'src/app/admin/banners/page.tsx');
const bannerExists = fs.existsSync(bannerPagePath);
console.log('✅ Banner page exists:', bannerExists);

if (bannerExists) {
  const content = fs.readFileSync(bannerPagePath, 'utf8');
  console.log('✅ Banner page exports default:', content.includes('export default'));
}

// Check middleware
const middlewarePath = path.join(__dirname, 'src/middleware.ts');
const middlewareExists = fs.existsSync(middlewarePath);
console.log('✅ Middleware exists:', middlewareExists);

// Check package.json for dev script
const packagePath = path.join(__dirname, 'package.json');
if (fs.existsSync(packagePath)) {
  const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  console.log('✅ Dev script:', pkg.scripts?.dev);
}

console.log('\n🚀 TO FIX:');
console.log('1. Run: npm run dev');
console.log('2. Login at: http://localhost:3003/admin/login');
console.log('3. Go to: http://localhost:3003/admin/banners');
console.log('4. If still redirects, check browser Network tab for actual HTTP status');