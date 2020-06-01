#!/usr/bin/env node
const { exec } = require("child_process");
const fspath = require('path');
const fs = require('fs');

let tarUnzipDir;

exec('sudo npm root -g', (error, stdout, stderr) => {
    if( error || stderr){
        console.log("error determining npm global node_modules location", error || stderr);
    }
    if(stdout){
        makeDir(stdout);
        tarUnzipDir = fspath.join(stdout,'azure-devops-work-items-mac','dist','mac');
    }
});

const makeDir = (_path) => {
    console.log('making directory to tar extract into');
    fs.mkdirSync(tarUnzipDir, {recursive: true});
    console.log('made: ', fspath.join(_path,'azure-devops-work-items-mac','dist','mac'));
    unzipFile(_path);
}

const unzipFile = (_path) => {
    const zipPath = fspath.join(_path, 'azure-devops-work-items-mac','dist','mac.tar.gz');
    const destPath = tarUnzipDir;

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
