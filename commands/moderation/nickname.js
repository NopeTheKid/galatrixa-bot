const { MessageEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");

module.exports = {
    name: "nickname",
    category: "moderation",
    description: "Change the nickname of an user",
    usage: "<mention | id> <new_nickname>",
    run: async (client, message, args, ops) => {
        if ( message.deletable )
            message.delete();

        let rMember = message.mentions.members.first() || message.guild.members.get(args[0]);
        let rAuthor = message.guild.members.cache.get(message.author.id);

        //find member
        if ( !rMember )
            return message.reply("Couldn't find that member!");

        //check if author has permission and if the member is a bot
        if ( !rAuthor.hasPermission("MANAGE_NICKNAMES") || rMember.user.bot )
            return message.reply("You can't change the nickname of that member!");

        args.shift();
        args = args.join(" ");
        
        //check reason
        if ( !args || args === ""){
            if (rMember.user.id==321325440633536523n){
                rMember.setNickname("tomo no cu e nao me importo");
                return message.reply("Nickname changed!");
            }
            rMember.setNickname(rMember.user.username);
            return message.reply("Nickname deleted!");
        }
        rMember.setNickname(args);

        return message.reply("Nickname changed!");
    }
}