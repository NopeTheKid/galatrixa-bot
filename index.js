const fs = require('fs')
const {Collection} = require('discord.js');
const Client = require('./client/Client');
const palavraDia = require('./palavra_dia/palavra_dia.js');
var cron = require("node-cron");
const {
	prefix,
	token,
} = require('./config.json');
const { channel } = require('diagnostics_channel');

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

	/*
	 *	PALAVRA DO DIA
	 */
	let channel = client.channels.cache.find(channel => channel.name === "palavra-do-dia");	
	//let channel = client.channels.cache.find(channel => channel.name === "bot-test"); // DEBUG
	
	const cronDate = '00 08 * * *';
	//console.log("-----------------------\nconDate: "+cron.validate(cronDate)+"\n-----------------------"); // DEBUG
	
	// Create cron job por posting everyday at 8AM
	cron.schedule(cronDate, () =>{
		palavraDia.sendPalavraDia(channel, true);
	}, {
		scheduled:true, 
		timezone:"Atlantic/Madeira"
	});
		
	/* DEBUG
	setInterval(() => {
		console.log(new Date);
	},1000);
	*/
	
	// Check last message
	let pDiaPosted = false;
	channel.messages.fetch({ limit: 1 }).then(messages => {
		//Iterate through the messages here with the variable "messages".
		messages.forEach(message => {
			// Check if already posted
			if(Array.isArray(message.embeds) && message.embeds != undefined && message.embeds[0].title == "Palavra do Dia"){
				const today = new Date();
				if(message.createdAt.getDate() == today.getDate() && message.createdAt.getMonth() == today.getMonth()){
					pDiaPosted = true;
				}
			}

			// If not posted, post
			if(pDiaPosted==false){
				palavraDia.sendPalavraDia(channel, true);
			}
		});
	});
	/*
	 *	/PALAVRA DO DIA
	 */
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
