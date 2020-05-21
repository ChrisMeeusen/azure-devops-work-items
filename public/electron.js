const { app, BrowserWindow, Menu, shell, ipcMain, remote } = require('electron')
const path = require("path");
const isDev =require("electron-is-dev");
const fs = require("fs");
const readFileToPromise = require("util").promisify(fs.readFile);
const { default: installExtension, REDUX_DEVTOOLS } = require('electron-devtools-installer');
const debug = require('electron-debug');

debug({isEnabled: true});

Menu.setApplicationMenu(null);

const extractArg = ( argName ) => {
    const args = process.argv ?? [];

    const cmdLineArgs = args.filter(a => a.startsWith("--"));
    const mappedArgs = cmdLineArgs && cmdLineArgs.map( cla => {
        const split = cla.split('=');

        return {arg: split[0], value: split[1]};
    });
    console.log(mappedArgs);
    const argVal = mappedArgs
        .find(ma => ma.arg.toLowerCase() === `--${argName.toLowerCase()}`);

    return argVal ? argVal.value : null;
};

const createSettings = (filePath, mode) => {
    return {
        mode: mode,
        filePath: filePath,
        personalAccessToken: '',
        rememberWorkItems: false,
        organization: '',
        team: '',
        project: '',
        hasBeenLoaded: false,
        selectedWorkItems: [],
        commitMessageFilePath:''
    };
};

function createWindow () {
    // Create the browser window.
    const win = new BrowserWindow({
        width: 1100,
        height: 850,
        webPreferences: {
            nodeIntegration: true,
            webSecurity: false
        }
    })

/*    // and load the index.html of the app.
    if(isDev){
        win.loadURL('http://localhost:3000');
    } else {
        win.loadFile(index.html);
    }*/

    win.loadURL(
        isDev ? 'http://localhost:3000' : `file://${path.join(__dirname,"../build/index.html")}`
    );

    // This is for spawning new windows from the main app (in the case of opening external links and such)
    win.webContents.on("new-window", function(event, url) {
        event.preventDefault();
        shell.openExternal(url);
    });

    // Printing current directory
    console.log("Current working directory: ", process.cwd());

    //const rFile = !isDev ? process.cwd() : path.join(__dirname,'../config/repo-conf.json');

    const repoPathArg = extractArg('repoPath');
    // if the repo path was provided as an arg then tack on the file name to the path.
    const argFile = repoPathArg ? path.join(repoPathArg,'repo-conf.json'): repoPathArg;
    console.log("argFile: ", argFile);
    // use either the arg val or the default development file path
    const rFile = argFile ? argFile : path.join(__dirname,'../config/repo-conf.json');
    const dFile = path.join(app.getPath("appData"), 'azure-devops-work-items', 'conf.json');

    //TODO refactor these functions
    const readRepo = new Promise((resolve, reject) => {
        try {
            if(fs.existsSync(rFile)) {
                resolve(
                    readFileToPromise(rFile)
                    .then( data => {
                        const obj =JSON.parse(data);
                        obj.filePath = rFile;
                        obj.mode = 'Repo';
                        obj.commitMessageFilePath = extractArg('commitFile') ?? path.join(__dirname,'../config/commit-file.txt')
                        return obj;
                    })
                );
            }
            resolve(createSettings(rFile,'Repo'));
        } catch (e) {
            reject('bad things happened', e);
        }
    });

    const readDefault = new Promise((resolve, reject) => {
        try {
            if(fs.existsSync(dFile)) {
                resolve(
                    readFileToPromise(dFile)
                    .then(data => {
                        const obj =JSON.parse(data);
                        obj.filePath = dFile;
                        obj.mode = 'Default';
                        return obj;
                    })
                );
            }
            resolve(createSettings(dFile, 'Default'));
        } catch (e) {
            reject('bad things happened', e);
        }
    });

    ipcMain.on('react-loaded', (event, args) => {

        Promise.all([readRepo, readDefault])
            .then((values => {
                event.sender.send('conf-read', values);
            }))
            .catch(reason => console.log(reason));
    });

    // event listener for when the react app sends a shut down message to electron.
    ipcMain.on('quit-app', ((event, args) => {
        if(args){
            console.log(args)
        }
        app.exit(0);
    }));

    // Open the DevTools.
    if(isDev){
        win.webContents.openDevTools({mode: "undocked"});
    }
}



// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
if(isDev){
    app.whenReady().then(()=> {
        installExtension(REDUX_DEVTOOLS);
    });
}
