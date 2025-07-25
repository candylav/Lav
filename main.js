require('dotenv').config();

const { Client, GatewayIntentBits } = require('discord.js');
const { Player } = require('discord-player');
const playdl = require('play-dl');

// 🔧 Crée le client Discord
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.MessageContent,
    ],
});

// 🔧 Charge la config
client.config = require('./config');

// 🔧 Initialise le lecteur audio
const player = new Player(client, client.config.opt.discordPlayer);

// 🔧 Charge et connecte les extracteurs
player.extractors.loadDefault().then(() => {
    player.extractors.register(playdl, {});
    console.log("✅ Extracteur play-dl chargé avec succès !");
});

// 🔁 Attache player au client
client.player = player;

// 🔁 Rends le client global si tu utilises `global.client` dans d’autres fichiers
global.client = client;

// 🧠 Debug : affichage token (pour Railway)
console.clear();
console.log("✅ TOKEN chargé :", client.config.app.token ? "[TROUVÉ]" : "[MANQUANT]");

// 🔌 Charge les handlers
require('./loader');

// ▶️ Connexion du bot
client.login(client.config.app.token).catch(async (e) => {
    if (e.message === 'An invalid token was provided.') {
        require('./process_tools').throwConfigError('app', 'token', '\n\t   ❌ Token invalide ❌\n\tModifie le token dans `config.js` ou dans Railway.\n');
    } else {
        console.error('❌ Erreur de connexion au bot ❌\n', e);
    }
});
