const { SlashCommandBuilder, EmbedBuilder } = require('../../../Bot/node_modules/@discordjs/builders/dist/index.js');

const updateBedrockEmbed = new EmbedBuilder()
	.setColor(0x01DADE)
	.setTitle('Update Bedrock!')
	.setAuthor({ name: 'Lime8756'})
	.setDescription("To fix the issue you are having you may simply need to update your Bedrock client, SkyoBlock ONLY supports the versions that the plugin GeyserMC supports. You can find them at https://geysermc.org/. If this doesn't work then you can just ask for help once again.")

module.exports = {
	data: new SlashCommandBuilder()
		.setName('update_bedrock')
		.setDescription('Tell the user to update Bedrock'),
	async execute(interaction) {
    await interaction.reply({ embeds: [updateBedrockEmbed] });
	},
};