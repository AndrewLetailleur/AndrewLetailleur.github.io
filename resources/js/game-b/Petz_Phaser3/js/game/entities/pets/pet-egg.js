import config from "../../config.js";

import * as TextStyle from "../../core/UI/styles/text-styles.js";

import {PetEntity} from "./pet-entity.js";

export class PetEgg extends PetEntity
    {
    hatchHealth = 5; //Make the player click a few times to "crack and open the egg"
    isHatching = false;

    constructor(scene, atlas)
        {
        //Create anims
        super(scene, config.width/2, config.height*0.75, atlas,
            {
            name : "Egg",
            atlas : atlas
            });
        //
        this.CreateAnimations();
        this.playAnimation("egg-idle");
        //
        let text = this.components.add('text',
        this.scene.add.text(this.x, this.y - this.displayHeight/2,
        "Hatch your new Pet!"));
        text.setOrigin(0.5, 0.5);
        text.setStyle(TextStyle.LargeHeader);

        this.on('pointerdown', () =>
            {
            if (this.isHatching)
                return;

            if (this.hatchHealth > 0)
                {
                //Create new pet and handle stats and setup
                this.hatchHealth --;
                 this.playAnimation('egg-shake');
                }
            else
                {
                this.scene.events.emit("pet-hatched");
                }
            });

        }

    CreateAnimations()
        {
        let idleAnim =
            {
                key : 'egg-idle',
                frames:
                    [
                        {
                        key: 'pet-egg',
                        frame : "egg_static_1",
                        duration : 1000,
                        },
                        {
                        key: 'pet-egg',
                        frame : "egg_bounce",
                        duration : 10
                        },
                        {
                        key: 'pet-egg',
                        frame: "egg_squash",
                        duration : 10
                        },
                    ],
                frameRate: 5,
                repeat   : -1
            };

        let shakeAnim =
            {
                key : 'egg-shake',
                frames:
                    [
                        {
                        key: 'pet-egg',
                        frame : "egg_shake_1",
                        duration : 1,
                        },
                        {
                        key: 'pet-egg',
                        frame : "egg_shake_2",
                        duration : 1
                        },
                    ],
                frameRate: 5,
                repeat   : 3
            };

        let hatchAnim =
            {
                key : 'egg-hatch',
                frames:
                    [{
                    key: 'pet-egg',
                    frame : "egg_bounce",
                    duration : 10,
                    },
                    {
                    key: 'pet-egg',
                    frame : "egg_static_2",
                    duration : 50
                    },
                    {
                    key: 'pet-egg',
                    frame: "egg_squash",
                    duration : 10
                    },
                    {
                    key: 'pet-egg',
                    frame : "egg_bounce",
                    duration : 10,
                    },
                    {
                    key: 'pet-egg',
                    frame : "egg_static_2",
                    duration : 50
                    },
                    {
                    key: 'pet-egg',
                    frame: "egg_squash",
                    duration : 10
                    },
                    {
                    key: 'pet-egg',
                    frame : "egg_shake_1",
                    duration : 50,
                    },
                    {
                    key: 'pet-egg',
                    frame : "egg_shake_2",
                    duration : 50
                    },
                    {
                    key: 'pet-egg',
                    frame : "egg_shake_1",
                    duration : 500,
                    },
                    {
                    key: 'pet-egg',
                    frame : "egg_shake_2",
                    duration : 500
                    },
                    {
                    key: 'pet-egg',
                    frame : "egg_static_2",
                    duration : 500
                    },
                    {
                    key: 'pet-egg',
                    frame : "egg_crack",
                    duration : 1000
                    },
                    ],
                frameRate: 5,
                repeat   : 0
            };

        this.addAnimations([idleAnim, shakeAnim, hatchAnim]);

        this.getAnimation('egg-shake').on('complete', function(anim, frame, object)
            {
            if (object.hatchHealth > 0)
                {
                object.play("egg-idle");
                }
            else
                {
                object.components.get('text').text = "Oh...?";

                if (!object.isHatching)
                    {
                    object.isHatching = true;
                    object.play('egg-shake');
                    }
                else
                    object.play('egg-hatch');
                }
            });

        this.getAnimation('egg-hatch').on('complete', function(anim, frame, object)
            {
            //object.play("egg-idle");

            //object.anims.destroy();
            object.scene.events.emit("pet-hatched");
            });
        }
    }