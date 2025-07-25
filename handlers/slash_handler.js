const fs = require('fs');
const path = require('path');
const { REST, Routes } = require('discord.js');

module.exports = async (client) => {
    client.slashCommands = new Map();
    const commandsArray = [];

    const commandsPath = path.join(__dirname, '../Commands');
    const folders = fs.readdirSync(commandsPath);

    for (const folder of folders) {
        const folderPath = path.join(commandsPath, folder);
        const files = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));

        for (const file of files) {
            const filePath = path.join(folderPath, file);
            const command = require(filePath);

            if ('data' in command && 'execute' in command) {
                client.slashCommands.set(command.data.name, command);
                commandsArray.push(command.data.toJSON());
            }
        }
    }

    // Enregistrement des commandes sur Discord
    const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

    try {
        console.log('🔁 Mise à jour des commandes slash...');

        await rest.put(
            Routes.applicationCommands(client.user.id),
            { body: commandsArray }
        );

        console.log('✅ Commandes slash enregistrées avec succès.');
    } catch (error) {
        console.error('❌ Erreur lors de l’enregistrement des commandes slash :', error);
    }
};
