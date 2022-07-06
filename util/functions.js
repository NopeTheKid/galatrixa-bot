const { Client, Collection } = require('discord.js');
const ytdl = require("ytdl-core");

module.exports = {
    constructor: function (config) {

        this.commands = new Collection();

        this.queue = new Map();

        this.config = config;
    },
    getMember: function (message, toFind = '') {
        toFind = toFind.toLowerCase();

        var regex_start = /^<@!/;
        var regex_send = />$/;

        toFind = toFind.replace(regex_start, "");
        toFind = toFind.replace(regex_send, "");

        let target = message.guild.members.fetch(toFind);

        if (!target && message.mentions.members)
            target = message.mentions.members.first();

        if (!target && toFind) {
            target = message.guild.members.find(member => {
                return member.displayName.toLowerCase().includes(toFind) ||
                    member.user.tag.toLowerCase().includes(toFind)
            });
        }

        if (!target)
            target = message.guild.member(message.author);

        return target;
    }, promptMessage: async function (message, author, time, validReactions) {
        time *= 1000;

        for (const reaction of validReactions)
            await message.react(reaction);

        const filter = (reaction, user) => validReactions.includes(reaction.emoji.name) && user.id === author.id;

        return message
            .awaitReactions(filter, { max: 1, time: time })
            .then(collected => collected.first() && collected.first().emoji.name);
    }, async play(message, song) { //play music from youtube
        const queue = message.client.queue;
        const guild = message.guild;
        const serverQueue = queue.get(message.guild.id);

        if (!song) {
            serverQueue.voiceChannel.leave();
            queue.delete(guild.id);
            return;
        }

        const dispatcher = serverQueue.connection
            .play(ytdl(song.url, {
                quality: "highestaudio",
                filter: "audioonly",
                highWaterMark: 1 << 25
            }))
            .on("finish", () => {
                if(!serverQueue.loopM && !serverQueue.loopQ)
                    serverQueue.songs.shift();
                else if(serverQueue.loopQ){
                    serverQueue.songs.push(serverQueue.songs[0]);
                    serverQueue.songs.shift(); 
                }
                this.play(message, serverQueue.songs[0]);
            })
            .on("error", error => console.error(error));
        dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
        serverQueue.textChannel.send(`Start playing: **${song.title}**`);
    }, async addQueue(song, serverQueue, message, fun = false) { //add music to the queue
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

            if (song.title)
                queueContruct.songs.push(song);
            else
                song.forEach(s => {
                    queueContruct.songs.push(s);
                });

            try {
                var connection = await voiceChannel.join();
                queueContruct.connection = connection;
                module.exports.play(message, queueContruct.songs[0]);
            } catch (err) {
                console.log(err);
                queue.delete(message.guild.id);
                return err;
            }
        } else {
            if (fun) {
                /****************************************************************** */
                /**                         WARNING                                 */
                /**     THIS METHOD IS MODIFIED FOR THIS SPECIAL OCASION            */
                /**     ADDING A SONG TO THE QUEUE PUTS IT AT THE TOP !             */
                /**     PROGRAMER DISCRETION IS ADVISED !                           */
                /**     DON'T BLAME ME FOR YOUR LACK OF ATTENCION FOR THE COMMENTS! */
                /**     -NopeTheKid                                                 */
                /****************************************************************** */
                ///let temp= [];
                //temp.push(song);
                //temp.push(serverQueue);
                serverQueue.connection.dispatcher.end();
                serverQueue.songs.unshift(song);// this will be skipped when it plays
                serverQueue.songs.unshift(song);
                serverQueue.textChannel.send(`${song.title} has been added to the queue!`);
            } else {
                i = 0;
                if (song.title)
                    queueContruct.songs.push(song);
                else
                    song.forEach(s => {
                        serverQueue.songs.push(s);
                        i++;
                    });
                if (song.title)
                    serverQueue.textChannel.send(`${song.title} has been added to the queue!`);
                else if (i <= 1)
                    serverQueue.textChannel.send(`${song[0].title} has been added to the queue!`);
                else
                    serverQueue.textChannel.send(`Playlist has been added to the queue!`);
            }
        }
    }
}