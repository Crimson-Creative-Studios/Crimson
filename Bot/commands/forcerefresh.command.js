const { SlashCommandBuilder } = require('discord.js')
const config = require('../../config.json')
const command = require('../deploy-commands')

module.exports = {
	data: new SlashCommandBuilder()
		.setName("force_refresh")
		.setDescription("Force refresh all commands including core ones, this is dangerous and can take a while"),
	async execute(interaction, client) {
		if (!interaction.member.roles.cache.some(r => r.name.startsWith(config.adminname))) {
			await interaction.reply("You do not have access to this command.")
		} else {
            await command.deploy(client.guilds.cache, true)
			await interaction.reply("Information logged!")
		}
	},
};