const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { getPlayerList } = require("../../script");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("jugadores")
    .setDescription("🧐🐼Mirá la cantidad de panditas que hay conectados en el host🐼🧐"),
  execute: async (interaction) => {
    const { red, blue, players } = getPlayerList();

    if (!players) {
      await interaction.reply({ content: "🐼❌La sala no está abierta actualmente❌🐼", ephemeral: true });
      return;
    }

    if (players.length === 0) {
      await interaction.reply({ content: "🐼Actualmente no hay nadie en la sala🐼", ephemeral: true });
      return;
    }

    const redTeamNames = red.map(player => "**" + player.name + "**" + `[${player.id}]`).join("\n") || "Nadie en el equipo rojo";
    const blueTeamNames = blue.map(player => "**" + player.name + "**" + `[${player.id}]`).join("\n") || "Nadie en el equipo azul";

    const embed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle("🐼 Panditas en la sala 🐼")
      .addFields(
        { name: "RED 🔴", value: redTeamNames, inline: true },
        { name: "BLUE 🔵", value: blueTeamNames, inline: true }
      )
      .setFooter({ text: `Total de jugadores: ${players.length}/26` });

    await interaction.reply({ embeds: [embed] });
  }
};
