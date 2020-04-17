import "../../phaser.js";

export class Scene extends Phaser.Scene
    {
    /**
     * @param key The scene key
     * @param ui_key The UI scene key that's loaded on top
     */
    constructor(key, ui_key)
        {
        super(key);

        this.ui_key = ui_key;
        this.bgm = null;
        }

    //Inherited from Phaser.Scene,
    //Method called when the scene is created/loaded
    //Method called when the scene is created/loaded
    create()
        {
        //this.physics.world.setFPS(5);

        if (this.ui_key !== null)
            this.LoadSceneAdditive(this.ui_key);
        }

    /**
     * Load a scene on top of the current scene
     * Please note, that this means the new scene will layer above
     * @param key The key for the scene to load
     * @constructor
     */
    LoadSceneAdditive(key)
        {
        this.scene.launch(key);
        this.scene.bringToTop(this.ui_key);

        this.ui_scene = this.scene.get(this.ui_key);
        this.ui_scene.mainScene = this;
        }

    /**
     * Load a new scene removing this one and the UI with it.
     * @param key The reference key for the new Scene
     * @constructor
     */
    LoadScene(key)
        {
        this.StopBGM();

        this.scene.stop(this.scene.key);
        this.scene.stop(this.ui_key);

        this.scene.start(key);
        }

    /**
     * Reset the objects physics
     * @param {Phaser.Physics.Arcade.Sprite|Phaser.Physics.Arcade.Image} object
     */
    ResetObject(object)
        {
        object.body.stop();
        object.body.setGravity(0,0);

        object.setImmovable(true);
        object.body.enable = false;
        }

    //Animations
    CreateAnimation(data)
        {
        if (data !== undefined)
            return this.anims.create(data);
        else
            console.error("Cannot create undefined animation");
        }

    StopBGM()
        {
        //Stop all concurrent sounds before transitioning
        if (this.bgm !== null)
            this.bgm.stop();
        }
    }