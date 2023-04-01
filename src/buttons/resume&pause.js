module.exports = async ({  inter, queue }) => {
    if (!queue) return inter.reply({ content: `No music currently playing... try again ? ❌`, ephemeral: true });

    const success = queue.node.pause();
    
    if (!success) queue.node.resume();
    

    return inter.reply({ content: `${success ? `Current music ${queue.currentTrack.title} paused ✅` : `Current music ${queue.currentTrack.title} resumed ✅`}`, ephemeral: true});
}