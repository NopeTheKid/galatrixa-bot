const { prefix } = require("../../config.json");

module.exports = {
	name: 'rs',
    category: "server",
    description: 'Restart the bot.',
    usage:`${prefix}rs`,
	run(client, message, args, ops) {
        var exec = require('child_process').exec, child;

        child = exec('echo >> ./restart.js;',
            function (error, stdout, stderr) {
                console.log('stdout: ' + stdout);
                console.log('stderr: ' + stderr);
                if (error !== null) {
                    console.log('exec error: ' + error);
                }
            });

        child = exec('rm ./restart.js',
            function (error, stdout, stderr) {
                console.log('stdout: ' + stdout);
                console.log('stderr: ' + stderr);
                if (error !== null) {
                    console.log('exec error: ' + error);
                }
            });

        return message.channel.send('Restarting the bot!');
	},
};