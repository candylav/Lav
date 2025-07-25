module.exports = {
    app: {
        token: process.env.TOKEN, // ✅ Utilise la variable d'environnement .env
        playing: 'i will never give up in you❤️',
        global: true,             // ✅ ne pas mettre entre guillemets
        guild: "",                // Optionnel : mets l’ID de ton serveur ici si tu veux lier localement
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
        leaveOnEmpty: false,               // ✅ Le bot reste dans le salon même s’il est seul
        leaveOnEmptyCooldown: 30000,
        leaveOnEnd: false,                 // ✅ Le bot reste après la fin d’une musique
        leaveOnEndCooldown: 30000,
        discordPlayer: {
            ytdlOptions: {
                quality: 'highestaudio',
                highWaterMark: 1 << 25
            }
        }
    }
};
