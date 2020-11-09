module.exports = {
    name: "callme",
    category: "galatrixa",
    description: "Try to call you",
    run: async (client, message, args, ops) => {
        if (message.deletable)
            message.delete();

        message.author.send("Não, ningúem gosta de ti e cheiras mal! 👎");
    }
}