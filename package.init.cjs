const fs = require('fs');

const packageJsonPath = './package.json';
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

// const devDependenciesToRemove = [/^@types\//, /eslint/, /prettier/];
const devDependenciesToRemove = [/eslint/, /prettier/];

if (packageJson.devDependencies) {
  Object.keys(packageJson.devDependencies).forEach((key) => {
    if (devDependenciesToRemove.some((regex) => regex.test(key))) {
      delete packageJson.devDependencies[key];
    }
  });
}

const scriptsToRemove = ['lint', 'format'];

if (packageJson.scripts) {
  scriptsToRemove.forEach((script) => {
    delete packageJson.scripts[script];
  });
}

fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf-8');
