const { SlashCommandBuilder, EmbedBuilder, MessageFlags } = require("discord.js");
const axios = require("axios");

let lastGameId = null;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("game")
    .setDescription("🐼🤩Recomienda un juego del sitio oficial de RAWG🐼🤩."),
  execute: async (interaction) => {
    try {
      await interaction.deferReply();

      const response = await axios.get("https://api.rawg.io/api/games", {
        params: {
          key: "68c2f47da8b1449a96bcee155b0d654c",
          ordering: "-added",
          page_size: 1000
        }
      });

      let games = response.data.results.filter(game => game.rating >= 4 && game.id !== lastGameId);

      if (!games || games.length === 0) {
        await interaction.editReply({ content: "No se encontraron juegos con calificación alta en este momento.", flags: MessageFlags.Ephemeral });
        return;
      }

      const game = games[Math.floor(Math.random() * games.length)];
      lastGameId = game.id;

      const embed = new EmbedBuilder()
        .setColor("#1f8b4c")
        .setTitle("🎮 Recomendación de Juego 🎮")
        .setDescription(`⭐Aquí ténes un juego con excelente calificación que podría interesarte⭐:`)
        .addFields({
          name: game.name,
          value: `👥 Jugadores estimados: ${game.added.toLocaleString()} \n⭐ Calificación: ${game.rating} / 5 \n💵 Precio: ${game.stores?.[0]?.price || "No disponible en esta plataforma"} \n🌐 [Ver en RAWG](https://rawg.io/games/${game.slug})`
        })
        .setImage(game.background_image);

      const replyMessage = await interaction.editReply({ embeds: [embed] });

      await replyMessage.react("✅");
      await replyMessage.react("❌");
    } catch (error) {
      console.error("Error al obtener juegos de RAWG:", error);
      await interaction.editReply({ content: "❌Hubo un error al obtener la recomendación de juego❌.", flags: MessageFlags.Ephemeral });
    }
  }
};
