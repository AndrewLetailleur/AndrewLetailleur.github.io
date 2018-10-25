var game = new Phaser.Game(600, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

//var sound = Phaser.Sound; //JNC hassle wise

/*http://codeperfectionist.com/articles/phaser-js-tutorial-building-a-polished-space-shooter-game-part-1/  based on this tutorial, asset hack wise
*/

//spawn player stuff
	//za player
var player;
	//controls
var moveCtrl;//the movement code for player
var fireCtrl; //the trigger key for player
  /*no fire rate needed by 'one shot on screen' limit via pool limitations
	unless 'insisted' to have firing rate.*/
	
//movement varieties
var ACCEL = 250;
var DRAG = 400;
var MAX_SPEED = 300;
var bank;
var border_edge = 20;	
//
var pShots;
var BULLET_VELO = -600;
	
//player variables
var lives;//is an array of objects
var livesVAL = 3;//initial amount of lives
var bonusREQ = 7;//sets the minimum requirement
var scoreBONUS;
 
var scoreVAL = 0;//initial score value
var scoreTXT;//a string array of text, plus score
//end of player variables
	
	
	//(rest of) the objects themselves
var starfield;//the starfield say
	//include FX
var explosions;

var testEnemy_Timer;
var testEnemy;/* //test prevab	//begin speculated values
var baseFoe; //space invaders
var advFoe;  //galaxians
var bossFoe; //gorf spawner, or improvised boss
*/ //end speculated values 

//end of stuff variables.
var gameOver;//the game over trigger, buggy ATM


var snd;//sound fx
	//misc variables for player



//Normally you'd use this to load your game assets (or those needed for the current State), akin to Unity Awake?
function preload() {//preload is called first. 
	//load static art & images
	game.load.image('playShip', 'IMG/spaceShooter/ShipMono.png'); //the ship
	game.load.image('starfield', 'IMG/spaceShooter/starfield.png'); //the background
	game.load.image('pShot', 'IMG/spaceShooter/BulletO.png');//the projectile shot
	//game.load.spritesheet(); //test enemy, make it animated later
	game.load.image('enemy-test', 'IMG/SpaceShooter/FOE.png');//a basic enemy
	//get a custom asset later, potential copyright fears/est wise
	game.load.spritesheet('explosion', 'IMG/spaceShooter/explode.png', 128, 128); //perfect square
	game.load.audio('gun', 'assets/audio/shoot.wav');//load audio FAIL
}
//100% Warks

//this includes the loading of any assets from the Loader. Akin to Unity Start?
function create() { //create is called once preload has completed

//  The scrolling starfield background
    starfield = game.add.tileSprite(0, 0, 600, 600, 'starfield');
	
//	create graphical test dummy for 'level' icon?
/*	var gpx = game.add.graphics(100, 100);
	gpx.lineStyle(2, 0x0033FF, 1);
	gpx.beginFill(0x0099FF, .4);//transparent test
    gpx.drawRect(475, 460, 12.5, 25);
*/	

//	the bullet shot group, pShots!
	pShots = game.add.group();
	pShots.enableBody = true;
	pShots.physicsBodyType = Phaser.Physics.ARCADE;//block physics by image. Simple.
	pShots.createMultiple(1, 'pShot');//to ensue a space invaders/galaxian lite limit on shots available
	pShots.setAll('anchor.x', 0.5);
	pShots.setAll('anchor.y', 1);
	pShots.setAll('outOfBoundsKill', true);//remove if out of bounds
	pShots.setAll('checkWorldBounds', true);
	
//  The player, as a heroic ship
    player = game.add.sprite(300, 535, 'playShip');//32x32 ship spawned her
	player.health = livesVAL;		//where lives value =/= health variable
    player.anchor.setTo(0.5, 0.5);
	game.physics.enable(player, Phaser.Physics.ARCADE);//block physics by image. Simple.
	//set's physics limits
	player.body.maxVelocity.setTo(MAX_SPEED, MAX_SPEED);
    player.body.drag.setTo(DRAG, DRAG);
	//event listeners
	player.events.onKilled.add(function(){});//if player is killed, do X
	player.events.onRevived.add(function(){});//when player is revived, do Y

//	the player controls
	moveCtrl = game.input.keyboard.createCursorKeys();
	fireCtrl = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);//to fire a bullet, trig wise
//end player prefabs
	
//	explode fx pool
    explosions = game.add.group();
    explosions.enableBody = true;
    explosions.physicsBodyType = Phaser.Physics.ARCADE;//block physics by image. 
    explosions.createMultiple(30, 'explosion');
    explosions.setAll('anchor.x', 0.5);
    explosions.setAll('anchor.y', 0.5);
	explosions.setAll('scale.x', 0.5);//scale down test addition
	explosions.setAll('scale.y', 0.5);
    explosions.forEach( function(explosion) {
        explosion.animations.add('explosion');//animates the explosion, hope
    });//end for loop
	
//	Enemies, after player spawned
	testEnemy = game.add.group();
	testEnemy.enableBody = true;
	testEnemy.physicsBodyType = Phaser.Physics.ARCADE; //sets physics
	testEnemy.createMultiple(5, 'enemy-test');//spawns multiple, with the sprite asset in question
	testEnemy.setAll('anchor.x', 1);
	testEnemy.setAll('anchor.y', 1);
	//no scaling needed here
	testEnemy.setAll('angle', 0); //already rotated
	testEnemy.forEach(function(enemy){
		enemy.damageAmount = 1;//to represent lives takenth away
	});
	
	testEnemy.setAll('outOfBoundsKill', true);
	testEnemy.setAll('checkWorldBounds', true);

		//set freqency of spawning. Cue event timers/est
	game.time.events.add(1000, testEnemy_Timer);//spawns the enemy, after trig.
	//TODO later, spawn an 'array', then check to see if array is still there?
	
//	create/set up the group of lives. Destroy the last array first, later
	lives = game.add.group();
	for (var i = 0; i < livesVAL; i++) {
		var ship = lives.create(8 + (36 * i), 560, 'playShip');
	}//end for
	//no lives.render here
	//lives.render();
//	do score counter instead
	scoreTXT = game.add.text(game.world.centerX - 100, (game.world.centerY * 2 - 40), "Score: " + scoreVAL, { font: "32px Arial", fill: "#09F", align: "center" });
	scoreBONUS = bonusREQ;//set bonus to immutable value ref
	//scoreTXT.render();
	//render SEEMS to be pretty bugged here
	
//	GameOver SFX
    gameOver = game.add.text(game.world.centerX, game.world.centerY, 'GAME OVER!', { font: '84px Arial', fill: '#fff' });
    gameOver.anchor.setTo(0.5, 0.5);
    gameOver.visible = false;
	
	//	fx sound, *BUGGY ATM!* Thus, placed lastly...
	snd = new Phaser.Sound(game, 'pgun',1,false);
}
//disable snd from create later?, end create

//same as Unity version, per frame say, render wise?
function update() {//updates all per frame
		
		//  Scroll the background. X addition moves/shifts depending on player movement
    starfield.tilePosition.y += 5;
    starfield.tilePosition.x += player.body.velocity.x / (ACCEL / 3 * 2);//1;//tweak, consider doing 'random' there?
	
		// set acceleration to 0, and tinker from there
    player.body.acceleration.setTo(0, 0);
	
		//begin fire input, if player is alive AND (either click OR spacebar is pressed)
	if (player.alive && (fireCtrl.isDown || game.input.activePointer.isDown))
		fireBullet();//if spacebar or mouse is clicked, and player alive
	//endif	
	
	//begin movement code
		//begin cursor input
	if (moveCtrl.left.isDown){player.body.velocity.x = -ACCEL;}
	else if (moveCtrl.right.isDown) {player.body.velocity.x = ACCEL;}//endif

		//begin mouse input. Border edge used for edges
    if (game.input.x < game.width - border_edge &&
        game.input.x > border_edge &&
        game.input.y > border_edge &&
        game.input.y < game.height - border_edge) {
        var minDist = border_edge;
        var dist = game.input.x - player.x;
        player.body.velocity.x = MAX_SPEED * game.math.clamp(dist / minDist, -1, 1);
	}//endif
	
		//  Stop at screen edges, to avoid screen out
    if (player.x > game.width - border_edge) {
        player.x = game.width - border_edge;
        player.body.acceleration.x = 0;
    } if (player.x < border_edge) {
        player.x = border_edge;
        player.body.acceleration.x = 0;
    }//end if
	
	//squash image for an illusion of banking, bank/ster wise
		/*source from this tutorial 	
			http://codeperfectionist.com/articles/phaser-js-tutorial-building-a-polished-space-shooter-game-part-1/   
		*/
	//	hail the tutorial for helping with math here
	bank = player.body.velocity.x / MAX_SPEED;
	player.scale.x = 1 - Math.abs(bank) / 2;
	player.angle = bank * 10;
		//end player stuff for real this time
	
//	check collisions
	game.physics.arcade.overlap(player, testEnemy, shipCollide, null, this);
	game.physics.arcade.overlap(testEnemy, pShots, hitEnemy, null, this);
	//check also for if test enemy est happens, est enemy wise

	
	//buggy game over trigger. Be VIGILANT on debugging this mess
	if (! player.alive && gameOver.visible === false) {//the apocalypse has happened.
        gameOver.visible = true;
		gameOver.alpha = 0;//to ensue visibility, makes the gameOver visible
        var fadeInGameOver = game.add.tween(gameOver);
        fadeInGameOver.to({alpha: 1}, 1000, Phaser.Easing.Quintic.Out);//cue transition anime
        fadeInGameOver.onComplete.add(setResetHandlers);//trigger a reset event
        fadeInGameOver.start();
        function setResetHandlers() {
            //  The "click to restart" handler, call upon wise on a function external.
            tapRestart = game.input.onTap.addOnce(_restart,this);
            spaceRestart = fireCtrl.onDown.addOnce(_restart,this);
            function _restart() {//if input to fire is clicked. Restart the game session
              tapRestart.detach();
              spaceRestart.detach();
              restart();
            }
        }//end setResetHandlers
    }//end alive trigger
}//end of update function

function restart () {//restarts the character
	//set up, and revive character
	livesVAL = 3;
	player.health = livesVAL;
	healthUpdate();
	player.revive();
	
    //  Reset the enemies
    testEnemy.callAll('kill');
    game.time.events.remove(testEnemy_Timer);
    game.time.events.add(1000, testEnemy_Timer);

    //  Revive the player
    scoreVAL = 0;
	scoreBONUS = bonusREQ;//reset back to normal
    scoreUpdate();

    //  Hide the text
    gameOver.visible = false;

}

function scoreUpdate() {
	scoreTXT.text = "Score: " + scoreVAL;
	//begin conditional life increment
	if (scoreVAL >= scoreBONUS) {
		scoreBONUS += bonusREQ; //so that every X gives a life
		if (livesVAL < 5) /*if lives are below max*/
			extraLife();
		//endif
	}//endif

}

	//health update logic COULD be used to update the assets of levels/est too
function healthUpdate() {
	player.health = livesVAL;
	lives.callAll('kill');//clear, then re-add
	if (livesVAL > 0) {
		lives = game.add.group();
		for (var i = 0; i < livesVAL; i++) {
		var ship = lives.create(8 + (36 * i), 560, 'playShip');
		}//end for
	} else
	player.kill();
	//
}
function extraLife() {
	if (livesVAL < 5) { //if max lives isn't reached
		livesVAL++;
		player.health = livesVAL;
		lives.callAll('kill');//clear, then re-add
		lives = game.add.group();
		for (var i = 0; i < livesVAL; i++) {
			var ship = lives.create(8 + (36 * i), 560, 'playShip');
		}//end for
	}//end if
}



	//cue enemy AI code
//	the test code, testEnemy wise
function testEnemy_Timer() {
	var MIN_ENEMY_SPACING = 30;
	var MAX_ENEMY_SPACING = 300;
	var ENEMY_SPEED = 200;

    var enemy = testEnemy.getFirstExists(false);
    if (enemy) {
        enemy.reset(game.rnd.integerInRange(0, game.width), 0);
        enemy.body.velocity.x = game.rnd.integerInRange(-100, 100);
        enemy.body.velocity.y = ENEMY_SPEED;
        enemy.body.drag.x = -100;//ADDS speed over time, as it's opposite of dragging
		enemy.body.drag.y = -10;//test prefab of 50, for barring movement?
		
		//rotation tweak
		enemy.update = function () {
			enemy.angle = 0 - ((game.math.radToDeg(Math.atan2(enemy.body.velocity.x, enemy.body.velocity.y))) /2) ;
		}
    }
	

    //  Send another enemy soon
    game.time.events.add(game.rnd.integerInRange(MIN_ENEMY_SPACING, MAX_ENEMY_SPACING), testEnemy_Timer);
}

//function createBaseAI(){}
	//if switch sides
		//add momentum down force, y add on axis
		//then invert x velocity, and check the left instead.
	//end if
//end guesses

//function createAdvAI(){}

// It is called during the core game loop AFTER debug, physics, plugins and the Stage have had their preUpdate methods called. If is called BEFORE Stage, Tweens, Sounds, Input, Physics, Particles and Plugins have had their postUpdate methods called.


function render() {/*debug render, very very buggy*/
	for (var i = 0; i < testEnemy.length; i++)
    {game.debug.body(testEnemy.children[i]);}
    game.debug.body(player);
}

function fireBullet () {
	//grab first bullet from the pool
	
	var pShot = pShots.getFirstExists(false);
	
	if (pShot) {
		//fire the bullet grabbed
		//snd.play();//jnc
			//fxgun.play();//play a sound test
		pShot.reset(player.x, player.y - 16);
		pShot.body.velocity.y = BULLET_VELO; //shot speed?
	}
}

function shipCollide(player, enemy) {
	var explosion = explosions.getFirstExists(false);
    explosion.reset(enemy.body.x + enemy.body.halfWidth, enemy.body.y + enemy.body.halfHeight);
    explosion.body.velocity.y = enemy.body.velocity.y;
    explosion.alpha = 0.7;
    explosion.play('explosion', 30, false, true);
    enemy.kill();
	livesVAL--;
	healthUpdate();
}

function hitEnemy(enemy, pShots) {
    var explosion = explosions.getFirstExists(false);
    explosion.reset(pShots.body.x + pShots.body.halfWidth, pShots.body.y + pShots.body.halfHeight);
    explosion.body.velocity.y = enemy.body.velocity.y;
    explosion.alpha = 0.7;
    explosion.play('explosion', 30, false, true);
	scoreVAL++;
	scoreUpdate();
    enemy.kill();
    pShots.kill();
}



//end of stuff