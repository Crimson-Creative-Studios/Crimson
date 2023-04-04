const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('crimAPI', {
    BotStart: (arg) => ipcRenderer.invoke('BotStart', arg),
    BotStop: (arg) => ipcRenderer.invoke('BotStop', arg),
    BotRC: (arg) => ipcRenderer.invoke('BotRC', arg),
    botstdout: (callback) => ipcRenderer.on('botstdout', callback),
    term: (callback) => ipcRenderer.on('STP', callback)
})