import "../../phaser.js";
import config from "../../config.js";
import Entity from '../../core/entity.js';
import {Scene} from "../../core/Scenes/scene.js";
import * as Input from "../../core/System/input-handler.js";
import MovementEntityExample from "../../entities/movement-entity-example.js";
import {CarEntity} from "../../entities/projectiles/car-entity.js";
import TimerScene from "./timer-scene.js";
import UI_Scene from "../../core/Scenes/ui-scene.js";
import * as TextStyles from "../../core/UI/styles/text-styles.js";
import DataHandler from "../../core/System/data-handler.js"; //wasn't used in the 'test' version

//insert GLOBAL player variables/blah

//insert gameplay variables/blah, blocks/cursors/etc
let timer;// = 30000; //roughly 30 seconds. As it's ~/~ 1000 per "Delta" second.`
let timeOut;// = false;

var cursor;//the mouse for 'throwing' the stick?
var bgm;

let car;
let car2;
let car3;
let car4;

var scoreOne, scoreTwo;

export class FetchGame extends TimerScene
    {
    constructor() { super('Fetch_Game', 'Fetch_UI'); }

//insert global stuff to note


    preload()
        {//8456 for movement, 79. For Player 2 controls?
//Implementing the 'two player' ship now.


        this.load.image('road-map', 'img/phaser-game/fetch/fetch-bg.png');
        this.load.image('wall', 'img/phaser-game/fetch/Fetch-block.png');
        this.load.image('bar', 'img/phaser-game/fetch/Fetch-bar.png');

        this.load.image('player', 'img/phaser-game/pets/test-pet.png');

        this.load.image('car', 'img/phaser-game/fetch/car-two-t.png');

        this.load.image('stick', 'img/phaser-game/fetch/Stick.png');

        this.load.audio('bgm', 'audio/bgm/fetch/tropicalfantasy.ogg');
        }


    create()
        {
        let block, wall, fetch;//hypothetical "ice block" tiles
        let map;//for map reference

        map = this.add.image(config.width / 2, config.height / 2, 'road-map');

        map.displayWidth = config.width;
        map.displayHeight = config.height;

        console.log(this);

        timer = 1000 * 60;
        timeOut = false;

        scoreOne = 0;
        scoreTwo = 0;
        bgm = this.sound.add('bgm');
        bgm.play({volume: 0.1, loop: true});

        this.InputInit();

        this.playerOne = new MovementEntityExample(this, config.width / 2, config.height / 2,
            'player', this.inputController.inputs[0]);

        this.playerTwo = new MovementEntityExample(this, config.width / 2, config.height / 2,
            'player', this.inputController.inputs[1]);

        this.playerOne.SetPosition((config.width / 2 - config.width / 4), config.height - 32, false);
        this.playerTwo.SetPosition((config.width / 2 + config.width / 4), config.height - 32, false);


        car = this.add.group();

        for (let i = 1; i <= 4; i++)
            {//left blah
            car.add(new CarEntity(
                this, (i * 230), 120 + 125, 'car').setVelocityX(20));
            }//left
        for (let i = 1; i <= 5; i++)
            {//rght blah
            car.add(new CarEntity(
                this, (i * 190), 240 + 125, 'car').setVelocityX(-20));
            }//rght
        for (let i = 1; i <= 4; i++)
            {//left blah
            car.add(new CarEntity(
                this, (i * 230), 360 + 115, 'car').setVelocityX(20));
            }//left
        for (let i = 1; i <= 5; i++)
            {
            car.add(new CarEntity(
                this, (i * 190), 480 + 115, 'car').setVelocityX(-20));
            }


        car.scaleXY(1.4, 1.4);
        car.runChildUpdate = true;//to ensure the car spawners update regulary

        this.playerOne.setBounce(0.1, 0.1);
        this.playerTwo.setBounce(0.1, 0.1);

        this.playerOne.AddCollision(block);
        this.playerTwo.AddCollision(block);

        // let watarA = this.physics.add.overlap(block, this.playerOne,
        //     (wary, play) => this.carCollideOne(wary, play));
        //
        // let watarB = this.physics.add.overlap(block, this.playerTwo,
        //     (wary, play) => this.carCollideTwo(wary, play));

        let carColA = this.physics.add.overlap(car, this.playerOne,
            (cary, play) => this.carCollideOne(cary, play));
        let carColB = this.physics.add.overlap(car, this.playerTwo,
            (cary, play) => this.carCollideTwo(cary, play));




        fetch = new Entity(this, Phaser.Math.Between(112, config.width - 112), 112, 'stick');
        fetch.setImmovable();

        fetch.AddOverlap(this.playerOne, this.oneWin);//this.physics.add.overlap(fetch, this.playerOne, this.oneWin, null, this);
        fetch.AddOverlap(this.playerTwo, this.twoWin);//this.physics.add.overlap(fetch, this.playerTwo, this.twoWin, null, this);


        wall = this.add.group();
        wall.add(this.physics.add.sprite(1, config.height / 2, 'bar').setSize(10, config.height).setImmovable());
        wall.add(this.physics.add.sprite(config.width - 1, config.height / 2, 'bar').setImmovable().setSize(10, config.height));



        this.physics.add.overlap(car, wall, (cary, edge) => this.carWall(cary, edge));
        super.create();

        block = this.add.group();//make it block scoped, create wise
        block.add(this.physics.add.sprite(config.width / 2, 42, 'wall').setImmovable());//spawn the object


        }

    InputInit()
        {
        let keysOne =
            {
                up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
                down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
                left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
                right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)//,
            };

        let keysTwo =
            {
                up: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP),
                down: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN),
                left: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
                right: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT)//,
            };


        this.inputController = new Input.InputHandler(2);//(2);
        this.inputController.inputs[0].add('player', keysOne, true);//NEEDS to add the controllers, just
        this.inputController.inputs[1].add('player', keysTwo, true);
        }

    carCollideOne(car, player)
        {
//pet hit SFX
        this.resetPos(player, (config.width / 2 - config.width / 4));
        }

    carCollideTwo(car, player)
        {
//pet hit SFX

        this.resetPos(player, (config.width / 2 + config.width / 4));
        }


//stick caught
    oneWin(stick, One)
        {
        if (!timeOut)
            scoreOne++;

        this.stickBite(One, this.playerTwo, scoreOne, "P1", stick);//stick.SetPosition(Phaser.Math.Between(112, config.width - 112), 96, false);
        }

    twoWin(stick, Two)
        {
        if (!timeOut)
            scoreTwo++;

        this.stickBite(this.playerOne, Two, scoreTwo, "P2", stick);
        }

    resetPos(player, x)
        {
        player.SetPosition(x, config.height - 32, false);
        player.setVelocity(0,0);
        }

    carWall(cary, edge)
        {

        if (cary.x > config.width / 2)
            this.resetCar(cary, 64);
        else
            this.resetCar(cary, config.width - 64);
        }

    resetCar(cary, x)
        {
        cary.SetPosition(x, cary.y, false);//keep y axis as is
        }


    stickBite(pOne, pTwo, award, call, stick)
        { //reset position and velocity of everyone, AFTER awarding the score //award++;
        stick.SetPosition(Phaser.Math.Between(112, config.width - 112), 112, false);

        pOne.SetPosition((config.width / 2 - config.width / 4), config.height - 32, false);
        pTwo.SetPosition((config.width / 2 + config.width / 4), config.height - 32, false);
        }

    update(time, delta)
        {
        super.update(time, delta);

        if (!this.hasInitalized || this.endGame || timeOut)
            return;

        this.playerOne.move();
        this.playerTwo.move();

        this.countdown(delta);
        }

    countdown(delta)
        {
        timer -= delta;

        console.log(timer);
        console.log(timeOut);

        if (timer <= 0)
            {
            timeOut = true;
            this.ui_scene.events.emit("on-winner");

            this.playerOne.setVelocity(0, 0);
            this.playerTwo.setVelocity(0, 0);
            }
        }

    debug(canRun)
        {
        if (!canRun)
            return;
        }
    }

export class FetchUI extends UI_Scene
    {
    constructor()
        {
        super("Fetch_UI");
        }

        preload()
            {
            this.load.image('button', 'img/phaser-game/ui/buttons/ui-button-large.png');

            }


    create()
        {
        this.buttonConfig =
            {
                text: "Return to Pet Mode",
                //onClick : () => this.ToggleTab(UI_STATES.INFO),

                key: "button",
                style: TextStyles.normal_header
            };

        this.timerText = this.CreateTextObject(config.width/2, 30, parseInt((timer/1000).toString()), TextStyles.LargeHeader);
        this.scoreOne = this.CreateTextObject(100, 30, scoreOne, TextStyles.LargeHeader);
        this.scoreTwo = this.CreateTextObject(config.width - 100, 30, scoreTwo, TextStyles.LargeHeader);

        this.events.once('on-winner', () =>
            {
            this.CreateTextObject(config.width/2, config.height/3, "TIMES UP!", TextStyles.LargeHeader);
            let winnerText = this.CreateTextObject(config.width/2, config.height/2, "", TextStyles.LargeHeader);

            this.time.addEvent(
                {
                    delay: 3000,
                    loop: false,

                    callback: () =>
                        {
                        winnerText.setText("And the winner is...");
                        },
                });

            this.time.addEvent(
                {
                delay: 6000,
                loop: false,

                callback: () =>
                    {
                    if (scoreOne > scoreTwo)
                        {
                        winnerText.setText("Player One!");
                        }
                    else
                    if (scoreTwo > scoreOne)
                        {
                        winnerText.setText("Player Two!");
                        }
                    else
                        {
                        winnerText.setText("No one! It's a Tie!");
                        }

                    let btn = this.CreateButtonConfig(config.width / 2, config.height / 3 * 2, this.buttonConfig);

                    btn.background.onClickEvents.push(() =>
                    {
                    let stats = DataHandler.GetObject("pet_data");
                    stats.fun += 0.5;

                    DataHandler.SaveObject("pet_data", stats);

                    this.mainScene.LoadScene("Main")
                    });
                    },
                });

            });
        }

    update(time, delta)
        {
        if (timeOut)
            return;

        super.update(time, delta);

        this.timerText.setText(parseInt((timer/1000).toString()));
        this.scoreOne.setText(scoreOne);
        this.scoreTwo.setText(scoreTwo);


        }
    }