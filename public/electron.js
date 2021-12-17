const Sentry = require("@sentry/electron");
Sentry.init({ dsn: "YOUR_SENTRY_DSN" });

function causeException() {
    const a = null
    a.b = true
}

function causeUnhandledRejection() {
    function promise() {
        return new Promise((resolve, _) => {
            setTimeout(() => {
                return resolve()
            }, 1000)
        })
    }

    promise().then(() => {
        const a = undefined
        a.b = true
    })
}

function causeCrash() {
    process.crash()
}

setTimeout(() => {
    if (process.env.TEST_MAIN_EXCEPTION) {
        causeException()
    }
    if (process.env.TEST_MAIN_UNHANDLED_REJECTION) {
        causeUnhandledRejection()
    }
    if (process.env.TEST_CRASH) {
        causeCrash()
    }
}, 3000)

let win;

const path = require('path');

const { app, BrowserWindow, dialog } = require('electron');
const isDev = require('electron-is-dev');

console.log('main: isDev=' + isDev)

function createWindow() {
    // Create the browser window.
    win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
        },
    });

    // and load the index.html of the app.
    // win.loadFile("index.html");
    win.loadURL(
        isDev
            ? 'http://localhost:3000'
            : `file://${path.join(__dirname, '../build/index.html')}`
    );
    // Open the DevTools.
    if (isDev) {
        win.webContents.openDevTools({ mode: 'detach' });
    }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
