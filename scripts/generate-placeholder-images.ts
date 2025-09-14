import fs from 'fs'
import path from 'path'

// Product images to generate
const productImages = [
  'philips-hue-a19-color.jpg',
  'philips-hue-bridge.jpg',
  'philips-hue-motion.jpg',
  'lifx-a19-color.jpg',
  'lifx-mini-color.jpg',
  'lutron-caseta-dimmer.jpg',
  'lutron-caseta-hub.jpg',
  'aqara-motion-sensor.jpg',
  'aqara-door-sensor.jpg',
  'aqara-temp-humidity.jpg',
  'google-nest-mini.jpg',
  'google-nest-hub.jpg',
  'nest-thermostat.jpg',
  'amazon-echo-dot.jpg',
  'amazon-echo-show.jpg',
  'samsung-smartthings-hub.jpg',
  'wyze-cam-v3.jpg',
  'ring-doorbell.jpg',
  'ecobee-thermostat.jpg'
]

// Kit images to generate
const kitImages = [
  'kit-google.jpg',
  'kit-alexa.jpg',
  'kit-google-advanced.jpg'
]

// Generate SVG placeholder
function generatePlaceholderSVG(title: string, type: 'product' | 'kit' = 'product'): string {
  const colors = {
    product: {
      bg: '#f3f4f6',
      text: '#6b7280',
      accent: '#3b82f6'
    },
    kit: {
      bg: '#fef3c7',
      text: '#92400e',
      accent: '#f59e0b'
    }
  }

  const color = colors[type]
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="400" height="400" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="400" fill="${color.bg}"/>
  <rect x="50" y="50" width="300" height="300" fill="white" stroke="${color.accent}" stroke-width="2" rx="8"/>
  <circle cx="200" cy="150" r="40" fill="${color.accent}" opacity="0.2"/>
  <rect x="120" y="200" width="160" height="20" fill="${color.text}" opacity="0.3" rx="4"/>
  <rect x="140" y="230" width="120" height="15" fill="${color.text}" opacity="0.2" rx="3"/>
  <text x="200" y="280" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" fill="${color.text}">
    ${title}
  </text>
  <text x="200" y="300" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="${color.text}" opacity="0.7">
    ${type === 'product' ? 'Smart Home Product' : 'Starter Kit'}
  </text>
</svg>`
}

// Convert SVG to base64 for JPG (simplified approach)
function svgToBase64(svg: string): string {
  return Buffer.from(svg).toString('base64')
}

// Generate all product images
console.log('🎨 Generating product placeholder images...')
for (const imageName of productImages) {
  const productName = imageName.replace('.jpg', '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  const svg = generatePlaceholderSVG(productName, 'product')
  const base64 = svgToBase64(svg)
  
  // Create a simple HTML file that can be converted to JPG
  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { margin: 0; padding: 0; }
    .placeholder { width: 400px; height: 400px; }
  </style>
</head>
<body>
  <div class="placeholder">
    ${svg}
  </div>
</body>
</html>
  `
  
  const filePath = path.join(process.cwd(), 'public', 'products', imageName.replace('.jpg', '.html'))
  fs.writeFileSync(filePath, html)
  console.log(`✅ Generated: ${imageName}`)
}

// Generate all kit images
console.log('🎨 Generating kit placeholder images...')
for (const imageName of kitImages) {
  const kitName = imageName.replace('.jpg', '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  const svg = generatePlaceholderSVG(kitName, 'kit')
  const base64 = svgToBase64(svg)
  
  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { margin: 0; padding: 0; }
    .placeholder { width: 400px; height: 400px; }
  </style>
</head>
<body>
  <div class="placeholder">
    ${svg}
  </div>
</body>
</html>
  `
  
  const filePath = path.join(process.cwd(), 'public', 'kits', imageName.replace('.jpg', '.html'))
  fs.writeFileSync(filePath, html)
  console.log(`✅ Generated: ${imageName}`)
}

console.log('🎉 All placeholder images generated!')
