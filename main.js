require('dotenv').config();

const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js');
const { Player } = require('discord-player');
const { YouTubeExtractor } = require('@discord-player/youtubei');

// 💖 Crée le client Discord
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

// 📦 Charge la config
client.config = require('./config');

// 🍡 Prépare la collection de commandes
client.commands = new Collection();

// 🎧 Initialise le lecteur audio
const player = new Player(client, client.config.opt.discordPlayer);

// 🧁 Charge et connecte l’extracteur YouTube officiel
player.extractors.register(YouTubeExtractor, {});
console.log("🩷 Extracteur `youtubei` chargé avec succès !");

// 🎀 Attache player et client globalement
client.player = player;
global.client = client;

// 🌈 Affichage du token pour debug Railway
console.clear();
console.log("✅ TOKEN chargé :", client.config.app.token ? "[TROUVÉ]" : "[MANQUANT]");

// 🍬 Charge tous les handlers
require('./loader');

// 🚀 Connexion du bot à Discord
client.login(client.config.app.token).catch(async (e) => {
    if (e.message === 'An invalid token was provided.') {
        console.error('\n❌ Token invalide ❌\n➡️ Vérifie `config.js` ou tes variables Railway.');
    } else {
        console.error('❌ Erreur de connexion au bot ❌\n', e);
    }
});
