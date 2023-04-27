//*
//* Imports
//*

//? ESM imports
import { createRequire } from "module"
import fetch from "node-fetch"
import { fileURLToPath } from "url"

//? CJS imports
const require = createRequire(import.meta.url)
const console = require("./consolelogger")
const fs = require("fs")
const path = require("path")
const {
    Client,
    Collection,
    Events,
    GatewayIntentBits,
    EmbedBuilder,
    ActivityType,
    inlineCode,
    ActionRowBuilder,
    StringSelectMenuBuilder,
} = require("discord.js")
const net = require('net')
const config = require("../config.json")
const command = require("./deploy-commands")
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const clients = {}
const vm = require("vm")

//*
//* Start JSON file storage
//*

//? Read file
var globalStorage = JSON.parse(fs.readFileSync("./main.json", "utf-8"))

//? Save file
function save() {
    fs.writeFileSync("./main.json", JSON.stringify(globalStorage, null, 4))
}

//? Add a server
function addServer(server) {
    globalStorage[server] = {}
    save()
}

//? Add a user in a server
function addUserInServer(server, user) {
    globalStorage[server][user.id] = {}
    save()
}

//? Add a user globally
function addUserGlobally(user) {
    globalStorage["GLOBAL"][user.id] = {}
    save()
}

//? Get data from user in a server
function getUserDataInServer(server, user, thing) {
    return globalStorage[server][user.id][thing]
}

//? Get data from user globally
function getUserDataGlobally(user, thing) {
    return globalStorage["GLOBAL"][user.id][thing]
}

//? Change some data for a user
function changeUserDataInServer(server, user, thing, data) {
    globalStorage[server][user.id][thing] = data
    save()
}

//? Change some data for a user
function changeUserDataGlobally(user, thing, data) {
    globalStorage["GLOBAL"][user.id][thing] = data
    save()
}

function setupUserInServer(server, user) {
    addUserInServer(server, user)
    changeUserDataInServer(server, user, "msgcount", "0")
    changeUserDataInServer(server, user, "username", user.user.tag)
    changeUserDataInServer(server, user, "isbot", String(user.user.bot))
}

function setupUserGlobally(user) {
    addUserGlobally(user)
    changeUserDataGlobally(user, "msgcount", "0")
    changeUserDataGlobally(user, "username", user.user.tag)
    changeUserDataGlobally(user, "isbot", String(user.user.bot))
}

//*
//* Global vars/consts
//*

//? Tag command list for ez tag commands
const tagsList = []

//? Extension tag commands and disabled extensions
const tagCommands = [{
    label: "All Commands",
    description: "All commands known to Crimson",
    value: "allcommands",
    detail: "Placeholder, this statement is unused so eh",
}]
const tagCommandsOrigins = ["Crimson"]
const tagDescriptions = []
const noTags = []
const disabled = []

//*
//* Standard functions
//*

//? Version file, for CrimsonGUI
fs.writeFile("version.txt", "0.2.0", (err) => {
    if (err) console.logger(err, "error")
})

//*
//* Bot set-up
//*

//? New client for Discord.JS and main storage
var client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ],
})

//? When client is ready do some logging and cleaning and setup users
client.once(Events.ClientReady, (c) => {
    client.user.setActivity(`over the server`, { type: ActivityType.Watching })
    client.user.setStatus("online")
    console.logger(
        `The bot is now online! Running bot as ${c.user.tag}`,
        "start"
    )
    command.deploy(client.guilds.cache)
    client.guilds.cache.forEach(guild => {
        if (globalStorage[guild.id] === undefined) {
            addServer(guild.id)
        }
        const Guild = client.guilds.cache.get(guild.id)
        Guild.members.cache.forEach(member => {
            if (globalStorage["GLOBAL"][member.id] === undefined) {
                setupUserGlobally(member)
            }
            if (globalStorage[guild.id][member.id] === undefined) {
                setupUserInServer(guild.id, member)
            }
        })
    })
})

//? Login to client and define some commands
client.login(config.token)
client.commands = new Collection()

//*
//* Extensions
//*

const server = net.createServer((socket) => {
    socket.on('data', (data) => {
        data = data.toString("utf-8")
        const msgs = data.split("ܛ")
        for (data of msgs) {
            data = data.replaceAll("\\u071B", "ܛ")
            if (data.startsWith("SYSMSG")) {
                if (data.startsWith("SYSMSG ID=")) {
                    clients[data.slice(10)] = socket
                }
            } else if (data === undefined) { } else {
                try {
                    var msg = JSON.parse(data)
                    if (msg.type === "addTag") {
                        tagsList.push({
                            tag: msg.info.tag,
                            function: eval(`(${msg.info.function})`)
                        })
                    } else if (msg.type === "sendDataTo") {
                        try {
                            var msgdata = JSON.stringify(msg.info.message)
                        } catch (err) {
                            var msgdata = msg.info.message
                        } finally {
                            clients[msg.info.extension].write("EXMSG " + msgdata)
                        }
                    }
                } catch (err) {
                    if (data !== "") {
                        console.logger("Data was found that was invalid", "warn")
                    }
                }
            }
        }
    })
})

server.on('error', (err) => {
    console.logger(`IPC Error for Extensions: ${err}`, "error")
})

server.listen(3000, () => { })

//? Generate a valid path
function resolvePath(extension, file) {
    return `.\\..\\Extensions\\${extension}\\${file}`
}

//! Read and run extension
//? Run extensions and get tag commands
const commandFiles = fs.readdirSync("./commands/").filter((file) => file.endsWith(".command.js"))
const extensions = fs.readdirSync("../Extensions/")
var allCommands = ""

extensions.forEach((extension) => {
    var cfg = require(`../Extensions/${extension}/config.json`)
    var enabled = cfg.enabled
    if (enabled === "true") {
        var extensionstate = "enabled"
    } else {
        var extensionstate = "disabled"
    }
    var dep = require(`../Extensions/${extension}/extension.json`)
    var dep = dep.dependencies
    if (!extensionstate === "disabled") {
        for (const depe of dep) {
            if (!extensions.includes(depe)) {
                var extensionstate = "disabled"
            }
        }
    }
    if (extensionstate === "enabled") {
        var metadata = require(`../Extensions/${extension}/extension.json`)
        console.logger(
            `Loading ${metadata.name} by ${metadata.authors}...`,
            "start"
        )
        var code = fs.readFileSync(`../Extensions/${extension}/index.js`, "utf8")
        const sandbox = {
            client,
            console,
            fetch,
            fs,
            path,
            require,
            __dirname,
            extension,
            resolvePath: (thing, extension = extension) =>
                resolvePath(extension, thing),
        }
        vm.createContext(sandbox)
        vm.runInContext(`const net = require('net')

const extensionHandler = net.createConnection({ port: 3000 }, () => {
    console.logger('Successfully loaded ${metadata.name}', "start")
})

function sendData(data) {
    extensionHandler.write(data.replaceAll("ܛ", "\\u071B")+"ܛ")
}

sendData("SYSMSG ID=${metadata.id}")

function addTagCommand(tags, callback) {
    sendData(JSON.stringify({
        type: "addTag",
        info: {
            tag: tags,
            function: callback.toString()
        }
    }))
}

function sendDataToExtension(extension, data) {
    sendData(JSON.stringify({
        type: "sendDataTo",
        info: {
            extension: extension,
            message: data
        }
    }))
}`+ code, sandbox)
        const commandFilesExtension = fs
            .readdirSync(`../Extensions/${extension}/commands/`)
            .filter((file) => file.endsWith(".command.js"))
        for (const file of commandFilesExtension) {
            const filePath = path.join(`../Extensions/${extension}/commands/`, file)
            const command = require(filePath)
            if ("data" in command && "execute" in command) {
                client.commands.set(command.data.name, command)
            } else {
                console.logger(
                    `The command at ${filePath} is missing a required "data" or "execute" property.`,
                    "warn"
                )
            }
        }

        try {
            var { tags } = require(`../Extensions/${extension}/tags.js`)
            for (const i of tags) {
                if (i.enabled === "true") {
                    tagCommands.push(i)
                    tagCommandsOrigins.push(metadata.name)
                }
            }
        } catch (err) {
            tagDescriptions.push([
                metadata.name,
                ["This extension has no tag commands.\n"],
            ])
            noTags.push(extension)
        }

        if (!noTags.includes(extension)) {
            tagDescriptions.unshift([metadata.name, []])
        }
    } else {
        disabled.push(extension)
    }
})

for (const tag of tagCommands) {
    var exindex = tagCommands.indexOf(tag)
    var extension = tagCommandsOrigins[exindex]
    for (const des of tagDescriptions) {
        if (des[0] === extension) {
            var index = tagDescriptions.indexOf(des)
            var tempTagDescriptions = tagDescriptions[index]
            var tempTags = tempTagDescriptions[1]
            tempTags.push(tag.label)
            tempTagDescriptions[1] = tempTags
            tagDescriptions[index] = tempTagDescriptions
        }
    }
}

for (const des of tagDescriptions) {
    allCommands = allCommands + `${des[0]}:\n`
    var tags = des[1]
    for (const tag of tags) {
        allCommands = allCommands + inlineCode(tag) + "\n"
    }
    allCommands = allCommands + "\n"
}

for (const file of commandFiles) {
    const command = require(`./commands/${file}`)
    if ("data" in command && "execute" in command) {
        client.commands.set(command.data.name, command)
    } else {
        console.logger(
            `The command at ./commands/${file} is missing a required "data" or "execute" property.`,
            "warn"
        )
    }
}

//*
//* Command execution
//*

//? Handle slash command execution
client.on(Events.InteractionCreate, async (interaction) => {
    if (interaction.isChatInputCommand()) {
        const command = interaction.client.commands.get(interaction.commandName)

        if (!command) {
            console.logger(
                `No command matching ${interaction.commandName} was found.`,
                "error"
            )
            return
        }
        try {
            await command.execute(interaction, client)
        } catch (error) {
            console.logger(error, "error")
            await interaction.reply({
                content:
                    "Uh oh, something went wrong! See the console for more information.",
                ephemeral: true,
            })
        }
    } else if (interaction.isStringSelectMenu()) {
        const row = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
                .setCustomId("commandSelector")
                .setPlaceholder("Nothing")
                .addOptions(tagCommands)
        )

        const selected = interaction.values[0]
        if (selected === "allcommands") {
            const commandEmbed = new EmbedBuilder()
                .setColor(0xffffff)
                .setTitle("Crimson Tag Commands")
                .setDescription(allCommands)
            await interaction.update({ embeds: [commandEmbed], components: [row] })
        } else {
            var success = false
            for (const tag of tagCommands) {
                if (selected === tag.value) {
                    const commandEmbed = new EmbedBuilder()
                        .setColor(0xffffff)
                        .setTitle(`Crimson Tag Commands - ${tag.label}`)
                        .setDescription(tag.detail)
                    await interaction.update({
                        embeds: [commandEmbed],
                        components: [row],
                    })
                    var success = true
                }
            }
            if (success === false) {
                const commandEmbed = new EmbedBuilder()
                    .setColor(0xffffff)
                    .setTitle(`Crimson Tag Commands - Error`)
                    .setDescription(
                        "I was unable to get the information of that tag command, if it's from an extension then the developer likely has not set the tag commands file up properly!"
                    )
                await interaction.update({ embeds: [commandEmbed], components: [row] })
            }
        }
    } else return
})

//? Handle tag command execution
client.on(Events.MessageCreate, async message => {
    try {
        changeUserDataInServer(message.guild.id, message.member, "msgcount", String(Number(getUserDataInServer(message.guild.id, message.member, "msgcount")) + 1))
        changeUserDataGlobally(message.member, "msgcount", String(Number(getUserDataGlobally(message.member, "msgcount")) + 1))
    } catch (err) {
        setupUserInServer(message.guild.id, message.member)
        setupUserGlobally(message.member)
        changeUserDataInServer(message.guild.id, message.member, "msgcount", String(Number(getUserDataInServer(message.guild.id, message.member, "msgcount")) + 1))
        changeUserDataGlobally(message.member, "msgcount", String(Number(getUserDataGlobally(message.member, "msgcount")) + 1))
    }
    for (const i of tagsList) {
        if (i.tag instanceof Array) {
            for (const j of i.tag) {
                if (message.toString().startsWith(j + " ")) {
                    i.function(message, i.tag.indexOf(j))
                }
            }
        }
        if (message.toString().startsWith(i.tag + " ")) {
            i.function(message)
        }
    }
})

//*
//* Misc
//*

//? Handle GUI calls
if (process.argv.includes("--gui")) {
    process.stdin.on("data", (data) => {
        var message = JSON.parse(data.toString().trim())
        if (message.type === "END") {
            client.user.setStatus("invisible")
            process.exit()
        } else if (message.type === "RC") {
            command.deploy(client.guilds.cache)
        }
    })
}

//? Make bot go invisible as soon as the bot is shut down
process.on("exit", function () {
    client.user.setStatus("invisible")
})