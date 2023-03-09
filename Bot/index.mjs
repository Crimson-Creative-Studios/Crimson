import { createRequire } from "module";
import fetch from 'node-fetch';
import { fileURLToPath } from 'url';
const require = createRequire(import.meta.url);
const console = require('./consolelogger')
const { deploy } = require('./deploy-commands')
const fs = require('fs');
const path = require('path');
const { Client, Collection, Events, GatewayIntentBits, AttachmentBuilder, EmbedBuilder, ActivityType, codeBlock, inlineCode, ActionRowBuilder, StringSelectMenuBuilder, WebhookClient, REST, Routes } = require('discord.js');
const vm = require('vm');

var client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
	],
});

const clientProxy = new Proxy({ proxy: client }, {
	set: function (target, prop, value) {
		if (prop === 'value') {
			globalThis.client = clientProxy.proxy
			target.value = value;
		}
		return true;
	}
});

//var channel = interaction.channel
//channel.send('content');
//Can be used (I think) to send a normal message to where the user sent a slash command
//(I think)

require('dotenv').config()

client.once(Events.ClientReady, c => {
	client.user.setActivity(`over the server`, { type: ActivityType.Watching });
	console.logger(`The bot is now online! Running bot as ${c.user.tag}`, "start");
});

client.login(process.env.TOKEN);

client.commands = new Collection();

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const commandsPath = path.join(__dirname, './commands/');
var commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.command.js'));
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

const extensions = fs.readdirSync("../Extensions/")
extensions.forEach(extension => {
	var exstate = require("../extensions.json")
	var enabled = exstate.enabled
	var test = exstate.test
	var disabled = exstate.disabled
	if (enabled.includes(extension)) {
		var extensionstate = "enabled"
	} else if (test.includes(extension)) {
		var extensionstate = "test"
	} else if (disabled.includes(extension)) {
		var extensionstate = "disabled"
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
	if (extensionstate === "enabled" || extensionstate === "test") {
		var metadata = require(`../Extensions/${extension}/extension.json`);
		console.logger(`Loading ${metadata.name} by ${metadata.authors}...`, "start")
		var code = fs.readFileSync(`../Extensions/${extension}/index.js`, 'utf8');
		const sandbox = { client, console, fetch, fs, path, require, __dirname, extension };
		vm.createContext(sandbox);
		vm.runInContext(code, sandbox);
		try {
			var { tags } = require(`../Extensions/${extension}/tags.js`);
			for (const i of tags) {
				if (i.enabled === "true") {
					tagCommands.push(i)
					tagCommandsOrigins.push(metadata.name);
				}
			}
		}
		catch (err) {
			tagDescriptions.push([metadata.name, ["This extension has no tag commands.\n"]])
			noTags.push(extension)
		}
		const commandFilesExtension = fs.readdirSync(`../Extensions/${extension}/commands/`).filter(file => file.endsWith('.command.js'));
		for (const file of commandFilesExtension) {
			const filePath = path.join(`../Extensions/${extension}/commands/`, file);
			const command = require(filePath);
			if ('data' in command && 'execute' in command) {
				client.commands.set(command.data.name, command);
			} else {
				console.logger(`The command at ${filePath} is missing a required "data" or "execute" property.`, "warn");
			}
		}
	}
	else {
		disabled.push(extension)
	}
})

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const require = createRequire(import.meta.url);
	const command = require(filePath);
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.logger(`The command at ${filePath} is missing a required "data" or "execute" property.`, "warn");
	}
}

extensions.forEach(extension => {
	if (!disabled.includes(extension)) {
		var test = noTags.includes(extension)
		if (!test) {
			var metadata = require(`../Extensions/${extension}/extension.json`);
			tagDescriptions.unshift([metadata.name, []])
		}
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
var allCommands = ""
for (const des of tagDescriptions) {
	allCommands = allCommands + `${des[0]}:\n`
	var tags = des[1]
	for (const tag of tags) {
		allCommands = allCommands + inlineCode(tag) + "\n"
	}
	allCommands = allCommands + "\n"
}

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isStringSelectMenu()) return;

	function makeEmbed(color, title, description) {
		const commandEmbed = new EmbedBuilder()
			.setColor(color)
			.setTitle(title)
			.setDescription(description)
		return commandEmbed
	}

	const row = new ActionRowBuilder()
		.addComponents(
			new StringSelectMenuBuilder()
				.setCustomId('commandSelector')
				.setPlaceholder('Nothing')
				.addOptions(tagCommands),
		);

	const selected = interaction.values[0];
	if (selected === "allcommands") {
		var commandEmbed = makeEmbed(0xFFFFFF, "Crimson Tag Commands", allCommands)
		await interaction.update({ embeds: [commandEmbed], components: [row] });
	}
	else {
		var success = false
		for (const tag of tagCommands) {
			var id = tag.value
			if (selected === id) {
				var commandEmbed = makeEmbed(0xFFFFFF, `Crimson Tag Commands - ${tag.label}`, tag.detail)
				await interaction.update({ embeds: [commandEmbed], components: [row] });
				var success = true
			}
		}
		if (success === false) {
			var commandEmbed = makeEmbed(0xFFFFFF, `Crimson Tag Commands - Error`, "I was unable to get the information of that tag command, if it's from an extension then the developer likely has not set the tag commands file up properly!")
			await interaction.update({ embeds: [commandEmbed], components: [row] });
		}
	}
})

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

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
});
function delay(time) {
	return new Promise(resolve => setTimeout(resolve, time));
}

export default client

delay(2000).then(() => deploy(client))