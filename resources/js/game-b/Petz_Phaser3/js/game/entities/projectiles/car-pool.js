import "../../phaser.js"
import {ObjectPool} from "../../core/System/Pooling/ObjectPool.js";
import {CarEntity} from "../projectiles/car-entity.js";
//replace with car entity
export class CarPool extends ObjectPool
    {
    constructor(scene, key, amount)
        {
        super(scene, key, CarEntity, amount);
        }

    SpawnCar(x, y, velocityX)
        {
        let object = this.getFirstDead(true, x, y);

        if (object !== null)
            {
            if (object.parent === undefined)
                object.parent = this;

            object.enableBody(false, x, y, true, true);
            object.setVelocity(velocityX, 0);

            if (object.components !== null)
                {
                object.components.map().forEach(function(component)
                    {
                    component.setActive(true);
                    component.setVisible(true);
                    });
                }
            }
        }

    get hasFreeSpace()
        {
        return this.getTotalUsed() !== this.maxSize;
        }
    }