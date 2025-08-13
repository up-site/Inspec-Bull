const sharp = require('sharp');

console.log('Testing Sharp...');
console.log('Sharp version:', sharp.versions);

// Test creating a simple image
sharp({
  create: {
    width: 100,
    height: 100,
    channels: 4,
    background: { r: 255, g: 0, b: 0, alpha: 1 }
  }
})
.png()
.toBuffer()
.then(data => {
  console.log('✅ Sharp is working! Generated', data.length, 'bytes');
})
.catch(err => {
  console.error('❌ Sharp failed:', err.message);
});