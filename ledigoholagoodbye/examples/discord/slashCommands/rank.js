const { SlashCommandBuilder, MessageFlags } = require("discord.js");
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
    const playerAuth = Object.keys(playerStats).find(auth => playerStats[auth].name === playerName);

    if (!playerAuth) {
      await interaction.reply({ content: 'Pandita no encontrado❌🐼.', flags: MessageFlags.Ephemeral });
      return;
    }

    const stats = playerStats[playerAuth]

    if (!stats) {
      await interaction.reply({ content: 'No se encontraron estadisticas para este jugador🐼❌.', flags: MessageFlags.Ephemeral });
      return;
    }

    await interaction.reply(`¡El rango de **${stats?.name}** es \`${stats?.rank}\` con un total de \`${stats?.xp}\` de XP!\nUsa /stats [usuario] para ver aún más estadísticas`);
  }
}