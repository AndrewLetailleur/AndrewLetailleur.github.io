import "../../phaser.js";
import Entity from "../../core/entity.js";
import config from "../../../game/config.js";

let ry;

export class CarEntity extends Entity
{
    constructor(scene, x, y, key)
    {
        super(scene, x, y, key);
        ry = y;

        this.timer = 0;
    }

    //Update the velocity of the projectile
    //Check https://rexrainbow.github.io/phaser3-rex-notes/docs/site/arcade-gameobject/
    //for all the data applied
    SetVelocityX(velocityX)
    {
        this.body.reset(this.body.x, this.body.y);

        this.setActive(true);
        this.setVisible(true);

        this.setVelocityX(velocityX);//zero y velocity. Unused
        this.displayWidth *= Math.sign(this.velocityX);
    }
    //Use this to run update
    preUpdate(time, delta)
    {
        super.preUpdate(time, delta);

        //Update value to show text updating example
        this.timer += delta;



    }
}