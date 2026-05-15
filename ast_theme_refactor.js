const fs = require('fs');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;
const t = require('@babel/types');

const files = [
  'TrackingScreen.js',
  'ParcelActivityScreen.js',
  'MyParcelsScreen.js',
  'DeliverScreen.js',
  'HomeScreen.js',
  'ProfileScreen.js'
];

files.forEach(file => {
  const filePath = 'src/screens/' + file;
  if (!fs.existsSync(filePath)) {
     console.log('Skipping ' + file + ', does not exist.');
     return;
  }
  let code = fs.readFileSync(filePath, 'utf8');

  // Skip if already refactored
  if (code.includes('useTheme()')) {
     console.log(file + ' already has useTheme');
     return;
  }

  // 1. AST Parsing
  let ast;
  try {
    ast = parser.parse(code, { sourceType: 'module', plugins: ['jsx'] });
  } catch (e) {
    console.error('Syntax error parsing ' + file + ':', e);
    return;
  }

  let mainComponentName = null;
  traverse(ast, {
    ExportDefaultDeclaration(pathAttr) {
       const decl = pathAttr.node.declaration;
       if (decl.type === 'FunctionDeclaration') {
           mainComponentName = decl.id.name;
       } else if (decl.type === 'Identifier') {
           mainComponentName = decl.name;
       }
    }
  });

  // 2. String Replacements for safety
  // Add import
  code = code.replace(/(import[^;]+;)/, '$1\nimport { useTheme } from "../context/ThemeContext";');
  
  // Replace StyleSheet.create
  code = code.replace(/const styles = StyleSheet.create\(/, "const getStyles = (colors) => StyleSheet.create(");

  // Inject hook into component
  if (mainComponentName) {
      const functionRegex = new RegExp(`(function ${mainComponentName}\\s*\\([^)]*\\)\\s*\\{)`);
      code = code.replace(functionRegex, "$1\n  const { theme: { colors }, isDark } = useTheme();\n  const styles = getStyles(colors);\n");
      
      const constArrowRegex = new RegExp(`(const ${mainComponentName}\\s*=\\s*\\([^)]*\\)\\s*=>\\s*\\{)`);
      code = code.replace(constArrowRegex, "$1\n  const { theme: { colors }, isDark } = useTheme();\n  const styles = getStyles(colors);\n");
  }

  // Replace theme.colors mapping safely
  code = code.replace(/theme\.colors\.primaryText/g, 'colors.text');
  code = code.replace(/theme\.colors\.secondaryText/g, 'colors.textSecondary');
  code = code.replace(/theme\.colors\.hint/g, 'colors.textMuted');
  code = code.replace(/theme\.colors\.([a-zA-Z0-9_]+)/g, 'colors.$1');

  // Hardcoded replacements heuristics based on User's explicit hint
  // backgroundColor: '#FFFFFF' or '#FFF' -> colors.card
  code = code.replace(/backgroundColor:\s*['"]#(FFF|FFFFFF)['"]/g, 'backgroundColor: colors.card');
  code = code.replace(/backgroundColor:\s*['"]#F[0-9A-Fa-f]{5}['"]/g, 'backgroundColor: colors.background'); // e.g., #F8FAFC
  // border/divider: #E0E0E0, #EEEEEE -> colors.border
  code = code.replace(/borderColor:\s*['"]#E[0-9A-Fa-f]{5}['"]/g, 'borderColor: colors.border');
  // text color: '#1A1A1A', '#000' -> colors.text
  code = code.replace(/color:\s*['"]#(1A1A1A|000|000000)['"]/g, 'color: colors.text');
  code = code.replace(/color:\s*['"]#(666|666666)['"]/g, 'color: colors.textSecondary');

  // OsmMap prop logic
  code = code.replace(/<OsmMap([^>]*)>/g, '<OsmMap isDark={isDark} $1>');

  fs.writeFileSync(filePath, code);
  console.log('Processed', file);
});
