const fs = require('fs');
const path = require('path');
const filePath = path.join('src', 'screens', 'DeliverScreen.js');
let code = fs.readFileSync(filePath, 'utf8');

console.log('Original code length:', code.length);

// 1. Update Sub-components to take styles as prop
// ActionCard
code = code.replace(/const ActionCard = \(\{[\s\S]*?\}\) => <TouchableOpacity style=\{styles\.actionCard\}/g, 
`const ActionCard = ({
  icon,
  title,
  subtitle,
  onPress,
  gradient,
  styles,
  colors
}) => <TouchableOpacity style={styles.actionCard}`);

// ParcelMatchCard
code = code.replace(/const ParcelMatchCard = \(\{[\s\S]*?\}\) => \{[\s\S]*?return <TouchableOpacity activeOpacity=\{0\.8\} onPress=\{onPress\} style=\{styles\.matchCard\}/g, 
`const ParcelMatchCard = ({
  parcel,
  onPress,
  styles,
  colors
}) => {`);

// 2. Remove internal hook removal (usually looks like this)
code = code.replace(/const \{\s*theme: \{\s*colors\s*\},\s*isDark\s*\} = useTheme\(\);\s*const styles = getStyles\(colors\);/g, '');

// 3. Update parent calls to pass styles and colors
if (!code.includes('styles={styles}')) {
    code = code.replace(/<ActionCard /g, '<ActionCard styles={styles} colors={colors} ');
    code = code.replace(/<ParcelMatchCard /g, '<ParcelMatchCard styles={styles} colors={colors} ');
}

// 4. Replace 'theme.colors' with 'colors' in sub-components
code = code.replace(/theme\.colors/g, 'colors');

// 5. Fix AppBackground variant
code = code.replace(/<AppBackground variant="light">/, '<AppBackground variant={isDark ? "dark" : "light"}>');

fs.writeFileSync(filePath, code);
console.log('Successfully refactored DeliverScreen.js. New length:', code.length);
