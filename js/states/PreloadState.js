var PreloadState = {
    preload: function() {
        //load the game assets before the game starts
        this.logo = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'logo');
        this.logo.anchor.setTo(0.5);

        this.preloadBar = this.add.sprite(this.game.centerX, this.game.world.centerY + 128, 'preloadBar');
        this.preloadBar.anchor.setTo(0.5);
        this.load.setPreloadSprite(this.preloadBar);

//        this.load.image('background', 'assets/images/background.png');
        this.circle = this.load.spritesheet('circle', 'assets/images/circle.png', 85, 85, 3);
//        this.circle.anchor.setTo(0.5);
//        this.circle.scale(0.5);
    },
    create: function() {
        this.state.start('HomeState');
    }
};