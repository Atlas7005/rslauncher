const { BrowserWindow, app, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");
const utils = require("./utils");

const { autoUpdater } = require("electron-updater");

var win;
var updaterWin;

function createUpdaterWindow() {
    updaterWin = new BrowserWindow({
        width: 450,
        height: 600,
        minWidth: 450,
        minHeight: 600,
        center: true,
        title: "Ruby Servers - Updater",
        frame: false,
        transparent: true,
        resizable: false,
        webPreferences: {
            nodeIntegration: true,
            preload: path.join(__dirname, "/updater-preload.js")
        }
    });
    
    updaterWin.loadFile("updater.html");
}

function createMainWindow() {
    win = new BrowserWindow({
        width: 1070,
        height: 600,
        minWidth: 700,
        minHeight: 400,
        center: true,
        title: "Ruby Servers",
        frame: false,
        transparent: true,
        webPreferences: {
            nodeIntegration: true,
            preload: path.join(__dirname, "/preload.js")
        }
    });

    updaterWin.close();

    win.loadFile("index.html");
}

app.whenReady().then(() => {
    createUpdaterWindow();
    autoUpdater.checkForUpdates();
});

autoUpdater.on("checking-for-updates", () => {
    console.log("Checking for updates...");
    updaterWin.webContents.send("msg", "Checking for updates...");
});

autoUpdater.on("update-available", () => {
    console.log("Update available!");
    updaterWin.webContents.send("msg", "Update available!");
});

autoUpdater.on("update-not-available", () => {
    console.log("Update not available.");
    createMainWindow();
});

autoUpdater.on("error", (err) => {
    console.log("Error in auto-updater: " + err);
    updaterWin.webContents.send("msg", "Error in auto-updater: " + err);
});

autoUpdater.on("download-progress", (progressObj) => {
    let log_message = "Download speed: " + progressObj.bytesPerSecond;
    log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
    log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
    console.log(log_message);
    updaterWin.webContents.send("msg", log_message);
});

autoUpdater.on("update-downloaded", (info) => {
    console.log("Update downloaded!");
    updaterWin.webContents.send("msg", "Update downloaded!");
    autoUpdater.quitAndInstall();
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

ipcMain.on("minimize", e => {
    win.minimize();
});

ipcMain.on("maximize", e => {
    win.isMaximized() ? win.unmaximize() : win.maximize();
});

ipcMain.on("close", e => {
    win.close();
});

ipcMain.on("getServers", async e => {
    return e.returnValue = await utils.getServers();
});

ipcMain.on("getServerInfo", async (e, serverName) => {
    var servers = await utils.getServers();
    var server = servers[serverName];

    if (server) {
        if(server.type === "csgo") {
            return e.returnValue = await utils.getCSGOServer(server.ip, server.port);
        } else if(server.type === "minecraft") {
            return e.returnValue = await utils.getMCServer(server.ip, server.port);
        }
    } else {
        return e.returnValue = {};
    }
});