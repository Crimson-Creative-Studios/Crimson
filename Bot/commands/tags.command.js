const { SlashCommandBuilder, EmbedBuilder, codeBlock, inlineCode, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
var console = require("../consolelogger");

var extensionPath = path.join(__dirname + '../../../Extensions/')
const extensions = fs.readdirSync(extensionPath)

var tagCommands = [{
	label: "All Commands",
	description: "All commands known to Crimson",
	value: "allcommands",
	detail: "Placeholder, this statement is unused so eh"
}]
var tagCommandsOrigins = ["Crimson"]

extensions.forEach(extension => {
	try {
		var extensionPath = path.join(__dirname + `../../../Extensions/${extension}/tags.js`)
		var { tags } = require(extensionPath);
		var extensionPath = path.join(__dirname + `../../../Extensions/${extension}/extension.json`)
		var metadata = require(extensionPath);
		for (const i of tags) {
			if (i.enabled === "true") {
				tagCommands.push(i)
				tagCommandsOrigins.push(metadata.name);
			}
		}
	}
	catch (err) {
		var whynotaddavarlmao = undefined
	}
})

var tagDescriptions = []
extensions.forEach(extension => {
	var extensionPath = path.join(__dirname + `../../../Extensions/${extension}/extension.json`)
	var metadata = require(extensionPath);
	tagDescriptions.push([metadata.name, []])
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

for (const i of tagDescriptions) {
	if (i[1] === []) {
		var index = tagDescriptions.indexOf(i)
		i[1] = ["`This extension has no tag commands.`\n"]
		tagDescriptions[index] = i
	}
}

const commandEmbed = new EmbedBuilder()
	.setColor(0xFFFFFF)
	.setTitle("Crimson Tag Commands")
	.setDescription(allCommands)

const row = new ActionRowBuilder()
	.addComponents(
		new StringSelectMenuBuilder()
			.setCustomId('commandSelector')
			.setPlaceholder('Nothing')
			.addOptions(tagCommands),
	);

module.exports = {
	data: new SlashCommandBuilder()
		.setName("list_tag_commands")
		.setDescription("Get all tag commands for Crimson"),
	async execute(interaction) {
		await interaction.reply({ embeds: [commandEmbed], components: [row] });
	},
};
