const { contextBridge, ipcRenderer } = require('electron');
var status = ['Currently in the Bot menu', 'bigimg']

function requirePro(thing) {
    var res = ipcRenderer.sendSync("require", thing)
    return res
}

contextBridge.exposeInMainWorld('darkMode', {
    toggle: () => ipcRenderer.invoke('dark-mode:toggle'),
    system: () => ipcRenderer.invoke('dark-mode:system'),
})

contextBridge.exposeInMainWorld('crimAPI', {
    rcpChange: (args) => {
        status[0] = args[0]
        status[1] = args[1]
        ipcRenderer.invoke('clientChange', status)
    },
    jsonRequest: (arg) => ipcRenderer.invoke('jsonRequest', arg),
    OpenConsole: (arg) => ipcRenderer.invoke('OpenConsole', arg)
})

contextBridge.exposeInMainWorld('ipcRenderer', ipcRenderer);

contextBridge.exposeInMainWorld('ipc', {
    handleAdd: (callback) => ipcRenderer.on('add', callback),
    debugMode: (callback) => ipcRenderer.on('--DEBUG--', callback)
})

contextBridge.exposeInMainWorld('versions', {
    node: () => process.versions.node,
    chrome: () => process.versions.chrome,
    electron: () => process.versions.electron,
})

contextBridge.exposeInMainWorld('theme', {
    current: process.versions.mode,
})

var mainAdditions = [];
var extensions = [];
var configs = [];
var metanames = {};
var extensionss = ipcRenderer.sendSync("getDir", "../Extensions/")
extensionss.forEach(extension => {
    var arr = [];
    var metadata = requirePro(`../Extensions/${extension}/extension.json`);
    console.log(metadata)
    var metaname = metadata.name
    var config = requirePro(`../Extensions/${extension}/config.json`)
    var enabled = config.enabled
    metanames[extension] = metaname
    configs.push(`<button id="${metaname}Button" class="tablinksextension button" onclick="openTab(event, '${extension}', null)">${metaname}</button>`)
    if (enabled === "true") {
        mainAdditions.push(`<div class="tabcontent" id="${extension}"><button class="tablinksextension button" onclick="openTab(event, 'Configuration', 'ConfigurationButton')">Go Back</button><br><br><input type="checkbox" id="${extension}input" name="${extension}input" value="true" checked><label for="${extension}input">Is enabled?</label></div>`)
    } else {
        mainAdditions.push(`<div class="tabcontent" id="${extension}"><button class="tablinksextension button" onclick="openTab(event, 'Configuration', 'ConfigurationButton')">Go Back</button><br><br><input type="checkbox" id="${extension}input" name="${extension}input" value="true"><label for="${extension}input">Is enabled?</label></div>`)
    }
    arr.push(extension)
    extensions.push(arr)
})

contextBridge.exposeInMainWorld('codeAdditions', {
    mainAdd: mainAdditions,
    extensions: extensions,
    configs: configs,
    metanames: metanames
})