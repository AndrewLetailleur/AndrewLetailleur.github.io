var game = new Phaser.Game(600, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

//var sound = Phaser.Sound; //JNC hassle wise

/*http://codeperfectionist.com/articles/phaser-js-tutorial-building-a-polished-space-shooter-game-part-1/  based on this tutorial, asset hack wise
*/

//the objects themselves
var starfield;//the starfield say
	//spawn player stuff
var player;
	//controls
var moveCtrl;//the movement code for player
var fireCtrl; //the trigger key for player
  /*no fire rate needed by 'one shot on screen' limit via pool limitations
	unless 'insisted' to have firing rate.*/
var pShots;

var ACCEL = 250;
var DRAG = 400;
var MAX_SPEED = 300;
var BULLET_VELO = -600;
	
var snd;//sound fx
	//misc variables for player
var lives;
	//graphical tweaks on player end
var bank;
var border_edge = 20;
//end of player variables

var testEnemy;/* //test prevab	//begin speculated values
var baseFoe; //space invaders
var advFoe;  //galaxians
var bossFoe; //gorf spawner, or improvised boss
*/ //end speculated values 

	//include FX
var explosions;

//end of stuff variables.

//preload is called first. Normally you'd use this to load your game assets (or those needed for the current State), akin to Unity Awake?
function preload() { 

	//load static art & images
	game.load.image('playShip', 'IMG/spaceShooter/ShipMono.png'); //the ship
	game.load.image('starfield', 'IMG/spaceShooter/starfield.png'); //the background
	game.load.image('pShot', 'IMG/spaceShooter/BulletO.png');//the projectile shot
		 //test enemy, make it animated later
	//game.load.spritesheet(); //load animations and such,
	game.load.image('enemy-test', 'IMG/spaceShooter/FOE.png');//a basic enemy prefab hack
		//get a custom asset later, instead of blindly copy/paste from tutorial's, hack wise
	game.load.spritesheet('explosion', 'IMG/spaceShooter/explode.png', 128, 128); //perfect square

	//load audio
	game.load.audio('gun', 'assets/audio/shoot.wav');

}//100% Warks

//create is called once preload has completed, this includes the loading of any assets from the Loader. Akin to Unity Start?
function create() { //create the assets

//  The scrolling starfield background
    starfield = game.add.tileSprite(0, 0, 600, 600, 'starfield');
	
//	create group of lives
	//note to self, destroy the last array first, ideally
	lives = game.add.group();
	for (var i = 0; i < 3; i++) {
		var ship = lives.create(8 + (36 * i), 560, 'playShip');
	}//end for
	
//	create graphical test dummy for 'level' icon?
	var gpx = game.add.graphics(100, 100);
	gpx.lineStyle(2, 0x0033FF, 1);
	gpx.beginFill(0x0099FF, .4);//transparent test
    gpx.drawRect(475, 460, 12.5, 25);
    
//	the bullet shot group, pShots!
	pShots = game.add.group();
	pShots.enableBody = true;
	pShots.physicsBodyType = Phaser.Physics.ARCADE;
	pShots.createMultiple(1, 'pShot');
	pShots.setAll('anchor.x', 0.5);
	pShots.setAll('anchor.y', 1);
	pShots.setAll('outOfBoundsKill', true);
	pShots.setAll('checkWorldBounds', true);
	
//  The player, as a heroic ship
    player = game.add.sprite(300, 535, 'playShip');//32x32
    player.anchor.setTo(0.5, 0.5);
	game.physics.enable(player, Phaser.Physics.ARCADE);
	//set's physics limits
	player.body.maxVelocity.setTo(MAX_SPEED, MAX_SPEED);
    player.body.drag.setTo(DRAG, DRAG);

//	the player controls
	moveCtrl = game.input.keyboard.createCursorKeys();
	fireCtrl = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);//to fire a bullet, trig wise
	
//	Enemies, after player
	testEnemy = game.add.group();
	testEnemy.enableBody = true;
	testEnemy.physicsBodyType = Phaser.Physics.ARCADE; //sets physics
	testEnemy.createMultiple(5, 'enemy-test');//spawns multiple, with the sprite asset in question
	testEnemy.setAll('anchor.x', 1);
	testEnemy.setAll('anchor.y', 1);
	testEnemy.setAll('angle', 0); //already rotated
	testEnemy.setAll('outOfBoundsKill', true);
	testEnemy.setAll('checkWorldBounds', true);

	spawnTest();//spawns the enemy, after trig.
	
//	explode fx pool
    explosions = game.add.group();
    explosions.enableBody = true;
    explosions.physicsBodyType = Phaser.Physics.ARCADE;
    explosions.createMultiple(30, 'explosion');
    explosions.setAll('anchor.x', 0.5);
    explosions.setAll('anchor.y', 0.5);
	explosions.setAll('scale.x', 0.5);//scale down test addition
	explosions.setAll('scale.y', 0.5);
    explosions.forEach( function(explosion) {
        explosion.animations.add('explosion');//animates the explosion, hope
    });//end for loop
	
	
//	fx sound, *BUGGY ATM!* Thus, placed lastly...
	snd = new Phaser.Sound(game, 'pgun',1,false);
	
}

	//cue enemy AI code
//	the test code, testEnemy wise
function spawnTest() {
	var MIN_ENEMY_SPACING = 30;
	var MAX_ENEMY_SPACING = 300;
	var ENEMY_SPEED = 200;

    var enemy = testEnemy.getFirstExists(false);
    if (enemy) {
        enemy.reset(game.rnd.integerInRange(0, game.width), 0);
        enemy.body.velocity.x = game.rnd.integerInRange(-100, 100);
        enemy.body.velocity.y = ENEMY_SPEED;
        enemy.body.drag.x = -100;//ADDS speed over time, as it's opposite of dragging
		enemy.body.drag.y = 50;//test prefab, for barring movement?
		
		//rotation tweak
		enemy.update = function () {
			enemy.angle = 0 - ((game.math.radToDeg(Math.atan2(enemy.body.velocity.x, enemy.body.velocity.y))) /2) ;
		}
    }
	

    //  Send another enemy soon
    game.time.events.add(game.rnd.integerInRange(MIN_ENEMY_SPACING, MAX_ENEMY_SPACING), spawnTest);
}

//function createBaseAI(){}
	//if switch sides
		//add momentum down force, y add on axis
		//then invert x velocity, and check the left instead.
	//end if
//end guesses

//function createAdvAI(){}

// It is called during the core game loop AFTER debug, physics, plugins and the Stage have had their preUpdate methods called. If is called BEFORE Stage, Tweens, Sounds, Input, Physics, Particles and Plugins have had their postUpdate methods called.
function update() {
		
		//  Scroll the background
    starfield.tilePosition.y += 5;
    starfield.tilePosition.x += 1;
	
		// set acceleration to 0, and tinker from there
    player.body.acceleration.setTo(0, 0);
	
		//begin fire input
	if (fireCtrl.isDown || game.input.activePointer.isDown)//if spacebar or mouse is clicked
		fireBullet();
	//endif
	
		//begin cursor input
	if (moveCtrl.left.isDown)
		player.body.velocity.x = -ACCEL;
	else if (moveCtrl.right.isDown)
		player.body.velocity.x = ACCEL;
	//endif
	
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
		/*source from this tutorial: 
		http://codeperfectionist.com/articles/phaser-js-tutorial-building-a-polished-space-shooter-game-part-1/
		*/
		//hail the tutorial for helping with math here
	bank = player.body.velocity.x / MAX_SPEED;
	player.scale.x = 1 - Math.abs(bank) / 2;
	player.angle = bank * 10;
	
	//end player stuff
	
//	check collisions
	game.physics.arcade.overlap(player, testEnemy, shipCollide, null, this);
	game.physics.arcade.overlap(testEnemy, pShots, hitEnemy, null, this);
	//check also for if test enemy est happens, est enemy wise

}

function render() {//debug render

//
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
}

function hitEnemy(enemy, pShots) {
    var explosion = explosions.getFirstExists(false);
    explosion.reset(pShots.body.x + pShots.body.halfWidth, pShots.body.y + pShots.body.halfHeight);
    explosion.body.velocity.y = enemy.body.velocity.y;
    explosion.alpha = 0.7;
    explosion.play('explosion', 30, false, true);
    enemy.kill();
    pShots.kill();
}



//end of stuff