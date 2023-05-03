module.exports = async ({  inter, queue }) => {
    if (!queue) return inter.reply({ content: `No music currently playing... try again ? ❌`, ephemeral: true });
    if (!inter.member.voice.channel) return inter.reply({ embeds: [ new EmbedBuilder().setColor('#ff0000').setDescription(`❌ | You are not in a Voice Channel`)], ephemeral: true, })
    if (inter.guild.members.me.voice.channel && inter.member.voice.channel.id !== inter.guild.members.me.voice.channel.id) return inter.reply({ embeds: [ new EmbedBuilder().setColor('#ff0000').setDescription(`❌ | You are not in the same Voice Channel`)], ephemeral: true, })

    const success = queue.node.pause();
    
    if (!success) queue.node.resume();
    

    return inter.reply({ content: `${success ? `Current music ${queue.currentTrack.title} paused ✅` : `Current music ${queue.currentTrack.title} resumed ✅`}`, ephemeral: true});
}