module.exports = {
    app: {
        token: process.env.TOKEN, // ✅ Correspond à la variable définie dans Railway
        playing: 'i will never give up in you❤️',
        global: true,
        guild: "", // Optionnel : mets l’ID de ton serveur ici si tu veux restreindre les commandes
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
        leaveOnEmpty: false, // Le bot reste même seul
        leaveOnEmptyCooldown: 30000,
        leaveOnEnd: false,   // Le bot reste après la fin de la musique
        leaveOnEndCooldown: 30000,
        discordPlayer: {
            ytdlOptions: {
                quality: 'highestaudio',
                highWaterMark: 1 << 25
            }
        }
    }
};
