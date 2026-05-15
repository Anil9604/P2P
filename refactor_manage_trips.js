const fs = require('fs');
const path = require('path');
const filePath = path.join('src', 'screens', 'ManageTripsScreen.js');
let code = fs.readFileSync(filePath, 'utf8');

console.log('Original code length:', code.length);

// 1. Update Sub-components to take styles as prop
// FilterChip
code = code.replace(/const FilterChip = \(\{[\s\S]*?\}\) => <TouchableOpacity style=\{\[styles\.chip/g, 
`const FilterChip = ({
  label,
  selected,
  onPress,
  styles
}) => <TouchableOpacity style={[styles.chip`);

// TripCard
code = code.replace(/const TripCard = \(\{[\s\S]*?\}\) => \{[\s\S]*?return <View style=\{\[styles\.tripCard/g, 
`const TripCard = ({
  trip,
  onOpenDetails,
  onEdit,
  onTogglePause,
  onDelete,
  styles
}) => {
  const isPaused = trip.status === 'Paused';
  const pauseAnim = React.useRef(new Animated.Value(isPaused ? 1 : 0)).current;
  React.useEffect(() => {
    Animated.timing(pauseAnim, {
      toValue: isPaused ? 1 : 0,
      duration: 300,
      useNativeDriver: true
    }).start();
  }, [isPaused]);
  const contentOpacity = pauseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0.4]
  });
  return <View style={[styles.tripCard`);

// RecommendedParcelCard
code = code.replace(/const RecommendedParcelCard = \(\{[\s\S]*?\}\) => <View style=\{styles\.recCard\}/g, 
`const RecommendedParcelCard = ({
  parcel,
  styles
}) => <View style={styles.recCard}`);

// RideRequestCard
code = code.replace(/const RideRequestCard = \(\{[\s\S]*?\}\) => <View style=\{styles\.rideReqCard\}/g, 
`const RideRequestCard = ({
  request,
  onApprove,
  onReject,
  styles
}) => <View style={styles.rideReqCard}`);

// 2. Remove hardcoded 'theme.' references inside components and replace with props where possible
// Or just let them be fixed by the fact that parent passes styles down.
// Wait, some use theme.colors directly. I should replace those with theme usage or props.
// For now, I'll replace 'theme.' with 'theme_obj.' and pass theme_obj as a prop.
// Actually, simpler: just pass 'colors' as a prop too.

// 3. Update parent calls to pass styles and colors
if (!code.includes('styles={styles}')) {
    code = code.replace(/<FilterChip /g, '<FilterChip styles={styles} ');
    code = code.replace(/<TripCard /g, '<TripCard styles={styles} ');
    code = code.replace(/<RecommendedParcelCard /g, '<RecommendedParcelCard styles={styles} ');
    code = code.replace(/<RideRequestCard /g, '<RideRequestCard styles={styles} ');
}

// 4. Fix AppBackground variant
code = code.replace(/<AppBackground variant="light">/, '<AppBackground variant={isDark ? "dark" : "light"}>');

// 5. Replace 'theme.colors' with 'colors' inside the return block of the main component
// Actually, I'll just rely on the fact that I've updated the sub-components to take styles.
// But some sub-components use theme.colors directly for icons.
// I'll update them to take 'colors' as well.

code = code.replace(/const FilterChip = \(\{[\s\S]*?styles[\s\S]*?\}\) =>/g, 'const FilterChip = ({ label, selected, onPress, styles, colors }) =>');
code = code.replace(/const TripCard = \(\{[\s\S]*?styles[\s\S]*?\}\) =>/g, 'const TripCard = ({ trip, onOpenDetails, onEdit, onTogglePause, onDelete, styles, colors }) =>');
code = code.replace(/const RecommendedParcelCard = \(\{[\s\S]*?styles[\s\S]*?\}\) =>/g, 'const RecommendedParcelCard = ({ parcel, styles, colors }) =>');
code = code.replace(/const RideRequestCard = \(\{[\s\S]*?styles[\s\S]*?\}\) =>/g, 'const RideRequestCard = ({ request, onApprove, onReject, styles, colors }) =>');

// Update calls to include colors
if (!code.includes('colors={colors}')) {
    code = code.replace(/styles=\{styles\} /g, 'styles={styles} colors={colors} ');
}

// Replace 'theme.colors' with 'colors' in sub-components
code = code.replace(/theme\.colors/g, 'colors');

fs.writeFileSync(filePath, code);
console.log('Successfully refactored ManageTripsScreen.js. New length:', code.length);
