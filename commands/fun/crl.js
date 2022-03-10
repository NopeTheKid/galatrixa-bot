const { MessageEmbed } = require("discord.js");
const ytdl = require("ytdl-core");
const { prefix } = require("../../config.json");
const { play, addQueue } = require("../../util/functions.js");

module.exports = {
	name: "crl",
	category: "fun",
	description: "VAI PÓ CARALHO!",
	usage: `${prefix}crl`,
	async run(client, message, args) {
		//creates embed
		let subject = args.join(" ");
		let title = `VAI PÓ CARALHO ${subject}!`;
		const embed = new MessageEmbed()
			.setColor("#ffffff")
			.setFooter(message.guild.me.displayName, client.user.displayAvatarURL)
			.setTitle(title)
			.setTimestamp()
			.setImage("https://cdn.discordapp.com/attachments/569644985926943010/698527233551237150/unknown.png");

		//adds song to the queue
		const queue = message.client.queue.get(message.guild.id);
		let url = "https://youtu.be/4EU8_qyU0UQ";
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