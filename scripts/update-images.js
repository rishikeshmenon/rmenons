const fs = require('fs')
const path = require('path')

const filePath = path.join(__dirname, 'populate-sqlite.ts')
let content = fs.readFileSync(filePath, 'utf8')

// Replace all product image references with placeholder
content = content.replace(/images: \['\/products\/[^']+\.jpg'\]/g, "images: ['/products/placeholder.svg']")

// Replace all kit image references with placeholder
content = content.replace(/images: \['\/kit-[^']+\.jpg'\]/g, "images: ['/kits/placeholder.svg']")

fs.writeFileSync(filePath, content)
console.log('✅ Updated all image references to use placeholders')
