const fs = require("fs")
const { REST, Routes } = require('discord.js')
const console = require("./consolelogger")
const config = require('../config.json')

async function deploy(guilds) {
    console.logger("Started refreshing all application commands.", "start")
    const commands = []
    const commandFiles = await fs.promises.readdir('./commands/')
    const extensions = await fs.promises.readdir(`../Extensions/`)

    for (var extension of extensions) {
        var cfg = require(`../Extensions/${extension}/config.json`)
        var enabled = cfg.enabled
        if (enabled === "true") {
            var state = "enabled"
        } else {
            var state = "disabled"
        }
        if (state === "enabled") {
            var commandFilesExtension = await fs.promises.readdir(`../Extensions/${extension}/commands/`)
            for (var file of commandFilesExtension) {
                if (!file.endsWith(".command.js")) return
                var command = require(`../Extensions/${extension}/commands/${file}`)
                commands.push(command.data.toJSON())
            }
            var metadata = require(`../Extensions/${extension}/extension.json`)
        }
    };

    for (const file of commandFiles) {
        if (!file.endsWith(".command.js")) return
        const command = require(`./commands/${file}`)
        commands.push(command.data.toJSON())
    }

    const rest = new REST({ version: '10' }).setToken(config.token)

    try {
        guilds.forEach(async guild => {
            await rest.put(
                Routes.applicationGuildCommands(config.clientid, guild.id),
                { body: commands },
            );
        })
        await rest.put(
            Routes.applicationCommands(config.clientid),
            { body: [] },
        );
        console.logger(`Successfully refreshed all application commands.`, "start")
    } catch (error) {
        console.logger(error, "error")
    }
};

module.exports = {
    deploy: deploy
}