const { Util } = require("discord.js");
const ytdl = require("ytdl-core");
const { MessageEmbed } = require("discord.js");
const Youtube = require('simple-youtube-api');
const { youtubeAPI } = require('../../config.json');
const youtube = new Youtube(youtubeAPI);

module.exports = {
	name: 'search',
    category: "music",
	description: 'Search a song!',
	async run(client, message, args, ops) {
        const queue = message.client.queue.get(message.guild.id);
        const query = args.join(" ");
		try {
			// search for the song and get 5 results back
			const videos = await youtube.searchVideos(query, 5);
			if (videos.length < 5) {
				return message.channel.send(
				`I had some trouble finding what you were looking for, please try again or be more specific`
				);
            }
			const vidNameArr = [];
			// create an array that contains the result titles
			for (let i = 0; i < videos.length; i++) {
				vidNameArr.push(`${i + 1}: ${videos[i].title}`);
			}
			vidNameArr.push('exit'); // push 'exit' string as it will be an option
			// create and display an embed which will present the user the 5 results
			// so he can choose his desired result
			const embed = new MessageEmbed()
				.setColor('#e9f931')
				.setTitle('Choose a song by commenting a number between 1 and 5')
				.addField('Song 1', vidNameArr[0])
				.addField('Song 2', vidNameArr[1])
				.addField('Song 3', vidNameArr[2])
				.addField('Song 4', vidNameArr[3])
				.addField('Song 5', vidNameArr[4])
				.addField('Exit', 'exit'); // user can reply with 'exit' if none matches
			var songEmbed = await message.channel.send({ embed });
			try {
				// wait 1 minute for the user's response
				var response = await message.channel.awaitMessages(
				msg => (msg.content > 0 && msg.content < 6) || msg.content === 'exit',
				{
					max: 1,
					maxProcessed: 1,
					time: 60000,
					errors: ['time']
				}
				);
				// assign videoIndex to user's response
				var videoIndex = parseInt(response.first().content);
			} catch (err) {
				console.error(err);
				songEmbed.delete();
				return message.channel.send(
				'Please try again and enter a number between 1 and 5 or exit'
				);
			}
			// if the user responded with 'exit', cancel the command
			if (response.first().content === 'exit') return songEmbed.delete();
			try {
				// get video data from the API
				var video = await youtube.getVideoByID(videos[videoIndex - 1].id);
			} catch (err) {
				console.error(err);
				songEmbed.delete();
				return message.channel.send(
				'An error has occured when trying to get the video ID from youtube'
				);
			}
			const url = `https://www.youtube.com/watch?v=${video.raw.id}`;
			const title = video.title;
			let duration = this.formatDuration(video.duration);
			const thumbnail = video.thumbnails.high.url;
            if (duration == '00:00') duration = 'Live Stream';
            const song = {
              url,
              title,
              duration,
              thumbnail
            };
            this.addQueue(song,queue,message);
        } catch (err) {
          // if something went wrong when calling the api:
          console.error(err);
          if (songEmbed) {
            songEmbed.delete();
          }
          return message.channel.send(
            'Something went wrong with searching the video you requested :('
          );
        }
	},
    async play(message, song) {
      const queue = message.client.queue;
      const guild = message.guild;
      const serverQueue = queue.get(message.guild.id);
  
      if (!song) {
        serverQueue.voiceChannel.leave();
        queue.delete(guild.id);
        return;
      }
  
      const dispatcher = serverQueue.connection
        .play(ytdl(song.url,{
          quality: "highestaudio",
          filter: "audioonly",
          highWaterMark: 1 << 25
        }))
        .on("finish", () => {
          serverQueue.songs.shift();
          this.play(message, serverQueue.songs[0]);
        })
        .on("error", error => console.error(error));
      dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
      serverQueue.textChannel.send(`Start playing: **${song.title}**`);
    },
    async addQueue(song,serverQueue, message){
        if (!serverQueue) {
            const voiceChannel = message.member.voice.channel;
            const queue = message.client.queue;
            const queueContruct = {
                textChannel: message.channel,
                voiceChannel: voiceChannel,
                connection: null,
                songs: [],
                volume: 5,
                playing: true
            };
    
            queue.set(message.guild.id, queueContruct);
    
            queueContruct.songs.push(song);
    
            try {
                var connection = await voiceChannel.join();
                queueContruct.connection = connection;
                this.play(message, queueContruct.songs[0]);
            } catch (err) {
                console.log(err);
                queue.delete(message.guild.id);
                return err;
            }
        } else {
            serverQueue.songs.push(song);
            serverQueue.textChannel.send(`${song.title} has been added to the queue!`);
        }           
    },formatDuration(durationObj) {
        const duration = `${durationObj.hours ? durationObj.hours + ':' : ''}${
          durationObj.minutes ? durationObj.minutes : '00'
        }:${
          durationObj.seconds < 10
            ? '0' + durationObj.seconds
            : durationObj.seconds
            ? durationObj.seconds
            : '00'
        }`;
        return duration;
      }
};
