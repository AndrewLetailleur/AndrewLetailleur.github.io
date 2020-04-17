import '../../../phaser.js';
import Sprite from '../../sprite.js';

export class Button extends Sprite
    {
    constructor(scene, x, y, image, hoverImage, exitImage = "", clickImage= "", releaseImage= "", onClick)
        {
        //Game, Position, Image to Draw
        super(scene, x, y, image);

        //Add the button to the game
        this.scene.add.existing(this);

        //Interaction
        this.setInteractive();
        this.input.draggable = false;

        this.game = game;

        //Sprites
        this.overKey = hoverImage;
        this.outKey  = exitImage;
        this.downKey = clickImage;
        this.upKey   = releaseImage;

        let cbContext = onClick;

        //Events
        this.on('pointerout'  , this.onOut, this);
        this.on('pointerover' , this.onOver, this);
        this.on('pointerdown' , this.onDown, this);
        this.on('pointerup'   , this.onUp, this);

        this.onClickEvents = new Array(0);
        this.onHoverEvents = new Array(0);
        this.onOutEvents   = new Array(0);

        //States
        this.isOver = false;
        }

    onOver()
        {
        //console.log("Over");
        this.setFrame(this.overKey);

        for (let i = 0; i < this.onHoverEvents.length; i++)
            this.onHoverEvents[i]();
        }

    onOut()
        {
        //console.log("Left");
        this.setFrame(this.outKey);

        for (let i = 0; i < this.onOutEvents.length; i++)
            this.onOutEvents[i]();
        }

    onDown()
        {
        this.setFrame(this.downKey);

        for (let i = 0; i < this.onClickEvents.length; i++)
            this.onClickEvents[i]();
        }

    onUp()
        {
        this.setFrame(this.upKey);
        }
    }
