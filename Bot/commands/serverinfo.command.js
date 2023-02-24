const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('server_info')
		.setDescription('Get server info'),
	async execute(interaction) {
		const guild = interaction.guild;
		var timecreate = guild.createdAt.toLocaleDateString('de-DE', {
			day: '2-digit',
			month: '2-digit',
			year: 'numeric',
		})
		var timecreate = timecreate.replaceAll(".", "/")
		var servericon = guild.iconURL();
    	const commandEmbed = new EmbedBuilder()
			.setColor(0xFFFFFF)
			.setTitle("Current Server Information")
			.setDescription(`Here is ${guild.name}'s server info`)
			.setThumbnail(servericon)
			.addFields(
				{ name: 'Server Name', value: guild.name },
				{ name: 'Members', value: guild.memberCount.toString() },
				{ name: 'Time of creation', value: timecreate },
				{ name: 'AFK Time', value: guild.afkTimeout.toString() },
		)
		await interaction.reply({ embeds: [commandEmbed] });
	},
};