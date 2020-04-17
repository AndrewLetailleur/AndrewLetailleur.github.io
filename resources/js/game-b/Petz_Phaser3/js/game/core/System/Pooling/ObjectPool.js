import "../../../phaser.js";

export class ObjectPool extends Phaser.Physics.Arcade.Group
    {
    constructor(scene, key, objectType, amount, isActive = false)
        {
        super(scene.physics.world, scene, {runChildUpdate : true});

        this.maxSize = amount;
        this.runChildUpdate = true;

        this.createMultiple({
            key             : key,

            frameQuantity   : amount,
            randomFrame     : true,

            active          : isActive ,
            visible         : isActive ,

            classType       : objectType,

            runChildUpdate  : true
            });

        }

    SpawnFreeObject(x, y)
        {
        let object = this.getFirstDead(true, x, y);

        if (object !== null)
            {
            object.enableBody(false, x, y, true, true);
            object.setVelocity(0, 0); //Storing here for legacy

            if (object.components !== undefined)
                {
                object.components.map.forEach(function(component)
                    {
                    component.setActive(true);
                    component.setVisible(true);
                    });
                }
            }

        return object;
        }

    get hasFreeSpace()
        {
        return this.getTotalUsed() !== this.maxSize;
        }

    get Count()
        {
        return this.children.size;
        }
    }