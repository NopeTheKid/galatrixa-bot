const { prefix } = require("../../config.json");

module.exports = {
	name: 'say',
    category: "fun",
    description: 'Say something',
    usage:`${prefix}say`,
	run(client, message, args, ops) {
        args= args.join(' ');
        return message.channel.send(args);
	},
};