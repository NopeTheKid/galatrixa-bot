const { MessageEmbed } = require("discord.js");
const ytdl = require("ytdl-core");
const { prefix } = require("../../config.json");
const { play, addQueue } = require("../../util/functions.js");

module.exports = {
	name: "tcrl",
	category: "fun",
	description: "AAAAAAAAAAAAAAAA!",
	usage: `${prefix}tcrl`,
	async run(client, message, args) {
		//creates embed
		let subject = args.join(" ");
		let title = `VÃO TODOS PÓ QUARALHO.`;
		const embed = new MessageEmbed()
			.setColor("#ffffff")
			.setFooter(message.guild.me.displayName, client.user.displayAvatarURL)
			.setTitle(title)
			.setTimestamp()
			.setImage("https://media.giphy.com/media/eMbbxXnLtyGdYG9FvS/giphy.gif");

		//adds song to the queue
		const queue = message.client.queue.get(message.guild.id);
		let url = "https://youtu.be/btplzhBpXGA";
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