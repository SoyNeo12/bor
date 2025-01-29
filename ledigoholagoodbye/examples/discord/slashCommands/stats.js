const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require('discord.js');
const { playerStats } = require('../../script');
const { verifyPlayers } = require('./verify');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("stats")
    .setDescription("Para ver tus stats (o las de un pandita)🐼")
    .addStringOption(option =>
      option.setName("nombre")
        .setDescription("Nombre del pandita en HaxBall🐼")
        .setRequired(true)),
  execute: async (interaction) => {
    const playerName = interaction.options.getString('nombre');

    const playerAuth = Object.keys(playerStats).find(auth => playerStats[auth].name === playerName);

    if (!playerAuth) {
      await interaction.reply({ content: 'Pandita no encontrado🐼❌.', flags: MessageFlags.Ephemeral });
      return;
    }

    const stats = playerStats[playerAuth];

    if (!stats) {
      await interaction.reply({ content: 'No se encontraron estadísticas para este jugador🐼❌.', flags: MessageFlags.Ephemeral });
      return;
    }

    const verifiedPlayer = verifyPlayers[playerAuth];

    if (!verifiedPlayer) {
      await interaction.reply({ content: 'Este jugador no está verificado. No se puede mostrar las stats.', flags: MessageFlags.Ephemeral });
      return;
    }

    const discordName = verifiedPlayer.discordName || 'Desconocido';

    const statsEmbed = new EmbedBuilder()
      .setColor('#1E90FF')
      .setTitle(`Estadísticas de ${stats.name} (Discord: ${discordName})`)
      .addFields(
        { name: '🐼Partidos Jugados🐼', value: stats.games.toString(), inline: true },
        { name: '✅Victorias✅', value: stats.victories.toString(), inline: false },
        { name: '❌Derrotas❌', value: stats.defeats.toString(), inline: false },
        { name: '⚽Goles⚽', value: stats.goals.toString(), inline: false },
        { name: '👟Asistencias👟', value: stats.assists.toString(), inline: false },
        { name: '🧤Vallas🧤', value: stats.vallas.toString(), inline: false },
        { name: '📈Winrate📈', value: `${stats.winrate}%`, inline: false },
        { name: '🆙XP🆙', value: stats.xp.toString(), inline: false },
        { name: '🤡Autogoles🤡', value: stats.owngoals.toString(), inline: false },
        { name: '💰Pandacoins💰', value: stats.pandacoins.toString(), inline: false },
        { name: '👎Sanciones👎', value: stats.sanciones.toString(), inline: false },
      )
      .setTimestamp()
      .setFooter({ text: 'Datos obtenidos de Haxball' });

    await interaction.reply({ embeds: [statsEmbed] });
  },
};
