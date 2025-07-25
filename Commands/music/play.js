const { SlashCommandBuilder } = require('discord.js');
const { QueryType, QueueRepeatMode } = require('discord-player');

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
        await interaction.deferReply(); // ✅ Obligatoire

        const query = interaction.options.getString('query');
        const member = interaction.member;

        if (!member.voice.channel) {
            return interaction.editReply({
                content: '🔇 Tu dois être dans un salon vocal !'
            });
        }

        const queue = interaction.client.player.nodes.create(interaction.guild, {
            metadata: interaction.channel,
            selfDeaf: true,
            volume: 80,
            leaveOnEnd: false,
            leaveOnEmpty: false,
        });

        try {
            if (!queue.connection) await queue.connect(member.voice.channel);
        } catch (err) {
            return interaction.editReply({ content: '❌ Impossible de rejoindre le salon vocal.' });
        }

        const result = await interaction.client.player.search(query, {
            requestedBy: interaction.user,
            searchEngine: QueryType.AUTO,
        });

        if (!result || result.tracks.length === 0) {
            return interaction.editReply({ content: '❌ Aucun résultat trouvé.' });
        }

        queue.addTrack(result.tracks[0]);

        // ✅ Lancer la lecture (même si déjà en cours, discord-player gère)
        if (!queue.isPlaying()) {
            await queue.node.play();
        }

        // ✅ Auto-loop si file vide après cette musique
        queue.setRepeatMode(QueueRepeatMode.AUTOPLAY);

        return interaction.editReply(`🎵 Lecture de : **${result.tracks[0].title}**`);
    },
};
