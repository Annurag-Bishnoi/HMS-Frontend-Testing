const fs = require('fs');
const path = require('path');

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf-8');
    let original = content;

    // 1. Fix handleChange implementations
    // Replace: setStaff({ ...staff, [e.target.name]: e.target.value });
    // Or setDoctor, setPatient, etc.
    const handleChangeRegex = /set([A-Z]\w+)\(\{\s*\.\.\.\w+,\s*\[e\.target\.name\]:\s*e\.target\.value\s*\}\);/g;
    content = content.replace(handleChangeRegex, (match, stateName) => {
        let lower = stateName.toLowerCase();
        // Assuming state is same as lowercase or staff/doctor
        return `set${stateName}({ ...${lower}, [e.target.name]: (e.target.name === 'mobile' || e.target.name === 'phone') ? e.target.value.replace(/\\D/g, "") : e.target.value });`;
    });

    // Also handle e.target.name === 'mobile' ? ... value.replace(/\D/g, "") : value if it was partially done but missing phone
    // Actually, I'll just use a more generic replacement.

    // 2. Fix inline onChange for phone
    const inlineOnChangeRegex = /onChange=\{\(e\) => set([A-Z]\w+)\(\{\.\.\.(\w+),\s*(phone|mobile):\s*e\.target\.value\}\)\}/g;
    content = content.replace(inlineOnChangeRegex, `onChange={(e) => set$1({...$2, $3: e.target.value.replace(/\\D/g, "")})}`);

    // 3. Add type="tel" and maxLength={10} to <input name="mobile"> and <input name="phone">
    const inputRegex = /<input([^>]+name="(mobile|phone)"[^>]*)>/g;
    content = content.replace(inputRegex, (match, innerProps, name) => {
        let newProps = innerProps;
        if (!newProps.includes('type="tel"')) {
            newProps = ` type="tel"${newProps}`;
            // If there's an existing type="text", replace it
            newProps = newProps.replace(/type="text"/, '');
        }
        if (!newProps.includes('maxLength=')) {
            newProps = ` maxLength={10}${newProps}`;
        }
        return `<input${newProps}>`;
    });

    if (content !== original) {
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
        } else if (fullPath.endsWith('.tsx')) {
            processFile(fullPath);
        }
    }
}

walkDir(path.join(__dirname, 'src', 'pages', 'Admin'));
console.log("Done");
