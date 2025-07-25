const { SlashCommandBuilder } = require('discord.js');
const { QueryType } = require('discord-player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Joue une musique depuis YouTube ou autre plateforme supportée')
        .addStringOption(option =>
            option.setName('query')
                .setDescription('Lien ou mot-clé de la musique')
                .setRequired(true)
        ),

    async execute(interaction) {
        const query = interaction.options.getString('query');
        const member = interaction.member;

        if (!member.voice.channel) {
            return interaction.reply({
                content: '🔇 Tu dois être dans un salon vocal !',
                ephemeral: true
            });
        }

        const voiceChannel = member.voice.channel;
        const client = interaction.client;

        const queue = client.player.nodes.create(interaction.guild, {
            metadata: {
                channel: interaction.channel
            },
            selfDeaf: true,
            volume: 80,
            leaveOnEnd: false,
            leaveOnEmpty: false
        });

        try {
            if (!queue.connection) await queue.connect(voiceChannel);

            await interaction.deferReply();

            const result = await client.player.search(query, {
                requestedBy: interaction.user,
                searchEngine: QueryType.AUTO
            });

            if (!result || !result.tracks.length) {
                return interaction.editReply({
                    content: '❌ Aucun résultat trouvé. Réessaie avec un autre lien ou mot-clé.'
                });
            }

            const track = result.tracks[0];
            queue.addTrack(track);

            if (!queue.isPlaying()) await queue.node.play();

            return interaction.editReply(`🎶 Ajouté à la file : **${track.title}**`);
        } catch (error) {
            console.error('Erreur dans la commande /play :', error);
            return interaction.editReply({
                content: '❌ Une erreur est survenue pendant la lecture.'
            });
        }
    }
};
