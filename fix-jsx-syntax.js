// Quick fix for JSX syntax errors
const fs = require('fs');

// Fix Abraham page
const abrahamPath = '/Users/seth/eden-academy/src/app/sites/abraham/page.tsx';
let abrahamContent = fs.readFileSync(abrahamPath, 'utf8');

// Replace the problematic ternary section
abrahamContent = abrahamContent.replace(
  /\{loadingWorks \? \(\s*<div className="border border-white p-6 text-center">\s*<div className="animate-pulse">Loading actual works from Registry\.\.\.<\/div>\s*<\/div>\s*\) : \(actualWorks && actualWorks\.length > 0\) \? actualWorks\.map\(\(work\) => \(/,
  `{loadingWorks ? (
            <div className="border border-white p-6 text-center">
              <div className="animate-pulse">Loading actual works from Registry...</div>
            </div>
          ) : (actualWorks && actualWorks.length > 0) ? actualWorks.map((work) => (`
);

abrahamContent = abrahamContent.replace(
  /\)\) : recentWorks\.map\(\(work\) => \(/,
  `)) : recentWorks.map((work) => (`
);

abrahamContent = abrahamContent.replace(
  /\)\)\}/,
  `))}`
);

fs.writeFileSync(abrahamPath, abrahamContent);

// Fix Solienne page
const soliennePath = '/Users/seth/eden-academy/src/app/sites/solienne/page.tsx';
let solienneContent = fs.readFileSync(soliennePath, 'utf8');

solienneContent = solienneContent.replace(
  /\)\) : recentStreams\.map\(\(stream\) => \(/,
  `)) : recentStreams.map((stream) => (`
);

solienneContent = solienneContent.replace(
  /\)\)\}\s*<\/div>\s*\{\/\* View More \*\/\}/,
  `))}
        </div>

        {/* View More */}`
);

fs.writeFileSync(soliennePath, solienneContent);

console.log('Fixed JSX syntax errors in Abraham and Solienne pages');