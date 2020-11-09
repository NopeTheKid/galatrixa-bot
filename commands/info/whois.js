const { getMember } = require("../../util/functions.js");
const { MessageEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");

module.exports = {
    name: "whois",
    aliases: ["userinfo", "user", "who"],
    category: "info",
    description: "Returns user information",
    usage: "[username | id, | mention]",
    run: async (client, message, args, ops) => {
        args = args.join(" ");
        
        if (args=="")
            args = message.author.id;
            
        const member = await getMember(message, args);

        const roles = member.roles.cache
            .filter(r => r.id !== message.guild.id)
            .map(r => r)
            .join(", ") || "none";

        const embed = new MessageEmbed()
            .setFooter(member.displayName, member.user.displayAvatarURL)
            .setThumbnail(member.user.displayAvatarURL)
            .setColor(member.displayHexColor === "#000000" ? "#ffffff" : member.displayHexColor)

            .addField('Member Information', stripIndents`
            **Display name:** ${member.displayName}
            **Joined at:** ${member.joinedAt}
            **Roles:** ${roles}`, true)

            .addField('User Information', stripIndents`
            **ID:** ${member.user.id}
            **Username:** ${member.user.username}
            **Discord Tag:** ${member.user.tag}
            **Created at:** ${member.user.createdAt}`, true)

            .setTimestamp();

        if ( member.user.presence.game )
            embed.addField('Currently playing', `**Name:** ${member.user.presence.game.name}`);

        message.channel.send(embed);
    }
}