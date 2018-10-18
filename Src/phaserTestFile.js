var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create, update: update, render: render });

/*http://codeperfectionist.com/articles/phaser-js-tutorial-building-a-polished-space-shooter-game-part-1/  based on this tutorial, asset hack wise*/
var player;
var bank;

var ACCEL = 250;
var DRAG = 400;
var MAX_SPEED = 300;

var starfield;//the starfield say
var moveCtrl;//the movement code for player
//var fireCtrl; //the trigger key for player

//preload is called first. Normally you'd use this to load your game assets (or those needed for the current State), akin to Unity Awake?
function preload() { 
	game.load.image('playShip', 'IMG/ShipMono.png'); //the ship
	game.load.image('starfield', 'IMG/ex/starfield.png'); //the //the background, per say
}//100% Warks

//create is called once preload has completed, this includes the loading of any assets from the Loader. Akin to Unity Start?
function create() { //create the assets

//  The scrolling starfield background
    starfield = game.add.tileSprite(0, 0, 800, 600, 'starfield');

	
	//  The player, as a heroic ship
    player = game.add.sprite(400, 500, 'playShip');
    player.anchor.setTo(0.5, 0.5);
	game.physics.enable(player, Phaser.Physics.ARCADE);
		//set's physics limits
	player.body.maxVelocity.setTo(MAX_SPEED, MAX_SPEED);
    player.body.drag.setTo(DRAG, DRAG);
	
		//the player controls
	moveCtrl = game.input.keyboard.createCursorKeys();
	//fireCtrl = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);//to fire a bullet, trig wise
	
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

	if (moveCtrl.left.isDown)
	{
		player.body.velocity.x = -ACCEL;
	}
	else if (moveCtrl.right.isDown)
	{
		player.body.velocity.x = ACCEL;
	}//endif
	//  Stop at screen edges, to avoid screen out
    if (player.x > game.width - 50) {
        player.x = game.width - 50;
        player.body.acceleration.x = 0;
    }
    if (player.x < 50) {
        player.x = 50;
        player.body.acceleration.x = 0;
    }
	//squash image for an illusion of banking, bank/ster wise
		/*source from this tutorial: 
		http://codeperfectionist.com/articles/phaser-js-tutorial-building-a-polished-space-shooter-game-part-1/
		*/
		//hail the tutorial for helping with math here
	bank = player.body.velocity.x / MAX_SPEED;
	player.scale.x = 1 - Math.abs(bank) / 2;
	player.angle = bank * 10;

}
function render() {
		
}
//end of stuff