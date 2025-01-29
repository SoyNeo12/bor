const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');
const token = 'BQB5A-mpJN7k8GatLwY20j0i5cVDmpqpGW0Gf3QKeIkEyiufwGv7xIdmXNYIo4QLuxchiYbyEO0Qm-JaAKURB1x4EMeecRZwhnRwFuBcable0p3Sx2boNQqc-8MyLPidJJNUv-DFUla2vUaSKzhwZkU69rQ3tS6dK3tWWE4Y7AZ8rLhEneii8Hf4-0_eP_eJfz3UhCD2H-asRPZiPC_o40CoGE9cz8jL7IWKRmfW5dDrYgPP5ZazZdJHGUVMOFSMFbOvTxkIGy_wpKTUxdI2HdqgxXrYf5bS';

async function fetchWebApi(endpoint) {
    try {
        const res = await axios.get(`https://api.spotify.com/${endpoint}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return res.data;
    } catch (error) {
        console.error('Error al hacer la solicitud a Spotify:', error.response ? error.response.data : error.message);
        throw new Error('Error al hacer la solicitud a Spotify');
    }
}

async function getTopTracks(playlistId) {
    return await fetchWebApi(`v1/playlists/${playlistId}/tracks`);
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('musica')
        .setDescription('Obtén canciones populares de Argentina o del mundo 🎵')
        .addBooleanOption(option =>
            option
                .setName('argentina')
                .setDescription('¿Mostrar canciones de Argentina? (true para Argentina, false para global)')
                .setRequired(true)
        ),
    execute: async (interaction) => {
        await interaction.deferReply();

        const isArgentina = interaction.options.getBoolean('argentina');
        const playlistId = isArgentina
            ? '6qv68QBGb4BKfLUb92MSik' // ID de la playlist de Argentina
            : '1sAVKbeZfl9IjAST4MNnYb'; // ID de la playlist global

        try {
            const tracks = await getTopTracks(playlistId);

            const embed = new EmbedBuilder()
                .setTitle(
                    isArgentina
                        ? 'Top 22 Canciones Más Populares en Argentina'
                        : 'Top 10 Canciones Más Populares del Mundo'
                )
                .setColor('#1DB954')
                .setDescription(
                    tracks.items
                        .slice(0, isArgentina ? 22 : 10)
                        .map(
                            (item, index) =>
                                `${index + 1}. [${item.track.name}](${item.track.external_urls.spotify}) - ${item.track.artists
                                    .map(artist => artist.name)
                                    .join(', ')}`
                        )
                        .join('\n')
                )
                .setFooter({ text: 'Datos obtenidos de Spotify' })
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });
        } catch (error) {
            console.error('Error ejecutando el comando:', error.message);
            await interaction.editReply('No se pudieron obtener las canciones. Inténtalo más tarde.');
        }
    },
};