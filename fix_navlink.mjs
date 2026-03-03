import { readFileSync, writeFileSync } from 'fs';
const file = 'nextjs/src/components/layout/NavigationBar.tsx';
let src = readFileSync(file, 'utf8');

// Find and replace the standalone NavigationMenuLink (for items without children)
// It appears after the closing </NavigationMenu> in the ternary else branch
const old = `\t\t\t\t\t) : (\n\t\t\t\t\t\t<NavigationMenuLink\n\t\t\t\t\t\t\tkey={section.id}\n\t\t\t\t\t\t\thref={section.page?.permalink || section.url || '#'}\n\t\t\t\t\t\t\tclassName="font-heading text-nav"\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\t{section.title}\n\t\t\t\t\t\t</NavigationMenuLink>\n\t\t\t\t\t)`;

const replacement = `\t\t\t\t\t) : (\n\t\t\t\t\t\t<Link\n\t\t\t\t\t\t\tkey={section.id}\n\t\t\t\t\t\t\thref={section.page?.permalink || section.url || '#'}\n\t\t\t\t\t\t\tclassName="font-heading text-nav"\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\t{section.title}\n\t\t\t\t\t\t</Link>\n\t\t\t\t\t)`;

if (!src.includes(old)) {
  // Try to show what's around line 181
  const lines = src.split('\n');
  console.error('Not found. Lines 178-190:');
  lines.slice(177, 190).forEach((l, i) => console.log(178+i, JSON.stringify(l)));
  process.exit(1);
}

src = src.replace(old, replacement);
writeFileSync(file, src, 'utf8');
console.log('Done');
