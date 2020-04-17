import config from "../../config.js";

import * as Input from "../../core/System/input-handler.js";
import * as VectorMath from "../../core/System/DataTypes/VectorTypes.js";

import Entity from "../../core/entity.js";
import {ProjectilePool} from "../projectiles/projectile-pool.js";

export default class SnowballPlayer extends Entity
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

        this.snowballs = new ProjectilePool(this.scene, "snowball", 3);
        this.body.setCollideWorldBounds();

        this.controls = controls;
        this.keys = controls.currentKeys;

        this.b_time = 0;
        }

    move() {
    let h = Input.InputHandler.GetAxis(this.keys.right, this.keys.left);
    let v = Input.InputHandler.GetAxis(this.keys.down , this.keys.up);

    this.velocity.Set(h * this.movementSpeed, v * this.movementSpeed);
    this.setAcceleration(this.velocity.x, this.velocity.y);
    }

    update(time, delta)
        {
        this.delta = delta;
        this.move();

        if (Input.InputHandler.GetButtonDown(this.keys.jump) && this.b_time < time)
            {
            if (this.snowballs.hasFreeSpace)
                {
                this.b_time = 100 + time;//throwSFX.play();

                if (this.x > config.width / 2)
                    this.snowballs.SpawnProjectile(this.x - 35, this.y, -350, this.body.velocity.y);
                else
                    this.snowballs.SpawnProjectile(this.x + 35, this.y, 350, this.body.velocity.y);

                this.scene.sound.play("throw");
                }
            }
        }
    }

