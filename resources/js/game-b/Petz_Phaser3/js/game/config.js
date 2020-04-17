//Phaser
import './phaser.js';

//Initialize
export default
    {
    width: 1024,
    height: 768,

    type: Phaser.AUTO,
    parent: 'pet-game',

    resolution : 1,
    pixelArt: true,

    physics:
        {
        default: 'arcade',
        arcade:
            {
            gravity: {y: 0},
            debug: true
            }
        },


    };
