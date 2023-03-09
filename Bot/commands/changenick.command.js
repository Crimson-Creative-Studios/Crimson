const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('change_nick')
		.setDescription('Select a member and change their nickname')
		.addUserOption(option =>
			option
				.setName('target')
				.setDescription('The member to modify')
				.setRequired(true))
		.addStringOption(option =>
			option
				.setName('nickname')
				.setDescription('What the nickname is')),
	async execute(interaction) {
		const target = interaction.options.getUser('target');
		const nickname = interaction.options.getString('nickname') ?? '';
		if (nickname.length > 32) {
			await interaction.reply(`That nickname is too long!`);
		} else {
			const guildMember = interaction.guild.members.cache.get(target.id)
			if (interaction.guild.me.permissions.missing('MANAGE_NICKNAMES')) return await interaction.reply(`I don't have permission to change that user's name!`);
			if (target.id === interaction.guild.ownerId) return await interaction.reply(`I don't have permission to change that user's name!`);
			guildMember.setNickname(nickname);
			await interaction.reply(`User's name was changed successfully.`);
		}
	},
};