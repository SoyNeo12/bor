const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("🐼🚨Muestra el ping del bot🐼🚨."),
    async execute(interaction) {
        const message = await interaction.reply({ content: "Calculando ping...", fetchReply: true });
        const ping = message.createdTimestamp - interaction.createdTimestamp;
        const apiPing = interaction.client.ws.ping;
        await interaction.editReply(`🏓 **Ping:** ${ping} ms\n💻 **Latencia de API:** ${apiPing} ms`);
    }
};