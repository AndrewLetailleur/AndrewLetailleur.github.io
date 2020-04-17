import "../phaser.js";
import config from "../../../js/game/config.js";
import Entity from '../core/entity.js'; //wasn't used in the 'test' version

import UI_Scene from "../core/Scenes/ui-scene.js";
import {Scene} from "../core/Scenes/scene.js";

import MovementEntityExample from "../test-andrew/snowball-players.js"; //"../entities/movement-entity-example.js";

import * as TextStyle from "../core/UI/styles/text-styles.js";
import {ProjectilePool} from "../entities/projectiles/projectile-pool.js";
import * as Input from "../core/System/input-handler.js";//import InputHandler from '../core/System/input-handler.js';

import * as VectorMath from '../core/System/DataTypes/VectorTypes.js';
import { Vector2 } from '../core/System/DataTypes/VectorTypes.js';


//insert GLOBAL values here;
    //var player;

    //player 1 and 2
    let oneHP = 4;//p1 snow collider     hacked guess
    let twoHP = 4;//p2 snow collider

    var cursors;
    let water;//the water blocks

    var throwSFX, hitSFX, missSFX;// 
    var t_one = false;
    var t_two = false;
    var warudo;

//  let block;//hypothetical "ice block" tiles

export default class Game extends Scene {
    constructor() { super('Game', "Game_UI"); }
    //insert global stuff to note

    preload() {//8456 for movement, 79. For Player 2 controls?
        //Implementing the 'two player' ship now.
        this.keysOne =
            {
            up:     this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
            down:   this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
            left:   this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
            right:  this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
                //fire, Space/X
            jump:   this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
            };

        this.keysTwo =
            {
            up:     this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP ),
            down:   this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN),
            left:   this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
            right:  this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT),
                //fire, Enter/0?
            jump:   this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.NUMPAD_ZERO)
            }; //cursors = this.input.keyboard.createCursorKeys();

            //lazy test background, it just works
        this.load.image('lmap', '../../../img/phaser-game/snowball/Snowball_Map_BASIC.png');
  
            //Player test default
        this.load.image('player', '../../../img/phaser-game/pets/test-pet.png');

            //Test Images, in load order
//        this.load.image('wall', '../../../img/phaser-game/snowball/snowblock.png');   //Snow Block
        this.load.image('water', '../../../img/phaser-game/snowball/waterblock.png'); //Water
        this.load.image('snowball', '../../../img/phaser-game/snowball/snowball.png');    //Snowball

        //load audio effects
        this.load.audio('throw', '../../../audio/sfx/snowball/ThrowFX.wav' );
        this.load.audio('miss', '../../../audio/sfx/snowball/LandFX.wav' );
        this.load.audio('hit', '../../../audio/sfx/snowball/LandFX.wav');
    // ]);D:\GithubArchive\Petz_Phaser3\audio\sfx\snowball\LandFX.wav
        //load bgm
        this.load.audio('snow-bgm', '../../../audio/bgm/snowball/Rewind.ogg');
    }

    create() {
        this.createSFX();
        var bgm = this.sound.add('snow-bgm');
        bgm.play({volume: 0.1, loop: true});

            //should load in 'layers'.
        this.createBackground();//short term fix, that just works.
        this.createObstacles();//then spawn the water, before we add in input/etc

            //Input set up
        this.input = new Input.InputHandler(2);
            //Add new inputs to both players
        this.input.inputs[0].add('snowball', this.keysOne, true);
        this.input.inputs[1].add('snowball', this.keysTwo, true);

            //Create Player
        this.playerOne = new MovementEntityExample(this, config.width/2, config.height/2, 'player', this.input.inputs[0]);
        this.playerTwo = new MovementEntityExample(this, config.width/2, config.height/2, 'player', this.input.inputs[1]);
            //Player spawn positions, 

        this.playerOne.SetPosition((config.width/2 - config.width/4), config.height/2, false);
        this.playerTwo.SetPosition((config.width/2 + config.width/4), config.height/2, false);
   
        //this.physics.add.collider(this.playerOne, this.playerTwo.snowballs);
        //this.physics.add.collider(this.playerTwo, this.playerOne.snowballs); 
        
        this.physics.add.overlap(
            this.playerOne, this.playerTwo.snowballs,
            this.hitOne, null, this);
        this.physics.add.overlap(
            this.playerTwo, this.playerOne.snowballs,
            this.hitTwo, null, this);
        //

        //bullet bounds checking?
        //warudo = Phaser.Geom.Rectangle(0, 0, config.width, config.height);
        
        
        

        
    }

//    resetLives(){ var ohp = 3; var thp = 3; }

    createSFX(){
        throwSFX = this.sound.add('throw');
        hitSFX = this.sound.add('hit');
        missSFX = this.sound.add('miss');
    }

    createBackground(){
        this.add.image(config.width/2, config.height/2,'lmap');//short term fix, that just works.
        //insert better, fancier tiled map code here.
    }
    createObstacles(){
        water = this.add.group();//make it block scoped, create wise
        //spawn water
        for (let i = -3; i <= 3; i++) {//X first before Y, as it 'shifts'.
            let x = (config.width/2) + (i * 32);
            for (let j = 0; j <= 32; j++) {//Y Last, as it should iterate before checking for another line.
                let y = 16 + (32 * j);//160 > 288
/*SPAWN*/       water.add(this.physics.add.sprite(x, y, 'water').setImmovable());//spawn the object
            }
        }//spawn blocks
    }//spawnBlock(block){}

    hitOne(player, shot) {
        oneHP--;
        if (oneHP <= 0 && (player.active)) {
            player.setActive(false).setVisible(false);
            console.log("P1 is DOWN!");
            //Trigger "Round Points, after set time"
        } else if (player.active) {
            shot.setActive(false).setVisible(false);//test hack
            shot.SetPosition(config.width/2, 0);
            shot.setVelocity(0, 0);
            console.log("P1 is hit! HP Left:  " + oneHP);
            hitSFX.play();
        }
    }
    hitTwo(player, shot) {
        twoHP--;
        if (twoHP <= 0 && (player.active)) {
            player.setActive(false).setVisible(false);
            console.log("P2 is DOWN!");
            //Trigger "Round Points, after set time"
        } else if(player.active) {
            shot.setActive(false).setVisible(false);//test hack
            shot.SetPosition(config.width/2, 0);
            shot.setVelocity(0, 0);
            console.log("P2 is hit! HP Left:  " + oneHP);
            hitSFX.play();
        }
    }

    hitMiss(shot){//'deactivate' object, code?
        shot.setActive(false).setVisible(false);//test hack
        shot.SetPosition(config.width/2, 50);
        shot.setVelocity(0, 0);
        missSFX.play();
    }

    update(time, delta) {
        this.playerOne.update(time, delta);
        this.playerTwo.update(time, delta); 


        //audio hack a, may not work.
        if(this.playerOne.snowballs.x < 0 
        || this.playerOne.snowballs.x > config.width )
        {
            this.hitMiss(this.playerOne.snowballs);
            console.log("Mis is");
        }
        if(this.playerTwo.snowballs.x < 0 
        || this.playerTwo.snowballs.x > config.width )
        {
            this.hitMiss(this.playerTwo.snowballs);
            console.log("Mis is");
        }

        //basic audio
        if (this.keysOne.jump.isDown && !t_one) {
            throwSFX.play(); t_one = true;
        } else if (this.keysOne.jump.isUp)
            t_one = false;
        //end audio one
        if (this.keysTwo.jump.isDown && !t_two) {
            throwSFX.play(); t_two = true;
        } else if (this.keysTwo.jump.isUp)
            t_two = false;
        //end audio two

        this.debug(true);
    }

 
    debug(canRun) {
        if (!canRun)
            return;

//        this.debugText.setText(this.debugStr);
    }


}//end program