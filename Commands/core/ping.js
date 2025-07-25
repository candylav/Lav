const { SlashCommandBuilder } = require('discord.js');
const ms = require('ms');
const { Translate } = require('../../process_tools');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Get the ping of the bot!'),

    async execute(interaction) {
        await interaction.deferReply();

        const ping = Math.round(interaction.client.ws.ping);
        const heartbeatAgo = ms(Date.now() - interaction.client.ws.shards.first().lastPingTimestamp, { long: true });

        return interaction.editReply(await Translate(`Pong! API Latency is <${ping}ms 🛰️>, last heartbeat calculated <${heartbeatAgo}> ago`));
    }
};