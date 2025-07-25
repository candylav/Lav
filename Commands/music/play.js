const { SlashCommandBuilder } = require('discord.js');
const { useMainPlayer } = require('discord-player');
const { useMainPlayer } = require('discord-player');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Joue une musique depuis YouTube 🍬💖')
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
        content: "❌ Tu dois être dans un salon vocal pour écouter de la musique 💕",
        ephemeral: true,
      });
    }

    const client = interaction.client;
    const channel = member.voice.channel;

    await interaction.deferReply(); // On retarde la réponse proprement
    const player = useMainPlayer();

    try {
      const { track } = await player.play(channel, query, {
        nodeOptions: {
          metadata: interaction,
          leaveOnEmpty: false,
          leaveOnEnd: false,
          leaveOnStop: false,
          maxSize: 100,
          volume: 80,
          bufferingTimeout: 0,
        },
      });

      await interaction.editReply({
        content: `💖 **${track.title}** a été ajoutée à ta playlist toute douce ! \nPrépare tes oreilles, la magie commence maintenant 🍭🍡🧁`,
      });

    } catch (e) {
      console.error(e);
      await interaction.editReply({
        content: `❌ Une erreur est survenue pendant la lecture de la musique.`,
      });
    }
  },
};