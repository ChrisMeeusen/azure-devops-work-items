#!/usr/bin/env node
const { exec } = require("child_process");
const fspath = require('path');
const fs = require('fs');
const tar = require('tar-fs');
const gunzip = require('gunzip-maybe');

console.log('extracting azure-devops-work-items-win zip file');

exec('npm root -g', (error, stdout, stderr) => {
    if( error || stderr){
        console.log("error determining npm global node_modules location", error || stderr);
    }
    if(stdout){
        stdout= stdout.trim();
        tarUnzipDir = fspath.join(stdout,'azure-devops-work-items-win','dist');
        unzip(tarUnzipDir);
    }
});

const unzip = (dir) => {
    const tarFileLoc = fspath.join(dir,'win.tar.gz');
    fs.createReadStream(tarFileLoc)
        .pipe(gunzip())
        .pipe(tar.extract(dir));
    console.log('unzipped file.  Install successful!');
}
