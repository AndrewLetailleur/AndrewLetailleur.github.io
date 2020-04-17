import "../../phaser.js";
import {Button} from "../UI/Buttons/button.js";
import {Image} from "../Graphics/image.js";
import {ComponentMap} from "../CustomCollections/ComponentMap.js";

export default class UI_Scene extends Phaser.Scene
    {
    constructor(key)
        {
        super(key);
        this.mainScene = null;

        }

    preload()
        {
        this.load.baseURL = "img/phaser-game/";
        this.load.atlas (
            "ui-back",
            "ui/backs/button-ui-sheet.png",
            "ui/backs/button-ui-sheet.json");
        }

    create()
        {
        this.graphics = this.add.graphics();
        }

    update(time, delta)
        {
        if (this.graphics !== undefined)
            this.graphics.clear();
        }

    /**
     * @param x
     * @param y
     * @param string
     * @param textStyle
     * @returns {*}
     * @constructor
     */
    CreateTextObject(x , y, string, textStyle = undefined)
        {
        let text = this.add.text(x, y, string, textStyle);
        text.setOrigin(0.5, 0.5);

        return text;
        }

    /**
     * @param x
     * @param y
     * @param text
     * @param backgroundKey
     * @param textStyle
     * @returns {{background: Button, text: *}}
     * @constructor
     */
    CreateButton (x, y, text, backgroundKey, textStyle)
        {
        let btn =
            {
            background: new Button(this, x, y, backgroundKey),
            text: this.CreateTextObject(x, y, text, textStyle)
            };

        btn.text.setColor('#000000');
        btn.text.setOrigin(0.5, 0.5);

        return btn;
        }

    /**
     * @param x
     * @param y
     * @param config
     * @returns {{background: Button, text: *}}
     * @constructor
     */
    CreateButtonConfig (x, y, config)
        {
        let btn =
            {
            background: new Button(this, x, y, config.key),
            text: this.CreateTextObject(x, y, config.text, config.style)
            };

        btn.text.setOrigin(0.5, 0.5);

        //config.onClick();
        if (typeof config.onClick !== 'undefined')
            btn.background.onClickEvents.push(config.onClick);

        if (typeof config.onOver !== 'undefined')
            btn.background.onHoverEvents.push(config.onOver);

        if (typeof config.onOut !== 'undefined')
            btn.background.onOutEvents.push(config.onOut);

        btn.Show = function ()
            {
            btn.text.visible = btn.background.visible = true;
            };

        btn.Hide = function ()
            {
            btn.text.visible = btn.background.visible = false;
            };

        btn.Toggle = function ()
            {
            btn.text.visible  = btn.background.visible = !btn.background.visible;
            };

        btn.SetDepth = function(depth)
            {
            btn.background.depth = depth - 1;
            btn.text.depth = depth;
            };

        return btn;
        }
    }