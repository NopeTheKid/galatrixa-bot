const {Client, Collection} = require('discord.js');
const Discord = require('discord.js');

module.exports = class extends Client {
	constructor(config) {
		super({
			disableEveryone: true,
			disabledEvents: ['TYPING_START']
		});

		this.commands = new Collection();

		this.queue = new Map();

		this.intents = new Discord.Intents(Discord.Intents.ALL);

		this.config = config;
	}
};