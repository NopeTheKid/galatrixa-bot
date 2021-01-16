module.exports = {
	name: 'pause',
    category: "music",
	description: 'Pause the music',
	run(client, message, args, ops) {
		let queue = client.queue.get(message.guild.id);

    if ( queue && queue.playing ) {
        queue.playing = false;
        queue.connection.dispatcher.pause();
        return message.channel.send('🎵 Music has now been paused');
    }
        
    if(queue && !queue.playing)
        return message.channel.send('🎵 Music already paused!');

    return [message.delete(), message.channel.send('⚠ No musics are being played!')];
	},
};