require('dotenv').config();

const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js');
const { Player } = require('discord-player');
const { YouTubeExtractor } = require('@discord-player/extractor');

// 🌸 Crée le client Discord
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.MessageContent,
    ],
    partials: [Partials.Channel]
});

// 🌸 Charge la config
client.config = require('./config');

// 🌸 Prépare la collection de commandes
client.commands = new Collection();

// 🎵 Initialise le player
const player = new Player(client, client.config.opt.discordPlayer);

// 🎀 Charge l'extracteur YouTube pastel
player.extractors.register(YouTubeExtractor, {});

client.player = player;
global.client = client;

// 🧁 Affiche le token dans Railway
console.clear();
console.log("✅ TOKEN chargé :", client.config.app.token ? "[TROUVÉ]" : "[MANQUANT]");

// 💖 Charge tous les handlers
require('./loader');

// ✨ Connecte le bot
client.login(client.config.app.token).catch((e) => {
    if (e.message === 'An invalid token was provided.') {
        console.error('\n❌ Token invalide ❌\n➡️ Vérifie `config.js` ou les variables Railway.');
    } else {
        console.error('❌ Erreur de connexion au bot ❌\n', e);
    }
});
