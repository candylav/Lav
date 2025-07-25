require('dotenv').config();

const { Client, GatewayIntentBits } = require('discord.js');
const { Player } = require('discord-player');
const playdl = require('play-dl');

global.client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.MessageContent,
    ],
});

client.config = require('./config');

const player = new Player(client, client.config.opt.discordPlayer);

// ✅ Charger les extracteurs de discord-player + register play-dl
player.extractors.loadDefault().then(() => {
    player.extractors.register(playdl, {});
    console.log("✅ Extracteur play-dl chargé avec succès !");
});

client.player = player;

console.clear();
require('./loader');

// ✅ Vérifie si le TOKEN est bien présent (debug Railway)
console.log("✅ TOKEN chargé :", client.config.app.token ? "[TROUVÉ]" : "[MANQUANT]");

client.login(client.config.app.token).catch(async (e) => {
    if (e.message === 'An invalid token was provided.') {
        require('./process_tools').throwConfigError('app', 'token', '\n\t   ❌ Token invalide ❌\n\tModifie le token dans `config.js` ou dans les variables Railway.\n');
    } else {
        console.error('❌ Erreur de connexion au bot ❌\n', e);
    }
});
