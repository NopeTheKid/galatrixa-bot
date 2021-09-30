const { DOMParser } = require('xmldom');
const { MessageEmbed } = require("discord.js");
let Parser = require('rss-parser');
const nodeHtmlToImage = require('node-html-to-image');
const fs = require('fs');
let parser = new Parser();
module.exports = {
    sendPalavraDia: function (channel, announce){
        let palavraDia;
        (async () => {

            let feed = await parser.parseURL('https://dicionario.priberam.org/DoDiaRSS.aspx');
        
            let item = feed.items[0];
        
            palavraDia = item.content;

            let xmlDoc = new DOMParser().parseFromString(palavraDia,"text/html");
            let xml = xmlDoc.getElementsByTagName("div")[0].childNodes[1].childNodes[1];
            
            // Gets length of the word to set the dimensions
            let wordLength = xml.childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].length;
            let imgWidth = 300;

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
        
            await fs.writeFile('img/palavraDia.png', images, 'buffer', function(err){
            if (err) throw err
            console.log('File saved.')
            });
        
            let embed = new MessageEmbed()
            .setColor("#ff0000")
            .setTitle(`Palavra do Dia`)
            .attachFiles('img/palavraDia.png')
            .setImage('attachment://palavraDia.png')
            .setTimestamp();;

            if(announce)
                channel.send(embed)
                    .then(message => message.crosspost());
            else
                channel.send(embed);
       
        })();

    }
}