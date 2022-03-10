const { MessageEmbed } = require("discord.js");
const ytdl = require("ytdl-core");
const { prefix } = require("../../config.json");
const { play, addQueue } = require("../../util/functions.js");

module.exports = {
	name: "rip",
	category: "fun",
	description: "RIP in peace",
	usage: `${prefix}rip`,
	async run(client, message, args) {
		//creates embed
		let subject = args.join(" ");
		if (subject != "")
			subject = " " + subject;
		let title = `RIP in peaces${subject}.`;
		const embed = new MessageEmbed()
			.setColor("#ffffff")
			.setFooter(message.guild.me.displayName, client.user.displayAvatarURL)
			.setTitle(title)
			.setTimestamp()
			.setImage("https://cdn.discordapp.com/attachments/569645330107334659/669972015763030046/rip_gltx.png");

		//adds song to the queue
		const queue = message.client.queue.get(message.guild.id);
		let url = "https://www.youtube.com/watch?v=WChTqYlDjtI";
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