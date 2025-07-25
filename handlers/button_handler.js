const path = require("path");
const fs = require("fs");

module.exports = async (client) => {
  const buttonDir = path.join(__dirname, "../Commands/music/buttons");
  const files = fs.readdirSync(buttonDir).filter(file => file.endsWith(".js"));

  for (const file of files) {
    const button = require(path.join(buttonDir, file));
    if (!button.data?.name) continue;
    client.buttons.set(button.data.name, button);
    console.log(`🍭 Bouton chargé : ${button.data.name}`);
  }
};
