'use strict';
const fs = require('fs');

fs.renameSync('./package/mac/package.mac.json','./package/mac/package.json');
fs.renameSync('./package/win/package.win.json','./package/win/package.json');
fs.renameSync('./package/linux/package.linux.json','./package/linux/package.json');
fs.renameSync('./package/core/package.core.json','./package/core/package.json');
