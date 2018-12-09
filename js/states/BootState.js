var BootState = {
    //initiate some game-level settings
    init: function() {
        //scaling options
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
        /* set scale ratio for assets to scale correctly on different devices with diff. resolutions
       then scale every asset according to this ratio:
       var scaleRatio = window.devicePixelRatio / 3;
       myAsset.scale.setTo(scaleRatio, scaleRatio);
        */

        // set the game boundaries
//        this.game.world.setBounds(0, 0, 640, 360);

    },
    preload: function() {
        this.load.image('preloadBar', 'assets/images/bar.png');
        this.load.image('logo', 'assets/images/logo.png');
    },
    create: function () {
        this.game.stage.backgroundColor = '#fff';

        this.state.start('PreloadState');
    }
}