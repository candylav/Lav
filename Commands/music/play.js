const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Joue une musique depuis YouTube 🍭💖')
    .addStringOption(option =>
      option.setName('query')
        .setDescription('Nom ou lien de la musique à jouer 🎵')
        .setRequired(true)
    ),

  async execute(interaction) {
    const query = interaction.options.getString('query');
    const member = interaction.member;

    if (!member.voice.channel) {
      await interaction.reply({
        content: "💔 Tu dois être dans un salon vocal pour écouter de la musique ! 💖",
        ephemeral: true,
      });
      return;
    }

    const client = interaction.client;
    const channel = member.voice.channel;

    await interaction.deferReply(); // ✅ on retarde la réponse proprement

    const queue = await client.player.nodes.create(interaction.guild, {
      metadata: interaction.channel,
      selfDeaf: true,
      leaveOnEnd: false,
      leaveOnStop: false,
    });

    try {
      if (!queue.connection) await queue.connect(channel);

      const result = await client.player.search(query, {
        requestedBy: interaction.user,
      });

      if (!result || !result.tracks.length) {
        await interaction.editReply({
          content: "😭 Aucun résultat trouvé... Essaie autre chose ! 🍡",
        });
        return;
      }

      queue.addTrack(result.tracks[0]);
      if (!queue.isPlaying()) await queue.node.play();

      await interaction.editReply({
        content: `🍭💖 **${result.tracks[0].title}** a été ajoutée à ta playlist toute douce ! 💜🧁💙\nPrépare tes oreilles, la magie commence maintenant ✨🎀🍡`,
      });
    } catch (error) {
      console.error("❌ Erreur de lecture :", error);
      await interaction.editReply({
        content: "❌ Une erreur est survenue lors de la lecture... 😢",
      });
    }
  }
};
