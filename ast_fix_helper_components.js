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
  if (!fs.existsSync(filePath)) return;
  
  let code = fs.readFileSync(filePath, 'utf8');
  let ast;
  try {
    ast = parser.parse(code, { sourceType: 'module', plugins: ['jsx', 'typescript'] });
  } catch(e) {
    console.log('Skipping ' + file + ' due to parse error:', e.message);
    return;
  }

  let changed = false;

  // We find components defined at the top level
  traverse(ast, {
    VariableDeclarator(path) {
      if (path.node.id.type === 'Identifier') {
         const name = path.node.id.name;
         // Heuristic: Component names start with Uppercase
         if (name[0] === name[0].toUpperCase() && (path.node.init?.type === 'ArrowFunctionExpression' || path.node.init?.type === 'FunctionExpression')) {
             
             // Check if it uses 'styles.' but doesn't define it
             // Let's just check the string representation or traverse its body
             let usesStyles = false;
             let definesStyles = false;
             
             path.traverse({
                 Identifier(idPath) {
                     if (idPath.node.name === 'styles') {
                         // if it is object property access like styles.xy
                         if (idPath.parent.type === 'MemberExpression' && idPath.parent.object === idPath.node) {
                             usesStyles = true;
                         }
                         // if it defines it
                         if (idPath.parent.type === 'VariableDeclarator' && idPath.parent.id === idPath.node) {
                             definesStyles = true;
                         }
                     }
                 }
             });

             if (usesStyles && !definesStyles) {
                 // Inject hook
                 const fn = path.node.init;
                 const hookAST1 = parser.parse('const { theme: { colors }, isDark } = useTheme();').program.body[0];
                 const hookAST2 = parser.parse('const styles = getStyles(colors);').program.body[0];

                 if (fn.body.type !== 'BlockStatement') {
                     // Implicit return
                     const origBody = fn.body;
                     fn.body = t.blockStatement([
                         hookAST1,
                         hookAST2,
                         t.returnStatement(origBody)
                     ]);
                 } else {
                     // Block statement
                     fn.body.body.unshift(hookAST2);
                     fn.body.body.unshift(hookAST1);
                 }
                 changed = true;
                 console.log('Injected styles into', name, 'in', file);
             }
         }
      }
    }
  });

  if (changed) {
      const output = generate(ast, { retainLines: false, compact: false }, code).code;
      fs.writeFileSync(filePath, output, 'utf8');
      console.log('Saved', file);
  }
});
