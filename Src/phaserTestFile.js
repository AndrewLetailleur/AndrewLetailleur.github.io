var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example', { preload: preload, create: create });

//preload is called first. Normally you'd use this to load your game assets (or those needed for the current State), akin to Unity Awake?
function preload() { 
	game.load.image('fff', 'assets/pics/blue.png'); 
}

//create is called once preload has completed, this includes the loading of any assets from the Loader. Akin to Unity Start?
function create() { 
	var graphics = game.add.graphics(0, 0);

    // graphics.lineStyle(2, 0xffd900, 1);

    graphics.beginFill(0xFF0000, 1);
    graphics.drawCircle(300, 300, 100);
	
	var image = game.add.sprite(99, 99, 'fff');
}

// It is called during the core game loop AFTER debug, physics, plugins and the Stage have had their preUpdate methods called. If is called BEFORE Stage, Tweens, Sounds, Input, Physics, Particles and Plugins have had their postUpdate methods called.
	//function update() {}