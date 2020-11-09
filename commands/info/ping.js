const { RichEmbed } = require("discord.js");

module.exports = {
    name: "ping",
    category: "info",
    description: "Returns latency and API ping",
    run: async (client, message, args, ops) => {
		const msg = await message.channel.send(`Pinging... :hourglass_flowing_sand:`);
		msg.edit(`Results:\nLatency: ${Math.floor(msg.createdAt - message.createdAt)}\nAPI Latency: ${Math.round(client.ping)}ms`);
    }
}