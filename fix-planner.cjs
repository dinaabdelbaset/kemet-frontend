const fs = require('fs');
let file = 'src/pages/AITripPlannerPage.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace('className="min-h-screen bg-gray-50 pt-20 pb-20"', 'className="min-h-screen bg-gray-50 pt-20 pb-10 overflow-x-hidden"');
content = content.replace('className="bg-[#05073C] py-16 px-4 relative overflow-hidden mb-12"', 'className="bg-[#05073C] py-8 px-4 relative overflow-hidden mb-6"');
content = content.replace('className="text-4xl md:text-5xl font-extrabold text-white mb-4"', 'className="text-3xl md:text-4xl font-extrabold text-white mb-2"');
content = content.replace('className="text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed"', 'className="text-gray-300 text-sm max-w-2xl mx-auto leading-relaxed"');
content = content.replace('className="space-y-5"', 'className="space-y-4"');

fs.writeFileSync(file, content);
