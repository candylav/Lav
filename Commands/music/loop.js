const { SlashCommandBuilder, ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const { QueueRepeatMode, useQueue } = require('discord-player');
const { Translate } = require('../../process_tools');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('loop')
        .setDescription("Toggle looping modes")
        .addStringOption(option =>
            option.setName('action')
                .setDescription('Choose loop mode')
                .setRequired(true)
                .addChoices(
                    { name: 'Queue', value: 'enable_loop_queue' },
                    { name: 'Disable', value: 'disable_loop' },
                    { name: 'Song', value: 'enable_loop_song' },
                    { name: 'Autoplay', value: 'enable_autoplay' }
                )),

    voiceChannel: true,

    async execute(interaction) {
        await interaction.deferReply();
        const queue = useQueue(interaction.guild);
        if (!queue?.isPlaying()) return interaction.editReply({ content: await Translate(`No music currently playing <${interaction.member}>... try again ? <❌>`) });

        const action = interaction.options.getString('action');
        let baseEmbed = new EmbedBuilder().setColor('#2f3136');

        switch (action) {
            case 'enable_loop_queue':
                if (queue.repeatMode === QueueRepeatMode.TRACK) return interaction.editReply({ content: await Translate(`You must first disable the current track loop mode (/loop Disable) <${interaction.member}>`) });
                queue.setRepeatMode(QueueRepeatMode.QUEUE);
                baseEmbed.setAuthor({ name: await Translate(`Repeat mode enabled: queue will loop <🔁>`) });
                break;
            case 'disable_loop':
                queue.setRepeatMode(QueueRepeatMode.OFF);
                baseEmbed.setAuthor({ name: await Translate(`Repeat mode disabled <❌>`) });
                break;
            case 'enable_loop_song':
                if (queue.repeatMode === QueueRepeatMode.QUEUE) return interaction.editReply({ content: await Translate(`You must first disable queue loop mode (/loop Disable) <${interaction.member}>`) });
                queue.setRepeatMode(QueueRepeatMode.TRACK);
                baseEmbed.setAuthor({ name: await Translate(`Repeat mode enabled: current song will loop <🔁>`) });
                break;
            case 'enable_autoplay':
                queue.setRepeatMode(QueueRepeatMode.AUTOPLAY);
                baseEmbed.setAuthor({ name: await Translate(`Autoplay enabled: similar songs will queue automatically <🔁>`) });
                break;
        }

        return interaction.editReply({ embeds: [baseEmbed] });
    }
};