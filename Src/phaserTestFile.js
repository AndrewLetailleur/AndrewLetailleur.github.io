/* WIP IN PROGRESS STILL!

LOOK AT THESE TUTORIALS TO FINISH THE JOB
https://github.com/jschomay/phaser-demo-game/blob/c5824c6a7569c5536cca150a9589e814f225478b/game.js

http://codeperfectionist.com/articles/phaser-js-tutorial-building-a-polished-space-shooter-game-part-4/

*/


 /*http://codeperfectionist.com/articles/phaser-js-tutorial-building-a-polished-space-shooter-game-part-1/  based on this tutorial, asset hack wise */

//spawn player stuff
var player;	//za player
	//controls
var moveCtrl;//the movement code for player
var fireCtrl; //the trigger key for player
var pauseKey; //pauses the game, trigger wise

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
var eShots;//enemy shots
var BULLET_VELO = -600;

//player variables
var livesSTART = 3;
var lives;//is an array of objects
var livesVAL;//initial amount of lives
var bonusREQ = 7;//sets the minimum requirement
var scoreBONUS;
 
var scoreVAL = 0;//initial score value
var scoreTXT;//a string array of text, plus score
//end of player variables

var shields;//object, shield wise. Meant to absorb in a 'wall' manner.
	
	//(rest of) the FX objects themselves
var starfield;//the starfield say
var explosions;//ripoff explosive effects

var advGal_Spawner;
var advGal_FOE;//galaxians, var advFoe;
var advGal_FOE_Bullets;//the attack variable for test enemies

var testInvader_Timer;
var testInvader;//second enemy type... Consider sine waves?
/*var bossFoe; //gorf spawner, or improvised boss
*/ //end speculated values 

//end of stuff variables.
var gameOver;//the game over trigger, buggy ATM
var gamePause;//the pause text

var snd;//sound fx	//var sound = Phaser.Sound; //JNC hassle wise
	//misc variables for player

var S_VELO = 96;//64
var VELO;// = 128;//64;
var s_d = 1;
var c_d;//= s_d; c_d = s_d;
var flag = false;//bool wise
var fail = false;
//var baseFoe_Array;//spawn a fresh array guess?
//var baseFoe_Amount = [];//equals intentionally, an array. Not needed, due to group fuunctionality.
var baseFoe; //space invaders, as a group function
var baseFoe_Dir;//for movement in one dir. Multiply by -1 every time direction is shifted.

var game = new Phaser.Game(600, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render, restart: restart });


	
//Normally you'd use this to load your game assets (or those needed for the current State), akin to Unity Awake?
function preload() {//preload is called first. 
	//load static art & images
	game.load.image('playShip', 'IMG/spaceShooter/ShipMono.png'); //the ship
	game.load.image('starfield', 'IMG/spaceShooter/starfield.png'); //the background
	game.load.image('pShot', 'IMG/spaceShooter/BulletO.png');//the projectile shot
	game.load.image('eShot', 'IMG/spaceShooter/EnemyShot.png');//the ENEMY projectile shot
	//game.load.spritesheet(); //test enemy, make it animated later
	game.load.image('enemy-test', 'IMG/SpaceShooter/FOE.png');//a basic enemy
	game.load.image('base-enemy', 'IMG/SpaceShooter/bFOE.png');//a basic enemy
	//get a custom asset later, potential copyright fears/est wise
	game.load.spritesheet('explosion', 'IMG/spaceShooter/explode.png', 128, 128); //perfect square
	game.load.audio('gun', 'assets/audio/shoot.wav');//load audio FAIL
}
//100% Warks

//this includes the loading of any assets from the Loader. Akin to Unity Start?
function create() { //create is called once preload has completed

	c_d = s_d;

	game.physics.startSystem(Phaser.Physics.ARCADE);
    starfield = game.add.tileSprite(0, 0, 600, 600, 'starfield');//  The scrolling starfield background
/*	var gpx = game.add.graphics(100, 100);//	create graphical test dummy for 'level' icon?
	gpx.lineStyle(2, 0x0033FF, 1);
	gpx.beginFill(0x0099FF, .4);//transparent test
    gpx.drawRect(475, 460, 12.5, 25);*/	

//	the bullet shot group, pShots!
	pShots = game.add.group();
	pShots.enableBody = true;
	pShots.physicsBodyType = Phaser.Physics.ARCADE;//block physics by image. Simple.
	pShots.createMultiple(81, 'pShot');//to ensue a space invaders/galaxian lite limit on shots available
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
	pauseKey = game.input.keyboard.addKey(Phaser.Keyboard.P);
    pauseKey.onDown.add(togglePause, this);
	
//  create shields guess values
	/**/

//	create/set up the group of lives. Destroy the last array first, later
	livesVAL = livesSTART;//set the value pre-emptively
	lives = game.add.group();
	for (var i = 0; i < livesVAL; i++) {
		var ship = lives.create(8 + (36 * i), 560, 'playShip');
	}//end for 			//no lives.render here //lives.render();

//	do score counter instead
	scoreTXT = game.add.text(game.world.centerX - 100, (game.world.centerY * 2 - 40), "Score: " + scoreVAL, { font: "32px Arial", fill: "#09F", align: "center" });
	scoreBONUS = bonusREQ;//set bonus to immutable value ref
	//scoreTXT.render(); //render SEEMS to be pretty bugged here
	
//	GameOver SFX
    gameOver = game.add.text(game.world.centerX, game.world.centerY, 'GAME OVER!\nClick/Press Input to Try Again!', { font: '72px Arial', wordWrap: true, wordWrapWidth: game.world.width, fill: '#fff', align: "center" });
    gameOver.anchor.setTo(0.5, 0.5);
    gameOver.visible = false;
	//pause trigger
	gamePause = game.add.text(game.world.centerX, game.world.centerY, 'PAUSED!\nPress [P] to CONTINUE!', { font: '32px Arial', fill: '#fff', wordWrap: true, wordWrapWidth: game.world.width, align: "center" });
    gamePause.anchor.setTo(0.5, 0.5);
    gamePause.visible = game.physics.arcade.isPaused;
//end player prefabs
	
	/*guess stage display string variable
	for (i = 0; i < stageVal; i++) {
		for (i = 0; i < stageVal; i+=5) {
			for (i = 0; i < stageVal; i+= 10) {
				stageTxt.text = stage.Txt.text + "X";
			}
			stageTxt.text = stage.Txt.text + "V";
		}
		stageTxt.text = stage.Txt.text + "I"; 	
	}
	
	
	*/
	
//	explode fx pool
    explosions = game.add.group();
    explosions.enableBody = true;
    explosions.physicsBodyType = Phaser.Physics.ARCADE;//block physics by image. 
    explosions.createMultiple(30, 'explosion');
    explosions.setAll('anchor.x', 0.75);
    explosions.setAll('anchor.y', 0.75);
	explosions.setAll('scale.x', 0.5);//scale down test addition
	explosions.setAll('scale.y', 0.5);
    explosions.forEach( function(explosion) {
        explosion.animations.add('explosion');//animates the explosion, hope
    });//end for loop
//end explosions!

//	Enemies, after player spawned

//advanced enemy/FOE
	advGal_FOE = game.add.group();
	advGal_FOE.enableBody = true;
	advGal_FOE.physicsBodyType = Phaser.Physics.ARCADE; //sets physics
	advGal_FOE.createMultiple(5, 'enemy-test');//spawns multiple, with the sprite asset in question
	advGal_FOE.forEach(function(enemy){
	/*//set collision size, REDACTED
	//enemy.body.setSize(enemy.body.width = 8 * 3 / 4*, enemy.body.height = 8 * 3 / 4*);
	*/
		enemy.damageAmount = 1;//to represent lives takenth away
	});
	advGal_FOE.setAll('anchor.x', .5);
	advGal_FOE.setAll('anchor.y', .5); //no scaling needed here
	advGal_FOE.setAll('angle', 0); //already rotated
	advGal_FOE.setAll('outOfBoundsKill', true);
	advGal_FOE.setAll('checkWorldBounds', true);
		//set freqency of spawning. Cue event timers/est
// 	game.time.events.add(1000, advGal_Timer);//spawns the enemy, after trig.	//REDACTED, since array spawns first. It'd be called later.

	//enemy bullet list, before test enemies are spawned
	advGal_FOE_Bullets = game.add.group();
	advGal_FOE_Bullets.enableBody = true;
	advGal_FOE_Bullets.physicsBodyType = Phaser.Physics.ARCADE;
	advGal_FOE_Bullets.createMultiple(5, 'eShot');//to set limit of amount of bullets on screen.
	//no needed, as it could be a poor man's spritesheet instead.
	advGal_FOE_Bullets.setAll('alpha', 0.9);
	advGal_FOE_Bullets.setAll('anchor.x', 0.5);
	advGal_FOE_Bullets.setAll('anchor.y', 0.5);
	advGal_FOE_Bullets.setAll('outOfBoundsKill', true);
	advGal_FOE_Bullets.setAll('checkWorldBounds', true);
	advGal_FOE_Bullets.forEach(function(enemy){
        enemy.body.setSize(8, 8);
	});
//end advanced enemy/FOE

	c_d = s_d;//reset challenge variable

//	basic enemy
	baseFoe = game.add.group();
	baseFoe.enableBody = true;
	baseFoe.physicsBodyType = Phaser.Physics.ARCADE; //sets physics
	spawnBaseArray();//spawns the array first.
//end enemy, basic wise

//	fx sound, *BUGGY ATM!* Thus, placed lastly... snd = new Phaser.Sound(game, 'pgun',1,false);
}
//disable snd from create later?, end create

/*function createBaseAI(){}
	//if switch sides
		//add momentum down force, y add on axis
		//then invert x velocity, and check the left instead.
	//end if
*///end guesses


function togglePause() {
    game.physics.arcade.isPaused = (game.physics.arcade.isPaused) ? false : true;
	gamePause.visible = (game.physics.arcade.isPaused) ? true : false; //flipped, so that it's true when paused, and false when playing
}
//same as Unity version per frame. Called before render.
function update() {//updates all per frame
		
		//  Scroll the background. X addition moves/shifts depending on player movement
    
	baseStep();
	
	
	if(!gamePause.visible){
		starfield.tilePosition.y += 5;
		starfield.tilePosition.x += player.body.velocity.x / (ACCEL / 3 * 2);//1;//tweak, consider doing 'random' there?
	}	
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
		//player collides
	game.physics.arcade.overlap(player, advGal_FOE, shipCollide, null, this);
		//enemy collides
	game.physics.arcade.overlap(advGal_FOE, pShots, hitEnemy, null, this);
		//hazard collides
	game.physics.arcade.overlap(advGal_FOE_Bullets, player, enemyHitsPlayer, null, this);
	
		//enemy collides
	game.physics.arcade.overlap(baseFoe, pShots, hitEnemy, null, this);
		//hazard collides
	game.physics.arcade.overlap(baseFoe, player, enemyHitsPlayer, null, this);
	
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

function enemy_fireBullet() {//in order to limit/slow down enemy firing rate, ideally...
	
	if (game.time.now > bullet_Timer) {
			//  Set up firing mechanimss
		var shotSpeed = 400;
			//fire a random number, between min and max range, 1.5/2.5 seconds.
		var shotDelay = (game.rnd.integerInRange(1500), 2500);//approx 2 seconds?
		enemy.bullets = 1;
		enemy.lastShot = 0;
		
		if(bullet) {
			var bulletOffset = 20 * Math.sin(game.math.degToRad(player.angle));
            bullet.reset(player.x + bulletOffset, player.y);
            bullet.angle = player.angle;
            game.physics.arcade.velocityFromAngle(bullet.angle - 90, BULLET_SPEED, bullet.body.velocity);
            bullet.body.velocity.x += player.body.velocity.x;

            bulletTimer = game.time.now + BULLET_SPACING;
		}
	}
	/*	test code cut out
		//  Fire WIPPY
	//enemyBullet = blueEnemyBullets.getFirstExists(false);
	*/
}
function spawnBaseArray() {
	VELO = S_VELO;//* c_d say?
	baseFoe_Dir = 1;//reset the direction to be on the safe side. And bar a 'zero movement' scenario.
	//baseFoe_Array.createMultiple(44, 'pShot');//spawns multiple, hack test wise

	game.time.events.remove(advGal_Spawner);
	game.time.events.remove(advGal_Timer);
	if (c_d > 1) {//check if stage 2+ is triggered.
		advGal_Spawner = game.time.events.add(1000, advGal_Timer);//add the timer, on respawning
	}
	
	var z = game.width / 14;//to represent 32 x 32 ish, to get 14 slices of game.width
	var d = c_d; //d is for difficulty
		//spawn an array, tinker/fix to screen
	for (var y = 0; y < 5; y++) {//height
		for (var x = 0; x < 11; x++) {//width
			//code						//IE: 42 * x		 //IE: 24 * dIfficulty * y
			var Foe = baseFoe.create( ((z * 2) + (z * x)), ((z * d) + (z * y)), 'base-enemy');
			Foe.anchor.setTo(0.5, 0.5);
			Foe.body.collideWorldBounds = true;
		}
	}//	baseFoe.forEach(function(enemy){enemy.damageAmount = 1;});//to represent lives takenth away
	c_d++;//increment challenge for later spawning/est.
}
function baseStep () {
	//to cover a bug hassle in code direction.
	if (baseFoe_Dir == 0)
		X_VELO = 0;
	else
		X_VELO = VELO * baseFoe_Dir;//velocity direction. If Dir =/= 0, no movement.
	//endif
	
	baseFoe.setAll('body.velocity.x', X_VELO);//set standard X velocity at X_Velo
    baseFoe.setAll('body.velocity.y', 0);//no Y falling by nudge default
	
	for (i = 0; i < baseFoe.length; i++) {
		//baseFoe.getAt(i).body.x;
		if ((baseFoe.getAt(i).body.x <= (border_edge / 2)) || (baseFoe.getAt(i).body.x >= game.width - (border_edge * 2))){
			baseFoe_Dir *= -1; //switch direction, *= ~/~ multiply/equals wise
			X_VELO = VELO * baseFoe_Dir;//reset the X_VELO dir, pre-emptively.
			baseFoe.setAll('body.velocity.x', X_VELO); //below is debug code for now, just to get shooting/est to work properly.
			baseFoe.setAll('body.velocity.y', S_VELO * 8); //move by a notch Y wise. X_Velo * 8 in scope for now.
			break;
		}/* else if (baseFoe.getAt(i).body.y >= (game.height - (108) ) ) {
			baseFoe_Dir == 0;//the conditional bugger for now, hassle wise
			VELO = 0;
			if (!fail) {
				fail = true;
				livesVAL = 0;//player.damage(bullet.damageAmount);
				healthUpdate();//health.render();
			}
		}//else do nothing, endif*/ //end buggy code
	}//if (baseFoe_Dir == 0 && LivesVAL > 0) {}
	
	if (baseFoe.countLiving() <= 0)
		spawnBaseArray();//spawn the array again
	//ENDIF	
}
	//cue enemy AI test code, advGal_FOE wise
//function createAdvAI(){}
function advGal_Timer() {
	var MIN_ENEMY_SPACING = 30;
	var MAX_ENEMY_SPACING = 300;
	var ENEMY_SPEED = 200;

	//after for, set fring mechanics
	
	
    var enemy = advGal_FOE.getFirstExists(false);
    if (enemy) {
        enemy.reset(game.rnd.integerInRange(0, game.width), 0);
        enemy.body.velocity.x = game.rnd.integerInRange(-100, 100);
        enemy.body.velocity.y = ENEMY_SPEED;
        enemy.body.drag.x = -100;//ADDS speed over time, as it's opposite of dragging
		enemy.body.drag.y = -10;//test prefab of 50, for barring movement?
		//rotation tweak
		
		//  Set up firing, for enemy.update function
        var bulletSpeed = 200;
        var firingDelay = 2000;
        enemy.bullets = 1;
        enemy.lastShot = 0;
		
		//the enemy.update function in the Phaser framework
		enemy.update = function () {
				//movement fall
			enemy.angle = 0 - ((game.math.radToDeg(Math.atan2(enemy.body.velocity.x, enemy.body.velocity.y))) /2) ;
			
			//no banking here
			
			//attack code, then fire. Only ONE BulleT, no BulletS.
			advGal_FOE_Bullet = advGal_FOE_Bullets.getFirstExists(false);
			if (advGal_FOE_Bullet && this.alive && this.bullets && this.y >
				game.width / 8 && game.time.now > firingDelay + this.lastShot) {
				this.lastShot = game.time.now;
				this.bullets--;
				advGal_FOE_Bullet.reset(this.x, this.y + this.height / 2);
				advGal_FOE_Bullet.damageAmount = this.damageAmount;//delivers the damage from enemy, onto player
				var angle = game.physics.arcade.moveToObject(advGal_FOE_Bullet, player, bulletSpeed);
				advGal_FOE_Bullet.angle = game.math.radToDeg(angle);
			}
			
			//remove if out of screen, say. Though they do it automatically, world bound wise.
			if (this.y > game.height + 200) {
				this.kill();
				this.y = -20;
			};
		}
    }
    //  Send another enemy soon
    game.time.events.add(game.rnd.integerInRange(MIN_ENEMY_SPACING, MAX_ENEMY_SPACING), advGal_Timer);
}

// It is called during the core game loop AFTER debug, physics, plugins and the Stage have had their preUpdate methods called. If is called BEFORE Stage, Tweens, Sounds, Input, Physics, Particles and Plugins have had their postUpdate methods called.

function fireBullet () {
	//grab first bullet from the pool
	var pShot = pShots.getFirstExists(false);
	
	if (pShot && !gamePause.visible) {
		//fire the bullet grabbed
		//snd.play();//jnc
			//fxgun.play();//play a sound test
		pShot.reset(player.x, player.y - 16);
		pShot.body.velocity.y = BULLET_VELO; //shot speed?
	}
}
//the render function, akin to LateUpdate in unity. Good for debug?
function render() {
	game.debug.text("Queued events: " + game.time.events.length + ' - click to remove', 32, 32);
//	if(baseFoe.countLiving <= 0)
//		spawnBaseArray();//spawn a new array on clearing all enemies, test.
	//endif
	
	
	/*debug render, very very buggy*/
//advance enemy hit boxes

/*
	for (var i = 0; i < advGal_FOE.length; i++)
    {game.debug.body(advGal_FOE.children[i]);}
//bullet test hit boxes
	for (var i = 0; i < advGal_FOE_Bullets.length; i++)
    {game.debug.body(advGal_FOE_Bullets.children[i]);}
//player hit boxes
    game.debug.body(player);
*/

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
}//TBDL
function enemyHitsPlayer(player, eShots) {
	var explosion = explosions.getFirstExists(false);
    explosion.reset(player.body.x + player.body.halfWidth, player.body.y + player.body.halfHeight);
    explosion.body.velocity.y = player.body.velocity.y;
    explosion.alpha = 0.7;
    explosion.play('explosion', 30, false, true);
    eShots.kill();
	livesVAL--;//player.damage(bullet.damageAmount);
	healthUpdate();//health.render();
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
}	//health update logic COULD be used to update the assets of levels/est too
function healthUpdate() {
	player.health = livesVAL;
	lives.callAll('kill');//clear, then re-add
	if (livesVAL > 0) {
		lives = game.add.group();
		for (var i = 0; i < livesVAL; i++) {
		var ship = lives.create(8 + (36 * i), 560, 'playShip');
		}//end for
	} else
	player.kill();//
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



function restart () {//restarts the character
	    //reset the score, included as it's needed to be reset
    scoreVAL = 0;
	scoreBONUS = bonusREQ;//reset back to normal
    scoreUpdate();
	
	//clear/kill all on screen enemies
	baseFoe.callAll('kill');
	advGal_FOE.callAll('kill');
	advGal_FOE_Bullets.callAll('kill');
	/* no longer needed code,
	game.time.events.remove(advGal_Spawner);
	game.time.events.remove(advGal_Timer);
		//reset player parameters
	player.revive();
	livesVAL = livesSTART;
	player.health = livesVAL;
	livesVAL = 3;
	healthUpdate();
		//reset spawn variables hardly, then call again.
	VELO = S_VELO;//reset velo to default value again, pre-emptively
	c_d = s_d;//reset the challenge hack
	flag = false;
	fail = false;	
	
	spawnBaseArray();//clear and respawn everyone

    //  Hide the text again
    gameOver.visible = false;
	*/
	this.game.state.restart();//the one line of code, I need the most
}	//end of stuff
