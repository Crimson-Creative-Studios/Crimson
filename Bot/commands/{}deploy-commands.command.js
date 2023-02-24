const { SlashCommandBuilder } = require('discord.js');
var commands = require("../deploy-commands");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('refresh_commands')
		.setDescription('Refreshes command files.'),
	async execute() {
    commands.deploy();
	},
};