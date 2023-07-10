const { app, BrowserWindow, ipcMain, globalShortcut } = require('electron')
const { Client, GatewayIntentBits, Events, TextChannel } = require("discord.js")
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
const net = require('net')
const { downloadAndUnzip } = require("../sharedResources/downloadExtension")

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
var isMax = false

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
        backgroundColor: "#2f3136"
    })
    console.once('ready-to-show', () => {
        console.show()
    })

    console.on('maximize', () => {
        console.webContents.send("wincontroler", "max")
        isMax = true
    })

    console.on('unmaximize', () => {
        console.webContents.send("wincontroler", "unmax")
        isMax = false
    })

    console.loadFile(path.join(__dirname, 'console.html'))
    console.setMenuBarVisibility(false)
    console.webContents.setZoomFactor(1.0)
    return console
}

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        minWidth: 800,
        minHeight: 450,
        frame: false,
        show: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            devTools: true
        },
        icon: __dirname + '/guiassets/crimsonsimplelogolarge.ico',
        backgroundColor: "#2f3136",
    })

    win.webContents.on('did-start-loading', async () => {
        delete require.cache[require.resolve('../config.json')]
        delete require.cache[require.resolve('./guicfg.json')]
        fs.readdirSync("../Extensions").forEach(extension => {
            try {
                delete require.cache[require.resolve(`../Extensions/${extension}/uiconfig.json`)]
            } catch (err) { }
            try {
                delete require.cache[require.resolve(`../Extensions/${extension}/extension.json`)]
            } catch (err) { }
            try {
                delete require.cache[require.resolve(`../Extensions/${extension}/config.json`)]
            } catch (err) { }
        })
        if (isMax) {
            win.webContents.send("wincontroler", "max")
        }
    })

    ipcMain.handle('showWin', (event, arg) => {
        if (arg === "main") {
            try {
                win.show()
            } catch (err) { }
        } else if (arg === "cnsl") {
            try {
                consolewin.show()
            } catch (err) { }
        }
    })

    ipcMain.on('getDir', (event, arg) => {
        try {
            event.returnValue = fs.readdirSync(arg)
        } catch (err) {
            event.returnValue = []
        }
    })

    ipcMain.on('channelCollect', (event, arg) => {
        const bot = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent,
                GatewayIntentBits.GuildMembers,
                GatewayIntentBits.GuildVoiceStates
            ],
        })
        bot.once(Events.ClientReady, async (c) => {
            bot.user.setActivity(`for channels`, { type: ActivityType.Watching })
            bot.user.setStatus("idle")
            const data = {}
            const allchannels = bot.guilds.channels
            for (const channel of allchannels.values()) {
                if (channel instanceof TextChannel) {
                    if (data[channel.guild.id] === undefined) {
                        data[channel.guild.id] = {
                            channels: [],
                            icon: channel.guild.iconURL(),
                            name: channel.guild.name
                        }
                    }
                    data[channel.guild.id].channels.push({
                        id: channel.id,
                        name: channel.name
                    })
                }
            }
            event.returnValue = data
        })
        bot.on(Events.InteractionCreate, async (interaction) => {
            try {
                await interaction.reply("The bot is currently fetching channels and is not online")
            } catch(err) {}
        })
        const {token} = require("../config.json")
        bot.login(token)
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

    ipcMain.handle('extensionDownload', (event, arg) => {
        try {
            downloadAndUnzip(arg, "../Extensions")
            win.webContents.send("notificationSend", ["downloadedModal", 5000, 2000])
        } catch (err) {
            win.webContents.send("notificationSend", ["downloadFailModal", 5000, 2000])
        }
    })

    ipcMain.handle('siteopen', (event, arg) => {
        require('electron').shell.openExternal(arg)
    })

    ipcMain.handle('getEnv', (event, arg) => {
        try {
            var env = require("../config.json")
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
        try {
            await fs.promises.writeFile("../config.json", JSON.stringify(arg, null, 4))
            win.webContents.send("notificationSend", ["savedModal", 5000, 2000])
        } catch (err) {
            console.log(err)
            win.webContents.send("notificationSend", ["saveFailModal", 5000, 2000])
        }
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

    ipcMain.on('message', (event, data) => {
        console.log('Received message:', data)
    })

    ipcMain.handle('saveState', (event, data) => {
        currentTab = data[0]
        currentOverride = data[1]
    })
    return win
}

function evalInContext(js, context) {
    return function () {
        return eval(js)
    }.call(context)
}

app.whenReady().then(async () => {
    win = createWindow()

    const server = net.createServer((socket) => {
        socket.on('data', (message) => {
            const messagestr = message.toString()
            const msgs = messagestr.split("ܛ")
            for (const msg of msgs) {
                if (msg !== "") {
                    if (msg.startsWith(uuid)) {
                        const info = msg.slice(uuid.length)
                        evalInContext(info, { win })
                    }
                }
            }
        })
    })
    server.listen(2845, '127.0.0.1')
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })

    win.on("closed", () => {
        try {
            consolewin.close()
        } catch (err) { }

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

ipcMain.handle('OpenConsole', async (event, args) => {
    consolewin = consoleWindow()
    win.webContents.send("grabThemeData", null)

    consolewin.webContents.on('did-start-loading', async () => {
        win.webContents.send("grabThemeData", null)
    })

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
            consolewin.webContents.send('botstdout', data.replaceAll("\n", "<br>"))
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

process.on('exit', () => {
    try {
        globalBot.stdin.write(JSON.stringify({ type: 'END' }) + '\n')
    } catch (err) { }
})