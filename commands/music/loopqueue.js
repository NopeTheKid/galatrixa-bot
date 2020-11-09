module.exports = {
    name: "loopqueue",
    category: "music",
    aliases: ["lq"],
    description: "Loops the queue music",
    run: async (client, message, args) => {
        const queue = message.client.queue;
        const serverQueue = queue.get(message.guild.id);
        if (serverQueue){            
            serverQueue.loopM = false;
            if(!serverQueue.loopQ) {
                serverQueue.loopQ = true;
                message.reply("Looping queue :repeat:");
            }else{
                serverQueue.loopQ = false;
                message.reply("Stopped queue music :x::repeat::x:");
            }
        }else
            message.reply("There's no music playing");
    }
}