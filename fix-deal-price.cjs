const fs = require('fs');
let file = 'src/components/sections/DealsOffersSection.tsx';
let content = fs.readFileSync(file, 'utf8');

const targetStr = `price: <PriceDisplay price={parseFloat(String(deal.price).replace(/[^0-9.]/g, '')) || 0} baseCurrency="EGP" />,`;
const replaceStr = `price: deal.price,`;

content = content.replace(targetStr, replaceStr);
fs.writeFileSync(file, content);
