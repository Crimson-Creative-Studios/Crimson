const { SlashCommandBuilder } = require('discord.js');
const { embed } = require("../simpledjs");

//If you would like to modify this then here is the format

//var commandEmbed = djs.embed(title, color, url, author, authorIcon, authorUrl, description, thumbnail, image, timestamp, footer, footerIcon)

//title must be a string
//color must be in the format 0x[hexcolorherewithnohashtag]
//url must be a url in a string
//author must be a string
//authorUrl must be a url in a string
//authorIcon must be a url or filename in a string
//description must be a string
//thumbnail must be a url or filename in a string
//image must be a url or filename in a string
//timestamp is unknown, best to keep null
//footer must be a string
//footerIcon must be a url or filename in a string
var commandEmbed = embed("Lime Embed", 0x00a000, null, "Lime Embed", null, null, "Lime Embed", null, null, null, null, null)

module.exports = {
	data: new SlashCommandBuilder()
		.setName("lime_embed")
		.setDescription("Lime Embed"),
	async execute(interaction) {
    	await interaction.reply({ embeds: [commandEmbed] });
	},
};
    