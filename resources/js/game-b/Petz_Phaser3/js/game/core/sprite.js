import '../phaser.js';

/* Sprite with Collisions */
export default class Sprite extends Phaser.GameObjects.Sprite
    {
    constructor(scene, x, y, key)
        {
        //Call base
        super(scene, x, y, key);

        //Updating Data
        this.oldX = 0;
        this.oldY = 0;

        //Finally Add to the Scene
        this.scene.add.existing(this);

        }

    //Positions
    SetPosition(x, y, isPositionRelative = true)
        {
        if (isPositionRelative)
            {
            x += this.x;
            y += this.y;
            }

        this.x = x;
        this.y = y;
        }

    SetOldXY()
        {
        this.oldX = this.x;
        this.oldY = this.y;
        }

    //Helpers
    get GetX()
        {
        return this.x;
        }

    get GetY()
        {
        return this.y;
        }
    }