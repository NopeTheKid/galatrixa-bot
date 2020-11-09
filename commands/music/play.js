const { Util } = require("discord.js");
const ytdl = require("ytdl-core");
const { MessageEmbed } = require("discord.js");
const Youtube = require('simple-youtube-api');
const { youtubeAPI } = require('../../config.json');
const youtube = new Youtube(youtubeAPI);

module.exports = {
  name: "play",
  category: "music",
  aliases: ["p"],
  description: "Play a song in your channel!",
  async run(client, message, args, ops) {
    try {
	  const queue = message.client.queue.get(message.guild.id);
	  let query = args.join(" ");
      const voiceChannel = message.member.voice.channel;
      if (!voiceChannel)
        return message.channel.send(
          "You need to be in a voice channel to play music!"
        );
      const permissions = voiceChannel.permissionsFor(message.client.user);
      if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
        return message.channel.send(
          "I need the permissions to join and speak in your voice channel!"
        );
      }

    if (query.match(/^(?!.*\?.*\bv=)https:\/\/www\.youtube\.com\/.*\?.*\blist=.*$/)) {
		try {
			const playlist = await youtube.getPlaylist(query); // get playlist data 
			const videosObj = await playlist.getVideos(); // songs data object
			//const videos = Object.entries(videosObj); // turn the object to array
      // iterate through the videos array and make a song object out of each vid
      songs=[];
			for (let i = 0; i < videosObj.length; i++) { 
				const video = await videosObj[i].fetch();
				const url = `https://www.youtube.com/watch?v=${video.raw.id}`;
				const title = video.raw.snippet.title;
				let duration = this.formatDuration(video.duration);
				const thumbnail = video.thumbnails.high.url;
				if (duration == '00:00') duration = 'Live Stream';
				const song = {
					url,
					title,
					duration,
					thumbnail,
					voiceChannel
        };
        songs.push(song);
      }
			this.addQueue(songs,queue,message);
		} catch (err) {
			console.error(err);
			return message.channel.send('Playlist is either private or it does not exist');
		}
    }else if (query.match(/^(http(s)?:\/\/)?((w){3}.)?youtu(be|.be)?(\.com)?\/.+/)) {
      	const url = query; // temp variable
		try {
			query = query
			.replace(/(>|<)/gi, '')
			.split(/(vi\/|v=|\/v\/|youtu\.be\/)/);
			const id = query[2].split(/[^0-9a-z_\-]/i)[0];
			const video = await youtube.getVideoByID(id);
			const title = video.title;
			let duration = this.formatDuration(video.duration);
			const thumbnail = video.thumbnails.high.url;
      if (duration == '00:00') duration = 'Live Stream';
      songs=[];
			const song = {
			url,
			title,
			duration,
			thumbnail,
			voiceChannel
      };
      songs.push(song);
			this.addQueue(songs,queue,message);
		} catch (err) {
			console.error(err);
			return message.channel.send('Something went wrong, please try again later');
		}
    }else{
        try {
            // search for the song and get 5 results back
            let video = await youtube.searchVideos(query, 1);
            video = video[0];
            
            const url = `https://www.youtube.com/watch?v=${video.raw.id.videoId}`;
            const title = video.title;
            songs=[];
            const song = {
              url,
              title
            };
            songs.push(song);
            this.addQueue(songs,queue,message);
        } catch (err) {
          // if something went wrong when calling the api:
          console.error(err);/*
          if (songEmbed) {
            songEmbed.delete();
          }*/
          return message.channel.send(
            'Something went wrong with searching the video you requested :('
          );
        }
      }

      
    } catch (error) {
      console.log(error);
      message.channel.send(error.message);
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
      .play(ytdl(song.url,{quality: "highestaudio"}))
      .on("finish", () => {
        console.log()
        if(serverQueue.loopQ)
          serverQueue.songs.push(serverQueue.songs[0]);
        if(!serverQueue.loopM)
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
          playing: true,
          loopM: false,
          loopQ: false
        };
        queue.set(message.guild.id, queueContruct);
        song.forEach(s => {
          queueContruct.songs.push(s);
        });
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
        song.forEach(s => {
          serverQueue.songs.push(s);
        });
        if(song.title)
          serverQueue.textChannel.send(`${song.title} has been added to the queue!`);
        else
        serverQueue.textChannel.send(`Playlist has been added to the queue!`);
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
