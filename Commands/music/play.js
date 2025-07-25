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

    // 🎀 Vérifie si l'utilisateur est dans un salon vocal
    if (!member.voice.channel) {
      return interaction.reply({
        content: "💔 Tu dois être dans un salon vocal pour écouter de la musique ! 💖",
        ephemeral: true,
      });
    }

    const client = interaction.client;
    const channel = member.voice.channel;

    // 📻 Crée ou récupère la file d'attente
    const queue = client.player.nodes.create(interaction.guild, {
      metadata: {
        channel: interaction.channel,
        client: interaction.client,
        requestedBy: interaction.user,
      },
      selfDeaf: true,
      leaveOnEnd: false,
      leaveOnStop: false,
    });

    try {
      // 📡 Rejoindre le salon vocal si pas encore connecté
      if (!queue.connection) await queue.connect(channel);

      // 🔍 Recherche de la musique
      const result = await client.player.search(query, {
        requestedBy: interaction.user,
      });

      if (!result || !result.tracks.length) {
        return interaction.reply({
          content: "😭 Aucun résultat trouvé... Essaie autre chose ! 🍡",
          ephemeral: true,
        });
      }

      // 🎶 Lecture
      queue.addTrack(result.tracks[0]);
      if (!queue.isPlaying()) await queue.node.play();

      return interaction.reply({
        content: `💿 **${result.tracks[0].title}** a été ajoutée à la file d'attente ! 💙🍭💖`,
      });

    } catch (error) {
      console.error("❌ Erreur de lecture :", error);
      return interaction.reply({
        content: "❌ Une erreur est survenue pendant la lecture... 😢",
        ephemeral: true,
      });
    }
  }
};
