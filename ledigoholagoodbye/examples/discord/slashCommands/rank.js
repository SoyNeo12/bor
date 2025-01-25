const { SlashCommandBuilder } = require("discord.js");
const { playerStats } = require("../../script");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("rank")
    .setDescription("😀🐼Para buscar tu rango (o el de otro pandita)😀🐼.")
    .addStringOption(option =>
      option.setName("nombre")
        .setDescription("Agregá el nombre de un pandita🐼.")
        .setRequired(true)),
  execute: async (interaction) => {
    const playerName = interaction.options.getString("nombre");
    const playerConn = Object.keys(playerStats).find(conn => playerStats[conn].name === playerName);

    if (!playerConn) {
      await interaction.reply({ content: 'Pandita no encontrado❌🐼.', ephemeral: true });
      return;
    }

    const stats = playerStats[playerConn]

    if (!stats) {
      await interaction.reply({ content: 'No se encontraron estadisticas para este jugador🐼❌.', ephemeral: true });
      return;
    }

    await interaction.reply(`¡El rango de **${stats?.name}** es \`${stats?.rank}\` con un total de \`${stats?.xp}\` de XP!\nUsa /stats [usuario] para ver aún más estadísticas`);
  }
}
