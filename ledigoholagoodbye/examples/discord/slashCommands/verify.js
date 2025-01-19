const { SlashCommandBuilder } = require("discord.js");
const { playerStats, sendAnnouncement, playersFilePath } = require("../../script");
const fs = require('fs');
const path = require('path');

const verifyFilePath = path.join(__dirname, '../verifyJSON/verify.json');

let verifyPlayers = {};

try {
  verifyPlayers = JSON.parse(fs.readFileSync(verifyFilePath, 'utf-8'));
} catch (err) {
  console.error("Error al leer los jugadores verificados:", err);
}

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

    verifyPlayers[playerAuth] = { name: playerData.name, uuid: playerData.uuid, discordName: interaction.user.username };

    fs.writeFileSync(verifyFilePath, JSON.stringify(verifyPlayers, null, 2));

    await interaction.reply({ content: `Solicitud de verificación registrada. Ya puedes usar comandos, **${playerData.name}**.`, ephemeral: true });
    sendAnnouncement(`${playerData.name} ha solicitado verificación usando el comando /verificar`, null, 0x00FF00, "bold", 1);
    playerData.verified = true;
    fs.writeFileSync(playersFilePath, JSON.stringify(playerStats, null, 2));

    try {
      await interaction.user.send(`Tu cuenta de Discord ha sido vinculada con HaxBall correctamente. Tu UUID es \`${uuid}\``);
      await interaction.user.send(`Para no olvidarte, tu código de recuperación es \`${playerData.recoveryCode}\`.`);
    } catch (error) {
      console.error("Error al enviar mensaje directo:", error);
      await interaction.followUp({ content: "No pude enviarte un mensaje directo. Verifica que tengas habilitados los MD en este servidor.", ephemeral: true });
    }
  },
  verifyPlayers,
  verifyFilePath
};
