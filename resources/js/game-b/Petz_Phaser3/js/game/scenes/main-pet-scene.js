import "../phaser.js";
import config from "../config.js";

import DataHandler from "../core/System/data-handler.js";

import {ComponentMap} from "../core/CustomCollections/ComponentMap.js";
import {DynamicMap} from "../core/System/Collections/DynamicMap.js";

import {Scene} from "../core/Scenes/scene.js";
import UI_Scene from "../core/Scenes/ui-scene.js";

import * as UIHelper from "../core/UI/Helpers/ui-helper.js";
import * as TextStyle from "../core/UI/styles/text-styles.js";
import * as Info from "../core/System/system-info.js";

import {Clamp} from "../core/System/DataTypes/Math.js";

import {PetData} from "../entities/pets/pet-stats.js";
import {PetEgg} from "../entities/pets/pet-egg.js";
import {PetBase} from "../entities/pets/pet-base.js";
import {Statusbar} from "../components/statusbar.js";
import {Image} from "../core/Graphics/image.js";

export class MainPetScene extends Scene
    {
    option = UI_STATES.NONE;
    hasLoadedPet = false;
    pet = null;

    isYerPetDeed = false;

    constructor()
        {
        super("Main", "Main_UI");

        this.currentPet = undefined;
        }

    preload()
        {
        this.load.baseURL = "img/phaser-game/";
        this.load.image ('background', 'backgrounds/pet-room.png');

        this.load.image ('DEEDSTONE', 'gravestone.png');

        //UI
        this.load.atlas("main-buttons", "ui/buttons/small-icon-sheet.png", "ui/buttons/small-icon-atlas.json");

        //Pets
        this.load.atlas("pet-egg",  "pets/egg/egg-sheet.png", "pets/egg/egg-sheet.json");
        this.load.atlas("pet-baby", "pets/baby/starter-baby-sheet.png", "pets/baby/starter-baby-sheet.json");

        //Mitts
        this.load.atlas("mitts-baby"    , "pets/evolutions/mitts/mitts-baby-sheet.png"    , "pets/evolutions/mitts/mitts-baby-atlas.json");
        this.load.atlas("mitts-teen"    , "pets/evolutions/mitts/mitts-teen-sheet.png"    , "pets/evolutions/mitts/mitts-teen-atlas.json");
        this.load.atlas("mitts-adult"   , "pets/evolutions/mitts/mitts-adult-sheet.png"   , "pets/evolutions/mitts/mitts-adult-atlas.json");

        //Omni
        this.load.atlas("omni-baby"     , "pets/evolutions/omni/omni-baby-sheet.png"      , "pets/evolutions/omni/omni-baby-atlas.json");
        this.load.atlas("omni-teen"     , "pets/evolutions/omni/omni-teen-sheet.png"      , "pets/evolutions/omni/omni-teen-atlas.json");
        this.load.atlas("omni-adult"    , "pets/evolutions/omni/omni-adult-sheet.png"     , "pets/evolutions/omni/omni-adult-atlas.json");

        //Boinko
        this.load.atlas("brick-baby"   , "pets/evolutions/brick/brick-baby-sheet.png"  , "pets/evolutions/brick/brick-baby-atlas.json");
        this.load.atlas("brick-teen"   , "pets/evolutions/brick/brick-teen-sheet.png"  , "pets/evolutions/brick/brick-teen-atlas.json");
        this.load.atlas("brick-adult"  , "pets/evolutions/brick/brick-adult-sheet.png" , "pets/evolutions/brick/brick-adult-atlas.json");
        }

    create()
        {
        //Load Pet stuffs
        super.create();

        let background = this.add.image(config.width/2, config.height/2, 'background');

        background.setDisplaySize(config.width, config.height);
        background.depth = -100000;

        let rightBounds = this.add.image();
        let leftBounds = this.add.image();

        //Create Pet Holder
        if (DataHandler.Exists("has_pet"))
             this.spawnLoadedPet();
         else
             this.spawnPetEgg();

        if (this.isYerPetDeed)
            {
            this.time.addEvent(
                {
                    delay: 2000,
                    loop: true,

                    callback: () =>
                        {
                        this.ui_scene.events.emit("pet-deed");
                        let deathImg = new Image(this, config.width/2, config.height/2, "DEEDSTONE");
                        deathImg.setScale(10,10);
                        deathImg.setOrigin(0.5, 0.5);

                        DataHandler.RemoveObject("has_pet");
                        DataHandler.RemoveObject("pet_data");
                        DataHandler.RemoveObject("pet_key");
                        },

                });

            this.pet.destroy();
            }
        }

    update()
        {

        }

    /**
     * Create a new pet on load
     * Will also be used to toggle the normal_header
     * UI to show a load button from local storage
     */
    spawnPetEgg()
        {
        let egg = this.pet = new PetEgg(this, "pet-egg");
        this.pet.depth = 100;

        this.events.on("pet-hatched", () =>
            {
            //Weird lazy latch to the object within the object
            //this.time.delayedCall(1000, () => egg.DestroyAllComponents(true));

            //Create text
            let eggText = this.pet.components.get('text');

            eggText.depth = 100;
            eggText.setText("Say hello to your new pet!");

            //Destroy isn't really behaving and apparently has conflict with animations,
            //so this is an easier solution with no game change
            this.pet.setVisible(false).setActive(false);
            //this.pet.DestroyAllComponents(true);

            this.spawnPet();
            });
        }

    spawnPet()
        {
        this.pet = new PetBase(this, "pet-baby");
        this.ui_scene.events.emit("pet-loaded");

        DataHandler.SaveObject("has_pet",  true);
        DataHandler.SaveObject("pet_data", this.pet.petData);
        DataHandler.SaveObject("pet_key" , this.pet.texture.key);

        this.pet.petData.key = this.pet.texture.key;

        //Create events and timers
        this.time.addEvent(
            {
                delay: 10000,
                loop: true,

                callback: () =>
                    {
                    if (!this.pet.isInteractable)
                        {
                        this.pet.petData.hunger = Clamp(this.pet.petData.hunger - 10, 0, 100);
                        this.pet.petData.clean = Clamp(this.pet.petData.clean - 5, 0, 100);

                        this.pet.updateAnimations();
                        }
                    },
            });
        }

    spawnLoadedPet()
        {
        //Get loaded stuffs
        let petData = DataHandler.GetObject ("pet_data");
        let pet_key = DataHandler.GetObject ("pet_key");


        //TODO: Redo the entire pet reference and creation
        //to avoid checking evolution on load
        this.pet = new PetBase(this, pet_key);

        //TODO: Wrap stats in object to pass over values instantly
        //this.pet.petData.DOB            = Date.parse(petData.DOB);
        this.pet.petData.age            = petData.age;
        this.pet.petData.agility        = petData.agility;
        this.pet.petData.fun            = petData.fun;
        this.pet.petData.intelligence   = petData.intelligence;
        this.pet.petData.realtimeAge    = petData.realtimeAge;
        this.pet.petData.strength       = petData.strength;
        this.pet.petData.hunger         = petData.hunger;
        this.pet.petData.clean          = petData.clean;
        this.pet.petData.stage          = petData.stage;
        this.pet.petData.key            = petData.key;

        if (petData.fun > 10 || petData.agility > 10 || petData.strength > 10)
            this.isYerPetDeed = true;

        let ev = this.pet.checkEvolution();

        console.log(ev);

        let evKeys = null;
        switch (ev)
            {
            case "Strength":
                evKeys = this.pet.evolutionMap.get('brick');
                break;

            case "Agility":
                evKeys = this.pet.evolutionMap.get('mitts');
                break;

            case "Fun":
                evKeys = this.pet.evolutionMap.get('omni');
                break;
            }

        if (this.pet.petData.stage > 2)
            this.pet.petData.stage = 2;

        this.pet.setTexture(evKeys[this.pet.petData.stage]);
        this.pet.createAnimations();

        switch (ev)
        {
            case "Strength":
                if (this.pet.petData.strength === this.pet.petData.stage + 2)
                    this.pet.petData.stage += 1;
                break;

            case "Agility":
                if (this.pet.petData.agility === this.pet.petData.stage + 2)
                    this.pet.petData.stage += 1;
                break;

            case "Fun":
                if (this.pet.petData.fun === this.pet.petData.stage + 2)
                    this.pet.petData.stage += 1;

                break;
        }

        DataHandler.SaveObject("pet_data", this.pet.petData);


        //Doing this for the time being, apparently can't call the emit right away
        this.time.addEvent(
            {
            delay: 1000,
            loop: false,

            callback: () =>
                {
                this.ui_scene.events.emit("pet-loaded")
                },
             });

        //Create events and timers
        this.time.addEvent(
            {
                delay: 10000,
                loop: true,

                callback: () =>
                    {
                    if (!this.pet.isInteractable)
                        {
                        this.pet.petData.hunger = Clamp(this.pet.petData.hunger - 10, 0, 100);
                        this.pet.petData.clean = Clamp(this.pet.petData.clean - 5, 0, 100);

                        this.pet.updateAnimations();

                        DataHandler.SaveObject("pet_data", this.pet.petData);
                        }
                    },
            });

        }
    }

export class MainPetScene_UI extends UI_Scene
    {
    constructor()
        {
        super("Main_UI");

        this.panelShown = UI_STATES.NONE;
        this.hasCreated = false;
        }

    preload()
        {
        super.preload();

        this.load.image ('player', 'pets/test-pet.png');
        this.load.image ('ui-button-large', 'ui/buttons/ui-button-large.png');

        this.load.image ('bar', 'ui/base-pixel.png');
        }

    create()
        {
        super.create();
        this.optionText =
            this.CreateTextObject(config.width/2, config.height/8,"", TextStyle.LargeHeader);

        //Load main UI, Feeding, Bathe, Train etc
        this.events.once("pet-loaded", () =>
            {
            this.CreatePetUI();
            });

        this.events.once("pet-deed", () =>
            {
            //console.log(this.iconsTop);
            for (let i = 0; i < this.iconsTop.length; i ++)
                {
                this.iconsTop[i].background.destroy();
                this.iconsTop[i].text.destroy();
                }

            let a = this.statusBars.get("food_bar");
            a.back.destroy();
            a.destroy();

            let b = this.statusBars.get("clean_bar");
            b.back.destroy();
            b.destroy();

            this.optionText.setText("");

            this.CreateTextObject(config.width/2, 100, "Your Pet Has Died...", TextStyle.LargeHeader);
            });
        }

    update()
        {
        if (this.showTab && this.panelShown === UI_STATES.INFO)
            {
            this.mainScene.pet.petData.UpdateData();

            //TODO: Remove from update
            this.infoChildren.get("general").setText (this.mainScene.pet.petData.PetBasicInfo);
            this.infoChildren.get("stats")  .setText (this.mainScene.pet.petData.PetStatInfo);
            this.infoChildren.get("system") .setText (this.mainScene.pet.petData.PetSystemInfo);
            }

        if (this.hasCreated)
            {
            let food = this.statusBars.get("food_bar");
            let clean = this.statusBars.get("clean_bar");

            //TODO: Setup as event
            if (food.value !== this.mainScene.pet.petData.hunger)
                food.UpdateValue(this.mainScene.pet.petData.hunger, false);

            if (clean.value !== this.mainScene.pet.petData.clean)
                clean.UpdateValue(this.mainScene.pet.petData.clean, false);
            }
        }

    //<editor-fold desc="====== INITIALIZE =======">

    CreatePetUI()
        {
        //Containers
        this.topContainer    = new UIHelper.UIContainer(50, config.width - 50);
        this.longContainer   = new UIHelper.UIContainer(0, config.width);

        this.bottomGroup     = new UIHelper.HorizontalGroup(this.longContainer, 3);

        //Recycled variables for drawing
        this.panelRectangle = null;
        this.showTab = false;

        this.trainGraphics = this.add.graphics();
        this.trainGraphics.setDepth(-1);

        this.PetUI_Info();
        this.PetUI_Header();
        this.PetUI_Train();

        this.time.delayedCall(10, () =>
            {
            this.optionText.setText( "Select an option");
            this.optionText.setOrigin(0.5, 0);
            });

        this.hasCreated = true;
        }

    PetUI_Header()
        {
        this.iconsText = [
            {
            text    : "Info",
            onClick : () => this.ToggleTab(UI_STATES.INFO),

            key   : "main-buttons",
            style : TextStyle.normal_header
            },
            {
            text    : "Feed",
            onClick : () => this.ToggleTab(UI_STATES.FEED),

            key   : "main-buttons",
            style : TextStyle.normal_header
            },
            {
            text    : "Clean",
            onClick : () => this.ToggleTab(UI_STATES.CLEAN),

            key   : "main-buttons",
            style : TextStyle.normal_header
            },
            {
            text    : "Train",
            onClick : () => this.ToggleTab(UI_STATES.TRAIN),

            key   : "main-buttons",
            style : TextStyle.normal_header
            },
            {
            text    : "Clear Data",
            onClick : () =>
                {
                DataHandler.RemoveObject("has_pet");
                this.ToggleTab(UI_STATES.LOAD);
                },

            key   : "main-buttons",
            style : TextStyle.normal_header
            }];
        this.iconsTop = new Array(this.iconsText.length);
        this.iconsFrameRef = ["info","food","clean","train","delete"];

        let iconSpacing =  this.topContainer.GetLength/this.iconsTop.length;
        //Create buttons and specify spacing

        //Very lazy implementation
        for (let i = 0; i < this.iconsText.length; i ++)
            {
            let value = this.topContainer.LerpCentered(iconSpacing, i);
            //this.iconsTop[i] = this.CreateButton(value, 36, this.iconsText[i].name, "ui-button-large");
            this.iconsTop[i] = this.CreateButtonConfig(value, 36, this.iconsText[i]);
            this.iconsTop[i].background.setFrame(this.iconsFrameRef[i]);

            this.iconsTop[i].SetDepth(100);

            this.iconsTop[i].background.displayWidth  *= 2.5;
            this.iconsTop[i].background.displayHeight *= 2.5;

            this.iconsTop[i].text.y += this.iconsTop[i].background.displayHeight/3;


            //TODO: Really poor quick fix to UI frame updates, find a fix
            this.iconsTop[i].background.on("pointerover", () =>
                {
                this.iconsTop[i].background.setFrame(this.iconsFrameRef[i]);
                });

            this.iconsTop[i].background.on("pointerout", () =>
                {
                this.iconsTop[i].background.setFrame(this.iconsFrameRef[i]);
                });

            this.iconsTop[i].background.on("pointerdown", () =>
                {
                this.iconsTop[i].background.setFrame(this.iconsFrameRef[i]);
                });

            this.iconsTop[i].background.on("pointerup", () =>
                {
                this.iconsTop[i].background.setFrame(this.iconsFrameRef[i]);
                });
            }

        this.statusBars = new ComponentMap();

        let w = this.iconsTop[0].background.displayWidth-16;

        //TODO: Start caching and storing positions for UI
        let foodbar = new Statusbar(this,
            this.topContainer.LerpCentered(iconSpacing, 1), 80, 'bar', 100, this.mainScene.pet.petData.hunger, w, 12);

        let cleanbar = new Statusbar(this,
            this.topContainer.LerpCentered(iconSpacing, 2), 80, 'bar', 100, this.mainScene.pet.petData.clean, w, 12);

        this.statusBars.add("food_bar", foodbar, false);
        this.statusBars.add("clean_bar", cleanbar, false);
        }

    PetUI_Info()
        {

        //Specify info tags
        //TODO: Redo literally all of this, messy references all over
        // this.info = new DynamicMap();
        // this.info.add("general", this.mainScene.pet.PetBasicInfo);
        // this.info.add("stats"  , this.mainScene.pet.PetStatInfo);
        // this.info.add("system" , this.mainScene.pet.PetSystemInfo);

        //TODO: Combine all info into a map or object
        this.infoTags  = ["general", "stats", "system"];
        this.infoTagss = [this.mainScene.pet.PetBasicInfo, this.mainScene.pet.PetStatInfo, this.mainScene.pet.PetSystemInfo];

        this.infoChildren    = new ComponentMap();
        //Create each section
        let h = config.height * 0.8 + config.height*0.125/4;
        for (let i = 0; i < this.bottomGroup.GetCount; i ++)
            {
            let position = this.bottomGroup.updateElementPosition(i);

            let header = this.infoChildren.add(
                this.infoTags[i] + "_header",
                this.CreateTextObject(position, h - h*0.05, this.infoTags[i], TextStyle.blue_header),
                true);

            let text = this.infoChildren.add(
                this.infoTags[i],
                this.CreateTextObject(position, h - h*0.01, this.infoTagss[i], TextStyle.normal_header),
                true);

            text.setOrigin(0.5, 0);
            }

        this.infoGraphics = this.add.graphics();
        this.infoGraphics.setDepth(-1);
        }

    PetUI_Train()
        {
        //Setup
        this.trainingDescription = this.CreateTextObject(0, 0, "Hover over an option to find out more.", TextStyle.blue_header);
        this.trainingDescription.setPosition(config.width/2, config.height * 0.275);
        this.trainingDescription.visible = false;

        //Training buttons
        this.trainInfo =
            [
            {
            text    : "Snowball Fight",
            description : "Fire snowballs at targets to improve your strength!",

            onClick : () => this.mainScene.LoadScene("Snowball_Game"),
            onOver  : () => {},
            onOut   : () => {},

            key   : "ui-button-large",
            style : TextStyle.blue_header
            },
            {
            text    : "Fetch",
            description : "Catch frisbees and increase your agility!",

            onClick : () => this.mainScene.LoadScene('Fetch_Game'),
            onOver  : () => {},
            onOut   : () => {},


            key   : "ui-button-large",
            style : TextStyle.blue_header
            },
            {
            text    : "Balancing",
            description : "Learn to balance on a thin rope!",

            onClick : () => this.mainScene.LoadScene('Balance_Game'),
            onOver  : () => {},
            onOut   : () => {},

            key   : "ui-button-large",
            style : TextStyle.blue_header
            },
            {
            text: "Fishing",
            description: "Catch some juicy fish!",

            onClick: () => this.mainScene.LoadScene('Fishing_Game'),
            onOver: () => {},
            onOut: () => {},

            key: "ui-button-large",
            style: TextStyle.blue_header
            }
            ];

        this.trainButtons = new Array(this.trainInfo.length);

        //Set spacing
        //Will be dividing the width into 3 columns
        //So that the middle has spacing between
        let iconSpacing = this.topContainer.GetLength/3;

        let spacingMod = 0;
        let heightMod  = 0;

        for (let i = 0; i < this.trainButtons.length; i ++)
            {
            spacingMod = i % 2 + 1; //1 or 2
            heightMod  = 96 * (i % 3);

            let value = this.topContainer.Lerp(iconSpacing * spacingMod);

            this.trainInfo[i].onOver = () => this.SetTrainingDescription(this.trainInfo[i].description);
            this.trainInfo[i].onOut =  () => this.SetTrainingDescription("");

            this.trainButtons[i] = this.CreateButtonConfig(value, config.height/3 + 32 + heightMod, this.trainInfo[i]);
            this.trainButtons[i].Hide();

            this.trainButtons[i].SetDepth(100);

            }


        }

    //</editor-fold>

    //<editor-fold desc="====== TAB TOGGLES =======">

    ToggleTab(State)
        {

        //Switch to new panel
        if (State !== this.panelShown)
            {
            this.ClearTabs();
            this.mainScene.option = this.showTab = true;
            }
        else
        //Toggle if the same one is selected
            {
            this.mainScene.option = this.showTab = !this.showTab;

            if (!this.showTab)
                return;

            }

        //Set the option in the main scene and the current data for UI
        this.mainScene.option = this.panelShown = State;

        switch (this.panelShown)
            {
            case UI_STATES.NONE:
                this.optionText.setText("Select an Option");
                break;

            case UI_STATES.INFO:
                this.optionText.setText("Showing Pet Info");
                this.TogglePetStats();
                break;

            case UI_STATES.FEED:
                this.optionText.setText("Feed\nClick and move the\nmouse over your pet");
                break;

            case UI_STATES.CLEAN:
                this.optionText.setText("Clean\nClick and move the\nmouse over your pet");
                break;

            case UI_STATES.TRAIN:
                this.optionText.setText("");
                this.ToggleTrainingPanel();
                break;

            case UI_STATES.LOAD:
                this.optionText.setText("Reset the game to\nmake a new pet.");
                break;
            }
        }

    ClearTabs()
        {
        this.showTab = false;

        //Reset all tabs before switching to another
        this.DrawPetStats(false);
        this.DrawTrainingPanel(false);
        }

    //</editor-fold>

    //<editor-fold desc="====== TAB DRAW =======">

    //Training
    ToggleTrainingPanel()
        {
        this.DrawTrainingPanel(this.showTab);
        }

    DrawTrainingPanel(showPanel)
        {
        if (showPanel)
            {
            this.panelRect = new Phaser.Geom.Rectangle(
                this.longContainer.max*0.125, config.height*0.25,
                this.longContainer.max*0.875, config.height*0.75);

            //Background
            this.trainGraphics .lineStyle (5, 0xFF00FF, 1.0);
            this.trainGraphics .fillStyle (0xFFFFFF, 1.0);
            this.trainGraphics .fillRect  (
                this.panelRect.left , this.panelRect.top,
                this.panelRect.width - this.panelRect.left, this.panelRect.height - this.panelRect.top);
            this.trainGraphics .strokeRect(
                this.panelRect.left , this.panelRect.top,
                this.panelRect.width - this.panelRect.left, this.panelRect.height - this.panelRect.top);

            //Show buttons
            for (let i = 0; i < this.trainButtons.length; i++)
                this.trainButtons[i].Show();
            }
        else
            {
            for (let i = 0; i < this.trainButtons.length; i++)
                this.trainButtons[i].Hide();

            this.trainGraphics .clear();
            }

        this.trainingDescription.visible = showPanel;
        }

    SetTrainingDescription(info = "")
        {
        if (info !== "")
            this.trainingDescription.setText(info);
        else
            this.trainingDescription.setText("Hover over an option to find out more.")
        }

    //Pet Stats
    TogglePetStats()
        {
        this.DrawPetStats(this.showTab);
        }

    DrawPetStats(showPanel)
        {
        if (showPanel)
            {
            // this.panelRectangle = new Phaser.Geom.Rectangle(
            //     this.longContainer.min, config.height - 50,
            //     this.longContainer.max, config.height - 50);

            //Background
            this.infoGraphics .lineStyle (5, 0xFF00FF, 1.0);
            this.infoGraphics .fillStyle (0xFFFFFF, 1.0);
            this.infoGraphics .fillRect  (0, config.height*0.75, config.width, config.height*0.25);
            this.infoGraphics .strokeRect(2.5, config.height*0.75+2.5, config.width-5, config.height*0.25-5);

            //Info
            this.infoChildren.enableChildren();
            }
        else
            {
            this.infoChildren.disableChildren();
            this.infoGraphics .clear();
            }
        }

    //</editor-fold>
    }

export const UI_STATES =
    {
    NONE  : "NONE",
    INFO  : "INFO",
    FEED  : "FEED",
    CLEAN : "CLEAN",
    TRAIN : "TRAIN",
    LOAD  : "LOAD"
    };