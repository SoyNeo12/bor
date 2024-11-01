const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { playerStats } = require('../../script');

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
            await interaction.reply({ content: 'Pandita no encontrado🐼❌.', ephemeral: true });
            return;
        }

        const stats = playerStats[playerAuth];

        if (!stats) {
            await interaction.reply({ content: 'No se encontraron estadísticas para este jugador🐼❌.', ephemeral: true });
            return;
        }

        const statsEmbed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle(`Estadísticas de ${stats.name}`)
            .addFields(
                { name: 'Partidos Jugados', value: stats.games.toString(), inline: true },
                { name: 'Victorias', value: stats.victories.toString(), inline: true },
                { name: 'Derrotas', value: stats.defeats.toString(), inline: true },
                { name: 'Goles', value: stats.goals.toString(), inline: true },
                { name: 'Asistencias', value: stats.assists.toString(), inline: true },
                { name: 'Vallas', value: stats.vallas.toString(), inline: true },
                { name: 'Winrate', value: `${stats.winrate}%`, inline: true },
                { name: 'XP', value: stats.xp.toString(), inline: true },
                { name: 'Autogoles', value: stats.owngoals.toString(), inline: true },
                { name: 'Pandacoins', value: stats.pandacoins.toString(), inline: true },
                { name: 'Sanciones', value: stats.sanciones.toString(), inline: true },
            )
            .setTimestamp()
            .setFooter({ text: 'Datos obtenidos de Haxball' });

        await interaction.reply({ embeds: [statsEmbed] });
    },
};
