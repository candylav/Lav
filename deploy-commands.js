const { REST, Routes } = require('discord.js');
const fs = require('fs');
require('dotenv').config();
const config = require('./config'); // 👈 AJOUT IMPORTANT

const commands = [];
const commandFiles = fs.readdirSync('./Commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./Commands/${file}`);
    if (command.data) {
        commands.push(command.data.toJSON());
    }
}

const rest = new REST({ version: '10' }).setToken(config.app.token); // 👈 utilise config
const clientId = config.app.clientId; // 👈 utilise config

(async () => {
    try {
        console.log('🟡 Déploiement des commandes slash en cours...');

        await rest.put(
            Routes.applicationCommands(clientId),
            { body: commands }
        );

        console.log('🟢 Les commandes slash ont été déployées avec succès !');
    } catch (error) {
        console.error('🔴 Erreur pendant le déploiement :', error);
    }
})();
