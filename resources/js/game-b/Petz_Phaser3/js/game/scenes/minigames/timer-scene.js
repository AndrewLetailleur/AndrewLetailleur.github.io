import {Scene} from "../../core/Scenes/scene.js";
import config from "../../config.js";
import * as TextStyle from "../../core/UI/styles/text-styles.js";

export default class TimerScene extends Scene
    {
    constructor(key, ui_key)
        {
        super(key, ui_key);

        //The delay before the initTimer begins
        this.timerDelay = 3;

        //The length of the initTimer
        this.timerMax = 3;

        }

    create()
        {
        super.create();

        //Setup variables
        this.hasInitalized = false;
        this.initTimer = 0; //Current initTimer value
        this.initalStage = 0;

        //Add components
        this.timerGraphics = this.ui_scene.add.graphics();

        this.timerText = this.ui_scene.CreateTextObject(config.width/2, config.height/2, "Get Ready!", TextStyle.LargeHeader);

        this.timerGraphics.fillStyle(0x444444, 0.8);
        this.timerGraphics.fillRect(config.width/2 - 160, config.height/2-30, 320, 70);

        this.timerGraphics.lineStyle(4, 0x000000, 1);
        this.timerGraphics.strokeRect(config.width/2 - 160, config.height/2-30, 320, 70);
        }

    update(time, delta)
        {
        switch (this.initalStage)
            {
            case 0:
                if (this.initTimer < this.timerDelay)
                    {
                    this.initTimer += delta/1000;
                    this.timerText.setText("Get Ready!");
                    }
                else
                    {
                    this.initalStage ++;
                    this.initTimer = this.timerMax;
                    }
                break;

            case 1:
                if (this.initTimer > delta/1000)
                    {
                    this.initTimer -= delta/1000;
                    this.timerText.setText((this.initTimer).toFixed(1));
                    }
                else
                    {
                    this.initalStage ++;
                    this.hasInitalized = true;

                    this.timerText.setText("Fight!");

                    this.time.delayedCall(2000, () =>
                        {
                        this.timerText.visible = false;
                        this.timerGraphics.clear();
                        });

                    }
                break;
            }

        }

    SkipTimer()
        {
        this.initalStage = 1;
        this.initTimer = 0;
        }
    }