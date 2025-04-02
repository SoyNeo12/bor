const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

const WEATHER_API_KEY = "YPUqlXVf6eteJSHpawN6AhvOvqAZsMog";

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clima')
        .setDescription('🌧️☀️ Muestra el clima actual de una ciudad. 🌧️☀️')
        .addStringOption(option =>
            option.setName('ubicacion')
                .setDescription('Nombre de la ciudad.')
                .setRequired(true)
        ),
    execute: async (interaction) => {
        await interaction.deferReply();
        const location = interaction.options.getString('ubicacion');

        try {
            const locationUrl = `http://dataservice.accuweather.com/locations/v1/cities/search?apikey=${WEATHER_API_KEY}&q=${encodeURIComponent(location)}`;
            const locationResponse = await axios.get(locationUrl);

            if (!locationResponse.data.length) {
                return interaction.editReply({ content: '❌ Ubicación no encontrada.', ephemeral: true });
            }

            const locationData = locationResponse.data[0];
            const locationKey = locationData.Key;
            const city = locationData.LocalizedName;
            const country = locationData.Country.ID;

            const weatherUrl = `http://dataservice.accuweather.com/currentconditions/v1/${locationKey}?apikey=${WEATHER_API_KEY}&details=true`;
            const weatherResponse = await axios.get(weatherUrl);
            const weatherData = weatherResponse.data[0];

            const temperature = weatherData.Temperature.Metric.Value;
            const feelsLike = weatherData.RealFeelTemperature.Metric.Value;
            const weatherDescription = weatherData.WeatherText;
            const humidity = weatherData.RelativeHumidity;
            const windSpeed = weatherData.Wind.Speed.Metric.Value;
            const visibility = weatherData.Visibility.Metric.Value;
            const localTime = weatherData.LocalObservationDateTime;
            const weatherIcon = `https://developer.accuweather.com/sites/default/files/${String(weatherData.WeatherIcon).padStart(2, '0')}-s.png`;

            const radarUrl = `https://www.accuweather.com/en/${country}/weather-radar`;

            const weatherEmbed = new EmbedBuilder()
                .setColor('#1E90FF')
                .setTitle(`Clima en ${city}`)
                .setDescription(weatherDescription)
                .setThumbnail(weatherIcon)
                .addFields(
                    { name: '🌡️ Temperatura', value: `${temperature}°C`, inline: true },
                    { name: '🌡️ Sensación térmica', value: `${feelsLike}°C`, inline: true },
                    { name: '💧 Humedad', value: `${humidity}%`, inline: true },
                    { name: '🌬️ Viento', value: `${windSpeed} km/h`, inline: true },
                    { name: '👀 Visibilidad', value: `${visibility} km`, inline: true },
                    { name: '🕒 Última actualización', value: localTime, inline: false }
                )
                .setImage(radarUrl)
                .setFooter({ text: 'Datos proporcionados por AccuWeather' })
                .setTimestamp();

            await interaction.editReply({ embeds: [weatherEmbed] });
        } catch (error) {
            console.error("Error obteniendo datos:", error);
            await interaction.editReply({ content: '❌ Error al obtener el clima.', ephemeral: true });
        }
    },
};
