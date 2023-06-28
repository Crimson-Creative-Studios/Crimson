const { contextBridge, ipcRenderer } = require('electron')
const {onlineVersion, uuid, themes} = ipcRenderer.sendSync("infoGrab")
var guicfg = {
    theme: "",
    darkness: "0",
    override: false
}

contextBridge.exposeInMainWorld('crimAPI', {
    guicfg: () => guicfg,
    BotStart: (arg) => ipcRenderer.invoke('BotStart', arg),
    BotStop: (arg) => ipcRenderer.invoke('BotStop', arg),
    BotRC: (arg) => ipcRenderer.invoke('BotRC', arg),
    botstdout: (callback) => ipcRenderer.on('botstdout', callback),
    term: (callback) => ipcRenderer.on('STP', callback),
    winmin: () => ipcRenderer.send('wincontrol', "conmin"),
    winclose: () => ipcRenderer.send('wincontrol', "conclose"),
    winmax: () => ipcRenderer.send('wincontrol', "conmax"),
    winunmax: () => ipcRenderer.send('wincontrol', "conunmax"),
    winrestart: () => ipcRenderer.send('wincontrol', "conrestart"),
    handleWinControl: (callback) => ipcRenderer.on("wincontroler", callback),
    themes: () => themes,
    handleThemeData: (callback) => ipcRenderer.on('winguicfg', callback),
    show: () => ipcRenderer.invoke('showWin', 'cnsl')
})