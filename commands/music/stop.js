module.exports = {
	name: 'stop',
    category: "music",
	description: 'Stop all songs in the queue!',
	run(client, message, args, ops) {
		const serverQueue = message.client.queue.get(message.guild.id);
		if (!message.member.voice.channel) return message.channel.send('You have to be in a voice channel to stop the music!');
		serverQueue.songs = [];
		//client.voice.connections.get(message.guild.id).dispatcher.end();
		client.voice.connections.get(message.guild.id).dispatcher.end();
	},
};