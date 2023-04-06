const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('crimAPI', {
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
})