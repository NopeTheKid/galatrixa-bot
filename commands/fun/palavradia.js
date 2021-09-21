const { DOMParser } = require('xmldom');
const { MessageEmbed } = require("discord.js");
const nodeHtmlToImage = require('node-html-to-image');
let Parser = require('rss-parser');
let parser = new Parser();
const fs = require('fs');
/*
module.exports = {
  name: "palavradia",
  category: "galatrixa",
  description: "Galatrixa Book",
  run: async (client, message, args, ops) => {
    let channel = message.guild.channels.cache.find(channel => channel.name === "palavra-do-dia");
    //let channel = message.guild.channels.cache.find(channel => channel.name === "bot-test");
    sendPalavraDia(channel);
  }
}

function leftToEight(){
    var d = new Date();
    return (-d + d.setHours(8,0,0,0));
}

function sendPalavraDia(channel){
    let palavraDia;
    (async () => {

        let feed = await parser.parseURL('https://dicionario.priberam.org/DoDiaRSS.aspx');
    
        let item = feed.items[0];
    
        palavraDia = item.content;

        let xmlDoc = new DOMParser().parseFromString(palavraDia,"text/html");
        let xml = xmlDoc.getElementsByTagName("div")[0].childNodes[1].childNodes[1];
      
        palavraDia = `<html lang="en"><head><meta charset="UTF-8" />
        <style>
          body {
            font-family: "Poppins", Arial, Helvetica, sans-serif;
            background: rgb(22, 22, 22);
            color: #fff;
            max-width: 300px;
            max-height: 50%;
          }
      
          .app {
            max-width: 500px;
            padding: 20px;
            display: flex;
            flex-direction: row;
            border-top: 3px solid rgb(16, 180, 209);
            background: rgb(31, 31, 31);
            align-items: center;
          }
      
          img {
            width: 50px;
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
      
        fs.writeFile('palavraDia.png', images, 'buffer', function(err){
          if (err) throw err
          console.log('File saved.')
        });
      
        let embed = new MessageEmbed()
          .setColor("#ff0000")
          .setTitle(`Palavra do Dia`)
          .attachFiles('palavraDia.png')
          .setImage('attachment://palavraDia.png');
    
        channel.send(embed)
          .then(message => message.crosspost());
    })();

}
*/