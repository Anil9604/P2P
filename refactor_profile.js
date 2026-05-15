const fs = require('fs');
const path = require('path');
const filePath = path.join('src', 'screens', 'ProfileScreen.js');
let code = fs.readFileSync(filePath, 'utf8');

// 1. Update AppBackground variant
code = code.replace(/<AppBackground variant="dark">/, '<AppBackground variant={isDark ? "dark" : "light"}>');

// 2. Fix StatusBadge call (remove specific props to use defaults from inside the component)
code = code.replace(/<StatusBadge icon="verified-user" text=\{user\?\.role === 'traveler' \? 'Verified Traveler' : 'Verified Sender'\} bgColor="#E8F5E9" color=\{colors\.success\} \/>/, 
                    '<StatusBadge icon="verified-user" text={user?.role === "traveler" ? "Verified Traveler" : "Verified Sender"} />');

// 3. Fix star rating text colors
code = code.replace(/color: '#111827'/, 'color: colors.text');
code = code.replace(/color: '#6B7280'/, 'color: colors.textSecondary');

// 4. Fix activity indicator and empty state text
code = code.replace(/py: 20/g, 'marginVertical: 20');
code = code.replace(/color: '#9CA3AF'/g, 'color: colors.textSecondary');
code = code.replace(/color: '#374151'/, 'color: colors.text');
code = code.replace(/color: '#F59E0B' : '#E5E7EB'/, 'color: colors.accent : colors.border');

// 5. Cleanup hardcoded margins in styles if any (actually my previous script did some of this)

fs.writeFileSync(filePath, code);
console.log('Successfully refactored ProfileScreen.js');
