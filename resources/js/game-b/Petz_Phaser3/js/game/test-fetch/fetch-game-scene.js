import "../../phaser.js";
import config from "../../../js/game/config.js";
import Entity from '../core/entity.js';
import {Scene} from "../core/Scenes/scene.js"; //wasn't used in the 'test' version

    //insert gameplay variables/blah, blocks/cursors/etc
let timer;// = 30000; //roughly 30 seconds. As it's ~/~ 1000 per "Delta" second.`
let timeOut;// = false;

var cursor;//the mouse for 'throwing' the stick?
var bgm;

let block, wall, fetch;//hypothetical "ice block" tiles
let car;

var scoreOne, scoreTwo;

export default class Game extends Scene {
    constructor() { super('Game'); }
    //insert global stuff to note


    preload() {//8456 for movement, 79. For Player 2 controls?
        //Implementing the 'two player' ship now.
        this.keysOne =
            {
            up:     this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
            down:   this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S),
            left:   this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
            right:  this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)//,
//Space/X //jump:   this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
            };
        this.keysTwo =
            {
            up:     this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP ),
            down:   this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN),
            left:   this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
            right:  this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT)//,
//Enter/0?//jump:   this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.NUMPAD_ZERO)
            }; //cursors = this.input.keyboard.createCursorKeys();

            //lazy test background, it just works
        this.load.image('lmap',     'img/phaser-game/fetch/fetch-bg.png');
        this.load.image('wall',     'img/phaser-game/fetch/Fetch-block.png');
        this.load.image('bar',      'img/phaser-game/fetch/Fetch-bar.png');
            //Player test default
        this.load.image('player',   'pets/test-pet.png');

            //lazy test background, it just works
        this.load.image('car', '../../../img/phaser-game/fetch/car-two-t.png');

            //load misc. Image assets
        this.load.image('stick', '../../../img/phaser-game/fetch/Stick.png');
            //load audio sfx

            //load bgm music
        this.load.audio('bgm', '../../../audio/bgm/fetch/tropicalfantasy.ogg');



    }


    create() {
        timer = 30000; //roughly 30 seconds. As it's ~/~ 1000 per "Delta" second.`
        timeOut = false;

        scoreOne = 0;
        scoreTwo = 0;
        //this.createSFX();
        bgm = this.sound.add('bgm');
        bgm.play({volume: 0.1, loop: true});


            //colliders, son!
        block = this.add.group();//make it block scoped, create wise
        block.add(this.physics.add.sprite(config.width/2, 42, 'wall').setImmovable());//spawn the object
        wall = this.add.group();
        wall.add(this.physics.add.sprite(0, config.height/2, 'bar').setImmovable());
        wall.add(this.physics.add.sprite(config.width, config.height/2, 'bar').setImmovable());

        //block.add(this.physics.add.sprite(config.width/2, config.height - 32, 'wall').setImmovable());//spawn the object

        let map;//for map reference
            //should load in 'layers'. "Background" can be left as is
                //nts, scale this image
        map = this.add.image(config.width/2, config.height/2,'lmap');//this.createBackground();
//sprite.displayWidth=game.config.width*.1; sprite.scaleY=sprite.scaleX
        map.displayWidth = config.width*1; 
        map.displayHeight = config.height*1; 

            //the fetch object
        fetch = new Entity(this, Phaser.Math.Between(112, config.width - 112), 112, 'stick');
        fetch.setImmovable();
        console.log(fetch.GetPosition);
        //Pre-GUI Layer, for collide ease
            //Input set up
        this.input = new Input.InputHandler(2);//(2);
        this.input.inputs[0].add('player', this.keysOne, true);//NEEDS to add the controllers, just 
        this.input.inputs[1].add('player', this.keysTwo, true);

            //Create Player
        this.playerOne = new MovementEntityExample(this, config.width/2, config.height/2, 'player', this.input.inputs[0]);
        this.playerTwo = new MovementEntityExample(this, config.width/2, config.height/2, 'player', this.input.inputs[1]);
            //Player spawn positions, 

        this.playerOne.SetPosition((config.width/2 - config.width/4), config.height - 32, false);
        this.playerTwo.SetPosition((config.width/2 + config.width/4), config.height - 32, false);        

        //enemy variables, and invisi-spawner positions.
        car = this.add.group();
        //car = New Entity(this.scene, x, y, "car", 0);//this.add.group();


            //no reference to car Spawner in group.
            //As is, "SetVelocity" bugs up
        for (var i = 1; i <= 4; i++) {//left blah
            car.add(new CarEntity(
                this, (i * 230), 120 + 125, 'car').setVelocityX(45));
        }//left
        for (var i = 1; i <= 5; i++) {//rght blah
            car.add(new CarEntity(
                this, (i * 190), 240 + 125, 'car').setVelocityX(-60));
        }//rght
        for (var i = 1; i <= 4; i++) {//left blah
            car.add(new CarEntity(
                this, (i * 230), 360 + 115, 'car').setVelocityX(30));
        }//left
        for (var i = 1; i <= 5; i++) {//rght blah
            car.add(new CarEntity(
                this, (i * 190), 480 + 115, 'car').setVelocityX(-45));
        }//rght

        //set scale of all objects
        car.scaleXY(1.4, 1.4);
        car.runChildUpdate = true;//to ensure the car spawners update regulary
        //console.log("hole.runChildUpdate = " + hole.runChildUpdate);


        /*COLLIDERS SON!*/
            //general bounce, to 'bar' bottle neck struggles, 'bumper' logic
        this.playerOne.setBounce(0.5, 0.5);
        this.playerTwo.setBounce(0.5, 0.5);
  
            //water colliders
        var watarA = this.physics.add.overlap(block, this.playerOne,
            (wary, play) => this.carCollideOne(wary, play));
        // this.playerOne.AddCollision(block); this.playerOne.AddCollision(this.playerTwo);
        var watarB = this.physics.add.overlap(block, this.playerTwo,
            (wary, play) => this.carCollideTwo(wary, play));
        // this.playerTwo.AddCollision(block); this.playerTwo.AddCollision(this.playerTwo);

            //car colliders
        var carColA = this.physics.add.overlap(car, this.playerOne,
            (cary, play) => this.carCollideOne(cary, play));
        var carColB = this.physics.add.overlap(car, this.playerTwo,
            (cary, play) => this.carCollideTwo(cary, play));
            //fetch colliders. Has a 'debug call' for identity for now.
        fetch.AddOverlap(this.playerOne, this.oneWin);//this.physics.add.overlap(fetch, this.playerOne, this.oneWin, null, this);
        fetch.AddOverlap(this.playerTwo, this.twoWin);//this.physics.add.overlap(fetch, this.playerTwo, this.twoWin, null, this);

        var carWall = this.physics.add.overlap(car, wall,
            (cary, edge) => this.carWall(cary, edge));

    }
        //createSFX(){/*Add nude sounds*/}
    //

    carCollideOne(car, player) {
        //pet hit SFX
        console.log("P1 has been hit by " + car);
        this.resetPos(player, (config.width/2 - config.width/4));
    }
    carCollideTwo(car, player) {
        //pet hit SFX
        console.log("P2 has been hit by " + car);
        this.resetPos(player, (config.width/2 + config.width/4));
    }


        //stick caught
    oneWin(stick, One) {
        if (!timeOut) {scoreOne++; /*pet catch SFX*/}
        else console.log("Time is out. No more sticks!");
        this.stickBite(One, this.playerTwo, scoreOne, "P1", stick);//stick.SetPosition(Phaser.Math.Between(112, config.width - 112), 96, false);
    }
    twoWin(stick, Two) {
        if (!timeOut) {scoreTwo++; /*pet catch SFX*/}
        else console.log("Time is out. No more sticks!");
        this.stickBite(this.playerOne, Two, scoreTwo, "P2", stick);//stick.SetPosition(Phaser.Math.Between(112, config.width - 112), 96, false);
    }

    //reset player pos to 'initial' middle
    resetPos (player, x) {
        player.SetPosition(x, config.height - 32, false);
    }

    carWall(cary, edge) {
        console.log(cary.x);
        if (cary.x > config.width/2)
            this.resetCar(cary, 64);
        else
            this.resetCar(cary, config.width - 64);
        //endif
    }

    //reset player pos to 'initial' middle
    resetCar (cary, x) {
        cary.SetPosition(x, cary.y, false);//keep y axis as is
    }


    stickBite(pOne, pTwo, award, call, stick){ //reset position and velocity of everyone, AFTER awarding the score //award++;
        stick.SetPosition(Phaser.Math.Between(112, config.width - 112), 112, false);    //double check, to ensure just one object is reset, not many. JNC
        console.log(fetch);
                 //p___.x=config.width/2 ? config.width/4,
        pOne.SetPosition((config.width/2 - config.width/4), config.height - 32, false);
        //pOne.SetAcceleration(0,0);
        pTwo.SetPosition((config.width/2 + config.width/4), config.height - 32, false);
        //pTwo.SetAcceleration(0,0);              // p___.y = config.height - 96
        console.log(call + " is given points. Current score is= " + award); //  award++;//give the award, incrementally
    }

    update(time, delta) {// console.log(time); console.log(delta);
        this.playerOne.update(time, delta);
        this.playerTwo.update(time, delta);
        //this.hole.update(time, delta);
 /*
        if(car.x < 0 || car.x > config.width)
        {
            if(this.car.body.x < (config.width / 2) )
                this.SetPosition(config.width - 30, this.car.body.y);
            else
                this.SetPosition(30, this.car.body.y);
            //endif
        }*/

        if(!timeOut)
            this.countdown(delta);
        //else this.bgm.stop();
        //endif

    }

    countdown(delta){
        timer -= delta;
        if (timer > 0 && !timeOut){/* console.log("Time: " + timer);*/}
        else{//"Trigger a Game Over function"
         /*time up SFX*/
            console.log("Time is up. Time at: " + timer);
            timeOut = true;
        }//endif
    }
 
    debug(canRun) {
        if (!canRun)
            return;

//        this.debugText.setText(this.debugStr);
    }

}//end program