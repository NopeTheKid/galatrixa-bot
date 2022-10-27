const fs = require('fs')
const {Collection, GuildMember} = require('discord.js');
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
		
	// Create cron job por posting everyday at 8AM
	const cronDate = '00 08 * * *';
	
	let today = new Date();
	cron.schedule(cronDate, () =>{
		palavraDia.sendPalavraDia(channel, client, true);
	}, {
		scheduled:true, 
		timezone:"Atlantic/Madeira"
	});

	// Check last message
	let pDiaPosted = false;

	channel.messages.fetch({ limit: 1 }).then(messages => {
		//Iterate through the messages here with the variable "messages".
		messages.forEach(message => {
			// Check if already posted
			if(Array.isArray(message.embeds) && message.embeds != undefined && message.embeds.length > 0 && embedHasImage(message.embeds[0]) && message.embeds[0].title == "Palavra do Dia"){
				if(message.createdAt.getDate() == today.getDate() && message.createdAt.getMonth() == today.getMonth()){
					pDiaPosted = true;
				}
			}
			// If not posted, post
			if(pDiaPosted==false && today.getHours() > 8){
				palavraDia.sendPalavraDia(channel, client, true);
			}
		});
	});
	/*
	 *	/PALAVRA DO DIA
	 */
});

client.on('reconnecting', () => {
	console.log('Reconnecting!');
});

client.on('disconnect', () => {
	console.log('Disconnect!');
});

/** Delete music queue on disconnect */
client.on('voiceStateUpdate', (oldState, newState) => { 
	if (oldState.channelID === null || typeof oldState.channelID == 'undefined') return;
	if (newState.id !== client.user.id) return;
	const serverQueue = client.queue.get(oldState.guild.id);
	if(serverQueue != undefined){
		client.queue.delete(oldState.guild.id);
	}
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

/** FUNCTIONS */

/** Check if message embed has an image attached 
 *  Returns true if has message
*/
function embedHasImage(msgEmbed) {
    return msgEmbed.image != null;
}