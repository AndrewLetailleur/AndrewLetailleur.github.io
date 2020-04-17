import config from "../../config.js";

import Entity from "../../core/entity.js";
import {PetData} from "./pet-stats.js";
import {DynamicMap} from "../../core/System/Collections/DynamicMap.js";

export let PetStates =
    {
    NONE  : -1,
    HAPPY : 0,
    SAD   : 1,
    ANGRY : 2,

    CLEAN : 3,
    FEEDS : 4,
    DYING : 5,

    OTHER : 6,
    };

export let PetConfig =
    {
    name : "",

    firstEvolutionKey  : "",
    secondEvolutionKey : "",
    thirdEvolutionKey  : "",

    atlas : ""
    };

export class PetEntity extends Entity
    {
    currentState = PetStates.HAPPY;
    isInteractable = false;

    //Fake delegation to make it easier to setup changes
    //like animations, dying events etc.
    onStateChange = [];


    /**
     * @param scene     - Scene the entity is within
     * @param x         - x spawn position
     * @param y         - y spawn position
     * @param defaultKey       - Sprite Key
     * @param petConfig - Configuration of the pet
     */
    constructor(scene, x, y, defaultKey, petConfig)
        {
        super(scene, x, y, defaultKey, 0);

        this.name = petConfig.name;
        this.petData = new PetData();

        this.setScale(10, 10);
        this.setSize(this.displayWidth);
        this.UpdateColliderDefaults();

        //Setup rules
        this.setInteractive(); //Needed for main scene interaction

        this.evolutionMap = new DynamicMap();

        this.evolutionMap.add("brick", ["brick-baby","brick-teen","brick-adult"]);
        this.evolutionMap.add("mitts", ["mitts-baby","mitts-teen","mitts-adult"]);
        this.evolutionMap.add("omni" , ["omni-baby" ,"omni-teen" ,"omni-adult"]);
        }

    /**
     * Add a single animation and return said animation
     * @param animation
     * @returns {animation}
     */
    addAnimation(animation)
        {
        return this.scene.anims.create(animation);
        }

    /**
     * Add multiple animations
     * @param {Array} animations
     */
    addAnimations(animations)
        {
        animations.forEach(element =>
            {
            if (!this.scene.anims.exists(element.key))
                this.scene.anims.create(element);
            else
                console.log("Attempt to add animation with key " + element.key + " failed as it already exists.");
            })

        }

    playAnimation(key)
        {
        this.play(key);
        }

    getAnimation(key)
        {
        return this.scene.anims.get(key);
        }

    createAnimations()
        {
        //Nuffin
        }

    changePetState(newState)
        {
        this.currentState = newState;

        for (let i = 0; i < this.onStateChange.length; i ++)
            {
            this.onStateChange[i]();

            }
        }

    get currentAnimation()
        {
        return this.anims.currentAnim.key;
        }

    //TODO: Setup as proper key/value pairs for future
    get FocusedStatToString()
        {
        let statArray =
            [
                {
                key   : "Strength",
                value : this.petData.strength,
                },

                {
                key   : "Agility",
                value : this.petData.agility,
                },

                {
                key   : "Fun",
                value : this.petData.fun,
                },
            ];

        let retValue = statArray[0];

        for (let i = 1; i < statArray.length; i ++)
            {

            if (statArray[i].value > retValue.value)
                retValue = statArray[i];
            }

        return retValue.key;
        }
    }