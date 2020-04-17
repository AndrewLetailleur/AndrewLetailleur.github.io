import '../../phaser.js';
import config from '../../config.js';
import Game from '../snowball-game-scene.js';

class GameHandler extends Phaser.Game
    {
    constructor()
        {
        super(config);

        this.scene.add('Game', Game);
        this.scene.start('Game');
        }
    }

window.game = new GameHandler();