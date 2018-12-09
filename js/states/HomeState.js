export default {

    init: function(message) {
        this.message = message;
    },

    create: function() {
/*        this.background =  new Rectangle(0, 0, this.game.world.width, this.game.world.height, 'background');
        var background = game.add.graphics(this.game.world.width, this.game.world.height);
        // draw a rectangle
        background.lineStyle(2, 0x0000FF, 1);
        background.drawRect(50, 250, 100, 100);

        var background = this.game.add.sprite(0, 0, 'backyard');
        background.inputEnabled = true;
*/
        this.state.start('GameState');

        var style = {font: '35px Arial', fill: '#000'};
        this.game.add.text(30, this.game.world.centerY + 100, 'TOUCH TO START', style);

        // display message from previous level, if any
        if(this.message) {
            this.game.add.text(60, this.game.world.centerY - 100, this.message, style);

        }
    }
};