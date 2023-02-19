const { readdirSync } = require("fs");
const { REST, Routes } = require('discord.js');
const { clientId, guildId, token } = require('../config.json');

const ascii = require("ascii-table");

const table = new ascii().setHeading("Command", "Load status");

module.exports = (client) => {
    const cmds = [];
    readdirSync("./commands/").forEach(dir => {
        const commands = readdirSync(`./commands/${dir}/`).filter(f => f.endsWith(".js"));

        for ( let file of commands ) {
            let pull = require(`../commands/${dir}/${file}`);

            if ( pull.name ) {
                client.commands.set(pull.name, pull);
                if(typeof(pull.data) == "object")
                    cmds.push(pull.data.toJSON());

                table.addRow(file, 'ok');
            }
            else {
                table.addRow(file, '*ko*');
                continue;
            }

            if ( pull.aliases && Array.isArray(pull.aliases) )
                pull.aliases.forEach(alias => client.aliases.set(alias, pull.name));
        }
    });

    // Construct and prepare an instance of the REST module
    const rest = new REST({ version: '10' }).setToken(token);

    // and deploy your commands!
    (async () => {
        try {
            console.log(`Started refreshing ${cmds.length} application (/) commands.`);

            // The put method is used to fully refresh all commands in the guild with the current set
            const data = await rest.put(
                Routes.applicationCommands(clientId),
                { body: cmds },
            );
    
            console.log(`Successfully reloaded ${data.length} application (/) commands.`);
        } catch (error) {
            // And of course, make sure you catch and log any errors!
            console.error(error);
        }
    })();
    //console.log(table.toString());

}