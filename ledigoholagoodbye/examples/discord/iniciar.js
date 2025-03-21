const { Client, Collection, REST, Routes, MessageFlags } = require('discord.js');
const { sendAnnouncement, getRoomLink } = require('../script');
const config = require('./config.json');
const fs = require('fs');
const path = require('path');

const client = new Client({ intents: 3276799 });

client.commands = new Collection();

fs.readdirSync(path.join(__dirname, "./slashCommands")).forEach((commandFile) => {
  const command = require(path.join(__dirname, `./slashCommands/${commandFile}`));

  if (!command.data || !command.execute) {
    console.error(`Error en el archivo de comando ${commandFile}: falta 'data' o 'execute'`);
  } else {
    client.commands.set(command.data.name, command);
  }
});

const rest = new REST().setToken(config.CLIENT_TOKEN);

(async () => {
  try {
    console.log('Comenzando la actualización de comandos slash...');

    await rest.put(
      Routes.applicationGuildCommands(config.APP_ID, config.GUILD_ID),
      {
        body: client.commands.map((cmd) => cmd.data.toJSON()),
      }
    );
    console.log(`Cargados ${client.commands.size} slash commands {/}`);
  } catch (error) {
    console.error(error);
  }
})();

client.on('ready', async (c) => {
  console.log(`Logeado como ${c.user.tag}!`);
});

client.on('interactionCreate', async (interaction) => {
  if (interaction.isChatInputCommand()) {
    const command = client.commands.get(interaction.commandName);

    if (!command) {
      console.error(`Comando no encontrado: ${interaction.commandName}`);
      return interaction.reply({ content: 'Comando no encontrado.', flags: MessageFlags.Ephemeral });
    }

    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(`Error al ejecutar el comando ${interaction.commandName}:`, error);
      interaction.reply({ content: 'Hubo un error al ejecutar este comando.', flags: MessageFlags.Ephemeral });
    }
  }
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  if (message.content.toLowerCase().startsWith('link')) {
    const roomLink = getRoomLink();
    if (!roomLink) {
      return message.reply("El host no está abierto ahora mismo.");
    }

    const loadingMessage = await message.reply("Cargando link...");
    setTimeout(async () => {
      try {
        await loadingMessage.edit(`Pandita <@${message.author.id}>, el link del host es ${roomLink}`);
      } catch (error) {
        console.error("Error al editar el mensaje:", error);
      }
    }, 2000);
  }

  setTimeout(() => {
    if (message && message.channelId === '1276988562650435584') {
      sendAnnouncement(`${message.author.username}: ${message.content}`, null, 0xB766CC, 1);
    }
  }, 1000);
});

client.login(config.CLIENT_TOKEN);
