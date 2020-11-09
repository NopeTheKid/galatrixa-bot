const { Client, Collection } = require('discord.js');

module.exports = {
    constructor: function(config){

		this.commands = new Collection();

		this.queue = new Map();

		this.config = config;
    },
    getMember: function(message, toFind = '') {
        toFind = toFind.toLowerCase();

        var regex_start = /^<@!/;
        var regex_send = />$/;

        toFind = toFind.replace(regex_start,"");
        toFind = toFind.replace(regex_send,"");

        let target = message.guild.members.fetch(toFind);

        if ( !target && message.mentions.members )
            target = message.mentions.members.first();

        if ( !target && toFind ) {
            target = message.guild.members.find(member => {
                return member.displayName.toLowerCase().includes(toFind) ||
                member.user.tag.toLowerCase().includes(toFind)
            });
        }

        if ( !target )
            target = message.guild.member(message.author);

        return target;
    },
    promptMessage: async function(message, author, time, validReactions) {
        time *= 1000;

        for ( const reaction of validReactions ) 
            await message.react(reaction);

        const filter = (reaction, user) => validReactions.includes(reaction.emoji.name) && user.id === author.id;

        return message
            .awaitReactions(filter, {max: 1, time: time})
            .then(collected => collected.first() && collected.first().emoji.name );
    }
}