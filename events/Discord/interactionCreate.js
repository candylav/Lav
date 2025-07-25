const path = require("path");
const fs = require("fs");

module.exports = async (client, interaction) => {
  try {
    if (interaction.isButton()) {
      const buttonDir = path.join(__dirname, "../../Commands/music/buttons");
      const files = fs.readdirSync(buttonDir).filter(file => file.endsWith(".js"));
      for (const file of files) {
        const button = require(path.join(buttonDir, file));
        if (button.data.name === interaction.customId || button.name === interaction.customId) {
          return button.execute(interaction, client);
        }
      }
      return;
    }

    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);
      if (!command) return;
      await command.execute(interaction, client);
    }
  } catch (error) {
    console.error("❌ Crash interactionCreate :", error);
  }
};
