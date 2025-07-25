const { REST, Routes } = require('discord.js');
const fs = require('fs');
require('dotenv').config();
const config = require('./config');

const commands = [];
const foldersPath = './Commands';
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    const commandFiles = fs
        .readdirSync(`${foldersPath}/${folder}`)
        .filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const command = require(`${foldersPath}/${folder}/${file}`);
        if (command.data) {
            commands.push(command.data.toJSON());
        }
    }
}

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log("🟡 Déploiement des commandes slash sur chaque serveur...");

        for (const guildId of config.app.guilds) {
            await rest.put(
                Routes.applicationGuildCommands(config.app.clientId, guildId),
                { body: commands }
            );
            console.log(`🟢 Commandes déployées sur le serveur : ${guildId}`);
        }

        console.log("✅ Toutes les commandes slash ont été déployées avec succès !");
    } catch (error) {
        console.error("🔴 Erreur pendant le déploiement :", error);
    }
})();
