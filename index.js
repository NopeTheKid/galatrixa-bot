const fs = require('fs')
const {Collection} = require('discord.js');
const Client = require('./client/Client');
const {
	prefix,
	token,
} = require('./config.json');

const client = new Client({
	disableEveryone: false
});

client.aliases = new Collection();
client.categories = fs.readdirSync("./commands/");

//na sei o que isto faz
const ownerID = "319582152989868034";
const active = new Map();

["command"].forEach(handler => {
	require(`./handler/${handler}`)(client);
});
client.once('ready', () => {
	console.log('Ready!');
	
	client.user.setPresence({
		status: "online",
		activity: {
		  name: ".help"
		}
	  });
});

client.once('reconnecting', () => {
	console.log('Reconnecting!');
});

client.once('disconnect', () => {
	console.log('Disconnect!');
});

client.on('message', async message => {
	if (message.author.bot) return;
	if (!message.guild) return;
	if (!message.content.startsWith(prefix)) return;
	if (!message.member)
		message.member = await message.guild.fetchMember(message);

	const args = message.content
		.slice(prefix.length)
		.trim()
		.split(/ +/g);
	const cmd = args.shift().toLowerCase();

	if (cmd.length === 0) return;
	let command = client.commands.get(cmd);

	if (!command) command = client.commands.get(client.aliases.get(cmd));
	let ops = {
		ownerID: ownerID,
		active: active
	};
	if (command) command.run(client, message, args, ops);
});


client.login(token);