const { SlashCommandBuilder, EmbedBuilder, hyperlink, bold } = require('../../../Bot/node_modules/@discordjs/builders/dist/index.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('wiki')
		.setDescription('Get a Wiki link.')
        .addStringOption(option =>
			option
				.setName('topic')
				.setDescription('The wiki topic')
                .setRequired(false)
                .addChoices(
					{ name: 'SkyoBlock', value: 'SkyoBlock' },
					{ name: 'SkyoClient', value: 'SkyoClient' },
					{ name: 'SkyoAPI', value: 'SkyoAPI' },
                    { name: 'Crimson', value: 'Crimson' },
                    { name: 'General', value: 'General' },
                    { name: 'Main', value: 'Main' },
                    { name: 'ohnoanerror', value: 'ohnoanerror' },
				)),
	async execute(interaction) {
        const topic = interaction.options.getString('topic') ?? 'no_topic';
        if (topic === "SkyoBlock") {
            var wikilink = "https://skyoproductions.github.io/wiki#skyoblock"
            var msg = "This link will take you to the SkyoBlock section of the Wiki!"
        }
        else if (topic === "SkyoClient") {
            var wikilink = "https://skyoproductions.github.io/wiki#skyoclient"
            var msg = "This link will take you to the SkyoClient section of the Wiki!"
        }
        else if (topic === "SkyoAPI") {
            var wikilink = "https://skyoproductions.github.io/wiki#skyoapi"
            var msg = "This link will take you to the SkyoAPI section of the Wiki!"
        }
        else if (topic === "Crimson") {
            var wikilink = "https://skyoproductions.github.io/wiki#crimson"
            var msg = "This link will take you to the Crimson section of the Wiki!"
        }
        else if (topic === "General") {
            var wikilink = "https://skyoproductions.github.io/wiki#general"
            var msg = "This link will take you to the General section of the Wiki!"
        }
        else if (topic === "Main") {
            var wikilink = "https://skyoproductions.github.io/wiki"
            var msg = "This link will take you to the Main section of the Wiki!"
        }
        else {
            var wikilink = "https://skyoproductions.github.io/wiki"
            var msg = `[ERROR] | The Wiki option provided does ${bold('not')} have a Wiki link provided, this is likely a misconfiguration of the Wiki command. Conveniently I have a wiki link to solve that! The link in this message will help you fix this issue.`
        }
        const updateWikiEmbed = new EmbedBuilder()
	        .setColor(0x01DADE)
	        .setTitle('SkyoWiki')
	        .setDescription(`Your Wiki link is ${hyperlink('here.', wikilink)}\n\n${msg}`)
        await interaction.reply({ embeds: [updateWikiEmbed] });
	},
};