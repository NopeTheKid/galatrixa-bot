const { MessageEmbed } = require("discord.js");
const ytdl = require("ytdl-core");
const { prefix } = require("../../config.json");
const { play, addQueue } = require("../../util/functions.js");

module.exports = {
	name: "fiquememcasa",
	category: "fun",
	description: "Fiquem ... em casa.",
	usage: `${prefix}fiquememcasa`,
	async run(client, message, args) {
		//creates embed
		let subject = args.join(" ");
		if (subject != "")
			subject = " " + subject;
		let title = `Fiquem ... em casa.`;
		const embed = new MessageEmbed()
			.setColor("#ffffff")
			.setFooter(message.guild.me.displayName, client.user.displayAvatarURL)
			.setTitle(title)
			.setTimestamp()
			.setImage("https://cdn.discordapp.com/attachments/663463742364975115/698569641542418482/unknown.png");

		//adds song to the queue
		const queue = message.client.queue.get(message.guild.id);
		let url = "https://youtu.be/RYHgoPIFBv8";
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