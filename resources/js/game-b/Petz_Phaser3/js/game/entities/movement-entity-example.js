import "../phaser.js";
import Entity from '../core/entity.js';
import  * as Input from '../core/System/input-handler.js';

import * as VectorMath from '../core/System/DataTypes/VectorTypes.js';

import {ProjectilePool} from "./projectiles/projectile-pool.js";

export default class MovementEntityExample extends Entity
    {
    constructor(scene, x, y, key, controls)
        {
        super(scene, x, y, key);

        //Movement
        this.velocity = new VectorMath.Vector2();
        this.movementSpeed = 100;

        //Update
        this.delta = 0;

        this.snowballs = new ProjectilePool(this.scene, "snowball", 10);
        this.body.setCollideWorldBounds();

        this.controls = controls;
        this.keys = controls.currentKeys;

        }

    move()
        {
        let h = Input.InputHandler.GetAxis(this.keys.right, this.keys.left);
        let v = Input.InputHandler.GetAxis(this.keys.down , this.keys.up);

        this.velocity.Set(h * this.movementSpeed, v * this.movementSpeed);
        this.setAcceleration(this.velocity.x, this.velocity.y);
        }

    movePosition(x, y)
        {
        let h = Input.InputHandler.GetAxis(this.keys.right, this.keys.left);
        let v = Input.InputHandler.GetAxis(this.keys.down , this.keys.up);

        }

    update(time, delta)
        {
        this.delta = delta;
        this.move();

        if (this.keys.jump !== undefined)
            if (Input.InputHandler.GetButtonUp(this.keys.jump))
                this.snowballs.SpawnProjectile(this.x, this.y, -300, 0);
        }

    }

