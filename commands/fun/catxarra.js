const { MessageEmbed } = require("discord.js");
const ytdl = require("ytdl-core");
const { prefix } = require("../../config.json");
const { play, addQueue } = require("../../util/functions.js");

module.exports = {
	name: "catxarra",
	category: "fun",
	description: "Siga Freitas que amanhã é dia de trabalho!",
	usage: `${prefix}catxarra`,
	async run(client, message, args) {
		//creates embed
		let title = `Siga Freitas que amanhã é dia de trabalho!`;
		const embed = new MessageEmbed()
			.setColor("#ffffff")
			.setFooter(message.guild.me.displayName, client.user.displayAvatarURL)
			.setTitle(title)
			.setTimestamp()
			.setImage("https://media.giphy.com/media/l4FGpKGjFCVBckFYk/giphy.gif");

		//adds song to the queue
		const queue = message.client.queue.get(message.guild.id);
		let url = "https://youtu.be/JlAyP40DMu4";
		const song = {
			url,
			title
		};

		await addQueue(song, queue, message, true);

		//sends embed
		message.channel.send(embed);

	}
}