import "../../game/phaser.js";
import Entity from '../core/entity.js';
//import config from "../../../js/game/config.js";//not needed atm?
import * as Input from '../core/System/input-handler.js';

import * as VectorMath from '../core/System/DataTypes/VectorTypes.js';

let Timer;
//let throwSFX;
export default class MovementEntityExample extends Entity
{
    constructor(scene, x, y, key, controls)
    {
        super(scene, x, y, key);//note to self, make sure movement is uh... "Staged", if possible. "The same" if all else fails.
        //load audio on player end, test wise. 
        //Movement
        this.velocity = new VectorMath.Vector2();
        this.movementSpeed = 100;

        //Update
        this.delta = 0;

        this.body.setCollideWorldBounds();//buggy
        this.controls = controls;
        this.keys = controls.currentKeys;
        console.log(this.keys);
        console.log(this.controls);

        Timer = 0;
    }
    //*this is the buggy code*
    move() {
        let h = Input.InputHandler.GetAxis(this.keys.right, this.keys.left);
        let v = Input.InputHandler.GetAxis(this.keys.down , this.keys.up);

        //so see if you comment out let h. And just have it be v times

        this.velocity.Set(h * this.movementSpeed, v * this.movementSpeed);
        this.setAcceleration(this.velocity.x, this.velocity.y);
    }

    velocityZero(){
        this.velocity.Set(0,0);
    }

    update(time, delta) {
        this.delta = delta;
        this.move();//jump?
        Timer = 100 + time;
    }
}