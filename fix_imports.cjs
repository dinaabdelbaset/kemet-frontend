const fs = require('fs');
const files = [
  'src/pages/AITripPlannerPage.tsx',
  'src/pages/BazaarDetailsPage.tsx',
  'src/pages/DealDetailsPage.tsx',
  'src/pages/EventDetailsPage.tsx',
  'src/pages/FlightPage.tsx',
  'src/pages/MenuCategoryPage.tsx',
  'src/pages/SafariDetailsPage.tsx',
  'src/pages/ShopCheckoutPage.tsx'
];
const importStmt = 'import PriceDisplay from "../components/common/PriceDisplay";\n';
for (const file of files) {
  try {
    let content = fs.readFileSync(file, 'utf8');
    if (!content.includes('PriceDisplay from')) {
      content = importStmt + content;
      fs.writeFileSync(file, content);
      console.log('Fixed ' + file);
    }
  } catch(e) {}
}
