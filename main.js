const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { Player } = require('discord-player');
const { loadCommands } = require('./handlers/slash_handler');
const { loadEvents } = require('./handlers/event_handler');
const { loadButtons } = require('./handlers/button_handler');
const { YouTubeExtractor } = require('@discord-player/extractor');
const { resolve } = require('path');
require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.commands = new Collection();

// Chargement du player
const player = new Player(client, {
  ytdlOptions: {
    filter: 'audioonly',
    highWaterMark: 1 << 25,
  },
});
player.extractors.register(YouTubeExtractor);

// Load all handlers
loadCommands(client);
loadEvents(client);
loadButtons(client);

// Connexion du bot
client.login(process.env.TOKEN);

// Garde le bot connecté au salon vocal (aucune déconnexion auto)
player.events.on('playerStart', (queue, track) => {
  console.log(`🎶 Lecture de : ${track.title}`);
});
