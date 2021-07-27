const { MessageEmbed } = require("discord.js");
const ytdl = require("ytdl-core");
const { prefix } = require("../../config.json");

module.exports = {
    name: "rip",
    category: "fun",
    description: "RIP in peace",
    usage: `${prefix}rip`,
    async run(client, message, args) {
        //creates embed
        let subject = args.join(" ");
        if(subject != "")
            subject = " "+subject;
        let title = `RIP in peaces${subject}.`;
        const embed = new MessageEmbed()
            .setColor("#ffffff")
            .setFooter(message.guild.me.displayName, client.user.displayAvatarURL)
            .setTitle(title)
            .setTimestamp()
            .setImage("https://cdn.discordapp.com/attachments/569645330107334659/669972015763030046/rip_gltx.png");
        
        //adds song to the queue
        const queue = message.client.queue.get(message.guild.id);
        let url = "https://www.youtube.com/watch?v=WChTqYlDjtI";
        const song = {
            url,
            title
        };

        await this.addQueue(song,queue,message);

        //sends embed
        message.channel.send(embed);
    },async play(message, song) { //play music from youtube
      const queue = message.client.queue;
      const guild = message.guild;
      const serverQueue = queue.get(message.guild.id);
  
      if (!song) {
        serverQueue.voiceChannel.leave();
        queue.delete(guild.id);
        return;
      }
  
      const dispatcher = serverQueue.connection
        .play(ytdl(song.url))
        .on("finish", () => {
          serverQueue.songs.shift();
          this.play(message, serverQueue.songs[0]);
        })
        .on("error", error => console.error(error));
      dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
      serverQueue.textChannel.send(`Start playing: **${song.title}**`);
    },async addQueue(song,serverQueue, message){ //add music to the queue
        /****************************************************************** */
        /**                         WARNING                                 */
        /**     THIS METHOD IS MODIFIED FOR THIS SPECIAL OCASION            */
        /**     ADDING A SONG TO THE QUEUE PUTS IT AT THE TOP !             */
        /**     PROGRAMER DISCRETION IS ADVISED !                           */
        /**     DON'T BLAME ME FOR YOUR LACK OF ATTENCION FOR THE COMMENTS! */
        /**     -NopeTheKid                                                 */
        /****************************************************************** */
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
            ///let temp= [];
            //temp.push(song);
            //temp.push(serverQueue);
            serverQueue.connection.dispatcher.end();
            serverQueue.songs.unshift(song);// this will be skipped qhen it plays
            serverQueue.songs.unshift(song);
            serverQueue.textChannel.send(`${song.title} has been added to the queue!`);
        }
    }
}