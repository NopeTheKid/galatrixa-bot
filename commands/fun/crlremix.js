const { MessageEmbed } = require("discord.js");
const ytdl = require("ytdl-core");
const { prefix } = require("../../config.json");
const { play, addQueue } = require("../../util/functions.js");

module.exports = {
	name: "crlremix",
	category: "fun",
	description: "VAI PÓ CARALHO!",
	usage: `${prefix}crlremix`,
	async run(client, message, args) {
		//creates embed
		let subject = args.join(" ");
		let title = `VAI PÓ CARALHO ${subject}!`;
		const embed = new MessageEmbed()
			.setColor("#ffffff")
			.setFooter(message.guild.me.displayName, client.user.displayAvatarURL)
			.setTitle(title)
			.setTimestamp()
			.setImage("https://cdn.discordapp.com/attachments/613865892454858757/613868126328717325/d39ffd63-2303-4c5f-95e1-372fa63157e5.png");

		//adds song to the queue
		const queue = message.client.queue.get(message.guild.id);
		let url = "https://www.youtube.com/watch?v=OPJ2Dzxbluk";
		const song = {
			url,
			title
		};

		await this.addQueue(song, queue, message);

		//sends embed
		message.channel.send(embed);

	}, async addQueue(song, serverQueue, message) { //add music to the queue
		addQueue(song, serverQueue, message, true);
	}
}