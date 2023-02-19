const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName("u")
		.setDescription("It's an U"),
    name: "u",
    category: "galatrixa",
    description: "It's an U",
    async run(client, message, args, ops){
        message.reply("U ✌");
    },
};