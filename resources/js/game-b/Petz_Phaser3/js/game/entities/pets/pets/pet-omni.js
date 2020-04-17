import {PetBase} from "../pet-base.js";

export default class OmniPet extends PetBase
    {
    constructor(scene, atlas)
        {
        if (atlas === undefined)
            atlas = "pet-boinko";

        super(scene, atlas,
            {
                name : "Boinko",
                atlas : atlas
            });
        }

    createAnimations()
        {
        super.createAnimations();

        let animKey = this.texture.key;

        let idleAnim =
            {
                key : 'pet-idle',
                frames:
                    [
                        {
                            key: animKey,
                            frame : "idle_1",
                            duration : 500,
                        },
                        {
                            key: animKey,
                            frame : "idle_2",
                            duration : 500
                        },
                        {
                            key: animKey,
                            frame : "idle_3",
                            duration : 500
                        },
                        {
                            key: animKey,
                            frame : "idle_4",
                            duration : 500
                        },
                        {
                            key: animKey,
                            frame : "idle_5",
                            duration : 500
                        },
                        {
                            key: animKey,
                            frame : "idle_6",
                            duration : 500
                        },
                        {
                            key: animKey,
                            frame : "idle_7",
                            duration : 500
                        },
                    ],
                frameRate: 2,
                repeat   : -1
            };

        let sadAnim =
            {
                key : 'pet-sad',
                frames:
                    [
                        {
                            key: animKey,
                            frame : "sad_1",
                            duration : 500,
                        },
                        {
                            key: animKey,
                            frame : "sad_2",
                            duration : 500
                        },
                        {
                            key: animKey,
                            frame : "sad_3",
                            duration : 500
                        },
                    ],
                frameRate: 2,
                repeat   : -1
            };

        let hungryAnim =
            {
                key : 'pet-hungry',
                frames:
                    [
                        {
                            key: animKey,
                            frame : "hungry_1",
                            duration : 500,
                        },
                        {
                            key: animKey,
                            frame : "hungry_2",
                            duration : 500
                        },
                        {
                            key: animKey,
                            frame : "hungry_3",
                            duration : 500
                        }
                    ],
                frameRate: 2,
                repeat   : -1
            };

        let actionAnim =
            {
                key : 'pet-action',
                frames:
                    [
                        {
                            key: animKey,
                            frame : "action_1",
                            duration : 500,
                        },
                        {
                            key: animKey,
                            frame : "action_2",
                            duration : 500
                        },
                        {
                            key: animKey,
                            frame : "action_3",
                            duration : 500
                        }
                    ],
                frameRate : 6,
                repeat   : -1
            };

        let sleepAnim =
            {
                key : 'pet-sleep',
                frames:
                    [
                        {
                            key: animKey,
                            frame : "sleep_1",
                            duration : 500,
                        },
                        {
                            key: animKey,
                            frame : "sleep_2",
                            duration : 500
                        },
                    ],
                frameRate: 2,
                repeat   : -1
            };

        let happyAnim =
            {
                key : 'pet-happy',
                frames:
                    [
                        {
                            key: animKey,
                            frame : "happy_1",
                            duration : 500,
                        },
                        {
                            key: animKey,
                            frame : "happy_2",
                            duration : 500
                        },
                    ],
                frameRate: 2,
                repeat   : -1
            };

        let anims = [
            idleAnim,
            sadAnim,
            hungryAnim,
            actionAnim,
            sleepAnim,
            happyAnim]

        if (this.scene.anims !== undefined)
            {
            for (let i = 0; i < anims.length; i++)
                {
                if (this.scene.anims.exists(anims[i].key))
                    {
                    this.scene.anims.remove(anims[i].key);
                    console.log("Removed animation " + anims[i].key);
                    }
                }
            }

        this.addAnimations(anims);

        this.playAnimation("pet-idle");
        }
    }