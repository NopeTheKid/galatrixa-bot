const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'help',
    description: "All the commands this bot has!",
    showHelp: false,

    execute({ client, inter }) {
        const commands = client.commands.filter(x => x.showHelp !== false);
		let dirs = []
		commands.forEach(cmd => {
			str = cmd.dir.toString().charAt(0).toUpperCase()+cmd.dir.slice(1)
			if(!dirs.includes(str))
				dirs.push(str);
		});

        const embed = new EmbedBuilder()
        .setColor('#ff0000')
        .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL({ size: 1024, dynamic: true }) })
        .setDescription('Vai tu');
		let fields = []
		dirs.forEach(dir =>  {
			cmds = ""
			commands.forEach(cmd => {
				if((cmd.dir.toString().charAt(0).toUpperCase()+cmd.dir.slice(1)) == dir)
					cmds = cmds + (`\t- \`${cmd.name}\`\n`)
			})
			fields.push({ name: dir, value: cmds })
		})
		embed.addFields(fields)

        inter.reply({ embeds: [embed] });
    },
};