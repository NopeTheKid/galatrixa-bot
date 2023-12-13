const { EmbedBuilder} = require('discord.js');
const jsdom = require("jsdom");
const { convert } = require('html-to-text');

module.exports = {
    name: "book",
    category: "galatrixa",
    description: "Galatrixa Book",
    async execute({inter}) {
        let steam_page = await jsdom.JSDOM.fromURL("https://steamcommunity.com/id/siiiiiim");
        steam_page = steam_page.window.document;
        let book = steam_page.getElementsByClassName("showcase_notes").item(0).innerHTML;

        let options={
            formatters:{},
            selectors:[{
                selector: "b",
                format: "inlineSurround",
                options:{
                    prefix: "***",
                    suffix: "***"
                }
            }]
        }

        book = convert(book, options);

        let embed = new EmbedBuilder()
            .setColor("#ff0000")
            .setTitle(`Frases de Vida by Galatrixa`)
            .setDescription(book);

		return inter.reply({embeds: [embed]});
    }
}