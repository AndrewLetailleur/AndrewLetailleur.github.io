/* 	Programmed by Andrew I Letailleur, circa 22/10/2018
 * 	*	Mainly coded, for a University project. And to learn in hassle, how to use Phaser.
 */ ///Playable to a basic state. Though I feel I ought to still include a boss in there, somewhere...

	/* LOOKED AT THESE TUTORIALS/ANSWERS TO FINISH THE JOB
-----//use them as my references, if needed. Transparency wise et all.
https://github.com/jschomay/phaser-demo-game/blob/c5824c6a7569c5536cca150a9589e814f225478b/game.js
http://codeperfectionist.com/articles/phaser-js-tutorial-building-a-polished-space-shooter-game-part-1/   
http://www.html5gamedevs.com/topic/16637-get-sprite-in-the-world-xy-position/
http://www.html5gamedevs.com/topic/3175-sprites-in-group-x-position/
http://www.html5gamedevs.com/topic/4939-how-to-remove-gametimeeventsloop/
http://www.html5gamedevs.com/topic/3893-how-to-restart-a-game/
https://leanpub.com/html5shootemupinanafternoon/read
https://gamedevacademy.org/how-to-debug-phaser-games/
http://examples.phaser.io/_site/view_full.html?d=time&f=remove+event.js&t=remove%20event
https://www.w3schools.com/js/js_loop_for.asp
http://www.html5gamedevs.com/topic/10180-get-random-dead-sprite-from-a-group/
*/

/*(Known) Bugs to clear still!
	1. "Game Over loaded behind every other actor/object",	2. "Bullets from an invisible array"	*/

	
///GLOBAL VAR|IABLES, DUNOT DEVIATE!?!


//player var|iables, for avatar, controls, and game states.
var player; var moveCtrl; var fireCtrl; var pauseKey;	/*no fire rate needed ...
Due to 'one shot on screen' limit via intentional pool limitations of objects, loading hassle wise.
So no fire rate, unless 'insisted/required' to have a player firing rate.*/
var gameOver; var gamePause;

//movement varieties
var ACCEL = 250; var DRAG = 400; var MAX_SPEED = 300;
var bank; var border_edge = 20;	//end movement varieties

//gameplay values
var livesSTART = 3; var livesVAL; var lives;			//lives. Start/current val, and array.
var scoreVAL = 0;	var scoreTXT; 						//score variables. From value, to starter bonus trigger & requirement, 1UP wise.	
var bonusREQ = 47;	var scoreBONUS;
var stageSTART = 1;	var stageVAL;					//stage variables, reference for basic enemies
var stageTXT;		// = "I";//to =/= 1, prefab wise
//!end of player var|iables, txt-ish wise

//objects, FX/misc wise
var starfield;									//the background
var shields;									//Meant to absorb in a 'wall' manner.
var explosions;									//ripoff explosive effects
var pShots; var eShots; var BULLET_VELO = -600; //global bullet variables
//!end of game objects

//enemy variables
	//space invaders, as a group function, baseFoe wise
var baseFoe; var baseFoe_Dir;//for movement in one dir. Multiply by -1 every time direction is shifted.
var S_VELO = 64;	var VELO;
var base_Foe_Bullets;//for their future projectiles
var base_firingDelay = 2000;	//bullet delay, universal

	//galaxians, var adv_Foe;
var advGal_Spawner;
var adv_Foe;
var adv_Foe_Bullets;
var adv_firingDelay = 3500;		//bullet delay, universal

	//enemy spawners, for adv_Foe
var testInvader_Timer;
var testInvader;

	//the BOSS enemy, TBA.
/*var bossFoe; //gorf spawner, or improvised boss*/
//!end of enemy actors

/*Misc/REDACTED Code goes here
//var flag = false; var fail = false;//bool wise
//var snd;//sound fx	//var sound = Phaser.Sound; //JNC hassle wise
*/
///!END GLOBAL VAR|IABLES

var game = new Phaser.Game(600, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render, restart: restart });		//Game Start!

function preload() {//!	preload is called first, state wise. Akin to Unity Awake?. 

	//first is at the lowest, "z" layer axis wise. So, load backgrounds/est first, more importantly.

//load objects
	game.load.image('starfield', 'IMG/spaceShooter/starfield.png'); //the background
	game.load.image('blocks', 'IMG/spaceShooter/Shields.png');//another perfect square, loader wise hack.
	
//load actors
	//game.load.spritesheet(); //test enemy, make it animated later
	game.load.image('playShip', 'IMG/spaceShooter/ShipMono.png');	//the ship
	game.load.image('baseEnemy', 'IMG/spaceShooter/bFOE.png');		//a basic enemy
	game.load.image('enemyTest', 'IMG/spaceShooter/FOE.png');	//an advanced enemy
	
//load bullets
	game.load.image('pShot', 'IMG/spaceShooter/BulletO.png');//the projectile shot
	game.load.image('eShot', 'IMG/spaceShooter/EnemyShot.png');//the ENEMY projectile shot		
	
//load FX
	game.load.spritesheet('explosion', 'IMG/spaceShooter/explode.png', 128, 128); //perfect square		//get a custom asset later, potential copyright fears/est wise
	/*load buggy SFX assets... N/A, as that's commented out (Due to CORS policy)
//	game.load.audio('gun', 'assets/audio/shoot.wav');//load audio FAIL	*/
}
///	begin extra create functions
/*Player*/
function create_Shields() {			//	the shields, which block one hit before disappearing.
	shields = game.add.group();
	shields.enableBody = true;
	shields.physicsBodyType = Phaser.Physics.ARCADE; //sets physics
/* REF Notes, under math land. Did some tweaking on this still! ;P
	//create array here. This should only be called on level generation, restart wise.



Width = 600 	Blocks = 70 	Spacer = Blocks / 5 (= 14) 		Amount = 4				
Gap = ( ( Width - (Blocks * 4) ) / (Amount + 1) ) = 64

	+5		+5		+5
64	70	64	70	64	70	64
		70 / 5 = 14

Width / ( (Blocks * Amount) + (Gap * (Amount + 1) ) ) = 1

//test code grabbed/hacked from the following site;
	//https://www.w3schools.com/js/tryit.asp?filename=tryjs_loop_for
for (i = GAP; i < 600; i+= GAP) {
    for (j = 0; j < 70; j+= 5) {
		i+=10;
    	text += i + "<br>";
	}
    text += "<br>";
}*/
///	LOCAL VARIABLES, for Spawn use only!
	var heighty = game.height - 100; //to get the 'min' start of
	var blocks = 70;
	var b_lay = 10; //should =/= blocks / 7;
	var amount = 4;
	var gap = ( (game.width - (blocks * amount) ) / (amount + 1) ); // should = 64
	
	for (var y = 0; y < 5; y++) {//height
		for (var x = (gap / 8 * 7); x < game.width; x+= gap) {//width. Gap should == 58
			for (j = 0; j < blocks; j += b_lay) {//bricks
				x += b_lay;
				var Box = shields.create( x, (heighty - (8 * y)), 'blocks');
				Box.anchor.setTo(0, 0); //anchor wise
				Box.body.setSize(10, 8); //hack attempt
			}//end j gen valve
			//x+=2; //jnc debug valve
		};//end x 
	};//end y
	//!end for
}
function create_PlayerAvatar() {	//	The player, as a heroic ship
    player = game.add.sprite(300, 535, 'playShip');//32x32 ship spawned here
	player.health = livesVAL;		//where lives value =/= health variable
    player.anchor.setTo(0.5, 0.5);//set to middle-ish
	//set's physics limits
	game.physics.enable(player, Phaser.Physics.ARCADE);//block physics by image. Simple.
	player.body.maxVelocity.setTo(MAX_SPEED, MAX_SPEED);
    player.body.drag.setTo(DRAG, DRAG);
	//event listeners
	player.events.onKilled.add(function(){});//if player is killed, do X
	player.events.onRevived.add(function(){});//when player is revived, do Y
}
function create_GameplayValues() {	//	sets the gameplay variables, 
//	stage val first
	stageVAL = stageSTART; //	re/set stage counter by default-ish.

//	lives val second	
	livesVAL = livesSTART;//re/set the lives value pre-emptively
	lives = game.add.group();	//create as group, for icon generation
	for (var i = 0; i < livesVAL; i++) { var ship = lives.create(8 + (36 * i), 560, 'playShip'); }//end for 		
	//no lives.render here //lives.render();

//	do score counter next
	scoreTXT = game.add.text(game.world.centerX - 100, (game.world.centerY * 2 - 40), "Score: " + scoreVAL, { font: "32px Arial", fill: "#09F", align: "center" });
	scoreBONUS = bonusREQ;//set bonus to immutable value ref
	//scoreTXT.render(); //render SEEMS to be pretty bugged here
	
//	GameOver SFX
    gameOver = game.add.text(game.world.centerX, game.world.centerY, 'GAME OVER!\nClick/Press Input to Try Again!', { font: '72px Arial', wordWrap: true, wordWrapWidth: game.world.width, fill: '#fff', align: "center" });
    gameOver.anchor.setTo(0.5, 0.5);
    gameOver.visible = false;
}
function create_Controls() {		//	the player controls
//	general controls
	moveCtrl = game.input.keyboard.createCursorKeys();
	fireCtrl = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);//to fire a bullet, trig wise
	
//	the pause trigger
	pauseKey = game.input.keyboard.addKey(Phaser.Keyboard.P);
    pauseKey.onDown.add(togglePause, this);

//and the pause text
	gamePause = game.add.text(game.world.centerX, game.world.centerY, 'PAUSED!\nPress [P] to CONTINUE!', { font: '32px Arial', fill: '#fff', wordWrap: true, wordWrapWidth: game.world.width, align: "center" });
    gamePause.anchor.setTo(0.5, 0.5);
    gamePause.visible = game.physics.arcade.isPaused;
}
function togglePause() {		//	toggles pause in phaser game physics, bool switch wise.
    game.physics.arcade.isPaused = (game.physics.arcade.isPaused) ? false : true;
	gamePause.visible = (game.physics.arcade.isPaused) ? true : false; //flipped, so that it's true when paused, and false when playing
}
function create_PlayerShots() {		//	the bullet shot group, pShots!
	pShots = game.add.group();
	pShots.enableBody = true;
	pShots.physicsBodyType = Phaser.Physics.ARCADE;//block physics by image. Simple.
	pShots.createMultiple(1, 'pShot');//at 1, to ensue a space invaders/galaxian lite limit on shots on screen is set
	pShots.setAll('anchor.x', 0.5);
	pShots.setAll('anchor.y', 1);
	pShots.setAll('outOfBoundsKill', true);//remove if out of bounds
	pShots.setAll('checkWorldBounds', true);
}
/*FX*/
function create_Explosions() {		//	explode fx pool, too many explosions cause a crash however.
    explosions = game.add.group();
    explosions.enableBody = true;
    explosions.physicsBodyType = Phaser.Physics.ARCADE;//block physics by image. 
    explosions.createMultiple(31, 'explosion');
    explosions.setAll('anchor.x', 0.75);
    explosions.setAll('anchor.y', 0.75);
	explosions.setAll('scale.x', 0.5);//scale down test addition
	explosions.setAll('scale.y', 0.5);
    explosions.forEach( function(explosion) { explosion.animations.add('explosion'); } );//animates the explosion, end for loop
}//end explosions!
/*FOE*/
function create_Bullets() {			//	enemy bullet list, before test enemies are spawned
	//advanced first
	adv_Foe_Bullets = game.add.group();
	adv_Foe_Bullets.enableBody = true;
	adv_Foe_Bullets.physicsBodyType = Phaser.Physics.ARCADE;
	adv_Foe_Bullets.createMultiple(5, 'eShot');//to set limit of amount of bullets on screen.
	//no needed, as it could be a poor man's spritesheet instead.
	adv_Foe_Bullets.setAll('alpha', 0.9);
	adv_Foe_Bullets.setAll('anchor.x', 0.5);
	adv_Foe_Bullets.setAll('anchor.y', 0.5);
	adv_Foe_Bullets.setAll('outOfBoundsKill', true);
	adv_Foe_Bullets.setAll('checkWorldBounds', true);
	adv_Foe_Bullets.forEach(function(enemy){
        enemy.body.setSize(8, 8);
	}); 
	
	//	basic next, hack wise
	base_Foe_Bullets = game.add.group();
	base_Foe_Bullets.enableBody = true;
	base_Foe_Bullets.physicsBodyType = Phaser.Physics.ARCADE;
	base_Foe_Bullets.createMultiple(5, 'eShot');//to set limit of amount of bullets on screen.
	//no needed, as it could be a poor man's spritesheet instead.
	base_Foe_Bullets.setAll('alpha', 0.9);
	base_Foe_Bullets.setAll('anchor.x', 0.5);
	base_Foe_Bullets.setAll('anchor.y', 0.5);
	base_Foe_Bullets.setAll('outOfBoundsKill', true);
	base_Foe_Bullets.setAll('checkWorldBounds', true);
	base_Foe_Bullets.forEach(function(enemy){
        enemy.body.setSize(8, 8);
	});
}//end bullet gen
function create_BasicFoe() {		//	basic enemy physics, generates an array afterwards
	baseFoe = game.add.group();
	baseFoe.enableBody = true;
	baseFoe.physicsBodyType = Phaser.Physics.ARCADE; //sets physics
	baseAI_Array();//spawns the array first.
}//end enemy, basic wise
function create_AdvancedFoe() {		//	more advanced enemy/FOE, Galaxian lite in movement
	adv_Foe = game.add.group();
	adv_Foe.enableBody = true;
	adv_Foe.physicsBodyType = Phaser.Physics.ARCADE; //sets physics
	adv_Foe.createMultiple(5, 'enemyTest');//spawns multiple, with the sprite asset in question
	adv_Foe.forEach(function(enemy){ enemy.damageAmount = 1; });
	adv_Foe.setAll('anchor.x', .5);
	adv_Foe.setAll('anchor.y', .5); //no scaling needed here
	adv_Foe.setAll('angle', 0); //already rotated
	adv_Foe.setAll('outOfBoundsKill', true);
	adv_Foe.setAll('checkWorldBounds', true);
	// 	game.time.events.add(1000, advAI_Timer);//spawns the enemy, after trig.	//set freqency of spawning. Cue event timers/est. //[REDACTED], since array spawns first. It'd be called later.
}//end advanced enemy/FOE
//!	end extra create functions
function create() {//!create is called once preload has completed. Akin to Unity Start?
//this includes the loading of any assets from the Loader
	game.physics.startSystem(Phaser.Physics.ARCADE);
//	begin FX
    starfield = game.add.tileSprite(0, 0, 600, 600, 'starfield');//  The scrolling starfield background
	create_Explosions();
//!	end FX

//	begin player prefabs
	create_PlayerShots();
	create_PlayerAvatar();
	create_Controls();
//!	end player prefabs	

//	begin game_state prefabs
	create_GameplayValues();
	/*	guess stage display string variables
	for (i = 0; i < stageVal; i++) {
		for (i = 0; i < stageVal; i+=5) {
			for (i = 0; i < stageVal; i+= 10) { stageTxt.text = stage.Txt.text + "X"; }
			stageTxt.text = stage.Txt.text + "V";
		}
		stageTxt.text = stage.Txt.text + "I";
	}
	/////
	var gpx = game.add.graphics(100, 100);	//	create graphical test dummy for 'level' icon?
	gpx.lineStyle(2, 0x0033FF, 1);
	gpx.beginFill(0x0099FF, .4);//transparent test
    gpx.drawRect(475, 460, 12.5, 25);
*/	
	create_Shields();
//!	end game_state prefabs

//	Enemies, after player spawned
	create_Bullets();
	create_BasicFoe();
	create_AdvancedFoe();
//!	end create enemies

/*	FX sound,	*BUGGY ATM!*	Thus, placed lastly...
snd = new Phaser.Sound(game, 'pgun',1,false);*/
//!	end SFX_WIP stuff
}//end create
///	begin extra update functions
function update_controls() {//does the movement, from the control keys and taking into account mouse input
    player.body.acceleration.setTo(0, 0);	// set acceleration to 0, and tinker from there
	
//	begin movement code
	if (moveCtrl.left.isDown){player.body.velocity.x = -ACCEL;}		//	begin keyboard input
	else if (moveCtrl.right.isDown) {player.body.velocity.x = ACCEL;}//	endif	
//	begin mouse input
    if ( (game.input.x < game.width - border_edge) && (game.input.x > border_edge) &&
         (game.input.y < game.height - border_edge) && (game.input.y > border_edge)) {//Border edge used for edges
			var minDist = border_edge;
			var dist = game.input.x - player.x;
			player.body.velocity.x = MAX_SPEED * game.math.clamp(dist / minDist, -1, 1);
		}//endif
//	begin fire input
	if (player.alive && (fireCtrl.isDown || game.input.activePointer.isDown)) { fireBullet(); }//if player is alive; get key press/mouse click, and fire!
///	end input general
	//	cue border collision checks for player		
    if (player.x > game.width - border_edge) {//  Stop at screen edges, to avoid screen out
        player.x = game.width - border_edge;
        player.body.acceleration.x = 0;
    } else if (player.x < border_edge) {
        player.x = border_edge;
        player.body.acceleration.x = 0;
    }//end if
	
/*squash image for an illusion of banking, bank/ster wise. Source from this tutorial 	
		http://codeperfectionist.com/articles/phaser-js-tutorial-building-a-polished-space-shooter-game-part-1/   
	*////	hail the tutorial for helping with math here
	bank = player.body.velocity.x / MAX_SPEED;
	player.scale.x = 1 - Math.abs(bank) / 2;
	player.angle = bank * 10;
///end player stuff for real this time
}//end controller updates
function fireBullet () {//fire player shot
	var pShot = pShots.getFirstExists(false);//grab first bullet from the pool
	if (pShot && !gamePause.visible) {//if not in screen; fire the bullet grabbed
		//snd.play();//jnc
			//fxgun.play();//play a sound test
		pShot.reset(player.x, player.y - 16);
		pShot.body.velocity.y = BULLET_VELO; //shot speed?
	}
}
function update_GameOver() {//shows the gameOver text. NOT shown over every other actor for some buggy reason
	if (!player.alive && gameOver.visible === false) {/*the apocalypse has happened.*/
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
            }//end _restart function
        }//end setResetHandlers
    }//end alive trigger
}
//!	end extra update functions
function update() {//!same as Unity version per frame. Called before render.
	//updates all per frame
	baseAI_Update();
	update_controls();
	update_collisions();
		
	if(!gamePause.visible) {//  Scroll the background. X addition moves/shifts depending on player movement. //triggered if game isn't on pause.
		starfield.tilePosition.y += 5;
		starfield.tilePosition.x += player.body.velocity.x / (ACCEL / 3 * 2);//1;//tweak, consider doing 'random' there?
	}
	update_GameOver();//GameOver restarts, when needed/prompted.
}//end updates
///	begin enemy prefabs/est
/*basic FOE*/
function baseAI_Array() {//basic enemy creation, array wise
	//consider 'looping back' with higher speed, instead of insane low positions? FOR loop variable wise
	VELO = S_VELO;//* c_d say?
	baseFoe_Dir = 1;//reset the direction to be on the safe side. And bar a 'zero movement' scenario.
		//cue buggy remove events attempt.
	game.time.events.remove(advGal_Spawner);
	game.time.events.remove(advAI_Timer);
	if ( (stageVAL > 1) && (game.time.events.length < 1) ) {advGal_Spawner = game.time.events.add(1000, advAI_Timer); }/*check if stage 2+ spawner is triggered.*/
	/*if (stageVAL > bossVAL) {bossVAL += REQ;//think of SPAWN A BOSS Trigger!;}		*/
	
	var z = game.width / 14;	//to represent 32 x 32 ish, to get 14 slices of game.width
	var d = stageVAL; 			//d is for difficulty, val wise
		//spawn an array, synced to game screen
	for (var y = 0; y < 5; y++) {//height
		for (var x = 0; x < 11; x++) {//width
			//code						//IE: 42 * x		 //IE: 24 * dIfficulty * y
			var Foe = baseFoe.create( ((z * 2) + (z * x)), ((z * d) + (z * y)), 'baseEnemy');
			Foe.anchor.setTo(0.5, 0.5);
			Foe.body.outOfBoundsKill = true;
		}
	}//endfor	//baseFoe.forEach(function(enemy){enemy.damageAmount = 1;});//to represent lives takenth away
	stageVAL++;	//increment challenge for later spawning/est.
}
function baseAI_Update () {//basic enemy AI response
	if (baseFoe_Dir == 0) { X_VELO = 0; }//If Dir =/= 0, no movement, to cover a bug hassle in code direction by multi-zero.
	else { X_VELO = VELO * baseFoe_Dir; }//velocity direction, get by multiplying the direction.
	//endif
	baseFoe.setAll('body.velocity.x', X_VELO);	//set standard X velocity at X_Velo
    baseFoe.setAll('body.velocity.y', 0);		//no Y falling by nudge default
	for (i = 0; i < baseFoe.length; i++) {//grab all enemies
		if ((baseFoe.getAt(i).body.x <= (border_edge / 2)) && (baseFoe_Dir == -1) || (baseFoe.getAt(i).body.x >= game.width - (border_edge * 2))  && (baseFoe_Dir == 1)){//baseFoe.getAt(i).body.x;
			baseFoe_Dir *= -1; //switch direction, *= ~/~ multiply/equals wise
			X_VELO = VELO * baseFoe_Dir;//reset the X_VELO dir, pre-emptively.
			baseFoe.setAll('body.velocity.x', X_VELO); //below is debug code for now, just to get shooting/est to work properly.
			baseFoe.setAll('body.velocity.y', 512);/*S_VELO x 8*/ //move by a notch Y wise. X_Velo * 8 in scope for now.
			break;
		} else if (baseFoe.getAt(i).body.y >= (game.height - (108) ) ) {//baseFoe.getAt(i).body.y;
			baseFoe_Dir == 0;//the conditional bugger for now, hassle wise
			VELO = 0;
			if (livesVAL > 0) {
				livesVAL = 0;//player.damage(bullet.damageAmount);
				healthUpdate();//health.render();
			}
		}//else do nothing, endif*/ //end buggy code
	}//if (baseFoe_Dir == 0 && LivesVAL > 0) {}

	if (baseFoe.countLiving() <= 0){ baseAI_Array(); }//spawn the array again, if none is left alive... And there's no boss in sight.
	else if (game.time.now > base_firingDelay) { base_Foe_Fire(); }//fire gun, after set amount of time
	//ENDIF	
}//end basic AI response team, generalised.
function base_Foe_Fire() {//fire a bullet straight down, basic enemy wise
	base_firingDelay = game.time.now + 2000;//plus delay, timer wise
	var randoFoe;
	var bulletSpeed = 200;
	
	do {randoFoe = baseFoe.getRandom();} while (baseFoe.alive === false)
	//console.log('text' + randoFoe.body.x);
	
	base_Foe_Bullet = base_Foe_Bullets.getFirstExists(false);
	if (base_Foe_Bullet && baseFoe_Dir != 0 ) {					//if enemy is still moving, over if player is still alive?
		base_Foe_Bullet.reset(randoFoe.body.x, randoFoe.body.y );
		base_Foe_Bullet.damageAmount = this.damageAmount;//delivers the damage from enemy, onto player
		base_Foe_Bullet.body.velocity.y = -BULLET_VELO / 2;
		base_Foe_Bullet.angle = 90;
		//var angle = game.physics.arcade.moveToObject(base_Foe_Bullet, player, bulletSpeed);
		//base_Foe_Bullet.angle = game.math.radToDeg(angle);
	}
}
/*advanced FOE*/
function advAI_Timer() {//advanced AI response, spawner wise
//  Set up variables, for enemy.update function
	var MIN_ENEMY_SPACING = 30;		var MAX_ENEMY_SPACING = 300;
	var ENEMY_SPEED = 200;			var bulletSpeed = 200;

	//after for, set fring mechanics
    var enemy = adv_Foe.getFirstExists(false);
    if (enemy) {
        enemy.reset(game.rnd.integerInRange(0, game.width), 0);	//random area on top screen, border edge wise
        enemy.body.velocity.x = game.rnd.integerInRange(-100, 100);
        enemy.body.velocity.y = ENEMY_SPEED;
        enemy.body.drag.x = -100;//ADDS speed over time, as it's opposite of dragging
		enemy.body.drag.y = 15;//just high enough to steer them to the edges in collision. at 50, bars movement
		//the enemy.update function in the Phaser framework
		enemy.update = function () {//rotation tweak
			enemy.angle = 0 - ((game.math.radToDeg(Math.atan2(enemy.body.velocity.x, enemy.body.velocity.y))) /2) ;
			//no banking here, as we do a rotation hack/tutorial here instead.
			
			adv_Foe_Bullet = adv_Foe_Bullets.getFirstExists(false);//attack code, then fire. Only ONE BulleT, no BulletS.
			if (adv_Foe_Bullet && this.alive && this.y > game.width / 8
			 &&	game.time.now > adv_firingDelay) {
					adv_firingDelay = game.time.now + game.rnd.integerInRange(500, 1500);
					adv_Foe_Bullet.reset(this.x, this.y + this.height / 2);
					adv_Foe_Bullet.damageAmount = this.damageAmount;//delivers the damage from enemy, onto player
					var angle = game.physics.arcade.moveToObject(adv_Foe_Bullet, player, bulletSpeed);
					adv_Foe_Bullet.angle = game.math.radToDeg(angle);
			}
			
			//remove if out of screen, say. Though they do it automatically, world bound wise.
			if (this.y > game.height + 200) { this.kill(); this.y = -20; };
		}//end enemy.update function
    }//end (enemy)
    game.time.events.add(game.rnd.integerInRange(MIN_ENEMY_SPACING, MAX_ENEMY_SPACING), advAI_Timer);    //  Send another enemy soon?
}
function enemy_fireBullet() {//fire the enemy projectile.
	//in order to limit/slow down enemy firing rate, ideally...
//	if (game.time.now > bullet_Timer) {
		//  Set up firing mechanisms
	var shotSpeed = 400;
	enemy.bullets = 1; enemy.lastShot = 0; var shotDelay = (game.rnd.integerInRange(1500), 2500);//fire a random number, between min and max range, //approx 1.5/2.5 seconds.
	
	if(bullet) {
		var bulletOffset = 20 * Math.sin(game.math.degToRad(player.angle));
        bullet.reset(player.x + bulletOffset, player.y);
        bullet.angle = player.angle;
        game.physics.arcade.velocityFromAngle(bullet.angle - 90, BULLET_SPEED, bullet.body.velocity);
        bullet.body.velocity.x += player.body.velocity.x;
//      bulletTimer = game.time.now + BULLET_SPACING;
		}
//	}
	//check also for if test enemy est happens, est enemy wise
}//end of update function
//!	end enemy prefabs/est
/*DEBUG*/	function render() {//!the render function, akin to LateUpdate in unity. Used soully for debugging, comma wise

//	game.debug.text("Queued events: " + game.time.events.length + ' - click to remove', 32, 32);	//check event listener amount, for spawner spam

/*collision boxes
//shield boxes
	for (var i = 0; i < shields.length; i++)
    {game.debug.body(shields.children[i]);}
//advance enemy hit boxes
	for (var i = 0; i < adv_Foe.length; i++)
    {game.debug.body(adv_Foe.children[i]);}
//bullet test hit boxes
	for (var i = 0; i < adv_Foe_Bullets.length; i++)
    {game.debug.body(adv_Foe_Bullets.children[i]);}
//player hit boxes
    game.debug.body(player);
*/
}
///	begin colliders
function update_collisions() {// check collisions between two actors.
//	player collides with enemy
	game.physics.arcade.overlap(player, adv_Foe, shipCollide, null, this);
	game.physics.arcade.overlap(player, baseFoe, shipCollide, null, this);
	
//bullet collisions
	//	bullet hits enemy
	game.physics.arcade.overlap(baseFoe, pShots, hitEnemy, null, this);
	game.physics.arcade.overlap(adv_Foe, pShots, hitEnemy, null, this);	
	//	bullet hits player
	game.physics.arcade.overlap(adv_Foe_Bullets, player, enemyHitsPlayer, null, this);
	game.physics.arcade.overlap(base_Foe_Bullets, player, enemyHitsPlayer, null, this);

//	shield collides WIP
	//enemy colliding
	game.physics.arcade.overlap(shields, baseFoe, enemyCrashShield, null, this);		
	game.physics.arcade.overlap(shields, adv_Foe, enemyCrashShield, null, this);
	//bullet colliding
	game.physics.arcade.overlap(pShots, shields, playerShieldHit, null, this);
	game.physics.arcade.overlap(base_Foe_Bullets, shields, shieldHit, null, this)
	game.physics.arcade.overlap(adv_Foe_Bullets, shields, shieldHit, null, this);
}
	//enemy colliders
function hitEnemy(enemy, pShots) {//if enemy is hit by player shot, 			destroy both
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
function shipCollide(player, enemy) {//if player crashes with enemy, 			destroy both
	var explosion = explosions.getFirstExists(false);
    explosion.reset( (enemy.body.x + enemy.body.halfWidth), (enemy.body.y + enemy.body.halfHeight) );
    explosion.body.velocity.y = enemy.body.velocity.y;
    explosion.alpha = 0.7;
    explosion.play('explosion', 30, false, true);
    enemy.kill();
	livesVAL--;
	healthUpdate();
}
function enemyHitsPlayer(player, eShots) {//if player is hit by enemy shot, 	destroy both
	var explosion = explosions.getFirstExists(false);
    explosion.reset( (player.body.x + player.body.halfWidth), (player.body.y + player.body.halfHeight) );
    explosion.body.velocity.y = player.body.velocity.y;
    explosion.alpha = 0.7;
    explosion.play('explosion', 30, false, true);
    eShots.kill();
	livesVAL--;//player.damage(bullet.damageAmount);
	healthUpdate();//health.render();
}
	//shield colliders, they don't have explosions to them sadly :P
function playerShieldHit(pShots, shields) {//if shield is hit by player shot, 	destroy both
//	var explosion = explosions.getFirstExists(false);
//    explosion.reset(shield.body.x + shield.body.halfWidth, shield.body.y + shield.body.halfHeight);//   explosion.alpha = 0.7;
//    explosion.play('explosion', 30, false, true);
	shields.kill();
    pShots.kill();
}
function shieldHit(eShots, shields) {//if shield is hit by enemy shot, 			destroy both
//	var explosion = explosions.getFirstExists(false);
//    explosion.reset(shield.body.x + shield.body.halfWidth, shield.body.y + shield.body.halfHeight);//   explosion.alpha = 0.7;
//    explosion.play('explosion', 30, false, true);
	shields.kill();
    eShots.kill();
}
function enemyCrashShield (shields, baseFoe) {//if enemy moves at shield		destroy shield only, !BULLDOZER!
	//remove shield
//	var explosion = explosions.getFirstExists(false);
//	explosion.reset(shields.body.x + shields.body.halfWidth, shields.body.y + shields.body.halfHeight);
//   explosion.alpha = 0.7;
//	explosion.play('explosion', 30, false, true);
	shields.kill();
}
//!	end colliders

///	begin HUD updates
function scoreUpdate() {	//the score update, and 1UP trigger
	scoreTXT.text = "Score: " + scoreVAL;
	//begin conditional life increment
	if (scoreVAL >= scoreBONUS) {
		scoreBONUS += bonusREQ; //so that every X gives a life
		if (livesVAL < 5) { extraLife(); }/*if lives are below max*/
	}//endif
}	//health update logic COULD be used to update the assets of levels/est too
function healthUpdate() {	//the health counter, and game over tracker
	player.health = livesVAL;
	lives.callAll('kill');//clear, then re-add
	if (livesVAL > 0) {
		lives = game.add.group();
		for (var i = 0; i < livesVAL; i++) { var ship = lives.create(8 + (36 * i), 560, 'playShip'); }//end for
	} else
	player.kill();//
}
function extraLife() {		//the life increaser, incremental limiter wise
	if (livesVAL < 5) { //if max lives isn't reached
		livesVAL++;
		player.health = livesVAL;
		lives.callAll('kill');//clear, then re-add
		lives = game.add.group();
		for (var i = 0; i < livesVAL; i++) { var ship = lives.create(8 + (36 * i), 560, 'playShip'); }//end for
	}//end if
}
//!	end HUD updates
function restart () {		//!calls when called upon to reset the game entirely from scratch
//restarts the character
	    //reset the score, included as it's needed to be reset
    scoreVAL = 0;
	scoreBONUS = bonusREQ;//reset back to normal
    scoreUpdate();
	
	//clear/kill all on screen enemies
	baseFoe.callAll('kill');
	adv_Foe.callAll('kill');
	adv_Foe_Bullets.callAll('kill');
	
		//removing triggers don't work for me, thus restarting code.

	//completely clears all present events, and initiates Create() again.
	this.game.state.restart();
}	//end of stuff