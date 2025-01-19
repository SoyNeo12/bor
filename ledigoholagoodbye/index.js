const express = require('express');
const { haxballBot } = require('./examples/script');
const { discordBot } = require('./examples/discord/iniciar');

const app = express();

app.get('/start/script1', (req, res) => {
    haxballBot;
    res.send('script1.js iniciado');
});

app.get('/start/script2', (req, res) => {
    discordBot;
    res.send('script2.js iniciado');
});

app.listen(3000, () => {
    console.log('Servidor Express escuchando en http://localhost:3000');
});
