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
const { Player } = require('discord-player')

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
fs.writeFile("version.txt", "0.7.5", (err) => {
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
        GatewayIntentBits.GuildVoiceStates
    ],
})

var player = new Player(client)

player.on('connectionCreate', (queue) => {
    queue.connection.voiceConnection.on('stateChange', (oldState, newState) => {
        const oldNetworking = Reflect.get(oldState, 'networking')
        const newNetworking = Reflect.get(newState, 'networking')

        const networkStateChangeHandler = (oldNetworkState, newNetworkState) => {
            const newUdp = Reflect.get(newNetworkState, 'udp')
            clearInterval(newUdp?.keepAliveInterval)
        }

        oldNetworking?.off('stateChange', networkStateChangeHandler)
        newNetworking?.on('stateChange', networkStateChangeHandler)
    })
})

//? When client is ready do some logging and cleaning and setup users
client.once(Events.ClientReady, async (c) => {
    client.user.setActivity(`over the server`, { type: ActivityType.Watching })
    client.user.setStatus("online")
    console.logger(
        `The bot is now online! Running bot as ${c.user.tag}`,
        "start"
    )
    command.deploy(client.guilds.cache)
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
const commandFiles = fs.readdirSync("./commands/").filter((file) => file.endsWith(".js"))
var extensions = null
try {
    extensions = fs.readdirSync("../Extensions/")
} catch (err) {
    extensions = []
}
var allCommands = ""
const actsas = []

for (const extension of extensions) {
    for (const thing of require(`../Extensions/${extension}/extension.json`).actsas) {
        actsas.push(thing)
    }
}

extensions.forEach((extension) => {
    var cfg = require(`../Extensions/${extension}/config.json`)
    var enabled = cfg.enabled
    if (enabled === "true") {
        var extensionstate = "enabled"
    } else {
        var extensionstate = "disabled"
    }
    var metadata = require(`../Extensions/${extension}/extension.json`)
    var dep = metadata.dependencies
    if (!extensionstate === "disabled") {
        for (const depe of dep) {
            if (!extensions.includes(depe) && !actsas.includes(depe)) {
                var extensionstate = "disabled"
            }
        }
    }
    if (extensionstate === "enabled") {
        console.logger(
            `Loading ${metadata.name} by ${metadata.authors}...`,
            "start"
        )
        try {
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
                resolvePath: (thing, ext = extension) =>
                    resolvePath(ext, thing),
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
        } catch (err) {
            console.logger(`${metadata.name} has no index.js file`, "warn")
        }
        var commandFilesExtension = null
        var workflows = null
        try {
            commandFilesExtension = fs
                .readdirSync(`../Extensions/${extension}/triggers/commands/`)
                .filter((file) => file.endsWith(".js"))
        } catch (err) {
            commandFilesExtension = []
        }

        try {
            workflows = fs.readdirSync(`../Extensions/${extension}/triggers/workflows/`).filter((file) => file.endsWith(".json"))
        } catch (err) {
            workflows = []
        }

        for (const file of commandFilesExtension) {
            const filePath = path.join(`../Extensions/${extension}/triggers/commands/`, file)
            const command = require(filePath)
            if ("execute" in command) {
                try {
                    client.commands.set(command.data.name, command)
                } catch(err) {
                    client.commands.set(command.name, command)
                }
            } else {
                console.logger(
                    `The command at ${filePath} is missing a required "execute" property.`,
                    "warn"
                )
            }
        }

        for (const workflow of workflows) {
            const filePath = path.join(`../Extensions/${extension}/triggers/workflows/`, workflow)
            const context = {
                client,
                require
            }
            const data = require(filePath)
            var filebuilder = "const { Events, EmbedBuilder } = require('discord.js')\n"

            if (data.type === "message") {
                filebuilder += "client.on(Events.MessageCreate, async message => {\n"
                var ifstring = []

                if (data.requirements.startsWith) {
                    var thing = data.requirements.startsWith
                    var start = "!message.toString()"
                    if (data.requirements.caseSensitive === "false") {
                        start += ".toLowerCase()"
                        thing = thing.toLowerCase()
                    }
                    start += `.startsWith("${thing}")`
                    ifstring.push(start)
                }

                if (data.requirements.contains) {
                    for (var thing of data.requirements.contains) {
                        var start = "!message.toString()"
                        if (data.requirements.caseSensitive === "false") {
                            start += ".toLowerCase()"
                            thing = thing.toLowerCase()
                        }
                        start += `.includes("${thing}")`
                        ifstring.push(start)
                    }
                }

                if (data.requirements.endsWith) {
                    var thing = data.requirements.endsWith
                    var start = "!message.toString()"
                    if (data.requirements.caseSensitive === "false") {
                        start += ".toLowerCase()"
                        thing = thing.toLowerCase()
                    }
                    start += `.endsWith("${thing}")`
                    ifstring.push(start)
                }

                filebuilder += `    if(${ifstring.join(" || ")}) {return false} else {\n`

                if (data.actions.react) {
                    filebuilder += `        message.react('${data.actions.react}')\n`
                }

                if (data.actions.reply) {
                    filebuilder += `    message.reply(\`${data.actions.reply.content.replaceAll("${user}", "<@${member.user.id}>")}\`)\n`
                }

                if (data.actions.embed) {
                    filebuilder += `    const embed = new EmbedBuilder()`

                    if (data.actions.embed.title) {
                        filebuilder += `.setTitle(\`${data.actions.embed.title.replaceAll("${user}", "<@${member.user.id}>")}\`)`
                    }

                    if (data.actions.embed.content) {
                        filebuilder += `.setDescription(\`${data.actions.embed.content.replaceAll("${user}", "<@${member.user.id}>")}\`)`
                    }

                    if (data.actions.embed.color) {
                        filebuilder += `.setColor('${data.actions.embed.color}')`
                    }

                    filebuilder += `\n    client.channels.cache.find(channel => channel.name === "${data.actions.embed.channel}" && member.guild.id === channel.guild.id).send({ embeds: [embed]})\n`
                }

                filebuilder += "    }\n})"
            } else if (data.type === "memberAdd") {
                filebuilder += "client.on(Events.GuildMemberAdd, async member => {\n"

                if (data.actions.message) {
                    filebuilder += `    client.channels.cache.find(channel => channel.name === "${data.actions.message.channel}" && member.guild.id === channel.guild.id).send(\`${data.actions.message.content.replaceAll("${user}", "<@${member.user.id}>")}\`)\n`
                }

                if (data.actions.embed) {
                    filebuilder += `    const embed = new EmbedBuilder()`

                    if (data.actions.embed.title) {
                        filebuilder += `.setTitle(\`${data.actions.embed.title.replaceAll("${user}", "<@${member.user.id}>")}\`)`
                    }

                    if (data.actions.embed.content) {
                        filebuilder += `.setDescription(\`${data.actions.embed.content.replaceAll("${user}", "<@${member.user.id}>")}\`)`
                    }

                    if (data.actions.embed.color) {
                        filebuilder += `.setColor('${data.actions.embed.color}')`
                    }

                    filebuilder += `\n    client.channels.cache.find(channel => channel.name === "${data.actions.embed.channel}" && member.guild.id === channel.guild.id).send({ embeds: [embed]})\n`
                }

                filebuilder += "})"
            }

            vm.createContext(context)

            try {
                vm.runInContext(filebuilder, context)
            } catch (err) {
                console.logger(`Failed to run workflow from ${extension}, file "${workflow}" may have errors!`, "error")
                console.logger(err, "error")
            }
        }

        try {
            var tags = require(`../Extensions/${extension}/tags.json`)
            for (var j of Object.keys(tags)) {
                var i = tags[j]
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
            client.user.setPresence({ activities: [{ name: 'the offline game' }], status: 'dnd' })
            process.exit()
        } else if (message.type === "RC") {
            command.deploy(client.guilds.cache)
        }
    })
}

//? Make bot go invisible as soon as the bot is shut down
process.on("exit", function () {
    client.user.setPresence({ activities: [{ name: 'the offline game' }], status: 'dnd' })
})