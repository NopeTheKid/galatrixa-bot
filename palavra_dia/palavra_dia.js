const { DOMParser } = require('xmldom');
const { MessageEmbed } = require("discord.js");
let Parser = require('rss-parser');
const nodeHtmlToImage = require('node-html-to-image');
const fs = require('fs');
let parser = new Parser();
module.exports = {
    sendPalavraDia: function (channel, client, announce){
        let palavraDia;
        (async () => {

            let feed = await parser.parseURL('https://dicionario.priberam.org/DoDiaRSS.aspx');
        
            let item = feed.items[0];
        
            palavraDia = item.content;

            let xmlDoc = new DOMParser().parseFromString(palavraDia,"text/html");
            let xml = xmlDoc.getElementsByTagName("div")[0].childNodes[1].childNodes[1];
            
            // Gets length of the word to set the dimensions
            let wordLength = xml.childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].length;
            let imgWidth = 500;

            if(wordLength * 17 > imgWidth)
                imgWidth = wordLength * 17;
        
            palavraDia = `<html lang="en"><head><meta charset="UTF-8" />
            <style>
            body {
                font-family: "Poppins", Arial, Helvetica, sans-serif;
                background: rgb(22, 22, 22);
                color: #fff;
                max-width: `+imgWidth+`px;
                max-height: 60%;
            }
        
            .app {
                max-width: 700px;
                padding: 20px;
                display: flex;
                flex-direction: row;
                border-top: 3px solid rgb(16, 180, 209);
                background: rgb(31, 31, 31);
                align-items: center;
            }
        
            img {
                width: 70px;
                margin-right: 20px;
                border-radius: 50%;
                border: 1px solid #fff;
                padding: 5px;
            }
            </style></head><body>`+xml+`</body>`;
        
            const images = await nodeHtmlToImage({
            html: palavraDia,
            quality: 100,
            type: 'png',
            puppeteerArgs: {
                args: ['--no-sandbox'],
            },
            encoding: 'buffer',
            });

            //Delete img
            try{
                fs.unlinkSync('/home/nopearino/bottas/galatrixa-bot/img/palavraDia.png');
                console.log("Old image deleted");
            }catch(e){
                console.error(e);
            }
        
            await fs.writeFile('img/palavraDia.png', images, 'buffer', function(err){
                if (err) throw err
                console.log('File saved.')
            });
        
	        setTimeout(function(){}, 5000);

            let embed = new MessageEmbed()
            .setColor("#ff0000")
            .setTitle(`Palavra do Dia`)
            .attachFiles('img/palavraDia.png')
            .setImage('attachment://palavraDia.png')
            .setTimestamp();

			try {
				if(announce)
					channel.send(embed)
						.then((message) => {
                            message.crosspost();
                            let chnl = client.channels.cache.find(chnl => chnl.name === channel.name);	
                            let pDiaPosted = false;
                            chnl.messages.fetch({ limit: 1 }).then(messages => {
                                //Iterate through the messages here with the variable "messages".
                                messages.forEach(message => {
                                    // Check if already posted
                                    if(Array.isArray(message.embeds) && message.embeds != undefined && message.embeds.length > 0 && embedHasImage(message.embeds[0]) && message.embeds[0].title == "Palavra do Dia"){
                                        if(message.createdAt.getDate() == today.getDate() && message.createdAt.getMonth() == today.getMonth()){
                                            pDiaPosted = true;
                                        }
                                    }
                                    // If not posted, post
                                    if(pDiaPosted== false){
                                        throw "Not Posted"
                                    }
                                });
                            });
                        });
				else
					channel.send(embed);				
			} catch (error) {
				console.error("****************************************\nERROR : \n" + error + "****************************************")
				this.sendPalavraDia(channel, announce)
			}
        })();

    }
}
