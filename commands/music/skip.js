module.exports = {
	name: 'skip',
    category: "music",
	description: 'Skip a song!',
	run(client, message, args, ops) {
		const serverQueue = message.client.queue.get(message.guild.id);
		if (!message.member.voice.channel) return message.channel.send('You have to be in a voice channel to stop the music!');
		if (!serverQueue) return message.channel.send('There is no song that I could skip!');

		if(serverQueue.loopQ){
		  serverQueue.songs.push(serverQueue.songs[0]);
		  serverQueue.songs.pop(0);
		}
        if(serverQueue.loopM){		
		  serverQueue.songs.unshift(serverQueue.songs[0]);
		  serverQueue.songs.shift();
		}
		  
		serverQueue.connection.dispatcher.end();
	},
};