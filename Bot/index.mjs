import { createRequire } from "module";
import fetch from 'node-fetch';
import { fileURLToPath } from 'url';
const require = createRequire(import.meta.url);
const console = require('./consolelogger')
const fs = require('fs');
const path = require('path');
const { Client, Collection, Events, GatewayIntentBits, EmbedBuilder, ActivityType, inlineCode, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const vm = require('vm');
const config = require('../config.json')

fs.writeFile("version.txt", "0.1.5", (err) => {
	if (err)
		console.logger(err, "error");
});

var client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMembers,
	],
});

//interaction.channel.send('content');
//Can be used (I think) to send a normal message to where the user sent a slash command
//(I think)

client.once(Events.ClientReady, c => {
	client.user.setActivity(`over the server`, { type: ActivityType.Watching });
	client.user.setStatus('online');
	console.logger(`The bot is now online! Running bot as ${c.user.tag}`, "start");
});

client.login(config.token);

function deploy(client) {
	const { REST, Routes } = require('discord.js');

	const commands = []

	var i = 0

	fs.readdir("../Extensions/", function (err, files) {
		if (err) {
			return console.logger('Unable to scan directory: ' + err, "error");
		}
		files.forEach(function (file) {
			var cfg = require(`../Extensions/${file}/config.json`)
			var enabled = cfg.enabled
			if (enabled === "true") {
				var state = "enabled"
			} else {
				var state = "disabled"
			}
			if (state === "enabled") {
				var j = 0
				const commandFilesExtension = fs.readdirSync(`../Extensions/${file}/commands/`).filter(file => file.endsWith('.command.js'));
				for (const file2 of commandFilesExtension) {
					const command = require(`../Extensions/${file}/commands/${file2}`);
					commands.push(command.data.toJSON());
					i = i + 1
					j = j + 1
				}
				var metadata = require(`../Extensions/${file}/extension.json`)
				console.logger(`Started refreshing ${j} application commands from ${metadata.name}`, "start")
			}
		});
	});

	const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.command.js'));

	for (const file of commandFiles) {
		const command = require(`./commands/${file}`);
		commands.push(command.data.toJSON());
		i = i + 1
	}

	const rest = new REST({ version: '10' }).setToken(config.token);

	(async () => {
		try {
			console.logger(`Started refreshing ${commands.length} core application commands.`, "start");
			client.guilds.cache.forEach(async guild => {
				var data = await rest.put(
					Routes.applicationGuildCommands(config.clientid, guild.id),
					{ body: commands },
				);
			})
			console.logger(`Successfully reloaded ${i} core and extension application commands.`, "start");
		} catch (error) {
			console.logger(error, "error");
		}
	})();
};

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
});
function delay(time) {
	return new Promise(resolve => setTimeout(resolve, time));
}

if (process.argv.includes("--gui")) {
	process.stdin.on('data', (data) => {
		var message = JSON.parse(data.toString().trim());
		if (message.type === "END") {
			client.user.setStatus('invisible');
			process.exit()
		} else if (message.type === "RC") {
			deploy(client)
		}
	})
}

delay(2000).then(() => deploy(client))

process.on('exit', function (){
	client.user.setStatus('invisible');
});

//
// This must be 300 lines
// I NEED IT!!!
//
//