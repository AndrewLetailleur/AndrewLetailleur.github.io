import "../../phaser.js";
import config from "../../config.js";

import UI_Scene from "../../core/Scenes/ui-scene.js";
import TimerScene from "./timer-scene.js";

import * as Input from "../../core/System/input-handler.js";
import * as TextStyles from "../../core/UI/styles/text-styles.js";

import SnowballPlayer from "../../entities/minigame-specific/snowball-player.js";
import {Statusbar} from "../../components/statusbar.js";
import DataHandler from "../../core/System/data-handler.js";

//var throwSFX, hitSFX, missSFX;//

export class SnowballMain extends TimerScene
    {
    constructor()
        {
        super("Snowball_Game", "Snowball_UI");
        }

    preload()
        {
        this.load.image('button', 'img/phaser-game/ui/buttons/ui-button-large.png');

        //lazy test background, it just works
        this.load.image('lmap', 'img/phaser-game/backgrounds/snowbg.png');

        //Player test default
        this.load.image('player', 'img/phaser-game/pets/test-pet.png');

        //Test Images, in load order
        this.load.image('water', 'img/phaser-game/snowball/waterblock.png'); //Water
        this.load.image('snowball', 'img/phaser-game/snowball/snowball.png');    //Snowball

        //load audio effects
        this.load.audio('throw', 'audio/sfx/snowball/ThrowFX.wav' );
        this.load.audio('miss' , 'audio/sfx/snowball/LandFX.wav'  );
        this.load.audio('hit'  , 'audio/sfx/snowball/LandFX.wav'  );

        //load bgm
        this.load.audio('snow-bgm', 'audio/bgm/snowball/Rewind.ogg');
        }

    create()
        {
        //Setup Variables
        this.winner = null;

        //should load in 'layers'.
        this.createBackground();//short term fix, that just works.
        this.createObstacles();//then spawn the water, before we add in input/etc

        this.initializePlayers();
        this.initializeSound();

        super.create();
        }

    initializeSound()
        {
        //var bgm = this.sound.add('snow-bgm');
        //bgm.play({volume: 0.1, loop: true});
        this.bgm = this.sound.add('snow-bgm');
        this.bgm.play({loop: true});

        //throwSFX = this.sound.add('throw');
        //hitSFX   = this.sound.add('hit');
        //missSFX  = this.sound.add('miss');
        }

    initializePlayers()
        {
        let keysOne =
            {
            up:     this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
            down:   this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
            left:   this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
            right:  this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
            //fire, Space/X
            jump:   this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
            };

        let keysTwo =
            {
            up:     this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP ),
            down:   this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN),
            left:   this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
            right:  this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT),
            //fire, Enter/0?
            jump:   this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.NUMPAD_ZERO)
            };

        //Input set up
        this.inputController = new Input.InputHandler(2);
        //Add new inputs to both players
        this.inputController.inputs[0].add('snowball', keysOne, true);
        this.inputController.inputs[1].add('snowball', keysTwo, true);

        //Create Player
        this.playerOne = new SnowballPlayer(this, config.width/2 - config.width/4, config.height/3,
            'player', this.inputController.inputs[0]);

        this.playerTwo = new SnowballPlayer(this, config.width/2 + config.width/4, config.height/3 * 2,
            'player', this.inputController.inputs[1]);

        this.playerOne.hp = 15;
        this.playerOne.name = "Player One";

        this.playerTwo.hp = 15;
        this.playerTwo.name = "Player Two";

        //Add collisions
        this.playerOne.AddOverlap(this.playerTwo.snowballs, this.onPlayerHit);
        this.playerTwo.AddOverlap(this.playerOne.snowballs, this.onPlayerHit);

        this.playerOne.AddCollision(this.water);
        this.playerTwo.AddCollision(this.water);
        }

    createBackground()
        {
        this.map = this.add.image(config.width/2, config.height/2,'lmap');//short term fix, that just works.
        this.map.setDisplaySize(1024, 768);
        //insert better, fancier tiled map code here.
        }

    createObstacles()
        {
        this.water = this.add.group();//make it block scoped, create wise

        this.water.add(this.physics.add.sprite(config.width/2, config.height/2).setSize(60, 768).setImmovable());

        // //spawn water
        // for (let i = -3; i <= 3; i++)
        //     {
        //     let x = (config.width/2) + (i * 32);
        //
        //     for (let j = 0; j <= 32; j++)
        //         {
        //         let y = 16 + (32 * j);//160 > 288
        //         this.water.add(this.physics.add.sprite(x, y, 'water').setImmovable());//spawn the object
        //         }
        //     }
        }

    onPlayerHit(player, shot)
        {
        player.hp --;

        if (player === this.playerOne)
            this.ui_scene.healthOne.UpdateValue(player.hp);
        else
            this.ui_scene.healthTwo.UpdateValue(player.hp);


        if (player.hp <= 0)
            {
            player
                .setActive(false)
                .setVisible(false)
                .body.enable = false;

            if (player === this.playerOne)
                this.winner = this.playerTwo;
            else
                this.winner = this.playerOne;

            this.winner.setVelocity(0, 0);
            this.winner.body.enable = false;

            this.ui_scene.events.emit("on_winner", this.winner);
            }

        //Deactivate and remove from scene
        shot.setActive(false).setVisible(false);
        shot.setVelocity(0, 0);
        shot.setPosition(-32, -32, false);

        //Play hit sound, responsive
        this.sound.play('hit');
        }

    update(time, delta)
        {
        super.update(time, delta);

        if (!this.hasInitalized || this.winner !== null)
            return;

        this.playerOne.update(time, delta);
        this.playerTwo.update(time, delta);
        }
    }

export class SnowballUI extends UI_Scene
    {
    healthOne = null;
    healthTwo = null;

    constructor()
        {
        super("Snowball_UI");
        }

    preload()
        {
        this.load.image('button', 'img/phaser-game/ui/buttons/ui-button-large.png');
        this.load.image('healthbar', 'img/phaser-game/ui/base-pixel.png');
        }

    create()
        {
        //Create Healthbars
        this.events.once("on_winner", this.drawWinner, this);

        //Draw bars
        this.healthOne = new Statusbar(this, config.width/2, config.height/5, 'healthbar', this.mainScene.playerOne.hp, this.mainScene.playerOne.hp);
        this.healthTwo = new Statusbar(this, config.width/2, config.height/5*4, 'healthbar', this.mainScene.playerTwo.hp, this.mainScene.playerTwo.hp);

        //Draw text
        this.CreateTextObject(config.width/2, config.height/5 - 32, "Player One", TextStyles.infoStyle);
        this.CreateTextObject(config.width/2, config.height/5*4 - 32, "Player Two", TextStyles.infoStyle);
        }

    drawWinner(winner)
        {
        this.buttonConfig =
            {
                text: "Return to Pet Mode",
                //onClick : () => this.ToggleTab(UI_STATES.INFO),

                key: "button",
                style: TextStyles.normal_header
            };

        if (winner == null)
            this.CreateTextObject(config.width / 2, config.height / 2, "The Game has ended in a Tie!", TextStyles.LargeHeader);
        else
            this.CreateTextObject(config.width / 2, config.height / 2, winner.name + "\nhas won!", TextStyles.LargeHeader);

        let btn = this.CreateButtonConfig(config.width / 2, config.height / 3 * 2, this.buttonConfig);

        btn.background.onClickEvents.push(() =>
        {
        let stats = DataHandler.GetObject("pet_data");
        stats.strength += 0.5;

        DataHandler.SaveObject("pet_data", stats);

        this.mainScene.map.destroy();
        this.mainScene.water.destroy();


        this.mainScene.LoadScene("Main")
        });

        //this.mainScene.LoadScene("Main");
        }
    }