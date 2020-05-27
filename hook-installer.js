#!/usr/bin/env node
const os = require('os');
const { exec } = require("child_process");
const fspath = require('path');
const fs = require('fs');

// TODO hook install script here.
// Control Flow:
// Copy the contents of hook.js to .git/hooks/commit-msg
// if error throw
// else console.log('Successfully added hook')

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
    const repoHooksPath = fspath.join(currentDirectory, '.git','hooks');
    let hookPath = fspath.join(currentDirectory,'.git','hooks','commit-msg');
    let binPath;

    switch (_os) {
        case 'Windows_NT':
            binPath= fspath.join(globalNpmNodeModulesPath,'azure-devops-work-items-win','dist','win-unpacked','azure-devops-work-items.exe');
            binPath = binPath.replace(/\\/g, "\\\\");
            break;
        case 'Darwin':
            binPath= fspath.join(globalNpmNodeModulesPath,'azure-devops-work-items-mac','dist','mac','azure-devops-work-items.app');
            break;
        case 'Linux':
            binPath= fspath.join(globalNpmNodeModulesPath,'azure-devops-work-items-linux','dist','linux-unpacked','azure-devops-work-items');
            break;
    }

    const hookString = hookScriptString(binPath,repoHooksPath);

    fs.writeFile(hookPath, hookString, (err => {
        if(err) throw err;
        console.log("Success:  git hook added to this repo!  For more information see here: https://github.com/ChrisMeeusen/azure-devops-work-items");
    }))

}

const hookScriptString = (binPath, repoHooksPath) => `#!/usr/bin/env node

var child_process = require('child_process');
const cFile = process.argv[2];

child_process.exec(\`"${binPath}" --repoPath=${repoHooksPath} --commitFile=\$\{cFile\}\`, (error, stdout, stderr) => {
    if (error !== null) {
        console.log(error);
        process.exit(1);
    }
});
`;
