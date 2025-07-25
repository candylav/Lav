const { SlashCommandBuilder, ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const { Translate } = require('../../process_tools');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('jump')
        .setDescription('Jump to a specific track')
        .addStringOption(option =>
            option.setName('song')
                .setDescription('The name or url of the song')
                .setRequired(false))
        .addNumberOption(option =>
            option.setName('number')
                .setDescription('Position in the queue')
                .setRequired(false)),

    voiceChannel: true,

    async execute(interaction) {
        await interaction.deferReply();
        const queue = useQueue(interaction.guild);
        if (!queue?.isPlaying()) return interaction.editReply({ content: await Translate(`No music currently playing <${interaction.member}>... try again ? <❌>`) });

        const track = interaction.options.getString('song');
        const number = interaction.options.getNumber('number');
        if (!track && !number) return interaction.editReply({ content: await Translate(`You must provide a song or a number <${interaction.member}>... try again ? <❌>`) });

        let trackName;
        if (track) {
            const toJump = queue.tracks.toArray().find(t => t.title.toLowerCase() === track.toLowerCase() || t.url === track);
            if (!toJump) return interaction.editReply({ content: await Translate(`Could not find <${track}> <${interaction.member}>... try using the full name or URL? <❌>`) });

            queue.node.jump(toJump);
            trackName = toJump.title;
        } else {
            const index = number - 1;
            const target = queue.tracks.toArray()[index];
            if (!target) return interaction.editReply({ content: await Translate(`That track does not exist <${interaction.member}>... try again ? <❌>`) });

            queue.node.jump(index);
            trackName = target.title;
        }

        const jumpEmbed = new EmbedBuilder()
            .setAuthor({ name: await Translate(`Jumped to <${trackName}> <✅>`) })
            .setColor('#2f3136');

        return interaction.editReply({ embeds: [jumpEmbed] });
    }
};
