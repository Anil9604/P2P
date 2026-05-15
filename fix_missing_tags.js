const fs = require('fs');
const path = require('path');

const gradientScreens = [
  'SplashScreen.js', 'LoginScreen.js', 'OtpVerificationScreen.js',
  'ProfileSetupScreen.js', 'PermissionsFlowScreen.js', 'WalletOnboardingScreen.js'
];

const darkScreens = [
  'HomeScreen.js', 'HomeMapScreen.js', 'ParcelActivityScreen.js',
  'DeliverScreen.js', 'ParcelsScreen.js', 'ProfileScreen.js',
  'WalletScreen.js', 'NotificationsScreen.js', 'ChatsListScreen.js',
  'MapActivityScreen.js', 'RideShareScreen.js', 'LiveDeliveriesScreen.js',
  'ManageTripsScreen.js', 'ActiveNearYouScreen.js', 'MyParcelsScreen.js'
];

const lightScreens = [
  'TrackingScreen.js', 'LiveTrackingScreen.js', 'CreateParcelScreen.js',
  'ParcelDetailScreen.js', 'SendParcelScreen.js', 'PostRouteScreen.js',
  'TripDetailsScreen.js', 'TripRequestsScreen.js', 'BookRideScreen.js',
  'RideDetailsScreen.js', 'ChatScreen.js', 'DeliveryManagementScreen.js',
  'AvailableParcelsScreen.js', 'SenderDashboardScreen.js', 'TravelerDetailScreen.js',
  'MapScreen.js', 'MatchingEngineScreen.js', 'PublicTrackingScreen.js',
  'ReceiveParcelScreen.js', 'DeliveryPricingScreen.js', 'SettingsScreen.js',
  'AboutScreen.js', 'LegalPoliciesScreen.js', 'PrivacyPolicyScreen.js',
  'SupportScreen.js', 'SecurityCenterScreen.js', 'PaymentScreen.js',
  'PaymentMethodsScreen.js', 'TransactionHistoryScreen.js', 'AddMoneyScreen.js',
  'WithdrawScreen.js', 'AddBankScreen.js', 'EditProfileScreen.js',
  'PersonalInformationScreen.js', 'TrustScoreScreen.js', 'BankAccountScreen.js',
  'BankAccountsScreen.js', 'EscrowDetailsScreen.js', 'RideReviewScreen.js',
  'PaymentProtectionScreen.js', 'WalletSecurityScreen.js', 'WalletVerificationScreen.js',
  'WithdrawalSetupScreen.js', 'WithdrawFundsScreen.js', 'PostRideScreen.js',
  'RideShareBookingScreen.js'
];

const getVariant = (filename) => {
  if (gradientScreens.includes(filename)) return 'gradient';
  if (darkScreens.includes(filename)) return 'dark';
  if (lightScreens.includes(filename)) return 'light';
  return null;
};

const screensDir = path.join(__dirname, 'src', 'screens');

fs.readdirSync(screensDir).forEach(file => {
  if (!file.endsWith('.js') && !file.endsWith('.tsx')) return;
  const variant = getVariant(file);
  if (!variant) return;

  const fullPath = path.join(screensDir, file);
  let content = fs.readFileSync(fullPath, 'utf8');

  // Check if it's broken (has closing tag but no opening/variant tag)
  if (content.includes('</AppBackground>') && !content.includes('<AppBackground variant=')) {
      
      // Fix the return tag
      // We look for the last 'return' that stands alone on a line before the closing tag.
      const lines = content.split('\n');
      let returnIndex = -1;
      let closingIndex = -1;
      
      // Find closing tag line
      for(let i = 0; i < lines.length; i++) {
         if(lines[i].includes('</AppBackground>')) closingIndex = i;
      }
      
      if (closingIndex !== -1) {
         // Search backwards from closing tag for the main return
         for(let i = closingIndex - 1; i >= 0; i--) {
            if(lines[i].match(/^\s*return\s*$/)) {
               returnIndex = i;
               break;
            }
         }
         
         if (returnIndex !== -1) {
            const match = lines[returnIndex].match(/^(\s*)return\s*$/);
            const indent = match ? match[1] : '';
            lines[returnIndex] = `${indent}return (\n${indent}  <AppBackground variant="${variant}">`;
            
            // Fix the closing tag to include parenthesis and semicolon
            lines[closingIndex] = lines[closingIndex].replace(/<\/AppBackground>;?/, '</AppBackground>\n  );');
            
            const newContent = lines.join('\n');
            fs.writeFileSync(fullPath, newContent, 'utf8');
            console.log(`Fixed missing tags in ${file}`);
         } else {
            console.log(`Could not find empty return in ${file}`);
         }
      }
  }
});
