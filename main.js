require('dotenv').config();

const { Player } = require('discord-player');
const { Client, GatewayIntentBits } = require('discord.js');
const playdl = require('play-dl'); // ✅ Extracteur recommandé

// Création du client Discord
global.client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.MessageContent,
    ],
});

// Chargement de la config
client.config = require('./config');

// Initialisation du player avec les options depuis la config
const player = new Player(client, client.config.opt.discordPlayer);

// Chargement des extracteurs par défaut et enregistrement de play-dl manuellement
(async () => {
    await player.extractors.loadDefault();
    await player.extractors.register(playdl, {});

    console.log("✅ Extracteur play-dl chargé avec succès !");
})();

console.clear();
require('./loader');

// Vérification du token
if (!client.config.app.token) {
    require('./process_tools').throwConfigError(
        'app',
        'token',
        '\n❌ TOKEN manquant dans config.app.token !\nVérifie ta variable d’environnement `TOKEN` sur Railway ou dans `.env`.'
    );
}

console.log("✅ TOKEN chargé :", "[TROUVÉ]");

// Connexion au bot
client.login(client.config.app.token).catch(async (e) => {
    if (e.message === 'An invalid token was provided.') {
        require('./process_tools').throwConfigError(
            'app',
            'token',
            '\n❌ TOKEN invalide !\nVérifie que le token est correct dans Railway ou ton fichier .env.'
        );
    } else {
        console.error('❌ Erreur lors de la connexion du bot :\n', e);
    }
});
