module.exports = {
    name: "callme",
    category: "galatrixa",
    description: "Try to call you",
    execute ({ inter }) {
        return inter.reply({ content : "Não, ningúem gosta de ti e cheiras mal! 👎"});
    }
}