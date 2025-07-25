const { SlashCommandBuilder } = require('discord.js');
const { QueryType } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Joue une musique depuis YouTube')
        .addStringOption(option =>
            option.setName('query')
                .setDescription('Lien ou mot-clé de la musique')
                .setRequired(true)
        ),

    async execute(interaction) {
        const query = interaction.options.getString('query');
        const member = interaction.member;

        if (!member.voice.channel) {
            return interaction.reply({ content: '🔇 Tu dois être dans un salon vocal !', ephemeral: true });
        }

        const channel = member.voice.channel;
        const client = interaction.client;

        // Crée ou récupère la queue
        const queue = client.player.nodes.create(interaction.guild, {
            metadata: interaction.channel,
            selfDeaf: true,
            volume: 80,
            leaveOnEnd: false,
            leaveOnEmpty: false,
        });

        // Joindre le salon vocal
        if (!queue.connection) await queue.connect(channel);

        await interaction.deferReply();

        try {
            // Recherche avec play-dl
            const result = await client.player.search(query, {
                requestedBy: interaction.user,
                searchEngine: QueryType.AUTO,
            });

            if (!result || !result.tracks.length) {
                return interaction.editReply({ content: '❌ Aucun résultat trouvé. Réessaye avec un autre mot-clé ou lien.' });
            }

            const track = result.tracks[0];
            queue.addTrack(track);

            if (!queue.isPlaying()) await queue.node.play();

            return interaction.editReply(`🎶 Ajouté à la file : **${track.title}**`);
        } catch (error) {
            console.error('Erreur dans la commande /play :', error);
            return interaction.editReply('❌ Une erreur est survenue pendant la lecture.');
        }
    },
};
