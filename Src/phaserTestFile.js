var game = new Phaser.Game(600, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

/*http://codeperfectionist.com/articles/phaser-js-tutorial-building-a-polished-space-shooter-game-part-1/  based on this tutorial, asset hack wise*/
var player;
var bank;
var border_edge = 20;

var ACCEL = 250;
var DRAG = 400;
var MAX_SPEED = 300;
var BULLET_VELO = -600;

	//the objects themselves
var starfield;//the starfield say
var pShots;

	//controls
var moveCtrl;//the movement code for player
var fireCtrl; //the trigger key for player
	//no fire rate needed by 'one shot on screen' limit, unless 'insisted' to have firing rate.

var lives;

	//sound fx
var snd;

//preload is called first. Normally you'd use this to load your game assets (or those needed for the current State), akin to Unity Awake?
function preload() { 
		//load audio
	game.load.audio('gun', 'assets/audio/shoot.wav');

		//load static art & images
	game.load.image('playShip', 'IMG/spaceShooter/ShipMono.png'); //the ship
	game.load.image('starfield', 'IMG/spaceShooter/starfield.png'); //the //the background, per say
	game.load.image('pShot', 'IMG/spaceShooter/BulletO.png');//the projectile shot, to north wise hack.
		
		//load animations and such, 
	//game.load.spritesheet();
}//100% Warks

//create is called once preload has completed, this includes the loading of any assets from the Loader. Akin to Unity Start?
function create() { //create the assets


		//fx sound
	snd = game.add.audio('pgun');
	
	//  The scrolling starfield background
    starfield = game.add.tileSprite(0, 0, 600, 600, 'starfield');
	
	
	//create group of lives
		//note to self, destroy the last array first, ideally
	lives = game.add.group();
	for (var i = 0; i < 3; i++) {
		var ship = lives.create(8 + (36 * i), 560, 'playShip');
	}//end for

	//the bullet shot group
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
	
		//the player controls
	moveCtrl = game.input.keyboard.createCursorKeys();
	fireCtrl = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);//to fire a bullet, trig wise
	
//  var graphics = game.add.graphics(0, 0);
//  graphics.lineStyle(2, 0xffd900, 1);
//  graphics.beginFill(0xFF0000, 1);
//  graphics.drawCircle(300, 300, 100);

}


//function createBaseAI(){}
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

}

function fireBullet () {
	//grab first bullet from the pool
	
	var pShot = pShots.getFirstExists(false);
	
	if (pShot) {
		//fire the bullet grabbed
		snd.play();//jnc
			//fxgun.play();//play a sound test
		pShot.reset(player.x, player.y - 16);
		pShot.body.velocity.y = BULLET_VELO; //shot speed?
	}
}




function render() {
		
}
//end of stuff