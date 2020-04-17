import '../../phaser.js';
import {ComponentMap} from "../CustomCollections/ComponentMap.js";

export class Image extends Phaser.GameObjects.Image
    {
    constructor(scene, x, y, key)
        {
        super(scene, x, y, key);
        scene.add.existing(this);

        this.components = new ComponentMap();
        }

    SendToBack()
        {
        this.depth = -9999;
        }

    MoveDown()
        {
        this.depth -= 1;
        }

    SetPosition(x, y)
        {
        this.x = x;
        this.y = y;
        }
    }
