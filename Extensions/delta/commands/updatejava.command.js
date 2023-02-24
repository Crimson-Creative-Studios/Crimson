const { SlashCommandBuilder, EmbedBuilder } = require('../../../Bot/node_modules/@discordjs/builders/dist/index.js');

const updateJavaEmbed = new EmbedBuilder()
	.setColor(0xFB00FF)
	.setTitle('Update Java!')
	.setAuthor({ name: 'Lime8756'})
	.setDescription("To fix the issue you are having you may simply need to update your Java client, SkyoBlock ONLY supports the current major version. E.G. 1.19.* or 1.21.* or 1.20.* If this doesn't work then you can just ask for help once again.")

module.exports = {
	data: new SlashCommandBuilder()
		.setName('update_java')
		.setDescription('Tell the user to update Java'),
	async execute(interaction) {
    await interaction.reply({ embeds: [updateJavaEmbed] });
	},
};