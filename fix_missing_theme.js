const fs = require('fs');
const path = require('path');

const screens = [
  'src/screens/HomeScreen.js',
  'src/screens/ParcelActivityScreen.js',
  'src/screens/ManageTripsScreen.js',
  'src/screens/MyParcelsScreen.js',
  'src/screens/TrackingScreen.js',
  'src/screens/DeliverScreen.js'
];

screens.forEach(filePath => {
  const fullPath = path.join(__dirname, filePath);
  if (!fs.existsSync(fullPath)) {
    console.log('File not found:', filePath);
    return;
  }

  let code = fs.readFileSync(fullPath, 'utf8');
  
  // Check if useTheme is already called inside the component
  const componentMatch = code.match(/export default function\s+\w+\s*\(.*?\)\s*\{/);
  if (!componentMatch) {
    console.log('Component start not found in:', filePath);
    return;
  }

  const componentStart = componentMatch.index + componentMatch[0].length;
  const contentAfterStart = code.substring(componentStart);

  if (contentAfterStart.includes('useTheme(')) {
    console.log('useTheme already called in:', filePath);
    return;
  }

  // Insert useTheme() and getStyles(colors)
  const insertion = `\n  const { theme: { colors }, isDark } = useTheme();\n  const styles = getStyles(colors);\n`;
  code = code.substring(0, componentStart) + insertion + contentAfterStart;

  fs.writeFileSync(fullPath, code);
  console.log('Fixed:', filePath);
});
