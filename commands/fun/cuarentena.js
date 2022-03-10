const { MessageEmbed } = require("discord.js");
const ytdl = require("ytdl-core");
const { prefix } = require("../../config.json");
const { play, addQueue } = require("../../util/functions.js");

module.exports = {
	name: "cuarentena",
	category: "fun",
	description: "A desobediência é crime.",
	usage: `${prefix}cuarentena`,
	async run(client, message, args) {
		//creates embed
		let subject = args.join(" ");
		let title = `A desobediência é crime.`;
		const embed = new MessageEmbed()
			.setColor("#ffffff")
			.setFooter(message.guild.me.displayName, client.user.displayAvatarURL)
			.setTitle(title)
			.setTimestamp()
			.setImage("https://cdn.discordapp.com/attachments/663463742364975115/698567144182644856/PngJoy_umbrella-vector-umbrella-corporation-logo-vector-hd-png_8708990.png");

		//adds song to the queue
		const queue = message.client.queue.get(message.guild.id);
		const url = "https://youtu.be/Pv2sLN5nNsY";
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