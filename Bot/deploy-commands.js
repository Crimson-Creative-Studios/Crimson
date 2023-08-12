const fs = require("fs")
const { REST, Routes } = require('discord.js')
const console = require("./consolelogger")
const config = require('../config.json')

async function deploy(guilds) {
    try {
        console.start("Started refreshing all application commands.")
        const commands = []
        var commandFiles = null
        try {
            commandFiles = await fs.promises.readdir('./commands/')
        } catch (err) {
            commandFiles = []
        }
        var extensions = null
        try {
            extensions = await fs.promises.readdir(`../Extensions/`)
        } catch (err) {
            extensions = []
        }

        for (var extension of extensions) {
            const cfg = require(`../Extensions/${extension}/config.json`)
            const metadata = require(`../Extensions/${extension}/extension.json`)
            if (cfg.enabled === "true") {
                var state = "enabled"
            } else {
                var state = "disabled"
            }
            if (state === "enabled") {
                try {
                    const commandFilesExtension = await fs.promises.readdir(`../Extensions/${extension}/triggers/commands/`)
                    for (const file of commandFilesExtension) {
                        if (file.endsWith(".js")) {
                            const command = require(`../Extensions/${extension}/triggers/commands/${file}`)
                            try {
                                commands.push(command.data.toJSON())
                            } catch (err) {
                                if (command.name) {
                                    commands.push(JSON.stringify(command))
                                }
                            }
                        }
                    }
                } catch (err) {
                    console.start(`${metadata.name} has no application commands.`)
                }
            }
        }

        for (const file of commandFiles) {
            if (!file.endsWith(".js")) return
            const command = require(`./commands/${file}`)
            commands.push(command.data.toJSON())
        }

        const rest = new REST({ version: '10' }).setToken(config.token)

        const tokenparts = config.token.split(".")
        const buffer = Buffer.from(tokenparts[0], "base64")
        const clientid = buffer.toString()

        try {
            guilds.forEach(async guild => {
                await rest.put(
                    Routes.applicationGuildCommands(clientid, guild.id),
                    { body: commands },
                )
            })
            console.start(`Successfully refreshed all application commands.`)
            return true
        } catch (err) {
            console.err(err)
            return false
        }
    } catch (err) {
        console.err(err)
    }
}

module.exports = {
    deploy: deploy
}