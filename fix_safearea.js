const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    const files = fs.readdirSync(dir);
    for (const f of files) {
        const dirPath = path.join(dir, f);
        const isDirectory = fs.statSync(dirPath).isDirectory();
        if (isDirectory) {
            walkDir(dirPath, callback);
        } else {
            callback(dirPath);
        }
    }
}

walkDir('d:/p2p/src', function (filePath) {
    if (filePath.endsWith('.js')) {
        let content = fs.readFileSync(filePath, 'utf8');
        let original = content;

        // 1. replace solitary import
        let solitaryRegex = /import\s*\{\s*SafeAreaView\s*\}\s*from\s*(['"])react-native\1\s*;/g;
        content = content.replace(solitaryRegex, "import { SafeAreaView } from 'react-native-safe-area-context';");

        // 2. replace combined import
        let combinedRegex = /import\s*\{([^}]*)\bSafeAreaView\b([^}]*)\}\s*from\s*(['"])react-native\3\s*;/g;
        content = content.replace(combinedRegex, (match, before, after) => {
            let newInner = (before + after).replace(/,\s*,/g, ',').replace(/^\s*,\s*/, '').replace(/\s*,\s*$/, '').trim();
            if (!newInner) {
                return "import { SafeAreaView } from 'react-native-safe-area-context';";
            }
            return "import { SafeAreaView } from 'react-native-safe-area-context';\nimport { " + newInner + " } from 'react-native';";
        });

        if (content !== original) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log('Updated SafeAreaView in: ' + filePath);
        }
    }
});
