var embed = function embed(title, color, url, author, authorIcon, authorUrl, description, thumbnail, image, timestamp, footer, footerIcon){
  const { EmbedBuilder } = require('discord.js');
  const embed = new EmbedBuilder()
	.setColor(color)
	.setTitle(title)
	.setURL(url)
	.setAuthor({ name: author, iconURL: authorIcon, url: authorUrl })
	.setDescription(description)
	.setThumbnail(thumbnail)
	.setImage(image)
	.setTimestamp(timestamp)
	.setFooter({ text: footer, iconURL: footerIcon });
  return embed
};

module.exports = {
	embed
};