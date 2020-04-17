import {Button} from "./button.js";

export class TextButton extends Button
    {
    constructor(scene, x, y, image, text, textStyle)
        {
        super(scene, x, y, image);

        this.text = scene.add.text(x, y, text, textStyle);
        }
    }
