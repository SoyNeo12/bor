const { SlashCommandBuilder, EmbedBuilder } = require('discord.js'); 
const axios = require('axios');

const WEATHER_API_KEY = "lRfA0MAVLrS789berKFmpQqJbuI00cjQ";

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
            const locationUrl = `http://dataservice.accuweather.com/locations/v1/cities/search?apikey=${WEATHER_API_KEY}&q=${encodeURIComponent(location)}&language=es`;
            const locationResponse = await axios.get(locationUrl);

            if (!locationResponse.data.length) {
                return interaction.editReply({ content: '❌ Ubicación no encontrada.', ephemeral: true });
            }

            const locationData = locationResponse.data[0];
            const locationKey = locationData.Key;
            const city = locationData.LocalizedName;
            const country = locationData.Country.ID;

            const weatherUrl = `http://dataservice.accuweather.com/currentconditions/v1/${locationKey}?apikey=${WEATHER_API_KEY}&details=true&language=es`;
            const weatherResponse = await axios.get(weatherUrl);
            const weatherData = weatherResponse.data[0];

            const temperature = weatherData.Temperature.Metric.Value;
            const feelsLike = weatherData.RealFeelTemperature.Metric.Value;
            const weatherDescription = weatherData.WeatherText;
            const humidity = weatherData.RelativeHumidity;
            const windSpeed = weatherData.Wind.Speed.Metric.Value;
            const visibility = weatherData.Visibility.Metric.Value;
            const pressure = weatherData.Pressure.Metric.Value;
            const localTime = new Date(weatherData.LocalObservationDateTime).toLocaleString('es-ES', { timeZone: 'UTC', hour12: false });

            const weatherIcon = `https://developer.accuweather.com/sites/default/files/${String(weatherData.WeatherIcon).padStart(2, '0')}-s.png`;

            const hourlyForecastUrl = `http://dataservice.accuweather.com/forecasts/v1/hourly/12hour/${locationKey}?apikey=${WEATHER_API_KEY}&metric=true&language=es`;
            const hourlyResponse = await axios.get(hourlyForecastUrl);
            const hourlyData = hourlyResponse.data;

            let rainStart = "No se esperan lluvias en las próximas 12 horas.";
            for (const hour of hourlyData) {
                if (hour.PrecipitationProbability && hour.PrecipitationProbability > 50) {
                    const rainTime = new Date(hour.DateTime).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' });
                    rainStart = `🌧️ Lluvia esperada a las ${rainTime} con ${hour.PrecipitationProbability}% de probabilidad.`;
                    break;
                }
            }

            const dailyForecastUrl = `http://dataservice.accuweather.com/forecasts/v1/daily/1day/${locationKey}?apikey=${WEATHER_API_KEY}&metric=true&language=es`;
            const dailyResponse = await axios.get(dailyForecastUrl);
            const dailyData = dailyResponse.data.DailyForecasts[0];

            const minTemp = dailyData.Temperature.Minimum.Value;
            const maxTemp = dailyData.Temperature.Maximum.Value;
            const dayCondition = dailyData.Day.IconPhrase;
            const nightCondition = dailyData.Night.IconPhrase;
            const rainChance = dailyData.Day.PrecipitationProbability;

            const forecastDate = new Date(dailyData.Date).toLocaleDateString('es-ES', { weekday: 'long', day: '2-digit', month: 'long' });

            const alertsUrl = `http://dataservice.accuweather.com/alerts/v1/${locationKey}?apikey=${WEATHER_API_KEY}&language=es`;
            const alertsResponse = await axios.get(alertsUrl);
            const alerts = alertsResponse.data;

            let alertMessage = "No hay alertas meteorológicas.";
            if (alerts && alerts.length > 0) {
                alertMessage = alerts.map(alert => `${alert.AlertType}: ${alert.Headline}`).join("\n");
            }

            const weatherEmbed = new EmbedBuilder()
                .setColor('#1E90FF')
                .setTitle(`Clima en ${city} - ${forecastDate}`)
                .setDescription(weatherDescription)
                .setThumbnail(weatherIcon)
                .addFields(
                    { name: '🌡️ Temperatura actual', value: `${temperature}°C`, inline: true },
                    { name: '🌡️ Sensación térmica', value: `${feelsLike}°C`, inline: true },
                    { name: '💧 Humedad', value: `${humidity}%`, inline: true },
                    { name: '🌬️ Viento', value: `${windSpeed} km/h`, inline: true },
                    { name: '👀 Visibilidad', value: `${visibility} km`, inline: true },
                    { name: '🌪️ Presión atmosférica', value: `${pressure} mb`, inline: true },
                    { name: '🕒 Última actualización', value: localTime, inline: false },
                    { name: '☀️ Clima diurno', value: dayCondition, inline: true },
                    { name: '🌙 Clima nocturno', value: nightCondition, inline: true },
                    { name: '🌧️ Probabilidad de lluvia', value: `${rainChance}%`, inline: true },
                    { name: '⏳ Cuándo empieza a llover', value: rainStart, inline: false },
                    { name: '⚠️ Alertas meteorológicas', value: alertMessage, inline: false }
                )
                .setFooter({ text: 'Datos proporcionados por AccuWeather' })
                .setTimestamp();

            await interaction.editReply({ embeds: [weatherEmbed] });

        } catch (error) {
            console.error("Error obteniendo datos:", error);
            await interaction.editReply({ content: '❌ Error al obtener el clima.', ephemeral: true });
        }
    },
};
