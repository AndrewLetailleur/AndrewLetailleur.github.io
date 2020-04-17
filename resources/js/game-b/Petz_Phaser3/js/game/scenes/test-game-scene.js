import "../phaser.js";
import config from "../config.js";

import UI_Scene from "../core/Scenes/ui-scene.js";
import {Scene} from "../core/Scenes/scene.js";

import MovementEntityExample from "../entities/movement-entity-example.js";

import * as TextStyle from "../core/UI/styles/text-styles.js";
import * as Input from "../core/System/input-handler.js";

export class Game extends Scene
    {
    constructor()
        {
        super('Game', "Game_UI");
        }

    preload()
        {
        //Using the one input system for now
        this.keysOne =
            {
            up:     this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
            down:   this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
            left:   this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
            right:  this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),

            jump:   this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
            };

        this.keysTwo =
            {
            up:     this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP ),
            down:   this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN),
            left:   this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
            right:  this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT),

            jump:   this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.NUMPAD_ZERO)
            };

        this.load.image('player', 'img/phaser-game/pets/test-pet.png');
        this.load.image('snowball', 'img/phaser-game/snowball/snowball.png');
        }

    create()
        {
        //------ Setup -------

        //Input
        this.input = new Input.InputHandler(2);

        //Add new inputs to both
        this.input.inputs[0].add('snowball', this.keysOne, true);
        this.input.inputs[1].add('snowball', this.keysTwo, true);

        //Create Player
        this.playerOne = new MovementEntityExample(this, config.width/2, config.height/2, "player", this.input.inputs[0]);
        this.playerTwo = new MovementEntityExample(this, config.width/2, config.height/2, "player", this.input.inputs[1]);

        this.playerOne.SetPosition(config.width/3, config.height/2, false);
        this.playerTwo.SetPosition(config.width/1.5  , config.height/2, false);


        //Set name for future referencing
        this.debugText = this.add.text(20, 20,  this.debugStr);

        //UI
        this.scene.run("Game_UI");
        }

    update(time, delta)
        {
        this.playerOne.update(time, delta);
        this.playerTwo.update(time, delta);

        this.physics.add.collider(this.playerOne, this.playerTwo.snowballs);

        this.debug(true);
        }

    debug(canRun)
        {
        if (!canRun)
            return;

        this.debugText.setText(this.debugStr);
        }

    GeneratePet()
        {

        }
    }

export class Game_UI extends UI_Scene
    {
    constructor()
        {
        super("Game_UI");
        }

    preload() {}

    create()
        {
        this.headerStyle = TextStyle.normal_header;

        this.delta = 0;

        this.debugText = this.CreateTextObject(config.width/2, 100, "Hello World : " + this.delta, this.headerStyle);

        this.button = this.CreateButton(config.width/2, 200, "Button", "player");
        }

    update(time, delta)
        {
        let val = Math.round((this.delta + Number.EPSILON)/10) / 100;

        this.delta += delta;
        this.debugText.setText("Time since began = " + val);
        }

    CreateHeaderData()
        {
        //Split into 3 Sections

        }
    }

