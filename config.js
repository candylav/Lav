require('dotenv').config();

module.exports = {
    app: {
        token: process.env.TOKEN,
        clientId: process.env.CLIENT_ID,
        playing: 'i will never give up in you❤️',
        global: false, // ❗️Désactivé pour enregistrer sur des serveurs spécifiques
        guilds: [ // ✅ Liste de tes serveurs
            "1398318999338750175",
            "1397746309296820235",
            "1276300982409494659",
            "1259695245784911902"
        ],
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
