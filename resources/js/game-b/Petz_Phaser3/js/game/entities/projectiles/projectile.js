import "../../phaser.js";
import Entity from "../../core/entity.js";

export class Projectile extends Entity
    {
    constructor(scene, x, y, key)
        {
        super(scene, x, y, key);
        }

    //Update the velocity of the projectile
    //Check https://rexrainbow.github.io/phaser3-rex-notes/docs/site/arcade-gameobject/
    //for all the data applied
    SetVelocity(x = 0, y = 0, velocityX, velocityY)
        {
        this.body.reset(x, y);

        this.setActive(true);
        this.setVisible(true);

        this.setVelocity(velocityX, velocityY);
        }

    //Use this to run update
    preUpdate(time, delta)
        {
        super.preUpdate(time, delta);

        //Is the object out of bounds?
        if (this.IsOutOfBounds())
            {
            //Toggle this off
            this.setActive(false);  //Deactivate the object
            this.setVisible(false); //Hide the object

            //Do the same for each of the children
            this.components.disableChildren();
            }
        }
    }