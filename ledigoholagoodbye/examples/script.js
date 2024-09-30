const HaxballJS = require('haxball.js');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');

const mapaX3 = fs.readFileSync('./examples/maps/mapaX3.hbs', 'utf-8');
const mapaX5 = fs.readFileSync('./examples/maps/mapaX5.hbs', 'utf-8');
const mapaX7 = fs.readFileSync('./examples/maps/mapaX7.hbs', 'utf-8');

const mensajesJSON = require("./mensajes.json");
const playersDir = './players';
const playersFilePath = `${playersDir}/players.json`;
const rolesFilePath = path.join(__dirname, 'roles.json');

let rolesData;
try {
  rolesData = JSON.parse(fs.readFileSync(rolesFilePath, 'utf8'));
} catch (err) {
  console.error('Error al leer roles.json:', err); // hola mi corazón, cómo estás? <3 i love u
  rolesData = {
    roles: { usuarios: { users: [] } }
  };
}

if (!fs.existsSync(playersDir)) {
  fs.mkdirSync(playersDir, { recursive: true });
}

let playerStats = {};
let room;

if (fs.existsSync(playersFilePath)) {
  const data = fs.readFileSync(playersFilePath);
  playerStats = JSON.parse(data);
} else {
  fs.writeFileSync(playersFilePath, JSON.stringify({}));
}

const bannedPlayersDir = ('./bannedPlayers');
const bannedPlayersFilePath = (`${bannedPlayersDir}/bannedPlayers.json`);

if (!fs.existsSync(bannedPlayersDir)) {
  fs.mkdirSync(bannedPlayersDir, { recursive: true });
}

let bannedPlayers = [];

if (fs.existsSync(bannedPlayersFilePath)) {
  const data = fs.readFileSync(bannedPlayersFilePath);
  try {
    bannedPlayers = JSON.parse(data);

    if (!Array.isArray(bannedPlayers)) {
      bannedPlayers = [];
    }
  } catch (err) {
    console.error("Error al parsear el archivo bannedPlayers.json", err);
    bannedPlayers = [];
  }
} else {
  fs.writeFileSync(bannedPlayersFilePath, JSON.stringify([]));
}

const despedidasJSON = require('./despedidas.json');

let roomLink = '';

HaxballJS.then((HBInit) => {
  room = HBInit({
    roomName: "𝐉𝐔𝐄𝐆𝐀𝐍 𝐓𝐎𝐃𝐎𝐒 | 𝐏𝐀𝐍𝐃𝐀🐼🎋",
    maxPlayers: 26, // el que quieras
    public: false,
    noPlayer: true,
    geo: {
      "lat": -33.4029,
      "lon": -70.5445,
      "code": "AR"
    },
    token: "thr1.AAAAAGb57WUhTnKaGMOOQA.lV0-2h3oHX4"
  });
  // "| 𝘓𝘌𝘎𝘐𝘖𝘕 𝘗𝘈𝘕𝘋𝘈 - 🐼🎋
  const ranks = {
    '[Pandita Bebé 1🐼]': { range: [0, 49], colorRank: 0xffffff }, // 1
    '[Pandita Bebé 2🐼]': { range: [50, 99], colorRank: 0xf0f0f0 }, // 2
    '[Pandita Bebé 3🐼]': { range: [100, 159], colorRank: 0xe1e1e1 }, // 3

    '[Pandita Aventurero 1🔍🐼]': { range: [160, 219], colorRank: 0xcbefff }, // 1
    '[Pandita Aventurero 2🔍🐼]': { range: [220, 279], colorRank: 0xc2ecfe }, // 2
    '[Pandita Aventurero 3🔍🐼]': { range: [280, 339], colorRank: 0xb8e3f6 }, // 3

    '[Panda Guerrero 1⚔️🐼]': { range: [340, 409], colorRank: 0xa2d9f1 }, // 1
    '[Panda Guerrero 2⚔️🐼]': { range: [410, 479], colorRank: 0x93d3f0 }, // 2
    '[Panda Guerrero 3⚔️🐼]': { range: [480, 549], colorRank: 0x7ecbed }, // 3

    '[Panda Hechicero 1🔮🐼]': { range: [550, 639], colorRank: 0x6d8bf1 }, // 1
    '[Panda Hechicero 2🔮🐼]': { range: [640, 729], colorRank: 0x5a7be8 }, // 2
    '[Panda Hechicero 3🔮🐼]': { range: [730, 819], colorRank: 0x476eef }, // 3

    '[Fan del Bambú 1🌿]': { range: [820, 919], colorRank: 0xa4f3be }, // 
    '[Fan del Bambú 2🌿]': { range: [920, 1019], colorRank: 0x8febad }, // 
    '[Fan del Bambú 3🌿]': { range: [1020, 1149], colorRank: 0x7ce9a0 }, // 

    '[Guardián del Bambú 1🛡️🌿]': { range: [1150, 1299], colorRank: 0x78ff6a }, // 1
    '[Guardián del Bambú 2🛡️🌿]': { range: [1300, 1449], colorRank: 0x68fd58 }, // 2
    '[Guardián del Bambú 3🛡️🌿]': { range: [1450, 1649], colorRank: 0x53f342 }, // 3

    '[Héroe Bambú 1🌿🐼]': { range: [1650, 1949], colorRank: 0xff8c7a }, // 1
    '[Héroe Bambú 2🌿🐼]': { range: [1950, 2099], colorRank: 0xfa7965 }, // 2
    '[Héroe Bambú 3⭐🐼]': { range: [2100, 2499], colorRank: 0xeeeb58 }, // 3

    '[Rey Panda 👑🐼]': { range: [2500, Infinity], colorRank: 0xfcfa83 } // Rey Panda
  };
  /**
   * @author skai
   */
  const coordenadas = {
    x3red: { x: -652, y: 0 },
    x3blue: { x: 652, y: 0 },
    x5red: { x: -931.55, y: -4.41 },
    x5blue: { x: 931.55, y: 4.41 },
    x7red: { x: -1183.41, y: -10.00 },
    x7blue: { x: 1183.41, y: 10.00 }
  }

  const palabrasCensuradas = ['down', 'pija', 'pelotudo', 'chupar', 'chupa', 'verga', 'autista', 'mongolico', 'mogolico', 'pene', 'hijo de puta', 'pelmazo', 'mamerto', 'aweonao', 'hijodeputa', 'horrendos', 'chupas', 'nazi', 'nasi'];
  const POWER_HOLD_TIME = 1800;
  const BOOST_SPEEDS = [1.2, 1.5, 1.7, 2];
  const COLORS = [0xFF0204, 0xE60102, 0xB50002, 0x540202];
  const NORMAL_BALL_COLOR = 0xfff000;
  const cooldown = {};
  const playerId = {};
  const playerRadius = 15;
  const activities = {};
  const GRAVITY_HOLD_TIME = 1800;
  const MODES = ['power', 'comba'];
  const inactivityThreshold = 15000;
  const warningTime = 15000;
  const warnedPlayers = {};

  let lastPlayerTouchBall = null;
  let secondPlayerTouchBall = null;
  let gkred = [], gkblue = [];
  let votes = 0;
  let requiredVotes = 3;
  let votedPlayers = [];
  let powerEnabled = true;
  let gravityEnabled = false;
  let gravityStrength = 0.05;
  let gravityActive = false;
  let gravityTimer = null;
  let ballHeldBy = null;
  let bolapor = null;
  let powerActive = false;
  let powerLevel = 0;
  let powerIncreaseInterval = null;
  let EnLaSala = {};
  let slotsActivated = false;
  let isGameStart = false;
  let lastMode = null;
  let goles = [];
  let owngoals = [];
  let chaosModeTimer;
  let remainingTime = 30000;
  let PowerComba = null;
  let team1Name = '';
  let team2Name = '';
  // ---
  let Marcador = [
    { Red: 0, Blue: 0 }
  ];

  let teams = [
    {
      name: "Liverpool",
      team: 1,
      avatarColor: 0xFFFFFF,
      angle: 90,
      colors: [0xC70000, 0xD10000, 0xFF0000]
    },
    {
      name: "Lanús",
      team: 1,
      avatarColor: 0xFAFAFA,
      angle: 0,
      colors: [0x70020C, 0x660108, 0x6E010C]
    },
    {
      name: "Newell's Old Boys",
      team: 1,
      avatarColor: 0xFFFFFF,
      angle: 0,
      colors: [0x8F0404, 0x000000]
    },
    {
      name: "River Plate",
      team: 1,
      avatarColor: 0x000000,
      angle: 60,
      colors: [0xFFFFFF, 0xD11B1B, 0xFFFFFF]
    },
    {
      name: "Colo Colo",
      team: 1,
      avatarColor: 0x000000,
      angle: 0,
      colors: [0xFFFFFF]
    },
    {
      name: "San Martín (SJ)",
      team: 1,
      avatarColor: 0xFFFFFF,
      angle: 0,
      colors: [0x0A5E1E, 0x000000, 0x0A5E1E]
    },
    {
      name: "Real Madrid (Local 2012)",
      team: 1,
      avatarColor: 0x91861F,
      angle: 0,
      colors: [0xFFFFFF]
    },
    {
      name: "Real Madrid (Visita 2024)",
      team: 1,
      avatarColor: 0x000000,
      angle: 60,
      colors: [0xE69D0C, 0xD6930B, 0xCC8C0A]
    },
    {
      name: "Bayern Munich",
      team: 1,
      avatarColor: 0x000000,
      angle: 0,
      colors: [0xD10000, 0x990000, 0xD10000]
    },
    {
      name: "España",
      team: 1,
      avatarColor: 0xF0F00E,
      angle: 0,
      colors: [0xF0F00E, 0xFF0000]
    },
    {
      name: "Brasil",
      team: 1,
      avatarColor: 0x2DF50F,
      angle: 0,
      colors: [0xFFEF0A, 0xEBDC09]
    },
    {
      name: "Holanda",
      team: 1,
      avatarColor: 0x250EF0,
      angle: 0,
      colors: [0xFF5521]
    },
    {
      name: "Deportes Concepcion",
      team: 1,
      avatarColor: 0xFFFFFF,
      angle: 0,
      colors: [0x6E2494, 0x621F85, 0x571D75]
    },
    {
      name: "Argentina",
      team: 2,
      avatarColor: 0xDEE609,
      angle: 0,
      colors: [0x08DFFF, 0xFFFFFF, 0x08DFFF]
    },
    {
      name: "Inglaterra",
      team: 2,
      avatarColor: 0x090082,
      angle: 0,
      colors: [0xFFFFFF]
    },
    {
      name: "Italia",
      team: 2,
      avatarColor: 0xFFFFFF,
      angle: 0,
      colors: [0x2D69F7]
    },
    {
      name: "Barcelona",
      team: 2,
      avatarColor: 0xFCDB00,
      angle: 0,
      colors: [0x9C0505, 0x004077]
    },
    {
      name: "Inter de Milán",
      team: 2,
      avatarColor: 0xFFFFFF,
      angle: 0,
      colors: [0x0000F0, 0x000000, 0x0000F0]
    },
    {
      name: "Manchester City",
      team: 2,
      avatarColor: 0xFFFFFF,
      angle: 90,
      colors: [0x3BF8FF]
    },
    {
      name: "Borussia Dortmund",
      team: 2,
      avatarColor: 0xFFFFFF,
      angle: 70,
      colors: [0xEFFF14, 0xEFFF14, 0x000000]
    },
    {
      name: "PSG",
      team: 2,
      avatarColor: 0xFFFFFF,
      angle: 0,
      colors: [0x0F1566, 0xFF1212, 0x0F1566]
    },
    {
      name: "Boca Juniors",
      team: 2,
      avatarColor: 0xFFFFFF,
      angle: 90,
      colors: [0x0D1DFF, 0xFFE817, 0x0D1DFF]
    },
    {
      name: "Boca Juniors Alternativa",
      team: 2,
      avatarColor: 0xFFE817,
      angle: 90,
      colors: [0x07108A, 0x070F80, 0x07108A]
    },
    {
      name: "Rosario Central",
      team: 2,
      avatarColor: 0xFFFFFF,
      angle: 0,
      colors: [0x0000B0, 0xE8E23C, 0x0000B0]
    },
    {
      name: "Banfield",
      team: 2,
      avatarColor: 0x736F08,
      angle: 0,
      colors: [0x04522B, 0xFFFFFF, 0x04522B]
    },
    {
      name: "Universidad de Chile",
      team: 2,
      avatarColor: 0xFFFFFF,
      angle: 90,
      colors: [0x004077]
    },
    {
      name: "Universidad Catolica",
      team: 2,
      avatarColor: 0xFFFFFF,
      angle: 90,
      colors: [0xFFFFFF, 0x2197FF, 0xFFFFFF]
    },
    {
      name: "Fernandez Vial",
      team: 2,
      avatarColor: 0xFFFFFF,
      angle: 0,
      colors: [0xD5DB1F, 0x000000, 0xD5DB1F]
    },
  ];
  // ---

  /**/

  // ---
  let RecSistem = {
    sendDiscordWebhook: function () {
      const recordingData = room.stopRecording();

      if (!recordingData || recordingData.byteLength <= 4) {
        console.error("No se pudo grabar el partido.");
        return;
      }

      let autogolesText = owngoals.map(auto => {
        const emojiTeam = auto.team === 1 ? "🟥" : "🟦";
        return `🤡 ${emojiTeam} ${auto.name} ${auto.count > 1 ? `x${auto.count}` : ""}`;
      }).join("\n");

      let golesText = goles.map(gol => {
        const emojiTeam = gol.team === 1 ? "🟥" : "🟦";
        return `⚽ ${emojiTeam} ${gol.name} ${gol.count > 1 ? `x${gol.count}` : ""}${gol.assisterName ? ` (👟 ${gol.assisterName})` : ""}`;
      }).join("\n");

      const form = new FormData();
      form.append('file', Buffer.from(recordingData), `${new Date().toISOString().replace(/[:.]/g, '-')}.hbr2`);

      const red = room.getPlayerList().filter(p => p.team === 1);
      const blue = room.getPlayerList().filter(p => p.team === 2);

      const printRed = red.map(p => `**${p.name}**`).join('\n');
      const printBlue = blue.map(p => `**${p.name}**`).join('\n');

      const embed = {
        title: `🎥 **Sistema de Grabación**`,
        color: 0x3498db,
        fields: [
          {
            name: `**📊 Marcador**`,
            value: `🟥 **${room.getScores().red}** - **${room.getScores().blue}** 🟦`,
            inline: true
          },
          {
            name: `**🥅 Asistencias/Autogoles/Goles**`,
            value: `${golesText}\n\n${autogolesText}`,
            inline: false
          },
          {
            name: `**🔴 Formación - Red Team**`,
            value: printRed || `No hay jugadores en el equipo rojo.`,
            inline: false
          },
          {
            name: `**🔵 Formación - Blue Team**`,
            value: printBlue || `No hay jugadores en el equipo azul.`,
            inline: false
          }
        ],
        footer: {
          text: "La REC está arriba☝️🐼", //AJAJAJAJAJA
          timestamp: `${new Date().toISOString().replace(/[:.]/g, '-')}`
        }
      };

      form.append('payload_json', JSON.stringify({ embeds: [embed] }));

      axios.post('https://discord.com/api/webhooks/1278826986848124968/RIcB7cFotUeMvTjaCrg3S_QZnOGGV11jDxFmL7lTLcCec9b0Cb6Z_BGuUM-SOkEXWHDr', form, {
        headers: { ...form.getHeaders() }
      })
        .then(() => {
          room.sendAnnouncement("[📹] Grabación del partido enviada a nuestro discord. Muchas gracias por jugar en PANDA🎋🐼.", null, null, "bold", 2);
        })
        .catch(error => {
          console.error("Error al enviar la grabación y el embed al Discord:", error);
          room.sendAnnouncement("[❌] Error al enviar la grabación y el embed.", null, null, "bold", 2);
        });
    }
  };

  function shuffleTeams() {
    const players = room.getPlayerList();
    const half = Math.floor(players.length / 2);

    for (let i = players.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [players[i], players[j]] = [players[j], players[i]];
    }

    players.forEach((player, index) => {
      const newTeam = index < half ? 1 : 2;
      room.setPlayerTeam(player.id, newTeam);
    });
  }

  function getPlayerRole(auth) {
    for (const role in rolesData.roles) {
      if (rolesData.roles[role].users.includes(auth)) {
        return role;
      }
    }
    return null;
  }

  function determineRank(playerXP) {
    for (const [rankName, { range, colorRank }] of Object.entries(ranks)) {
      if (playerXP >= range[0] && playerXP <= range[1]) {
        return { rankName, colorRank };
      }
    }
  }

  function resetSize(player) {
    setTimeout(() => {
      if (player) {
        room.setPlayerDiscProperties(player.id, { radius: playerRadius });
      }
    }, 4000);
  }

  function updateMaps() {
    const playerCount = room.getPlayerList().length;

    if (playerCount >= 1 && playerCount <= 7) {
      room.setCustomStadium(mapaX3);
      room.setTimeLimit(3);
      room.setScoreLimit(3);
    } else if (playerCount >= 8 && playerCount <= 15) {
      room.setCustomStadium(mapaX5);
      room.setTimeLimit(7);
      room.setScoreLimit(5);
    } else if (playerCount >= 16) {
      room.setCustomStadium(mapaX7);
      room.setTimeLimit(7);
      room.setScoreLimit(5);
    }
  }

  function messagesRandom() {
    const mensajes = mensajesJSON.messages;
    const mensajeAleatorio = mensajes[Math.floor(Math.random() * mensajes.length)];
    room.sendAnnouncement(mensajeAleatorio, null, 0x00FF00, "bold", 2);
  }

  function despedidasMessages(player) {
    const mensajes = despedidasJSON.messages;
    const mensajeAleatorio = mensajes[Math.floor(Math.random() * mensajes.length)];
    room.kickPlayer(player.id, mensajeAleatorio, false);
  }

  function isBallCloseToPlayer(ballPosition, playerPosition) {
    if (!ballPosition || !playerPosition) {
      return false;
    }

    const distance = Math.sqrt(
      Math.pow(ballPosition.x - playerPosition.x, 2) +
      Math.pow(ballPosition.y - playerPosition.y, 2)
    );

    return distance < 30;
  }

  function findPlayer(name) {
    let players = room.getPlayerList();
    let regex = new RegExp("^" + name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").toLowerCase(), "i");
    for (let i = 0; i < players.length; i++) {
      if (regex.test(players[i].name.toLowerCase())) {
        return players[i];
      }
    }
    return null;
  }

  function chaosMode() {
    const playerList = room.getPlayerList();
    if (playerList.length >= 4) {
      if (!isGameStart) return;
      let mode;
      do {
        mode = Math.floor(Math.random() * 4) + 1;
      } while (mode === lastMode);
      lastMode = mode;

      if (mode === 1) {
        room.sendAnnouncement("¡Primer modo de la lista!", null, null, "bold", 2);
        room.sendAnnouncement("¡Todos enanos!", null, 0x00FF00, "bold", 2);
        playerList.forEach(function (player) {
          room.setPlayerDiscProperties(player.id, { radius: playerRadius - 5 });
        });
      } else if (mode === 2) {
        room.sendAnnouncement("¡Segundo modo de la lista!", null, null, "bold", 2);
        room.sendAnnouncement("¡Todos gigantes!", null, 0x00FF00, "bold", 2);
        playerList.forEach(function (player) {
          room.setPlayerDiscProperties(player.id, { radius: playerRadius + 7 });
        });
      } else if (mode === 3) {
        room.sendAnnouncement("¡Tercer modo de la lista!", null, null, "bold", 2);
        room.sendAnnouncement("Pelota enana!", null, 0x00FF00, "bold", 2);
        playerList.forEach(function () {
          const ballDisc = room.getDiscProperties(0);
          if (ballDisc !== null) {
            room.setDiscProperties(0, {
              radius: ballDisc.radius - 2
            });
          }
        });
      } else if (mode === 4) {
        room.sendAnnouncement("¡Cuarto modo de la lista!", null, null, "bold", 2);
        room.sendAnnouncement("¡Pelota gigante!", null, 0x00FF00, "bold", 2);
        const ballDisc = room.getDiscProperties(0);
        if (ballDisc !== null) {
          room.setDiscProperties(0, {
            radius: ballDisc.radius * 2
          });
        }
      }

      chaosModeTimer = setTimeout(() => {
        resetChaosMode(mode);
        room.sendAnnouncement(`¡Modo ${mode} terminado!`, null, null, "bold", 2);
      }, remainingTime);
    } else {
      remainingTime = 30000;
    }
  }

  function resetChaosMode(mode) {
    const playerList = room.getPlayerList();
    if (mode === 1 || mode === 2) {
      playerList.forEach(function (player) {
        room.setPlayerDiscProperties(player.id, { radius: playerRadius });
      });
    } else if (mode === 3 || mode === 4) {
      const ballDisc = room.getDiscProperties(0);
      if (ballDisc !== null) {
        room.setDiscProperties(0, {
          radius: 6.4
        });
      }
    }
    remainingTime = 30000;
  }

  function checkSlots(p) {
    const players = room.getPlayerList().length;
    const playerAuth = playerId[p.id];

    if (players >= 24) {
      if (!slotsActivated) {
        if (rolesData.roles["owner"].users.includes(playerAuth) || rolesData.roles["coowner"].users.includes(playerAuth) || rolesData.roles["granpanda"].users.includes(playerAuth) || rolesData.roles["jefepanda"].users.includes(playerAuth) || rolesData.roles["maestropanda"].users.includes(playerAuth) || rolesData.roles["liderpanda"].users.includes(playerAuth) || rolesData.roles["subliderpanda"].users.includes(playerAuth) || rolesData.roles["asistente"].users.includes(playerAuth)) {
          room.sendAnnouncement("Slots activados solo para admins", null, null, "bold", 2);
          slotsActivated = true;
        } else {
          room.kickPlayer(p.id, "Estos espacios están reservados solo para los admins", false);
        }
      } else {
        room.sendAnnouncement("Los slots están desactivados", null, null, "bold", 2);
        slotsActivated = false;
      }
    }
  }

  function sendMessages(message) {
    axios.post('https://discord.com/api/webhooks/1276994417424859280/YPcP2brHPBTKiT-HrEShwTuxNgJvOeE5uBSbAmFB7rqXvk3h5XHaWiZNcSykzOSxevWV', {
      content: message
    })
  }

  function handleAfkPlayers() {
    const players = room.getPlayerList();

    for (const player of players) {
      const playerAuth = playerId[player.id];

      if (player.team !== 0 && room.getScores() !== null) {
        const lastActivity = activities[player.id] || Date.now();
        const currentTime = Date.now();

        if (currentTime - lastActivity >= inactivityThreshold && !warnedPlayers[player.id] && !gkred.includes(playerAuth) && !gkblue.includes(playerAuth)) {
          room.sendAnnouncement(`${player.name}, estás AFK. Serás expulsado en 15 segundos si no te mueves.`, player.id, 0xFFFF00, "bold", 2);

          warnedPlayers[player.id] = setTimeout(() => {
            const lastActivityAfterWarning = activities[player.id] || Date.now();
            const currentTimeAfterWarning = Date.now();

            if (currentTimeAfterWarning - lastActivityAfterWarning >= inactivityThreshold && !gkred.includes(playerAuth) && !gkblue.includes(playerAuth)) {
              room.kickPlayer(player.id, "AFK", false);
            }

            delete warnedPlayers[player.id];
          }, warningTime);
        }
      }
    }
  }

  function getRandomMode(exclude) {
    const availableModes = MODES.filter(mode => mode !== exclude);
    return availableModes[Math.floor(Math.random() * availableModes.length)];
  }

  function startGame() {
    const currentMode = getRandomMode(PowerComba);
    PowerComba = currentMode;

    if (currentMode === 'power') {
      powerEnabled = true;
      gravityEnabled = false;
      room.sendAnnouncement('Power activado', null, 0x00FF00, "bold", 2);
    } else if (currentMode === 'comba') {
      gravityEnabled = true;
      powerEnabled = true;
      room.sendAnnouncement('Comba activado', null, 0x00FF00, "bold", 2);
    }
  }

  function sendRankingToDiscord(title, ranking) {
    const embed = {
      embeds: [
        {
          title: title,
          description: ranking,
          color: 344700,
          timestamp: new Date(),
        }
      ]
    };

    axios.post("https://discord.com/api/webhooks/1287477065804939314/qar1U0wZKZXc2yNGT7vr_rlTb7A8wmzYe1xtnlT8KV-hAFZZR6zI7GGLpMhDZ7n6RUcW", embed)
      .then(() => {
        console.log(`Mensaje enviado al canal de Discord con el título: ${title}`);
      })
      .catch((error) => {
        console.error(`Error enviando el mensaje a Discord: ${error.message}`);
      });
  }

  function jugadoresSorteados(key) {
    return Object.values(playerStats)
      .filter(player => player.games >= 5)
      .sort((a, b) => b[key] - a[key])
      .map(player => ({
        name: player.name,
        value: player[key],
      }));
  }

  function generateRanking() {
    const topVallas = jugadoresSorteados("vallas").slice(0, 5);
    let announcementVallas = "**🧤🥅Ranking de Vallas Invictas🧤🥅:**\n";
    topVallas.forEach((player, index) => {
      announcementVallas += `${index + 1}. ${player.name}: ${player.value} vallas\n`;
    });

    const topGoals = jugadoresSorteados("goals").slice(0, 5);
    let announcementGoles = "**⚽Ranking de Goles⚽:**\n";
    topGoals.forEach((player, index) => {
      announcementGoles += `${index + 1}. ${player.name}: ${player.value} goles\n`;
    });

    const topVictorias = jugadoresSorteados("victories").slice(0, 5);
    let announcementVictorias = "**✅Ranking de Victorias✅:**\n";
    topVictorias.forEach((player, index) => {
      announcementVictorias += `${index + 1}. ${player.name}: ${player.value} victorias\n`;
    });

    const topAsistencias = jugadoresSorteados("assists").slice(0, 5);
    let announcementAsistencias = "**👟🧙‍♂️Ranking de Asistencias👟🧙‍♂️:**\n";
    topAsistencias.forEach((player, index) => {
      announcementAsistencias += `${index + 1}. ${player.name}: ${player.value} asistencias\n`;
    });

    const topJuegos = jugadoresSorteados("games").slice(0, 5);
    let announcementJuegos = "**🎋Ranking de Juegos🎋:**\n";
    topJuegos.forEach((player, index) => {
      announcementJuegos += `${index + 1}. ${player.name}: ${player.value} juegos\n`;
    });

    const topWinrate = jugadoresSorteados("winrate").slice(0, 5);
    let announcementWinrate = "**💪Ranking de Winrate💪:**\n";
    topWinrate.forEach((player, index) => {
      announcementWinrate += `${index + 1}. ${player.name}: ${player.value}% winrate\n`;
    });
    const fullAnnouncement = `${announcementVallas}\n${announcementGoles}\n${announcementVictorias}\n${announcementAsistencias}\n${announcementJuegos}\n${announcementWinrate}`;
    sendRankingToDiscord("📊 Rankings del Juego 📊", fullAnnouncement);
  }

  function changeColors() {
    try {
      if (!teams || !Array.isArray(teams) || teams.length < 2) {
        console.error("Error: La lista de equipos no está correctamente definida o no contiene suficientes equipos.");
        return false;
      } else {
        let redTeams = teams.filter(team => team.team === 1);
        let blueTeams = teams.filter(team => team.team === 2);

        if (!redTeams || !Array.isArray(redTeams) || redTeams.length === 0) {
          console.error("Error: No se encontraron equipos rojos disponibles.");
          return false;
        }
        if (!blueTeams || !Array.isArray(blueTeams) || blueTeams.length === 0) {
          console.error("Error: No se encontraron equipos azules disponibles.");
          return false;
        }

        let team1 = redTeams[Math.floor(Math.random() * redTeams.length)];
        let team2 = blueTeams[Math.floor(Math.random() * blueTeams.length)];

        room.setTeamColors(1, team1.angle, team1.avatarColor, team1.colors);
        room.setTeamColors(2, team2.angle, team2.avatarColor, team2.colors);

        team1Name = team1.name;
        team2Name = team2.name;
      }
    } catch (error) {
      console.error("Error inesperado durante el inicio del juego:", error);
      room.sendAnnouncement("❌ Error inesperado durante el inicio del juego. Por favor, reinicia el servidor.", null, 0xFF0000, "bold", 2);
    }
  }

  const isRegistered = (playerAuth) => {
    return playerStats[playerAuth] && playerStats[playerAuth].registered;
  };

  const isLoggedIn = (playerAuth) => {
    return playerStats[playerAuth] && playerStats[playerAuth].logged;
  };

  function contienePalabraCensurada(message) {
    const mensajeEnMinusculas = message.toLowerCase();
    return palabrasCensuradas.some(palabra => mensajeEnMinusculas.includes(palabra));
  }

  room.onRoomLink = (link) => {
    roomLink = link;
    console.log(roomLink);
  };

  room.onPlayerTeamChange = function (changedPlayer, byPlayer) {
    const playerAuth = playerId[changedPlayer.id];

    activities[changedPlayer.id] = Date.now();

    if (warnedPlayers[changedPlayer.id]) {
      clearTimeout(warnedPlayers[changedPlayer.id]);
      delete warnedPlayers[changedPlayer.id];
    }

    if (gkred.includes(playerAuth)) {
      gkred = gkred.filter(gk => gk.auth !== playerAuth && gk.id !== changedPlayer.id);
    } else if (gkblue.includes(playerAuth)) {
      gkblue = gkblue.filter(gk => gk.auth !== playerAuth && gk.id !== changedPlayer.id);
    }

    setTimeout(() => {
      activities[changedPlayer.id] = Date.now();
    }, 10000);

    if (byPlayer != null) {
      activities[byPlayer.id] = Date.now();

      if (warnedPlayers[byPlayer.id]) {
        clearTimeout(warnedPlayers[byPlayer.id]);
        delete warnedPlayers[byPlayer.id];
      }
    }
  };

  room.onPositionsReset = function () {
    let players = room.getPlayerList();

    for (let i = 0; i < players.length; i++) {
      activities[players[i].id] = Date.now();
      if (warnedPlayers[players[i].id.id]) {
        clearTimeout(warnedPlayers[players[i].id.id]);
        delete warnedPlayers[players[i].id.id];
      }
    }

    if (players.length >= 4 && lastMode) {
      if (chaosModeTimer) {
        clearTimeout(chaosModeTimer);
      }
      resetChaosMode(lastMode);
      room.sendAnnouncement(`¡Modo ${lastMode} terminado!`, null, null, "bold", 2);
    }
  };

  room.onPlayerJoin = (p) => {
    checkSlots(p);

    const isBanned = bannedPlayers.some(entry => entry.auth === p.auth);
    if (isBanned) {
      room.kickPlayer(p.id, "Estás baneado permanentemente.", false);
      return;
    }

    const registeredPlayer = Object.values(playerStats).find(data => data.name === p.name && data.auth !== p.auth);
    if (registeredPlayer) {
      room.sendAnnouncement(`El nombre "${p.name}" ya está registrado con otro auth. Por favor, usa el comando !login [contraseña] para iniciar sesión con esa cuenta.`, p.id, 0xFF0000, "bold", 2);
    }

    if (p.name.trim().length === 0 || p.name === "⠀") {
      room.kickPlayer(p.id, "Necesitas tener un carácter mínimo en el nombre.", false);
      return;
    }

    const isMultiAccount = Object.keys(playerStats).find(auth => EnLaSala[auth] === true && auth === p.auth);
    if (isMultiAccount) {
      room.kickPlayer(p.id, "No se permiten multicuentas.", false);
      return;
    }

    if (!playerStats[p.auth]) {
      playerStats[p.auth] = {
        name: p.name,
        auth: p.auth,
        goals: 0,
        assists: 0,
        owngoals: 0,
        victories: 0,
        defeats: 0,
        vallas: 0,
        games: 0,
        winrate: 0,
        xp: 0,
        password: '',
        rank: '[Pandita Bebé 1🐼]',
        logged: false,
        sanciones: 0,
        registered: false
      };
    } else {
      if (playerStats[p.auth].name !== p.name) {
        playerStats[p.auth].name = p.name;
      }
    }

    EnLaSala[p.auth] = true;
    playerId[p.id] = p.auth;

    if (!registeredPlayer) {
      room.sendAnnouncement(`[👋] ¡¡¡Bienvenido ${p.name}!!! Que disfrutes de PANDA🎋🐼.`, p.id, 0x6FA8DC, "bold", 2);
      room.sendAnnouncement(`[🐼] Usá el comando !dc para entrar al Discord de la comunidad y estar al tanto de las novedades🐼.`, p.id, 0x3C78D8, "bold", 2);

      if (isRegistered(p.auth) && !isLoggedIn(p.auth)) {
        room.sendAnnouncement(`@${p.name}, por favor usa el comando !login [password] para iniciar sesión.`, p.id, null, "bold", 2);
      }

      if (!isRegistered(p.auth)) {
        room.sendAnnouncement(`@${p.name}, bienvenido! Puedes jugar como invitado o registrarte usando el comando !register [password].`, p.id, null, "bold", 2);
      }
    }

    if (rolesData.roles[getPlayerRole(p.auth)]?.gameAdmin) {
      room.setPlayerAdmin(p.id, true);
    }

    switch (playerStats[p.auth].rank) {
      case "Rey Panda 👑🐼":
        room.sendAnnouncement(`¡Pero mira quien entró, el rango más alto! Bienvenido, ${p.name}`, null, 0xD0B97A, "bold", 1);
        break;
      case "Héroe Bambú 3⭐🐼":
        room.sendAnnouncement(`¡Estás a un paso del Rey Panda, sigue así ${p.name}!`, null, 0xA6B93F, "bold", 1);
        break;
    }

    const red = room.getPlayerList().filter(player => player.team === 1).length;
    const blue = room.getPlayerList().filter(player => player.team === 2).length;

    if (red <= blue) {
      room.setPlayerTeam(p.id, 1);
    } else {
      room.setPlayerTeam(p.id, 2);
    }

    const players = room.getPlayerList().length;

    if (red === 3 && blue === 3 && players >= 6) {
      console.log(`Asignando al jugador ${p.name} al equipo 0`);
      room.setPlayerTeam(p.id, 0);
    }

    if (players === 1) {
      updateMaps();
      room.startGame();
    } else if (players < 1) {
      room.stopGame();
    }
  };

  room.onPlayerLeave = (player) => {
    checkSlots(player);
    const playerAuth = playerId[player.id];
    EnLaSala[playerAuth] = false;
    gkred = gkred.filter(gk => gk.auth !== playerAuth && gk.id !== player.id);
    gkblue = gkblue.filter(gk => gk.auth !== playerAuth && gk.id !== player.id);
    if (votedPlayers.some(vote => vote.id === player.id)) {
      votedPlayers = votedPlayers.filter(vote => vote.id !== player.id);
      votes--;
    }
    if (playerStats[playerAuth]) {
      playerStats[playerAuth].logged = false;
      fs.writeFileSync(playersFilePath, JSON.stringify(playerStats, null, 2));
    }
  };

  room.onPlayerBallKick = (player) => {
    secondPlayerTouchBall = lastPlayerTouchBall;
    lastPlayerTouchBall = player;

    if (powerActive && powerEnabled) {
      const ballProperties = room.getDiscProperties(0);

      const newVelocity = {
        xspeed: ballProperties.xspeed * BOOST_SPEEDS[powerLevel],
        yspeed: ballProperties.yspeed * BOOST_SPEEDS[powerLevel]
      };

      room.setDiscProperties(0, {
        xspeed: newVelocity.xspeed,
        yspeed: newVelocity.yspeed,
        color: NORMAL_BALL_COLOR
      });

      powerActive = false;
      ballHeldBy = null;
      powerLevel = 0;
      if (powerIncreaseInterval) {
        clearInterval(powerIncreaseInterval);
        powerIncreaseInterval = null;
      }
    }
    // hola amor
    if (gravityActive && gravityEnabled) {
      const ballProperties = room.getDiscProperties(0);
      const playerPosition = player.position;

      if (playerPosition.y < ballProperties.y) {
        room.setDiscProperties(0, { ygravity: -gravityStrength });
      } else if (playerPosition.y > ballProperties.y) {
        room.setDiscProperties(0, { ygravity: gravityStrength });
      } else if (playerPosition.x > ballProperties.x) {
        room.setDiscProperties(0, { ygravity: -gravityStrength });
      } else if (playerPosition.x < ballProperties.x) {
        room.setDiscProperties(0, { ygravity: gravityStrength });
      }

      setTimeout(() => {
        room.setDiscProperties(0, { ygravity: 0 })
      }, 2000);

      gravityActive = false;
      bolapor = null;
      if (gravityTimer) {
        clearInterval(gravityTimer);
        gravityTimer = null;
      }
    }
    activities[player.id] = Date.now();
  };

  // hola bb . holasicomoestas
  room.onTeamGoal = (team) => {
    let scorer = lastPlayerTouchBall;
    let assister = secondPlayerTouchBall;

    if (!scorer || !scorer.id) {
      room.sendAnnouncement("No se pudo determinar el jugador que marcó el gol.", null, 0xFF0000);
      return;
    }

    const playerAuth = playerId[scorer.id];
    const players = room.getPlayerList().length;
    const updateStats = players >= 6;

    if (playerStats[playerAuth] && playerStats[playerAuth].xp < 0) {
      playerStats[playerAuth].xp = 0;
    }

    if (scorer && scorer.team !== team) {
      let existingAutoGoal = owngoals.find(o => o.id === scorer.id);
      if (existingAutoGoal) {
        existingAutoGoal.count += 1;
      } else {
        owngoals.push({
          name: scorer.name,
          id: scorer.id,
          team: scorer.team,
          count: 1
        });
      }

      let mensajesAutoGol = [
        `🤦‍♂️MAMITA, GOL EN CONTRA DE ${scorer.name}!🤦‍♂️`,
        `😡MAMÁ, EN EL OTRO ARCO ${scorer.name}!😡`,
        `💀PERO QUÉ HACE!!! AUTO GOL DE ${scorer.name}!💀`,
        `☠️¡¡¡NOOOOOOO!!! GOL EN CONTRA DE ${scorer.name}!☠️`,
        `🤦‍♀️¡¡¡DESPEJALAAAAAA!!! GOL EN CONTRA DE ${scorer.name}!🤦‍♀️`,
        `❌¡¡¡PARA EL OTRO LADO!!! GOL EN CONTRA DE ${scorer.name}!❌`
      ];

      let autogolRandom = mensajesAutoGol[Math.floor(Math.random() * mensajesAutoGol.length)];
      room.sendAnnouncement(autogolRandom, null, 0xF903AF, "bold", 1);
      if (updateStats && playerStats[playerAuth] && playerStats[playerAuth].logged) {
        playerStats[playerAuth].owngoals = (playerStats[playerAuth].owngoals || 0) + 1;
      }
      room.setPlayerDiscProperties(scorer.id, { radius: playerRadius - 5 });
      resetSize(scorer);
    } else {
      let assisterName = null;
      if (assister && assister.id !== scorer.id && assister.team === team) {
        assisterName = assister.name;
        const assisterAuth = playerId[assister.id];
        const update = players >= 6;
        let mensajesAsistencia = [
          `👟🧙‍♂️ PASE MÁGICO DE ${assister.name}.🧙‍♂️`,
          `👟🧙‍♂️ MAGISTRAL PASE DE ${assister.name}.🎩`,
          `👟🧙‍♂️ TREMENDO PASE DE ${assister.name}.🎩`,
          `👟🧙‍♂️ QUÉ ASISTE ${assister.name}.🧙‍♂️`,
          `👟🧙‍♂️ ASISTENCIA PERFECTA DE ${assister.name}.🎩`,
          `👟🧙‍♂️ CON PASE GOL DE ${assister.name}.👏`,
          `👟🧙‍♂️ ASISTENCIA DE ${assister.name}.👏`,
          `👟🧙‍♂️ ASISTENCIA ESPECTACULAR DE ${assister.name}.👏`,
          `👟🧙‍♂️ LOCURA DE ASISTENCIA DE ${assister.name}.🤩`,
          `👟🧙‍♂️ QUÉ CENTRO DE ${assister.name}.🤩`,
          `👟🧙‍♂️ ASISTENCIA MÁGICA DE ${assister.name}.🧙‍♂️`
        ];

        let asistenciaRandom = mensajesAsistencia[Math.floor(Math.random() * mensajesAsistencia.length)];
        room.sendAnnouncement(asistenciaRandom, null, 0x9D52B2, "bold", 1);
        if (update && playerStats[assisterAuth] && playerStats[assisterAuth].logged) {
          playerStats[assisterAuth].assists = (playerStats[assisterAuth].assists || 0) + 1;
          playerStats[assisterAuth].xp = (playerStats[assisterAuth].xp || 0) + 1;
        }
      }

      let existingGoal = goles.find(g => g.id === scorer.id);
      if (existingGoal) {
        existingGoal.count += 1;
      } else {
        goles.push({
          name: scorer.name,
          id: scorer.id,
          team: scorer.team,
          count: 1,
          assisterName: assisterName
        });
      }

      let mensajesGol = [
        `⚽🐼 QUÉ DEFINE EL PANDITA, GOL DE ${scorer.name}!🐼⚽`,
        `⚽🐼 GOOOOLL, LO HIZO ${scorer.name}!🐼⚽`,
        `⚽🐼 ¿QUIÉN MÁS SINO? GOL DE ${scorer.name}!🐼⚽`,
        `⚽🐼 QUÉ GOLAZO ACABA DE HACER ${scorer.name}!🐼⚽`,
        `⚽🐼 PERO QUÉ CLAVA!!!, GOLÓN DE ${scorer.name}!🐼⚽`,
        `⚽🐼 UFFF, APARECIÓ ${scorer.name} PARA MANDARLA ADENTRO!🐼⚽`,
        `⚽🐼 QUÉ FUNDE ${scorer.name}?? GOLAZO!🐼⚽`,
        `⚽🐼 DEFINICIÓN CON CLASE, GOL DE ${scorer.name}!🐼⚽`,
        `⚽🐼 GOL DEL PANDITA ${scorer.name}!🐼⚽`,
        `⚽🐼 HERMOSO GOL DE ${scorer.name}!🐼⚽`,
        `⚽🐼 TREMENDO GOL DEL PANDITA ${scorer.name}!🐼⚽`,
        `⚽🐼 GOL DE ${scorer.name}!🐼⚽`,
        `⚽🐼 SACALA GK, GOLAZO DE ${scorer.name}!🐼⚽`
      ];

      let golRandom = mensajesGol[Math.floor(Math.random() * mensajesGol.length)];
      room.sendAnnouncement(golRandom, null, 0xFB35C0, "bold", 1);
      if (updateStats && playerStats[playerAuth] && playerStats[playerAuth].logged) {
        playerStats[playerAuth].goals = (playerStats[playerAuth].goals || 0) + 1;
        playerStats[playerAuth].xp = (playerStats[playerAuth].xp || 0) + 1;
      }
      room.setPlayerDiscProperties(scorer.id, { radius: playerRadius * 2 });
      resetSize(scorer);
    }

    if (team === 1) {
      Marcador.Red++;
    } else if (team === 2) {
      Marcador.Blue++;
    }

    if (players === 1) {
      room.stopGame();
      room.startGame();
    }

    try {
      fs.writeFileSync(playersFilePath, JSON.stringify(playerStats, null, 2));
    } catch (err) {
      console.error('Error al escribir el archivo de jugadores:', err);
    }

    lastPlayerTouchBall = null;
    secondPlayerTouchBall = null;
  };

  room.onGameStop = (byPlayer) => {
    const players = room.getPlayerList();
    players.forEach(player => {
      if (player.team !== 0) {
        room.setPlayerTeam(player.id, 0);
      }
    });
    clearTimeout(chaosModeTimer);
    updateMaps();
    setTimeout(() => {
      shuffleTeams();
      room.startGame();
    }, 3000);
    room.stopRecording();
    isGameStart = false;
    remainingTime = 30000;
    lastPlayerTouchBall = null;
    secondPlayerTouchBall = null;
    powerActive = false;
    ballHeldBy = null;
    gravityEnabled = false;
    bolapor = null;
    powerEnabled = false;
    gkred = [], gkblue = [];
    Marcador = [
      { Red: 0, Blue: 0 }
    ];
    goles = [];
    owngoals = [];
    if (byPlayer != null) {
      activities[byPlayer.id] = Date.now();
      if (warnedPlayers[byPlayer.id]) {
        clearTimeout(warnedPlayers[byPlayer.id]);
        delete warnedPlayers[byPlayer.id];
      }
    }

    if (powerIncreaseInterval) {
      clearInterval(powerIncreaseInterval);
      powerIncreaseInterval = null;
    }

    if (gravityTimer) {
      clearInterval(gravityTimer);
      gravityTimer = null;
    }
  };

  room.onGameStart = (byPlayer) => {
    changeColors();
    startGame();
    isGameStart = true;
    room.startRecording();
    if (byPlayer != null) {
      activities[byPlayer.id] = Date.now();
      if (warnedPlayers[byPlayer.id]) {
        clearTimeout(warnedPlayers[byPlayer.id]);
        delete warnedPlayers[byPlayer.id];
      }
    }

    setTimeout(() => {
      room.sendAnnouncement(`🐼⚽ Se enfrentan ${team1Name} 🆚 ${team2Name}`, null, 0xDFC57B, "bold", 2);
      room.sendAnnouncement(`Si las camisetas son iguales pon !changecolors para cambiar de color la camiseta`, null, null, "bold", 2);
    }, 3000);
  };

  room.onPlayerKicked = (kickedPlayer, reason, ban, byPlayer) => {
    if (byPlayer != null && kickedPlayer != null) {
      const embed = {
        title: `Nuevo ${ban ? "baneo" : "kickeo"}`,
        description: `**Víctima:** ${kickedPlayer.name || "Desconocido"}\n**Por:** ${byPlayer.name || "Desconocido"}\n**Tipo de ban:** ${ban ? "baneo" : "kick"}\n**Motivo:** ${reason || "No especificado"}`,
        color: 0x00FF00,
        timestamp: new Date(),
        footer: {
          text: "Sistema de kickeos/baneos",
        },
      };

      axios.post("https://discord.com/api/webhooks/1278152698952290327/RQvTuL8-zXfTF-_d59Z79ZgcCfBuv9OvcZZlIMulCkrPY9a-Q17YhqzbJIL7W72nWcuI", {
        content: null,
        embeds: [embed]
      })
        .then(() => console.log("Webhook enviado con éxito"))
        .catch(err => console.error("Error al enviar el webhook:", err));

      activities[kickedPlayer.id] = Date.now();
      activities[byPlayer.id] = Date.now();
      if (warnedPlayers[byPlayer.id]) {
        clearTimeout(warnedPlayers[byPlayer.id]);
        delete warnedPlayers[byPlayer.id];
      }

      if (warnedPlayers[kickedPlayer.id]) {
        clearTimeout(warnedPlayers[kickedPlayer.id]);
        delete warnedPlayers[kickedPlayer.id];
      }

      if (ban) {
        const targetAuth = playerId[kickedPlayer.id];
        if (targetAuth && !bannedPlayers.some(entry => entry.auth === targetAuth)) {
          bannedPlayers.push({ name: kickedPlayer.name, auth: targetAuth });
          try {
            fs.writeFileSync(bannedPlayersFilePath, JSON.stringify(bannedPlayers, null, 2));
            console.log(`Jugador ${kickedPlayer.name} añadido a la lista de baneos.`);
          } catch (err) {
            console.error('Error al escribir el archivo de baneos:', err);
          }
        } else if (!targetAuth) {
          console.error("Error: No se encontró la autenticación para el jugador kickeado.");
        }
      }
    }
  };

  room.onStadiumChange = function (newStadiumName, byPlayer) {
    if (byPlayer != null) {
      activities[byPlayer.id] = Date.now();
      if (warnedPlayers[byPlayer.id]) {
        clearTimeout(warnedPlayers[byPlayer.id]);
        delete warnedPlayers[byPlayer.id];
      }
    }
  }

  room.onPlayerAdminChange = function (changedPlayer, byPlayer) {
    activities[changedPlayer.id] = Date.now();

    if (warnedPlayers[changedPlayer.id]) {
      clearTimeout(warnedPlayers[changedPlayer.id]);
      delete warnedPlayers[changedPlayer.id];
    }

    if (byPlayer != null) {
      activities[byPlayer.id] = Date.now();

      if (warnedPlayers[byPlayer.id]) {
        clearTimeout(warnedPlayers[byPlayer.id]);
        delete warnedPlayers[byPlayer.id];
      }
    }
  }

  room.onPlayerActivity = function (player) {
    activities[player.id] = Date.now();
    if (warnedPlayers[player.id]) {
      clearTimeout(warnedPlayers[player.id]);
      delete warnedPlayers[player.id];
    }
  }

  room.onGameUnpause = function (byPlayer) {
    if (byPlayer != null) {
      activities[byPlayer.id] = Date.now();
      if (warnedPlayers[byPlayer.id]) {
        clearTimeout(warnedPlayers[byPlayer.id]);
        delete warnedPlayers[byPlayer.id];
      }
    }

    if (remainingTime > 0 && room.getPlayerList().length >= 4) {
      chaosModeTimer = setTimeout(() => {
        resetChaosMode(lastMode);
        room.sendAnnouncement(`¡Modo ${lastMode} terminado!`, null, null, "bold", 2);
      }, remainingTime);
      room.sendAnnouncement("▶️ ¡Modo caos reanudado!", null, 0x00FF00, "bold", 2);
    }
  }

  room.onGamePause = function (byPlayer) {
    if (byPlayer != null) {
      activities[byPlayer.id] = Date.now();
      if (warnedPlayers[byPlayer.id]) {
        clearTimeout(warnedPlayers[byPlayer.id]);
        delete warnedPlayers[byPlayer.id];
      }
    }

    if (chaosModeTimer && room.getPlayerList().length >= 4) {
      clearTimeout(chaosModeTimer);
      remainingTime -= Date.now() - (30000 - remainingTime);
      room.sendAnnouncement("⏸️ ¡Modo caos pausado!", null, 0xFFFF00, "bold", 2);
    }
  }

  room.onGameTick = () => {
    handleAfkPlayers();
  };

  room.onTeamVictory = (scores) => {
    RecSistem.sendDiscordWebhook();
    const winningTeam = scores.red > scores.blue ? 1 : 2;
    const defeatTeam = winningTeam === 1 ? 2 : 1;
    const players = room.getPlayerList().filter(p => p.team !== 0);
    const updateStats = room.getPlayerList().length >= 6;

    players.forEach((player) => {
      const playerAuth = playerId[player.id];

      if (updateStats) {
        if (playerStats[playerAuth] && playerStats[playerAuth].logged) {
          if (player.team === winningTeam) {
            playerStats[playerAuth].victories = (playerStats[playerAuth].victories || 0) + 1;
            playerStats[playerAuth].xp = (playerStats[playerAuth].xp || 0) + 10;
          } else if (player.team === defeatTeam) {
            playerStats[playerAuth].defeats = (playerStats[playerAuth].defeats || 0) + 1;
            playerStats[playerAuth].xp = (playerStats[playerAuth].xp || 0) - 6;
          }

          if (playerStats[playerAuth].xp < 0) {
            playerStats[playerAuth].xp = 0;
          }

          playerStats[playerAuth].games = (playerStats[playerAuth].games || 0) + 1;

          if (playerStats[playerAuth].games > 5) {
            const victories = playerStats[playerAuth].victories || 0;
            let winrate = (victories / playerStats[playerAuth].games) * 100;

            if (winrate > 100) {
              winrate = 100;
            } else if (winrate < 0) {
              winrate = 0;
            }

            playerStats[playerAuth].winrate = winrate.toFixed(2);
          } else {
            playerStats[playerAuth].winrate = "0%";
          }

          const gkredPlayer = gkred.find(gk => playerId[gk.id] === playerAuth);
          const gkbluePlayer = gkblue.find(gk => playerId[gk.id] === playerAuth);

          if (scores.blue === 0 && gkredPlayer) {
            playerStats[playerAuth].vallas = (playerStats[playerAuth].vallas || 0) + 1;
            playerStats[playerAuth].xp = (playerStats[playerAuth].xp || 0) + 10;
          } else if (scores.red === 0 && gkbluePlayer) {
            playerStats[playerAuth].vallas = (playerStats[playerAuth].vallas || 0) + 1;
            playerStats[playerAuth].xp = (playerStats[playerAuth].xp || 0) + 10;
          }
        }
      }
    });

    try {
      fs.writeFileSync(playersFilePath, JSON.stringify(playerStats, null, 2));
    } catch (err) {
      console.error('Error al escribir el archivo de jugadores:', err);
    }

    Marcador = [
      { Red: 0, Blue: 0 }
    ];
  };

  room.onPlayerChat = (player, message) => {
    activities[player.id] = Date.now();
    if (warnedPlayers[player.id]) {
      clearTimeout(warnedPlayers[player.id]);
      delete warnedPlayers[player.id];
    }

    const playerAuth = playerId[player.id];
    const playerRole = getPlayerRole(playerAuth);

    if (!message.startsWith("!")) {
      sendMessages(player.name + ": " + message);
    }

    if (message.startsWith("!register")) {
      const args = message.split(' ');
      const password = args.slice(1).join(' ');

      if (playerStats[playerAuth].registered) {
        room.sendAnnouncement("Ya estás registrado, usa !login [contraseña]", player.id, 0xFF0000);
        return false;
      } else {
        if (!password) {
          room.sendAnnouncement("Tienes que agregar una contraseña para registrarte", player.id, 0xFF0000, "bold", 2);
          return false;
        }

        if (password.length < 4) {
          room.sendAnnouncement("Tu contraseña necesita tener 4 caracteres mínimos", player.id, 0xFF0000, "bold", 2);
          return false;
        }

        const forbiddenCharacters = /[()\[\]{}]/;
        if (forbiddenCharacters.test(password)) {
          room.sendAnnouncement("Tu contraseña no puede contener los siguientes caracteres: () [] {}", player.id, 0xFF0000, "bold", 2);
          return false;
        }

        const caracteresPermitidos = /[A-Za-z]/;
        if (!caracteresPermitidos.test(password)) {
          room.sendAnnouncement("Tu contraseña debe tener letras", player.id, 0xFF0000, "bold", 2);
          return false;
        }

        playerStats[playerAuth] = {
          name: player.name,
          auth: playerAuth,
          goals: 0,
          assists: 0,
          owngoals: 0,
          victories: 0,
          defeats: 0,
          vallas: 0,
          games: 0,
          winrate: 0,
          xp: 0,
          password: password,
          rank: '[Pandita Bebé 1🐼]',
          logged: true,
          sanciones: 0,
          registered: true
        };

        room.sendAnnouncement(`Hola ${player.name}, gracias por registrarte, tu contraseña es ${password}. ¡No la olvides!`, player.id, 0x00FF00);

        try {
          fs.writeFileSync(playersFilePath, JSON.stringify(playerStats, null, 2));
        } catch (err) {
          console.error('Error al escribir el archivo de jugadores:', err);
        }

        const embed = {
          title: "Nuevo Registro",
          description: `**Jugador:** ${player.name}\n**Auth:** ${playerAuth}`,
          color: 0x00FF00,
          timestamp: new Date(),
          footer: {
            text: "Sistema de Registro",
          },
        };

        axios.post('https://discord.com/api/webhooks/1277026298706792468/J9YLnjLV3DkP3EKytCQrofU3qScW1JX0Nx05Bo4CVrge6KCYLCPiO3E2bbfp_2qageSu', {
          content: "¡Un nuevo jugador se ha registrado!",
          embeds: [embed],
        })
          .then(() => console.log('Mensaje enviado al webhook de Discord.'))
          .catch(err => console.error('Error al enviar mensaje al webhook:', err));

      }
      return false;
    } else if (message.startsWith("!login")) {
      const args = message.split(' ');
      const password = args.slice(1).join(' ');

      if (!password) {
        room.sendAnnouncement("Tienes que agregar una contraseña para iniciar sesión", player.id, 0xFF0000, "bold", 2);
        return false;
      }

      const registeredPlayer = Object.values(playerStats).find(data => data.name === player.name);

      if (!registeredPlayer) {
        room.sendAnnouncement("No tienes una cuenta registrada. Regístrate con !register [contraseña]", player.id, 0xFF0000, "bold", 2);
        return false;
      }

      if (registeredPlayer.logged) {
        room.sendAnnouncement("Ya estás logueado", player.id, 0xFF0000);
        return false;
      }

      if (registeredPlayer.password !== password) {
        room.sendAnnouncement("Contraseña incorrecta. Intenta nuevamente.", player.id, 0xFF0000, "bold", 2);
        return false;
      }

      if (registeredPlayer.auth !== playerAuth) {
        playerStats[playerAuth] = {
          ...registeredPlayer,
          auth: playerAuth,
          logged: true
        };

        if (registeredPlayer.sanciones > 0) {
          playerStats[playerAuth].sanciones = registeredPlayer.sanciones;
        }

        delete playerStats[registeredPlayer.auth];

        room.sendAnnouncement(`¡Bienvenido de nuevo ${registeredPlayer.name}! Has iniciado sesión correctamente.`, player.id, 0x00FF00);
      } else {
        playerStats[playerAuth].logged = true;
        room.sendAnnouncement(`¡Bienvenido de nuevo ${playerStats[playerAuth].name}! Has iniciado sesión correctamente.`, player.id, 0x00FF00);
      }

      try {
        fs.writeFileSync(playersFilePath, JSON.stringify(playerStats, null, 2));
      } catch (err) {
        console.error('Error al escribir el archivo de jugadores:', err);
      }

      return false;
    } else if (message.startsWith("!sancionar")) {
      if (rolesData.roles[playerRole]?.gameAdmin === true) {
        const args = message.split(' ');
        const name = args[1]?.replace(/@/g, "").replace(/_/g, " ").trim();

        if (!name) {
          room.sendAnnouncement("Debes proporcionar un nombre válido.", player.id, 0xFF0000);
        } else {
          const targetPlayer = findPlayer(name);

          if (!targetPlayer) {
            room.sendAnnouncement("Jugador no encontrado.", player.id, 0xFF0000);
          } else {
            const targetAuth = playerId[targetPlayer.id];

            if (!targetAuth) {
              room.sendAnnouncement("No se pudo obtener el auth del jugador.", player.id, 0xFF0000);
              return;
            }

            const reason = args.slice(2).join(' ');

            if (!reason) {
              room.sendAnnouncement("Debes proporcionar una razón para la sanción.", player.id, 0xFF0000);
            } else {
              if (targetPlayer.id === player.id) {
                room.sendAnnouncement("No puedes sancionarte a ti mismo.", player.id, 0xFF0000);
                return false;
              } else if (!playerStats[targetAuth].logged) {
                room.sendAnnouncement("No puedes sancionar a alguien que no esta logeado", player.id, 0xFF0000, "bold", 2);
                return false;
              }

              playerStats[targetAuth].sanciones = (playerStats[targetAuth].sanciones || 0) + 1;

              if (playerStats[targetAuth].sanciones >= 3) {
                if (!bannedPlayers.some(entry => entry.auth === targetAuth)) {
                  bannedPlayers.push({ name: targetPlayer.name, auth: targetAuth });
                  try {
                    fs.writeFileSync(bannedPlayersFilePath, JSON.stringify(bannedPlayers, null, 2));
                  } catch (err) {
                    console.error('Error al escribir el archivo de baneos:', err);
                  }
                }

                room.sendAnnouncement(`Jugador ${targetPlayer.name} baneado permanentemente por alcanzar 3 sanciones.`, null, 0xFF0000);
                room.kickPlayer(targetPlayer.id, "Baneado permanentemente por alcanzar 3 sanciones.", false);
                delete playerStats[targetAuth];
                rolesData.roles[playerRole].users = rolesData.roles[playerRole].users.filter(auth => auth !== targetAuth);
                try {
                  fs.writeFileSync(playersFilePath, JSON.stringify(playerStats, null, 2));
                  fs.writeFileSync(rolesFilePath, JSON.stringify(rolesData, null, 2));
                } catch (err) {
                  console.error('Error al escribir el archivo de jugadores o roles:', err);
                }
              } else {
                const embed = {
                  title: "Nueva Sancion",
                  description: `**Victima:** ${targetPlayer.name}\n**Sancionado por:** ${player.name}\n**Razón:** ${reason}\n**Sanciones:** ${playerStats[targetAuth].sanciones}/3`,
                  color: 0x00FF00,
                  timestamp: new Date(),
                  footer: {
                    text: "Sistema de Sanciones",
                  },
                };

                axios.post("https://discord.com/api/webhooks/1278152698952290327/RQvTuL8-zXfTF-_d59Z79ZgcCfBuv9OvcZZlIMulCkrPY9a-Q17YhqzbJIL7W72nWcuI", {
                  content: null,
                  embeds: [embed],
                })
                  .then(() => console.log("Webhook enviado con exito"))
                  .catch(err => console.error("No se pudo enviar el webhook", err))
                room.sendAnnouncement(`${targetPlayer.name} sancionado por ${player.name}. Razón: ${reason}\nSanciones: ${playerStats[targetAuth].sanciones}/3`, null, 0xFFFF00);
                try {
                  fs.writeFileSync(playersFilePath, JSON.stringify(playerStats, null, 2));
                } catch (err) {
                  console.error('Error al escribir el archivo de jugadores:', err);
                }
              }
            }
          }
        }
      } else {
        room.sendAnnouncement(`[❌] ${player.name}, no tienes permitido usar este comando.`, player.id, 0xFF0000, "bold", 2);
      }
      return false;
    } else if (message === "!me") {
      if (playerStats[playerAuth]) {
        if (!playerStats[playerAuth].logged) {
          room.sendAnnouncement("Necesitas estar logeado para usar este comando", player.id, 0xFF0000, "bold", 2);
        } else {
          room.sendAnnouncement(`Tu contraseña: ${playerStats[playerAuth].password}`, player.id, 0xE37A11, "bold", 2);

          const stats = `1. Partidos ❯❯ 🎮PJ: ${playerStats[playerAuth].games || 0}   •   🏆PG: ${playerStats[playerAuth].victories || 0} (${(playerStats[playerAuth].winrate || 0)}%)   •   📉PP: ${playerStats[playerAuth].defeats || 0}\n` +
            `2. Individual ❯❯ ⚽Gᴏʟᴇs: ${playerStats[playerAuth].goals || 0}  •  👟Aꜱɪꜱᴛᴇɴᴄɪᴀꜱ: ${playerStats[playerAuth].assists || 0}  •  🤦‍♂️Aᴜᴛᴏɢᴏʟᴇꜱ: ${playerStats[playerAuth].owngoals || 0}  •  🧤Vᴀʟʟᴀꜱ: ${playerStats[playerAuth].vallas || 0}  •  🎋XP: ${playerStats[playerAuth].xp || 0}  •  ⏰Sᴀɴᴄɪᴏɴᴇꜱ: ${playerStats[playerAuth].sanciones || 0}/3`;

          room.sendAnnouncement(stats, player.id, 0xE37A11, "small-bold", 2);
        }
      }
      return false;
    } else if (message.startsWith("!agregar")) {
      if (rolesData.roles["liderpanda"].users.includes(playerAuth) || rolesData.roles["maestropanda"].users.includes(playerAuth) || rolesData.roles["jefepanda"].users.includes(playerAuth) || rolesData.roles["granpanda"].users.includes(playerAuth) || rolesData.roles["coowner"].users.includes(playerAuth) || rolesData.roles["owner"].users.includes(playerAuth)) {
        const args = message.split(' ');
        const rol = args[1];
        const name = message.split('@')[1]?.trim();

        if (!rol) {
          room.sendAnnouncement("Debes proporcionar un rol válido.", player.id, 0xFF0000);
        } else if (!name) {
          room.sendAnnouncement("Debes proporcionar un jugador válido.", player.id, 0xFF0000);
        } else {
          const formattedName = name.replace(/_/g, " ");
          const targetPlayer = findPlayer(formattedName);

          if (!targetPlayer) {
            room.sendAnnouncement("El jugador no está en la sala.", player.id, 0xFF0000);
          } else {
            if (targetPlayer.id === player.id) {
              room.sendAnnouncement("No puedes asignarte roles a ti mismo.", player.id, 0xFF0000);
              return false;
            }

            const targetAuth = playerId[targetPlayer.id];
            const lowerCaseRole = rol.toLowerCase();

            if (rolesData.roles.hasOwnProperty(lowerCaseRole)) {
              Object.keys(rolesData.roles).forEach(role => {
                const roleData = rolesData.roles[role];
                if (roleData.users.includes(targetAuth)) {
                  roleData.users = roleData.users.filter(auth => auth !== targetAuth);
                }
              });

              if (rolesData.roles[lowerCaseRole].users.includes(targetAuth)) {
                room.sendAnnouncement(`El jugador ya tiene el rol ${rol}.`, player.id, 0xFF0000);
              } else {
                rolesData.roles[lowerCaseRole].users.push(targetAuth);
                room.sendAnnouncement(`El rol ${rol} ha sido asignado a ${targetPlayer.name}.`, player.id, 0x00FF00, "normal", 1);
                room.sendAnnouncement(`El jugador ${targetPlayer.name} ha sido promovido al rol ${rol}`, null, 0x00FF00, "bold", 2);

                if (rolesData.roles[lowerCaseRole]?.gameAdmin) {
                  room.setPlayerAdmin(targetPlayer.id, true);
                } else {
                  room.setPlayerAdmin(targetPlayer.id, false);
                }

                try {
                  fs.writeFileSync(rolesFilePath, JSON.stringify(rolesData, null, 2));
                } catch (err) {
                  console.error('Error al escribir el archivo de roles:', err);
                }
              }
            } else {
              const availableRoles = Object.keys(rolesData.roles).join(', ');
              room.sendAnnouncement(`Rol no reconocido. Roles disponibles: ${availableRoles}`, player.id, 0xFF0000);
            }
          }
        }
      } else {
        room.sendAnnouncement(`[❌] ${player.name}, no tienes permitido usar este comando.`, player.id, 0xFF0000, "bold", 2);
      }
      return false;
    } else if (message === "!ds" || message === "!dc" || message === "!discord") {
      room.sendAnnouncement(`🐼 ${player.name}: https://discord.gg/vpJmcr7r9z`, player.id, 0x9C8ACB, "small-bold", 2);
      return false;
    } else if (message === "!power") {
      if (rolesData.roles[playerRole]?.gameAdmin === true) {
        powerEnabled = !powerEnabled;

        if (powerEnabled) {
          room.sendAnnouncement(`🚀🐼 Power activado por ${player.name}`, null, 0x00FF00, "bold", 2);
        } else {
          room.sendAnnouncement(`🐼 Power desactivado por ${player.name}`, null, 0xFF0000, "bold", 2);
          ballHeldBy = null;
          powerActive = false;
          powerLevel = 0;
          room.setDiscProperties(0, { color: NORMAL_BALL_COLOR });

          if (powerIncreaseInterval) {
            clearInterval(powerIncreaseInterval);
            powerIncreaseInterval = null;
          }
        }
      } else {
        room.sendAnnouncement(`[❌] ${player.name}, no tienes permitido usar este comando.`, player.id, 0xFF0000, "bold", 2);
      }
      return false;
    } else if (message === "!comba") {
      if (rolesData.roles[playerRole]?.gameAdmin) {
        gravityEnabled = !gravityEnabled;

        if (gravityEnabled) {
          room.sendAnnouncement(`🤫🎍 Comba activado por ${player.name}`, null, 0x00FF00, "bold", 2);
          powerEnabled = true;
        } else {
          room.sendAnnouncement(`🐼 Comba desactivado por ${player.name}`, null, 0xFF0000, "bold", 2);
          bolapor = null;
          gravityActive = false;
          ballHeldBy = null;
          powerActive = false;
          powerLevel = 0;
          powerEnabled = false;
          room.setDiscProperties(0, { color: NORMAL_BALL_COLOR });

          if (gravityTimer) {
            clearInterval(gravityTimer);
            gravityTimer = null;
          }

          if (powerIncreaseInterval) {
            clearInterval(powerIncreaseInterval);
            powerIncreaseInterval = null;
          }
        }
      } else {
        room.sendAnnouncement(`[❌] ${player.name}, no tienes permitido usar este comando.`, player.id, 0xFF0000, "bold", 2);
      }
      return false;
    } else if (message === "!gk") {
      if (playerStats[playerAuth]) {
        if (!playerStats[playerAuth].logged) {
          room.sendAnnouncement("Necesitas estar logeado para usar este comando", player.id, 0xFF0000, "bold", 2);
        } else {
          if (room.getScores() !== null) {
            if (room.getPlayerList().length < 6) {
              room.sendAnnouncement("No hay 6 jugadores para usar este comando", player.id, 0xFF0000);
            } else {
              if (player.team === 1) {
                let index = gkred.findIndex(gk => gk.auth === playerAuth);
                if (index !== -1) {
                  gkred.splice(index, 1);
                  room.sendAnnouncement(`${player.name} ya no es el GK del equipo rojo 🧤❌`, null, 0xEC4A4A, "bold", 1);
                } else {
                  if (gkred.length > 0) {
                    room.sendAnnouncement("Ya hay un GK en el equipo rojo", player.id, 0xEC4A4A);
                    return false;
                  }
                  gkred.push({ auth: playerAuth, id: player.id, name: player.name });
                  room.sendAnnouncement(`${player.name} ahora es el GK del equipo rojo 🧤🥅`, null, 0xFB7070, "bold", 1);
                }
              } else if (player.team === 2) {
                let index = gkblue.findIndex(gk => gk.auth === playerAuth);
                if (index !== -1) {
                  gkblue.splice(index, 1);
                  room.sendAnnouncement(`${player.name} ya no es el GK del equipo azul 🧤❌`, null, 0x5A7EFD, "bold", 1);
                } else {
                  if (gkblue.length > 0) {
                    room.sendAnnouncement("Ya hay un GK en el equipo azul", player.id, 0x5A7EFD);
                    return false;
                  }

                  gkblue.push({ auth: playerAuth, id: player.id, name: player.name });
                  room.sendAnnouncement(`${player.name} ahora es el GK del equipo azul 🧤🥅`, null, 0x85AEFA, "bold", 1);
                }
              } else {
                room.sendAnnouncement("No estás en un equipo", player.id, 0xFF0000);
              }
            }
          } else {
            room.sendAnnouncement("No hay un juego en curso", player.id, 0xFF0000);
          }
        }
      }
      return false;
    } else if (message === "!help" || message === "!comandos") {
      if (playerStats[playerAuth]) {
        if (!playerStats[playerAuth].logged) {
          room.sendAnnouncement("Necesitas estar logeado para usar este comando", player.id, 0xFF0000, "bold", 2);
        } else {
          room.sendAnnouncement(`🐼✨ Comandos de Panditas ✨\n` +
            `📝 Cuenta: !register [contraseña] - !me - !login [contraseña]\n` +
            `📊 Estadísticas: !stats [@jugador] - !top [ranking]\n` +
            `💬 Social: !ds / !dc / !discord - !llamaradmin [razón]\n` +
            `⚽ Juego: !gk - !nv / !bb - !modos / !modo - !changecolors`,
            player.id, 0x40BF08, "small-bold", 1);

          if (player.admin) {
            room.sendAnnouncement(`🐼🔨 Comandos de Staff 🔨\n` +
              `⚠️ Moderación: !sancionar [@jugador] [razón] - !unban [@jugador] - !quitarsancion [@jugador]\n` +
              `🛠️ Gestión: !agregar [rol] [@jugador] - !power - !comba`,
              player.id, 0x40BF08, "small-bold", 1);
          }
        }
      }
      return false;
    } else if (message.startsWith("!top")) {
      if (playerStats[playerAuth]) {
        if (!playerStats[playerAuth].logged) {
          room.sendAnnouncement("Necesitas estar logeado para usar este comando", player.id, 0xFF0000, "bold", 2);
        } else {
          const args = message.split(' ');
          const action = args[1];

          const sortedPlayers = (key) => {
            return Object.values(playerStats)
              .filter(player => player.games >= 5)
              .sort((a, b) => b[key] - a[key])
              .map(player => ({
                name: player.name,
                value: player[key],
              }));
          };

          if (action === "vallas") {
            const topVallas = sortedPlayers("vallas").slice(0, 5);
            let announcement = "🧤🥅Ranking de Vallas Invictas🧤🥅:\n";
            topVallas.forEach((player, index) => {
              announcement += `${index + 1}. ${player.name}: ${player.value} vallas\n`;
            });
            room.sendAnnouncement(announcement, player.id, null, "bold", 2);
          } else if (action === "goles") {
            const topGoals = sortedPlayers("goals").slice(0, 5);
            let announcement = "⚽Ranking de Goles⚽:\n";
            topGoals.forEach((player, index) => {
              announcement += `${index + 1}. ${player.name}: ${player.value} goles\n`;
            });
            room.sendAnnouncement(announcement, player.id, null, "bold", 2);
          } else if (action === "victorias") {
            const topVictorias = sortedPlayers("victories").slice(0, 5);
            let announcement = "✅Ranking de Victorias✅:\n";
            topVictorias.forEach((player, index) => {
              announcement += `${index + 1}. ${player.name}: ${player.value} victorias\n`;
            });
            room.sendAnnouncement(announcement, player.id, null, "bold", 2);
          } else if (action === "asistencias") {
            const topAsistencias = sortedPlayers("assists").slice(0, 5);
            let announcement = "👟🧙‍♂️Ranking de Asistencias👟🧙‍♂️:\n";
            topAsistencias.forEach((player, index) => {
              announcement += `${index + 1}. ${player.name}: ${player.value} asistencias\n`;
            });
            room.sendAnnouncement(announcement, player.id, null, "bold", 2);
          } else if (action === "juegos") {
            const topJuegos = sortedPlayers("games").slice(0, 5);
            let announcement = "🎋Ranking de Juegos🎋:\n";
            topJuegos.forEach((player, index) => {
              announcement += `${index + 1}. ${player.name}: ${player.value} juegos\n`;
            });
            room.sendAnnouncement(announcement, player.id, null, "bold", 2);
          } else if (action === "winrate") {
            const topWinrate = sortedPlayers("winrate").slice(0, 5);
            let announcement = "💪Ranking de Winrate💪:\n";
            topWinrate.forEach((player, index) => {
              announcement += `${index + 1}. ${player.name}: ${player.value}% winrate\n`;
            }); // esq es asi el winrate
            room.sendAnnouncement(announcement, player.id, 0xFF0000, "bold", 2);
          } else {
            room.sendAnnouncement(`Ese ranking NO existe❌. Los que existen son: !top vallas; !top goles; !top victorias; !top asistencias; !top juegos y !top winrate.`, player.id, 0xe48729, "bold", 2);
          }
        }
      }
      return false;
    } else if (message.startsWith("!unban")) {
      if (rolesData.roles[playerRole]?.gameAdmin === true) {
        const args = message.split(' ');
        const name = args[1]?.replace(/@/g, "").replace(/_/g, " ").trim();

        if (!name) {
          room.sendAnnouncement("Debes proporcionar un nombre válido.", player.id, 0xFF0000);
        } else {
          const targetPlayer = findPlayer(name);

          if (!targetPlayer) {
            room.sendAnnouncement(`El jugador ${name} no está en la sala.`, player.id, 0xFF0000);
          } else {
            const index = bannedPlayers.findIndex(entry => entry.name === targetPlayer.name);

            if (index !== -1) {
              bannedPlayers.splice(index, 1);
              try {
                fs.writeFileSync(bannedPlayersFilePath, JSON.stringify(bannedPlayers, null, 2));
                room.sendAnnouncement(`${targetPlayer.name} ha sido desbaneado.`, null, 0x00FF00);
              } catch (err) {
                console.error('Error al escribir el archivo de baneos:', err);
              }
            } else {
              room.sendAnnouncement(`${targetPlayer.name} no está baneado.`, player.id, 0xFFFF00);
            }
          }
        }
      } else {
        room.sendAnnouncement(`[❌] ${player.name}, no tienes permitido usar este comando.`, player.id, 0xFF0000, "bold", 2);
      }
      return false;
    } else if (message.startsWith("!quitarsancion")) {
      if (rolesData.roles["liderpanda"].users.includes(playerAuth) ||
        rolesData.roles["maestropanda"].users.includes(playerAuth) ||
        rolesData.roles["jefepanda"].users.includes(playerAuth) ||
        rolesData.roles["granpanda"].users.includes(playerAuth) ||
        rolesData.roles["coowner"].users.includes(playerAuth) ||
        rolesData.roles["owner"].users.includes(playerAuth)) {

        const args = message.split(' ');
        const name = args[1]?.replace(/@/g, "").replace(/_/g, " ").trim();

        if (!name) {
          room.sendAnnouncement("Debes proporcionar un nombre válido.", player.id, 0xFF0000);
          return false;
        } else {
          const targetPlayer = findPlayer(name);

          if (!targetPlayer) {
            room.sendAnnouncement(`El jugador ${name} no está en la sala.`, player.id, 0xFF0000);
            return false;
          } else {
            let targetAuth = null;

            for (const auth in playerStats) {
              if (playerStats[auth].name === name) {
                targetAuth = auth;
                break;
              }
            }

            if (!targetAuth) {
              room.sendAnnouncement(`No se encontró al jugador con nombre ${name}.`, player.id, 0xFF0000);
              return false;
            } else {
              if (targetPlayer.id === player.id) {
                room.sendAnnouncement("No puedes quitarte sanciones a ti mismo.", player.id, 0xFF0000);
                return false;
              }

              if (playerStats[targetAuth] && playerStats[targetAuth].sanciones > 0) {
                playerStats[targetAuth].sanciones--;

                try {
                  fs.writeFileSync(playersFilePath, JSON.stringify(playerStats, null, 2));

                  room.sendAnnouncement(`A ${targetPlayer.name} le sacaron una sanción.`, null, 0x00FF00, "bold", 2);
                } catch (err) {
                  console.error('Error al escribir el archivo de jugadores:', err);
                }
              } else {
                room.sendAnnouncement(`${targetPlayer.name} no tiene sanciones.`, player.id, 0xFFFF00, "bold", 2);
              }
            }
          }
        }
      } else {
        room.sendAnnouncement(`[❌] ${player.name}, no tienes permitido usar este comando.`, player.id, 0xFF0000, "bold", 2);
      }
      return false;
    } else if (message === "!nv") {
      despedidasMessages(player);
      return false;
    } else if (message === "!bb") {
      despedidasMessages(player);
      return false;
    } else if (message.startsWith("!llamaradmin")) {
      if (playerStats[playerAuth]) {
        if (!playerStats[playerAuth].logged) {
          room.sendAnnouncement("Necesitas estar logeado para usar este comando", player.id, 0xFF0000, "bold", 2);
        } else {
          const args = message.split(' '); // teamo<3, teamomas<3
          const reason = args.slice(1).join(' ');

          const now = Date.now();
          const cooldownTime = 20000;
          const lastUsed = cooldown[player.id] || 0

          if (now - lastUsed < cooldownTime) {
            const timeLeft = Math.ceil((cooldownTime - (now - lastUsed)) / 1000);
            room.sendAnnouncement(`Debes esperar ${timeLeft} segundos antes de volver a usar este comando.`, player.id, 0xFF0000, "bold", 2);
            return false;
          }

          if (!reason) {
            room.sendAnnouncement("Debes proporcionar una razon", player.id, 0xFF0000, "bold", 2);
            return false;
          } else {
            room.sendAnnouncement("Llamado enviado correctamente al discord, espera tu respuesta.", player.id, 0x00FF00, "bold", 1);
            axios.post('https://discord.com/api/webhooks/1278864671549554740/I3lBBqBqfzqubZZYld3bh0ilkOhYhLP5yRVGmDPS7rMSO_SQInh7OHZycr5JHDXfP5qb', {
              content: `||@everyone||\n**${player.name}** pide de su ayuda\nRazon: **${reason}**`
            })
              .then(() => {
                cooldown[player.id] = now;
              })
              .catch(error => {
                console.error('Error al enviar el mensaje al Discord:', error);
              });
          }
        }
      }
      return false;
    } else if (message === "!modo" || message === "!modos") {
      if (playerStats[playerAuth]) {
        if (!playerStats[playerAuth].logged) {
          room.sendAnnouncement("Necesitas estar logeado para usar este comando", player.id, 0xFF0000, "bold", 2);
        } else {
          room.sendAnnouncement(`Modo de juego: ${powerEnabled ? "Power" : "Normal"}, ${gravityEnabled ? "Comba" : "Normal"}`, player.id, 0x00FF00, "bold", 2);
        }
      }
      return false;
    } else if (message.startsWith("!stats")) {
      if (playerStats[playerAuth]) {
        if (!playerStats[playerAuth].logged) {
          room.sendAnnouncement("Necesitas estar logeado para usar este comando", player.id, 0xFF0000, "bold", 2);
        } else {
          const args = message.split(' ');
          const name = args[1]?.replace(/@/g, "").replace(/_/g, " ").trim();

          if (!name) {
            room.sendAnnouncement("Debes proporcionar un nombre válido.", player.id, 0xFF0000);
            return false;
          } else {
            const targetPlayer = findPlayer(name);

            if (!targetPlayer) {
              room.sendAnnouncement(`El jugador ${name} no está en la sala.`, player.id, 0xFF0000);
              return false;
            } else {
              const targetAuth = playerId[targetPlayer.id];

              if (!targetAuth) {
                room.sendAnnouncement("No se pudo obtener la autenticación del jugador.", player.id, 0xFF0000);
                return false;
              } else {
                const stats = playerStats[targetAuth];

                if (!stats) {
                  room.sendAnnouncement(`No se encontraron estadísticas para el jugador ${name}.`, player.id, 0xFF0000);
                } else if (!stats.logged) {
                  room.sendAnnouncement(`El jugador ${name} no está logueado.`, player.id, 0x00FF00, "bold", 2);
                } else {
                  room.sendAnnouncement(
                    `🐼🧯 Estadísticas de ${name}:\nGoles⚽: ${stats.goals || 0},\nAsistencias👟🧙‍♂️: ${stats.assists || 0},\nAutogoles🤦‍♂️: ${stats.owngoals || 0},\nVictorias✅: ${stats.victories || 0},\nDerrotas⛔: ${stats.defeats || 0},\nVallas Invictas🧤: ${stats.vallas || 0},\nPartidos Totales🐼: ${stats.games || 0},\nWin-Rate💪: ${stats.winrate || 0}%\nXP Total🎋: ${stats.xp || 0}\nSanciones⏰: ${stats.sanciones || 0}/3`,
                    player.id,
                    0xE37A11,
                    "small-bold",
                    2
                  );
                }
              }
            }
          }
        }
      }
      return false;
    } else if (message === "!changecolors") {
      if (playerStats[playerAuth]) {
        if (!playerStats[playerAuth].logged) {
          room.sendAnnouncement("Necesitas estar logeado para usar este comando", player.id, 0xFF0000, "bold", 2);
        } else {
          if (votedPlayers.includes(player.id)) {
            room.sendAnnouncement("Ya has votado, " + player.name + "!", player.id, 0xFF0000);
            return false;
          }

          votedPlayers.push(player.id);
          votes++;

          room.sendAnnouncement(player.name + " ha votado! Votos actuales: " + votes + "/" + requiredVotes);

          if (votes >= requiredVotes) {
            room.sendAnnouncement("¡Votación completada! Cambiando colores...", null, 0x00FF00, "bold", 2);
            changeColors();
            votes = 0;
            votedPlayers = [];
          }
        }
      }
      return false;
    } else if (message.startsWith("!")) {
      room.sendAnnouncement("Comando desconocido o no existe, usa !help para ver los comandos", player.id, 0xFF0000, "bold", 2);
      return false;
    } else if (message.startsWith("https:")) {
      return false;
    } else if (contienePalabraCensurada(message)) {
      room.sendAnnouncement(`${playerStats[playerAuth].name} sancionado por decir una palabra inapropiada`, null, 0x00FF00, "bold", 2);
      playerStats[playerAuth].sanciones = (playerStats[playerAuth].sanciones || 0) + 1;

      if (playerStats[targetAuth].sanciones >= 3) {
        if (!bannedPlayers.some(entry => entry.auth === playerAuth)) {
          bannedPlayers.push({ name: player.name, auth: playerAuth });
          try {
            fs.writeFileSync(bannedPlayersFilePath, JSON.stringify(bannedPlayers, null, 2));
          } catch (err) {
            console.error('Error al escribir el archivo de baneos:', err);
          }
        }

        room.sendAnnouncement(`Jugador ${player.name} baneado permanentemente por alcanzar 3 sanciones.`, null, 0xFF0000);
        room.kickPlayer(player.id, "No digas malas palabras.", false);
        delete playerStats[playerAuth];
        rolesData.roles[playerRole].users = rolesData.roles[playerRole].users.filter(auth => auth !== playerAuth);
        try {
          fs.writeFileSync(playersFilePath, JSON.stringify(playerStats, null, 2));
          fs.writeFileSync(rolesFilePath, JSON.stringify(rolesData, null, 2));
        } catch (err) {
          console.error('Error al escribir el archivo de jugadores o roles:', err);
        }
        return false;
      }
    }

    if (isLoggedIn(playerAuth)) {
      if (isRegistered(playerAuth)) {
        const { rankName, colorRank } = determineRank(playerStats[playerAuth].xp);
        playerStats[playerAuth].rank = rankName;
        fs.writeFileSync(playersFilePath, JSON.stringify(playerStats, null, 2));

        if (rolesData.roles["owner"].users.includes(playerAuth)) {
          room.sendAnnouncement(`FUNDADOR PANDA | ${playerStats[playerAuth].rank} ${player.name}: ${message}`, null, 0xff75f2, "bold", 1);
          return false;
        } else if (rolesData.roles["coowner"].users.includes(playerAuth)) {
          room.sendAnnouncement(`CO-FUNDADOR PANDA | ${playerStats[playerAuth].rank} ${player.name}: ${message}`, null, 0xB99284, "bold", 1);
          return false;
        } else if (rolesData.roles["granpanda"].users.includes(playerAuth)) {
          room.sendAnnouncement(`GRAN PANDA | ${playerStats[playerAuth].rank} ${player.name}: ${message}`, null, 0xd0a6f5, "bold", 1);
          return false;
        } else if (rolesData.roles["jefepanda"].users.includes(playerAuth)) {
          room.sendAnnouncement(`JEFE PANDA | ${playerStats[playerAuth].rank} ${player.name}: ${message}`, null, 0xA5F685, "bold", 1);
          return false;
        } else if (rolesData.roles["maestropanda"].users.includes(playerAuth)) {
          room.sendAnnouncement(`MAESTRO PANDA | ${playerStats[playerAuth].rank} ${player.name}: ${message}`, null, 0xfd6e6e, "bold", 1);
          return false;
        } else if (rolesData.roles["liderpanda"].users.includes(playerAuth)) {
          room.sendAnnouncement(`LIDER PANDA | ${playerStats[playerAuth].rank} ${player.name}: ${message}`, null, 0x2ff6fd, "bold", 1);
          return false;
        } else if (rolesData.roles["subliderpanda"].users.includes(playerAuth)) {
          room.sendAnnouncement(`SUB-LIDER PANDA | ${playerStats[playerAuth].rank} ${player.name}: ${message}`, null, 0x1ee8f0, "normal", 1);
          return false;
        } else if (rolesData.roles["asistente"].users.includes(playerAuth)) {
          room.sendAnnouncement(`ASISTENTE PANDA | ${playerStats[playerAuth].rank} ${player.name}: ${message}`, null, 0x17dde5, "normal", 1);
          return false;
        } else {
          room.sendAnnouncement(`${playerStats[playerAuth].rank} ${player.name}: ${message}`, null, colorRank, "normal", 1); // este no toques
          return false;
        }
      } else {
        room.sendAnnouncement("Necesitas estar registrado para hablar en el chat (!register [contraseña])", player.id, 0x00FF00, "bold", 2);
        return false;
      }
    } else {
      room.sendAnnouncement("Necesitas estar logeado para hablar en el chat (!login [contraseña])", player.id, 0x00FF00, "bold", 2);
      return false;
    }
  };

  setInterval(() => {
    messagesRandom();
  }, 2 * 60 * 1000);

  setInterval(() => {
    if (powerEnabled) {
      const ballPosition = room.getBallPosition();
      const jugadores = room.getPlayerList().filter(p => p.team !== 0);

      let closestPlayer = null;

      jugadores.forEach(player => {
        const playerPosition = player.position;
        if (isBallCloseToPlayer(ballPosition, playerPosition)) {
          closestPlayer = player;
        }
      });

      if (closestPlayer) {
        if (ballHeldBy === null || ballHeldBy !== closestPlayer.id) {
          ballHeldBy = closestPlayer.id;
          powerActive = false;
          powerLevel = 0;
          room.setDiscProperties(0, { color: NORMAL_BALL_COLOR });

          if (powerIncreaseInterval) {
            clearInterval(powerIncreaseInterval);
            powerIncreaseInterval = null;
          }

          powerIncreaseInterval = setInterval(() => {
            if (powerLevel < BOOST_SPEEDS.length - 1) {
              powerLevel++;
              room.setDiscProperties(0, {
                color: COLORS[powerLevel]
              });
              powerActive = true;
            }
          }, POWER_HOLD_TIME);
        }
      } else {
        if (ballHeldBy !== null) {
          ballHeldBy = null;
          powerActive = false;
          powerLevel = 0;
          room.setDiscProperties(0, { color: NORMAL_BALL_COLOR });

          if (powerIncreaseInterval) {
            clearInterval(powerIncreaseInterval);
            powerIncreaseInterval = null;
          }
        }
      }
    } else {
      if (ballHeldBy !== null) {
        ballHeldBy = null;
        powerActive = false;
        powerLevel = 0;
        room.setDiscProperties(0, { color: NORMAL_BALL_COLOR });

        if (powerIncreaseInterval) {
          clearInterval(powerIncreaseInterval);
          powerIncreaseInterval = null;
        }
      }
    }
    if (gravityEnabled) {
      const ballPosition = room.getBallPosition();
      const jugadores = room.getPlayerList().filter(p => p.team !== 0);

      let holasi = null;

      jugadores.forEach(player => {
        const playerPosition = player.position;
        if (isBallCloseToPlayer(ballPosition, playerPosition)) {
          holasi = player;
        }
      }); // es lo que registra al jugador de la comba

      if (holasi) {
        if (bolapor === null || bolapor !== holasi.id) {
          bolapor = holasi.id;
          gravityActive = false;
          room.setDiscProperties(0, { color: NORMAL_BALL_COLOR });

          if (gravityTimer) {
            clearInterval(gravityTimer);
            gravityTimer = null;
          }

          gravityTimer = setInterval(() => {
            room.setDiscProperties(0, {
              color: COLORS[powerLevel]
            });
            gravityActive = true;
          }, GRAVITY_HOLD_TIME);
        }
      } else {
        if (bolapor !== null) {
          bolapor = null;
          gravityActive = false;
          room.setDiscProperties(0, { color: NORMAL_BALL_COLOR });

          if (gravityTimer) {
            clearInterval(gravityTimer);
            gravityTimer = null;
          }
        }
      }
    }
  }, 100);

  setInterval(() => {
    if (isGameStart === true) {
      chaosMode();
    }
  }, 180000);

  setInterval(generateRanking, 3600000);
});

function getRoomLink() {
  return roomLink;
} // ya elimine

module.exports = { room, getRoomLink };
