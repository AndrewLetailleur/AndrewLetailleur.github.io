// Tutorial A - https://stackabuse.com/introduction-to-phaser-3-building-breakout/

//-->

// This object contains all the Phaser configurations to load our game
const config = {
    type: Phaser.AUTO,
    parent: 'game',
    width: 800,
    heigth: 640,
    scale: {
      mode: Phaser.Scale.RESIZE,
      autoCenter: Phaser.Scale.CENTER_BOTH
    },
    scene: {
      preload,
      create,
      update,
      render,
    },
    physics: {
      default: 'arcade',
      arcade: {
        gravity: false
      },
    }
  };

// Create the game instance
const game = new Phaser.Game(config);

function preload() { }
function create() { }
function update() { }
function render() { }