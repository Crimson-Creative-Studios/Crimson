//
// Imports
//

//ESM imports
import { createRequire } from "module"
import fetch from 'node-fetch'
import { fileURLToPath } from 'url'

//CJS imports
const require = createRequire(import.meta.url)
const console = require('./consolelogger')
const fs = require('fs')
const path = require('path')
const { Client, Collection, Events, GatewayIntentBits, EmbedBuilder, ActivityType, inlineCode, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js')
const config = require('../config.json')
const command = require("./deploy-commands")
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const vm = require('vm')

//
// Standard functions
//

//For VM extensions to get a usable path
function resolvePath(extension, file) {
	return process.cwd() + `\\..\\Extensions\\${extension}\\${file}`
}

//Delay function just in case I need a delay
function delay(time) {
	return new Promise(resolve => setTimeout(resolve, time));
}

//Version file, for CrimsonGUI
fs.writeFile("version.txt", "0.1.5", (err) => {
	if (err)
		console.logger(err, "error")
});

//
// Bot set-up
//

//New client for Discord.JS
var client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
	],
});

//When client is ready setup bot fully
client.once(Events.ClientReady, c => {
	client.user.setActivity(`over the server`, { type: ActivityType.Watching })
	client.user.setStatus('online')
	console.logger(`The bot is now online! Running bot as ${c.user.tag}`, "start")
	command.deploy(client.guilds.cache)
});

//Login to client
client.login(config.token)
client.commands = new Collection()

//
// Extensions
//

//Run extensions and get tag commands
var commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.command.js'))
const extensions = fs.readdirSync("../Extensions/")
var tagCommands = [{
	label: "All Commands",
	description: "All commands known to Crimson",
	value: "allcommands",
	detail: "Placeholder, this statement is unused so eh"
}]
var tagCommandsOrigins = ["Crimson"]
var tagDescriptions = []
var noTags = []
var disabled = []
var allCommands = ""

extensions.forEach(extension => {
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
		console.logger(`Loading ${metadata.name} by ${metadata.authors}...`, "start")
		var code = fs.readFileSync(`../Extensions/${extension}/index.js`, 'utf8')
		const sandbox = { client, console, fetch, fs, path, require, __dirname, extension, resolvePath }
		vm.createContext(sandbox)
		vm.runInContext(code, sandbox)
		const commandFilesExtension = fs.readdirSync(`../Extensions/${extension}/commands/`).filter(file => file.endsWith('.command.js'))
		for (const file of commandFilesExtension) {
			const filePath = path.join(`../Extensions/${extension}/commands/`, file)
			const command = require(filePath)
			if ('data' in command && 'execute' in command) {
				client.commands.set(command.data.name, command)
			} else {
				console.logger(`The command at ${filePath} is missing a required "data" or "execute" property.`, "warn")
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
		}
		catch (err) {
			tagDescriptions.push([metadata.name, ["This extension has no tag commands.\n"]])
			noTags.push(extension)
		}

		if (!noTags.includes(extension)) {
			tagDescriptions.unshift([metadata.name, []])
		}
	}
	else {
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

var disabled = []
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.logger(`The command at ./commands/${file} is missing a required "data" or "execute" property.`, "warn");
	}
}

//
// Command execution
//

//Handle command execution
client.on(Events.InteractionCreate, async interaction => {
	if (interaction.isChatInputCommand()) {

		const command = interaction.client.commands.get(interaction.commandName);
		console.logger(command, "raw")

		if (!command) {
			console.logger(`No command matching ${interaction.commandName} was found.`, "error");
			return;
		}
		try {
			await command.execute(interaction);
		} catch (error) {
			console.logger(error, "error");
			await interaction.reply({ content: 'Uh oh, something went wrong! See the console for more information.', ephemeral: true });
		}
	} else if (interaction.isStringSelectMenu()) {
		const row = new ActionRowBuilder()
			.addComponents(
				new StringSelectMenuBuilder()
					.setCustomId('commandSelector')
					.setPlaceholder('Nothing')
					.addOptions(tagCommands),
			);

		const selected = interaction.values[0];
		if (selected === "allcommands") {
			const commandEmbed = new EmbedBuilder()
				.setColor(0xFFFFFF)
				.setTitle("Crimson Tag Commands")
				.setDescription(allCommands)
			await interaction.update({ embeds: [commandEmbed], components: [row] });
		}
		else {
			var success = false
			for (const tag of tagCommands) {
				if (selected === tag.value) {
					const commandEmbed = new EmbedBuilder()
						.setColor(0xFFFFFF)
						.setTitle(`Crimson Tag Commands - ${tag.label}`)
						.setDescription(tag.detail)
					await interaction.update({ embeds: [commandEmbed], components: [row] });
					var success = true
				}
			}
			if (success === false) {
				const commandEmbed = new EmbedBuilder()
					.setColor(0xFFFFFF)
					.setTitle(`Crimson Tag Commands - Error`)
					.setDescription("I was unable to get the information of that tag command, if it's from an extension then the developer likely has not set the tag commands file up properly!")
				await interaction.update({ embeds: [commandEmbed], components: [row] });
			}
		}
	} else return
})

//
// Misc
//

//Handle GUI calls
if (process.argv.includes("--gui")) {
	process.stdin.on('data', (data) => {
		var message = JSON.parse(data.toString().trim());
		if (message.type === "END") {
			client.user.setStatus('invisible');
			process.exit()
		} else if (message.type === "RC") {
			command.deploy(client.guilds.cache)
		}
	})
}

//Make bot go invisible as soon as the bot is shut down
process.on('exit', function () {
	client.user.setStatus('invisible');
})