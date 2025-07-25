const { REST, Routes } = require('discord.js');
const fs = require('fs');
require('dotenv').config();

const CLIENT_ID = '1334695986089689143'; // 🔁 Remplace par ton vrai Client ID
const TOKEN = process.env.TOKEN;
const GUILD_IDS = [
  '1398318999338750175',
  '1397746309296820235',
  '1276300982409494659',
  '1259695245784911902'
];

const commands = [];
const foldersPath = './Commands';
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = `${foldersPath}/${folder}`;
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
  for (const file of commandFiles) {
    const command = require(`./Commands/${folder}/${file}`);
    if (command.data) {
      commands.push(command.data.toJSON());
    }
  }
}

const rest = new REST({ version: '10' }).setToken(TOKEN);
(async () => {
  try {
    console.log('💖 Déploiement des commandes...');

    for (const guildId of GUILD_IDS) {
      await rest.put(
        Routes.applicationGuildCommands(CLIENT_ID, guildId),
        { body: commands }
      );
      console.log(`✅ Commandes déployées sur le serveur ${guildId}`);
    }

    console.log('🍡 Toutes les commandes pastel ont été déployées !');
  } catch (error) {
    console.error('❌ Erreur pendant le déploiement :', error);
  }
})();
