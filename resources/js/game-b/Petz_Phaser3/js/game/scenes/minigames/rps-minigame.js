import "../../phaser.js";
import config from "../../config.js";

import {Scene} from "../../core/Scenes/scene.js";
import UI_Scene from "../../core/Scenes/ui-scene.js";
import * as TextStyle from "../../core/UI/styles/text-styles.js";

export class RPSMain extends Scene
    {
    constructor()
        {
        super("RPS_Game", "RPS_UI");
        }

    create()
        {
        super.create();
        }

    update()
        {

        }
    }

export class RPSUI extends UI_Scene
    {
    constructor()
        {
        super("RPS_UI");
        }

    create()
        {
        this.CreateTextObject(config.width/2, config.height/2, "RPS GAME", TextStyle.normal_header)
        }

    update()
        {

        }
    }