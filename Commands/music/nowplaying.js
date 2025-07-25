const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const { Translate } = require('../../process_tools');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('nowplaying')
        .setDescription('See what song is currently playing!'),

    voiceChannel: true,

    async execute(interaction) {
        await interaction.deferReply();
        const queue = useQueue(interaction.guild);
        if (!queue?.isPlaying()) return interaction.editReply({ content: await Translate(`No music currently playing <${interaction.member}>... try again ? <❌>`) });

        const track = queue.currentTrack;
        const methods = ['disabled', 'track', 'queue'];
        const trackDuration = track.duration === 'Infinity' ? 'infinity (live)' : track.duration;
        const progress = queue.node.createProgressBar();

        let EmojiState = interaction.client.config.app.enableEmojis;
        const emojis = interaction.client.config?.emojis;
        EmojiState = emojis && EmojiState;

        const embed = new EmbedBuilder()
            .setAuthor({ name: track.title, iconURL: interaction.client.user.displayAvatarURL({ size: 1024, dynamic: true }) })
            .setThumbnail(track.thumbnail)
            .setDescription(await Translate(`Volume <**${queue.node.volume}**%>\nDuration <**${trackDuration}**>\nProgress <${progress}>\nLoop mode <**${methods[queue.repeatMode]}**>\nRequested by <${track.requestedBy}>`))
            .setFooter({ text: await Translate('Music comes first - Made with heart by the Community <❤️>'), iconURL: interaction.member.avatarURL({ dynamic: true }) })
            .setColor('#2f3136')
            .setTimestamp();

        const saveButton = new ButtonBuilder()
            .setLabel(EmojiState ? emojis.savetrack : 'Save this track')
            .setCustomId('savetrack')
            .setStyle('Danger');

        const volumeup = new ButtonBuilder()
            .setLabel(EmojiState ? emojis.volumeUp : 'Volume Up')
            .setCustomId('volumeup')
            .setStyle('Primary');

        const volumedown = new ButtonBuilder()
            .setLabel(EmojiState ? emojis.volumeDown : 'Volume Down')
            .setCustomId('volumedown')
            .setStyle('Primary');

        const loop = new ButtonBuilder()
            .setLabel(EmojiState ? emojis.loop : 'Loop')
            .setCustomId('loop')
            .setStyle('Danger');

        const resumepause = new ButtonBuilder()
            .setLabel(EmojiState ? emojis.ResumePause : 'Resume & Pause')
            .setCustomId('resume&pause')
            .setStyle('Success');

        const row = new ActionRowBuilder().addComponents(volumedown, resumepause, volumeup, loop, saveButton);
        return interaction.editReply({ embeds: [embed], components: [row] });
    }
};