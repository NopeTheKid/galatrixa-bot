module.exports = {
    app: {
        token: 'MTA0MjQ0ODk2NTExNjg5MTIxNg.GnEWoP.5gFFr1uuJ24Golel_blMXTFoCcx6pVKXxS2c9g',
        playing: 'Vai tu',
        global: false,
        guild: '492389092428873739'
    },

    opt: {
        DJ: {
            enabled: false,
            roleName: '',
            commands: []
        },
        maxVol: 100,
        leaveOnEnd: true,
        loopMessage: false,
        spotifyBridge: true,
        defaultvolume: 100,
        discordPlayer: {
            ytdlOptions: {
                quality: 'highestaudio',
                highWaterMark: 1 << 25
            }
        }
    }
};
