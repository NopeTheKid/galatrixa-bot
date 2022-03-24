const { MessageEmbed } = require("discord.js");
const { promptMessage } = require("../../util/functions.js");
const { prefix } = require("../../config.json");
const fs = require('fs').promises;

module.exports = {
    name: "misosoup",
    category: "fun",
    description: "Miso Soup",
    usage: `${prefix}misosoup`,
    run: async (client, message, args) => {
        let subject = "Miso Soup";

        const data = await fs.readFile('util/miso_counter.txt', 'utf8');
		let counter = parseInt(data);
		counter++;
		counter = counter.toString();
		await fs.writeFile('util/miso_counter.txt', counter, 'utf8', function(err){
            if (err) throw err
		});
        
        const embed = new MessageEmbed()
                .setColor("#ffffff")
                .setFooter(message.guild.me.displayName, client.user.displayAvatarURL)
                .setTitle(subject)
                .setTimestamp().addFields(
                    { name: 'Miso Soup Counter', value: counter },
                )
                .setImage("https://cdn.discordapp.com/attachments/954365745523982356/956500409734799411/miso_soup.png");
            
        
        message.channel.send(embed);
  
    }
}