const { MessageEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
const { promptMessage } = require("../../util/functions.js");

module.exports = {
    name: "kick",
    category: "moderation",
    description: "Kicks the member",
    usage: "<id | mention>",
    run: async (client, message, args, ops) => {
        const logChannel = message.guild.channels.cache.find(c => c.name === "logs") || message.channel;

        if ( message.deletable )
            message.delete();

        if ( !args[0] ) {
            m = await message.reply("Please provide a member to kick");
            return m.delete({ timeout: 5000 });
        }

        if ( !args[1] ) {
            m = await message.reply("Please provide a reason to kick");
            return m.delete({ timeout: 5000 });
        }

        if ( !message.member.hasPermission("KICK_MEMBERS") ) {
            m = await message.reply("❌ You don't have permissions to kick members. Please contact an Admin member!");
            return m.delete({ timeout: 5000 });
        }

        if ( !message.guild.me.hasPermission("KICK_MEMBERS") ) {
            m = await message.reply("❌ I don't have permissions to kick members. Please contact an Admin member!");
            return m.delete({ timeout: 5000 });
        }

        const toKick = message.mentions.members.first() || message.guild.members.get(args[0]);

        if ( !toKick ) {
            m = await message.reply("❌ Couldn't found that member!");
            return m.delete({ timeout: 5000 });
        }

        if ( message.author.id === toKick.id ) {
            m = await message.reply("Can´t kick yourself, if you want just leave 😉");
            return m.delete({ timeout: 5000 });
        }

        if ( !toKick.kickable ) {
            m = await message.reply("I can´t kick that person! 😐");
            return m.delete({ timeout: 5000 });
        }

        const embed = new MessageEmbed()
            .setColor("#ff0000")
            .setThumbnail(toKick.user.displayAvatarURL)
            .setFooter(message.member.displayName, message.author.displayAvatarURL)
            .setTimestamp()
            .setDescription(stripIndents`
            **Kicked member:** ${toKick} (${toKick.id})
            **Kicked by:** ${message.author} (${message.author.id})
            **Reason:** ${args.slice(1).join(" ")}`);

        const promptEmbed = new MessageEmbed()
            .setColor("YELLOW")
            .setAuthor("This verification becomes invalid after 30s")
            .setDescription(`Do you want to kick ${toKick}?`);

        message.channel.send(promptEmbed).then(async msg => {
            const emoji = await promptMessage(msg, message.author, 30, ["✅", "❌"]);

            if ( emoji  === "✅"  ) {
                msg.delete();

                toKick.kick(args.slice(1).join(" "))
                    .catch(err => {
                        if ( err  )
                            return message.channel.send(`Well... Something went wrong. 😐`);
                    });

                logChannel.send(embed);
            }
            else if ( emoji === "❌" ) {
                msg.delete();

                m = await message.reply("Kick cancelled...");
                return m.delete({ timeout: 5000 });
            }
        });
    }
}