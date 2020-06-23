#!/usr/bin/env node
const os = require('os');
const { exec } = require("child_process");
const fspath = require('path');
const fs = require('fs');

const _os = os.type();

exec('npm root -g', (error, stdout, stderr) => {
    if( error || stderr){
        console.log("error determining npm global node_modules location", error || stderr);
    }
    if(stdout){
        //remove new lines and extra characters from stdout
        let _path=stdout.replace(/^\s+|\s+$/g, '');
        _path=_path.replace(/\\/g, "\\\\");
        // install the hook
        install(_os, _path);
    }

})


const install = (_os, globalNpmNodeModulesPath) => {
    const currentDirectory = process.cwd();
    let repoHooksPath = fspath.join(currentDirectory, '.git','hooks');
    let hookPath = fspath.join(currentDirectory,'.git','hooks','commit-msg');
    let binPath;
    let hookString;
    switch (_os) {
        case 'Windows_NT':
            binPath= fspath.join(globalNpmNodeModulesPath,'azure-devops-work-items-win','dist','azure-devops-work-items.exe');
            binPath = binPath.replace(/\\/g, "\\\\");
            repoHooksPath = repoHooksPath.replace(/\\/g, "\\\\");
            hookString = hookScriptStringWin(binPath,repoHooksPath);
            break;
        case 'Darwin':
            binPath= fspath.join(globalNpmNodeModulesPath,'azure-devops-work-items-mac','dist','mac','azure-devops-work-items.app');
            hookString = hookScriptStringMac(binPath, repoHooksPath);
            break;
        case 'Linux':
            binPath= fspath.join(globalNpmNodeModulesPath,'azure-devops-work-items-linux','dist','linux-unpacked','azure-devops-work-items');
            hookString = hookScriptStringMac(binPath, repoHooksPath);
            break;
    }

    fs.writeFile(hookPath, hookString, (err => {
        if(err) throw err;
        console.log("Success:  git hook added to this repo!  For more information see here: https://github.com/ChrisMeeusen/azure-devops-work-items");
    }))
}

const hookScriptStringWin = (binPath, repoHooksPath) => `#!/usr/bin/env node


var child_process = require('child_process');
var path = require('path');

const hookPath =process.argv[1];
const hookPathSplit = hookPath.split('\\\\');
let commitFile = hookPathSplit.slice(0, hookPathSplit.length -3).join('\\\\');
commitFile = path.join(commitFile, process.argv[2]);

child_process.exec(\`"${binPath}" --args --repoPath=${repoHooksPath} --commitFile=\$\{commitFile\}\`, (error, stdout, stderr) => {
    if (error !== null) {
        console.log(error);
        process.exit(1);
    }
});
`;

const hookScriptStringMac = (binPath, repoHooksPath) => `#!/usr/bin/env node

var child_process = require('child_process');
var path = require('path');

const hookPath = process.argv[1];
const cFile = process.argv[2];
const hookPathSplit = hookPath.split('/');
let commitFile = hookPathSplit.slice(0, hookPathSplit.length -3).join('/');
commitFile = path.join(commitFile, cFile);
binPath = path.join(binPath,'Contents','MacOS','azure-devops-work-items');

child_process.exec(\`"${binPath}" --repoPath=${repoHooksPath} --commitFile=\$\{commitFile\}\`, (error, stdout, stderr) => {
    if (error !== null) {
        console.log(error);
        process.exit(1);
    }
});
`;
