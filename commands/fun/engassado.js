const { MessageEmbed } = require("discord.js");
const { promptMessage } = require("../../util/functions.js");
const { prefix } = require("../../config.json");

module.exports = {
    name: "engassado",
    category: "fun",
    description: "És mesmo engassado",
    usage: `${prefix}engassado`,
    run: async(client, message, args) => {
        let subject="";
        if(args.length>0)
            subject = args.join(" ");
        else
            subject = "És mesmo engassado!";
        
        const embed = new MessageEmbed()
            .setColor("#ffffff")
            .setFooter(message.guild.me.displayName, client.user.displayAvatarURL)
            .setTitle(subject)
            .setTimestamp()
            .setImage("https://cdn.discordapp.com/attachments/569644985926943010/698526736392126494/engassado.png");
        
        message.channel.send(embed);
    }
}