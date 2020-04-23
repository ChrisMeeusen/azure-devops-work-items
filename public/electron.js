const { app, BrowserWindow, Menu, shell, ipcMain } = require('electron')
const path = require("path");
const isDev =require("electron-is-dev");
const fs = require("fs");
const readFileToPromise = require("util").promisify(fs.readFile);
const { default: installExtension, REDUX_DEVTOOLS } = require('electron-devtools-installer');

Menu.setApplicationMenu(null);

const extractArg = ( argName ) => {
    const args = process.argv ?? [];

    const arg = args.find(a => a.toLocaleLowerCase().startsWith(argName));
    if(!arg) {
        return null;
    }
    return arg.split(`${argName}=`).pop() || null;
};



function createWindow () {
    // Create the browser window.
    const win = new BrowserWindow({
        width: 1100,
        height: 850,
        webPreferences: {
            nodeIntegration: true
        }
    })

    // and load the index.html of the app.
    win.loadURL(
        isDev ? 'http://localhost:3000' : `file://${path.join(__dirname,"../build/index.html")}`
    );

    // This is for spawning new windows from the main app (in the case of opening external links and such)
    win.webContents.on("new-window", function(event, url) {
        event.preventDefault();
        shell.openExternal(url);
    });

    const rFile = extractArg('repoPath') ?? path.join(__dirname,'../config/repo-mock.json');
    const dFile = path.join(app.getPath("appData"), 'azure-devops-work-items', 'conf.json');

    const readRepo = readFileToPromise(rFile,'utf8')
        .then(data => {
           const obj = JSON.parse(data);
           obj.filePath=rFile;
           obj.mode='Repo';
           return obj;
        });

    //const readDefault = readFileToPromise(dFile);
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
            resolve({filePath: dFile, mode: 'Default'});
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
