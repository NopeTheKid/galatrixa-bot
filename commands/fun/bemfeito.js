const { EmbedBuilder } = require("discord.js");
const ytdl = require("ytdl-core");
const { prefix } = require("./../../config.json");
const { play, addQueue } = require("../../util/functions.js");
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName("bemfeito")
		.setDescription("É bem feito!"),
	name: "bemfeito",
	category: "fun",
	description: "É bem feito!",
	usage: `${prefix}bemfeito`,
	async run(client, message, args) {
		//creates embed
		let title = `É bem feito!`;
		const embed = new EmbedBuilder()
			.setColor("#ffffff")
			//.setFooter(client.user.username, client.user.displayAvatarURL)
			.setTitle(title)
			.setTimestamp()
			.setImage("https://media1.tenor.com/images/aee72fd7530ce5deae7209ffe6df76c0/tenor.gif?itemid=5240463");

		//adds song to the queue
		const queue = message.client.queue.get(message.guild.id);
		let url = "https://youtu.be/wGVIrWH5Bao";
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