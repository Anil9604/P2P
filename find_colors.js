const fs = require('fs');
const path = require('path');
function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.resolve(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else if (file.endsWith('.js')) {
            results.push(file);
        }
    });
    return results;
}
const files = walk('d:/p2p/src');
let out = '';
files.forEach(f => {
    const lines = fs.readFileSync(f, 'utf8').split('\n');
    lines.forEach((line, i) => {
        if (/\bcolors\b/.test(line) && !/theme\.colors/.test(line) && !/const colors /.test(line) && !/const \{.*colors.*\} =/.test(line) && !/ colors = /.test(line) && !/import.*colors/.test(line)) {
            out += path.basename(f) + ':' + (i+1) + ':' + line.trim() + '\n';
        }
    });
});
fs.writeFileSync('d:/p2p/find_colors_output.txt', out);
