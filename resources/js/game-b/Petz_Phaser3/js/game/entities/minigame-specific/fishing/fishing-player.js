import "../../../phaser.js";
import config from "../../../config.js";

import * as Input from "../../../core/System/input-handler.js";
import * as TextStyle from "../../../core/UI/styles/text-styles.js";

import {Vector2} from "../../../core/System/DataTypes/VectorTypes.js";
import {Clamp} from "../../../core/System/DataTypes/Math.js";

import Entity from "../../../core/entity.js";

export default class FishingPlayer extends Entity
    {
    constructor(scene, x, y, key, controls, name)
        {
        super(scene, x, y, key);
        this.name = name;

        //Data
        this.keys = controls;//.currentKeys;
        this.score = 0;

        //States
        this.hasCast = false;
        this.hasHit = false;
        this.isReeling = false;

        this.fishCaught = null;

        this.castPower = 0;
        this.castTimer = 0;

        this.direction = 1; //-1 = left, 1 = right

        this.CreateRod(scene, x, y);

        //Graphics ref
        this.graphics = scene.add.graphics();
        this.graphicsPos = new Vector2(this.rodTip.x, this.rodTip.y - 24);

        }

    update(time, delta)
        {
        this.graphics.clear();
        this.DrawRod();

        this.rodTip.components.get("text").setText(this.name);
        this.rodTip.components.get("text").setPosition(this.rodTip.x, this.rodTip.y - 32);

        let reelTxt = this.rodTip.components.get("reel-text");
        reelTxt.setVisible(this.hasHit).setActive(this.hasHit);

        this.graphicsPos.Set(this.rodTip.x, this.rodTip.y - 18);
        this.graphics.fillTriangle(
            this.graphicsPos.x - 6, this.graphicsPos.y,
            this.graphicsPos.x + 6, this.graphicsPos.y,
            this.graphicsPos.x, this.graphicsPos.y + 6);

        // this.t.setText(this.castPower);
        let isActive = Input.InputHandler.GetButton(this.keys.cast);

        if (!this.hasCast && this.isReeling)
            {
            if (isActive)
                {
                if (this.fishCaught !== null)
                    {
                    this.fishCaught.setImmovable(true);
                    this.fishCaught.setActive(false).setVisible(false);
                    this.fishCaught = null;
                    }

                return;
                }
            else
                {
                //Reset all to make sure
                this.isReeling = false;
                this.hasHit = false;
                this.hasCast = false;

                this.castTimer = 0;
                this.castPower = 0;

                this.rodTip.SetPosition(this.rodTip.spawnPosition.x, this.rodTip.spawnPosition.y, false);
                }
            }

        if (!this.isReeling)
            {
            //Before firing the rod
            if (!this.hasCast)
                {
                //Charge...
                if (isActive && this.castPower < 100)
                    this.ChargeRod(delta);
                else
                //...Throw the rod forward
                if (this.castPower > 0)
                    this.FireRod(delta);
                }
            else
            if (!this.hasHit)
                this.rodTip.setGravityY(this.rodTip.body.gravity.y + 9.8);
            else
                this.isReeling = true;
            }
        else
            {
            reelTxt.setPosition(this.rod.x - 25*this.direction, this.rodTip.y);
            this.PullRod(delta, isActive);
            }
        }

    ChargeRod(delta)
        {
        this.castTimer += (delta*2)/1000;
        this.castPower = Clamp(Math.exp(this.castTimer), 0, 100);

        this.rod.angle += this.castPower/100 * (-this.direction) * 2;
        this.rodTip.angle = this.rod.angle - 180;

        }

    FireRod(delta)
        {
        this.rodTip.setVelocity((10 + this.castPower*4)*this.direction, 0);

        this.rodTip.angle = 0;
        this.rod.angle = 0;

        this.hasCast = true;

        this.graphics.clear();
        }

    PullRod(delta, isPulling)
        {
        let spawnPosition = this.rodTip.spawnPosition;

        //Get vector lengths
        let vectorDiff = new Vector2(
            this.rodTip.x - spawnPosition.x,
            this.rodTip.y - spawnPosition.y);

        //Float value
        let distance = Math.abs(vectorDiff.x + vectorDiff.y);

        //Clamp for moving back
        vectorDiff.x = Clamp(vectorDiff.x, -1, 1) * 3;
        vectorDiff.y = Clamp(vectorDiff.y, -1, 1) * 3;

        //Pull
        if (isPulling)
            {
            //Return movement from normalized

            if (this.direction === 1)
                this.rodTip.x = Clamp(this.rodTip.x - vectorDiff.x, spawnPosition.x , this.rodTip.x);
            else
                this.rodTip.x = Clamp(this.rodTip.x - vectorDiff.x, this.rodTip.x   , spawnPosition.x);

            this.rodTip.y = Clamp(this.rodTip.y - vectorDiff.y, spawnPosition.y, this.rodTip.y);

            if (this.fishCaught !== null)
                this.fishCaught.SetPosition(this.rodTip.x + this.fishCaught.width/2*this.direction, this.rodTip.y+this.fishCaught.height/2, false);

            if (distance < 5)
                {
                this.rodTip.SetPosition(
                    this.rodTip.spawnPosition.x,
                    this.rodTip.spawnPosition.y,
                    false);

                this.hasCast = false;
                this.hasHit = false;

                this.rodTip.setImmovable(false);
                this.rodTip.body.enable = true;
                }
            }
        }

    //Draw
    DrawRod()
        {
        if (this.hasCast)
            {
            //Draw line between rod and tip
            this.graphics.lineStyle(3, 0x000000, 1);
            this.graphics.lineBetween(this.rod.x + 20 * this.direction, this.rod.y - 18, this.rodTip.x, this.rodTip.y);

            //Draw rod tip location
            // this.graphics.fillStyle(0xFFFFFF, 1);
            // this.graphics.fillCircle(this.rodTip.x, this.rodTip.y, this.rodTip.displayWidth/2);
            // this.graphics.strokeCircle(this.rodTip.x, this.rodTip.y, this.rodTip.displayWidth/2);
            }
        }

    //Helpers
    SetDirection(newDirection)
        {
        this.direction = newDirection;

        this.rod.setScale(this.direction * 2, 2);
        this.rod.x = this.x + (this.displayWidth/5*4)*this.direction;
        this.rod.y = this.y;
        this.rod.body.updateFromGameObject();

        //if (newDirection === 1)
        this.rodTip.SetPosition(this.rod.x + (16 * newDirection), this.rod.y-8, false);
        this.rodTip.spawnPosition = new Vector2(this.rod.x + (16 * newDirection), this.rod.y-8);
        }

    //Creation of Components
    CreateRod(scene, x, y)
        {
        //Fishing Rod
        this.rod = this.components.add("rod", new Entity(scene, x, y, "rod", 1));
        this.rod.depth = -10;

        this.rodTip = this.components.add("rod-tip", new Entity(scene, x, y, "hook", 0), false);
        this.rodTip.angle = 180;

        this.rodTip.setCollideWorldBounds();
        this.rodTip.setOrigin(0.5, 0.5);

        //Size
        this.rodTip.setSize(8,8);
        this.rodTip.setDisplaySize(16,16);

        //Add text
        this.rodTip.components.add("text",
            this.scene.add.text(this.rod.x, this.rod.y - 32,
                "", TextStyle.infoStyle).setOrigin(0.5, 0.5), false);

        this.rodTip.components.add("reel-text",
            this.scene.add.text(this.rod.x, this.rod.y - 64,
                "REEL!", TextStyle.infoStyle).setOrigin(0.5, 0.5).setDepth(this.depth + 2), true);
        }
    }
