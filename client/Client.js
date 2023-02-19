const {Client, Collection, GatewayIntentBits} = require('discord.js');
const Discord = require('discord.js');

module.exports = class extends Client {
	constructor(config) {
		super({
			disableEveryone: true,
			disabledEvents: ['TYPING_START']
		});

		this.commands = new Collection();

		this.queue = new Map();

		this.intents = GatewayIntentBits;

		this.config = config;
	}
};