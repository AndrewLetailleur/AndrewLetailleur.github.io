import '../../phaser.js';
import config from '../../config.js';
import Game from '../fetch-game-scene.js';

class GameHandler extends Phaser.Game
    {
    constructor()
        {
        super(config);

        //----Testing----
        //this.scene.add('Game_UI', Game_UI);
        this.scene.add('Game'   , Game);
        //---------------
        this.scene.start('Game');
        }
    }

window.game = new GameHandler();