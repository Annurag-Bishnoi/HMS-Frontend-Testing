const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function getRelativePathToUtils(filePath) {
    const depth = filePath.replace(srcDir, '').split(path.sep).length - 2;
    const prefix = depth > 0 ? '../'.repeat(depth) : './';
    return `${prefix}utils/ui-alerts`;
}

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf-8');
    let original = content;
    
    let needsImport = false;
    let modified = false;

    // Replace window.confirm
    if (content.includes('window.confirm')) {
        content = content.replace(/window\.confirm\((.*?)\)/g, 'await showConfirm($1)');
        needsImport = true;
        modified = true;
    }

    // Replace alert
    if (content.includes('alert(')) {
        content = content.replace(/alert\((.*?)\)/g, (match, p1) => {
            let type = 'info';
            let lower = p1.toLowerCase();
            if (lower.includes('success') || lower.includes('reset successfully')) type = 'success';
            if (lower.includes('fail') || lower.includes('error') || lower.includes('required') || lower.includes('not found')) type = 'error';
            return `showToast(${p1}, "${type}")`;
        });
        needsImport = true;
        modified = true;
    }

    if (modified) {
        // Check if handle functions need to be async if they use await showConfirm
        if (content.includes('await showConfirm')) {
            // Very naive replacement for handle functions that might not be async
            content = content.replace(/const (\w+) = \((.*?)\) => {\s*const confirmed = await showConfirm/g, 'const $1 = async ($2) => {\n    const confirmed = await showConfirm');
            content = content.replace(/const (\w+) = \((.*?)\) => {\s*if \(\!await showConfirm/g, 'const $1 = async ($2) => {\n    if (!await showConfirm');
            content = content.replace(/onClick=\{\(\) => {\s*if \(await showConfirm/g, 'onClick={async () => {\n    if (await showConfirm');
        }

        // Add import
        const relativePath = getRelativePathToUtils(filePath).replace(/\\/g, '/');
        const importStatement = `import { showToast, showConfirm } from "${relativePath}";\n`;
        
        // Find last import
        const lastImportIndex = content.lastIndexOf('import ');
        if (lastImportIndex !== -1) {
            const endOfLine = content.indexOf('\n', lastImportIndex);
            content = content.slice(0, endOfLine + 1) + importStatement + content.slice(endOfLine + 1);
        } else {
            content = importStatement + content;
        }

        fs.writeFileSync(filePath, content);
        console.log(`Updated ${filePath}`);
    }
}

function walkDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walkDir(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
            processFile(fullPath);
        }
    }
}

const adminPagesDir = path.join(srcDir, 'pages', 'Admin');
const adminComponentsDir = path.join(srcDir, 'components', 'admin');

if (fs.existsSync(adminPagesDir)) walkDir(adminPagesDir);
if (fs.existsSync(adminComponentsDir)) walkDir(adminComponentsDir);

console.log("Done refactoring.");
