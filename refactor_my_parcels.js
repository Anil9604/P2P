const fs = require('fs');
const path = require('path');
const filePath = path.join('src', 'screens', 'MyParcelsScreen.js');
let code = fs.readFileSync(filePath, 'utf8');

console.log('Original code length:', code.length);

// 1. Update Sub-components to take styles as prop
// TabItem
code = code.replace(/const TabItem = \(\{[\s\S]*?\}\) => <TouchableOpacity style=\{\[styles\.tabItem/g, 
`const TabItem = ({
  icon,
  label,
  active,
  onPress,
  styles,
  colors
}) => <TouchableOpacity style={[styles.tabItem`);

// ParcelCard
code = code.replace(/const ParcelCard = \(\{[\s\S]*?\}\) => \{[\s\S]*?return <TouchableOpacity activeOpacity=\{0\.8\} onPress=\{onPress\} style=\{styles\.parcelCard\}/g, 
`const ParcelCard = ({
  parcel,
  onPress,
  styles,
  colors
}) => {`);

// 2. Remove internal hook if it exists (it was missing from my previous search but let's be safe)
code = code.replace(/const \{\s*theme: \{\s*colors\s*\},\s*isDark\s*\} = useTheme\(\);\s*const styles = getStyles\(colors\);/g, '');

// 3. Update parent calls to pass styles and colors
if (!code.includes('styles={styles}')) {
    code = code.replace(/<TabItem /g, '<TabItem styles={styles} colors={colors} ');
    code = code.replace(/<ParcelCard /g, '<ParcelCard styles={styles} colors={colors} ');
}

// 4. Replace 'theme.colors' with 'colors' in sub-components
code = code.replace(/theme\.colors/g, 'colors');

// 5. Fix AppBackground variant
code = code.replace(/<AppBackground variant="light">/, '<AppBackground variant={isDark ? "dark" : "light"}>');

fs.writeFileSync(filePath, code);
console.log('Successfully refactored MyParcelsScreen.js. New length:', code.length);
