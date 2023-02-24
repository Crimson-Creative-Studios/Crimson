const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('node:fs');
var console = require("../consolelogger");
const { exec } = require('node:child_process')

module.exports = {
	data: new SlashCommandBuilder()
		.setName('create_embed_command')
		.setDescription('Create a brand new slash command where the bot responds with an embed')
    .addStringOption(option =>
		  option.setName('name')
			 .setDescription('The name of the command, lowercase and underscores only')
			 .setRequired(true))
    .addStringOption(option =>
		  option.setName('description')
			 .setDescription('The description of the command')
			 .setRequired(true))
    .addStringOption(option =>
		  option.setName('embed_title')
			 .setDescription('The title of the embed response')
			 .setRequired(true))
    .addStringOption(option =>
		  option.setName('embed_description')
			 .setDescription('The description of the embed response')
			 .setRequired(true))
    .addStringOption(option =>
		  option.setName('embed_color')
			 .setDescription('The color of the embed response, Format : [0xHexCodeHereWithNoHashtag]')
			 .setRequired(false))
    .addStringOption(option =>
		  option.setName('embed_author')
			 .setDescription('The author of the embed response')
			 .setRequired(false)),
	async execute(interaction) {
    const name = interaction.options.getString('name') ?? 'null_name';
    const description = interaction.options.getString('description') ?? 'null_description';
    const embed_color = interaction.options.getString('embed_color') ?? '0x58B9FF';
    const embed_title = interaction.options.getString('embed_title') ?? 'null_title';
    const embed_description = interaction.options.getString('embed_description') ?? 'null_description';
    const embed_author = interaction.options.getString('embed_author') ?? '';
    const code = `const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
var djs = require("./simpledjs");

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
var commandEmbed = djs.embed(${embed_title}, ${embed_color}, null, ${embed_author}, null, null, ${embed_description}, null, null, null, null, null)

module.exports = {
	data: new SlashCommandBuilder()
		.setName("${name}")
		.setDescription("${description}"),
	async execute(interaction) {
    await interaction.reply({ embeds: [commandEmbed] });
	},
};`;
    fs.writeFile(`${name}.command.js`, code, (err) => {
      if (err)
        console.log(err);
      else {
        async function reply() {
          await interaction.reply("Successfully created command! The command will be avaliable after the bot restarts...");
        }
        reply()
        console.logger(`Created command ${name}.command.js`, "info");
      }  
    });
    function delay(time) {
      return new Promise(resolve => setTimeout(resolve, time));
    }
   }
  }