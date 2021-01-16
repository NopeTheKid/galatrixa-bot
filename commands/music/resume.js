module.exports = {
	name: 'resume',
    category: "music",
	description: 'Resume the music',
	run(client, message, args, ops) {
		let queue = client.queue.get(message.guild.id);

        if ( queue && !queue.playing ) {
            queue.playing = true;
            queue.connection.dispatcher.resume();
            return message.channel.send('🎵 Music has now been resumed!');
        }

        if(queue && queue.playing && queue.songs != [])
            return message.channel.send('🎵 Music already playing!');

        return [message.delete(), message.channel.send('⚠ No musics are being played!')];
	},
};