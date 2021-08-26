const { MessageEmbed } = require("discord.js");

module.exports = {
	name: 'queue',
    category: "music",
	description: 'Show the queue',
	run(client, message, args, ops) {
        const serverQueue = message.client.queue.get(message.guild.id);
        if(serverQueue){    
            const embed = new MessageEmbed()
                .setColor('#e9f931')
                .setTitle('Queue');
            let i=1;
            serverQueue.songs.forEach(song => {
                embed.addField('#'+i,song.title+" ("+song.url+")");
                i++;
            });
            return message.channel.send({ embed });
        }else
            message.reply("There's no music playing");
	},
};