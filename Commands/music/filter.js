const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { AudioFilters, useQueue } = require('discord-player');
const { Translate } = require('../../process_tools');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('filter')
        .setDescription('Add a filter to your track')
        .addStringOption(option =>
            option.setName('filter')
                .setDescription('The filter you want to add')
                .setRequired(true)
                .addChoices(...Object.keys(AudioFilters.filters).slice(0, 25).map(f => ({ name: f, value: f })))
        ),

    voiceChannel: true,

    async execute(interaction) {
        await interaction.deferReply();
        const queue = useQueue(interaction.guild);
        if (!queue?.isPlaying()) return interaction.editReply({ content: await Translate(`No music currently playing <${interaction.member}>... try again ? <❌>`) });

        const actualFilter = queue.filters.ffmpeg.getFiltersEnabled()[0];
        const selectedFilter = interaction.options.getString('filter');

        const filters = [
            ...queue.filters.ffmpeg.getFiltersDisabled(),
            ...queue.filters.ffmpeg.getFiltersEnabled(),
        ];

        const filter = filters.find(x => x.toLowerCase() === selectedFilter.toLowerCase());

        let msg = await Translate(`This filter doesn't exist <${interaction.member}>... try again ? <❌>`);
        if (actualFilter) msg += `\n` + await Translate(`Filter currently active: <**${actualFilter}**>`);
        msg += `\n` + await Translate(`List of available filters:`);
        filters.forEach(f => msg += `\n- **${f}**`);

        if (!filter) return interaction.editReply({ content: msg });

        await queue.filters.ffmpeg.toggle(filter);

        const filterEmbed = new EmbedBuilder()
            .setAuthor({ name: await Translate(`The filter <${filter}> is now <${queue.filters.ffmpeg.isEnabled(filter) ? 'enabled' : 'disabled'}> <✅> *Reminder: the longer the music is, the longer this will take.*`) })
            .setColor('#2f3136');

        return interaction.editReply({ embeds: [filterEmbed] });
    }
};
