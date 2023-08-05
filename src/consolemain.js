const { app, BrowserWindow, ipcMain, globalShortcut } = require('electron')
const { Client, GatewayIntentBits, Events, TextChannel, Role } = require("discord.js")
const { spawn } = require('child_process')
const client = require('discord-rich-presence')('1056199295168159814')
client.updatePresence({
    details: 'Currently in the Bot menu',
    largeImageKey: 'bigimg',
    instance: true,
})
const path = require('path')
const fs = require('fs')
const axios = require('axios')

function generateUUID() {
    var d = new Date().getTime()
    var d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now() * 1000)) || 0
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        var r = Math.random() * 16
        if (d > 0) {
            r = (d + r) % 16 | 0
            d = Math.floor(d / 16)
        } else {
            r = (d2 + r) % 16 | 0
            d2 = Math.floor(d2 / 16)
        }
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
    })
}

const uuid = generateUUID()

var globalBot, consolewin, win
var conIsMax = false

async function getValueJSON(file, value) {
    var json = null
    var val = null
    var jsonString = await fs.promises.readFile(file, 'utf8')
    try {
        json = JSON.parse(jsonString)
    } catch (err) {
        console.log(`Error getting "${value}" from "${file}", the file is not a valid JSON file.`)
    }
    try {
        val = json[value]
    } catch (err) {
        console.log(`Error getting "${value}" from "${file}", that value does not exist in the JSON file.`)
    }
    return val
}

async function getJSON(file) {
    var json = null
    var jsonString = await fs.promises.readFile(file, 'utf8')
    try {
        json = JSON.parse(jsonString)
    } catch (err) {
        console.log(`Error getting "${file}", the file is not a valid JSON file.`)
    }
    return json
}

async function setValueJSON(file, value, data) {
    var json = null
    var jsonString = await fs.promises.readFile(file, 'utf8')
    try {
        json = JSON.parse(jsonString)
    } catch (err) {
        console.log(`Error setting "${value}" in "${file}", the file is not a valid JSON file.`)
    }
    json[value] = data
    fs.writeFileSync(file, JSON.stringify(json, null, 4))
    return json
}

async function setValueJSONBulk(file, value, data) {
    var json = null
    var jsonString = fs.readFileSync(file, 'utf8')
    json = JSON.parse(jsonString)
    var index = 0
    for (const i of value) {
        json[value[index]] = data[index]
        index++
    }
    fs.writeFileSync(file, JSON.stringify(json, null, 4))
    return json
}

function consoleWindow() {
    const console = new BrowserWindow({
        width: 1000,
        height: 1000,
        minWidth: 800,
        minHeight: 800,
        frame: false,
        icon: __dirname + '/guiassets/crimsonsimplelogo.ico',
        webPreferences: {
            preload: path.join(__dirname, 'consolepreload.js'),
        },
        show: false,
        backgroundColor: "#2f3136"
    })
    console.once('ready-to-show', () => {
        console.show()
    })

    console.webContents.on('did-start-loading', async () => {
        if (conIsMax) {
            console.webContents.send("wincontroler", "max")
        }
        try {
            globalBot.stdin.write(JSON.stringify({ type: 'END' }) + '\n')
        } catch(err) { }
    })

    console.on('maximize', () => {
        console.webContents.send("wincontroler", "max")
        conIsMax = true
    })

    console.on('unmaximize', () => {
        console.webContents.send("wincontroler", "unmax")
        conIsMax = false
    })

    console.loadFile(path.join(__dirname, 'console.html'))
    console.setMenuBarVisibility(false)
    console.webContents.setZoomFactor(1.0)
    return console
}

ipcMain.on('showWin', (event, arg) => {
    try {
        consolewin.show()
    } catch(err) { }
})

ipcMain.on('getFile', (event, arg) => {
    event.returnValue = fs.readFileSync(arg, "utf-8")
})

ipcMain.on('infoGrab', async (event, arg) => {
    const onlineVersion = await axios.get("https://github.com/Crimson-Creative-Studios/Crimson/raw/main/src/version.txt")
    const themes = await fs.promises.readdir("./themes")
    event.returnValue = {
        onlineVersion: onlineVersion.data,
        uuid: uuid,
        themes: themes
    }
})

ipcMain.on('require', (event, arg) => {
    if (arg.endsWith(".json")) {
        try {
            var thing = require(arg)
            event.returnValue = thing
        } catch (err) {
            event.returnValue = err
        }
    } else {
        event.returnValue = "Must be a JSON file"
    }
})

ipcMain.handle('onlineRequest', (event, arg) => {
    event.returnValue = axios.get(arg.link, { responseType: arg.type })
})

ipcMain.handle('jsonRequest', async (event, arg) => {
    var result
    if (arg[0] === "setVal") {
        result = await setValueJSON(arg[1], arg[2], arg[3])
    } else if (arg[0] === "setValBulk") {
        try {
            result = await setValueJSONBulk(arg[1], arg[2], arg[3])
        } catch (err) {
            result = err
        }
    } else if (arg[0] === "setValBulkNotStyle") {
        try {
            result = await setValueJSONBulk(arg[1], arg[2], arg[3])
            win.webContents.send("notificationSend", ["savedModal", 5000, 3000])
        } catch (err) {
            win.webContents.send("notificationSend", ["saveFailModal", 5000, 3000])
        }
    } else if (arg[0] === "getVal") {
        if (arg[3] === "speed") {
            var json = require(arg[1])
            result = json[arg[2]]
        } else {
            result = await getValueJSON(arg[1], arg[2])
        }
    } else if (arg[0] === "getJSON") {
        if (arg[3] === "speed") {
            result = require(arg[1])
        } else {
            result = await getJSON(arg[1])
        }
    } else if (arg[0] === "setJSON") {
        fs.writeFileSync(arg[1], arg[2])
    } else if (arg[0] === "setJSONNotStyle") {
        try {
            fs.writeFileSync(arg[1], arg[2])
            win.webContents.send("notificationSend", ["savedModal", 5000, 3000])
        } catch (err) {
            win.webContents.send("notificationSend", ["saveFailModal", 5000, 3000])
        }
    }
    event.returnValue = result
})

ipcMain.on('wincontrol', (event, arg) => {
    if (arg.startsWith("con")) {
        arg = arg.slice(3)
        if (arg === "min") {
            consolewin.minimize()
        } else if (arg === "close") {
            consolewin.close()
        } else if (arg === "max") {
            consolewin.maximize()
        } else if (arg === "unmax") {
            consolewin.unmaximize()
        } else {
            console.log("Invalid wincontrol sent")
        }
    } else {
        if (arg === "min") {
            win.minimize()
        } else if (arg === "close") {
            win.close()
        } else if (arg === "max") {
            win.maximize()
        } else if (arg === "unmax") {
            win.unmaximize()
        } else {
            console.log("Invalid wincontrol sent")
        }
    }
})

app.whenReady().then(async () => {
    consolewin = consoleWindow()

    consolewin.loadFile(path.join(__dirname, 'loading.html'))
    setTimeout(() => consolewin.loadFile(path.join(__dirname, 'console.html')), 4000)
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            consoleWindow()
        }
    })

    consolewin.on("closed", () => {
        try {
            globalBot.stdin.write(JSON.stringify({ type: 'END' }) + '\n')
        } catch (err) { }
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

process.on('uncaughtException', (err) => {
    console.log(err)
})

app.on('will-quit', () => {
    globalShortcut.unregisterAll()
})

ipcMain.handle('sendThemeData', (event, arg) => {
    try {
        consolewin.webContents.send("winguicfg", arg)
        consolewin.webContents.on('did-finish-load', () => {
            consolewin.webContents.send("winguicfg", arg)
        })
    } catch (err) { }
})

function replaceColorCode(text) {
    const colors = ["[30m", "[31m", "[32m", "[33m", "[34m", "[35m", "[36m", "[37m", "[38m", "[90m", "[0m"]
    const replacers = ['<span class="console-text console-text-black">', '<span class="console-text console-text-red">', '<span class="console-text console-text-green">',
                       '<span class="console-text console-text-yellow">', '<span class="console-text console-text-blue">', '<span class="console-text console-text-magenta">',
                       '<span class="console-text console-text-cyan">', '<span class="console-text console-text-white">', '<span class="console-text console-text-crimson">',
                       '<span class="console-text console-text-grey">', '</span>']
    var txt = text
    for (const i in colors) {
        txt = txt.replaceAll(colors[i], replacers[i])
    }
    return txt
}

ipcMain.handle('BotStart', (event, arg) => {
    globalBot = spawn('node', [path.resolve('..', 'Bot', 'index.mjs'), "--gui"], { cwd: '../Bot', shell: true, stdio: ['pipe', 'pipe', 'pipe', 'ipc'] })
    globalBot.stdout.setEncoding('utf8')
    globalBot.stdout.on('data', (data) => {
        if (data === 'STPSCD') {
            consolewin.webContents.send('STP')
        } else if (data.startsWith("prompt:")) { } else {
            consolewin.webContents.send('botstdout', replaceColorCode(data.replaceAll("\n", "<br>")))
        }
    })
    globalBot.stderr.setEncoding('utf8')
    globalBot.stderr.on('data', (data) => {
        consolewin.webContents.send('botstdout', data)
    })
    globalBot.stdin.setEncoding('utf-8')
    globalBot.on("exit", () => {
        consolewin.webContents.send('STP')
    })
})

ipcMain.handle('BotStop', (event, arg) => {
    globalBot.stdin.write(JSON.stringify({ type: 'END' }) + '\n')
})

ipcMain.handle('BotRC', (event, arg) => {
    globalBot.stdin.write(JSON.stringify({ type: 'RC' }) + '\n')
})

process.on('exit', () => {
    try {
        globalBot.stdin.write(JSON.stringify({ type: 'END' }) + '\n')
    } catch (err) { }
})