const { MessageEmbed } = require("discord.js");
const ytdl = require("ytdl-core");
const { prefix } = require("../../config.json");
const { play, addQueue } = require("../../util/functions.js");

module.exports = {
	name: "destelado",
	category: "fun",
	description: "Eu só gosto de mulheres",
	usage: `${prefix}destelado`,
	async run(client, message, args) {
		//creates embed
		let title = `Eu só gosto de mulheres`;
		const embed = new MessageEmbed()
			.setColor("#ffffff")
			.setFooter(message.guild.me.displayName, client.user.displayAvatarURL)
			.setTitle(title)
			.setTimestamp()
			.setImage("https://cdn.discordapp.com/attachments/663463742364975115/748993110935339048/received_1104359733076522.jpeg");

		//adds song to the queue
		const queue = message.client.queue.get(message.guild.id);
		let url = "https://www.youtube.com/watch?v=uQ6NTQXNM2A";
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