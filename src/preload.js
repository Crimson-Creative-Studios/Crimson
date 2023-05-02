const { contextBridge, ipcRenderer } = require('electron');
var status = ['Currently in the Bot menu', 'bigimg']

function requirePro(thing) {
    var res = ipcRenderer.sendSync("require", thing)
    return res
}

var cfg = requirePro('../config.json')

contextBridge.exposeInMainWorld('darkMode', {
    toggle: () => ipcRenderer.invoke('dark-mode:toggle'),
    system: () => ipcRenderer.invoke('dark-mode:system'),
    get: () => ipcRenderer.invoke('dark-mode:get'),
    handleDarkChange: (callback) => ipcRenderer.on('dark-mode:change', callback)
})

contextBridge.exposeInMainWorld('crimAPI', {
    rcpChange: (args) => {
        status[0] = args[0]
        status[1] = args[1]
        ipcRenderer.invoke('clientChange', status)
    },
    jsonRequest: (arg) => ipcRenderer.invoke('jsonRequest', arg),
    OpenConsole: (arg) => ipcRenderer.invoke('OpenConsole', arg),
    cfg: cfg,
    saveENV: (arg) => ipcRenderer.invoke('putEnv', arg),
    winmin: () => ipcRenderer.send('wincontrol', "min"),
    winclose: () => ipcRenderer.send('wincontrol', "close"),
    winmax: () => ipcRenderer.send('wincontrol', "max"),
    winunmax: () => ipcRenderer.send('wincontrol', "unmax"),
    handleWinControl: (callback) => ipcRenderer.on("wincontroler", callback),
    openSite: (arg) => ipcRenderer.invoke('siteopen', arg),
    handleVer: (callback) => ipcRenderer.on('verfind', callback),
    onlineRequest: (thing) => ipcRenderer.invoke('onlineRequest', thing),
    extensionDownload: (arg) => ipcRenderer.invoke('extensionDownload', arg),
    handleGUICFG: (callback) => ipcRenderer.on('guicfgfind', callback),
    handleNotificationMain: (callback) => ipcRenderer.on("notificationSend", callback)
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

var mainAdditions = []
var extensions = []
var configs = []
var errs = []
var metanames = {}
var userCFGS = {}
var defaults = {}
var libtext = {}
var islib = {}
var extensionFiles = ipcRenderer.sendSync("getDir", "../Extensions/")
extensionFiles.forEach(extension => {
    var arr = []
    arr.push(extension)
    var uicfg = null
    try {
        uicfg = requirePro(`../Extensions/${extension}/uiconfig.json`)
    } catch(err) {}
    var metadata = requirePro(`../Extensions/${extension}/extension.json`)
    var metaname = metadata.name
    var config = requirePro(`../Extensions/${extension}/config.json`)
    metanames[extension] = metaname
    try {
        if (uicfg.$UI) {
            var options = JSON.stringify(uicfg.$UI).replaceAll('"', '&quot;')
            configs.push(`<button id="${metaname}Button" class="button" onclick="openTab('${extension}', 'ConfigurationButton', '${options}')">${metaname}</button>`)
        } else {
            configs.push(`<button id="${metaname}Button" class="button" onclick="openTab('${extension}', 'ConfigurationButton')">${metaname}</button>`)
        }
    } catch (err) {
        configs.push(`<button id="${metaname}Button" class="button" onclick="openTab('${extension}', 'ConfigurationButton')">${metaname}</button>`)
    }
    if (metadata.type === "library") {
        mainAdditions.push(`<div class="tabcontent" id="${extension}"><h3>${metaname} Options</h3><button class="button" onclick="openTab('Configuration', 'ConfigurationButton')">Go Back</button><br><br><input type="checkbox" id="${extension}input" name="${extension}input" value="true" disabled="true" checked><label for="${extension}input">Is enabled?</label><br><br></div>`)

        islib[extension] = true
    } else {
        islib[extension] = false

        if (config.enabled === "true") {
            mainAdditions.push(`<div class="tabcontent" id="${extension}"><h3>${metaname} Options</h3><button class="button" onclick="openTab('Configuration', 'ConfigurationButton')">Go Back</button><br><br><input type="checkbox" id="${extension}input" name="${extension}input" value="true" checked><label for="${extension}input">Is enabled?</label><br><br></div>`)
        } else {
            mainAdditions.push(`<div class="tabcontent" id="${extension}"><h3>${metaname} Options</h3><button class="button" onclick="openTab('Configuration', 'ConfigurationButton')">Go Back</button><br><br><input type="checkbox" id="${extension}input" name="${extension}input" value="true"><label for="${extension}input">Is enabled?</label><br><br></div>`)
        }
    }

    if (uicfg !== null) {

        try {
            for (const thing of Object.keys(uicfg)) {
                var information = uicfg[thing]
                if (thing !== "$LIBRARYMETA" && thing !== "$BUTTONS" && thing !== "$UI") {
                    userCFGS[information.uuid] = {
                        item: information.item,
                        file: information.file,
                        extension: extension
                    }

                    if (information.hidden === "true") {
                        var type = "password"
                        var events = ` onfocus="this.type='text'" onblur="this.type='password'"`
                    } else {
                        var type = "text"
                        var events = ""
                    }

                    arr.push(`<label for="${information.uuid}" title="${information.hover}">${information.metaname}</label><br><input type="${type}" id="${information.uuid}" name="${information.uuid}" style="width: 100%;"${events}><br><br>`)
                    var file = requirePro(`../Extensions/${extension}/${information.file}`)
                    defaults[information.uuid] = file[information.item]
                } else if (thing === "$LIBRARYMETA") {
                    if (information.text) {
                        var text = information.text
                    } else {
                        var text = "This extension cannot be disabled because it is a library."
                    }
                    if (information.docubuttontext) {
                        var doctext = information.docbuttontext
                    } else {
                        var doctext = "Click here to learn more"
                    }
                    if (information.docbuttonlink) {
                        var doclink = information.docbuttonlink
                    } else {
                        var doclink = "https://skyoproductions.github.io/wiki/crimson/lib"
                    }
                    libtext[extension] = {
                        text: text,
                        buttontext: doctext,
                        buttonlink: doclink
                    }
                }
            }
        } catch (err) { errs.push(err) }

    }

    extensions.push(arr)
})

contextBridge.exposeInMainWorld('codeAdditions', {
    mainAdd: mainAdditions,
    extensions,
    configs,
    metanames,
    userCFGS,
    errs,
    defaults,
    libtext,
    islib
})