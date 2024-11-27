const { SlashCommandBuilder } = require("discord.js");
const { playerStats, sendAnnouncement, playersFilePath } = require("../../script");
const fs = require('fs').promises;
const path = require('path');

const verifyFilePath = path.join(__dirname, '../verifyJSON/verify.json');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("verificar")
    .setDescription("Verifícate para poder usar todos los comandos y tener exp en HaxBall")
    .addStringOption(option =>
      option.setName("uuid")
        .setDescription("UUID obtenido del comando !verificar dentro del host")
        .setRequired(true)
    ),
  execute: async (interaction) => {
    const uuid = interaction.options.getString('uuid');
    const playerAuth = Object.keys(playerStats).find(auth => playerStats[auth].uuid === uuid);

    if (!playerAuth) {
      await interaction.reply({ content: "Ese UUID no existe en el registro de jugadores.", ephemeral: true });
      return;
    }

    const playerData = playerStats[playerAuth];

    if (playerData.verified) {
      await interaction.reply({ content: "Este UUID ya ha sido verificado anteriormente. No puedes verificarlo de nuevo.", ephemeral: true });
      return;
    }

    if (!playerData.name) {
      await interaction.reply({ content: "Jugador no existente o nombre no asignado.", ephemeral: true });
      return;
    }

    try {
      let verifyRequests = [];
      try {
        const data = await fs.readFile(verifyFilePath, 'utf-8');
        verifyRequests = JSON.parse(data).requests || [];
      } catch (err) {
        if (err.code !== 'ENOENT') throw err;
      }

      await fs.writeFile(verifyFilePath, JSON.stringify({ requests: verifyRequests }, null, 2));

      await interaction.reply({ content: `Solicitud de verificación registrada. Ya puedes usar comandos, **${playerData.name}**.`, ephemeral: true });
      sendAnnouncement(`${playerData.name} ha solicitado verificación usando el comando /verificar`, null, 0x00FF00, "bold", 1);
      playerData.verified = true;
      await fs.writeFile(playersFilePath, JSON.stringify(playerStats, null, 2));

    } catch (error) {
      console.error("Error al guardar la solicitud de verificación:", error);
      await interaction.reply({ content: "Hubo un error al registrar la solicitud de verificación. Intenta nuevamente más tarde.", ephemeral: true });
    }

    try {
      await interaction.user.send(`Tu cuenta de Discord ha sido vinculada con HaxBall correctamente. Tu UUID es \`${uuid}\`.`);
    } catch (error) {
      console.error("Error al enviar mensaje directo:", error);
      await interaction.followUp({ content: "No pude enviarte un mensaje directo. Verifica que tengas habilitados los MD en este servidor.", ephemeral: true });
    }
  }
};
