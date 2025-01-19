const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('pelicula')
    .setDescription('Descubre informacion sobre peliculas populares')
    .addStringOption(option =>
      option.setName('lenguaje')
        .setDescription('Elige el lenguaje en el que deseas que esté la película')
        .setRequired(true)
        .addChoices(
          { name: 'Español Argentina', value: 'es-AR' },
          { name: 'Español Castellano', value: 'es-ES' },
          { name: 'Portugués Brasil', value: 'pt-BR' },
          { name: 'Portugués Portugal', value: 'pt-PT' },
          { name: 'Japonés', value: 'ja-JP' }
        )
    ),
  async execute(interaction) {
    try {
      const language = interaction.options.getString('lenguaje');
      const originalLanguage = language?.split('-')[0];

      const response = await axios.get(`https://api.themoviedb.org/3/discover/movie`, {
        params: {
          api_key: '5b8d6975eac38dc41135cd59c17af064',
          language: language,
          with_original_language: originalLanguage,
          sort_by: 'popularity.desc',
          'vote_average.gte': 4,
          'primary_release_date.gte': '2023-01-01',
          include_adult: false,
          page: 1
        }
      });

      const peliculas = response.data.results;
      if (peliculas.length === 0) {
        await interaction.reply("No se encontraron películas populares recientes en el idioma seleccionado.");
        return;
      }

      const pelicula = peliculas[Math.floor(Math.random() * peliculas.length)];
      const titulo = pelicula.title;
      const descripcion = pelicula.overview || 'Descripción no disponible';
      const calificacion = pelicula.vote_average;
      const año = pelicula.release_date ? pelicula.release_date.split('-')[0] : 'Año desconocido';
      const imagenUrl = pelicula.poster_path
        ? `https://image.tmdb.org/t/p/w500${pelicula.poster_path}`
        : null;

      const plataformasResponse = await axios.get(`https://api.themoviedb.org/3/movie/${pelicula.id}/watch/providers`, {
        params: {
          api_key: '5b8d6975eac38dc41135cd59c17af064'
        }
      });

      const plataformas = plataformasResponse.data.results?.ES?.flatrate || [];
      const plataformasLista = plataformas.map(p => p.provider_name).join(', ') || 'No disponible en plataformas de streaming';

      const mensaje = `🎬 **${titulo}** (${año})\n\n📊 Calificación: ${calificacion}\n📝 ${descripcion}\n📺 **Disponible en**: ${plataformasLista}`;
      const opcionesMensaje = { content: mensaje, files: [imagenUrl] };

      await interaction.reply(opcionesMensaje);
    } catch (error) {
      console.error(error);
      await interaction.reply('Hubo un error al obtener la información de la película. Inténtalo de nuevo más tarde.');
    }
  }
};