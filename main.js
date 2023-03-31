const { Player } = require('discord-player');
const { Client, GatewayIntentBits } = require('discord.js');
const palavraDia = require('./palavra_dia/palavra_dia.js');
const cron = require("node-cron");

global.client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.MessageContent
    ],
   disableMentions: 'everyone',
});

client.config = require('./config');

global.player = new Player(client, client.config.opt.discordPlayer);

require('./src/loader');
require('./src/events');

client.on('ready', client => {
	/*
	 *	PALAVRA DO DIA
	 */
	 let channel = client.channels.cache.get('872539780305526864');	// palavra-do-dia
	 //let channel = client.channels.cache.get('773467416742330368'); // bot-test DEBUG
		 
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
})

client.login(client.config.app.token);

function embedHasImage(msgEmbed) {// Check if message embed has an image attached 
	return msgEmbed.image != null;
}