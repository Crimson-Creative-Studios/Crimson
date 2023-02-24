import { createRequire } from "module";
const require = createRequire(import.meta.url);

var commands = require("./deploy-commands");
//const sharp = require('sharp');
const axios = require('axios');
var console = require("./consolelogger");
const fs = require('fs');
const path = require('path');
const Canvas = require('@napi-rs/canvas');
const { XMLHttpRequest } = require('xmlhttprequest');
import fetch from 'node-fetch';
import { fileURLToPath } from 'url';
const { Client, Collection, Events, GatewayIntentBits, AttachmentBuilder, EmbedBuilder, ActivityType, codeBlock, inlineCode, ActionRowBuilder, StringSelectMenuBuilder, WebhookClient } = require('discord.js');
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
	client.user.setActivity('over 2 servers', { type: ActivityType.Watching });
	console.logger(`The bot is now online! Running bot as ${c.user.tag}`, "info");
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

const extensions = fs.readdirSync("../Extensions/")
extensions.forEach(extension => {
	var metadata = require(`../Extensions/${extension}/extension.json`);
	console.logger(`Loading ${metadata.name} by ${metadata.authors}...`, "info")
	var code = fs.readFileSync(`../Extensions/${extension}/index.js`, 'utf8');
	const sandbox = { client, Collection, Events, GatewayIntentBits, AttachmentBuilder, EmbedBuilder, ActivityType, codeBlock, inlineCode, ActionRowBuilder, StringSelectMenuBuilder, WebhookClient, console, fetch };
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
})

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.logger(`The command at ${filePath} is missing a required "data" or "execute" property.`, "warn");
	}
}

extensions.forEach(extension => {
	var test = noTags.includes(extension)
	if (!test) {
		var metadata = require(`../Extensions/${extension}/extension.json`);
		tagDescriptions.unshift([metadata.name, []])
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
delay(1000).then(() => commands.deploy());

async function convertWebpToJpg(webpImageUrl) {
	const response = await axios.get(webpImageUrl, { responseType: 'arraybuffer' });
	const webpImage = Buffer.from(response.data, 'binary');

	const jpgImage = await sharp(webpImage)
		.webp({ quality: 80 })
		.toBuffer();

	return jpgImage;
}

client.on(Events.GuildMemberAdd, member => {
	async function createImageNSend(member) {
		const background = await Canvas.loadImage('./blank.png');
		const canvas = Canvas.createCanvas(600, 250);
		const context = canvas.getContext('2d');
		context.drawImage(background, 0, 0, canvas.width, canvas.height);
		var pfp = await convertWebpToJpg(member.displayAvatarURL());
		const avatar = await Canvas.loadImage(pfp);
		context.drawImage(avatar, 25, 25, 200, 200);
		context.beginPath();
		context.arc(125, 125, 100, 0, Math.PI * 2, true);
		context.closePath();
		context.clip();
		context.font = '28px sans-serif';
		context.fillStyle = '#ffffff';
		context.fillText('Welcome,', canvas.width / 2.5, canvas.height / 3.5);
		const applyText = (canvas, text) => {
			const context = canvas.getContext('2d');
			let fontSize = 70;

			do {
				context.font = `${fontSize -= 10}px sans-serif`;
			} while (context.measureText(text).width > canvas.width - 300);

			return context.font;
		};
		context.font = applyText(canvas, `${member.displayName}!`);
		context.fillStyle = '#ffffff';
		context.fillText(member.displayName, canvas.width / 2.5, canvas.height / 1.8);
		const attachment = new AttachmentBuilder(await canvas.encode('png'), { name: 'profile-image.png' });
		const messages = ["Welcome to the SkyoProductions server!", "Welcome to the SkoProducions sever!", `A wild ${member.displayName} appeared in the SkyoProductions Discord server!`];
		const embed = new EmbedBuilder()
			.setColor(0x01DADE)
			.setTitle(messages[Math.floor((Math.random() * messages.length))])
			.setImage(`attachment://${attachment.name}`)
		member.guild.channels.cache.get('1066763410257215668').send({ embeds: [embed], files: [attachment] });
		console.logger(member + " has joined the server!", "info")
	}
	createImageNSend(member)
});