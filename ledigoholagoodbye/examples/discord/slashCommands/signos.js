const { SlashCommandBuilder } = require("discord.js");

const horoscopos = {
  acuario: "Librespirados y rebeldes, lo que les hace evitar compromisos y ataduras. Son tolerantes, respetuosos y con mente abierta, pero también pueden ser honestos y directos. Empáticos, cariñosos y sensibles.",
  aries: "Energéticos y luchadores, buscan lograr metas y disfrutar de la vida. Buscan paz y estabilidad en todos los sentidos, pero también pueden ser perseverantes en situaciones complicadas.",
  geminis: "Cambiantes y variables, pueden tener miedo al compromiso y cambiar de opinión rápido. Excelentes oradores y comunicadores, pueden ser divertidos y sociables. Si sos de géminis, compartís signo con SKAI🐼❤️.",
  tauro: "Estables y seguros, valoran la seguridad y la estabilidad. Pueden ser previsibles y conservadores. NEO, creador de Panda, es de Tauro🐼❤️.",
  cancer: "Emocionalmente intensos, buscan paz y protección en sus relaciones. Pueden ser cuidadosos y protectores.",
  leo: "Confidentes y apasionados, buscan la atención y el reconocimiento. Pueden ser dramáticos y egocéntricos.",
  virgo: "Analíticos y críticos, buscan la perfección y la precisión. Pueden ser detallistas y perfeccionistas.",
  libra: "Diplomáticos y equilibrados, buscan la armonía y la justicia. Pueden ser indecisos y pacíficos.",
  escorpio: "Intensos y pasionales, buscan la verdad y la profundidad. Pueden ser misteriosos y obsesivos.",
  sagitario: "Aventureros y optimistas, buscan la libertad y la expansión. Pueden ser impulsivos y desorganizados.",
  capricornio: "Serios y responsables, buscan la estabilidad y el éxito. Pueden ser rígidos y autoritarios.",
  piscis: "Imaginativos y sensibles, buscan la iluminación y la conexión con algo más allá. Pueden ser indecisos y fantasiosos.",
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName("horoscopo")
    .setDescription("🐼😲Obtén las características de tu signo zodiacal🐼😲.")
    .addStringOption(option =>
      option.setName("signo")
        .setDescription("Elige tu signo zodiacal")
        .setRequired(true)
        .addChoices(
          { name: "Acuario", value: "acuario" },
          { name: "Aries", value: "aries" },
          { name: "Géminis", value: "geminis" },
          { name: "Tauro", value: "tauro" },
          { name: "Cáncer", value: "cancer" },
          { name: "Leo", value: "leo" },
          { name: "Virgo", value: "virgo" },
          { name: "Libra", value: "libra" },
          { name: "Escorpio", value: "escorpio" },
          { name: "Sagitario", value: "sagitario" },
          { name: "Capricornio", value: "capricornio" },
          { name: "Piscis", value: "piscis" }
        )),
  execute: async (interaction) => {
    const signo = interaction.options.getString("signo");
    const mensaje = horoscopos[signo];

    await interaction.reply(`🌟 **Horóscopo para ${signo.charAt(0).toUpperCase() + signo.slice(1)}:**\n${mensaje}`);
  }
};