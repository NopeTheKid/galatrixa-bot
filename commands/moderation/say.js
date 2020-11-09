const { RichEmbed } = require("discord.js");

module.exports = {
    name: "say",
    aliases: ["bc", "broadcast"],
    category: "moderation",
    description: "Says your input via BOT",
    usage: "<input>",
    run: async (client, message, args, ops) => {
        if ( message.deletable )
            message.delete();

        if ( args.length < 1 ) 
            return message.reply("Nothing to say").then(m => m.delete(3500));
        
        const roleColor = message.guild.me.displayHexColor === "#000000" ? "#ffffff" : message.guild.me.displayHexColor;

        if ( args[0].toLowerCase() === "embed" ) {
            const embed = new RichEmbed()
                .setColor(roleColor)
                .setDescription(args.slice(1).join(" "))
                .setTimestamp()
                .setAuthor(message.author.username, message.author.displayAvatarURL)
                .setFooter(client.user.username, client.user.displayAvatarURL);

            message.channel.send(embed);
        }
        else {
            message.channel.send(args.join(" "));
        }
    }
}