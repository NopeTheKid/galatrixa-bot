const maxVol = client.config.opt.maxVol;
module.exports = async ({  inter, queue }) => { 
    if (!queue || !queue.node.isPlaying()) return inter.reply({ content: `No music currently playing... try again ? ❌`, ephemeral: true });
    if (!inter.member.voice.channel) return inter.reply({ embeds: [ new EmbedBuilder().setColor('#ff0000').setDescription(`❌ | You are not in a Voice Channel`)], ephemeral: true, })
    if (inter.guild.members.me.voice.channel && inter.member.voice.channel.id !== inter.guild.members.me.voice.channel.id) return inter.reply({ embeds: [ new EmbedBuilder().setColor('#ff0000').setDescription(`❌ | You are not in the same Voice Channel`)], ephemeral: true, })

    const vol = Math.floor(queue.node.volume + 5)

    if (vol > maxVol ) return inter.reply({ content: `I can not move the volume up any more ${inter.member}... try again ? ❌`, ephemeral: true })

    if (queue.node.volume === vol) return inter.reply({ content: `The volume you want to change is already the current one ${inter.member}... try again ? ❌`, ephemeral: true });
    
    let success = false;
    try{
        queue.node.setVolume(vol);
        success = true;
    }catch(e){
        console.log(e)
    }

    return inter.reply({ content:success ? `The volume has been modified to **${vol}**/**${maxVol}**% 🔊` : `Something went wrong ${inter.member}... try again ? ❌`, ephemeral: true});
}