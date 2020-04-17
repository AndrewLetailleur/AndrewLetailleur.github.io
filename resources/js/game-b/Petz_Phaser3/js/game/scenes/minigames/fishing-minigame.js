import "../../phaser.js";
import config from "../../config.js";

import UI_Scene from "../../core/Scenes/ui-scene.js";
import TimerScene from "./timer-scene.js";

import * as TextStyle from "../../core/UI/styles/text-styles.js";
import {Vector2} from "../../core/System/DataTypes/VectorTypes.js";
import {Clamp} from "../../core/System/DataTypes/Math.js";

import {ObjectPool} from "../../core/System/Pooling/ObjectPool.js";
import {Statusbar} from "../../components/statusbar.js";

import FishingPlayer from "../../entities/minigame-specific/fishing/fishing-player.js";
import FishEntity from "../../entities/minigame-specific/fishing/fish-entity.js";
import DataHandler from "../../core/System/data-handler.js";
import {Image} from "../../core/Graphics/image.js";

export class FishingMain extends TimerScene
    {
    constructor()
        {
        super("Fishing_Game", "Fishing_UI");

        this.positionOne = new Vector2(192, config.height/4 - 4);
        this.positionTwo = new Vector2(config.width - 192, config.height/4 - 4);

        }

    preload()
        {
        //Items
        this.load.spritesheet("fish", "img/phaser-game/minigames/fishing/fish-spritesheet.png",
            {
            frameWidth  : 32,
            frameHeight : 32,
            startFrame  : 0,
            endFrame    : 6,
            });

        this.load.image('button', 'img/phaser-game/ui/buttons/ui-button-large.png');

        //Player stuffs
        this.load.image("player-temp", "img/phaser-game/pets/test-pet.png");
        this.load.image("rod", "img/phaser-game/minigames/fishing/rod.png");
        this.load.image("hook", "img/phaser-game/minigames/fishing/hook.png");

        //Background
        this.load.image("fishing-background", "img/phaser-game/minigames/fishing/background.png");
        this.load.image("bait", "img/phaser-game/minigames/fishing/bait.png");
        }

    create()
        {
        //Draw background
        this.cameras.main.setBackgroundColor("#d5f5ff");
        this.add.image(0, 0, "fishing-background")
            .setOrigin(0,0)
            .setDisplaySize(config.width, config.height)
            .setDepth(-1000);

        let keysOne =
            {
            up:     this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
            down:   this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
            left:   this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
            right:  this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),

            cast:   this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
            };

        let keysTwo =
            {
            up:     this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP ),
            down:   this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN),
            left:   this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
            right:  this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT),

            cast:   this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.NUMPAD_ZERO)
            };

        //Setup
        this.CreateMinigameRules();

        //Load players, create area for spawning fish, add basic wall colliders
        this.SetupPlayers(keysOne, keysTwo);
        this.SetupFishZone();
        this.SetupWalls();

        let bottomBorder    = this.physics.add.image(config.width/2, config.height - 10).setOrigin(0.5, 0.5);
            bottomBorder.setSize(config.width, 30).setImmovable();

        //Collision Events for Players/Fish
        this.AddCollisionEvents();

        //Create some fish that the player can see when the game begins
        this.SpawnFish(5);

        //Add collisions with bottom
        this.playerOne.rodTip.AddCollision (bottomBorder, () =>
            {
            this.playerOne.hasHit = true;
            this.ResetObject(this.playerOne.rodTip);
            });

        this.playerTwo.rodTip.AddCollision (bottomBorder, () =>
            {
            this.playerTwo.hasHit = true;
            this.ResetObject(this.playerTwo.rodTip);
            });

        //Inherit load of UI and setup
        super.create();
        //this.SkipTimer(); //[Debug]
        }

    update(time, delta)
        {
        super.update(time, delta);
        //
        if (!this.hasInitalized || this.endGame)
             return;

        if (this.timer < delta)
            {
            this.endGame = true;
            this.EndGame();

            return;
            }

        //Setup Timer
        this.timer -= delta;
        this.spawnTimer -= delta;

        //Spawn new fish
        if (this.spawnTimer < delta)
            {
            this.SpawnFish(this.spawnRate);
            this.spawnIndex ++;

            //Increase every "x" amount of spawn calls
            if (this.spawnIndex % 5 === 0)
                this.spawnRate ++;

            this.spawnTimer = this.spawnRateTimer*1000;
            }

        //Run updates
        this.playerOne.update(time, delta);
        this.playerTwo.update(time, delta);
        }

    //Creation
    SetupPlayers(keysOne, keysTwo)
        {
        this.playerOne = new FishingPlayer(this, this.positionOne.x, this.positionOne.y, "player-temp", keysOne, "P1");
        this.playerTwo = new FishingPlayer(this, this.positionTwo.x, this.positionOne.y, "player-temp", keysTwo, "P2");

        this.playerOne.SetDirection(1);
        this.playerTwo.SetDirection(-1);

        let a = new Image(this, this.playerOne.x - 96, this.playerOne.y, "bait");
        let b = new Image(this, this.playerTwo.x + 96, this.playerTwo.y, "bait");
        }

    SetupWalls()
        {
        this.wallGroup = this.add.group();

        //Create Walls
        let leftBorder      = this.physics.add.image(this.positionOne.x/2, config.height*0.6 + 24               ).setOrigin(0.5, 0.5);
        let rightBorder     = this.physics.add.image(config.width - this.positionOne.x/2, config.height*0.6 + 24).setOrigin(0.5, 0.5);

        leftBorder.setSize  (config.width/5+16, config.height/4*3-10).setImmovable();
        rightBorder.setSize (config.width/5+16, config.height/4*3-10).setImmovable();

        this.wallGroup.add(leftBorder);
        this.wallGroup.add(rightBorder);
        }

    SetupFishZone()
        {
        this.fishGroup = new ObjectPool(this, 'fish', FishEntity, 90, false);

        this.fishZone  = new Phaser.Geom.Rectangle(
            config.width/4 + 32,
            config.height/2 - 50,
            config.width/2 - 32,
            config.height/2);

        Phaser.Actions.Shuffle(this.fishGroup.getChildren());

        // let a = this.add.graphics();
        // a.strokeRect(
        //     this.fishZone.x,
        //     this.fishZone.y,
        //
        //     this.fishZone.width,
        //     this.fishZone.height);
        }

    CreateMinigameRules()
        {
        this.timer = (1000*1.5)*60; //1.5 Minutes
        //this.timer = 10000; //[Debug]

        this.spawnRate = 1; //Number of fish per spawn
        this.spawnRateTimer = 10; //Timer
        this.spawnTimer = this.spawnRateTimer*1000;
        this.spawnIndex = 0;

        //Winner
        this.endGame = false;
        this.winner = "Draw";
        }

    AddCollisionEvents()
        {
        this.events.on("fishCollected", (player, fish) =>
            {
            player.hasHit = true;
            player.fishCaught = fish;

            player.score += fish.value;

            fish.scaleX = player.direction;
            fish.angle = Phaser.Math.Between(0, 360);

            //player.score = Clamp(player.score, 0, Number.MAX_SAFE_INTEGER);

            if (fish.value > 0)
                {
                //Play a cool fucking sound

                }
            else
                {
                //Play a shite fucking sound

                }

            this.ResetObject(fish);
            this.ResetObject(player.rodTip);
            });

        //Add fish collisions
        //this.playerOne.rodTip.AddCollision(this.fishGroup, () => this.events.emit("fishCollection", this, this.playerOne));
        //this.playerTwo.rodTip.AddCollision(this.fishGroup, () => this.events.emit("fishCollection", this, this.playerTwo));
        this.physics.add.collider(this.playerOne.rodTip, this.fishGroup, (colliderOne, colliderTwo) =>
            this.events.emit("fishCollected", this.playerOne, colliderTwo));

        this.physics.add.collider(this.playerTwo.rodTip, this.fishGroup, (colliderOne, colliderTwo) =>
            this.events.emit("fishCollected", this.playerTwo, colliderTwo));

        //Add wall collisions
        this.playerOne.rodTip.AddCollision (this.wallGroup, () => this.playerOne.rodTip.StopBody());
        this.playerTwo.rodTip.AddCollision (this.wallGroup ,() => this.playerTwo.rodTip.StopBody());
        }

    SpawnFish(quantity)
        {
        let sizeLeft = this.fishGroup.getTotalFree();

        if (sizeLeft > 0)
            {
            if (sizeLeft < quantity)
                sizeLeft = quantity;

            let instance = null;
            for (let i = 0; i < quantity; i++)
                {
                // instance = this.fishGroup.SpawnFreeObject(0, 0);
                instance = this.fishGroup.SpawnFreeObject(0, 0);
                instance.angle = 0;

                instance.body.reset(instance.x, instance.y);
                instance.setImmovable(true);

                Phaser.Actions.RandomRectangle([instance], this.fishZone);
                Phaser.Actions.Shuffle(this.fishGroup.getChildren());
                }
            }
        }

    EndGame()
        {
        this.playerOne.rodTip.setImmovable(true);
        this.playerOne.rodTip.body.enable = false;

        this.playerTwo.rodTip.setImmovable(true);
        this.playerTwo.rodTip.body.enable = false;

        if (this.playerOne.score === this.playerTwo.score)
            this.winner = "Draw";
        else
            this.winner = (this.playerOne.score > this.playerTwo.score) ? "Player One" : "Player Two";

        this.ui_scene.events.emit("on_winner", this.winner);
        this.endGame = true;
        }
    }

export class FishingUI extends UI_Scene
    {
    constructor()
        {
        super("Fishing_UI");
        }

    preload()
        {
        this.load.image('healthbar', 'img/phaser-game/ui/base-pixel.png');
        }

    create()
        {
        super.create();

        //Power Bar
        this.playerOnePower = new Statusbar(this, this.mainScene.playerOne.x, 100, 'healthbar', 100, 0);
        this.playerTwoPower = new Statusbar(this, this.mainScene.playerTwo.x, 100, 'healthbar', 100, 0);



        this.CreateTextObject(this.mainScene.playerOne.x, 60, "Player One Fishing Power", TextStyle.normal_header);
        this.CreateTextObject(this.mainScene.playerTwo.x, 60, "Player Two Fishing Power", TextStyle.normal_header);

        this.timerText = this.CreateTextObject(config.width/2, 80, this.mainScene.timer, TextStyle.Centered_Header);
        this.timerText.setOrigin(0.5, 0.5);

        //Score Setup
        this.scoreOne = this.CreateTextObject(config.width/2 - 10, 30, "0", TextStyle.LargeHeader);
        this.scoreOne.setOrigin(1, 0.5);

        this.scoreTwo = this.CreateTextObject(config.width/2 + 10, 30, "0", TextStyle.LargeHeader);
        this.scoreTwo.setOrigin(0, 0.5);

        this.mainScene.events.on("fishCollected", () =>
            {
            this.scoreOne.setText(this.mainScene.playerOne.score);
            this.scoreTwo.setText(this.mainScene.playerTwo.score);
            });

        //Call end event
        this.events.once("on_winner", this.drawWinner, this);
        }

    update(time, delta)
        {
        super.update(time, delta);

        this.graphics.lineStyle(4, 0x444444, 1);
        this.graphics.lineBetween(config.width/2, 10, config.width/2, 60);

        this.playerOnePower.UpdateValue(this.mainScene.playerOne.castPower, false);
        this.playerTwoPower.UpdateValue(this.mainScene.playerTwo.castPower, false);

        if (this.mainScene.timer > delta)
            {
            this.timerText.setText(Math.round(this.mainScene.timer/1000));
            }
        else
            {
            this.timerText.setText("Game Over");
            }
        }

    drawWinner(winner)
        {
        //console.log(winner);

        this.buttonConfig =
            {
            text: "Return to Pet Mode",
            //onClick : () => this.ToggleTab(UI_STATES.INFO),

            key: "button",
            style: TextStyle.normal_header
            };

        if (winner === "Draw")
            this.CreateTextObject(config.width / 2, config.height / 2, "The Game has ended in a Tie!", TextStyle.LargeHeader);
        else
            this.CreateTextObject(config.width / 2, config.height / 2, winner + "\nhas won!", TextStyle.LargeHeader);

        let btn = this.CreateButtonConfig(config.width / 2, config.height / 3 * 2, this.buttonConfig);

        btn.background.onClickEvents.push(() =>
            {
            let stats = DataHandler.GetObject("pet_data");
            stats.agility += 0.5;

            DataHandler.SaveObject("pet_data", stats);

            this.mainScene.LoadScene("Main")
            });

        //this.mainScene.LoadScene("Main");
        }
    }