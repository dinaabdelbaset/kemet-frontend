const fs = require('fs');
let file = 'src/pages/AITripPlannerPage.tsx';
let content = fs.readFileSync(file, 'utf8');

// Container & Grid
content = content.replace('pt-20 pb-10 overflow-x-hidden', 'pt-[70px] pb-6 overflow-x-hidden');
content = content.replace('className="bg-[#05073C] py-8 px-4 relative overflow-hidden mb-6"', 'className="bg-[#05073C] py-4 px-4 relative overflow-hidden mb-4"');
content = content.replace('grid-cols-1 lg:grid-cols-12 gap-10', 'grid-cols-1 lg:grid-cols-12 gap-6');

// Form paddings
content = content.replace('bg-white p-6 sm:p-8 rounded-3xl', 'bg-white p-4 sm:p-5 rounded-2xl');
content = content.replace('mb-6 flex', 'mb-4 flex');

// Form spacings
content = content.replace('space-y-4', 'space-y-3');
content = content.replace(/mb-2/g, 'mb-1');

// Inputs size
content = content.replace(/h-12/g, 'h-10');
content = content.replace('gap-4', 'gap-3');
content = content.replace('mt-4 bg-[#05073C]', 'mt-2 bg-[#05073C]');
content = content.replace('py-4 mt-4', 'py-2.5 mt-2');

fs.writeFileSync(file, content);
