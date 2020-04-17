import "../../phaser.js"
import {ObjectPool} from "../../core/System/Pooling/ObjectPool.js";
import {Projectile} from "../projectiles/projectile.js";

export class ProjectilePool extends ObjectPool
    {
    constructor(scene, key, amount)
        {
        //{Scene, Object Key, ObjectType, Number to Spawn}
        super(scene, key, Projectile, amount);
        }

    SpawnProjectile(x, y, velocityX, velocityY)
        {
        let object = this.getFirstDead(true, x, y);


        if (object !== null)
            {
            if (object.parent === undefined)
                object.parent = this;

            object.enableBody(false, x, y, true, true);
            object.setVelocity(velocityX, velocityY);

            if (object.components !== null)
                {
                object.components.map.forEach(function(component)
                    {
                    component.setActive(true);
                    component.setVisible(true);
                    });
                }
            }
        }


    }