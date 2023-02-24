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

        const guildMember = interaction.guild.members.cache.get(target.id)
        guildMember.setNickname(nickname);    
        await interaction.reply(`User's name was changed!`);
    },
};