module.exports = {
    name: "clear",
    aliases: ["purge", "nuke"],
    category: "moderation",
    description: "Clears the chat",
    run: async (client, message, args) => {
        if (message.deletable) message.delete();

        if (!message.member.hasPermission("MANAGE_MESSAGES")) 
            return message.reply("You do not have permission to delete messages... 😐").then(m => m.delete(3500));

        if (isNaN(args[0]) || parseInt(args[0]) <= 0)
            return message.reply("Sorry, that's not a number... btw I also can't delete 0 messages... 😐").then(m => m.delete(3500));

        if (!message.guild.me.hasPermission("MANAGE_MESSAGES"))
            return message.reply("Sorry, I can't delete messages... please contact an Admin. 😐");

        let deleteAmount;

        if (parseInt(args[0]) > 50)
            deleteAmount = 100;
        else
            deleteAmount = parseInt(args[0]);

        message.channel.bulkDelete(deleteAmount, true)
            .then(deleted => message.channel.send(`I deleted \`${deleted.size}\` messages.`))
            .catch(err => message.reply(`Something went wrong... 😐 (${err})`));
    }
}