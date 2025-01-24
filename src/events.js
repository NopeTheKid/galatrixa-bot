const { ApplicationCommandOptionType, ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require('discord.js');
const { QueryType, useMainPlayer } = require('discord-player');

player.events.on('error', (queue, error) => {
    console.log(`Error emitted from the queue {${error.message}}`);
});

player.events.on('playerError', (queue, error) => {
    console.log(`Error emitted from the connection ${error.message}`);
});

player.events.on('playerStart', async (queue, track) => {
    if (!client.config.opt.loopMessage && queue.repeatMode !== 0) return;
	await sendReply(`Now playing ${track.title} 🎧`, queue, track);    
});

player.events.on('playerTrigger', async (queue, track) => {
    let random = Math.floor(Math.random() * 100);
    if(random <= 1){
        const player = useMainPlayer();
        const res = await player.search('https://www.youtube.com/watch?v=3-y0p0GL4TI', {
            requestedBy: client.user,
            searchEngine: QueryType.AUTO
        });
        queue.addTrack(res.tracks[0]);
        queue.moveTrack(queue.getSize()-1,0);
        queue.node.skip();
        await sendReply(`Now playing ${track.title} 🎧`, queue, track);
    }
});

player.events.on('audioTrackAdd', async (queue, track) => {
    await sendReply(`Track ${track.title} added in the queue ✅`, queue, track);
});

player.events.on('playerPause', async (queue, track) => {
    await sendReply(`Track ${track.title} paused ⏸️`, queue, track);
});

player.events.on('playerResume', async (queue, track) => {
    await sendReply(`Track ${track.title} resumed ▶️`, queue, track);
});

player.events.on('disconnect', async (queue) => {
	console.log("Disconnected...");
    await queue.metadata.inter.editReply({content: 'I was disconnected from the voice channel, clearing queue... ❌', embeds:[], components:[]});
});

player.events.on('emptyChannel', async (queue) => {
    await queue.metadata.inter.editReply({content: 'Nobody is in the voice channel, leaving the voice channel... ❌', embeds:[], components:[]});
});

player.events.on('emptyQueue', async (queue) => {
    await queue.metadata.inter.editReply({content: 'I finished reading the whole queue ✅', embeds:[], components:[]});
});

player.events.on('audioTracksAdd', async (queue, tracks) => {
    await queue.metadata.inter.editReply({content: `All the songs in playlist added into the queue ✅`, embeds:[], components:[]});
});

async function sendReply(message, queue, track){
    iconURL = "https://cdn.discordapp.com/avatars/"+track.requestedBy.id+"/"+track.requestedBy.avatar+".png";
	
    const embed = new EmbedBuilder()
    .setAuthor({name: message, iconURL: iconURL})
    .setColor('#13f857')

    const skip = new ButtonBuilder()
    .setLabel('⏭️')
    .setCustomId(JSON.stringify({ffb: 'skip'}))
    .setStyle('Secondary')

    const resumepause = new ButtonBuilder()
    .setLabel('⏯️')
    .setCustomId(JSON.stringify({ffb: 'resume&pause'}))
    .setStyle('Secondary')

    const loop = new ButtonBuilder()
    .setLabel('🔁')
    .setCustomId(JSON.stringify({ffb: 'loop'}))
    .setStyle('Secondary')

    const shuffle = new ButtonBuilder()
    .setLabel('🔀')
    .setCustomId(JSON.stringify({ffb: 'shuffle'}))
    .setStyle('Secondary')
    
    const queuebutton = new ButtonBuilder()
    .setLabel('Queue')
    .setCustomId(JSON.stringify({ffb: 'queue'}))
    .setStyle('Secondary')

    const row1 = new ActionRowBuilder().addComponents(resumepause, skip, loop, shuffle, queuebutton)
    await queue.metadata.inter.editReply({content:"",embeds: [embed], components: [row1] })
}