const restClean = new REST({ version: '10' }).setToken(TOKEN);
(async () => {
  try {
    console.log('🧁 Suppression des anciennes commandes...');

    for (const guildId of GUILD_IDS) {
      await restClean.put(Routes.applicationGuildCommands(CLIENT_ID, guildId), {
        body: [],
      });
      console.log(`💙 Anciennes commandes supprimées du serveur ${guildId}`);
    }

    await restClean.put(Routes.applicationCommands(CLIENT_ID), { body: [] });
    console.log('💜 Commandes globales supprimées');
  } catch (error) {
    console.error('❌ Erreur lors du nettoyage :', error);
  }
})();
