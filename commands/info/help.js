const { MessageEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");

module.exports = {
    name: "help",
    aliases: ["h"],
    category: "info",
    description: "Returns all comands or one specific command info",
    usage: "[command | alias]",
    run: async (client, message, args, ops) => {
        /*if (message.deletable)
            message.delete();

        message.reply("This command isn't available while under maintenance, please try again later! 🙂");*/
        if ( args[0] ) {
            return getCMD(client, message, args[0]);
        }
        else {
            return getAll(client, message);
        }
    }
}

function getAll(client, message) {
    const roleColor = message.guild.me.displayHexColor === "#000000" ? "#ffffff" : message.guild.me.displayHexColor;

    const embed = new MessageEmbed()
        .setColor(roleColor)

    const commands = (category) => {
        return client.commands
            .filter(cmd => cmd.category === category)
            .map(cmd => `- \`${cmd.name}\``)
            .join("\n");
    }

    const info = client.categories
        .map(cat => stripIndents`
        **${cat[0].toUpperCase() + cat.slice(1)}** \n${commands(cat)}`)
        .reduce((string, category) => string + "\n" + category);

    return message.channel.send(embed.setDescription(info).setFooter(`.help command for specific command details`));
}

function getCMD(client, message, input) {
    const embed = new MessageEmbed()

    const cmd = client.commands.get(input.toLowerCase()) || client.commands.get(client.aliases.get(input.toLowerCase()));

    let info = `No information found for the command **${input.toLowerCase()}**`;

    if ( !cmd ) {
        return message.channel.send(embed.setColor("RED").setDescription(info));
    }
    if ( cmd.name )
        info = `**Command name:** ${cmd.name}`;

    if ( cmd.aliases )
        info += `\n**Aliases:** ${cmd.aliases.map(a => `\`${a}\``).join(", ")}`;

    if ( cmd.description )
        info += `\n**Description:** ${cmd.description}`;

    if ( cmd.usage ) {
        info += `\n**Usage:** ${cmd.usage}`;
        embed.setFooter(`Syntax: <> = required, [] = optional`);
    }

    return message.channel.send(embed.setColor("RED").setDescription(info));
}