import config from "../../config.js";
import {UI_STATES} from "../../scenes/main-pet-scene.js";

import {PetStates} from "./pet-entity.js";
import {PetEntity} from "./pet-entity.js";

import {Clamp} from "../../core/System/DataTypes/Math.js";
import {InputHandler} from "../../core/System/input-handler.js";

//Really obtuse name for the "main" class from a base entity
//Eh it's like that now, sorry about that
//~Damian
export class PetBase extends PetEntity
    {
    constructor(scene, atlas)
        {
        if (atlas === undefined)
            atlas = "pet-baby";

        super(scene, config.width/2, config.height*0.4, atlas,
            {
            name : "Youngling",
            atlas : atlas
            });

        this.createAnimations();

        //TODO: Remove from the object and call from scene. Scene should reference to the pet not the other way around.
        this.on("pointermove", () =>
            {

            // this.isInteractable = InputHandler.MouseDown(this.scene);
            //
            // if (this.isInteractable)
            //     {
                switch (scene.ui_scene.panelShown)
                    {
                    case UI_STATES.FEED:
                        this.petData.hunger = Clamp(this.petData.hunger + 0.15, 0, 100);
                        break;

                    case UI_STATES.CLEAN:
                        this.petData.clean  = Clamp(this.petData.clean + 0.3, 0, 100);
                        break;

                    case UI_STATES.NONE:

                        break;

                    default:

                        break;
                    }
            });
        }

    createAnimations()
        {
        super.createAnimations();

        let animKey = this.texture.key;

        let idleAnim =
            {
            key : 'idle',
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
                ],
            frameRate: 2,
            repeat   : -1
            };

        let sadAnim =
            {
                key : 'sad',
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
                    ],
                frameRate: 2,
                repeat   : -1
            };

        let hungryAnim =
            {
                key : 'hungry',
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
                    ],
                frameRate: 2,
                repeat   : -1
            };

        let actionAnim =
            {
                key : 'action',
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
                key : 'sleep',
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
                key : 'happy',
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

        let keyParse = animKey.substr(0, animKey.indexOf("-"));

        //console.log(`${keyParse} | Stage: ${this.petData.stage} | Str: ${this.petData.strength}`);

        switch (keyParse)
            {
            case "omni":
                switch (this.petData.stage + 1)
                    {
                    case 1:

                        idleAnim =
                            {
                                key : 'idle',
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
                                    ],
                                frameRate: 2,
                                repeat   : -1
                            };

                        sadAnim =
                            {
                                key : 'sad',
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

                        hungryAnim =
                            {
                                key : 'hungry',
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
                                        },
                                    ],
                                frameRate: 2,
                                repeat   : -1
                            };

                        actionAnim =
                            {
                                key : 'action',
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

                        sleepAnim =
                            {
                                key : 'sleep',
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

                        happyAnim =
                            {
                                key : 'happy',
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
                        break;

                    case 2:
                        idleAnim =
                            {
                                key : 'idle',
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
                                    ],
                                frameRate: 2,
                                repeat   : -1
                            };

                        sadAnim =
                            {
                                key : 'sad',
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
                                        {
                                            key: animKey,
                                            frame : "sad_4",
                                            duration : 500
                                        },
                                    ],
                                frameRate: 2,
                                repeat   : -1
                            };

                        hungryAnim =
                            {
                                key : 'hungry',
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
                                    ],
                                frameRate: 2,
                                repeat   : -1
                            };

                        actionAnim =
                            {
                                key : 'action',
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

                        sleepAnim =
                            {
                                key : 'sleep',
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

                        happyAnim =
                            {
                                key : 'happy',
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
                        break;

                    case 3:
                        idleAnim =
                            {
                                key : 'idle',
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
                                    ],
                                frameRate: 2,
                                repeat   : -1
                            };

                        sadAnim =
                            {
                                key : 'sad',
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
                                    ],
                                frameRate: 2,
                                repeat   : -1
                            };

                        hungryAnim =
                            {
                                key : 'hungry',
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
                                    ],
                                frameRate: 2,
                                repeat   : -1
                            };

                        actionAnim =
                            {
                                key : 'action',
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

                        sleepAnim =
                            {
                                key : 'sleep',
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

                        happyAnim =
                            {
                                key : 'happy',
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
                        break;
                    }
                break;

            case "brick":
                switch (this.petData.stage + 1)
                    {

                    case 1:

                        idleAnim =
                            {
                                key : 'idle',
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
                                    ],
                                frameRate: 2,
                                repeat   : -1
                            };

                        sadAnim =
                            {
                                key : 'sad',
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
                                    ],
                                frameRate: 2,
                                repeat   : -1
                            };

                        hungryAnim =
                            {
                                key : 'hungry',
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

                        actionAnim =
                            {
                                key : 'action',
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
                                        },
                                        {
                                            key: animKey,
                                            frame : "action_4",
                                            duration : 500
                                        }
                                    ],
                                frameRate : 6,
                                repeat   : -1
                            };

                        sleepAnim =
                            {
                                key : 'sleep',
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

                        happyAnim =
                            {
                                key : 'happy',
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
                                        {
                                            key: animKey,
                                            frame : "happy_3",
                                            duration : 500
                                        }
                                    ],
                                frameRate: 2,
                                repeat   : -1
                            };
                        break;

                    case 2:
                        idleAnim =
                            {
                                key : 'idle',
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
                                        }
                                    ],
                                frameRate: 2,
                                repeat   : -1
                            };

                        sadAnim =
                            {
                                key : 'sad',
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
                                        }
                                    ],
                                frameRate: 2,
                                repeat   : -1
                            };

                        hungryAnim =
                            {
                                key : 'hungry',
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

                        actionAnim =
                            {
                                key : 'action',
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

                        sleepAnim =
                            {
                                key : 'sleep',
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

                        happyAnim =
                            {
                                key : 'happy',
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
                        break;

                    case 3:
                        idleAnim =
                            {
                                key : 'idle',
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
                                        }
                                    ],
                                frameRate: 2,
                                repeat   : -1
                            };

                        sadAnim =
                            {
                                key : 'sad',
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
                                    ],
                                frameRate: 2,
                                repeat   : -1
                            };

                        hungryAnim =
                            {
                                key : 'hungry',
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
                                            frame : "hungry_2",
                                            duration : 500
                                        }
                                    ],
                                frameRate: 2,
                                repeat   : -1
                            };

                        actionAnim =
                            {
                                key : 'action',
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

                        sleepAnim =
                            {
                                key : 'sleep',
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

                        happyAnim =
                            {
                                key : 'happy',
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
                                        {
                                            key: animKey,
                                            frame : "happy_3",
                                            duration : 500
                                        },
                                        {
                                            key: animKey,
                                            frame : "happy_4",
                                            duration : 500
                                        },
                                    ],
                                frameRate: 2,
                                repeat   : -1
                            };
                        break;
                    }
                break;

            case "mitts":
                switch (this.petData.stage + 1)
                    {
                    case 1:
                        idleAnim =
                            {
                                key : 'idle',
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
                                    ],
                                frameRate: 2,
                                repeat   : -1
                            };

                        sadAnim =
                            {
                                key : 'sad',
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
                                    ],
                                frameRate: 2,
                                repeat   : -1
                            };

                        hungryAnim =
                            {
                                key : 'hungry',
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
                                        }
                                    ],
                                frameRate: 2,
                                repeat   : -1
                            };

                        actionAnim =
                            {
                                key : 'action',
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

                        sleepAnim =
                            {
                                key : 'sleep',
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

                        happyAnim =
                            {
                                key : 'happy',
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
                        break;

                    case 2:
                        idleAnim =
                            {
                                key : 'idle',
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
                                    ],
                                frameRate: 2,
                                repeat   : -1
                            };

                        sadAnim =
                            {
                                key : 'sad',
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
                                    ],
                                frameRate: 2,
                                repeat   : -1
                            };

                        hungryAnim =
                            {
                                key : 'hungry',
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
                                    ],
                                frameRate: 2,
                                repeat   : -1
                            };

                        actionAnim =
                            {
                                key : 'action',
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

                        sleepAnim =
                            {
                                key : 'sleep',
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

                        happyAnim =
                            {
                                key : 'happy',
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
                        break;

                    case 3:
                        idleAnim =
                            {
                                key : 'idle',
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
                                    ],
                                frameRate: 2,
                                repeat   : -1
                            };

                        sadAnim =
                            {
                                key : 'sad',
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
                                    ],
                                frameRate: 2,
                                repeat   : -1
                            };

                        hungryAnim =
                            {
                                key : 'hungry',
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

                        actionAnim =
                            {
                                key : 'action',
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

                        sleepAnim =
                            {
                                key : 'sleep',
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

                        happyAnim =
                            {
                                key : 'happy',
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
                        break;
                    }
                break;
            }

        let anims = [
            idleAnim,
            sadAnim,
            hungryAnim,
            actionAnim,
            sleepAnim,
            happyAnim];

        if (this.scene.anims !== undefined)
            {
            for (let i = 0; i < anims.length; i++)
                {
                if (this.scene.anims.exists(anims[i].key))
                    this.scene.anims.remove(anims[i].key);
                }
            }

        this.addAnimations(anims);

        this.playAnimation("idle");

        }

    checkEvolution()
        {
        //Onmi  - Fun
        //Brick - Str
        //Mitts - Agi

        let target = this.FocusedStatToString;

        //if (this.petData.stage === 3)
            return target;

        switch (target)
            {
            case "Strength":
                if (this.petData.strength === this.petData.stage + 2)
                    return target;
                break;

            case "Agility":
                if (this.petData.agility === this.petData.stage + 2)
                    return target;
                break;

            case "Fun":
                if (this.petData.fun === this.petData.stage + 2)
                    return target;
                break;
            }

        return "None";
        }

    updateAnimations()
        {
        if (this.petData.hunger < 50)
            this.playAnimation("hungry");
        else
        if (this.petData.clean < 50)
            this.playAnimation("sad");
        else
            this.playAnimation("idle")
        }

    }