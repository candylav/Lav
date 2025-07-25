const { useMainPlayer } = require('discord-player');

module.exports = {
  data: {
    name: 'play',
    description: 'Joue une musique depuis YouTube.',
    options: [
      {
        name: 'query',
        type: 3,
        description: 'Nom ou lien de la musique.',
        required: true
      }
    ]
  },

  async execute(interaction) {
    const player = useMainPlayer();
    const query = interaction.options.getString('query');
    const channel = interaction.member.voice.channel;

    if (!channel) {
      return interaction.reply({
        content: '💔 Tu dois être dans un salon vocal pour jouer de la musique !',
        ephemeral: true
      });
    }

    await interaction.deferReply();

    const result = await player.search(query, {
      requestedBy: interaction.user
    });

    if (!result || !result.tracks.length) {
      return interaction.editReply({
        content: '🍡 Aucun résultat trouvé... Essaye autre chose ! 💔'
      });
    }

    const queue = player.nodes.create(interaction.guild, {
      metadata: interaction
    });

    try {
      if (!queue.connection) await queue.connect(channel);
      queue.addTrack(result.tracks[0]);
      if (!queue.isPlaying()) await queue.node.play();

      await interaction.editReply({
        content: `🧁 **${result.tracks[0].title}** a été ajoutée à ta playlist toute douce ! 💖💜💙\nPrépare tes oreilles, la magie commence maintenant ✨🍭🍡`
      });
    } catch (error) {
      console.error('Erreur de lecture', error);
      return interaction.editReply({
        content: '❌ Une erreur est survenue pendant la lecture.'
      });
    }
  }
};
