import "../../phaser.js";
import config from "../../config.js";

import {Scene} from "../../core/Scenes/scene.js";
import UI_Scene from "../../core/Scenes/ui-scene.js";
import * as TextStyle from "../../core/UI/styles/text-styles.js";

export class BalanceGame extends Scene
    {
    constructor()
        {
        super("Balance_Game", "Balance_UI");
        }

    create()
        {
        super.create();
        }

    update()
        {

        }
    }

export class BalanceUI extends UI_Scene
    {
    constructor()
        {
        super("Balance_UI");
        }

    create()
        {
        this.CreateTextObject(config.width/2, config.height/2, "BALANCE", TextStyle.normal_header)
        }

    update()
        {

        }
    }