import '../phaser.js';
import config from "../config.js";
import {ComponentMap} from "./CustomCollections/ComponentMap.js";
import {Vector2} from "./System/DataTypes/VectorTypes.js";

/* ********************** */
/* Sprite with Collisions */
/* ********************** */
export default class Entity extends Phaser.Physics.Arcade.Sprite
    {
    constructor(scene, x, y, key, bodyType = 0)
        {
        //Laziness, just switches it over so Phaser is happy
        //Null = no value
        //Undefined = declared but undefined
        if (key === null)
            key = undefined;

        //Basics
        super(scene, x, y, key);

        //Set position
        this.SetPosition(x, y, false);
        this.setOrigin(0.5, 0.5); //Center on position as default

        //Updating Data
        this.oldX = x;
        this.oldY = y;

        //Add to the Scene
        this.scene.physics.world.enable(this, bodyType);
        this.scene.add.existing(this);

        if (bodyType === 1)
            this.refreshBody();

        //Component Collection
        this.components = new ComponentMap();
        }

    //Checks
    IsOutOfBounds()
        {
        let widthHalf = this.width/2;
        let heightHalf = this.height/2;

        return this.x < 0 - widthHalf
            || this.x > config.width  + widthHalf
            || this.y > config.height + heightHalf
            || this.y < 0 - heightHalf;
        }

    // Position and Movement
    SetPosition(x, y, isPositionRelative = true)
        {
        if (isPositionRelative)
            {
            x += this.x;
            y += this.y;
            }

        this.x = x;
        this.y = y;
        }

    AddOverlap(otherObject, callback = undefined)
        {
        this.scene.physics.add.overlap(this, otherObject, callback, null, this.scene);
        }

    AddCollision(other, callback)
        {
        this.scene.physics.add.collider(this, other, callback);
        }

    StopBody()
        {
        this.body.stop();
        this.body.setGravity(0, 0);
        }

    UpdateColliderDefaults()
        {
        this.body.reset(this.body.x, this.body.y);
        }

    DestroyAllComponents(destroySelf = false)
        {
        if (destroySelf)
            this.destroy();

        this.components.destroyChildren();
        }


    //--- Helpers ---//
    get GetX()
        {
        return this.x;
        }

    get GetY()
        {
        return this.y;
        }

    get GetPosition()
        {
        return new Vector2(this.x, this.y);
        }
    }