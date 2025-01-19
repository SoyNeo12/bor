const { SlashCommandBuilder } = require("discord.js");
const { bannedPlayers, playerId, bannedPlayersFilePath } = require("../../script");
const fs = require('fs');

const allowedRoles = [
  '1273309073181245441'
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unban')
    .setDescription('Desbanea a alguien del host mediante el bot')
    .addStringOption(option =>
      option.setName('usuario')
        .setDescription('Nombre del usuario al que quieres desbanear')
        .setRequired(true)
    ),
  execute: async (interaction) => {
    const playerName = interaction.options.getString('usuario');
    const index = bannedPlayers.findIndex(auth => playerId[auth] === playerName);

    if (index === -1) {
      await interaction.reply({ content: "No se encontró al jugador o no está baneado.", ephemeral: true });
      return;
    }

    const member = await interaction.guild.members.fetch(interaction.user.id);
    const hasRole = allowedRoles.some(roleId => member.roles.cache.has(roleId));

    if (!hasRole) {
      await interaction.reply({ content: 'No tenés permiso para usar este comando❌.', ephemeral: true });
      return;
    }

    bannedPlayers.splice(index, 1);

    await interaction.reply(`Jugador ${playerName} desbaneado correctamente.`);
    fs.writeFileSync(bannedPlayersFilePath, JSON.stringify(bannedPlayers, null, 2));
  }
};