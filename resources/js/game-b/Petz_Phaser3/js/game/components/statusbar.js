import config from "../config.js";
import {Image} from "../core/Graphics/image.js";
import {Vector2} from "../core/System/DataTypes/VectorTypes.js";
import * as TextStyle from "../core/UI/styles/text-styles.js";

export class Statusbar extends Image
    {
    constructor(scene, x, y, key, maxValue, defaultValue, xScale = config.width/5, yScale = 32)
        {
        super(scene, x, y, key);

        //Scale up
        this.originalScale = new Vector2(xScale, yScale);
        this.setScale(this.originalScale.x, this.originalScale.y);

        //Add background
        let back = this.back = new Image(scene, x, y, key);

        back.setScale(xScale + 2, yScale + 2);
        back.depth --;
        back.setTint(0x000000);

        //Align to side
        this.setOrigin(0, 0.5);
        back.setOrigin(0, 0.5);

        this.SetPosition(x - this.scaleX*0.5, y);
        back.SetPosition(x - back.scaleX*0.5, y);

        //Setup basic values
        this.maxValue = maxValue;
        this.value = defaultValue;

        this.text = new Phaser.GameObjects.Text(scene, x, y, "", TextStyle.blue_header);
        this.text.setOrigin(0.5, 0.5);
        scene.add.existing(this.text);

        this.UpdateValue(this.value, false);
        }

    UpdateValue(newValue, updateText = true)
        {
        this.value = newValue;
        this.scaleX = this.originalScale.x*this.valueRatio;

        let c = Phaser.Display.Color.Interpolate.ColorWithColor(
            new Phaser.Display.Color(1, 0, 0), new Phaser.Display.Color(0, 1, 0), this.maxValue, this.value);

        c = Phaser.Display.Color.RGBToString(c.r * 255, c.g * 255, c.b * 255, c.a * 255);
        this.setTint(parseInt(c.replace(/^#/, ''), 16));

        if (updateText)
            this.text.setText(this.value + "/" + this.maxValue);
        }

    get valueRatio()
        {
        return this.value/this.maxValue;
        }
    }