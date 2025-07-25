const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { QueryType, useMainPlayer } = require('discord-player');
const { Translate } = require('../../process_tools');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('search')
        .setDescription('Search a song')
        .addStringOption(option =>
            option.setName('song')
                .setDescription('The song you want to search')
                .setRequired(true)),

    voiceChannel: true,

    async execute(interaction) {
        await interaction.deferReply();

        const player = useMainPlayer();
        const song = interaction.options.getString('song');

        const res = await player.search(song, {
            requestedBy: interaction.member,
            searchEngine: QueryType.AUTO
        });

        if (!res?.tracks.length) {
            return interaction.editReply({ content: await Translate(`No results found <${interaction.member}>... try again ? <❌>`) });
        }

        const queue = player.nodes.create(interaction.guild, {
            metadata: { channel: interaction.channel },
            spotifyBridge: interaction.client.config.opt.spotifyBridge,
            volume: interaction.client.config.opt.defaultvolume,
            leaveOnEnd: interaction.client.config.opt.leaveOnEnd,
            leaveOnEmpty: interaction.client.config.opt.leaveOnEmpty
        });

        const maxTracks = res.tracks.slice(0, 10);

        const embed = new EmbedBuilder()
            .setColor('#2f3136')
            .setAuthor({ name: await Translate(`Results for <${song}>`), iconURL: interaction.client.user.displayAvatarURL({ size: 1024, dynamic: true }) })
            .setDescription(await Translate(`${maxTracks.map((track, i) => `**${i + 1}**. ${track.title} | ${track.author}`).join('\n')}\n\n> Select a number between <**1**> and <**${maxTracks.length}**> or type <**cancel**>`))
            .setTimestamp()
            .setFooter({ text: await Translate('Music comes first - Made with heart by the Community <❤️>'), iconURL: interaction.member.avatarURL({ dynamic: true }) });

        await interaction.editReply({ embeds: [embed] });

        const collector = interaction.channel.createMessageCollector({
            time: 15000,
            max: 1,
            errors: ['time'],
            filter: m => m.author.id === interaction.member.id
        });
