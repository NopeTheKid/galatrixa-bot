const { MessageEmbed } = require("discord.js");
const ytdl = require("ytdl-core");
const { prefix } = require("../../config.json");
const { play, addQueue } = require("../../util/functions.js");

module.exports = {
	name: "eleavisou",
	category: "fun",
	description: "O Pita avisou!",
	usage: `${prefix}eleavisou`,
	async run(client, message, args) {
		//creates embed
		let subject = args.join(" ");
		let title = `O Pita avisou ${subject}!`;
		const embed = new MessageEmbed()
			.setColor("#ffffff")
			.setFooter(message.guild.me.displayName, client.user.displayAvatarURL)
			.setTitle(title)
			.setTimestamp()
			.setImage("https://cdn.discordapp.com/attachments/663463742364975115/698567538803605665/IMG-20190830-WA0000.jpg");

		//adds song to the queue
		const queue = message.client.queue.get(message.guild.id);
		let url = "https://youtu.be/s_5hcdbYHYU";
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