const { EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const { Translate } = require('../../process_tools');

module.exports = async (client, inter) => {
    await inter.deferReply({ ephemeral: true });

    if (inter.isChatInputCommand()) {
        const DJ = client.config.opt.DJ;
        const command = client.commands.get(inter.commandName);

        const errorEmbed = new EmbedBuilder().setColor('#ff0000');

        if (!command) {
            errorEmbed.setDescription(await Translate('<❌> | Error! Please contact Developers!'));
            inter.editReply({ embeds: [errorEmbed], ephemeral: true });
            return client.slash.delete(inter.commandName);
        }

        if (command.permissions && !inter.member.permissions.has(command.permissions)) {
            errorEmbed.setDescription(await Translate(`<❌> | You don't have permission to use this command.`));
            return inter.editReply({ embeds: [errorEmbed], ephemeral: true });
        }

        if (DJ.enabled && DJ.commands.includes(command) && !inter.member._roles.includes(inter.guild.roles.cache.find(x => x.name === DJ.roleName)?.id)) {
            errorEmbed.setDescription(await Translate(`<❌> | This command is reserved for members with the role <\`${DJ.roleName}\`>`));
            return inter.editReply({ embeds: [errorEmbed], ephemeral: true });
        }

        if (command.voiceChannel) {
            if (!inter.member.voice.channel) {
                errorEmbed.setDescription(await Translate(`<❌> | You are not in a voice channel.`));
                return inter.editReply({ embeds: [errorEmbed], ephemeral: true });
            }

            if (inter.guild.members.me.voice.channel && inter.member.voice.channel.id !== inter.guild.members.me.voice.channel.id) {
                errorEmbed.setDescription(await Translate(`<❌> | You are not in the same voice channel as me.`));
                return inter.editReply({ embeds: [errorEmbed], ephemeral: true });
            }
        }

        // ✅ LA CORRECTION EST ICI
        await command.execute(inter);
    }

    else if (inter.isMessageComponent()) {
        const customId = inter.customId;
        if (!customId) return;

        const queue = useQueue(inter.guild);
        const path = `../../buttons/${customId}.js`;

        delete require.cache[require.resolve(path)];
        const button = require(path);
        if (button) return button({ client, inter, customId, queue });
    }
};
