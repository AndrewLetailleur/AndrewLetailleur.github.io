
import {DynamicMap} from "./Collections/DynamicMap.js";

export class InputHandler
    {
    inputs = [];

    constructor(playerCount)
        {
        this.inputs = new Array(playerCount);

        for (let i = 0; i < this.inputs.length; i ++)
            {
            this.inputs[i] = new ControlMap();
            }
        }

    static GetButtonDown(key)
        {
        return Phaser.Input.Keyboard.JustDown(key);
        }

    static GetButtonUp  (key)
        {
        return Phaser.Input.Keyboard.JustUp(key);
        }

    static GetButton    (key)
        {
        return key.isDown;
        }

    static GetAxis(keyOne, keyTwo)
        {
        let valOne = (keyOne.isDown) ?  1 : 0;
        let valTwo = (keyTwo.isDown) ? -1 : 0;

        return valOne + valTwo;
        }

    static AddKey(key)
        {

        }

    static MouseDown(scene)
        {
        return scene.input.activePointer.isDown;
        }
    }

export class ControlMap extends DynamicMap
    {
    constructor()
        {
        super();

        this.currentKeys = null;
        }

    add(controlKey, values, setCurrent)
        {
        super.add(controlKey, values);

        if (setCurrent)
            this.currentKeys = this.get(controlKey);
        }

    changeControls(controlKey)
        {
        if (this.has(controlKey))
            this.currentKeys = this.get(controlKey);
        }
    }