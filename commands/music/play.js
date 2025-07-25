const { SlashCommandBuilder } = require('discord.js');
const { QueryType } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Joue une musique depuis YouTube')
        .addStringOption(option =>
            option.setName('query')
                .setDescription('Nom ou lien de la musique')
                .setRequired(true)
        ),

    async execute(interaction) {
        const query = interaction.options.getString('query');
        const member = interaction.member;

        if (!member.voice.channel) {
            return interaction.reply({ content: '🔇 Tu dois être dans un salon vocal !', ephemeral: true });
        }

        const queue = interaction.client.player.nodes.create(interaction.guild, {
            metadata: interaction.channel,
            selfDeaf: true,
            volume: 80,
            leaveOnEnd: false,
            leaveOnEmpty: false,
        });

        await queue.connect(member.voice.channel);
        await interaction.deferReply();

        const result = await interaction.client.player.search(query, {
            requestedBy: interaction.user,
            searchEngine: QueryType.AUTO
        });

        if (!result || result.tracks.length === 0) {
            return interaction.editReply({ content: '❌ Aucun résultat trouvé.' });
        }

        queue.addTrack(result.tracks[0]);
        if (!queue.isPlaying()) await queue.node.play();

        return interaction.editReply(`🎵 Lecture de : **${result.tracks[0].title}**`);
    },
};
