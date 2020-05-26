'use strict';
const fs = require('fs');

/**
 *  The purpose of this script is to sync the pakage.json version across all 4 packages, core, win, mac, and linux
**/

const mainPkg = JSON.parse(fs.readFileSync('./package.json'));
const macPkg = JSON.parse(fs.readFileSync('./package.mac.json'));
const linuxPkg = JSON.parse(fs.readFileSync('./package.linux.json'));
const winPkg = JSON.parse(fs.readFileSync('./package.win.json'));

macPkg.version = mainPkg.version;
linuxPkg.version = mainPkg.version;
winPkg.version = mainPkg.version;

fs.writeFileSync('./package.mac.json', JSON.stringify(macPkg, null, 2));
fs.writeFileSync('./package.linux.json', JSON.stringify(linuxPkg, null, 2));
fs.writeFileSync('./package.win.json', JSON.stringify(winPkg, null, 2));
