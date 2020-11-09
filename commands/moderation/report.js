const { MessageEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");

module.exports = {
    name: "report",
    category: "moderation",
    description: "Reports a member",
    usage: "<mention | id> <reason>",
    run: async (client, message, args, ops) => {
        if ( message.deletable )
            message.delete();

        let rMember = message.mentions.members.first() || message.guild.members.get(args[0]);
        let rAuthor = message.guild.members.cache.get(message.author.id);

        //find member
        if ( !rMember )
            return message.reply("Couldn't find that member!").then(m => m.delete(5000));

        //check if author has permission and if the member is a bot
        if ( !rAuthor.hasPermission("BAN_MEMBERS") || rMember.user.bot )
            return message.reply("Can't report that member!").then(m => m.delete(5000));

        //check reason
        if ( !args[1] )
            return message.channel.send("Please provide a reason for the report!").then(m => m.delete(5000));

        const channel = message.guild.channels.cache.find(channel => channel.name === "reports");

        //check if text channel #reports exist
        if ( !channel )
            return message.channel.send("Couldn't find a \`#reports\` channel!").then(m => m.delete(5000));

        const embed = new MessageEmbed()
            .setColor("$ff0000")
            .setTimestamp()
            .setFooter(message.guild.name, message.guild.iconURL)
            .setAuthor("Reported member: ", rMember.user.displayAvatarURL)
            .setDescription(stripIndents`
            **Member:** ${rMember} (${rMember.id})
            **Reported by:** ${message.member} (${message.member.id})
            **Reported in:** ${message.channel}
            **Reason:** ${args.slice(1).join(" ")}`);

        return channel.send(embed);
    }
}