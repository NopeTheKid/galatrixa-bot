module.exports = {
    name: "loop",
    category: "music",
    aliases: ["l"],
    description: "Loops music",
    run: async (client, message, args) => {
        const queue = message.client.queue;
        const serverQueue = queue.get(message.guild.id);
        if (serverQueue){            
            serverQueue.loopQ = false;
            if(!serverQueue.loopM) {
                serverQueue.loopM = true;
                message.reply("Looping music :repeat_one:");
            }else{
                serverQueue.loopM = false;
                message.reply("Stopped looping music :x::repeat_one::x:");
            }
        }
        else
            message.reply("There's no music playing");
    }
}