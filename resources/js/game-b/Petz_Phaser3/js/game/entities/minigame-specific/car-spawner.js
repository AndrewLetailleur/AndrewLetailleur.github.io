import "../../phaser.js";
import Entity from '../../core/entity.js';
import config from "../../config.js";//not needed atm?

import * as VectorMath from '../../core/System/DataTypes/VectorTypes.js';
import {CarPool} from "../projectiles/car-pool.js";

let x_var;
let s_timer;//Phaser.time;
//let throwSFX;

export default class CarSpawner extends Entity
{
    constructor(scene, x, y, key, carKey)//controls. If elder bugs happen, add it in
    {//note to self, super makes the 'entity' version of this.
    //whilst constructor 'grabs' the values, for later use. Thus, car keys.
        super(scene, x, y, key);
        x_var = 200;
        //load audio on player end, test wise. 
        //Movement
        this.velocity = new VectorMath.Vector2();
        this.movementSpeed = 100;

        //Update this.delta = 0;

        this.car = new CarPool(this.scene, carKey, 8);
        //this.body.setCollideWorldBounds();

        this.rngTime(s_timer);
    }

    rngTime(timer){ timer = Phaser.Math.Between(3000, 30000); }

    update(time, delta) {
        s_timer -= delta;//        this.move();
        //console.log (s_timer);
        if (s_timer <= 0) {
            console.log("SpawnTime!");
            this.rngTime(s_timer);
            if (this.x > config.width/2)
                this.car.SpawnCar(this.x - 16, this.y, -x_var);
            else
                this.car.SpawnCar(this.x + 16, this.y, x_var);
        }
    }
}
