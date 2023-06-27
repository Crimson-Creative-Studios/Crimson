const { contextBridge, ipcRenderer } = require('electron')
const {onlineVersion, uuid, themes} = ipcRenderer.sendSync("infoGrab")

function requirePro(thing) {
    return ipcRenderer.sendSync("require", thing)
}

contextBridge.exposeInMainWorld('crimAPI', {
    guicfg: () => requirePro("./guicfg.json"),
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
    themeHandle: (callback) => ipcRenderer.on("themeHandle", callback),
})