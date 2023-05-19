const fs = require("fs")
const { REST, Routes } = require('discord.js')
const console = require("./consolelogger")
const config = require('../config.json')

async function deploy(guilds) {
    try {
        console.logger("Started refreshing all application commands.", "start")
        const commands = []
        const commandFiles = await fs.promises.readdir('./commands/')
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
                    var commandFilesExtension = await fs.promises.readdir(`../Extensions/${extension}/triggers/commands/`)
                    for (var file of commandFilesExtension) {
                        if (file.endsWith(".js")) {
                            var command = require(`../Extensions/${extension}/triggers/commands/${file}`)
                            try {
                                commands.push(command.data.toJSON())
                            } catch(err) {
                                commands.push(command.data)
                            }
                        }
                    }
                } catch (err) {
                    console.logger(`${metadata.name} has no application commands.`, "start")
                }
            }
        }

        for (const file of commandFiles) {
            if (!file.endsWith(".js")) return
            const command = require(`./commands/${file}`)
            commands.push(command.data.toJSON())
        }

        const rest = new REST({ version: '10' }).setToken(config.token)

        try {
            guilds.forEach(async guild => {
                await rest.put(
                    Routes.applicationGuildCommands(config.clientid, guild.id),
                    { body: commands },
                )
            })
            console.logger(`Successfully refreshed all application commands.`, "start")
            return true
        } catch (err) {
            console.logger(err, "error")
            return false
        }
    } catch (err) {
        console.logger(err, "error")
    }
}

module.exports = {
    deploy: deploy
}