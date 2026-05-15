const fs = require('fs');
const path = require('path');
const filePath = path.join('src', 'screens', 'TrackingScreen.js');
let code = fs.readFileSync(filePath, 'utf8');

console.log('Original code length:', code.length);

// 1. Update Sub-components to take styles as prop
// TimelineStep
code = code.replace(/const TimelineStep = \(\{[\s\S]*?\}\) => \{[\s\S]*?return <View style=\{styles\.timelineStep\}/g, 
`const TimelineStep = ({
  step,
  isLast,
  isNext,
  styles,
  colors
}) => {`);

// OtpInput
code = code.replace(/const OtpInput = \(\{[\s\S]*?\}\) => \{[\s\S]*?return <View style=\{styles\.otpContainer\}/g, 
`const OtpInput = ({
  value,
  onChangeText,
  styles,
  colors
}) => {`);

// 2. Remove internal hook removal (usually looks like this)
code = code.replace(/const \{\s*theme: \{\s*colors\s*\},\s*isDark\s*\} = useTheme\(\);\s*const styles = getStyles\(colors\);/g, '');

// 3. Update parent calls to pass styles and colors
if (!code.includes('styles={styles}')) {
    code = code.replace(/<TimelineStep /g, '<TimelineStep styles={styles} colors={colors} ');
    code = code.replace(/<OtpInput /g, '<OtpInput styles={styles} colors={colors} ');
}

// 4. Replace 'theme.colors' with 'colors' in sub-components
code = code.replace(/theme\.colors/g, 'colors');

// 5. Fix AppBackground variant
code = code.replace(/<AppBackground variant="light">/, '<AppBackground variant={isDark ? "dark" : "light"}>');

fs.writeFileSync(filePath, code);
console.log('Successfully refactored TrackingScreen.js. New length:', code.length);
