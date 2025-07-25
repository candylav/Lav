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
      return interaction.reply({
        content: "💔 Tu dois être dans un salon vocal pour écouter de la musique ! 💖",
        ephemeral: true,
      });
    }

    const channel = member.voice.channel;
    const client = interaction.client;

    await interaction.deferReply(); // ✅ On ne répond qu'une fois ensuite !

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
        return interaction.editReply({
          content: "😭 Aucun résultat trouvé... Essaie autre chose ! 🍡",
        });
      }

      queue.addTrack(result.tracks[0]);
      if (!queue.isPlaying()) await queue.node.play();

      return interaction.editReply({
        content: `💿 **${result.tracks[0].title}** a été ajoutée à la file d'attente ! 💙🧁`,
      });
    } catch (error) {
      console.error("❌ Erreur de lecture :", error);
      return interaction.editReply({
        content: "❌ Une erreur est survenue lors de la lecture... 😢",
      });
    }
  }
};
