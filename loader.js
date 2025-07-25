const { readdirSync } = require("fs");
const { Collection } = require("discord.js");
const { useMainPlayer } = require("discord-player");
const { Translate, GetTranslationModule } = require("./process_tools");

const player = useMainPlayer();
const commandsArray = [];

client.commands = new Collection();

// 🔁 Charge les modules de traduction
GetTranslationModule().then(() => {
  console.log("| 🌍 Translation Module Loaded |");

  // 📦 Événements Discord
  const discordEvents = readdirSync("./events/Discord").filter(file => file.endsWith(".js"));
  for (const file of discordEvents) {
    const event = require(`./events/Discord/${file}`);
    const eventName = file.split(".")[0];
    client.on(eventName, event.bind(null, client));
    parseLog(`< -> > [✅ Event Discord] <${eventName}>`);
  }

  // 🎵 Événements Player
  const playerEvents = readdirSync("./events/Player").filter(file => file.endsWith(".js"));
  for (const file of playerEvents) {
    const event = require(`./events/Player/${file}`);
    const eventName = file.split(".")[0];
    player.events.on(eventName, event.bind(null));
    parseLog(`< -> > [🎧 Event Player] <${eventName}>`);
  }

  // 📂 Commandes (multi-dossiers)
  const folders = readdirSync("./Commands");
  for (const folder of folders) {
    const files = readdirSync(`./Commands/${folder}`).filter(file => file.endsWith(".js"));

    for (const file of files) {
      try {
        const command = require(`./Commands/${folder}/${file}`);
        if (command?.data && command?.execute) {
          commandsArray.push(command.data.toJSON());
          client.commands.set(command.data.name, command);
          parseLog(`< -> > [✅ Slash Command] </${command.data.name}>`);
        } else {
          parseLog(`< -> > [⚠️ Ignored Command] <${file}>`);
        }
      } catch (err) {
        console.error(`❌ Erreur dans ./Commands/${folder}/${file}`, err);
      }
    }
  }

  // 🚀 Déploiement automatique (dev ou global)
  client.on("ready", async () => {
    try {
      if (client.config.app.global) {
        await client.application.commands.set(commandsArray);
        parseLog("🌍 Commandes globales déployées !");
      } else {
        const guild = client.guilds.cache.get(client.config.app.guild);
        if (!guild) return console.error("❌ ID du serveur (guild) invalide ou bot non présent.");
        await guild.commands.set(commandsArray);
        parseLog("🛠️ Commandes déployées sur le serveur de test.");
      }
    } catch (error) {
      console.error("❌ Erreur lors du set(commandsArray) :", error);
    }
  });

  async function parseLog(msg) {
    console.log(await Translate(msg, null));
  }
});
