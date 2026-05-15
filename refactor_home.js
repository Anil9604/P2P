const fs = require('fs');
const path = require('path');
const filePath = path.join('src', 'screens', 'HomeScreen.js');
let code = fs.readFileSync(filePath, 'utf8');

console.log('Original code length:', code.length);

// 1. Refactor ActionCardPremium
code = code.replace(/const ActionCardPremium = \(\{[\s\S]*?\}\) => \{[\s\S]*?const styles = getStyles\(colors\);/g, 
`const ActionCardPremium = ({
  title,
  subtitle,
  iconName,
  bgColor,
  onPress,
  styles
}) => {`);

// 2. Refactor StatPill
code = code.replace(/const StatPill = \(\{[\s\S]*?\}\) => \{[\s\S]*?const styles = getStyles\(colors\);/g, 
`const StatPill = ({
  iconName,
  label,
  value,
  color,
  styles,
  colors
}) => {`);

// 3. Refactor ParcelCardModern
code = code.replace(/const ParcelCardModern = \(\{[\s\S]*?\}\) => \{[\s\S]*?const styles = getStyles\(colors\);/g, 
`const ParcelCardModern = ({
  parcel,
  onPress,
  styles
}) => {`);

// 4. Refactor TravelerCardModern
code = code.replace(/const TravelerCardModern = \(\{[\s\S]*?\}\) => \{[\s\S]*?const styles = getStyles\(colors\);/g, 
`const TravelerCardModern = ({
  trip,
  onPress,
  styles,
  colors
}) => {`);

// 5. Refactor ActivityCardModern
code = code.replace(/const ActivityCardModern = \(\{[\s\S]*?\}\) => \{[\s\S]*?const styles = getStyles\(colors\);/g, 
`const ActivityCardModern = ({
  parcel,
  onPress,
  styles
}) => {`);

// Update the internal hook removal for all updated components
// This regex specifically targets the lines we want to remove
code = code.replace(/const \{\s*theme: \{\s*colors\s*\},\s*isDark\s*\} = useTheme\(\);\s*const styles = getStyles\(colors\);/g, '');

// Update calls
// We use a more careful approach for calls to avoid double-adding
if (!code.includes('styles={styles}')) {
    code = code.replace(/<ActionCardPremium /g, '<ActionCardPremium styles={styles} ');
    code = code.replace(/<StatPill /g, '<StatPill styles={styles} colors={colors} ');
    code = code.replace(/<ParcelCardModern /g, '<ParcelCardModern styles={styles} ');
    code = code.replace(/<TravelerCardModern /g, '<TravelerCardModern styles={styles} colors={colors} ');
    code = code.replace(/<ActivityCardModern /g, '<ActivityCardModern styles={styles} ');
}

fs.writeFileSync(filePath, code);
console.log('Successfully refactored HomeScreen.js. New length:', code.length);
