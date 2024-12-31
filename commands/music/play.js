const { QueryType, useMainPlayer } = require('discord-player');
const { ApplicationCommandOptionType } = require('discord.js');
module.exports = {
    name: 'play',
    description: "play a song!",
    voiceChannel: true,
    options: [
        {
            name: 'song',
            description: 'the song you want to play',
            type: ApplicationCommandOptionType.String,
            required: true,
        }
    ],

    async execute({ inter }) {
		await inter.deferReply();
		const player = useMainPlayer();
        const song = inter.options.getString('song');
        const res = await player.search(song, {
            requestedBy: inter.member,
            searchEngine: QueryType.AUTO
        });
		
		//if(res.extractor.protocols.includes("youtube") || res.extractor.protocols.includes("spotify")) return inter.editReply({ content: `Can't use Youtube or Spotify at the moment, please use Soundcloud`, ephemeral: true });

        if (!res || !res.tracks.length) return inter.editReply({ content: `No results found ${inter.member}... try again ? ❌`, ephemeral: true });

        const queue = await player.nodes.create(inter.guild, {
            metadata: {
			},
            spotifyBridge: client.config.opt.spotifyBridge,
            initialVolume: client.config.opt.defaultvolume,
            leaveOnEnd: client.config.opt.leaveOnEnd
        });
		metadata = {
			channel: inter.channel,
			client: inter.guild.members.me,
			requestedBy: inter.user,
			inter: inter
		}
		queue.setMetadata(metadata)
        try {
            if (!queue.connection) await queue.connect(inter.member.voice.channel);
        } catch {
            await player.deleteQueue(inter.guildId);
            return inter.editReply({ content: `I can't join the voice channel ${inter.member}... try again ? ❌`, ephemeral: true});
        }

        await inter.editReply({ content:`Loading your ${res.playlist ? 'playlist' : 'track'}... 🎧`});

        res.playlist ? queue.addTrack(res.tracks) : queue.addTrack(res.tracks[0]);
        
        if (!queue.node.isPlaying()) await queue.node.play();
    },
};
