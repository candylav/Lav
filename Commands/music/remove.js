const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const { Translate } = require('../../process_tools');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('remove')
        .setDescription('Remove a song from the queue')
        .addStringOption(option =>
            option.setName('song')
                .setDescription('The name or URL of the track you want to remove')
                .setRequired(false))
        .addNumberOption(option =>
            option.setName('number')
                .setDescription('The position in the queue')
                .setRequired(false)),

    voiceChannel: true,

    async execute(interaction) {
        await interaction.deferReply();
        const queue = useQueue(interaction.guild);
        if (!queue?.isPlaying()) {
            return interaction.editReply({ content: await Translate(`No music currently playing <${interaction.member}>... try again ? <❌>`) });
        }

        const number = interaction.options.getNumber('number');
        const track = interaction.options.getString('song');

        if (!track && !number) {
            return interaction.editReply({ content: await Translate(`You must provide a track name or queue number <${interaction.member}>... try again ? <❌>`) });
        }

        let trackName;

        if (track) {
            const toRemove = queue.tracks.toArray().find(t => t.title === track || t.url === track);
            if (!toRemove) {
                return interaction.editReply({ content: await Translate(`Could not find <${track}> <${interaction.member}>... try using the URL or full title? <❌>`) });
            }
            trackName = toRemove.title;
            queue.removeTrack(toRemove);
        } else {
            const index = number - 1;
            const target = queue.tracks.toArray()[index];
            if (!target) {
                return interaction.editReply({ content: await Translate(`This track does not seem to exist <${interaction.member}>... try again ? <❌>`) });
            }
            trackName = target.title;
            queue.removeTrack(index);
        }

        const embed = new EmbedBuilder()
            .setColor('#2f3136')
            .setAuthor({ name: await Translate(`Removed <${trackName}> from the queue <✅>`) });

        return interaction.editReply({ embeds: [embed] });
    }
};
