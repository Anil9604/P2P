const fs = require('fs');
const path = require('path');
const filePath = path.join('src', 'screens', 'ParcelActivityScreen.js');
let code = fs.readFileSync(filePath, 'utf8');

console.log('Original code length:', code.length);

// 1. Update StatusBadge component to take styles as prop
code = code.replace(/const StatusBadge = \(\{[\s\S]*?\}\) => \{[\s\S]*?const styles = getStyles\(colors\);/g, 
`const StatusBadge = ({
  status,
  styles
}) => {`);

// 2. Update ParcelCardModern component to take styles as prop
code = code.replace(/const ParcelCardModern = \(\{[\s\S]*?\}\) => \{[\s\S]*?const styles = getStyles\(colors\);/g, 
`const ParcelCardModern = ({
  parcel,
  onTrack,
  onChat,
  onApprove,
  onReject,
  canApprove,
  onNext,
  onPress,
  styles
}) => {`);

// 3. Update TripCardModern component to take styles as prop
code = code.replace(/const TripCardModern = \(\{[\s\S]*?\}\) => \{[\s\S]*?const styles = getStyles\(colors\);/g, 
`const TripCardModern = ({
  trip,
  onEdit,
  onViewRequests,
  onApprove,
  onReject,
  onDelete,
  hasPendingRequest,
  isApproved,
  onNext,
  onChat,
  onPress,
  styles
}) => {`);

// 4. Update internal hook removal for all sub-components
// This specifically removes the useTheme and getStyles calls
code = code.replace(/const \{\s*theme: \{\s*colors\s*\},\s*isDark\s*\} = useTheme\(\);\s*const styles = getStyles\(colors\);/g, '');

// 5. Update parent component calls to pass styles
// We'll update the calls to StatusBadge, ParcelCardModern, and TripCardModern
if (!code.includes('styles={styles}')) {
    code = code.replace(/<StatusBadge /g, '<StatusBadge styles={styles} ');
    code = code.replace(/<ParcelCardModern /g, '<ParcelCardModern styles={styles} ');
    code = code.replace(/<TripCardModern /g, '<TripCardModern styles={styles} ');
}

// 6. Fix header AppBackground variety
code = code.replace(/<AppBackground variant="light">/, '<AppBackground variant={isDark ? "dark" : "light"}>');

fs.writeFileSync(filePath, code);
console.log('Successfully refactored ParcelActivityScreen.js. New length:', code.length);
