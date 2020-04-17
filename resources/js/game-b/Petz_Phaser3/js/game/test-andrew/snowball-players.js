import "../../game/phaser.js";
import Entity from '../core/entity.js';
import config from "../../../js/game/config.js";
import  * as Input from '../core/System/input-handler.js';

import * as VectorMath from '../core/System/DataTypes/VectorTypes.js';

import {ProjectilePool} from "../../game/entities/projectiles/projectile-pool.js";

let b_time;//Phaser.time;
//let throwSFX;

export default class MovementEntityExample extends Entity
{
    constructor(scene, x, y, key, controls)
    {
        super(scene, x, y, key);

        //load audio on player end, test wise. 
        //Movement
        this.velocity = new VectorMath.Vector2();
        this.movementSpeed = 100;

        //Update
        this.delta = 0;

        this.snowballs = new ProjectilePool(this.scene, "snowball", 10);
        this.body.setCollideWorldBounds();

        this.controls = controls;
        this.keys = controls.currentKeys;

        b_time = 0;
    }

    move() {
        let h = 0;//InputHandler.GetAxis(keys.right, keys.left);
        let v = Input.InputHandler.GetAxis(this.keys.down , this.keys.up);

        this.velocity.Set(h * this.movementSpeed, v * this.movementSpeed);
        this.setAcceleration(this.velocity.x, this.velocity.y);
    }

    update(time, delta) {
        this.delta = delta;
        this.move();

        if (Input.InputHandler.GetButtonUp(this.keys.jump) && b_time < time)
        {
            b_time = 100 + time;//throwSFX.play();
            if (this.x > config.width/2)
                this.snowballs.SpawnProjectile(this.x - 35, this.y, -300, 1 * this.velocity.y);
            else
                this.snowballs.SpawnProjectile(this.x + 35, this.y, 300, 1 * this.velocity.y);
        }
    }
}

