const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;
const t = require('@babel/types');

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

// Optional chaining plugin, JSX plugin
const parseOptions = {
  sourceType: 'module',
  plugins: ['jsx', 'typescript', 'objectRestSpread', 'classProperties']
};

fs.readdirSync(screensDir).forEach(file => {
  if (!file.endsWith('.js') && !file.endsWith('.tsx')) return;
  const variant = getVariant(file);
  if (!variant) return;

  const fullPath = path.join(screensDir, file);
  let code = fs.readFileSync(fullPath, 'utf8');
  
  try {
    const ast = parser.parse(code, parseOptions);
    
    let hasAppBackgroundImport = false;
    let lastImportIndex = -1;

    ast.program.body.forEach((node, idx) => {
        if (node.type === 'ImportDeclaration') {
            lastImportIndex = idx;
            if (node.source.value.includes('AppBackground')) {
                hasAppBackgroundImport = true;
            }
        }
    });

    let mainComponentFunc = null;
    let mainReturnStatement = null;

    traverse(ast, {
      ExportDefaultDeclaration(pathAttr) {
        const decl = pathAttr.node.declaration;
        if (decl.type === 'FunctionDeclaration' || decl.type === 'ArrowFunctionExpression') {
          mainComponentFunc = decl;
        } else if (decl.type === 'Identifier') {
          const binding = pathAttr.scope.getBinding(decl.name);
          if (binding && binding.path && binding.path.node && binding.path.node.init) {
             const init = binding.path.node.init;
             if (init.type === 'ArrowFunctionExpression' || init.type === 'FunctionExpression') {
               mainComponentFunc = init;
             }
          }
        }
      }
    });

    const body = mainComponentFunc ? mainComponentFunc.body : null;
    if (body) {
        if (body.type === 'BlockStatement') {
            const returns = body.body.filter(n => n.type === 'ReturnStatement' && n.argument);
            if (returns.length > 0) {
                // assume the last return statement is the main one
                mainReturnStatement = returns[returns.length - 1];
            }
        } else if (body.type && (body.type === 'JSXElement' || body.type === 'JSXFragment')) {
            // direct JSX return
            mainReturnStatement = { node: { argument: body }, isDirect: true };
        }
    }

    if (!mainReturnStatement) {
      console.log(`Could not find main return for ${file}`);
      return;
    }

    let changed = false;

    // Track the root node we need to modify
    const targetNode = mainReturnStatement.isDirect ? mainComponentFunc : mainReturnStatement;

    traverse(ast, {
      JSXElement(pathAttr) {
        if (pathAttr.node.openingElement.name.name === 'StatusBar') {
           pathAttr.remove();
           changed = true;
        }
      },
      // Target the return argument specifically
      ReturnStatement(pathAttr) {
          if (pathAttr.node === mainReturnStatement && pathAttr.node.argument) {
              const arg = pathAttr.node.argument;
              if (arg.type === 'JSXElement') {
                  const tag = arg.openingElement.name.name;
                  const isContainer = ['View', 'LinearGradient', 'SafeAreaView', 'RNCSafeAreaView', 'ImageBackground'].includes(tag);
                  
                  if (isContainer) {
                      arg.openingElement.name.name = 'AppBackground';
                      if (arg.closingElement) {
                          arg.closingElement.name.name = 'AppBackground';
                      }
                      const variantAttr = t.jsxAttribute(t.jsxIdentifier('variant'), t.stringLiteral(variant));
                      arg.openingElement.attributes = arg.openingElement.attributes.filter(attr => {
                          if (attr.type === 'JSXAttribute' && attr.name) {
                              const name = attr.name.name;
                              if (['style', 'colors', 'start', 'end', 'edges', 'behavior', 'source'].includes(name)) return false;
                          }
                          return true;
                      });
                      arg.openingElement.attributes.push(variantAttr);
                      changed = true;
                  } else {
                      // Wrap it
                      const wrapper = t.jsxElement(
                          t.jsxOpeningElement(t.jsxIdentifier('AppBackground'), [
                              t.jsxAttribute(t.jsxIdentifier('variant'), t.stringLiteral(variant))
                          ]),
                          t.jsxClosingElement(t.jsxIdentifier('AppBackground')),
                          [arg]
                      );
                      pathAttr.node.argument = wrapper;
                      changed = true;
                  }
              }
          }
      },
      ArrowFunctionExpression(pathAttr) {
          if (mainReturnStatement.isDirect && pathAttr.node === mainComponentFunc) {
              const arg = pathAttr.node.body;
              if (arg && arg.type === 'JSXElement') {
                  const tag = arg.openingElement.name.name;
                  const isContainer = ['View', 'LinearGradient', 'SafeAreaView', 'RNCSafeAreaView', 'ImageBackground'].includes(tag);
                  if (isContainer) {
                      arg.openingElement.name.name = 'AppBackground';
                      if (arg.closingElement) {
                          arg.closingElement.name.name = 'AppBackground';
                      }
                      const variantAttr = t.jsxAttribute(t.jsxIdentifier('variant'), t.stringLiteral(variant));
                      arg.openingElement.attributes = arg.openingElement.attributes.filter(attr => {
                          if (attr.type === 'JSXAttribute' && attr.name) {
                              const name = attr.name.name;
                              if (['style', 'colors', 'start', 'end', 'edges', 'behavior', 'source'].includes(name)) return false;
                          }
                          return true;
                      });
                      arg.openingElement.attributes.push(variantAttr);
                      changed = true;
                  } else {
                      const wrapper = t.jsxElement(
                          t.jsxOpeningElement(t.jsxIdentifier('AppBackground'), [
                              t.jsxAttribute(t.jsxIdentifier('variant'), t.stringLiteral(variant))
                          ]),
                          t.jsxClosingElement(t.jsxIdentifier('AppBackground')),
                          [arg]
                      );
                      pathAttr.node.body = wrapper;
                      changed = true;
                  }
              }
          }
      }
    });

    if (changed) {
      if (!hasAppBackgroundImport) {
          const importAst = parser.parse("import AppBackground from '../components/AppBackground';\n", parseOptions).program.body[0];
          ast.program.body.splice(lastImportIndex + 1, 0, importAst);
      }
      
      const newCode = generate(ast, {
         retainLines: true,
         retainFunctionParens: true,
      }, code).code;
      fs.writeFileSync(fullPath, newCode, 'utf8');
      console.log(`Processed ${file}`);
    }

  } catch (err) {
    console.error(`Error parsing ${file}:`, err);
  }
});
