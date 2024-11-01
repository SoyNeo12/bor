const { SlashCommandBuilder } = require('discord.js');
const { playerStats } = require('../../script');

const allowedRoles = [
    "1273309073181245441"
];

module.exports = {
    data: new SlashCommandBuilder()
        .setName("codigo")
        .setDescription("Busca el código de un jugador (si se olvidó)🐼🎋")
        .addStringOption(option =>
            option.setName("nombre")
                .setDescription("Nombre del Pandita en HaxBall🐼")
                .setRequired(true)),
    execute: async (interaction) => {
        const playerName = interaction.options.getString('nombre');

        const playerAuth = Object.keys(playerStats).find(auth => playerStats[auth].name === playerName);

        if (!playerAuth) {
            await interaction.reply({ content: 'Pandita no encontrado❌🐼.', ephemeral: true });
            return;
        }

        const member = await interaction.guild.members.fetch(interaction.user.id);
        const hasRole = allowedRoles.some(roleId => member.roles.cache.has(roleId));

        if (!hasRole) {
            await interaction.reply({ content: 'No tenés permiso para usar este comando❌.', ephemeral: true });
            return;
        }

        const recoveryCode = playerStats[playerAuth]?.recoveryCode;

        if (!recoveryCode) {
            await interaction.reply({ content: 'No se encontró el código de recuperación para este pandita❌.', ephemeral: true });
            return;
        }

        await interaction.reply(`El código de recuperación de este Pandita **${playerStats[playerAuth].name}** es: \`${recoveryCode}\``);
    },
};
