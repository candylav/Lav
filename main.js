require('dotenv').config();

const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js');
const { Player } = require('discord-player');
const { useMainPlayer, YouTubeExtractor } = require('@discord-player/extractor');

// Crée le client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.MessageContent,
  ],
  partials: [Partials.Channel],
});

// Charge la config
client.config = require('./config');
client.commands = new Collection();

// Initialise le lecteur
const player = new Player(client, client.config.opt.discordPlayer);
client.player = player;
global.client = client;

// Enregistre l’extracteur YouTube
(async () => {
  await player.extractors.loadDefault(); // Chargement de base
  await player.extractors.register(YouTubeExtractor); // Enregistrement stable de YouTube
  console.log("🍡 Extracteur YouTube enregistré avec @discord-player/extractor !");
})();

// Log
console.clear();
console.log("✅ TOKEN chargé :", client.config.app.token ? "[TROUVÉ]" : "[MANQUANT]");

// Charge les handlers
require('./loader');

// Connexion
client.login(client.config.app.token).catch((e) => {
  if (e.message === 'An invalid token was provided.') {
    console.error('\n❌ Token invalide ❌\n➡️ Vérifie `config.js` ou Railway.');
  } else {
    console.error('❌ Erreur de connexion au bot ❌\n', e);
  }
});
