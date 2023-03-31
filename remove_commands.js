const { REST, Routes } = require('discord.js');

const rest = new REST({ version: '10' }).setToken("MTA0MjQ0ODk2NTExNjg5MTIxNg.GnEWoP.5gFFr1uuJ24Golel_blMXTFoCcx6pVKXxS2c9g");

// for global commands
rest.put(Routes.applicationCommands("1042448965116891216"), { body: [] })
	.then(() => console.log('Successfully deleted all application commands.'))
	.catch(console.error);