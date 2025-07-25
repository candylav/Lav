const { QueueRepeatMode } = require('discord-player');
const { Translate } = require('../process_tools');

module.exports = async ({ inter, queue }) => {
    const methods = ['disabled', 'track', 'queue'];

    // ✅ différer la réponse si elle n'a pas encore été envoyée
    if (!inter.deferred && !inter.replied) {
        await inter.deferReply();
    }

    if (!queue?.isPlaying()) {
        return inter.editReply({ content: await Translate(`No music currently playing... try again ? <❌>`) });
    }

    if (queue.repeatMode === 2) {
        queue.setRepeatMode(QueueRepeatMode.OFF);
    } else {
        queue.setRepeatMode(queue.repeatMode + 1);
    }

    return inter.editReply({ content: await Translate(`Loop mode has been set to <**${methods[queue.repeatMode]}**>.<✅>`) });
}
