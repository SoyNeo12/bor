const { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const { playerStats } = require('../../script');

const allowedRoles = [
  "1292997735716229161"
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName("codigo")
    .setDescription("Busca el código de un pandita🐼🎋")
    .addStringOption(option =>
      option.setName("nombre")
        .setDescription("Nombre del Pandita en HaxBall🐼")
        .setRequired(true)),

  execute: async (interaction) => {
    const playerName = interaction.options.getString('nombre');
    const matchingPlayers = Object.keys(playerStats)
      .filter(auth => playerStats[auth]?.name.includes(playerName));

    if (matchingPlayers.length === 0) {
      await interaction.reply({ content: 'Pandita no encontrado❌🐼.', ephemeral: true });
      return;
    }

    try {
      const member = await interaction.guild.members.fetch(interaction.user.id);
      const hasRole = allowedRoles.some(roleId => member.roles.cache.has(roleId));

      if (!hasRole) {
        await interaction.reply({ content: 'No tenés permiso para usar este comando❌.', ephemeral: true });
        return;
      }

      if (matchingPlayers.length > 1) {
        const options = matchingPlayers.map(auth => {
          const player = playerStats[auth];
          let registrationDate = new Date(player.registrationDate);
          if (isNaN(registrationDate)) {
            registrationDate = 'Fecha no válida';
          } else {
            registrationDate = registrationDate.toLocaleDateString('es-ES');
          }
          return {
            label: `${player.name} (Registro: ${registrationDate || "Sin fecha de registro"})`,
            description: `Selecciona para ver el código de ${player.name}`,
            value: auth
          };
        });

        const selectMenu = new StringSelectMenuBuilder()
          .setCustomId('selectPlayer')
          .setPlaceholder('Selecciona el Pandita que buscas')
          .addOptions(options);

        const row = new ActionRowBuilder().addComponents(selectMenu);

        await interaction.reply({
          content: `Resultados de la búsqueda de ${playerName}:`,
          components: [row],
          ephemeral: true
        });

        const filter = (i) => i.customId === 'selectPlayer' && i.user.id === interaction.user.id;
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 15000 });

        collector.on('collect', async (i) => {
          const selectedAuth = i.values[0];
          const player = playerStats[selectedAuth];
          const registrationDate = new Date(player.registrationDate).toLocaleDateString('es-ES');
          const recoveryCode = player.recoveryCode || "No se encontró el código de recuperación para este pandita❌.";

          await i.update({
            content: `Este es el código de **${player.name}** (Registro: ${registrationDate}): \`${recoveryCode}\``,
            components: []
          });
        });

        collector.on('end', async (collected, reason) => {
          if (reason === 'time') {
            await interaction.editReply({
              content: 'El tiempo para seleccionar el pandita ha expirado.',
              components: []
            });
          }
        });

      } else {
        const singleAuth = matchingPlayers[0];
        const player = playerStats[singleAuth];
        let registrationDate = new Date(player.registrationDate).toLocaleDateString('es-ES');
        const recoveryCode = player.recoveryCode || "No se encontró el código de recuperación para este pandita❌.";

        await interaction.reply(`Este es el código de **${player.name}** (Registro: ${registrationDate || "No tiene fecha de registro"}): \`${recoveryCode}\``);
      }
    } catch (err) {
      console.error("Error al usar el comando", err);
      await interaction.reply({ content: "Error al usar el comando", ephemeral: true });
    }
  },
};