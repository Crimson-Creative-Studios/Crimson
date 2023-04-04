const { SlashCommandBuilder } = require('discord.js');
var console = require("../consolelogger");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("log")
		.setDescription("Log something in the console")
		.addStringOption(option =>
			option
				.setName('info')
				.setDescription('What to log')),
	async execute(interaction) {
		if (!interaction.member.roles.cache.some(r => r.name.startsWith(process.env.ADMINNAME))) {
			await interaction.reply("You do not have access to this command.")
		} else {
			const info = interaction.options.getString('info') ?? 'No information provided!';
			var userID = interaction.user.tag;
			console.logger(info, "logCommand");
			console.logger("Triggered by " + userID, "action")
			await interaction.reply("Information logged!")
		}
	},
};