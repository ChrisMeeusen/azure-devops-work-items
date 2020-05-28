#!/usr/bin/env node
const { exec } = require("child_process");
const fspath = require('path');
const fs = require('fs');


exec('sudo npm root -g', (error, stdout, stderr) => {
    if( error || stderr){
        console.log("error determining npm global node_modules location", error || stderr);
    }
    if(stdout){
        unzipFile(stdout);
    }
});

const makeDir = (_path) => {
    console.log('making directory to tar extract into');
    fs.makeDirSync(fspath.join(_path,'azure-devops-work-items-mac','dist','mac'), {recursive: true});
    console.log('directory made');
    unzipFile(_path);
}

const unzipFile = (_path) => {
    const zipPath = fspath.join(_path, 'azure-devops-work-items-mac','dist','mac.tar.gz');
    const destPath = fspath.join(_path, 'azure-devops-work-items-mac','dist', 'mac');

    console.log('extracting archive...');

    exec(`sudo tar -xvzf ${zipPath} -C ${destPath}`, (error, stdout, stderr) => {
        if( error || stderr){
            console.log("error extracting archive", error || stderr);
        }
        if(stdout){
            console.log('archive extracted');
        }
    });

}
