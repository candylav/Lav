require('dotenv').config();

module.exports = {
    app: {
        token: process.env.TOKEN, // ✅ Token du bot
        clientId: process.env.CLIENT_ID, // ✅ ID de l'application Discord
        playing: 'i will never give up in you❤️',
        global: true,
        guild: "", // Optionnel : mets l’ID de ton serveur ici si tu veux tester localement
        extraMessages: false,
        loopMessage: false,
        lang: 'en',
        enableEmojis: false,
    },

    emojis: {
        back: '⏪',
        skip: '⏩',
        ResumePause: '⏯️',
        savetrack: '💾',
        volumeUp: '🔊',
        volumeDown: '🔉',
        loop: '🔁',
    },

    opt: {
        DJ: {
            enabled: false,
            roleName: '',
            commands: []
        },
        Translate_Timeout: 10000,
        maxVol: 100,
        spotifyBridge: true,
        volume: 75,
        leaveOnEmpty: false,
        leaveOnEmptyCooldown: 30000,
        leaveOnEnd: false,
        leaveOnEndCooldown: 30000,
        discordPlayer: {
            ytdlOptions: {
                quality: 'highestaudio',
                highWaterMark: 1 << 25
            }
        }
    }
};
