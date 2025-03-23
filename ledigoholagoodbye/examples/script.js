const HaxballJS = require('haxball.js');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');
const { v4: uuidv4 } = require('uuid');
const { createCanvas } = require('canvas');

const mapaX3 = fs.readFileSync('./examples/maps/mapaX3.hbs', 'utf-8');
const mapaX5 = fs.readFileSync('./examples/maps/mapaX5.hbs', 'utf-8');
const mapaX7 = fs.readFileSync('./examples/maps/mapaX7.hbs', 'utf-8');

const mensajesJSON = require("./mensajes.json");
const playersDir = './players';
const playersFilePath = `${playersDir}/players.json`;
const rolesFilePath = path.join(__dirname, 'roles.json');
const messagesDir = `./festejosMessages`;
const messagesFilePath = `${messagesDir}/festejosMessage.json`;

let playerId = {};
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

if (!fs.existsSync(messagesDir)) {
    fs.mkdirSync(messagesDir, { recursive: true });
}

let festejoMessage = {};

if (fs.existsSync(messagesFilePath)) {
    const data = fs.readFileSync(messagesFilePath);
    festejoMessage = JSON.parse(data);
} else {
    fs.writeFileSync(messagesFilePath, JSON.stringify({}));
}

const despedidasJSON = require('./despedidas.json');

let roomLink = '';
let x3Active = false;
let x5Active = false;
let x7Active = false;

let canvas;
let ctx;

function initCanvas(width, height) {
    const newCanvas = createCanvas(width, height);
    const newCtx = newCanvas.getContext('2d');

    return { canvas: newCanvas, ctx: newCtx };
}

function updateCanvasSize() {
    let JMAP = x5Active ? JSON.parse(mapaX5) : x7Active ? JSON.parse(mapaX7) : null;

    let width, height;

    if (x5Active || x7Active) {
        width = JMAP.width * 4;
        height = JMAP.height * 4;
    }

    // Crear un nuevo canvas con las dimensiones actualizadas
    const { canvas: newCanvas, ctx: newCtx } = initCanvas(width, height);
    canvas = newCanvas;
    ctx = newCtx;
}

HaxballJS().then((HBInit) => {
    try {
        room = HBInit({
            roomName: "🎋🐼 [T6] JUEGAN TODOS | PANDA 🐼🎋",
            maxPlayers: 24, // el que quieras
            public: true,
            noPlayer: true,
            geo: {
                "lat": -32.9561,
                "lon": -60.6559,
                "code": "MO"
            },
            token: "thr1.AAAAAGfeRZW9M0pdMQYsNw.5NfE8aRYWek"
        });
        // | 𝘓𝘌𝘎𝘐𝘖𝘕 𝘗𝘈𝘕𝘋𝘈 - 🐼🎋
        // 𝐉𝐔𝐄𝐆𝐀𝐍 𝐓𝐎𝐃𝐎𝐒 | 𝐏𝐀𝐍𝐃𝐀🐼🎋
        const ranks = {
            '[Pandita Bebé III🐼]': { range: [0, 49], colorRank: 0xD4C1FF },
            '[Pandita Bebé II🐼]': { range: [50, 99], colorRank: 0xD4C1FF },
            '[Pandita Bebé I🐼]': { range: [100, 149], colorRank: 0xD4C1FF },
            '[Pandita Aventurero III🐼🌿]': { range: [150, 229], colorRank: 0xD4C1FF },
            '[Pandita Aventurero II🐼🌿]': { range: [230, 309], colorRank: 0xD4C1FF },
            '[Pandita Aventurero I🐼🌿]': { range: [310, 399], colorRank: 0xD4C1FF },
            '[Panda Guerrero III🐼🛡️]': { range: [400, 509], colorRank: 0xD4C1FF },
            '[Panda Guerrero II🐼🛡️]': { range: [510, 619], colorRank: 0xD4C1FF },
            '[Panda Guerrero I🐼🛡️]': { range: [620, 749], colorRank: 0xD4C1FF },
            '[Panda Hechicero III🐼🔮]': { range: [750, 879], colorRank: 0xD4C1FF },
            '[Panda Hechicero II🐼🔮]': { range: [880, 1019], colorRank: 0xD4C1FF },
            '[Panda Hechicero I🐼🔮]': { range: [1020, 1159], colorRank: 0xD4C1FF },
            '[Panda Yakuza III🐼🔪]': { range: [1160, 1299], colorRank: 0xD4C1FF },
            '[Panda Yakuza II🐼🔪]': { range: [1300, 1439], colorRank: 0xD4C1FF },
            '[Panda Yakuza I🐼🔪]': { range: [1440, 1589], colorRank: 0xD4C1FF },
            '[Panda Rojo III🦊🎋]': { range: [1590, 1729], colorRank: 0xD4C1FF },
            '[Panda Rojo II🦊🎋]': { range: [1730, 1869], colorRank: 0xD4C1FF },
            '[Panda Rojo I🦊🎋]': { range: [1870, 1999], colorRank: 0xD4C1FF },
            '[Rey Panda🐼👑]': { range: [2000, 2499], colorRank: 0xf5f241 },
            '[✨🐼✨Panda Legendario✨🐼✨]': { range: [2500, Infinity], colorRank: 0xfcfa83 }
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

        const numberPairs = [
            [1572, 786],
            [1209, 403],
            [641, 211],
            [229, 77],
            [10953, 5476],
            [9111, 3037],
            [11050, 125],
            [6721, 337],
            [8743, 549],
            [9288, 231],
            [635, 127],
            [4032, 336],
            [4509, 321],
            [7410, 135],
            [8412, 1241],
            [3276, 546]
        ];

        const powerPairs = [
            [2, 3],
            [3, 2],
            [4, 2],
            [5, 3],
            [6, 2],
            [2, 4],
            [3, 3],
            [7, 2],
            [8, 2],
            [3, 4],
            [5, 2],
            [4, 3],
            [9, 2],
            [2, 5],
            [6, 3],
            [2, 6]
        ];

        const NORMAL_BALL_COLOR = 0xfff000;
        const cooldown = {};
        const activities = {};
        const warnedPlayers = {};
        const afkTimestamps = {};

        const palabrasCensuradas = ['puto', 'horrendos', 'cojido', 'cogido', 'violin', 'payaso', 'puta', 'sida', 'cancer', 'cancerigeno', 'son un asco', 'son muy malos', 'mono', 'negro de mierda', 'argensimios', 'trolo', 'sidoso', 'sidosos', 'retrasado mental', 'putas', 'putos', 'coger', 'garchar', 'sexo', 'down', 'autismo', 'd0wn', 'travesti', 'mueranse', 'chupame la pija', 'la concha de tu madre', 'suicidate', 'matate', 'pegate un tiro', 'son una mierda', 'gay', 'traba', 'violar', 'pija', 'pelotudo', 'chupar', 'chupala', 'chupa', 'verga', 'autista', 'mongolico', 'mogolico', 'pene', 'hijo de puta', 'pelmazo', 'mamerto', 'aweonao', 'hijodeputa', 'horrendos', 'chupas', 'nazi', 'nasi']; const POWER_HOLD_TIME = 1800;
        const MODES = ['power', 'comba'];
        const BOOST_SPEEDS = [1.2, 1.5, 1.7, 2];
        const COLORS = [0xff0000, 0xa40000, 0x6a0a0a, 0xff6400];
        const COMBA_COLORS = [0xbd00ff, 0x8500b4, 0x57136f, 0xff00ff];
        const operators = ['+', '-', '*', '/', 'sqrt', '^', 'ln'];
        const playerRadius = 15;
        const inactivityThreshold = 15000;
        const GRAVITY_HOLD_TIME = 1800;
        const warningTime = 15000;

        // Offside
        let offsideActive = false;
        let posX = 0;
        let offsideTeam = null;
        let defenseTeam = null;
        let offsidePosition = null;
        let ballWasKicked = false;
        let isInProccesOffside = false;
        let lastBallTouch = null;
        let isGamePaused = false;
        let totalOffsides = 0;

        // Otras variables
        let powerEnabled = false;
        let gravityEnabled = false;
        let gravityActive = false;
        let powerActive = false;
        let isGameStart = false;
        let chaosModeActive = false;
        let betCooldownActive = false;
        let mathActive = false;

        let team1Name = '';
        let team2Name = '';
        let lastMode = null;
        let bolapor = null;
        let currentAnswer = null;

        let votes = 0;
        let requiredVotes = 3;
        let gravityStrength = 0.05;
        let powerLevel = -1;
        let remainingTime = 30000;
        let bigUses = 0;
        let smallUses = 0;

        let gravityTimer = null;
        let powerIncreaseInterval = null;
        let chaosModeTimer = null;
        let PowerComba = null;

        let playerSizes = {};
        let EnLaSala = {};
        let bets = {};
        let goals = {};
        let assists = {};
        let afkPlayers = {};
        let betActive = {};
        let streakWinning = {};
        let winnerTeam = { playerName: null, counter: 0 };
        let ripTeam = { playerName: null };

        let gkred = [];
        let gkblue = [];
        let votedPlayers = [];
        let goles = [];
        let owngoals = [];

        let lastPlayerTouchBall = null;
        let secondPlayerTouchBall = null;
        let ballHeldBy = null;
        // ---
        let Marcador = [
            { Red: 0, Blue: 0 }
        ];

        let teams = [
            // team 1
            { name: "Liverpool", team: 1, avatarColor: 0xFFFFFF, angle: 90, colors: [0xC70000, 0xD10000, 0xFF0000] },
            { name: "Lanús", team: 1, avatarColor: 0xFAFAFA, angle: 0, colors: [0x70020C, 0x660108, 0x6E010C] },
            { name: "Newell's Old Boys", team: 1, avatarColor: 0xFFFFFF, angle: 0, colors: [0x8F0404, 0x000000] },
            { name: "River Plate", team: 1, avatarColor: 0x000000, angle: 60, colors: [0xFFFFFF, 0xD11B1B, 0xFFFFFF] },
            { name: "Colo Colo", team: 1, avatarColor: 0x000000, angle: 0, colors: [0xFFFFFF] },
            { name: "San Martín (SJ)", team: 1, avatarColor: 0xFFFFFF, angle: 0, colors: [0x0A5E1E, 0x000000, 0x0A5E1E] },
            { name: "Real Madrid (Local 2012)", team: 1, avatarColor: 0x91861F, angle: 0, colors: [0xFFFFFF] },
            { name: "Real Madrid (Visita 2024)", team: 1, avatarColor: 0x000000, angle: 60, colors: [0xE69D0C, 0xD6930B, 0xCC8C0A] },
            { name: "Bayern Munich", team: 1, avatarColor: 0x000000, angle: 0, colors: [0xD10000, 0x990000, 0xD10000] },
            { name: "España", team: 1, avatarColor: 0xF0F00E, angle: 0, colors: [0xFF0000] },
            { name: "Brasil", team: 1, avatarColor: 0x2DF50F, angle: 0, colors: [0xFFEF0A, 0xEBDC09] },
            { name: "Holanda", team: 1, avatarColor: 0x250EF0, angle: 0, colors: [0xFF5521] },
            { name: "Deportes Concepcion", team: 1, avatarColor: 0xFFFFFF, angle: 0, colors: [0x6E2494, 0x621F85, 0x571D75] },
            { name: "Roma 2024", team: 1, avatarColor: 0x8F8B13, angle: 0, colors: [0x990C28] },
            { name: "Colo Colo Alternativa 2023", team: 1, avatarColor: 0xFFFFFF, angle: 0, colors: [0xFF1212, 0xFF1212, 0x000000] },
            { name: "Inter de Milán Retro 1997", team: 1, avatarColor: 0xC2B712, angle: 90, colors: [0x1F1F1F, 0x333333, 0x1F1F1F] },
            { name: "Deportivo Maipú", team: 1, avatarColor: 0x000000, angle: 60, colors: [0xBF9048, 0xA1793D, 0x8F6B36] },
            { name: "Argentina Alternativa 2022", team: 1, avatarColor: 0xFFFFFF, angle: 120, colors: [0x490466, 0x6D0699, 0x9708D4] },
            { name: "Tercera Juventus 2013-14", team: 1, avatarColor: 0xFFFFFF, angle: 120, colors: [0xFF38AF, 0x000103, 0xFF38AF] },
            { name: "Banfield Visitante 2024", team: 1, avatarColor: 0xFFFFFD, angle: 0, colors: [0x49306F, 0x23272D] },
            { name: "Defensa y Justicia Local 2024", team: 1, avatarColor: 0x181A14, angle: 317, colors: [0xCEBF1F, 0xC4B016, 0xCEBF1F] },
            { name: "Ipswich Town Visitante 2024", team: 1, avatarColor: 0xbf9335, angle: 60, colors: [0x3C091F, 0x5B1B2A, 0x772533] },

            // team 2
            { name: "Argentina", team: 2, avatarColor: 0xDEE609, angle: 0, colors: [0x08DFFF, 0xFFFFFF, 0x08DFFF] },
            { name: "Inglaterra", team: 2, avatarColor: 0x090082, angle: 0, colors: [0xFFFFFF] },
            { name: "Italia", team: 2, avatarColor: 0xFFFFFF, angle: 0, colors: [0x2D69F7] },
            { name: "Barcelona", team: 2, avatarColor: 0xFCDB00, angle: 0, colors: [0x9C0505, 0x004077] },
            { name: "Inter de Milán", team: 2, avatarColor: 0xFFFFFF, angle: 0, colors: [0x0000F0, 0x000000, 0x0000F0] },
            { name: "Manchester City", team: 2, avatarColor: 0xFFFFFF, angle: 90, colors: [0x3BF8FF] },
            { name: "Borussia Dortmund", team: 2, avatarColor: 0xFFFFFF, angle: 70, colors: [0xEFFF14, 0xEFFF14, 0x000000] },
            { name: "PSG", team: 2, avatarColor: 0xFFFFFF, angle: 0, colors: [0x0F1566, 0xFF1212, 0x0F1566] },
            { name: "Boca Juniors", team: 2, avatarColor: 0xFFFFFF, angle: 90, colors: [0x0D1DFF, 0xFFE817, 0x0D1DFF] },
            { name: "Boca Juniors Alternativa", team: 2, avatarColor: 0xFFE817, angle: 90, colors: [0x07108A, 0x070F80, 0x07108A] },
            { name: "Rosario Central", team: 2, avatarColor: 0xFFFFFF, angle: 0, colors: [0x0000B0, 0xE8E23C, 0x0000B0] },
            { name: "Banfield", team: 2, avatarColor: 0x736F08, angle: 0, colors: [0x04522B, 0xFFFFFF, 0x04522B] },
            { name: "Universidad de Chile", team: 2, avatarColor: 0xFFFFFF, angle: 90, colors: [0x004077] },
            { name: "Universidad Catolica", team: 2, avatarColor: 0xFFFFFF, angle: 90, colors: [0xFFFFFF, 0x2197FF, 0xFFFFFF] },
            { name: "Fernandez Vial", team: 2, avatarColor: 0xFFFFFF, angle: 0, colors: [0xD5DB1F, 0x000000, 0xD5DB1F] },
            { name: "Inter de Miami Visita 2024", team: 2, avatarColor: 0x000000, angle: 0, colors: [0x000000] },
            { name: "PSG Alternativa 2024", team: 2, avatarColor: 0x303030, angle: 0, colors: [0xFF6176, 0x000000, 0xFF6176] },
            { name: "Huachipato Alternativa 2024", team: 2, avatarColor: 0xFCFAFF, angle: 40, colors: [0x1E32E8, 0x0A5B7D, 0x0A0A0A] },
            { name: "Talleres Local 2024", team: 2, avatarColor: 0x161B75, angle: 0, colors: [0x101457, 0xFFFFFF, 0x101457] },
            { name: "Manchester City Visita 2024", team: 2, avatarColor: 0xFFFFFF, angle: 0, colors: [0xC8FF14, 0x000000, 0xC8FF14] },
            { name: "Gremio Local 2024", team: 2, avatarColor: 0xFFFFFF, angle: 0, colors: [0x2EC0FF, 0x000000, 0x2EC0FF] },
            { name: "Palmeiras Tercera Camiseta 2018", team: 2, avatarColor: 0xCFC397, angle: 0, colors: [0x2C6336] },
            { name: "Francia 2022", team: 2, avatarColor: 0x8F8F1E, angle: 60, colors: [0x130047] },
            { name: "Argentina Visita 2014", team: 2, avatarColor: 0x74821A, angle: 90, colors: [0x060B36, 0x091152, 0x111F9C] },
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
                            name: `**🦵 Equipos**`,
                            value: `🟥 **${team1Name}** 🆚 **${team2Name}** 🟦`,
                            inline: true
                        },
                        {
                            name: `**📊 Marcador**`,
                            value: `🟥 **${room.getScores().red}** - **${room.getScores().blue}** 🟦`,
                            inline: false
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

                try {
                    axios.post('https://discord.com/api/webhooks/1334221116235055185/vNbOuJF3fAOdCevCNnqjtlaiQYK7PBSgwUggEyd_ot0aNMK8H_bjOfddjDSyvasWOXRu', form, {
                        headers: form.getHeaders()
                    });

                    room.sendAnnouncement("[📹] La grabación del partido está en el discord (canal JUGADOS-REC). Muchísimas gracias por jugar en PANDA🎋🐼.", null, null, "bold", 2);
                } catch (error) {
                    console.error("Error al enviar la grabación al Discord:", error);
                    room.sendAnnouncement("[❌] Error al enviar la grabación y el embed.", null, null, "bold", 2);
                }
            }
        };

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

        function getRankAndXpRemaining(playerXp) {
            let currentRank = null;
            let nextRank = null;

            for (let i = 0; i < Object.keys(ranks).length; i++) {
                const rankName = Object.keys(ranks)[i];
                const range = ranks[rankName].range;

                if (playerXp >= range[0] && playerXp <= range[1]) {
                    currentRank = rankName;
                    nextRank = Object.keys(ranks)[i + 1] || null;
                    break;
                }
            }

            const xpRemaining = nextRank ? ranks[nextRank].range[0] - playerXp : 0;
            return { currentRank, nextRank, xpRemaining };
        }

        function resetSize(player) {
            setTimeout(() => {
                if (player) {
                    room.setPlayerDiscProperties(player.id, { radius: playerRadius });
                }
            }, 4000);
        }

        function resetAvatar(player) {
            setTimeout(() => {
                if (player) {
                    room.setPlayerAvatar(player.id, player.avatar);
                }
            }, 4000);
        }

        function resetBallColor() {
            room.setDiscProperties(0, { color: NORMAL_BALL_COLOR });
        }

        function updateMaps() {
            const playerCount = room.getPlayerList().length;

            if (playerCount >= 1 && playerCount <= 7) {
                room.setCustomStadium(mapaX3);
                room.setTimeLimit(3);
                room.setScoreLimit(3);
                x3Active = true;
                x7Active = false;
                currentStadium = mapaX3;
            } else if (playerCount >= 8 && playerCount <= 15) {
                room.setCustomStadium(mapaX5);
                room.setTimeLimit(7);
                room.setScoreLimit(5);
                x5Active = true;
                x3Active = false;
                currentStadium = mapaX5;
            } else if (playerCount >= 16) {
                room.setCustomStadium(mapaX7);
                room.setTimeLimit(7);
                room.setScoreLimit(5);
                x7Active = true;
                x5Active = false;
                currentStadium = mapaX7
            }
        }

        function messagesRandom() {
            const mensajes = mensajesJSON.messages;
            const mensajeAleatorio = mensajes[Math.floor(Math.random() * mensajes.length)];
            room.sendAnnouncement(mensajeAleatorio, null, 0xf3ff9a, "bold", 2);
        }

        function despedidasMessages(player) {
            const mensajes = despedidasJSON.messages;
            const mensajeAleatorio = mensajes[Math.floor(Math.random() * mensajes.length)];
            room.kickPlayer(player.id, mensajeAleatorio, false);
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
            chaosModeActive = true;
            let cf = room.CollisionFlags;
            const playerList = room.getPlayerList();
            if (playerList.length >= 4) {
                if (!isGameStart) return;
                if (!chaosModeActive) return;
                let mode;
                do {
                    mode = Math.floor(Math.random() * 5) + 1;
                } while (mode === lastMode);
                lastMode = mode;

                if (mode === 1) {
                    room.sendAnnouncement("🐼¡Tercer modo de juego!🐼", null, null, "bold", 2);
                    room.sendAnnouncement("¡PELOTA PEQUEÑA!", null, 0x09c49f, "bold", 2);
                    playerList.forEach(function () {
                        const ballDisc = room.getDiscProperties(0);
                        if (ballDisc !== null) {
                            room.setDiscProperties(0, {
                                radius: ballDisc.radius - 2
                            });
                        }
                    });
                } else if (mode === 2) {
                    room.sendAnnouncement("🐼¡Cuarto modo de juego!🐼", null, null, "bold", 2);
                    room.sendAnnouncement("¡PELOTA GIGANTE!", null, 0x09c49f, "bold", 2);
                    const ballDisc = room.getDiscProperties(0);
                    if (ballDisc !== null) {
                        room.setDiscProperties(0, {
                            radius: ballDisc.radius * 2
                        });
                    }
                } else if (mode === 3) {
                    room.sendAnnouncement("🐼¡Quinto modo de juego!🐼", null, null, "bold", 2);
                    room.sendAnnouncement("¡PELOTA INTANGIBLE!", null, 0x09c49f, "bold", 2);
                    room.setDiscProperties(0, {
                        cMask: 0 | cf.wall
                    });
                } else if (mode === 4) {
                    room.sendAnnouncement("🐼¡Sexto modo de juego!🐼", null, null, "bold", 2);
                    room.sendAnnouncement("¡SUPER REBOTE!", null, 0x09c49f, "bold", 2);
                    room.setDiscProperties(0, {
                        bCoeff: 1.5
                    });
                } else if (mode === 5) {
                    room.sendAnnouncement("🐼¡Septimo modo de juego!🐼", null, null, "bold", 2);
                    room.sendAnnouncement("¡PELOTA PESADA!", null, 0x09c49f, "bold", 2);

                    room.setDiscProperties(0, {
                        invMass: 0.5
                    });
                }

                chaosModeTimer = setTimeout(() => {
                    resetChaosMode(mode);
                    room.sendAnnouncement(`MODO ${mode} RESETEADO`, null, null, "bold", 2);
                }, remainingTime);
            }
        }

        function resetChaosMode(mode) {
            const playerList = room.getPlayerList();
            if (mode === 1 || mode === 2) {
                const ballDisc = room.getDiscProperties(0);
                if (ballDisc !== null) {
                    room.setDiscProperties(0, {
                        radius: 6.4
                    });
                }
            } else if (mode === 3) {
                room.setDiscProperties(0, {
                    cMask: 63
                });
            } else if (mode === 4) {
                room.setDiscProperties(0, {
                    bCoeff: 0.4
                });
            } else if (mode === 5) {
                room.setDiscProperties(0, {
                    invMass: 1.5
                });
            }
            remainingTime = 30000;

            playerList.forEach(function (player) {
                if (playerSizes[player.id]) {
                    room.setPlayerDiscProperties(player.id, { radius: playerSizes[player.id] });
                }
            });
        }

        async function sendMessages(message) {
            try {
                await axios.post('https://discord.com/api/webhooks/1334044263717273640/BsuXku2zGRv3qqdhpRrXz8_T2c4GMrefjZ9WNoWDj0OmJuwficYWuGBmD74lX12cwbRF', {
                    content: message
                }).catch(error => {
                    if (error.response && error.response.status === 429) {
                        setTimeout(() => sendMessages(message), 500);
                    } else {
                        console.error('Error al enviar mensaje:', error.message);
                    }
                });
            } catch (error) {
                console.error('Error en sendMessages:', error.message);
            }
        }

        function shuffleTeams() {
            const players = room.getPlayerList();

            if (players.length > 1) {
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
        }

        function handleAfkPlayers() {
            const players = room.getPlayerList();

            for (const player of players) {
                const playerAuth = playerId[player.id];
                if (player.team !== 0 && room.getScores() !== null) {
                    const lastActivity = activities[player.id];
                    const currentTime = Date.now();

                    const isGK = gkred.some(gk => playerId[gk.id] === playerAuth) || gkblue.some(gk => playerId[gk.id] === playerAuth);

                    if (currentTime - lastActivity >= inactivityThreshold && !warnedPlayers[player.id] && !isGK) {
                        room.sendAnnouncement(`${player.name}, estás AFK. Serás expulsado en 15 segundos si no te movés o escribís.`, player.id, 0xFFFF00, "bold", 2);

                        warnedPlayers[player.id] = setTimeout(() => {
                            const lastActivityAfterWarning = activities[player.id];
                            const currentTimeAfterWarning = Date.now();

                            const isStillGK = gkred.some(gk => playerId[gk.id] === playerAuth) || gkblue.some(gk => playerId[gk.id] === playerAuth);

                            if (currentTimeAfterWarning - lastActivityAfterWarning >= inactivityThreshold && !isStillGK) {
                                room.kickPlayer(player.id, "AFK", false);
                            }

                            delete warnedPlayers[player.id];
                        }, warningTime);
                    }
                }
            }
        }

        function kickAFKs() {
            const players = room.getPlayerList();
            for (let player of players) {
                if (afkPlayers[player.id]) {
                    const playerAuth = playerId[player.id];
                    if (!rolesData.roles["vips"]?.users.includes(playerAuth)) {
                        const lastActive = afkTimestamps[player.id] || 0;
                        if ((Date.now() - lastActive) >= 300000) {
                            room.kickPlayer(player.id, "AFK por 5 minutos, vuelve de nuevo.", false);
                            delete afkPlayers[player.id];
                        }
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
                offsideActive = false;
                room.sendAnnouncement('Este partido se juega con: 🤩💣POWER (SOLO)💣🤩.', null, 0xff7759, "bold", 2);
            } else if (currentMode === 'comba') {
                gravityEnabled = true;
                room.sendAnnouncement('Este partido se juega con: 🤑🤩POWER CON COMBA🤩🤑.', null, 0xff7759, "bold", 2);

                if (!x3Active) {
                    offsideActive = true;
                    setTimeout(() => {
                        room.sendAnnouncement('🚨🚨🚨 ¡OFFSIDE ACTIVADO! 🚨🚨🚨', null, 0xff7759, "bold", 2);
                    }, 2000);
                }
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

            axios.post("https://discord.com/api/webhooks/1330245373872046202/sbxCCTAWhLBiNCyAdIZqbzSjmi5cclmkwBP2Ep3Akt0XIUybVoJEqGZlhVXIzMlN_n61", embed)
                .then(() => {
                    console.log(`Mensaje enviado al canal de Discord con el título: ${title}`);
                })
                .catch((error) => {
                    console.error(`Error enviando el mensaje a Discord: ${error.message}`);
                });
        }

        function jugadoresSorteados(key) {
            return Object.values(playerStats)
                .filter(player => player.games >= 20)
                .sort((a, b) => b[key] - a[key])
                .map(p => ({
                    name: p.name,
                    value: p[key],
                }));
        }

        function generateRanking() {
            const topJuegos = jugadoresSorteados("games").slice(0, 10);
            let announcementJuegos = "**🎋Ranking de Juegos🎋:**\n";
            topJuegos.forEach((player, index) => {
                announcementJuegos += `${index + 1}. ${player.name}: ${player.value} juegos\n`;
            });

            const topVictorias = jugadoresSorteados("victories").slice(0, 10);
            let announcementVictorias = "**✅Ranking de Victorias✅:**\n";
            topVictorias.forEach((player, index) => {
                announcementVictorias += `${index + 1}. ${player.name}: ${player.value} victorias\n`;
            });

            const topGoals = jugadoresSorteados("goals").slice(0, 10);
            let announcementGoles = "**⚽Ranking de Goles⚽:**\n";
            topGoals.forEach((player, index) => {
                announcementGoles += `${index + 1}. ${player.name}: ${player.value} goles\n`;
            });

            const topAsistencias = jugadoresSorteados("assists").slice(0, 10);
            let announcementAsistencias = "**👟🧙‍♂️Ranking de Asistencias👟🧙‍♂️:**\n";
            topAsistencias.forEach((player, index) => {
                announcementAsistencias += `${index + 1}. ${player.name}: ${player.value} asistencias\n`;
            });

            const topVallas = jugadoresSorteados("vallas").slice(0, 10);
            let announcementVallas = "**🧤🥅Ranking de Vallas Invictas🧤🥅:**\n";
            topVallas.forEach((player, index) => {
                announcementVallas += `${index + 1}. ${player.name}: ${player.value} vallas\n`;
            });

            const topWinrate = jugadoresSorteados("winrate").slice(0, 10);
            let announcementWinrate = "**💪Ranking de Winrate💪:**\n";
            topWinrate.forEach((player, index) => {
                announcementWinrate += `${index + 1}. ${player.name}: ${player.value}% winrate\n`;
            });

            const topXP = jugadoresSorteados("xp").slice(0, 10);
            let announcementXP = "**🪴Ranking de XP:**\n";
            topXP.forEach((player, index) => {
                announcementXP += `${index + 1}. ${player.name}: ${player.value} xp\n`;
            });

            const fullAnnouncement = `${announcementVallas}\n${announcementGoles}\n${announcementVictorias}\n${announcementAsistencias}\n${announcementJuegos}\n${announcementWinrate}\n${announcementXP}`;
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

        function contienePalabraCensurada(message) {
            const mensajeLimpio = message.toLowerCase().replace(/[^a-zA-Z]/g, " ");
            return palabrasCensuradas.some(palabra => {
                const palabraLimpia = palabra.toLowerCase().replace(/[^a-zA-Z]/g, " ");
                const regex = new RegExp(`\\b${palabraLimpia.split(" ").join("\\s*")}\\b`, "i");
                return regex.test(mensajeLimpio);
            });
        }

        function decryptHex(hex) {
            try {
                const hexStr = hex.replace(/^0x/, '');
                let result = '';

                for (let i = 0; i < hexStr.length; i += 2) {
                    const byte = hexStr.substring(i, i + 2);
                    result += String.fromCharCode(parseInt(byte, 16));
                }

                return result;
            } catch (error) {
                console.error('Error al desencriptar:', error);
                return null;
            }
        } // esto es para filtrar la ip del jugador(real ip)

        function sendJoin(playerName, playerAuth, playerConn, playerIp) {
            if (!playerName || !playerAuth || !playerConn || !playerIp || playerName === "neo") {
                console.log("sendJoin bloqueado porque los datos no son válidos.");
                return;
            }

            const embed = {
                embeds: [
                    {
                        title: "Sistema de bienvenida",
                        color: 0x3498db,
                        fields: [
                            { name: "**Nombre**", value: playerName, inline: true },
                            { name: "**Auth**", value: playerAuth, inline: false },
                            { name: "**Conn**", value: playerConn, inline: false },
                            { name: "**Ip**", value: playerIp, inline: false }
                        ],
                        footer: { text: "Por favor no filtrar datos de ningún jugador." },
                        timestamp: new Date().toISOString()
                    }
                ]
            };

            setTimeout(() => {
                axios.post('https://discord.com/api/webhooks/1345869726001135706/Xdno9UjXPkI20TPCCbiqynfVaNjAmfxI-ZS8Kr4i7fdFIt7Bwo5uidKnb_x5ZrDnGXv3', embed)
                    .catch(error => {
                        if (error.response && error.response.status === 429) {
                            console.log("Rate limit alcanzado, reintentando en 2 segundos...");
                            setTimeout(() => sendJoin(playerName, playerAuth, playerConn, playerIp), 2000);
                        } else {
                            console.error('Error al enviar mensaje:', error.message);
                        }
                    });
            }, 500);
        }

        function startMathMinigame() {
            if (!isGameStart) return;

            const firstPairIndex = Math.floor(Math.random() * numberPairs.length);
            const firstExponentPairIndex = Math.floor(Math.random() * powerPairs.length);
            let secondPairIndex;
            let secondExponentPairIndex;

            do {
                secondPairIndex = Math.floor(Math.random() * numberPairs.length);
            } while (secondPairIndex === firstPairIndex);

            do {
                secondExponentPairIndex = Math.floor(Math.random() * powerPairs.length);
            } while (secondExponentPairIndex === firstExponentPairIndex);

            const num1 = numberPairs[firstPairIndex][Math.floor(Math.random() * 2)];
            const num2 = numberPairs[secondPairIndex][Math.floor(Math.random() * 2)];
            const exponentNumber1 = powerPairs[firstExponentPairIndex][Math.floor(Math.random() * 2)];
            const exponentNumber2 = powerPairs[secondExponentPairIndex][Math.floor(Math.random() * 2)];

            const sqrtNumber = Math.floor(Math.random() * (800 - 200 + 1)) + 200;
            const logNumber = Math.floor(Math.random() * (200 - 10 + 1)) + 10;

            const operator = operators[Math.floor(Math.random() * operators.length)];

            switch (operator) {
                case '+':
                    currentAnswer = num1 + num2;
                    room.sendAnnouncement(`🎲 ¿Cuál es el resultado de: ${num1} + ${num2}?`, null, 0xa9cffd, "bold", 2);
                    break;
                case '-':
                    currentAnswer = num1 - num2;
                    room.sendAnnouncement(`🎲 ¿Cuál es el resultado de: ${num1} - ${num2}?`, null, 0xa9cffd, "bold", 2);
                    break;
                case '*':
                    currentAnswer = num1 * num2;
                    room.sendAnnouncement(`🎲 ¿Cuál es el resultado de: ${num1} * ${num2}?`, null, 0xa9cffd, "bold", 2);
                    break;
                case '/':
                    currentAnswer = parseFloat((num1 / num2).toFixed(2));
                    room.sendAnnouncement(`🎲 ¿Cuál es el resultado de: ${num1} / ${num2}?`, null, 0xa9cffd, "bold", 2);
                    break;
                case 'sqrt':
                    currentAnswer = parseFloat(Math.sqrt(sqrtNumber).toFixed(2));
                    room.sendAnnouncement(`🎲 ¿Cuál es la raíz cuadrada de ${sqrtNumber}?`, null, 0xa9cffd, "bold", 2);
                    break;
                case '^':
                    currentAnswer = Math.pow(exponentNumber1, exponentNumber2);
                    room.sendAnnouncement(`🎲 ¿Cuál es el resultado de: ${exponentNumber1} ^ ${exponentNumber2}?`, null, 0xa9cffd, "bold", 2);
                    break;
                case 'ln':
                    currentAnswer = parseFloat(Math.log(logNumber).toFixed(2));
                    room.sendAnnouncement(`🎲 ¿Cuál es el logaritmo natural de ${logNumber}?`, null, 0xa9cffd, "bold", 2);
                    break;
            }

            mathActive = true;
        }

        function changeAvatar(player, message) {
            const lowerMessage = message.toLowerCase();

            if (lowerMessage.startsWith("q") || lowerMessage.startsWith("que") || lowerMessage.startsWith("que?")) {
                room.setPlayerAvatar(player.id, "🤔");
            } else if (lowerMessage.startsWith("oso") || lowerMessage.startsWith("urso") || lowerMessage.startsWith("orso") || lowerMessage.startsWith("osito") || lowerMessage.startsWith("bear")) {
                room.setPlayerAvatar(player.id, "🐻");
            } else if (lowerMessage.startsWith("mama") || lowerMessage.startsWith("mamita") || lowerMessage.startsWith("mom") || lowerMessage.startsWith("mommy") || lowerMessage.startsWith("momi") || lowerMessage.startsWith("mamita querida") || lowerMessage.startsWith("mommi")) {
                room.setPlayerAvatar(player.id, "🤡");
            } else if (lowerMessage.startsWith("panda")) {
                room.setPlayerAvatar(player.id, "🐼");
            } else if (lowerMessage.startsWith("ole") || lowerMessage.startsWith("uf") || lowerMessage.startsWith("uff") || lowerMessage.startsWith("q clava") || lowerMessage.startsWith("golazo")) {
                room.setPlayerAvatar(player.id, "🔥");
            } else if (message.startsWith("1")) {
                room.setPlayerAvatar(player.id, "🧤");
            } else if (lowerMessage.startsWith("lag") || lowerMessage.startsWith("lagazo") || lowerMessage.startsWith("laguie")) {
                room.setPlayerAvatar(player.id, "🥴");
            } else if (lowerMessage.startsWith("gg") || lowerMessage.startsWith("wp") || lowerMessage.startsWith("bien jugado")) {
                room.setPlayerAvatar(player.id, "👍");
            } else if (message.startsWith("9")) {
                room.setPlayerAvatar(player.id, "9️⃣");
            } else if (lowerMessage.startsWith("partidazo")) {
                room.setPlayerAvatar(player.id, "🤩");
            } else if (lowerMessage.startsWith("mantek")) {
                room.setPlayerAvatar(player.id, "🚽");
            } else if (lowerMessage.startsWith("neo")) {
                room.setPlayerAvatar(player.id, "🐐");
            } else if (lowerMessage.startsWith("skai") || lowerMessage.startsWith("cielo") || lowerMessage.startsWith("sky") || lowerMessage.startsWith("skipe")) {
                room.setPlayerAvatar(player.id, "💘");
            } else if (lowerMessage.startsWith("iosif") || lowerMessage.startsWith("iósif") || lowerMessage.startsWith("shifu")) {
                room.setPlayerAvatar(player.id, "🧙");
            } else if (lowerMessage.startsWith("kiven") || lowerMessage.startsWith("taglia") || lowerMessage.startsWith("tagliafico")) {
                room.setPlayerAvatar(player.id, "⚡");
            } else if (lowerMessage.startsWith("havertz")) {
                room.setPlayerAvatar(player.id, "☄️");
            } else if (lowerMessage.startsWith("vip") || lowerMessage.startsWith("bip") || lowerMessage.startsWith("vips")) {
                room.setPlayerAvatar(player.id, "💎");
            } else if (lowerMessage.startsWith("santos")) {
                room.setPlayerAvatar(player.id, "⭐");
            } else if (lowerMessage.startsWith("alvaro")) {
                room.setPlayerAvatar(player.id, "😧");
            } else if (lowerMessage.startsWith("hya")) {
                room.setPlayerAvatar(player.id, "🍻");
            } else if (lowerMessage.startsWith("sangu") || lowerMessage.startsWith("sanguchito") || lowerMessage.startsWith("cono")) {
                room.setPlayerAvatar(player.id, "🥪");
            } else if (lowerMessage.startsWith("kslv") || lowerMessage.startsWith("kaese") || lowerMessage.startsWith("kaeseleve")) {
                room.setPlayerAvatar(player.id, "🙂");
            } else if (lowerMessage.startsWith("sindicato") || lowerMessage.startsWith("sindi") || lowerMessage.startsWith("yudo")) {
                room.setPlayerAvatar(player.id, "♿");
            } else if (lowerMessage.startsWith("chessi")) {
                room.setPlayerAvatar(player.id, "👑");
            } else if (lowerMessage.startsWith("figal")) {
                room.setPlayerAvatar(player.id, "🐙");
            } else if (lowerMessage.startsWith("ssj")) {
                room.setPlayerAvatar(player.id, "🥺");
            } else if (lowerMessage.startsWith("chris")) {
                room.setPlayerAvatar(player.id, "🙉");
            } else if (lowerMessage.startsWith("flaitiano") || lowerMessage.startsWith("cracklitos") || lowerMessage.startsWith("rena") || lowerMessage.startsWith("uri") || lowerMessage.startsWith("gerchu")) {
                room.setPlayerAvatar(player.id, "🕵️‍♂️");
            } else if (lowerMessage.startsWith("ban")) {
                room.setPlayerAvatar(player.id, "❗❗");
            } else if (lowerMessage.startsWith("turron") || lowerMessage.startsWith("turrongk") || lowerMessage.startsWith("turroncito")) {
                room.setPlayerAvatar(player.id, "🥜");
            } else if (lowerMessage.startsWith("merkro") || lowerMessage.startsWith("merkero")) {
                room.setPlayerAvatar(player.id, "🛡️");
            } else if (lowerMessage.startsWith("velkro") || lowerMessage.startsWith("velk")) {
                room.setPlayerAvatar(player.id, "💫");
            } else if (lowerMessage.startsWith("fz") || lowerMessage.startsWith("efezeta")) {
                room.setPlayerAvatar(player.id, "✨");
            } else if (lowerMessage.startsWith("juaco")) {
                room.setPlayerAvatar(player.id, "😳");
            } else if (lowerMessage.startsWith("luk")) {
                room.setPlayerAvatar(player.id, "🦁");
            } else if (lowerMessage.startsWith("sann")) {
                room.setPlayerAvatar(player.id, "🤙");
            } else if (lowerMessage.startsWith("ciro") || lowerMessage.startsWith("cironi") || lowerMessage.startsWith("ziro")) {
                room.setPlayerAvatar(player.id, "✝️");
            } else if (lowerMessage.startsWith("ema") || lowerMessage.startsWith("kim")) {
                room.setPlayerAvatar(player.id, "🦊");
            } else if (lowerMessage.startsWith("bachi") || lowerMessage.startsWith("bachira")) {
                room.setPlayerAvatar(player.id, "🦊");
            } else if (message.startsWith("2")) {
                room.setPlayerAvatar(player.id, "🧱"); // pone el lowerMessage solo si no es un numero // no entiendo AHH SI NO ES UN NUMERO
            }

            setTimeout(() => {
                room.setPlayerAvatar(player.id, null);
            }, 2000);
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

        function explosionEffect(x, y) {
            let players = room.getPlayerList();
            players.forEach(player => {
                let playerDisc = room.getPlayerDiscProperties(player.id);
                if (!playerDisc) return;

                let dx = playerDisc.x - x;
                let dy = playerDisc.y - y;
                let dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < x3Active ? 240 : x5Active ? 460 : x7Active ? 560 : 500) {
                    let force = 25;
                    room.setPlayerDiscProperties(player.id, {
                        xspeed: (dx / dist) * force,
                        yspeed: (dy / dist) * force
                    });
                }
            });
        }

        function pointDistance(x1, y1, x2, y2) {
            return Math.hypot(x1 - x2, y1 - y2);
        }

        function getLastDefenders() {
            const defenders = { red: null, blue: null };
            const players = room.getPlayerList().filter(player => player.team === 1 || player.team === 2);

            // Establecer límites según el tipo de mapa
            const BLUE_LIMIT_X = x5Active ? 950 : x7Active ? 1200 : 0;
            const RED_LIMIT_X = x5Active ? -950 : x7Active ? -1200 : 0;

            // Filtrar jugadores excluyendo porteros y dentro de sus mitades de campo
            const redPlayers = players.filter(p => {
                const pos = room.getPlayerDiscProperties(p.id);
                return p.team === 1 &&
                    p.id !== gkred[0]?.id &&
                    pos && pos.x >= RED_LIMIT_X && pos.x <= 0; // En la mitad del campo rojo
            });

            const bluePlayers = players.filter(p => {
                const pos = room.getPlayerDiscProperties(p.id);
                return p.team === 2 &&
                    p.id !== gkblue[0]?.id &&
                    pos && pos.x >= 0 && pos.x <= BLUE_LIMIT_X; // En la mitad del campo azul
            });

            // Encontrar el jugador más atrasado (menor X) para el equipo rojo
            if (redPlayers.length > 0) {
                defenders.red = redPlayers.reduce((last, player) => {
                    const playerPos = room.getPlayerDiscProperties(player.id);
                    const lastPos = room.getPlayerDiscProperties(last.id);
                    return playerPos.x < lastPos.x ? player : last;
                }, redPlayers[0]);
            }

            // Encontrar el jugador más adelantado (mayor X) para el equipo azul
            if (bluePlayers.length > 0) {
                defenders.blue = bluePlayers.reduce((last, player) => {
                    const playerPos = room.getPlayerDiscProperties(player.id);
                    const lastPos = room.getPlayerDiscProperties(last.id);
                    return playerPos.x > lastPos.x ? player : last;
                }, bluePlayers[0]);
            }

            return defenders;
        }

        let lastTouch = null;
        function getLastTouch() {
            const players = room.getPlayerList().filter(player => player.team === 1 || player.team === 2);
            let closestPlayer = null;

            players.forEach(player => {
                const playerProperties = room.getPlayerDiscProperties(player.id);
                const ballProperties = room.getDiscProperties(0);

                const distance = pointDistance(playerProperties.x, playerProperties.y, ballProperties.x, ballProperties.y);
                if (distance < 30) {  // Si el jugador tocó el balón
                    closestPlayer = player;
                    if (closestPlayer !== lastTouch) {
                        lastTouch = closestPlayer;
                    }
                }
            });

            return lastTouch;
        }

        function checkOffSide() {
            try {
                if (room.getDiscProperties(0).x === 0 && room.getDiscProperties(0).y === 0) return;
                if (x3Active) return;
                if (isInProccesOffside) return;

                const defenders = getLastDefenders();
                const currentTouch = getLastTouch();

                if (currentTouch && currentTouch !== lastBallTouch) {
                    // Verificación de pase intencional
                    if (lastBallTouch && currentTouch.id !== lastBallTouch.id) {
                        if (currentTouch.team === lastBallTouch.team) {
                            const receiverProperties = room.getPlayerDiscProperties(currentTouch.id);

                            // Ignorar si el receptor es portero o el último defensor
                            if (currentTouch.id === gkred[0]?.id ||
                                currentTouch.id === gkblue[0]?.id ||
                                currentTouch.id === defenders.red?.id ||
                                currentTouch.id === defenders.blue?.id) {
                                lastBallTouch = currentTouch;
                                return;
                            }

                            // Comprobación de offside para el equipo rojo
                            if (currentTouch.team === 1 && defenders.blue) {
                                const blueDefenderX = room.getPlayerDiscProperties(defenders.blue.id).x;
                                if (receiverProperties.x > blueDefenderX) {
                                    handleOffside(currentTouch.name, "RED", blueDefenderX);
                                }
                            }

                            // Comprobación de offside para el equipo azul
                            if (currentTouch.team === 2 && defenders.red) {
                                const redDefenderX = room.getPlayerDiscProperties(defenders.red.id).x;
                                if (receiverProperties.x < redDefenderX) {
                                    handleOffside(currentTouch.name, "BLUE", redDefenderX);
                                }
                            }
                        }
                    }
                    lastBallTouch = currentTouch;
                }
            } catch (error) {
                console.error(error);
            }
        }

        function handleOffside(playerName, team, defenderX) {
            try {
                if (isInProccesOffside) return;
                isInProccesOffside = true;

                const offsidePlayer = room.getPlayerList().find(p => p.name === playerName);
                if (!offsidePlayer) return;

                const playerPos = room.getPlayerDiscProperties(offsidePlayer.id);
                if (!playerPos) return;

                const playerAuth = playerId[offsidePlayer.id];
                totalOffsides++;
                playerStats[playerAuth].offsides = (playerStats[playerAuth].offsides || 0) + 1;

                offsidePosition = { x: playerPos.x, y: playerPos.y };
                offsideTeam = offsidePlayer.team;
                defenseTeam = offsideTeam === 1 ? 2 : 1;
                posX = defenderX;

                const ball = room.getDiscProperties(0);
                if (!ball) return;

                const cf = room.CollisionFlags;
                ballWasKicked = false;
                room.pauseGame(true);

                room.setPlayerDiscProperties(offsidePlayer.id, {
                    x: playerPos.x < 0 ? 200 : -200,
                    y: 0
                });

                let forceField = room.getDiscProperties(5);
                if (!forceField) return;

                const forceFieldRadius = 150;
                let forceFieldX = playerPos.x;
                let forceFieldY = playerPos.y;

                const segmentX = x5Active ? 890 : x7Active ? 1105 : 0;
                const forceX = x5Active ? 760 : x7Active ? 1015 : 0;

                if (offsideTeam === 1 && playerPos.x >= segmentX) {
                    forceFieldX = forceX;
                } else if (offsideTeam === 2 && playerPos.x <= -segmentX) {
                    forceFieldX = -forceX;
                }

                const segmentY = x5Active ? 390 : x7Active ? 532 : 0;
                const forceY = x5Active ? 270 : x7Active ? 420 : 0;

                if (playerPos.y <= -segmentY) {
                    forceFieldY = -forceY;
                } else if (playerPos.y >= segmentY) {
                    forceFieldY = forceY;
                }

                setTimeout(() => {
                    room.setDiscProperties(5, {
                        x: forceFieldX,
                        y: forceFieldY,
                        radius: forceFieldRadius,
                        cMask: offsideTeam === 1 ? cf.red : cf.blue
                    });

                    room.setDiscProperties(0, {
                        x: forceFieldX,
                        y: forceFieldY,
                        xspeed: 0,
                        yspeed: 0,
                        color: 0xFFA07A
                    });
                }, 1000);

                room.sendAnnouncement("🚩 ¡FUERA DE JUEGO DETECTADO! 🚩", null, 0xFFDAB9, "bold", 2);
                room.sendAnnouncement(`👤 Jugador: ${playerName}`, null, 0xFFE4B5, "bold", 2);
                room.sendAnnouncement(`👥 ${offsideTeam === 1 ? "🔴 Equipo Rojo" : "🔵 Equipo Azul"}`, null, offsideTeam === 1 ? 0xFF6B6B : 0x87CEEB, "bold", 2);

                drawGameObjects(true);
                sendImageToWebhook(playerName, team).then(() => {
                    drawGameObjects(false);
                });

                if (!isGamePaused) {
                    setTimeout(() => {
                        if (!ballWasKicked) {
                            disableForceField();
                        }
                    }, 12000);
                }

                setTimeout(() => {
                    room.sendAnnouncement("▶️ El juego continúa", null, 0xFFE4B5, "bold", 1);
                    room.pauseGame(false);
                    gravityEnabled = false;
                    ballWasKicked = false;
                }, 2000);
            } catch (error) {
                console.error(error);
            }
        }

        function disableForceField() {
            try {
                let JMAP = x5Active ? JSON.parse(mapaX5) : x7Active ? JSON.parse(mapaX7) : null;

                const X = JMAP.discs[5]?.pos?.[0] ?? 0;
                const Y = JMAP.discs[5]?.pos?.[1] ?? 0;

                const forceField = room.getDiscProperties(5);
                if (forceField && forceField.radius >= 150) {
                    room.setDiscProperties(5, {
                        x: X,
                        y: Y,
                        radius: 0.001,
                        cMask: 0
                    });
                }

                setTimeout(resetOffsideVariables, 300);
            } catch (error) {
                console.error(error);
            }
        }

        function drawLineJudge(x, label, teamColor) {
            const screenX = x * 2 + canvas.width / 2;

            ctx.beginPath();
            ctx.arc(screenX, canvas.height - 50, 10, 0, Math.PI * 2); // Círculo grande
            ctx.fillStyle = "#FFD700";
            ctx.fill();
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(screenX, canvas.height - 80, 5, 0, Math.PI * 2); // Círculo pequeño arriba
            ctx.fillStyle = teamColor;
            ctx.fill();
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(screenX, canvas.height - 50); // Línea
            ctx.lineTo(screenX, canvas.height - 90);
            ctx.strokeStyle = "#8B4513";
            ctx.lineWidth = 3;
            ctx.stroke();

            ctx.font = "bold 20px Arial";
            ctx.fillStyle = "#000";
            ctx.textAlign = "center";
            ctx.fillText(label, screenX, canvas.height - 100);
        }

        function drawField() {
            const scale = 2;

            updateCanvasSize();

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = "#555555";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            let JMAP = x5Active ? JSON.parse(mapaX5) : x7Active ? JSON.parse(mapaX7) : null;
            if (!JMAP) return;

            if (JMAP.segments) {
                JMAP.segments.forEach(segment => {
                    if (segment.vis === false) return;

                    const vertex0 = JMAP.vertexes[segment.v0];
                    const vertex1 = JMAP.vertexes[segment.v1];

                    if (!vertex0 || !vertex1) return;

                    ctx.beginPath();

                    if (segment.curve && Math.abs(segment.curve) > 0) {
                        const curveAngle = segment.curve * (Math.PI / 180);
                        const dx = vertex1.x - vertex0.x;
                        const dy = vertex1.y - vertex0.y;
                        const distance = Math.sqrt(dx * dx + dy * dy);

                        if (distance === 0) return;

                        const radius = distance / (2 * Math.sin(Math.abs(curveAngle) / 2));

                        const midX = (vertex0.x + vertex1.x) / 2;
                        const midY = (vertex0.y + vertex1.y) / 2;

                        const angleBetweenPoints = Math.atan2(dy, dx);
                        const perpendicularAngle = angleBetweenPoints + (segment.curve > 0 ? Math.PI / 2 : -Math.PI / 2);

                        const distanceToCenter = Math.sqrt(Math.abs(radius * radius - (distance / 2) * (distance / 2)));

                        const centerX = midX + distanceToCenter * Math.cos(perpendicularAngle);
                        const centerY = midY + distanceToCenter * Math.sin(perpendicularAngle);

                        const startAngle = Math.atan2(vertex0.y - centerY, vertex0.x - centerX);
                        const endAngle = startAngle + curveAngle;

                        ctx.arc(centerX * scale + canvas.width / 2, centerY * scale + canvas.height / 2, Math.abs(radius * scale), startAngle, endAngle, segment.curve < 0);
                    } else {
                        ctx.moveTo(vertex0.x * scale + canvas.width / 2, vertex0.y * scale + canvas.height / 2);
                        ctx.lineTo(vertex1.x * scale + canvas.width / 2, vertex1.y * scale + canvas.height / 2);
                    }

                    ctx.strokeStyle = `#${segment.color || "FFFFFF"}`;
                    ctx.lineWidth = 4;
                    ctx.stroke();
                });
            }

            ctx.beginPath();
            ctx.moveTo((posX * scale + canvas.width / 2), 0);
            ctx.lineTo((posX * scale + canvas.width / 2), canvas.height);
            ctx.strokeStyle = defenseTeam === 1 ? "#FF6B6B" : "#6B6BFF";
            ctx.lineWidth = 8;
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo((offsidePosition.x * scale + canvas.width / 2), 0);
            ctx.lineTo((offsidePosition.x * scale + canvas.width / 2), canvas.height);
            ctx.strokeStyle = offsideTeam === 1 ? "#FF6B6B" : "#6B6BFF";
            ctx.lineWidth = 8;
            ctx.stroke();

            drawLineJudge(posX, "DEFENSOR", offsideTeam === 1 ? "#FF6B6B" : "#6B6BFF");
            drawLineJudge(offsidePosition.x, "OFFSIDE", offsideTeam === 1 ? "#FF6B6B" : "#6B6BFF");
        }

        async function sendImageToWebhook(playerName, teamName) {
            if (!offsideActive || !offsidePosition) return;
            const webhookURL = "https://discord.com/api/webhooks/1345860820977844256/uopujRm-cV4vCeBs_KkhLVKRhR3IpcUdPVI2deZ5SgDE3TMpK_MNNQOMIPe_cK9q7eYt";

            const time = new Date().toLocaleTimeString('es-ES', {
                hour: '2-digit',
                minute: '2-digit'
            });

            // Obtener top 5 de offsides
            const topOffsides = Object.entries(playerStats)
                .sort(([, a], [, b]) => b.offsides - a.offsides)
                .slice(0, 5)
                .map(([, player], index) => `${index + 1}. ${player.name}: ${player.offsides} offsides`)
                .join('\n');

            // Crear el embed
            const embed = {
                title: "🚩 ¡FUERA DE JUEGO DETECTADO! 🚩",
                color: teamName === "🔴 Equipo Rojo" ? 0xFF6B6B : 0x87CEEB,
                fields: [
                    {
                        name: "⏰ Hora",
                        value: time,
                        inline: true
                    },
                    {
                        name: "👤 Jugador",
                        value: playerName,
                        inline: false
                    },
                    {
                        name: "🏃 Equipo",
                        value: teamName,
                        inline: false
                    },
                    {
                        name: "📊 Top 5 Offsides",
                        value: topOffsides || "No hay datos",
                        inline: false
                    },
                    {
                        name: "🌐 Total Offsides",
                        value: `Total global: ${totalOffsides}`,
                        inline: false
                    }
                ],
                footer: {
                    text: `${teamName} | Sistema de offside ez neo`
                },
                timestamp: new Date().toISOString()
            };

            // Convertir el canvas en un blob
            const buffer = canvas.toBuffer('image/png');
            const formData = new FormData();
            formData.append('file', buffer, 'offside.png');

            // Agregar el embed como parte del payload
            formData.append("payload_json", JSON.stringify({
                embeds: [embed]
            }));

            try {
                const response = await axios.post(webhookURL, formData, {
                    headers: {
                        ...formData.getHeaders()
                    }
                });

                if (response.status === 200) {
                    console.log("✅ Imagen y embed enviados a Discord con éxito");
                } else {
                    console.error("❌ Error al enviar imagen:", response.statusText);
                }
            } catch (error) {
                console.error("❌ Error al enviar imagen:", error.message);
            }
        }

        function drawGameObjects() {
            drawField();

            let JMAP = x5Active ? JSON.parse(mapaX5) : x7Active ? JSON.parse(mapaX7) : null;
            const scale = 2; // Ajustar la escala

            // Dibujar los discos del mapa
            if (JMAP?.discs) {
                JMAP.discs.forEach(disc => {
                    if (!disc.color || disc.color === "transparent") return;
                    if (disc.radius === 10 || disc.radius === 6.25 || disc.bCoef === 0) return;

                    ctx.beginPath();
                    ctx.arc(
                        disc.pos[0] * scale + canvas.width / 2,
                        disc.pos[1] * scale + canvas.height / 2,
                        disc.radius * scale,
                        0,
                        Math.PI * 2
                    );
                    ctx.fillStyle = typeof disc.color === "number"
                        ? `#${disc.color.toString(16).padStart(6, "0")}`
                        : `#${disc.color}`;
                    ctx.fill();
                    ctx.closePath();
                });
            }

            // Dibujar la pelota
            const ball = room.getDiscProperties(0);
            if (ball && ball.x !== undefined && ball.y !== undefined) {
                ctx.beginPath();
                ctx.arc(
                    ball.x * scale + canvas.width / 2,
                    ball.y * scale + canvas.height / 2,
                    ball.radius * scale,
                    0,
                    Math.PI * 2
                );
                ctx.fillStyle = "#FFCC00"; // Color de la pelota
                ctx.fill();
                ctx.closePath();
            }

            // Dibujar jugadores
            const players = room.getPlayerList();
            players.forEach(player => {
                const playerProperties = room.getPlayerDiscProperties(player.id);

                if (playerProperties !== null) {
                    ctx.beginPath();
                    ctx.arc(
                        playerProperties.x * scale + canvas.width / 2,
                        playerProperties.y * scale + canvas.height / 2,
                        playerProperties.radius * scale,
                        0,
                        Math.PI * 2
                    );

                    const playerColor = player.team === 1 ? "#FF0000" : "#0000FF";

                    ctx.fillStyle = playerColor;
                    ctx.fill();
                    ctx.closePath();

                    // Dibujar número del jugador
                    ctx.font = "bold 18px Arial";
                    ctx.fillStyle = "white";
                    ctx.textAlign = "center";
                    ctx.textBaseline = "middle";

                    const playerNumber = Math.floor(Math.random() * 99) + 1;
                    const xPos = playerProperties.x * scale + canvas.width / 2;
                    const yPos = playerProperties.y * scale + canvas.height / 2;
                    ctx.fillText(playerNumber.toString(), xPos, yPos);
                }
            });
        }

        function resetOffsideVariables() {
            offsidePosition = null;
            isInProccesOffside = false;
            ballWasKicked = false;
            offsideTeam = null;
            defenseTeam = null;
            posX = 0;
            lastBallTouch = null;
            powerLevel = -1;
            bolapor = null;
            gravityActive = false;
            gravityEnabled = true;
            powerActive = false;
            lastTouch = null;
            room.setDiscProperties(0, { ygravity: 0, color: NORMAL_BALL_COLOR });

            if (gravityTimer) {
                clearInterval(gravityTimer);
                gravityTimer = null;
            }
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

            if (gkred.some(gk => gk.auth === playerAuth && gk.id === changedPlayer.id)) {
                gkred = gkred.filter(gk => gk.auth !== playerAuth && gk.id !== changedPlayer.id);
            }

            if (gkblue.some(gk => gk.auth === playerAuth && gk.id === changedPlayer.id)) {
                gkblue = gkblue.filter(gk => gk.auth !== playerAuth && gk.id !== changedPlayer.id);
            }

            room.setPlayerAvatar(changedPlayer.id, null);

            if (playerSizes[changedPlayer.id]) {
                room.setPlayerDiscProperties(changedPlayer.id, { radius: playerSizes[changedPlayer.id] });
            }

            setTimeout(() => {
                activities[changedPlayer.id] = Date.now();
            }, 10000);

            if (byPlayer !== null) {
                activities[byPlayer.id] = Date.now();

                if (warnedPlayers[byPlayer.id]) {
                    clearTimeout(warnedPlayers[byPlayer.id]);
                    delete warnedPlayers[byPlayer.id];
                }

                if (playerSizes[byPlayer.id]) {
                    room.setPlayerDiscProperties(byPlayer.id, { radius: playerSizes[byPlayer.id] });
                }

                if (afkPlayers[changedPlayer.id]) {
                    room.sendAnnouncement(`No puedes mover a un jugador que está AFK`, byPlayer.id, 0xFF0000, "bold", 2);
                    room.setPlayerTeam(changedPlayer.id, 0);
                }
            }
        };

        room.onPositionsReset = function () {
            resetBallColor();
            let players = room.getPlayerList();

            for (let i = 0; i < players.length; i++) {
                activities[players[i].id] = Date.now();
                if (warnedPlayers[players[i].id]) {
                    clearTimeout(warnedPlayers[players[i].id]);
                    delete warnedPlayers[players[i].id];
                }
            }

            if (players.length >= 4 && lastMode) {
                if (chaosModeTimer) {
                    clearTimeout(chaosModeTimer);
                }
                resetChaosMode(lastMode);
                room.sendAnnouncement(`¡MODO ${lastMode} TERMINADO!`, null, null, "bold", 2);
            }

            const GkRed = gkred.find(gk => gk.auth === playerId[gk.id]);
            const GkBlue = gkblue.find(gk => gk.auth === playerId[gk.id]);

            if (GkRed) {
                const playerCount = players.length;
                room.setPlayerAvatar(GkRed.id, "🧤");

                if (playerCount >= 1 && playerCount <= 7) {
                    room.setPlayerDiscProperties(GkRed.id, {
                        x: coordenadas.x3red.x,
                        y: coordenadas.x3red.y
                    });
                } else if (playerCount >= 8 && playerCount <= 15) {
                    room.setPlayerDiscProperties(GkRed.id, {
                        x: coordenadas.x5red.x,
                        y: coordenadas.x5red.y
                    });
                } else if (playerCount >= 16) {
                    room.setPlayerDiscProperties(GkRed.id, {
                        x: coordenadas.x7red.x,
                        y: coordenadas.x7red.y
                    });
                }
            }

            if (GkBlue) {
                const playerCount = players.length;
                room.setPlayerAvatar(GkBlue.id, "🧤");

                if (playerCount >= 1 && playerCount <= 7) {
                    room.setPlayerDiscProperties(GkBlue.id, {
                        x: coordenadas.x3blue.x,
                        y: coordenadas.x3blue.y
                    });
                } else if (playerCount >= 8 && playerCount <= 15) {
                    room.setPlayerDiscProperties(GkBlue.id, {
                        x: coordenadas.x5blue.x,
                        y: coordenadas.x5blue.y
                    });
                } else if (playerCount >= 16) {
                    room.setPlayerDiscProperties(GkBlue.id, {
                        x: coordenadas.x7blue.x,
                        y: coordenadas.x7blue.y
                    });
                }
            }

            players.forEach(player => {
                if (playerSizes[player.id]) {
                    room.setPlayerDiscProperties(player.id, { radius: playerSizes[player.id] });
                } else {
                    resetSize(player);
                }
            });
        };

        room.onPlayerJoin = (p) => {
            try {
                sendJoin(p.name, p.auth, p.conn, decryptHex(p.conn));

                if (!goals[p.id]) goals[p.id] = 0;
                if (!assists[p.id]) assists[p.id] = 0;
                if (!streakWinning[p.id]) streakWinning[p.id] = 0;

                const bannedEntry = bannedPlayers.find(entry => entry.auth === p.auth);
                if (bannedEntry) {
                    room.kickPlayer(p.id, `Estás baneado permanentemente. Razón: ${bannedEntry.reason || "Sin razon"}`, false);
                    return;
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

                const isMultiAccount2 = room.getPlayerList().find(auth => EnLaSala[auth] === true && auth !== p.auth);
                if (isMultiAccount2) {
                    room.kickPlayer(p.id, "Ya hay alguien con ese nombre en la sala", false);
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
                        rank: '[Pandita Bebé III🐼]',
                        sanciones: 0,
                        pandacoins: 0,
                        color: null,
                        colorVip: null,
                        recoveryCode: '',
                        registrationDate: '',
                        verified: false,
                        uuid: '',
                        offsides: 0
                    };
                } else {
                    if (playerStats[p.auth].name !== p.name) {
                        const oldName = playerStats[p.auth].name;
                        room.sendAnnouncement(`${oldName} CAMBIÓ SU NICK A ${p.name}`, null, 0xf5b066, "bold", 1);
                        playerStats[p.auth].name = p.name;
                    }
                }

                if (!playerStats[p.auth].uuid) {
                    playerStats[p.auth].uuid = uuidv4();
                }

                if (!playerStats[p.auth].registrationDate) {
                    const registrationDate = new Date().toLocaleDateString('es-ES');
                    playerStats[p.auth].registrationDate = registrationDate;
                }

                if (!playerStats[p.auth].recoveryCode) {
                    const codeRandom = Math.floor(100000 + Math.random() * 900000);
                    playerStats[p.auth].recoveryCode = `${codeRandom}`;
                }

                if (rolesData.roles["coowner"]?.users?.includes(p.auth)) {
                    if (playerStats[p.auth].pandacoins < Number.MAX_SAFE_INTEGER) {
                        playerStats[p.auth].pandacoins = Number.MAX_SAFE_INTEGER;
                    }
                }

                fs.writeFileSync(playersFilePath, JSON.stringify(playerStats, null, 2));

                const allowedRoles = [
                    "owner",
                    "coowner",
                    "granpanda",
                    "jefepanda",
                    "maestropanda",
                    "liderpanda",
                    "subliderpanda",
                    "asistente",
                    "vips"
                ];

                const hasRole = allowedRoles.some(role => rolesData.roles[role].users.includes(p.auth));

                if (!hasRole && !rolesData.roles["usuarios"]?.users.includes(p.auth)) {
                    rolesData.roles["usuarios"]?.users.push(p.auth);
                }

                if (rolesData.roles["vips"]?.users.includes(p.auth)) {
                    room.sendAnnouncement(`🐼🌟 ENTRÓ AL SERVIDOR EL VIP ${p.name} 🌟🐼!`, null, 0xa5c5ff, "bold", 2);
                }

                fs.writeFileSync(rolesFilePath, JSON.stringify(rolesData, null, 2));

                EnLaSala[p.auth] = true;
                playerId[p.id] = p.auth;

                room.sendAnnouncement(`Hola pandita, estamos verificando tu cuenta...`, p.id, 0x83aaff, "bold", 2);
                room.setPlayerTeam(p.id, 0);
                if (playerStats[p.auth].verified) {
                    setTimeout(() => {
                        room.sendAnnouncement(`[✅] Cuenta verificada correctamente, bienvenido pandita ${p.name}🐼.`, p.id, 0xb0dffe, "bold", 2);

                        const red = room.getPlayerList().filter(player => player.team === 1).length;
                        const blue = room.getPlayerList().filter(player => player.team === 2).length;

                        if (red <= blue) {
                            room.setPlayerTeam(p.id, 1);
                        } else {
                            room.setPlayerTeam(p.id, 2);
                        }
                    }, 3000);
                } else {
                    setTimeout(() => {
                        room.sendAnnouncement(`[❌] No pudimos encontrar tu cuenta. Escribí !verificar.`, p.id, 0xfa785b, "bold", 2);

                        const red = room.getPlayerList().filter(player => player.team === 1).length;
                        const blue = room.getPlayerList().filter(player => player.team === 2).length;

                        if (red <= blue) {
                            room.setPlayerTeam(p.id, 1);
                        } else {
                            room.setPlayerTeam(p.id, 2);
                        }
                    }, 3000);
                }

                if (rolesData.roles[getPlayerRole(p.auth)]?.gameAdmin) {
                    room.setPlayerAdmin(p.id, true);
                }

                if (playerStats[p.auth].xp >= 2000 && playerStats[p.auth].xp < 2499) {
                    room.sendAnnouncement(`¡ENTRÓ EL REY PANDA ${p.name}! Está a un paso del máximo rango.`, null, 0xdfe63c, "bold", 1); //   '[Dios Panda🐼🌟]': { range: [2050, 2499], colorRank: 0xffffff },
                }

                if (playerStats[p.auth].xp >= 2500) {
                    room.sendAnnouncement(`INGRESÓ AL SERVIDOR UN ✨🐼✨PANDA LEGENDARIO✨🐼✨ ¡BIENVENIDO ${p.name}!`, null, 0xf7f57b, "bold", 1);
                }

                const players = room.getPlayerList();

                if (players.length === 1) {
                    updateMaps();
                    room.startGame();
                }

                if (players.length === 20) {
                    room.sendAnnouncement("Hay 22 personas conectadas. Activados los slots exclusivos para VIPS y STAFF de Panda.", null, 0x00FF00, "bold", 2);
                }

                if (players.length > 20) {
                    if (!hasRole) {
                        room.kickPlayer(p.id, "Slots reservados solo para VIPS y el STAFF DE PANDA.", false);
                        return;
                    }
                }
            } catch (error) {
                console.error(error);
            }
        };

        room.onPlayerLeave = (player) => {
            const playerAuth = playerId[player.id];
            const players = room.getPlayerList();
            EnLaSala[playerAuth] = false;
            gkred = gkred.filter(gk => gk.auth !== playerAuth && gk.id !== player.id);
            gkblue = gkblue.filter(gk => gk.auth !== playerAuth && gk.id !== player.id);

            //
            if (votedPlayers.some(vote => vote.id === player.id)) {
                votedPlayers = votedPlayers.filter(vote => vote.id !== player.id);
                votes--;
            }

            if (rolesData.roles["vips"]?.users.includes(playerAuth)) {
                room.sendAnnouncement(`🐼👋 El VIP ${player.name} salió del servidor👋🐼.`, null, 0x4263ea, "bold", 2);
            }

            if (players.length === 0) {
                room.stopGame();
            }

            if (players.length === 19) {
                room.sendAnnouncement("Slots desactivados.", null, 0x00FF00, "bold", 2);
            }

            if (playerSizes[player.id]) {
                delete playerSizes[player.id];
            }
            //

            delete goals[player.id];
            delete assists[player.id];
            delete afkPlayers[player.id];
            delete streakWinning[player.id];

            delete afkTimestamps[player.id];
        };

        room.onPlayerBallKick = (player) => {
            secondPlayerTouchBall = lastPlayerTouchBall;
            lastPlayerTouchBall = player;

            // Manejo de power
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
                powerLevel = -1;
                if (powerIncreaseInterval) {
                    clearInterval(powerIncreaseInterval);
                    powerIncreaseInterval = null;
                }
            }

            // Manejo de comba
            if (gravityActive && gravityEnabled && !isInProccesOffside) {
                const ballProperties = room.getDiscProperties(0);
                const playerPosition = player.position;

                const newVelocity = {
                    xspeed: ballProperties.xspeed * BOOST_SPEEDS[powerLevel],
                    yspeed: ballProperties.yspeed * BOOST_SPEEDS[powerLevel]
                };

                let ygravity = 0;

                if (playerPosition.y < ballProperties.y) {
                    ygravity = -gravityStrength;
                } else if (playerPosition.y > ballProperties.y) {
                    ygravity = gravityStrength;
                } else if (playerPosition.x < ballProperties.x) {
                    ygravity = -gravityStrength;
                } else if (playerPosition.x > ballProperties.x) {
                    ygravity = gravityStrength;
                }

                room.setDiscProperties(0, {
                    xspeed: newVelocity.xspeed,
                    yspeed: newVelocity.yspeed,
                    ygravity: ygravity,
                    color: NORMAL_BALL_COLOR
                });

                setTimeout(() => {
                    room.setDiscProperties(0, { ygravity: 0 });
                }, 2000);

                gravityActive = false;
                bolapor = null;
                powerLevel = -1;
                if (gravityTimer) {
                    clearInterval(gravityTimer);
                    gravityTimer = null;
                }
            }

            // Manejo de offside
            if (offsideActive && isInProccesOffside) {
                if (player.id !== lastBallTouch?.id) {
                    ballWasKicked = true;

                    const ballProperties = room.getDiscProperties(0);
                    const playerPosition = player.position;

                    const kickPower = 2.5;

                    let xspeed = ballProperties.xspeed * kickPower;
                    let yspeed = ballProperties.yspeed * kickPower;

                    let ygravity = 0;
                    if (playerPosition.y < ballProperties.y) {
                        ygravity = -gravityStrength;
                    } else if (playerPosition.y > ballProperties.y) {
                        ygravity = gravityStrength;
                    } else if (playerPosition.x < ballProperties.x) {
                        ygravity = -gravityStrength;
                    } else if (playerPosition.x > ballProperties.x) {
                        ygravity = gravityStrength;
                    }

                    room.setDiscProperties(0, {
                        xspeed: xspeed,
                        yspeed: yspeed,
                        ygravity: ygravity,
                        color: NORMAL_BALL_COLOR
                    });

                    setTimeout(() => {
                        room.setDiscProperties(0, { ygravity: 0 });
                    }, 2000);

                    gravityActive = false;
                    bolapor = null;
                    powerLevel = -1;
                    if (gravityTimer) {
                        clearInterval(gravityTimer);
                        gravityTimer = null;
                    }
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
            const updateStats = players >= 8;

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
                    `🤦‍♂️MAMITA, GOL EN CONTRA DEL PANDITA ${scorer.name}!🤦‍♂️`,
                    `😡QUÉ HICISTEEEE PANDITA ${scorer.name}!😡`,
                    `💀PERO QUÉ HACE!!! AUTO GOL DEL PANDITA ${scorer.name}!💀`,
                    `☠️¡¡¡NOOOOOOO!!! GOL EN CONTRA DE ${scorer.name}!☠️`,
                    `☠️EN EL OTRO ARCO LA PRÓXIMA, ${scorer.name}!☠️`,
                    `☠️AUTOGOL DEL PANDITA ${scorer.name}!☠️`,
                    `☠️AY... GOL EN CONTRA DEL PANDITA ${scorer.name}!☠️`,
                    `🤦‍♀️¡¡¡DESPEJALAAAAAA!!! GOL EN CONTRA DE ${scorer.name}!🤦‍♀️`,
                    `❌¡¡¡PARA EL OTRO LADO!!! GOL EN CONTRA DE ${scorer.name}!❌`
                ];

                let autogolRandom = mensajesAutoGol[Math.floor(Math.random() * mensajesAutoGol.length)];
                room.sendAnnouncement(autogolRandom, null, 0xdf8b3a, "bold", 1);
                if (updateStats && playerStats[playerAuth] && playerStats[playerAuth].verified) {
                    playerStats[playerAuth].owngoals = (playerStats[playerAuth].owngoals || 0) + 1;
                }
                room.setPlayerDiscProperties(scorer.id, { radius: playerRadius - 5 });
                room.setPlayerAvatar(scorer.id, '🤡');
                resetSize(scorer);
                resetAvatar(scorer);
            } else {
                let assisterName = null;
                if (assister && assister.id !== scorer.id && assister.team === team) {
                    assisterName = assister.name;
                    const assisterAuth = playerId[assister.id];
                    const update = players >= 8;
                    let mensajesAsistencia = [
                        `👟🧙‍♂️ PASE MÁGICO DE ${assister.name}.🧙‍♂️`,
                        `👟🧙‍♂️ MAGISTRAL PASE DE ${assister.name}.🎩`,
                        `👟🧙‍♂️ TREMENDO PASE DE ${assister.name}.🎩`,
                        `👟🧙‍♂️ QUÉ ASISTE ${assister.name}.🧙‍♂️`,
                        `👟🧙‍♂️ ASISTENCIA PERFECTA DE ${assister.name}.🎩`,
                        `👟🧙‍♂️ CON PASE GOL DE ${assister.name}.👏`,
                        `👟🧙‍♂️ FELICITEN AL ASISTIDOR: PASE DE ${assister.name}.👏`,
                        `👟🧙‍♂️ APLAUDAN EL GRAN PASE DEL PANDITA ${assister.name}.👏`,
                        `👟🧙‍♂️ UUFFF, QUÉ PASE DEL PANDITA ${assister.name}.👏`,
                        `👟🧙‍♂️ ASISTENCIA DE ${assister.name}.👏`,
                        `👟🧙‍♂️ ASISTENCIA ESPECTACULAR DE ${assister.name}.👏`,
                        `👟🧙‍♂️ LOCURA DE ASISTENCIA DE ${assister.name}.🤩`,
                        `👟🧙‍♂️ QUÉ CENTRO DE ${assister.name}.🤩`,
                        `👟🧙‍♂️ HERMOSO PASE DEL PANDITA ${assister.name}.🎩`,
                        `👟🧙‍♂️ PASESON DEL PANDITA ${assister.name}.🎩`,
                        `👟🧙‍♂️ UNA BELLEZA DE PASE DE ${assister.name}.🎩`,
                        `👟🧙‍♂️ ASISTENCIA MÁGICA DE ${assister.name}.🧙‍♂️`
                    ];

                    let asistenciaRandom = mensajesAsistencia[Math.floor(Math.random() * mensajesAsistencia.length)];
                    room.sendAnnouncement(asistenciaRandom, null, 0xb371ea, "bold", 1);
                    if (update && playerStats[assisterAuth] && playerStats[assisterAuth].verified) {
                        playerStats[assisterAuth].assists = (playerStats[assisterAuth].assists || 0) + 1;
                        playerStats[assisterAuth].xp = (playerStats[assisterAuth].xp || 0) + 1;
                        assists[assister.id]++;
                    }
                    room.setPlayerDiscProperties(assister.id, { radius: 20 });
                    room.setPlayerAvatar(assister.id, '👟');
                    resetSize(assister);
                    resetAvatar(assister);
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

                if (festejoMessage[playerAuth] && festejoMessage[playerAuth].mensaje) {
                    const mensajeFinal = festejoMessage[playerAuth].mensaje.replace('{s}', scorer.name);
                    room.sendAnnouncement(mensajeFinal, null, 0xf641ff, "bold", 1);
                } else {
                    let mensajesGol = [
                        `⚽🐼 QUÉ DEFINE EL PANDITA, GOL DE ${scorer.name}!🐼⚽`,
                        `⚽🐼 GOOOOLL, LO HIZO ${scorer.name}!🐼⚽`,
                        `⚽🐼 ¿QUIÉN MÁS SINO? GOL DE ${scorer.name}!🐼⚽`,
                        `⚽🐼 QUÉ GOLAZO ACABA DE HACER ${scorer.name}!🐼⚽`,
                        `⚽🐼 ¡¡¡PERO QUÉ CLAVA!!!, GOLÓN DE ${scorer.name}!🐼⚽`,
                        `⚽🐼 UFFF, APARECIÓ ${scorer.name} PARA MANDARLA ADENTRO!🐼⚽`,
                        `⚽🐼 QUÉ FUNDE ${scorer.name}?? GOLAZO!🐼⚽`,
                        `⚽🐼 DEFINICIÓN CON CLASE, GOL DE ${scorer.name}!🐼⚽`,
                        `⚽🐼 GOL DEL PANDITA ${scorer.name}!🐼⚽`,
                        `⚽🐼 HERMOSO GOL DE ${scorer.name}!🐼⚽`,
                        `⚽🐼 TREMENDO GOL DEL PANDITA ${scorer.name}!🐼⚽`,
                        `⚽🐼 GOL DE ${scorer.name}!🐼⚽`,
                        `⚽🐼 GOLON DEL PANDITA ${scorer.name}!🐼⚽`,
                        `⚽🐼 PERO QUÉ GOLAZO HIZO ${scorer.name}!🐼⚽`,
                        `⚽🐼 GOOOOOOOOOOOOOOOOOOL DE ${scorer.name}!🐼⚽`,
                        `⚽🐼 LA BOMBA QUÉ DIO ${scorer.name} ES DE ADMIRAR!🐼⚽`,
                        `⚽🐼 SACALA GK, GOLAZO DE ${scorer.name}!🐼⚽`
                    ];

                    let golRandom = mensajesGol[Math.floor(Math.random() * mensajesGol.length)];
                    room.sendAnnouncement(golRandom, null, 0xf641ff, "bold", 1);
                }

                if (updateStats && playerStats[playerAuth] && playerStats[playerAuth].verified) {
                    playerStats[playerAuth].goals = (playerStats[playerAuth].goals || 0) + 1;
                    playerStats[playerAuth].xp = (playerStats[playerAuth].xp || 0) + 1;
                    goals[scorer.id] += 1;
                }
                room.setPlayerDiscProperties(scorer.id, { radius: playerRadius * 2 });
                room.setPlayerAvatar(scorer.id, '⚽');
                resetSize(scorer);
                resetAvatar(scorer);
                explosionEffect(room.getBallPosition().x, room.getBallPosition().y);
            }

            if (team === 1) {
                Marcador.Red++;
                room.setDiscProperties(0, { color: 0xFF0000, radius: 6.25 * 3 });
            } else if (team === 2) {
                Marcador.Blue++;
                room.setDiscProperties(0, { color: 0x0000FF, radius: 6.25 * 3 });
            }

            // if (players === 1) {
            //     room.stopGame();
            //     room.startGame();
            // }

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

                betActive[player.id] = false;
            });

            setTimeout(() => {
                if (players.length >= 2) {
                    shuffleTeams();
                    Object.keys(afkPlayers).forEach(playerId => {
                        room.setPlayerTeam(playerId, 0);
                    });
                }
            }, 3000);

            setTimeout(() => {
                room.startGame();
            }, 5000);
            clearTimeout(chaosModeTimer);
            updateMaps();
            room.stopRecording();
            isGameStart = false;
            remainingTime = 30000;
            lastPlayerTouchBall = null;
            secondPlayerTouchBall = null;
            powerActive = false;
            ballHeldBy = null;
            maxTouches = 0;
            bigUses = 0;
            smallUses = 0;
            gravityEnabled = false;
            betCooldownActive = false;
            chaosModeActive = true;
            offsideActive = false;
            bolapor = null;
            powerEnabled = false;
            gkred = [], gkblue = [];
            bets = {};
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

                room.setPlayerAvatar(byPlayer.id, null);
            }

            if (powerIncreaseInterval) {
                clearInterval(powerIncreaseInterval);
                powerIncreaseInterval = null;
            }

            if (gravityTimer) {
                clearInterval(gravityTimer);
                gravityTimer = null;
            }

            goals = Object.fromEntries(Object.keys(goals).map(playerId => [playerId, 0]));
            assists = Object.fromEntries(Object.keys(assists).map(playerId => [playerId, 0]));
        };

        room.onGameStart = (byPlayer) => {
            changeColors();
            isGameStart = true;
            chaosModeActive = true;
            mathActive = false;
            room.startRecording();
            if (byPlayer != null) {
                activities[byPlayer.id] = Date.now();
                if (warnedPlayers[byPlayer.id]) {
                    clearTimeout(warnedPlayers[byPlayer.id]);
                    delete warnedPlayers[byPlayer.id];
                }

                const byPlayerAuth = playerId[byPlayer.id];

                if (!rolesData.roles["vips"]?.users.includes(byPlayerAuth)) {
                    Object.keys(playerSizes).forEach((id) => {
                        if (!rolesData.roles["vips"]?.users.includes(playerId[id])) {
                            delete playerSizes[id];
                        }
                    });
                } else {
                    if (playerSizes[byPlayer.id] !== undefined) {
                        room.setPlayerDiscProperties(byPlayer.id, { radius: playerSizes[byPlayer.id] });
                    }
                }
            }

            if (room.getPlayerList().length >= 6) room.pauseGame(true);

            room.sendAnnouncement(`🐼⚽ ¡Arranca el partido! Las camisetas son: ${team1Name} 🆚 ${team2Name} 🐼⚽`, null, 0xfff6d6, "bold", 2);

            setTimeout(() => {
                room.sendAnnouncement(`🗳️Escribí !changecolors para cambiar las camisetas (por votación).🗳️`, null, null, "bold", 2);
            }, 2000);

            if (room.getPlayerList().length >= 6) {
                setTimeout(() => {
                    room.sendAnnouncement(`Para apostar por un equipo, escribí !bet red/blue [pandacoins]. Tenés 7 segundos.`, null, 0x82d5cb, "bold", 2);
                }, 4000);
            }

            setTimeout(() => {
                startGame();
            }, 6000);

            setTimeout(() => {
                room.pauseGame(false);
            }, 8000);

            if (room.getPlayerList().length >= 6) {
                setTimeout(() => {
                    betCooldownActive = true;
                    room.sendAnnouncement("🐼Apuestas cerradas. ¡Que arranque el partido!🐼", null, 0x56c4b7, "bold", 2);
                }, 14000);
            }
        };

        room.onPlayerKicked = (kickedPlayer, reason, ban, byPlayer) => {
            if (byPlayer != null && kickedPlayer != null) {
                const embed = {
                    title: `Nuevo ${ban ? "baneo" : "kickeo"}`,
                    description: `**Víctima:** ${kickedPlayer.name || "Desconocido"}\n**Por:** ${byPlayer.name || "Desconocido"}\n**Tipo de sanción:** ${ban ? "baneo" : "kick"}\n**Motivo:** ${reason || "No especificado"}`,
                    color: 0xe43e3e,
                    timestamp: new Date(),
                    footer: {
                        text: "Sistema de baneos",
                    },
                };

                axios.post("https://discord.com/api/webhooks/1330244875114905762/4JR1uWMnJqUf4d776DKg41swkaDEcYyYEASuXaQ_rsqV9YgGEO8AUi3qDeLx4FeOXUXX", {
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
                    const playerRole = getPlayerRole(targetAuth);
                    if (targetAuth && !bannedPlayers.some(entry => entry.auth === targetAuth)) {
                        bannedPlayers.push({ name: kickedPlayer.name, auth: targetAuth });
                        if (rolesData.roles[playerRole]) {
                            rolesData.roles[playerRole].users = rolesData.roles[playerRole].users.filter(userAuth => userAuth !== targetAuth);
                            fs.writeFileSync(rolesFilePath, JSON.stringify(rolesData, null, 2));
                        }
                        try {
                            fs.writeFileSync(bannedPlayersFilePath, JSON.stringify(bannedPlayers, null, 2));
                            console.log(`Jugador ${kickedPlayer.name} añadido a la lista de baneos.`);
                        } catch (err) {
                            console.error('Error al escribir el archivo de baneos:', err);
                        }
                    } else if (!targetAuth) {
                        console.error("Error: No se encontró la AUTH para el jugador kickeado.");
                    }
                }
            } // te amoooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo
        };

        room.onStadiumChange = function (newStadiumName, byPlayer) {
            if (byPlayer != null) {
                activities[byPlayer.id] = Date.now();
                if (warnedPlayers[byPlayer.id]) {
                    clearTimeout(warnedPlayers[byPlayer.id]);
                    delete warnedPlayers[byPlayer.id];
                }
            }

            const maps = {
                "Panda x3 v2 by sanTos": mapaX3,
                "Panda x5 v2 by sanTos": mapaX5,
                "Panda x7 v2 by sanTos": mapaX7
            };

            if (!maps[newStadiumName]) {
                const selectedMap = x3Active ? mapaX3 : x5Active ? mapaX5 : x7Active ? mapaX7 : null;
                if (selectedMap) {
                    room.setCustomStadium(selectedMap);
                }
            }
        };

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
        };

        room.onPlayerActivity = function (player) {
            activities[player.id] = Date.now();
            if (warnedPlayers[player.id]) {
                clearTimeout(warnedPlayers[player.id]);
                delete warnedPlayers[player.id];
            }
        };

        room.onGameUnpause = function (byPlayer) {
            isGamePaused = false;
            if (byPlayer != null) {
                activities[byPlayer.id] = Date.now();
                if (warnedPlayers[byPlayer.id]) {
                    clearTimeout(warnedPlayers[byPlayer.id]);
                    delete warnedPlayers[byPlayer.id];
                }
            }

            if (room.getPlayerList().length >= 4 && lastMode) {
                if (chaosModeTimer) {
                    clearTimeout(chaosModeTimer);
                }
                resetChaosMode(lastMode);
                room.sendAnnouncement(`¡MODO ${lastMode} TERMINADO!`, null, null, "bold", 2);
                room.sendAnnouncement("▶️ ¡MODO CAOS REANUDADO!", null, 0x00FF00, "bold", 2);
            }
        }

        room.onGamePause = function (byPlayer) {
            isGamePaused = true;
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
                room.sendAnnouncement("⏸️ ¡MODO CAOS PAUSADO!", null, 0xFFFF00, "bold", 2);
            }
        }

        room.onGameTick = () => {
            handleAfkPlayers();
            kickAFKs();

            const ball = room.getDiscProperties(0);
            if (!ball) return;

            // let JMAP = x5Active ? JSON.parse(mapaX5) : x7Active ? JSON.parse(mapaX7) : null;

            if (ball.x === 0 && ball.y === 0) return;

            if (!x3Active && offsideActive) {
                if (isInProccesOffside) {
                    const forceField = room.getDiscProperties(5);
                    if (!forceField) return;

                    const distance = pointDistance(ball.x, ball.y, forceField.x, forceField.y);
                    const offsidePlayer = lastBallTouch;
                    if (!offsidePlayer) return;

                    // Si la pelota sale del radio del forceField y NO fue pateada, devolverla
                    if (distance > forceField.radius && !ballWasKicked && forceField.radius >= 150) {
                        room.setDiscProperties(0, {
                            x: forceField.x,
                            y: forceField.y,
                            xspeed: 0,
                            yspeed: 0,
                            color: 0xFFA07A
                        });

                        powerLevel = -1;
                        gravityActive = false;
                        ballWasKicked = false;
                        clearInterval(gravityTimer);
                        gravityTimer = null;
                    }

                    // Si la pelota sale del radio del forceField y FUE pateada, terminar el offside
                    else if (distance > forceField.radius && ballWasKicked && forceField.radius >= 150) {
                        disableForceField();
                    }
                }
                checkOffSide();
            }
        };

        room.onTeamVictory = (scores) => {
            RecSistem.sendDiscordWebhook();
            const winningTeam = scores.red > scores.blue ? 1 : 2;
            const defeatTeam = winningTeam === 1 ? 2 : 1;
            const players = room.getPlayerList().filter(p => p.team !== 0);
            const updateStats = room.getPlayerList().length >= 8;

            players.forEach((player) => {
                const playerAuth = playerId[player.id];

                if (playerStats[playerAuth].pandacoins < 0) {
                    playerStats[playerAuth].pandacoins = 0;
                }

                if (updateStats) {
                    if (playerStats[playerAuth] && playerStats[playerAuth].verified) {
                        if (player.team === winningTeam) {
                            playerStats[playerAuth].victories = (playerStats[playerAuth].victories || 0) + 1;
                            playerStats[playerAuth].xp = (playerStats[playerAuth].xp || 0) + 10;
                            playerStats[playerAuth].pandacoins = (playerStats[playerAuth].pandacoins || 0) + 20;
                        } else if (player.team === defeatTeam) {
                            playerStats[playerAuth].defeats = (playerStats[playerAuth].defeats || 0) + 1;
                            playerStats[playerAuth].xp = (playerStats[playerAuth].xp || 0) - 6;
                            playerStats[playerAuth].pandacoins = (playerStats[playerAuth].pandacoins || 0) - 0;
                        }

                        if (playerStats[playerAuth].xp < 0) {
                            playerStats[playerAuth].xp = 0;
                        }

                        playerStats[playerAuth].games = (playerStats[playerAuth].games || 0) + 1;

                        if (playerStats[playerAuth].games >= 250) {
                            const victories = playerStats[playerAuth].victories || 0;
                            let winrate = (victories / playerStats[playerAuth].games) * 100;

                            if (winrate > 100) {
                                winrate = 100;
                            } else if (winrate < 0) {
                                winrate = 0;
                            }

                            playerStats[playerAuth].winrate = winrate.toFixed(2);
                        } else {
                            playerStats[playerAuth].winrate = 0;
                        }

                        const gkredPlayer = gkred.find(gk => playerId[gk.id] === playerAuth);
                        const gkbluePlayer = gkblue.find(gk => playerId[gk.id] === playerAuth);

                        if (scores.blue === 0 && gkredPlayer) {
                            playerStats[playerAuth].vallas = (playerStats[playerAuth].vallas || 0) + 1;
                            playerStats[playerAuth].xp = (playerStats[playerAuth].xp || 0) + 10;
                            playerStats[playerAuth].pandacoins = (playerStats[playerAuth].pandacoins || 0) + 15;
                        } else if (scores.red === 0 && gkbluePlayer) {
                            playerStats[playerAuth].vallas = (playerStats[playerAuth].vallas || 0) + 1;
                            playerStats[playerAuth].xp = (playerStats[playerAuth].xp || 0) + 10;
                            playerStats[playerAuth].pandacoins = (playerStats[playerAuth].pandacoins || 0) + 15;
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

            const playerVerified = Object.keys(playerStats).some((auth) => playerStats[auth].verified);

            if (updateStats && playerVerified) {
                let mvpId = null;
                let maxGoals = -1;
                let maxAssists = -1;

                players.forEach(player => {
                    const playerId = player.id;
                    const playerGoals = goals[playerId] || 0;
                    const playerAssists = assists[playerId] || 0;

                    if ((playerGoals > maxGoals) || (playerGoals === maxGoals && playerAssists > maxAssists)) {
                        mvpId = playerId;
                        maxGoals = playerGoals;
                        maxAssists = playerAssists;
                    }
                });

                if (mvpId) {
                    const mvpPlayer = room.getPlayer(mvpId);
                    const mvpAuth = playerId[mvpId];
                    const mvpGoals = goals[mvpId] || 0;
                    const mvpAssists = assists[mvpId] || 0;

                    playerStats[mvpAuth].pandacoins = (playerStats[mvpAuth].pandacoins || 0) + 12;
                    room.sendAnnouncement(
                        `🏆🐼 PANDITA MVP del partido es: ${mvpPlayer.name} 🥇\nGoles: ${mvpGoals}, Asistencias: ${mvpAssists}`,
                        null,
                        0xfffca5,
                        "bold",
                        2
                    );
                } else {
                    room.sendAnnouncement("No se pudo determinar el MVP.", null, 0xFF0000, "bold", 1);
                }
            }

            players.forEach(player => {
                const playerAuth = playerId[player.id];
                const betData = bets[playerAuth];

                if (betData) {
                    const { team, betAmount } = betData;

                    if (team === winningTeam) {
                        const winnings = betAmount * 2;
                        playerStats[playerAuth].pandacoins = (playerStats[playerAuth].pandacoins || 0) + winnings;
                        room.sendAnnouncement(`🤑💰 ${player.name} ganó ${winnings} pandacoins apostando por ${team === 1 ? "RED" : "BLUE"} 💰🤑`, null, 0xa7fa80, "small-bold", 2);
                    } else {
                        playerStats[playerAuth].pandacoins = (playerStats[playerAuth].pandacoins || 0) - betAmount;
                        room.sendAnnouncement(`😭💸 ${player.name} perdió su apuesta de ${betAmount} pandacoins por apostarle al ${team === 1 ? "RED" : "BLUE"} 💸😭`, null, 0xd6486f, "small-bold", 2);
                    }
                }
            });

            const winningPlayers = players.filter(player => player.team === winningTeam);
            const losingPlayers = players.filter(player => player.team === defeatTeam);

            winningPlayers.forEach(winningPlayer => {
                const playerIde = winningPlayer.id;
                const playerName = winningPlayer.name;

                streakWinning[playerIde]++;

                winnerTeam.counter = streakWinning[playerIde];
                winnerTeam.playerName = playerName;

                if (streakWinning[playerIde] >= 3) {
                    room.sendAnnouncement(`¡🔥 ${winnerTeam.playerName} ESTÁ DE RACHA! Lleva un win-streak de ${winnerTeam.counter} partidos! 🔥`, null, 0xE6D99E, "bold", 2);
                }
            });

            losingPlayers.forEach(losingPlayer => {
                const playerIde = losingPlayer.id;
                const playerName = losingPlayer.name;

                ripTeam.playerName = playerName;

                if (streakWinning[playerIde] > 1) {
                    room.sendAnnouncement(`❌ Terminó la racha de ${ripTeam.playerName}. Llevaba ganando ${streakWinning[playerIde]} partidos seguidos.`, null, 0xffa54a, "normal", 2);
                    delete streakWinning[playerIde];
                }
            });
        };

        room.onPlayerChat = (player, message) => {
            changeAvatar(player, message);
            activities[player.id] = Date.now();
            if (warnedPlayers[player.id]) {
                clearTimeout(warnedPlayers[player.id]);
                delete warnedPlayers[player.id];
            }

            const playerAuth = playerId[player.id];
            const playerRole = getPlayerRole(playerAuth);

            if (mathActive && Math.abs(parseFloat(message) - parseFloat(currentAnswer)) < 0.01 && playerStats[playerAuth].verified) {
                if (playerStats) playerStats[playerAuth].pandacoins += 5;
                room.sendAnnouncement(`¡🎉 EL PANDITA ${player.name} ACERTÓ LA RESPUESTA CORRECTA Y GANO 5 PANDACOINS. FELICITACIONES!`, null, 0x8ad2aa, "bold", 2);
                mathActive = false;
            }

            if (
                !message.startsWith("!") &&
                !message.includes("@everyone") &&
                !message.includes("@here") &&
                !/(https?:\/\/|www\.)/i.test(message)
            ) {
                // setTimeout(() => {
                //     sendMessages(`${player.name}: ${message}`);
                // }, 2000);
            } else {
                if (message.trim() === "!") {
                    room.sendAnnouncement("No puedes usar solo `!` como comando.", player.id, 0xFF0000, "bold", 2);
                    return false;
                }

                const now = Date.now();
                const cooldownTime = 3000;
                const lastUsed = cooldown[player.id] || 0

                if (now - lastUsed < cooldownTime) {
                    const timeLeft = Math.ceil((cooldownTime - (now - lastUsed)) / 1000);
                    room.sendAnnouncement(`Debes esperar ${timeLeft} segundos antes de volver a usar otro comando.`, player.id, 0xFF0000, "bold", 2);
                    return false;
                }

                cooldown[player.id] = now;
            }

            if (message.startsWith("!sancionar")) {
                if (rolesData.roles[playerRole]?.gameAdmin === true) {
                    const args = message.split(' ');
                    const idPlayer = args[1] ? parseInt(args[1].replace("#", "")) : null;
                    const reason = args.slice(2).join(' ').trim();

                    if (isNaN(idPlayer)) {
                        room.sendAnnouncement("Debes proporcionar un ID de jugador válido.", player.id, 0xFF0000);
                        return false;
                    }

                    const playerList = room.getPlayerList();
                    const targetPlayer = playerList.find(p => p.id === idPlayer);

                    if (!targetPlayer) {
                        room.sendAnnouncement("Jugador no encontrado.", player.id, 0xFF0000);
                        return false;
                    }

                    const targetAuth = playerId[targetPlayer.id];

                    if (!targetAuth) {
                        room.sendAnnouncement("No se pudo obtener el auth del jugador.", player.id, 0xFF0000);
                        return false;
                    }

                    if (!reason) {
                        room.sendAnnouncement("Debes proporcionar una razón para la sanción.", player.id, 0xFF0000);
                        return false;
                    }

                    if (targetPlayer.id === player.id) {
                        room.sendAnnouncement("No puedes sancionarte a ti mismo.", player.id, 0xFF0000);
                        return false;
                    }

                    playerStats[targetAuth].sanciones = (playerStats[targetAuth].sanciones || 0) + 1;

                    if (playerStats[targetAuth].sanciones >= 3) {
                        if (!bannedPlayers.some(entry => entry.auth === targetAuth)) {
                            bannedPlayers.push({ name: targetPlayer.name, auth: targetAuth, reason: reason });
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
                            description: `** Víctima:** ${targetPlayer.name}\n ** Sancionado por:** ${player.name}\n ** Razón:** ${reason}\n ** Sanciones:** ${playerStats[targetAuth].sanciones} / 3`,
                            color: 0x00FF00,
                            timestamp: new Date(),
                            footer: {
                                text: "Sistema de Sanciones",
                            },
                        };

                        axios.post("https://discord.com/api/webhooks/1330244875114905762/4JR1uWMnJqUf4d776DKg41swkaDEcYyYEASuXaQ_rsqV9YgGEO8AUi3qDeLx4FeOXUXX", {
                            content: null,
                            embeds: [embed],
                        })
                            .then(() => console.log("Webhook enviado con éxito"))
                            .catch(err => console.error("No se pudo enviar el webhook", err));

                        room.sendAnnouncement(`${targetPlayer.name} sancionado por ${player.name}.Razón: ${reason}\nSanciones: ${playerStats[targetAuth].sanciones} / 3`, null, 0xFFFF00);

                        try {
                            fs.writeFileSync(playersFilePath, JSON.stringify(playerStats, null, 2));
                        } catch (err) {
                            console.error('Error al escribir el archivo de jugadores:', err);
                        }
                    }
                } else {
                    room.sendAnnouncement(`[❌]${player.name}, no tienes permitido usar este comando.`, player.id, 0xFF0000, "bold", 2);
                }
                return false;
            } else if (message === "!me") {
                if (playerStats[playerAuth]) {
                    room.sendAnnouncement(`🐼Pandita, esta es tu UUID: ${playerStats[playerAuth].uuid}\n`, player.id, 0xdbdf4e, "bold", 2);

                    if (playerStats[playerAuth].verified) {
                        room.sendAnnouncement(`🐼CODIGO DE RECUPERACIÓN: ${playerStats[playerAuth].recoveryCode}`, player.id, 0xfcff99, "bold", 2);

                        const playerXp = playerStats[playerAuth].xp || 0;
                        const { currentRank, nextRank, xpRemaining } = getRankAndXpRemaining(playerXp);

                        const stats = `1. Partidos ❯❯ 🎮PJ: ${playerStats[playerAuth].games || 0}   •   🏆PG: ${playerStats[playerAuth].victories || 0}(${(playerStats[playerAuth].winrate || 0)}%)   •   📉PP: ${playerStats[playerAuth].defeats || 0} \n` +
                            `2. Individual ❯❯ ⚽Gᴏʟᴇs: ${playerStats[playerAuth].goals || 0}  •  👟Aꜱɪꜱᴛᴇɴᴄɪᴀꜱ: ${playerStats[playerAuth].assists || 0}  •  🤦‍♂️Aᴜᴛᴏɢᴏʟᴇꜱ: ${playerStats[playerAuth].owngoals || 0}  •  🧤Vᴀʟʟᴀꜱ: ${playerStats[playerAuth].vallas || 0}  • ⚠️Sanciones: ${playerStats[playerAuth].sanciones || 0} • 🎋XP: ${playerXp} | XP restante para llegar al rango "${nextRank ? nextRank : 'Máximo'}": ${xpRemaining || 0}`;

                        room.sendAnnouncement(stats, player.id, 0xE37A11, "small-bold", 2);
                    } else {
                        room.sendAnnouncement(`No puedes ver tus datos si no estás verificado. Escribí !verificar.`, player.id, 0xFF0000, "bold", 2);
                    }

                    fs.writeFileSync(playersFilePath, JSON.stringify(playerStats, null, 2));
                } else {
                    room.sendAnnouncement(`No estás registrado en el sistema.`, player.id, 0xFF0000, "bold", 2);
                }

                return false;
            } else if (message.startsWith("!agregar")) {
                if (rolesData.roles["maestropanda"].users.includes(playerAuth) || rolesData.roles["jefepanda"].users.includes(playerAuth) || rolesData.roles["granpanda"].users.includes(playerAuth) || rolesData.roles["coowner"].users.includes(playerAuth) || rolesData.roles["owner"].users.includes(playerAuth)) {
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
                                    if (roleData.users.includes(targetAuth) && !rolesData.roles["vips"]?.users.includes(targetAuth)) {
                                        roleData.users = roleData.users.filter(auth => auth !== targetAuth);
                                    }
                                });

                                if (rolesData.roles[lowerCaseRole].users.includes(targetAuth)) {
                                    room.sendAnnouncement(`El jugador ya tiene el rol ${rol}.`, player.id, 0xFF0000);
                                } else {
                                    rolesData.roles[lowerCaseRole].users.push(targetAuth);
                                    room.sendAnnouncement(`El rol ${rol} ha sido asignado a ${targetPlayer.name}.`, player.id, 0xff7bff, "normal", 1);
                                    room.sendAnnouncement(`El jugador ${targetPlayer.name} ha sido promovido al rol ${rol}`, null, 0xf300ff, "bold", 2);

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
                        room.sendAnnouncement(`✅👍 POWER ACTIVADO POR ${player.name}`, null, 0xff7bb5, "bold", 2);
                        bolapor = null;
                        gravityActive = false;
                        offsideActive = false;
                        powerLevel = -1;
                        gravityEnabled = false;
                        room.setDiscProperties(0, { color: NORMAL_BALL_COLOR });
                        if (gravityTimer) {
                            clearInterval(gravityTimer);
                            gravityTimer = null;
                        }
                    } else {
                        room.sendAnnouncement(`❌👎 POWER DESACTIVADO POR ${player.name}`, null, 0xd83264, "bold", 2);
                        ballHeldBy = null;
                        powerActive = false;
                        powerLevel = -1;
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
                        room.sendAnnouncement(`✅👍 COMBA ACTIVADA POR ${player.name}`, null, 0xff7bb5, "bold", 2);
                        offsideActive = true;
                        ballHeldBy = null;
                        powerActive = false;
                        powerLevel = -1;
                        powerEnabled = false;
                        room.setDiscProperties(0, { color: NORMAL_BALL_COLOR });
                        if (powerIncreaseInterval) {
                            clearInterval(powerIncreaseInterval);
                            powerIncreaseInterval = null;
                        }
                    } else {
                        room.sendAnnouncement(`❌👎 COMBA DESACTIVADA POR ${player.name}`, null, 0xd83264, "bold", 2);
                        bolapor = null;
                        gravityActive = false;
                        offsideActive = false;
                        powerLevel = -1;
                        room.setDiscProperties(0, { color: NORMAL_BALL_COLOR });

                        if (gravityTimer) {
                            clearInterval(gravityTimer);
                            gravityTimer = null;
                        }
                    }
                } else {
                    room.sendAnnouncement(`[❌] ${player.name}, no tienes permitido usar este comando.`, player.id, 0xFF0000, "bold", 2);
                }
                return false;
            } else if (message === "!gk") {
                if (playerStats[playerAuth]) {
                    if (!playerStats[playerAuth].verified) {
                        room.sendAnnouncement("Necesitas estar verificado para usar este comando", player.id, 0xFF0000, "bold", 2);
                        return false;
                    } else {
                        if (room.getScores() !== null) {
                            if (room.getPlayerList().length < 6) {
                                room.sendAnnouncement("No hay 6 jugadores para usar este comando", player.id, 0xFF0000);
                            } else {
                                if (player.team === 1) {
                                    let index = gkred.findIndex(gk => gk.auth === playerAuth);
                                    if (index !== -1) {
                                        gkred.splice(index, 1);
                                        room.sendAnnouncement(`${player.name} ya NO es el GK del RED.🧤❌`, null, 0xffabbc, "bold", 1);
                                        room.setPlayerAvatar(player.id, "🧤");
                                    } else {
                                        if (gkred.length > 0) {
                                            room.sendAnnouncement(`🧤🥅 Ya hay un GK en el equipo rojo: ${gkred[0].name}`, player.id, 0xffabbc);
                                            return false;
                                        }
                                        gkred.push({ auth: playerAuth, id: player.id, name: player.name });
                                        room.sendAnnouncement(`${player.name} ahora es el GK del equipo rojo 🧤🥅`, null, 0xee728b, "bold", 1);
                                        room.setPlayerAvatar(player.id, "🧤");
                                    }
                                } else if (player.team === 2) {
                                    let index = gkblue.findIndex(gk => gk.auth === playerAuth);
                                    if (index !== -1) {
                                        gkblue.splice(index, 1);
                                        room.sendAnnouncement(`${player.name} ya NO es el GK del BLUE. 🧤❌`, null, 0x8ea7ff, "bold", 1);
                                        room.setPlayerAvatar(player.id, null);
                                    } else {
                                        if (gkblue.length > 0) {
                                            room.sendAnnouncement(`🧤🥅 Ya hay un GK en el equipo azul: ${gkblue[0].name}`, player.id, 0x8ea7ff);
                                            return false;
                                        }

                                        gkblue.push({ auth: playerAuth, id: player.id, name: player.name });
                                        room.sendAnnouncement(`${player.name} ahora es el GK del equipo azul 🧤🥅`, null, 0x4669e7, "bold", 1);
                                        room.setPlayerAvatar(player.id, "🧤");
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
                    if (!playerStats[playerAuth].verified) {
                        room.sendAnnouncement("Necesitas estar verificado para usar este comando", player.id, 0xFF0000, "bold", 2);
                    } else {
                        room.sendAnnouncement(`🐼 Comandos Panditas 🐼\n` +
                            `📝 CUENTA: !verificar - !me - !pandacoins - !recuperar [codigo] (lo ves en !me)\n` +
                            `📊 STATS: !stats #ID - !top [ranking]\n` +
                            `💬 SOCIAL: !ds / !dc / !discord - !llamaradmin RAZON y NOMBRE user reportado.\n` +
                            `💵 TIENDA: !tienda / !shop - !ruleta cantidad - !bet team cantidad - !dar [pandacoins] [#idusuario].\n` +
                            `⚽ JUEGO: !gk - !nv / !bb - !modos / !modo - !changecolors - !afk - !ksk (solo vips) - !gks`,
                            player.id, 0x84e35a, "small-bold", 1);

                        if (player.admin) {
                            room.sendAnnouncement(`🔨 Comandos  Staff 🔨\n` +
                                `⚠️ Moderación: !sancionar #ID [razón] - !unban [@jugador] - !quitarsancion #ID - !banauth [auth]\n` +
                                `🛠️ Gestión: !agregar [rol] [@jugador] - !power - !comba`,
                                player.id, 0x63d033, "small-bold", 1);
                        }
                    }
                }
                return false;
            } else if (message.startsWith("!top")) {
                const args = message.split(' ');
                const action = args[1];

                const sortedPlayers = (key) => {
                    return Object.values(playerStats)
                        .filter(player => player.games >= 20)
                        .sort((a, b) => b[key] - a[key])
                        .map(player => ({
                            name: player.name,
                            value: player[key],
                        }));
                };

                const generateAnnouncement = (topPlayers, title) => {
                    let announcement = `${title}:\n`;
                    topPlayers.forEach((player, index) => {
                        announcement += `${index + 1}. ${player.name}: ${player.value}\n`;
                    });
                    return announcement;
                };

                let announcement = "";

                switch (action) {
                    case "vallas":
                        announcement = generateAnnouncement(sortedPlayers("vallas").slice(0, 5), "🧤🥅Ranking de Vallas Invictas🧤🥅");
                        break;
                    case "goles":
                        announcement = generateAnnouncement(sortedPlayers("goals").slice(0, 5), "⚽Ranking de Goles⚽");
                        break;
                    case "victorias":
                        announcement = generateAnnouncement(sortedPlayers("victories").slice(0, 5), "✅Ranking de Victorias✅");
                        break;
                    case "asistencias":
                        announcement = generateAnnouncement(sortedPlayers("assists").slice(0, 5), "👟🧙‍♂️Ranking de Asistencias👟🧙‍♂️");
                        break;
                    case "juegos":
                        announcement = generateAnnouncement(sortedPlayers("games").slice(0, 5), "🎋Ranking de Juegos🎋");
                        break;
                    case "winrate":
                        announcement = generateAnnouncement(sortedPlayers("winrate").slice(0, 5), "💪Ranking de Winrate💪");
                        break;
                    case "xp":
                        announcement = generateAnnouncement(sortedPlayers("xp").slice(0, 5), "🐼Ranking de Xp🐼");
                        break;
                    default:
                        room.sendAnnouncement(`Ese ranking NO existe❌. Los que existen son: !top vallas; !top goles; !top victorias; !top asistencias; !top juegos, !top xp y !top winrate.`, player.id, 0xe48729, "bold", 2);
                        return false;
                }

                room.sendAnnouncement(announcement, player.id, null, "bold", 2);
                return false;
            } else if (message.startsWith("!unban")) {
                if (rolesData.roles[playerRole]?.gameAdmin === true) {
                    const args = message.split(' ');
                    const name = args.slice(1).join(' ').replace(/_/g, " ").trim().toLowerCase();

                    if (!name) {
                        room.sendAnnouncement("Debes proporcionar un nombre válido.", player.id, 0xFF0000);
                    } else {
                        const index = bannedPlayers.findIndex(entry => entry.name.toLowerCase() === name);

                        if (index !== -1) {
                            const unbannedPlayer = bannedPlayers[index].name;
                            bannedPlayers.splice(index, 1);
                            try {
                                fs.writeFileSync(bannedPlayersFilePath, JSON.stringify(bannedPlayers, null, 2));
                                room.sendAnnouncement(`${unbannedPlayer} ha sido desbaneado.`, null, 0xb6d1aa);
                            } catch (err) {
                                console.error('Error al escribir el archivo de baneos:', err);
                            }
                        } else {
                            room.sendAnnouncement(`${name} no está baneado.`, player.id, 0xFFFF00);
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
                    const idPlayer = args[1] ? parseInt(args[1].replace("#", "")) : null;

                    if (isNaN(idPlayer)) {
                        room.sendAnnouncement("Debes proporcionar un ID válido.", player.id, 0xFF0000);
                        return false;
                    }

                    const playerList = room.getPlayerList();
                    const targetPlayer = playerList.find(p => p.id === idPlayer);

                    if (!targetPlayer) {
                        room.sendAnnouncement(`El jugador con ID #${idPlayer} no existe o no está en la sala.`, player.id, 0xFF0000);
                        return false;
                    }

                    const targetAuth = playerId[targetPlayer.id]

                    if (!targetAuth) {
                        room.sendAnnouncement(`No se encontró al jugador con ID #${idPlayer}.`, player.id, 0xFF0000);
                        return false;
                    }

                    if (targetPlayer.id === player.id) {
                        room.sendAnnouncement("No puedes quitarte sanciones a ti mismo.", player.id, 0xFF0000);
                        return false;
                    }

                    if (playerStats[targetAuth] && playerStats[targetAuth].sanciones > 0) {
                        playerStats[targetAuth].sanciones--;

                        try {
                            fs.writeFileSync(playersFilePath, JSON.stringify(playerStats, null, 2));

                            room.sendAnnouncement(`A ${targetPlayer.name} le sacaron una sanción.`, null, 0xb2e19d, "bold", 2);
                        } catch (err) {
                            console.error('Error al escribir el archivo de jugadores:', err);
                        }
                    } else {
                        room.sendAnnouncement(`${targetPlayer.name} NO tiene sanciones.`, player.id, 0xFFFF00, "bold", 2);
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
                    if (!playerStats[playerAuth].verified) {
                        room.sendAnnouncement("Necesitas estar verificado para usar este comando", player.id, 0xFF0000, "bold", 2);
                    } else {
                        const args = message.split(' ');
                        const reason = args.slice(1).join(' ').trim();

                        if (!reason) {
                            room.sendAnnouncement("Debes proporcionar una razon", player.id, 0xFF0000, "bold", 2);
                            return false;
                        }

                        room.sendAnnouncement("Llamaste al Staff de Panda. Esperá tu respueta y recorda que el mal uso del comando es motivo de sanción.", player.id, 0x00FF00, "bold", 1);
                        axios.post('https://discord.com/api/webhooks/1330572078574862499/9luIZ2o1YmKQageL2Tsgm2-tfm3ZfMWJr-TSmD7RMf1w0Pb2tYvjjat5kMVJC631eUhl', {
                            content: `||@everyone||\n**${player.name}** pide de su ayuda\nRazon: **${reason}**`
                        })
                            .catch(error => {
                                console.error('Error al enviar el mensaje al Discord:', error);
                            });
                    }
                }
                return false;
            } else if (message === "!modo" || message === "!modos") {
                if (playerStats[playerAuth]) {
                    if (!playerStats[playerAuth].verified) {
                        room.sendAnnouncement("Necesitas estar verificado para usar este comando", player.id, 0xFF0000, "bold", 2);
                    } else {
                        let modoJuego;

                        if (gravityEnabled) {
                            modoJuego = "El modo de juego es: Comba (Pelota curvada).";
                        } else if (powerEnabled) {
                            modoJuego = "El modo de juego es: Solo Power";
                        } else {
                            modoJuego = "El modo de juego es: Normal (ningún modo activo).";
                        }

                        room.sendAnnouncement(`Modo de juego actual: ${modoJuego}`, player.id, 0xff7759, "bold", 2);
                    }
                }
                return false;
            } else if (message.startsWith("!stats")) {
                if (playerStats[playerAuth]) {
                    if (!playerStats[playerAuth].verified) {
                        room.sendAnnouncement("Necesitas estar verificado para usar este comando", player.id, 0xFF0000, "bold", 2);
                    } else {
                        const args = message.split(' ');
                        const idPlayer = args[1] ? parseInt(args[1].replace("#", "")) : null;

                        if (isNaN(idPlayer)) {
                            room.sendAnnouncement("Debes proporcionar un ID de jugador válido.", player.id, 0xFF0000);
                            return false;
                        }

                        const playerList = room.getPlayerList();
                        const targetPlayer = playerList.find(p => p.id === idPlayer);

                        if (!targetPlayer) {
                            room.sendAnnouncement(`El jugador con ID #${idPlayer} no existe o no está en la sala.`, player.id, 0xFF0000);
                            return false;
                        }

                        const targetAuth = playerId[targetPlayer.id]

                        if (!targetAuth) {
                            room.sendAnnouncement("No se pudo obtener la autenticación del jugador.", player.id, 0xFF0000);
                            return false;
                        }

                        const stats = playerStats[targetAuth];

                        if (!stats) {
                            room.sendAnnouncement(`No se encontraron estadísticas para el jugador ${targetPlayer.name}.`, player.id, 0xFF0000);
                        } else if (!stats.verified) {
                            room.sendAnnouncement(`El jugador ${targetPlayer.name} no está verificado.`, player.id, 0x00FF00, "bold", 2);
                        } else {
                            room.sendAnnouncement(
                                `🐼🧯 Estadísticas de ${targetPlayer.name}:\nGoles⚽: ${stats.goals || 0},\nAsistencias👟🧙‍♂️: ${stats.assists || 0},\nAutogoles🤦‍♂️: ${stats.owngoals || 0},\nVictorias✅: ${stats.victories || 0},\nDerrotas⛔: ${stats.defeats || 0},\nVallas Invictas🧤: ${stats.vallas || 0},\nPartidos Totales🐼: ${stats.games || 0},\nWin-Rate💪: ${stats.winrate || 0}%\nXP Total🎋: ${stats.xp || 0}\nSanciones⏰: ${stats.sanciones || 0}/3`,
                                player.id,
                                0xea9954,
                                "small-bold",
                                2
                            );
                        }
                    }
                }
                return false;
            } else if (message === "!changecolors") {
                if (playerStats[playerAuth]) {
                    if (!playerStats[playerAuth].verified) {
                        room.sendAnnouncement("Necesitas estar verificado para usar este comando", player.id, 0xFF0000, "bold", 2);
                    } else {
                        if (votedPlayers.includes(player.id)) {
                            room.sendAnnouncement("YA VOTASTE PARA CAMBIAR CAMISETAS, " + player.name + "!", player.id, 0xFF0000);
                            return false;
                        }

                        votedPlayers.push(player.id);
                        votes++;

                        room.sendAnnouncement(player.name + " HA VOTADO PARA CAMBIAR LAS CAMISETAS! VOTOS ACTUALES: " + votes + "/" + requiredVotes);

                        if (votes >= requiredVotes) {
                            room.sendAnnouncement(`¡VOTACIÓN COMPLETADA! SE CAMBIARON LAS CAMISETAS👕🐼.\nAHORA SE JUEGA ${team1Name} vs ${team2Name}`, null, 0x95d138, "bold", 2);
                            changeColors();
                            votes = 0;
                            votedPlayers = [];
                        }
                    }
                }
                return false;

                // tienda inicio
            } else if (message === "!tienda" || message === "!shop") {
                if (playerStats[playerAuth]) {
                    if (!playerStats[playerAuth].verified) {
                        room.sendAnnouncement("Necesitas estar verificado para usar este comando", player.id, 0xFF0000, "bold", 2);
                    } else {
                        room.sendAnnouncement("!color [#hexacolor] - Cambia permanentemente el color de tus mensajes. (5000 pandacoins)", player.id, 0x2fc3ff, "bold", 2);
                        room.sendAnnouncement("!size [tamaño] - Cambia tu tamaño -entre 10 y 20-. Se reinicia al terminar el partido. (800 pandacoins)", player.id, 0x2fc3ff, "bold", 2);
                        room.sendAnnouncement("!bigall - Todos gordos por 30 segs o hasta que metan gol. (800 pandacoins)", player.id, 0x2fc3ff, "bold", 2);
                        room.sendAnnouncement("!smallall - Todos pequeños por 30 segs o hasta que metan gol. (800 pandacoins)", player.id, 0x2fc3ff, "bold", 2);
                        room.sendAnnouncement("!festejo - Personalizá tu festejo al meter un gol -permanente-. (2500 pandacoins)", player.id, 0x2fc3ff, "bold", 2);
                    }
                }
                return false;
            } else if (message === "!pandacoins") {
                if (playerStats[playerAuth]) {
                    if (!playerStats[playerAuth].verified) {
                        room.sendAnnouncement("Necesitas estar verificado para usar este comando", player.id, 0xFF0000, "bold", 2);
                    } else {
                        room.sendAnnouncement(`🐼🎋 ${player.name} esta es tu cantidad de pandacoins: ${playerStats[playerAuth].pandacoins}`, player.id, 0x3afffc, "bold", 2);
                        room.sendAnnouncement(`Los pandacoins se consiguen jugando y/o apostando (!bet - !ruleta)🤑💰.`, player.id, 0x72c1db, "bold", 2);
                    }
                }
                return false;
            } else if (message.startsWith("!color")) {
                if (playerStats[playerAuth]) {
                    if (!playerStats[playerAuth].verified) {
                        room.sendAnnouncement("Necesitas estar verificado para usar este comando", player.id, 0xFF0000, "bold", 2);
                    } else {
                        if (playerStats[playerAuth].pandacoins < 5000) {
                            room.sendAnnouncement(`❌😢No tenés suficientes pandacoins para comprar y usar este comando😢❌.`, player.id, 0x3bb4cb, "bold", 2);
                        } else {
                            const args = message.split(' ');

                            if (args.length < 2) {
                                room.sendAnnouncement("❗❗ Debes especificar un color en formato hexadecimal (ej: 0xFF5733).", player.id, 0xFF0000, "bold", 2);
                                return false;
                            }

                            const color = args[1].trim();
                            const hexColorRegex = /^0x[0-9A-F]{6}$/i;

                            if (!hexColorRegex.test(color)) {
                                room.sendAnnouncement("Agregá un color válido. Podés buscarlos en https://htmlcolorcodes.com/ (ej: 0xFF5733).", player.id, 0x72c1db, "bold", 2);
                                return false;
                            }

                            playerStats[playerAuth].color = color;
                            playerStats[playerAuth].colorVip = color;
                            playerStats[playerAuth].pandacoins -= 5000;
                            room.sendAnnouncement(`🐼🎨 ¡Color cambiado a ${playerStats[playerAuth].color}!`, player.id, 0xacffed, "bold", 2);
                            fs.writeFileSync(playersFilePath, JSON.stringify(playerStats, null, 2));
                        }
                    }
                }
                return false;
            } else if (message.startsWith("!size")) {
                if (playerStats[playerAuth]) {
                    if (!playerStats[playerAuth].verified) {
                        room.sendAnnouncement("Necesitas estar verificado para usar este comando", player.id, 0xFF0000, "bold", 2);
                    } else {
                        if (playerStats[playerAuth].pandacoins < 800) {
                            room.sendAnnouncement(`❌😢No tenés suficientes pandacoins para comprar y usar este comando😢❌.`, player.id, 0x3bb4cb, "bold", 2);
                        } else {
                            const args = message.split(' ');
                            const size = parseInt(args[1]);

                            if (size >= 10 && size <= 20) {
                                playerSizes[player.id] = size;
                                playerStats[playerAuth].pandacoins -= 800;
                                fs.writeFileSync(playersFilePath, JSON.stringify(playerStats, null, 2));
                                room.setPlayerDiscProperties(player.id, { radius: size });
                                room.sendAnnouncement(`🐼🌿 Cambiaste tu tamaño a ${size}.`, player.id, 0xacffed, "bold", 2);
                            } else {
                                room.sendAnnouncement('❗❗ Por favor, elegí un tamaño entre 10 y 20.', player.id, 0x3bb4cb, "bold", 2);
                            }
                        }
                    }
                }
                return false;
            } else if (message.startsWith("!festejo")) {
                if (playerStats[playerAuth]) {
                    if (!playerStats[playerAuth].verified) {
                        room.sendAnnouncement("Necesitas estar verificado para usar este comando", player.id, 0xFF0000, "bold", 2);
                    } else {
                        if (playerStats[playerAuth].pandacoins < 2500) {
                            room.sendAnnouncement(`❌😢No tenés suficientes pandacoins para comprar y usar este comando😢❌.`, player.id, 0x3bb4cb, "bold", 2);
                        } else {
                            const args = message.split(' ');
                            const festejo = args.slice(1).join(' ').trim();

                            if (!festejo) {
                                room.sendAnnouncement('❗❗ Necesitás agregar un festejo! Ejemplo: !festejo metí un golazo.\n\n❗ Si lo quieres con tu nombre, usa: !festejo {s} metí un golazo.', player.id, 0x72c1db, "bold", 2);
                                return false;
                            }

                            const nuevoFestejo = {
                                name: player.name,
                                mensaje: festejo
                            };

                            if (festejoMessage[playerAuth]) {
                                festejoMessage[playerAuth].mensaje = festejo;
                            } else {
                                festejoMessage[playerAuth] = nuevoFestejo;
                            }

                            fs.writeFileSync(messagesFilePath, JSON.stringify(festejoMessage, null, 2));
                            const mensajeFinal = festejo.replace('{s}', player.name);
                            playerStats[playerAuth].pandacoins -= 2500;
                            fs.writeFileSync(playersFilePath, JSON.stringify(playerStats, null, 2));
                            room.sendAnnouncement(`🐼🎉 ¡Festejo actualizado! Tu festejo al meter un gol será: ${mensajeFinal} 🐼🎉`, player.id, 0xacffed, "bold", 2);
                        }
                    }
                }
                return false;
            } else if (message === "!bigall") {
                if (playerStats[playerAuth]) {
                    if (!playerStats[playerAuth].verified) {
                        room.sendAnnouncement("Necesitas estar verificado para usar este comando", player.id, 0xFF0000, "bold", 2);
                    } else {
                        if (playerStats[playerAuth].pandacoins < 800) {
                            room.sendAnnouncement(`❌😢No tenés suficientes pandacoins para comprar y usar este comando😢❌.`, player.id, 0x3bb4cb, "bold", 2);
                        } else {
                            const players = room.getPlayerList();

                            if (players.length >= 4) {
                                chaosModeActive = false;

                                players.forEach(p => {
                                    room.setPlayerDiscProperties(p.id, { radius: playerRadius * 2 });

                                    setTimeout(() => {
                                        chaosModeActive = true;
                                        room.setPlayerDiscProperties(p.id, { radius: playerRadius });

                                        if (playerSizes[p.id]) {
                                            room.setPlayerDiscProperties(p.id, { radius: playerSizes[p.id] });
                                        }
                                    }, 30000);
                                });
                                playerStats[playerAuth].pandacoins -= 800;
                                fs.writeFileSync(playersFilePath, JSON.stringify(playerStats, null, 2));
                                bigUses++;

                                if (bigUses === 3) {
                                    room.sendAnnouncement("Ya se gastaron todos los usos para este comando", player.id, 0xFF0000, "bold", 2);
                                    return false;
                                }

                                room.sendAnnouncement(`🐼🤑😳EL PANDITA ${player.name} USÓ !BIGALL: TODOS GIGANTES😳🤑🐼.`, null, 0xfffa54, "bold", 2);
                            } else {
                                room.sendAnnouncement("No podés usar este comando porque no hay 4 jugadores", player.id, 0xFF0000, "bold", 2);
                            }
                        }
                    }
                }
                return false;
            } else if (message === "!smallall") {
                if (playerStats[playerAuth]) {
                    if (!playerStats[playerAuth].verified) {
                        room.sendAnnouncement("Necesitas estar verificado para usar este comando", player.id, 0xFF0000, "bold", 2);
                    } else {
                        if (playerStats[playerAuth].pandacoins < 800) {
                            room.sendAnnouncement(`❌😢No tenés suficientes pandacoins para comprar y usar este comando😢❌.`, player.id, 0x3bb4cb, "bold", 2);
                        } else {
                            const players = room.getPlayerList();

                            if (players.length >= 4) {
                                chaosModeActive = false;

                                players.forEach(p => {
                                    room.setPlayerDiscProperties(p.id, { radius: playerRadius - 5 });

                                    setTimeout(() => {
                                        chaosModeActive = true;
                                        room.setPlayerDiscProperties(p.id, { radius: playerRadius });
                                    }, 30000);

                                    if (playerSizes[p.id]) {
                                        room.setPlayerDiscProperties(p.id, { radius: playerSizes[p.id] });
                                    }
                                });
                                playerStats[playerAuth].pandacoins -= 800;
                                fs.writeFileSync(playersFilePath, JSON.stringify(playerStats, null, 2));
                                smallUses++;

                                if (smallUses === 3) {
                                    room.sendAnnouncement("Ya se gastaron todos los usos para este comando", player.id, 0xFF0000, "bold", 2);
                                    return false;
                                }

                                room.sendAnnouncement(`🐼🤑🤏EL PANDITA ${player.name} USÓ !SMALLALL: TODOS PEQUEÑOS🤏🤑🐼`, null, 0xfffa54, "bold", 2);
                            } else {
                                room.sendAnnouncement("No puedes usar este comando porque no hay 4 jugadores", player.id, 0xFF0000, "bold", 2);
                            }
                        }
                    }
                }
                return false;
            } else if (message.startsWith("!ruleta")) {
                const args = message.split(' ');
                const betAmount = parseInt(args[1]);

                if (playerStats[playerAuth] && !playerStats[playerAuth].verified) {
                    room.sendAnnouncement("Necesitas estar verificado para usar este comando", player.id, 0xFF0000, "bold", 2);
                    return false;
                }

                if (isNaN(betAmount) || betAmount <= 0) {
                    room.sendAnnouncement("💰 Debes apostar una cantidad válida de pandacoins.", player.id, 0xFF0000, "small-bold", 2);
                    return false;
                }

                if (playerStats[playerAuth].pandacoins < betAmount) {
                    room.sendAnnouncement("🐼😭 No tienes suficientes pandacoins para apostar.", player.id, 0xFF0000, "small-bold", 2);
                    return false;
                }

                if (betAmount < 49) {
                    room.sendAnnouncement("⚠️ La apuesta tiene que ser entre 50 y 200.", player.id, 0xFF0000, "bold", 2);
                    return false;
                }

                if (betAmount > 501) {
                    room.sendAnnouncement("⚠️ La apuesta tiene que ser entre 50 y 500.", player.id, 0xFF0000, "bold", 2);
                    return false;
                }

                if (betActive[player.id] && bets[playerAuth]) {
                    room.sendAnnouncement("🤡 No puedes usar la ruleta si hay una apuesta disponible", player.id, 0xFF0000, "bold", 2);
                    return false;
                }

                const fruits = ["🍌", "🍒", "🍉"];

                let result = [];
                for (let i = 0; i < 3; i++) {
                    const randomIndex = Math.floor(Math.random() * fruits.length);
                    result.push(fruits[randomIndex]);
                }

                room.sendAnnouncement(`🎰 ¡Ruleta! Resultado: ${result.join(' | ')}`, null, 0xFFA500, "small-bold", 2);

                if (result[0] === result[1] && result[1] === result[2]) {
                    const winnings = betAmount * 2;
                    playerStats[playerAuth].pandacoins += winnings;
                    room.sendAnnouncement(`💰🤑 El pandita ${player.name} ganó ${winnings} pandacoins en la ruleta 🤑💰`, null, 0x9ee2ec, "bold", 2);
                } else {
                    playerStats[playerAuth].pandacoins -= betAmount;
                    room.sendAnnouncement(`❌😢 El pandita ${player.name} perdió ${betAmount} pandacoins en la ruleta 😢❌`, null, 0xd33434, "bold", 2);
                }
                fs.writeFileSync(playersFilePath, JSON.stringify(playerStats, null, 2));
                return false;
            } else if (message.startsWith("!bet")) {
                const args = message.split(' ');
                const teamName = args[1]?.toLowerCase();
                const betAmount = parseInt(args[2]);

                const team = teamName === "red" ? 1 : teamName === "blue" ? 2 : null;

                if (playerStats[playerAuth] && !playerStats[playerAuth].verified) {
                    room.sendAnnouncement("Necesitas estar verificado para usar este comando", player.id, 0xFF0000, "bold", 2);
                    return false;
                }

                if (player.team === 0) {
                    room.sendAnnouncement("Necesitas estar en un equipo para usar este comando", player.id, 0xFF0000, "bold", 2);
                    return false;
                }

                if (room.getPlayerList().length < 8) {
                    room.sendAnnouncement("No hay suficientes jugadores para usar este comando", player.id, 0xFF0000, "bold", 2);
                    return false;
                }

                if (betCooldownActive) {
                    room.sendAnnouncement("⚠️ El comando !bet está deshabilitado por el momento. Espera a que se reinicie.", player.id, 0xFF0000, "bold", 2);
                    return false;
                }

                if (!team) {
                    room.sendAnnouncement("⚠️ Usa: !bet red/blue [apuesta].", player.id, 0xFF0000, "bold", 2);
                    return false;
                }

                if (isNaN(betAmount) || betAmount <= 0) {
                    room.sendAnnouncement("⚠️ La apuesta debe ser un número positivo.", player.id, 0xFF0000, "bold", 2);
                    return false;
                }

                if (betAmount <= 49) {
                    room.sendAnnouncement("⚠️ La apuesta tiene que ser entre 50 y 200.", player.id, 0xFF0000, "bold", 2);
                    return false;
                }

                if (betAmount >= 201) {
                    room.sendAnnouncement("⚠️ La apuesta tiene que ser entre 50 y 200.", player.id, 0xFF0000, "bold", 2);
                    return false;
                }

                if (playerStats[playerAuth].pandacoins < betAmount) {
                    room.sendAnnouncement("🐼😭 No tienes suficientes pandacoins para esta apuesta.", player.id, 0x71ba02, "bold", 2);
                    return false;
                }

                if (bets[playerAuth]) {
                    room.sendAnnouncement("Ya has apostado", player.id, 0xFF0000, "bold", 2);
                    return false;
                }

                bets[playerAuth] = { team, betAmount };
                if (!betActive[player.id]) betActive[player.id] = true;
                room.sendAnnouncement(`💸🎲 ${player.name} apostó ${betAmount} pandacoins por el ${teamName.toUpperCase()} 🎲💸`, null, 0xffb835, "small-bold", 2);
                return false;
            } else if (message.startsWith("!banauth")) {
                if (rolesData.roles["maestropanda"].users.includes(playerAuth) || rolesData.roles["jefepanda"].users.includes(playerAuth) || rolesData.roles["granpanda"].users.includes(playerAuth) || rolesData.roles["coowner"].users.includes(playerAuth) || rolesData.roles["owner"].users.includes(playerAuth)) {
                    const args = message.split(' ');
                    const authToBan = args[1];

                    if (!authToBan) {
                        room.sendAnnouncement("Por favor, especificá el auth para banear. Ejemplo: !banauth [auth]", player.id, 0xFF0000, "bold", 2);
                        return false;
                    }

                    const targetPlayer = room.getPlayerList().find(p => playerId[p.id] === authToBan);

                    if (!targetPlayer) {
                        if (playerStats[authToBan]) {
                            const playerName = playerStats[authToBan].name;
                            bannedPlayers.push({ name: playerName, auth: authToBan, reason: "Sin razon" });

                            if (rolesData.roles[playerRole]) {
                                rolesData.roles[playerRole].users = rolesData.roles[playerRole].users.filter(userAuth => userAuth !== authToBan);
                            }

                            delete playerStats[authToBan];
                            fs.writeFileSync(bannedPlayersFilePath, JSON.stringify(bannedPlayers, null, 2));
                            fs.writeFileSync(playersFilePath, JSON.stringify(playerStats, null, 2));
                            room.sendAnnouncement(`⛔ El pandita ${playerName} fue baneado mediante auth por portarse mal🐼👎❌.`, null, 0xf3ea87, "bold", 1);
                        } else {
                            room.sendAnnouncement(`⚠️ No se encontró ningún jugador con el auth especificado en la sala o en las estadísticas.`, player.id, 0xFF0000, "bold", 2);
                        }
                    } else {
                        room.sendAnnouncement(`⚠️ El jugador con auth ${authToBan} está en la sala. Usá el comando de baneo directo si es necesario.`, player.id, 0xFF0000, "bold", 2);
                    }
                } else {
                    room.sendAnnouncement(`[❌] ${player.name}, no tienes permitido usar este comando.`, player.id, 0xFF0000, "bold", 2);
                }
                return false;
            } else if (message === "!afk") {
                if (!afkPlayers[player.id]) {
                    if (playerStats[playerAuth] && !playerStats[playerAuth].verified) {
                        room.sendAnnouncement("Necesitas estar verificado para usar este comando", player.id, 0xFF0000, "bold", 2);
                        return false;
                    }

                    if (room.getPlayerList().length < 6) {
                        room.sendAnnouncement("No hay suficientes jugadores para usar este comando", player.id, 0xFF0000, "bold", 2);
                        return false;
                    }

                    room.sendAnnouncement(`El pandita ${player.name} ahora está AFK🐼😴.`, null, 0xF19917, "bold", 1);
                    afkPlayers[player.id] = true;
                    afkTimestamps[player.id] = Date.now();
                    room.setPlayerTeam(player.id, 0);
                } else {
                    room.sendAnnouncement(`${player.name} no esta mas AFK🐼😁`, null, 0xF19917, "bold", 1);
                    const red = room.getPlayerList().filter(p => p.team === 1).length;
                    const blue = room.getPlayerList().filter(p => p.team === 2).length;

                    delete afkPlayers[player.id];
                    delete afkTimestamps[player.id];

                    if (red <= blue) {
                        room.setPlayerTeam(player.id, 1);
                    } else {
                        room.setPlayerTeam(player.id, 2);
                    }
                }
                return false;
            } else if (message.startsWith("!recuperar")) {
                const args = message.split(" ");
                const recoveryCode = args[1]?.trim();

                const registeredPlayer = Object.values(playerStats).find(
                    player => player.recoveryCode && player.recoveryCode.toString() === recoveryCode
                );

                if (!registeredPlayer) {
                    room.sendAnnouncement("Código de recuperación incorrecto o expirado.", player.id, 0xFF0000, "bold", 2);
                    return false;
                }

                if (registeredPlayer.auth !== playerAuth) {
                    playerStats[playerAuth] = {
                        ...registeredPlayer,
                        name: player.name,
                        auth: playerAuth,
                    };

                    room.sendAnnouncement("¡Recuperación exitosa!. Pandita: Recuperaste tus estadísticas🐼.", player.id, 0xa5fad3, "bold", 2);

                    delete playerStats[playerAuth].recoveryCode;
                    delete playerStats[playerAuth].registrationDate;
                    delete playerStats[registeredPlayer.auth];
                } else {
                    room.sendAnnouncement("No puedes recuperar tu propia cuenta activa.", player.id, 0xFFFF00, "bold", 2);
                }
                return false;
            } else if (message.startsWith("!dar")) {
                const args = message.split(' ');
                const coinsAmount = parseInt(args[1]);
                const idPlayer = args[2] ? parseInt(args[2].replace("#", "")) : null;

                if (isNaN(idPlayer)) {
                    room.sendAnnouncement("Debes proporcionar correctamente el #ID del pandita.", player.id, 0xFF0000, "bold", 2);
                    return false;
                }

                if (isNaN(coinsAmount) || coinsAmount <= 0) {
                    room.sendAnnouncement("Debes proporcionar una cantidad POSITIVA de pandacoins💰❌", player.id, 0xFF0000, "bold", 2);
                    return false;
                }

                if (playerStats[playerAuth] && !playerStats[playerAuth].verified) {
                    room.sendAnnouncement("Necesitas estar verificado para usar este comando", player.id, 0xFF0000, "bold", 2);
                    return false;
                }

                const playerList = room.getPlayerList();
                const targetPlayer = playerList.find(p => p.id === idPlayer);

                if (!targetPlayer) {
                    room.sendAnnouncement(`El pandita con la ID #${idPlayer} no existe o no está en la sala.`, player.id, 0xFF0000, "bold", 2);
                    return false;
                }

                const targetAuth = playerId[targetPlayer.id];

                if (!targetAuth) {
                    room.sendAnnouncement("No se pudo obtener la autenticación del jugador.", player.id, 0xFF0000, "bold", 2);
                    return false;
                }

                if ((playerStats[playerAuth]?.pandacoins || 0) < coinsAmount) {
                    room.sendAnnouncement("No tenés pandacoins suficientes para darle a " + targetPlayer.name, player.id, 0xFF0000, "bold", 2);
                    return false;
                }

                if (targetPlayer.id === player.id) {
                    room.sendAnnouncement("No podés darte pandacoins a vos mismo💸❌.", player.id, 0xFF0000, "bold", 2);
                    return false;
                }

                if (coinsAmount < 50) {
                    room.sendAnnouncement("La cantidad mínima para dar pandacoins es 50💰🐼.", player.id, 0xFF0000, "bold", 2);
                    return false;
                }

                room.sendAnnouncement(`EL PANDITA ${player.name} TE REGALÓ ${coinsAmount} PANDACOINS💰🤑🐼`, targetPlayer.id, 0xead2c0, "bold", 2);
                room.sendAnnouncement(`Le diste ${coinsAmount} pandacoins a ${targetPlayer.name}💰🤑🐼.`, player.id, 0xead2c0, "bold", 2);
                playerStats[playerAuth].pandacoins = (playerStats[playerAuth].pandacoins || 0) - coinsAmount;
                playerStats[targetAuth].pandacoins = (playerStats[targetAuth].pandacoins || 0) + coinsAmount;
                return false;
            } else if (message === "!verificar") {
                if (!playerStats[playerAuth].verified) {
                    room.sendAnnouncement(`🐼Tu código (UUID): ${playerStats[playerAuth]?.uuid}, COPIALO y mirá el msj de abajo.`, player.id, 0x3eec4b, "bold", 2);
                    room.sendAnnouncement("🐼En nuestro discord (!dc), en cualquier canal escribí /verificar codigo (interactuando con el bot de panda). Esto se hace solo una vez.", player.id, 0x86ee8e, "bold", 2);
                } else {
                    room.sendAnnouncement("❌ No puedes usar este comando, ya estas verificado", player.id, 0xFF0000, "bold", 2);
                }
                return false;
            } else if (message === "!ksk") {
                if (!rolesData.roles["vips"]?.users.includes(playerAuth)) {
                    room.sendAnnouncement("Este comando es solo para vips", player.id, 0xFF0000, "bold", 2);
                    return false;
                }

                changeColors();
                room.sendAnnouncement(`🌟👕 ¡El VIP ${player.name} ha cambiado las camisetas! 👕🐼!`, null, 0x64b3ec, "bold", 2);
                votes = 0;
                votedPlayers = [];
                return false;
            } else if (message === "!gks") {
                if (room.getScores() === null) {
                    room.sendAnnouncement("No es posible usar este comando por ahora.", player.id, 0xFF0000, "bold", 2);
                    return false;
                }

                const gkRedName = gkred.length > 0 ? gkred[0].name : "Sin GK";
                const gkBlueName = gkblue.length > 0 ? gkblue[0].name : "Sin GK";

                room.sendAnnouncement(`🧤🔴 GK DEL ROJO: ${gkRedName}`, null, 0xdb7a7a, "normal", 1);
                room.sendAnnouncement(`🧤🔵 GK DEL AZUL: ${gkBlueName}`, null, 0x64b3ec, "normal", 1);
                return false;
            } else if (message.startsWith("!")) {
                room.sendAnnouncement("Comando desconocido o no existe, usa !help para ver los comandos", player.id, 0xFF0000, "bold", 2);
                return false;
            } else if (message.toLowerCase().includes("https:")) {
                return false;
            } else if (message.toLowerCase().includes("http:")) {
                return false;
            } else if (message.includes("@everyone") || message.includes("@here")) {
                return false;
            } else if (contienePalabraCensurada(message)) {
                room.sendAnnouncement(`SE ACTIVÓ EL FILTRO DE PANDA: ${player.name} fue kickeado.🌿🐼`, null, 0xead2c0, "bold", 2);
                room.kickPlayer(player.id, "Por favor, respetá.", false);
                return false; // amor no uses el ctrl + z si lo tas usando // perdon, si fui yo jkasdkasdkjasdkj
            }// tranqui

            const { rankName, colorRank } = determineRank(playerStats[playerAuth]?.xp);
            playerStats[playerAuth].rank = rankName;

            if (!playerStats[playerAuth].color) {
                playerStats[playerAuth].color = colorRank;
            }

            try {
                fs.writeFileSync(playersFilePath, JSON.stringify(playerStats, null, 2));
            } catch (err) {
                console.error(`Error al escribir en el archivo ${playersFilePath}:`, err);
                return;
            }

            const roles = rolesData.roles;
            const playerRank =
                playerStats[playerAuth] && playerStats[playerAuth].verified && playerStats[playerAuth].rank
                    ? playerStats[playerAuth].rank
                    : "Sin rango(no verificado)";
            const rolesConfig = {
                "owner": { prefix: "🐼❤️ FUNDADOR PANDA", color: 0xff68ea },
                "coowner": { prefix: "🐼❤️ FUNDADOR PANDA", color: 0x6bd497 },
                "granpanda": { prefix: "⭐ GRAN PANDA", color: 0xd0a6f5 },
                "jefepanda": { prefix: "COMANDANTE PANDA", color: 0xA5F685 },
                "maestropanda": { prefix: "🎓 MAESTRO PANDA", color: 0xfd6e6e },
                "liderpanda": { prefix: "CAPITAN PANDA", color: 0x2ff6fd },
                "subliderpanda": { prefix: "SUB-LIDER PANDA", color: 0x1ee8f0 },
                "asistente": { prefix: "ASISTENTE PANDA", color: 0x17dde5 },
                "vips": { prefix: "🌟VIP", color: playerStats[playerAuth]?.colorVip || 0x7988f5 },
            };

            for (const [role, { prefix, color }] of Object.entries(rolesConfig)) {
                if (roles[role]?.users.includes(playerAuth)) {
                    room.sendAnnouncement(`${prefix} [${player.id}] | ${playerRank} ${player.name}: ${message}`, null, color, "bold", 1);
                    return false;
                }
            }

            if (afkPlayers && afkPlayers[player.id]) {
                room.sendAnnouncement(`💤 AFK | ${playerRank} ${player.name}: ${message}`, null, 0xC48018, "small-bold", 0);
                return false;
            }

            const teamEmoji = player.team === 1 ? "🔴" : "🔵";
            room.sendAnnouncement(`[${teamEmoji}] [${player.id}] / ${playerRank} ${player.name}: ${message}`, null, playerStats[playerAuth]?.color || 0xFFFFFF, "normal", 1);
            return false;
        }

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
                        powerLevel = -1;
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
                        powerLevel = -1;
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
                    powerLevel = -1;
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
                        powerLevel = -1;
                        room.setDiscProperties(0, { color: NORMAL_BALL_COLOR });

                        if (gravityTimer) {
                            clearInterval(gravityTimer);
                            gravityTimer = null;
                        }

                        gravityTimer = setInterval(() => {
                            if (powerLevel < BOOST_SPEEDS.length - 1) {
                                powerLevel++;
                                room.setDiscProperties(0, {
                                    color: COMBA_COLORS[powerLevel]
                                });
                                gravityActive = true;
                            }
                        }, GRAVITY_HOLD_TIME);
                    }
                } else {
                    if (bolapor !== null) {
                        bolapor = null;
                        gravityActive = false;
                        powerLevel = -1;
                        room.setDiscProperties(0, { color: NORMAL_BALL_COLOR });

                        if (gravityTimer) {
                            clearInterval(gravityTimer);
                            gravityTimer = null;
                        }
                    }
                }
            } else {
                if (bolapor !== null) {
                    bolapor = null;
                    gravityActive = false;
                    powerLevel = -1;
                    room.setDiscProperties(0, { color: NORMAL_BALL_COLOR });

                    if (gravityTimer) {
                        clearInterval(gravityTimer);
                        gravityTimer = null;
                    }
                }
            }
        }, 100);

        setInterval(() => {
            chaosMode();
        }, 180000);

        if (!mathActive) {
            setInterval(() => {
                startMathMinigame();
            }, 120000);
        }

        setInterval(generateRanking, 3600000);
    } catch (err) {
        console.error("Error al abrir la sala:", err);
    }
});

function getRoomLink() {
    return roomLink;
} // ya elimine

function sendAnnouncement(message, playerId, color, sound) {
    room.sendAnnouncement(
        message || '',
        typeof playerId === 'undefined' ? undefined : playerId,
        typeof color === 'undefined' ? undefined : color,
        typeof sound === 'undefined' ? undefined : sound
    );
}

function getPlayerList() {
    const players = room.getPlayerList();
    const red = players.filter(p => p.team === 1);
    const blue = players.filter(p => p.team === 2);
    const specs = players.filter(p => p.team === 0);

    return { players, red, blue, specs };
}

module.exports = { getRoomLink, playerStats, playerId, sendAnnouncement, getPlayerList, bannedPlayers, playersFilePath, bannedPlayersFilePath, mapaX3, mapaX5, mapaX7, x3Active, x5Active, x7Active };
