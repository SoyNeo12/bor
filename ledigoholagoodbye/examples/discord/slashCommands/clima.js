const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clima')
        .setDescription('🌧️☀️Para enterarte del clima en una ciudad🌧️☀️.')
        .addStringOption(option =>
            option.setName('ubicacion')
                .setDescription('Nombre de la ciudad a la que deseas ver el clima')
                .setRequired(true)
        ),
    execute: async (interaction) => {
        const location = interaction.options.getString('ubicacion');
        const url = `https://api.weatherapi.com/v1/current.json?key=e81b3cb466de47bcbfa235851240411&q=${encodeURIComponent(location)}&aqi=no`;

        try {
            const response = await axios.get(url);
            const weatherData = response.data;

            const city = weatherData.location.name;
            const region = weatherData.location.region;
            const country = weatherData.location.country;
            const localTime = weatherData.location.localtime;
            const temperature = weatherData.current.temp_c;
            const feelsLike = weatherData.current.feelslike_c;
            const weatherDescription = weatherData.current.condition.text;
            const humidity = weatherData.current.humidity;
            const windSpeed = weatherData.current.wind_kph;
            const visibility = weatherData.current.vis_km;
            const iconUrl = `https:${weatherData.current.condition.icon}`;

            const weatherEmbed = new EmbedBuilder()
                .setColor('#1E90FF')
                .setTitle(`Clima actual en (${region}, ${country})`)
                .setDescription(`Información del clima para **${city}**`)
                .setThumbnail(iconUrl)
                .addFields(
                    { name: '🌡️ Temperatura', value: `${temperature}°C`, inline: true },
                    { name: '🌡️🤔 Sensación térmica', value: `${feelsLike}°C`, inline: true },
                    { name: '🌧️ Estado del tiempo', value: weatherDescription, inline: true },
                    { name: '💧 Humedad', value: `${humidity}%`, inline: true },
                    { name: '🌬️ Viento', value: `${windSpeed} km/h`, inline: true },
                    { name: '👀 Visibilidad', value: `${visibility} km`, inline: true },
                    { name: '🕒 Hora Local', value: localTime, inline: true },
                )
                .setFooter({ text: 'Clima obtenido de WeatherAPI.com' })
                .setTimestamp();

            await interaction.reply({ embeds: [weatherEmbed] });
        } catch (error) {
            console.error(error);
            await interaction.reply({
                content: '❌No se encontró esa ubicacion, verificá el nombre❌.',
                ephemeral: true
            });
        }
    },
};