const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, inlineCode } = require('discord.js')
const console = require("../consolelogger")
const fs = require("fs")

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
const extensions = fs.readdirSync("../Extensions/")

extensions.forEach(extension => {
	var cfg = require(`../../Extensions/${extension}/config.json`)
	var enabled = cfg.enabled
	if (enabled === "true") {
		var extensionstate = "enabled"
	} else {
		var extensionstate = "disabled"
	}
	if (extensionstate === "enabled") {
		var metadata = require(`../../Extensions/${extension}/extension.json`)
		try {
			var tags = require(`../../Extensions/${extension}/tags.json`)
			for (var j of Object.keys(tags)) {
				var i = tags[j]
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
	}
	else {
		disabled.push(extension)
	}

	if (!disabled.includes(extension)) {
		if (!noTags.includes(extension)) {
			var metadata = require(`../../Extensions/${extension}/extension.json`);
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

for (const des of tagDescriptions) {
	allCommands = allCommands + `${des[0]}:\n`
	var tags = des[1]
	for (const tag of tags) {
		allCommands = allCommands + inlineCode(tag) + "\n"
	}
	allCommands = allCommands + "\n"
}

for (const i of Object.keys(tagDescriptions)) {
	if (i[1] === []) {
		var index = tagDescriptions.indexOf(i)
		i[1] = ["`This extension has no tag commands.`\n"]
		tagDescriptions[index] = i
	}
}

var commandEmbed = new EmbedBuilder()
	.setColor(0xFFFFFF)
	.setTitle("Crimson Tag Commands")
	.setDescription(allCommands)

const row = new ActionRowBuilder()
	.addComponents(
		new StringSelectMenuBuilder()
			.setCustomId('commandSelector')
			.setPlaceholder('Nothing')
			.addOptions(tagCommands),
	)


module.exports = {
	data: new SlashCommandBuilder()
		.setName("list_tag_commands")
		.setDescription("Get all tag commands for Crimson"),
	async execute(interaction) {
		await interaction.reply({ embeds: [commandEmbed], components: [row] })
	},
};