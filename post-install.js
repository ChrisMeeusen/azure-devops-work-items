'use strict';
const os = require('os');
const { exec } = require("child_process");

const _os = os.type();
let binaryPackage;

switch (_os) {
    case 'Windows_NT':
        binaryPackage='azure-devops-work-items-win';
        break;
    case 'Darwin':
        binaryPackage='azure-devops-work-items-mac';
        break;
    case 'Linux':
        binaryPackage='azure-devops-work-items-linux';
        break;
}

console.log('installing platform specific binary package...')
console.log('installing ', binaryPackage);

exec(`npm i -g ${binaryPackage}`, (error, stdout, stderr) => {
    if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
});

