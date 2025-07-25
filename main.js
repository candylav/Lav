require('dotenv').config();

const { Player } = require('discord-player');
const { Client, GatewayIntentBits } = require('discord.js');
const playdl = require('play-dl'); // ✅ Extracteur stable

global.client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.MessageContent,
    ],
    disableMentions: 'everyone',
});

client.config = require('./config');

const player = new Player(client, client.config.opt.discordPlayer);

// ✅ Charger les extracteurs stables
player.extractors.loadDefault().then(() => {
    player.extractors.register(playdl, {});
});

console.clear();
require('./loader');

// 🔍 Vérifie si le token est bien récupéré depuis process.env
console.log("✅ TOKEN chargé :", client.config.app.token ? "[TROUVÉ]" : "[MANQUANT]");

client.login(client.config.app.token).catch(async (e) => {
    if (e.message === 'An invalid token was provided.') {
        require('./process_tools').throwConfigError('app', 'token', '\n\t   ❌ Invalid Token Provided! ❌ \n\tChange the token dans le fichier config.js ou vérifie la variable TOKEN sur Railway.\n');
    } else {
        console.error('❌ Error while logging in the bot ❌\n', e);
    }
});
