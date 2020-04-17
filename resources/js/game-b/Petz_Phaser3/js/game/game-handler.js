import "./phaser.js";
import config from "./config.js";

import * as GameScene from "./scenes/test-game-scene.js";
import * as MainScene from "./scenes/main-pet-scene.js";

import * as BalanceGame  from "./scenes/minigames/balance-minigame.js";
import * as FishingGame  from "./scenes/minigames/fishing-minigame.js";
import * as FetchGame    from "./scenes/minigames/fetch-minigame.js";
import * as RPSGame      from "./scenes/minigames/rps-minigame.js";
import * as SnowballGame from "./scenes/minigames/snowball-minigame.js";

import {DynamicMap} from "./core/System/Collections/DynamicMap.js";


export class GameHandler extends Phaser.Game
    {
    constructor()
        {
        super(config);

        //----Testing----
        this.scene.add('Game_UI', GameScene.Game_UI);
        this.scene.add('Game'   , GameScene.Game);
        //---------------

        //Loader


        //Main Menu


        //Main Game Scene
        this.scene.add('Main_UI', MainScene.MainPetScene_UI);
        this.scene.add('Main'   , MainScene.MainPetScene);

        //Minigames
        this.scene.add('Balance_UI'      , BalanceGame.BalanceUI);
        this.scene.add('Balance_Game'    , BalanceGame.BalanceGame);

        this.scene.add('Fishing_UI'      , FishingGame.FishingUI);
        this.scene.add('Fishing_Game'    , FishingGame.FishingMain);

        this.scene.add('Fetch_UI'        , FetchGame.FetchUI);
        this.scene.add('Fetch_Game'      , FetchGame.FetchGame);

        this.scene.add('RPS_UI'          , RPSGame.RPSUI);
        this.scene.add('RPS_Game'        , RPSGame.RPSMain);

        this.scene.add('Snowball_UI'     , SnowballGame.SnowballUI);
        this.scene.add('Snowball_Game'   , SnowballGame.SnowballMain);

        //Completion


        //Death Scene


        //Others


        //Initialise
        this.scene.start('Main');
        }
    }

//Global Data
window.game = new GameHandler();
window.pets = new DynamicMap();
