import Entity from "../../../core/entity.js";

export default class FishEntity extends Entity
    {
    constructor(scene, x, y, key)
        {
        super(scene, x, y, key);

        let frame = Phaser.Math.Between(0, scene.textures.get(key).frameTotal - 2);

        this.value = 0;

        if (frame === 2 || frame === 6)
            this.value = -1;
        else
            this.value = 1;

        this.setTexture(key, frame);
        this.body.setSize(this.displayWidth/4*3, this.displayHeight/4*3);

        }

    preUpdate(time, delta)
        {
        this.y = this.y + (Math.sin(time/1000)/delta);
        this.x = this.x + (Math.cos(time/1000)/100);
        }
    }