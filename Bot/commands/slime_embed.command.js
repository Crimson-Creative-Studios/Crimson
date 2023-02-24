
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const commandEmbed = new EmbedBuilder()
	.setColor(0xff0000)
	.setTitle("Slime Embed")
	.setAuthor({ name: 'Slime Embed'})
	.setDescription("Slime Embed")

module.exports = {
	data: new SlashCommandBuilder()
		.setName("slime_embed")
		.setDescription("Slime Embed"),
	async execute(interaction) {
    await interaction.reply({ embeds: [commandEmbed] });
	},
};
    