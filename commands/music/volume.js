module.exports = {
	name: 'volume',
    category: "music",
	description: 'Change the volume',
	run(client, message, args, ops) {
		let queue = client.queue.get(message.guild.id);
        if ( !queue )
         return [message.delete(), message.channel.send('⚠ No musics are being played.')];

        if ( !args[0] ) 
            return [message.delete(), message.channel.send(`🎵 Current Volume: **${queue.volume}/100**`)];

        if ( isNaN(args[0]) ) 
            return [message.delete(), message.channel.send(`${message.author}, please input a volume between 0 and 100!`)];

        if ( args[0] < 0 || args[0] > 100 ) 
            return [message.delete(), message.channel.send(`${message.author}, please input a volume between 0 and 100!`)];

        queue.volume = args[0];
        queue.connection.dispatcher.setVolumeLogarithmic(args[0] / 100);

        return message.channel.send(`🎵 Volume has now been set to **${queue.volume}/100**`);
	},
};
