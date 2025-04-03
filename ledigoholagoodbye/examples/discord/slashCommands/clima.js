const { SlashCommandBuilder, EmbedBuilder } = require('discord.js'); 
const axios = require('axios');

const WEATHER_API_KEY = "e81b3cb466de47bcbfa235851240411";  // Sustituye con tu clave de API

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clima')
        .setDescription('🌧️☀️ Muestra el clima actual de una ciudad.')
        .addStringOption(option =>
            option.setName('ubicacion')
                .setDescription('Nombre de la ciudad.')
                .setRequired(true)
        ),

    execute: async (interaction) => {
        await interaction.deferReply();
        const location = interaction.options.getString('ubicacion');

        try {
            const locationUrl = `http://api.weatherapi.com/v1/search.json?key=${WEATHER_API_KEY}&q=${encodeURIComponent(location)}`;
            const locationResponse = await axios.get(locationUrl);

            if (locationResponse.data.length === 0) {
                return interaction.editReply({ content: '❌ Ubicación no encontrada.', ephemeral: true });
            }

            const locationData = locationResponse.data[0];
            const city = locationData.name;
            const region = locationData.region;
            const country = locationData.country;

            const weatherUrl = `http://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${encodeURIComponent(location)}`;
            const weatherResponse = await axios.get(weatherUrl);
            const weatherData = weatherResponse.data.current;

            const temperature = weatherData.temp_c;
            const feelsLike = weatherData.feelslike_c;  
            const weatherDescription = weatherData.condition.text;
            const humidity = weatherData.humidity;
            const windSpeed = weatherData.wind_kph;
            const weatherIcon = `https:${weatherData.condition.icon}`;

            const alertUrl = `http://api.weatherapi.com/v1/alerts.json?key=${WEATHER_API_KEY}&q=${encodeURIComponent(location)}`;
            const alertResponse = await axios.get(alertUrl);
            const alertData = alertResponse.data.alerts;

            let alertMessage = "No hay alertas meteorológicas activas.";

            if (alertData && alertData.length > 0) {
                alertMessage = alertData.map(alert => `${alert.headline}: ${alert.description}`).join("\n");
            }

            const weatherEmbed = new EmbedBuilder()
                .setColor('#1E90FF')
                .setTitle(`Clima en ${city}, ${region}, ${country}`)
                .setDescription(weatherDescription)
                .setThumbnail(weatherIcon)
                .addFields(
                    { name: '🌡️ Temperatura', value: `${temperature}°C`, inline: true },
                    { name: '🌡️ Sensación Térmica', value: `${feelsLike}°C`, inline: true },
                    { name: '💧 Humedad', value: `${humidity}%`, inline: true },
                    { name: '🌬️ Viento', value: `${windSpeed} km/h`, inline: true },
                    { name: '⚠️ Alertas Meteorológicas', value: alertMessage, inline: false }
                )
                .setFooter({ text: 'Datos proporcionados por WeatherAPI' })
                .setTimestamp();

            await interaction.editReply({ embeds: [weatherEmbed] });

        } catch (error) {
            console.error("Error obteniendo datos:", error);
            await interaction.editReply({ content: '❌ Error al obtener el clima.', ephemeral: true });
        }
    },
};
