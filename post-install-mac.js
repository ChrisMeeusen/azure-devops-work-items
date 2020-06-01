#!/usr/bin/env node
const { exec } = require("child_process");
const fspath = require('path');
const fs = require('fs');
let tarUnzipDir;
exec('npm root -g', (error, stdout, stderr) => {
    if( error || stderr){
        console.log("error determining npm global node_modules location", error || stderr);
    }
    if(stdout){
        stdout= stdout.trim();
        tarUnzipDir = fspath.join(stdout,'azure-devops-work-items-mac','dist','mac');
        makeDir(stdout);
    }
});
const makeDir = (_path) => {
    console.log('making directory to tar extract into');
    fs.mkdir(tarUnzipDir, {recursive: true}, (err)=> {
        if(err) throw err;

        console.log('made: ', fspath.join(_path,'azure-devops-work-items-mac','dist','mac'));
        unzipFile(_path);
    });
}
const unzipFile = (_path) => {
    const zipPath = fspath.join(_path, 'azure-devops-work-items-mac','dist','mac.tar.gz');
    const destPath = tarUnzipDir;
    console.log('extracting archive...');
    exec(`tar -xvzf ${zipPath} -C ${destPath}`, (error, stdout, stderr) => {
        if( error ){
            console.log("error extracting archive", error );
        }
        console.log('archive extracted');
    });
}
