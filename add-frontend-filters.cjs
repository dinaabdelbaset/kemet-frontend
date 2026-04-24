const fs = require('fs');
const path = require('path');
const frontendPagesDir = 'e:/اخر تحديث/kemet-frontend-main/src/pages';

const filesToFix = fs.readdirSync(frontendPagesDir).filter(f => f.endsWith('Page.tsx'));

filesToFix.forEach(file => {
    // Skip HotelsPage because it already has a custom layout for cities
    if (file === 'HotelsPage.tsx' || file === 'HomePage.tsx' || file === 'BookingPage.tsx' || file === 'ProfilePage.tsx' || file === 'BlogPage.tsx' || file === 'WishlistPage.tsx') return;
    
    let content = fs.readFileSync(path.join(frontendPagesDir, file), 'utf8');
    
    // Find state for items
    const stateMatch = content.match(/const \[([a-zA-Z]+), set[a-zA-Z]+\] = useState<any\[\]>\(\[\]\);/);
    if (!stateMatch) return;
    
    const itemsVarName = stateMatch[1]; // e.g. tours
    
    if (content.includes('selectedCity')) return;

    // Add selectedCity state
    content = content.replace(stateMatch[0], `${stateMatch[0]}\n  const [selectedCity, setSelectedCity] = useState("All Locations");\n  const uniqueCities = ["All Locations", ...new Set(${itemsVarName}.map((item: any) => item.location || item.city).filter(Boolean))];`);

    // Modify the filtered items logic
    // Usually it looks like: const filteredX = items.filter(item => { ... return matchesPrice && matchesStars; });
    const filterRegex = new RegExp(`const filtered${itemsVarName.charAt(0).toUpperCase() + itemsVarName.slice(1)} = ${itemsVarName}\\.filter\\([a-zA-Z]+ => \\{[\\s\\S]*?return (.*?);\\n\\s*\\}\\);`);
    
    const matchFilter = content.match(filterRegex);
    if (matchFilter) {
        const returnStatement = matchFilter[1]; // e.g. matchesPrice && matchesStars
        const newReturn = returnStatement + ' && matchesCity';
        
        let newFilterBlock = matchFilter[0].replace(/return .*?;/, `const matchesCity = selectedCity === "All Locations" || (tour.location || tour.city || item.location || item.city) === selectedCity;\n     return ${newReturn};`);
        
        // Fix the param name inside matchesCity to match whatever the lambda uses
        const paramName = matchFilter[0].match(/filter\(([a-zA-Z]+) =>/)[1];
        newFilterBlock = newFilterBlock.replace(/tour\.location \|\| tour\.city \|\| item\.location \|\| item\.city/, `${paramName}.location || ${paramName}.city`);

        content = content.replace(matchFilter[0], newFilterBlock);
    } else {
        // If there's no complex filter block, it might just be directly mapped or have no filters.
        // If there's no filtered items variable, create one
        const upperName = itemsVarName.charAt(0).toUpperCase() + itemsVarName.slice(1);
        const simpleFilter = `\n  const filtered${upperName} = ${itemsVarName}.filter((item: any) => selectedCity === "All Locations" || (item.location || item.city) === selectedCity);\n`;
        content = content.replace(/return \(/, `${simpleFilter}  return (`);
        
        // Replace itemsVarName.map with filtered...map
        content = content.replace(new RegExp(`\\{${itemsVarName}\\.map\\(`, 'g'), `{filtered${upperName}.map(`);
    }

    // Add UI Dropdown
    // Typically there is: <div className="h-5 w-px bg-gray-200" />\n          <div>\n            <h1...
    // We add ml-auto dropdown after that closing div
    const headerMatch = content.match(/<h1 className="text-lg font-bold.*?>.*?<\/h1>\s*<p.*?>.*?<\/p>\s*<\/div>/);
    if (headerMatch) {
        const dropdownHtml = `
          <div className="ml-auto">
             <select 
               className="border border-gray-200 rounded-lg px-3 py-2 text-sm font-bold text-[#05073C] focus:outline-none focus:border-[#EB662B] bg-white shadow-sm cursor-pointer"
               value={selectedCity}
               onChange={(e) => setSelectedCity(e.target.value)}
             >
               {uniqueCities.map(city => (
                  <option key={city as string} value={city as string}>{city}</option>
               ))}
             </select>
          </div>`;
        content = content.replace(headerMatch[0], headerMatch[0] + dropdownHtml);
    }

    fs.writeFileSync(path.join(frontendPagesDir, file), content);
    console.log('Added frontend filters to ' + file);
});
