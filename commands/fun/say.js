const { ApplicationCommandOptionType } = require('discord.js');

module.exports = {
	name: 'say',
    description: 'Say something',
	options:[
		{
            name: 'string',
            description: 'what you want me to say',
            type: ApplicationCommandOptionType.String,
            required: true,
        }
	],
	async execute({inter}) {
        args= inter.options.getString('string');
        return inter.reply({ content: args});
	},
};