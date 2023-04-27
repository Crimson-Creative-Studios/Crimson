const { app, BrowserWindow, ipcMain, nativeTheme, globalShortcut } = require('electron')
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
const JSZip = require('jszip')
var globalBot, consolewin
var isMax = false

const downloadAndUnzip = async (zipUrl, unzipPath) => {
    const response = await axios.get(zipUrl, { responseType: 'arraybuffer' })
    const zip = await JSZip.loadAsync(response.data)
    await Promise.all(Object.keys(zip.files).map(async (fileName) => {
        const content = await zip.files[fileName].async('nodebuffer')
        const filePath = path.join(unzipPath, fileName)
        fs.mkdirSync(path.dirname(filePath), { recursive: true })
        fs.writeFileSync(filePath, content)
    }))
}

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
    try {
        json = JSON.parse(jsonString)
    } catch (err) {
        console.log(`Error setting "${value}" in "${file}", the file is not a valid JSON file.`)
    }
    for (const i of value) {
        json[value[i]] = data[i]
    }
    fs.writeFileSync(file, JSON.stringify(json, null, 4))
    return json
}

function consoleWindow() {
    const console = new BrowserWindow({
        width: 800,
        height: 800,
        minWidth: 800,
        minHeight: 800,
        frame: false,
        icon: __dirname + '/guiassets/crimsonsimplelogo.ico',
        webPreferences: {
            preload: path.join(__dirname, 'consolepreload.js'),
        },
        show: false,
    })
    console.once('ready-to-show', () => {
        console.show()
    })
    console.loadFile(path.join(__dirname, 'console.html'))
    console.setMenuBarVisibility(false)
    console.webContents.setZoomFactor(1.0)
    return console
}

function createWindow() {
    if (nativeTheme.shouldUseDarkColors) {
        var color = '#2f3136'
    } else {
        var color = '#F6F8FF'
    }
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        minWidth: 800,
        minHeight: 450,
        frame: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            devTools: true
        },
        icon: __dirname + '/guiassets/crimsonsimplelogolarge.ico',
        backgroundColor: color,
    })

    win.once('ready-to-show', async () => {
        var data = await axios.get("https://github.com/SkyoProductions/crimson/raw/main/src/guiver.txt")
        win.webContents.send("verfind", data.data)
    })

    win.webContents.on('did-start-loading', async () => {
        var data = await axios.get("https://github.com/SkyoProductions/crimson/raw/main/src/guiver.txt")
        win.webContents.send("verfind", data.data)
        if (isMax) {
            win.webContents.send("wincontroler", "max")
        }
    })

    ipcMain.on('getDir', (event, arg) => {
        event.returnValue = fs.readdirSync(arg)
    })

    win.on('maximize', () => {
        win.webContents.send("wincontroler", "max")
        isMax = true
    })

    win.on('unmaximize', () => {
        win.webContents.send("wincontroler", "unmax")
        isMax = false
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

    ipcMain.on('require', (event, arg) => {
        if (arg.startsWith("./") && arg.endsWith(".json")) {
            event.returnValue = require(arg)
        } else if (arg.startsWith("../") && arg.endsWith(".json")) {
            try {
                var thing = require(arg)
                event.returnValue = thing
            } catch (err) {
                event.returnValue = null
            }
        } else {
            event.returnValue = "Must be a JSON file"
        }
    })

    ipcMain.handle('onlineRequest', (event, arg) => {
        event.returnValue = axios.get(arg.link, { responseType: arg.type })
    })

    ipcMain.handle('jsonRequest', async (event, arg) => {
        if (arg[0] === "setVal") {
            var result = await setValueJSON(arg[1], arg[2], arg[3])
        } else if (arg[0] === "setValBulk") {
            var result = await setValueJSONBulk(arg[1], arg[2], arg[3])
        } else if (arg[0] === "getVal") {
            if (arg[3] === "speed") {
                var json = require(arg[1])
                var result = json[arg[2]]
            } else {
                var result = await getValueJSON(arg[1], arg[2])
            }
        } else if (arg[0] === "getJSON") {
            if (arg[3] === "speed") {
                var result = require(arg[1])
            } else {
                var result = await getJSON(arg[1])
            }
        }
        event.returnValue = result
    })

    ipcMain.handle('extensionDownload', (event, arg) => {
        downloadAndUnzip(arg, "../Extensions")
    })

    ipcMain.handle('siteopen', (event, arg) => {
        require('electron').shell.openExternal(arg)
    })

    ipcMain.handle('getEnv', (event, arg) => {
        try {
            var env = require("../config.json")
            console.log(env)
        } catch (err) {
            var env = {
                token: "",
                clientid: "",
                adminname: "",
            }
        }

        event.returnValue = env
    })

    ipcMain.handle('putEnv', async (event, arg) => {
        var data = JSON.stringify(arg, null, 4)
        fs.writeFileSync("../config.json", data)
    })

    win.loadFile(path.join(__dirname, 'index.html'))
    win.setMenuBarVisibility(false)
    win.webContents.setZoomFactor(1.0)

    ipcMain.handle('clientChange', (event, args) => {
        var status = {
            details: args[0],
            largeImageKey: args[1],
            instance: true
        }
        client.updatePresence(status)
    })

    ipcMain.handle('dark-mode:toggle', () => {
        if (nativeTheme.shouldUseDarkColors) {
            nativeTheme.themeSource = 'light'
        } else {
            nativeTheme.themeSource = 'dark'
        }
        return nativeTheme.shouldUseDarkColors
    })

    ipcMain.handle('dark-mode:get', () => {
        return nativeTheme.shouldUseDarkColors
    })

    ipcMain.handle('dark-mode:system', () => {
        nativeTheme.themeSource = 'system'
        return nativeTheme.shouldUseDarkColors
    })

    ipcMain.on('message', (event, data) => {
        console.log('Received message:', data)
    })

    ipcMain.handle('saveState', (event, data) => {
        currentTab = data[0]
        currentOverride = data[1]
    })

    win.webContents.on('did-finish-load', () => {
        fs.readFile('../Bot/version.txt', 'utf8', function (err, data) {
            if (err) { data = "No Version File Found" }
            win.webContents.executeJavaScript(`document.getElementById("botver").innerHTML = "Bot Version - ${data}";0`)
        })
    })
    return win
}

app.whenReady().then(async () => {
    globalShortcut.register('CommandOrControl+D+M', () => {
        win.webContents.send("dark-mode:change", null)
    })
    var win = createWindow()
    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

process.on('uncaughtException', function (err) {
    console.log(err)
})

app.on('will-quit', () => {
    globalShortcut.unregisterAll()
})

ipcMain.handle('OpenConsole', (event, args) => {
    consolewin = consoleWindow()

    consolewin.on("closed", () => {
        try {
            globalBot.stdin.write(JSON.stringify({ type: 'END' }) + '\n')
        } catch (err) { }
    })
})

ipcMain.handle('BotStart', (event, arg) => {
    console.log("Bot Started")
    globalBot = spawn('node', [__dirname + '\\..\\Bot\\index.mjs', "--gui"], { cwd: '..\\Bot', shell: true, stdio: ['pipe', 'pipe', 'pipe', 'ipc'] })
    globalBot.stdout.setEncoding('utf8')
    globalBot.stdout.on('data', (data) => {
        if (data === 'STPSCD') {
            consolewin.webContents.send('STP')
        } else if (data.startsWith("prompt:")) { } else {
            consolewin.webContents.send('botstdout', data)
        }
    })
    globalBot.stderr.setEncoding('utf8')
    globalBot.stderr.on('data', (data) => {
        consolewin.webContents.send('botstdout', data)
        try {
            globalBot.stdin.write(JSON.stringify({ type: 'END' }) + '\n')
        } finally {
            try {
                consolewin.webContents.send('STP')
            } catch (err) { }
        }
    })
    globalBot.stdin.setEncoding('utf-8')
})

ipcMain.handle('BotStop', (event, arg) => {
    globalBot.stdin.write(JSON.stringify({ type: 'END' }) + '\n')
    consolewin.webContents.send('STP')
})

ipcMain.handle('BotRC', (event, arg) => {
    globalBot.stdin.write(JSON.stringify({ type: 'RC' }) + '\n')
})

process.on('exit', function () {
    try {
        globalBot.stdin.write(JSON.stringify({ type: 'END' }) + '\n')
    } catch (err) { }
})