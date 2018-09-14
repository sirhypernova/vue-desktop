const { Canvas } = require('canvas-constructor');
const fsn = require('fs-nextra');
const { Attachment } = require('discord.js');
const fetch = require('node-fetch');
// const image = new jimp(512,256);
// const image = new jimp(512,128);

module.exports = {
    roles: ['owner'],
    help: 'User Info',
    handler: async function (msg,args,dj) {
        var background = this.data.background;
        
        var image = new Canvas(512,256)
            .addImage(background,0,0,512,256);
        // const image = await jimp.read('images/template.png');
        // const mask = this.data.mask;
        var avatar = await fetch(msg.author.displayAvatarURL).then(res => res.buffer());
        image
        .setShadowColor('rgba(22, 22, 22, 1)') // This is a nice colour for a shadow.
        .setShadowOffsetY(5) // Drop the shadow by 5 pixels.
        .setShadowBlur(10) // Blur the shadow by 10.
        .save()
        .setColor('#2C2F33')
        .addRoundImage(avatar,16,16,128,128,64)
        // .addCircle(80,80,68)
        .restore()
        // avatar.resize(96,96);
        // avatar.mask(mask,0,0);
        // image.composite(avatar, 16, 16);

        // var username = msg.author.username.substring(0,13);
        // var activity = 'Playing - ';
        // if (msg.author.presence.game) {
        //     if (msg.author.presence.game.type == 1) activity = 'Streaming - '
        //     if (msg.author.presence.game.type == 2) activity = 'Listening to '
        //     if (msg.author.presence.game.type == 3) activity = 'Watching - '
        // }
        // const playing = `${activity}${msg.author.presence.game ? msg.author.presence.game.name : 'Nothing'}`.substring(0,24);
        // image.print(this.data.nameFont,128,20,username)
        // image.print(this.data.discrimFont,114,73,'#'+msg.author.discriminator);
        // image.print(this.data.statsFont,220,83,playing);
        //     if (err) return console.log(err);
        msg.channel.send(new Attachment(await image.toBufferAsync(),'profile.png'));
    },
    onLoad: async function (command) {
        this.data.background = await fsn.readFile('images/space.jpg');
    },
    falseHandler: function (msg,args,dj) {
        msg.channel.send('no u');
    }
}