module.exports = {
    name: 'stop',
    description: 'stop the track',
    voiceChannel: true,

    execute({ inter }) {
        const queue = player.nodes.get(inter.guildId);

        if (!queue || !queue.node.isPlaying()) return inter.reply({ content:`No music currently playing ${inter.member}... try again ? ❌`, ephemeral: true });

        queue.delete();

        inter.reply({ content: `Music stopped intero this server, see you next time ✅`});
    },
};