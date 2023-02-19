const { prefix } = require("../../config.json");
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName("say")
		.setDescription("Say something")
        .addStringOption(option =>
            option.setName('input')
            .setDescription('Something to say')),
	name: 'say',
    category: "fun",
    description: 'Say something',
    usage:`${prefix}say`,
	async run(client, interaction, args, ops) {
        if(args==1)
            await interaction.reply(interaction.options.getString("input"));
        else{
            args= args.join(' ');
            return interaction.channel.send(args);
        }
	},
};