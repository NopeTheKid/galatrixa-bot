const { ApplicationCommandOptionType, ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require('discord.js');

player.events.on('error', (queue, error) => {
    console.log(`Error emitted from the queue {${error.message}}`);
});

player.events.on('playerError', (queue, error) => {
    console.log(`Error emitted from the connection ${error.message}`);
});

player.events.on('playerStart', async (queue, track) => {
    if (!client.config.opt.loopMessage && queue.repeatMode !== 0) return;
	iconURL = "https://cdn.discordapp.com/avatars/"+track.requestedBy.id+"/"+track.requestedBy.avatar+".png";
	
    const embed = new EmbedBuilder()
    .setAuthor({name: `Started playing ${track.title} 🎧`, iconURL: iconURL})
    .setColor('#13f857')

    const skip = new ButtonBuilder()
    .setLabel('Skip')
    .setCustomId(JSON.stringify({ffb: 'skip'}))
    .setStyle('Primary')

    const resumepause = new ButtonBuilder()
    .setLabel('Resume & Pause')
    .setCustomId(JSON.stringify({ffb: 'resume&pause'}))
    .setStyle('Danger')

    const loop = new ButtonBuilder()
    .setLabel('Loop')
    .setCustomId(JSON.stringify({ffb: 'loop'}))
    .setStyle('Secondary')
    
    const queuebutton = new ButtonBuilder()
    .setLabel('Queue')
    .setCustomId(JSON.stringify({ffb: 'queue'}))
    .setStyle('Secondary')

    const row1 = new ActionRowBuilder().addComponents(loop, resumepause, queuebutton, skip)
	
    await queue.metadata.inter.editReply({content:"",embeds: [embed], components: [row1] })
});

player.events.on('audioTrackAdd', async (queue, track) => {
	await queue.metadata.inter.editReply({content: `Track ${track.title} added in the queue ✅`, embeds:[], components:[]});
});

player.events.on('disconnect', async (queue) => {
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
