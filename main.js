const { Player } = require('discord-player');
const { DefaultExtractors } = require('@discord-player/extractor');
const { YoutubeiExtractor } = require("discord-player-youtubei")
const { Client, GatewayIntentBits } = require('discord.js');
const palavraDia = require('./palavra_dia/palavra_dia.js');
const cron = require("node-cron");
globalThis.crypto ??= require("node:crypto").webcrypto

const DEBUG = 0;

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

global.player.extractors.loadMulti(DefaultExtractors);
global.player.extractors.register(YoutubeiExtractor, {});


require('./src/loader');
require('./src/events');

if(DEBUG)
    client.on('debug', debug => {console.log(debug)})

client.on('ready', client => {
	/*
	 *	PALAVRA DO DIA
	 */
    if(DEBUG)
	    var channel = client.channels.cache.get('1323639291640942672'); // bot-test DEBUG
    else
	    var channel = client.channels.cache.get('872539780305526864');	// palavra-do-dia
		 
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
				if(message.createdAt.getDate() == today.getDate() && message.createdAt.getMonth() == today.getMonth() && !DEBUG){
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