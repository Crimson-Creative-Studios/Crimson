const { contextBridge, ipcRenderer } = require('electron')
var status = ['Currently in the Bot menu', 'bigimg']

function requirePro(thing) {
    return ipcRenderer.sendSync("require", thing)
}

const {onlineVersion, uuid, themes} = ipcRenderer.sendSync("infoGrab")
const cfg = requirePro('../config.json')
const version = ipcRenderer.sendSync("getFile", "version.txt")
const botInfoCollect = ipcRenderer.sendSync("botInfoCollect", null)

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
    handleNotificationMain: (callback) => ipcRenderer.on("notificationSend", callback),
    guicfg: () => requirePro("./guicfg.json"),
    uuid: () => uuid,
    themes: () => themes,
    handleThemeData: (callback) => ipcRenderer.on('grabThemeData', callback),
    sendThemeData: (arg) => ipcRenderer.invoke('sendThemeData', arg),
    show: () => ipcRenderer.invoke('showWin', 'main'),
    handleAdd: (callback) => ipcRenderer.on('add', callback),
    versions: {
        node: () => process.versions.node,
        chrome: () => process.versions.chrome,
        electron: () => process.versions.electron,
        crimson: () => version,
        crimOnline: () => onlineVersion
    },
    botInfoCollect: () => botInfoCollect
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

extensionFiles.forEach((extension) => {
    var arr = []
    arr.push(extension)
    var uicfg;
    try {
        uicfg = requirePro(`../Extensions/${extension}/uiconfig.json`)
    } catch (err) {
        uicfg = null
    }
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
        mainAdditions.push(`<div class="tabcontent" id="${extension}"><h3>${metaname} Options</h3><p>${metadata.des ?? "No provided description!"}</p><button class="button" onclick="openTab('Configuration', 'ConfigurationButton')"><i class="fa-solid fa-square-caret-left"></i> Go back</button><br><br><input class="styled-checkbox" type="checkbox" id="${extension}input" name="${extension}input" value="true" disabled="true" checked><label for="${extension}input">Is enabled?</label><br><br><br></div>`)

        islib[extension] = true
    } else {
        islib[extension] = false

        if (config.enabled === "true") {
            mainAdditions.push(`<div class="tabcontent" id="${extension}"><h3>${metaname} Options</h3><p>${metadata.des ?? "No provided description!"}</p><button class="button" onclick="openTab('Configuration', 'ConfigurationButton')"><i class="fa-solid fa-square-caret-left"></i> Go back</button><br><br><input class="styled-checkbox" type="checkbox" id="${extension}input" name="${extension}input" value="true" checked><label for="${extension}input">Is enabled?</label><br><br><br></div>`)
        } else {
            mainAdditions.push(`<div class="tabcontent" id="${extension}"><h3>${metaname} Options</h3><p>${metadata.des ?? "No provided description!"}</p><button class="button" onclick="openTab('Configuration', 'ConfigurationButton')"><i class="fa-solid fa-square-caret-left"></i> Go back</button><br><br><input class="styled-checkbox" type="checkbox" id="${extension}input" name="${extension}input" value="true"><label for="${extension}input">Is enabled?</label><br><br><br></div>`)
        }
    }

    if (uicfg !== null) {

        try {
            for (const thing of Object.keys(uicfg)) {
                const information = uicfg[thing]
                if (thing !== "$LIBRARYMETA" && thing !== "$BUTTONS" && thing !== "$UI" && !thing.startsWith("CHNLSEL-") && !thing.startsWith("ROLESEL-")) {
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
                } else if (thing.startsWith("ROLESEL-")) {
                    userCFGS[information.uuid] = {
                        item: information.item,
                        file: information.file,
                        extension: extension,
                        type: "ROLESEL"
                    }
                    var values = ""
                    var chnldt = botInfoCollect
                    for (const guild of Object.values(chnldt)) {
                        var icon = ""
                        if (guild.icon) {
                            icon = `<img src="${guild.icon}">`
                        } else {
                            icon = `<div class="default-guild"><svg width="24px" height="24px" viewBox="0 -28.5 256 256" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" preserveAspectRatio="xMidYMid" fill="currentColor"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M216.856339,16.5966031 C200.285002,8.84328665 182.566144,3.2084988 164.041564,0 C161.766523,4.11318106 159.108624,9.64549908 157.276099,14.0464379 C137.583995,11.0849896 118.072967,11.0849896 98.7430163,14.0464379 C96.9108417,9.64549908 94.1925838,4.11318106 91.8971895,0 C73.3526068,3.2084988 55.6133949,8.86399117 39.0420583,16.6376612 C5.61752293,67.146514 -3.4433191,116.400813 1.08711069,164.955721 C23.2560196,181.510915 44.7403634,191.567697 65.8621325,198.148576 C71.0772151,190.971126 75.7283628,183.341335 79.7352139,175.300261 C72.104019,172.400575 64.7949724,168.822202 57.8887866,164.667963 C59.7209612,163.310589 61.5131304,161.891452 63.2445898,160.431257 C105.36741,180.133187 151.134928,180.133187 192.754523,160.431257 C194.506336,161.891452 196.298154,163.310589 198.110326,164.667963 C191.183787,168.842556 183.854737,172.420929 176.223542,175.320965 C180.230393,183.341335 184.861538,190.991831 190.096624,198.16893 C211.238746,191.588051 232.743023,181.531619 254.911949,164.955721 C260.227747,108.668201 245.831087,59.8662432 216.856339,16.5966031 Z M85.4738752,135.09489 C72.8290281,135.09489 62.4592217,123.290155 62.4592217,108.914901 C62.4592217,94.5396472 72.607595,82.7145587 85.4738752,82.7145587 C98.3405064,82.7145587 108.709962,94.5189427 108.488529,108.914901 C108.508531,123.290155 98.3405064,135.09489 85.4738752,135.09489 Z M170.525237,135.09489 C157.88039,135.09489 147.510584,123.290155 147.510584,108.914901 C147.510584,94.5396472 157.658606,82.7145587 170.525237,82.7145587 C183.391518,82.7145587 193.761324,94.5189427 193.539891,108.914901 C193.539891,123.290155 183.391518,135.09489 170.525237,135.09489 Z" fill="currentColor" fill-rule="nonzero"> </path> </g> </g></svg></div>`
                        }
                        values += `<span class="custom-option disabled-option big-option" data-value="0">${icon}${guild.name}</span>`
                        for (const role of guild.roles) {
                            values += `<span class="custom-option" data-value="${role.id}" data-guildname="${guild.name}"><div class="role-dot" style="--rcolor: ${role.color};"></div>${role.name}</span>`
                        }
                    }
                    arr.push(`<h3>${information.metaname}</h4><div id="${information.uuid}" class="select-wrapper" data-currentval="0">
                    <div class="select">
                    <div class="select__trigger" onclick="this.parentElement.classList.toggle('open')">
                    <span class="force-open">~~Pick a role~~</span>
                    <div class="arrow"></div></div>
                    <div class="custom-options">
                    ${values}
                    </div>
                    </div>
                    </div><br><br>`)
                    var file = requirePro(`../Extensions/${extension}/${information.file}`)
                    defaults[information.uuid] = file[information.item]
                } else if (thing.startsWith("CHNLSEL-")) {
                    userCFGS[information.uuid] = {
                        item: information.item,
                        file: information.file,
                        extension: extension,
                        type: "CHNSEL"
                    }
                    var values = ""
                    var chnldt = botInfoCollect
                    for (const guild of Object.values(chnldt)) {
                        var icon = ""
                        if (guild.icon) {
                            icon = `<img src="${guild.icon}">`
                        } else {
                            icon = `<div class="default-guild"><svg width="24px" height="24px" viewBox="0 -28.5 256 256" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" preserveAspectRatio="xMidYMid" fill="currentColor"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M216.856339,16.5966031 C200.285002,8.84328665 182.566144,3.2084988 164.041564,0 C161.766523,4.11318106 159.108624,9.64549908 157.276099,14.0464379 C137.583995,11.0849896 118.072967,11.0849896 98.7430163,14.0464379 C96.9108417,9.64549908 94.1925838,4.11318106 91.8971895,0 C73.3526068,3.2084988 55.6133949,8.86399117 39.0420583,16.6376612 C5.61752293,67.146514 -3.4433191,116.400813 1.08711069,164.955721 C23.2560196,181.510915 44.7403634,191.567697 65.8621325,198.148576 C71.0772151,190.971126 75.7283628,183.341335 79.7352139,175.300261 C72.104019,172.400575 64.7949724,168.822202 57.8887866,164.667963 C59.7209612,163.310589 61.5131304,161.891452 63.2445898,160.431257 C105.36741,180.133187 151.134928,180.133187 192.754523,160.431257 C194.506336,161.891452 196.298154,163.310589 198.110326,164.667963 C191.183787,168.842556 183.854737,172.420929 176.223542,175.320965 C180.230393,183.341335 184.861538,190.991831 190.096624,198.16893 C211.238746,191.588051 232.743023,181.531619 254.911949,164.955721 C260.227747,108.668201 245.831087,59.8662432 216.856339,16.5966031 Z M85.4738752,135.09489 C72.8290281,135.09489 62.4592217,123.290155 62.4592217,108.914901 C62.4592217,94.5396472 72.607595,82.7145587 85.4738752,82.7145587 C98.3405064,82.7145587 108.709962,94.5189427 108.488529,108.914901 C108.508531,123.290155 98.3405064,135.09489 85.4738752,135.09489 Z M170.525237,135.09489 C157.88039,135.09489 147.510584,123.290155 147.510584,108.914901 C147.510584,94.5396472 157.658606,82.7145587 170.525237,82.7145587 C183.391518,82.7145587 193.761324,94.5189427 193.539891,108.914901 C193.539891,123.290155 183.391518,135.09489 170.525237,135.09489 Z" fill="currentColor" fill-rule="nonzero"> </path> </g> </g></svg></div>`
                        }
                        values += `<span class="custom-option disabled-option big-option" data-value="0">${icon}${guild.name}</span>`
                        for (const channel of guild.channels) {
                            values += `<span class="custom-option" data-value="${channel.id}" data-guildname="${guild.name}">#${channel.name}</span>`
                        }
                    }
                    arr.push(`<h3>${information.metaname}</h4><div id="${information.uuid}" class="select-wrapper" data-currentval="0">
                    <div class="select">
                    <div class="select__trigger" onclick="this.parentElement.classList.toggle('open')">
                    <span class="force-open">~~Pick a channel~~</span>
                    <div class="arrow"></div></div>
                    <div class="custom-options">
                    ${values}
                    </div>
                    </div>
                    </div><br><br>`)
                    var file = requirePro(`../Extensions/${extension}/${information.file}`)
                    defaults[information.uuid] = file[information.item]
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