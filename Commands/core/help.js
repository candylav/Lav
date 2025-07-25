const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { Translate } = require('../../process_tools');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('All the commands this bot has!'),

    showHelp: false,

    async execute(interaction) {
        await interaction.deferReply();

        const commands = interaction.client.commands.filter(x => x.showHelp !== false);

        const embed = new EmbedBuilder()
            .setColor('#ff0000')
            .setAuthor({ name: interaction.client.user.username, iconURL: interaction.client.user.displayAvatarURL({ size: 1024, dynamic: true }) })
            .setDescription(await Translate('This code comes from a <GitHub> project <[ZerioDev/Music-bot](https://github.com/ZerioDev/Music-bot)>.<\n>The use of this one is possible while keeping the credits for free.<\n>If you want to remove the credits join the Discord support server. <[here](https://discord.gg/5cGSYV8ZZj)>'))
            .addFields([{ name: `Enabled - ${commands.size}`, value: commands.map(x => `\`${x.data.name}\``).join(' | ') }])
            .setTimestamp()
            .setFooter({ text: await Translate('Music comes first - Made with heart by the Community <❤️>'), iconURL: interaction.member.avatarURL({ dynamic: true }) });

        return interaction.editReply({ embeds: [embed] });
    }
};