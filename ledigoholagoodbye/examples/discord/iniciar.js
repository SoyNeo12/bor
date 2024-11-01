const { Client, Collection, REST, Routes } = require('discord.js');
const config = require('./config.json');
const fs = require('fs');
const path = require('path');

const client = new Client({ intents: 3276799 });

client.commands = new Collection();

fs.readdirSync(path.join(__dirname, "./slashCommands")).forEach((commandFile) => {
  const command = require(path.join(__dirname, `./slashCommands/${commandFile}`));
  client.commands.set(command.data.name, command);
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
    command.execute(interaction).catch(console.error);
  } else {
    // no hace nada
  }
});

client.login(config.CLIENT_TOKEN);
