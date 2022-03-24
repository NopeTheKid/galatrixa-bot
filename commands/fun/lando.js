const { MessageEmbed } = require("discord.js");
const ytdl = require("ytdl-core");
const { prefix } = require("../../config.json");
const { play, addQueue } = require("../../util/functions.js");

module.exports = {
	name: "lando",
	category: "fun",
	description: "Let's go Lando!",
	usage: `${prefix}lando`,
	async run(client, message, args) {
		//creates embed
		let title = `Let's go Lando!`;
		const embed = new MessageEmbed()
			.setColor("#ffffff")
			.setFooter(message.guild.me.displayName, client.user.displayAvatarURL)
			.setTitle(title)
			.setTimestamp()
			.setImage("https://cdn.discordapp.com/attachments/363068470767910914/951418117035261992/sopa.png")
			;
		//adds song to the queue
		const queue = message.client.queue.get(message.guild.id);
		let url = "https://youtu.be/vp4CZQsmhhE";
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
