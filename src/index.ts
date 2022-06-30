import * as PIXI from "pixi.js"
import Game from "./Game";
import Assets from "./Assets";
import ViewManager from "./ViewManager";
import EnemyManager from "./EnemyManager";
import PhysicsEngine from "./physics/PhysicsEngine";
import SoundController from "./SoundController";
import C_Game from "./const/C_Game";
import GamepadController from "./GamepadController";
import MapGenerator from "./MapGenerator";
import Model from "./Model";




export const app:any =
{
    pixi:new PIXI.Application({
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundColor: 0x2c3e50
    }),
    model:new Model(),
    assets:new Assets(),
    game:new Game(),
    viewManager:new ViewManager(),
    enemyManager:new EnemyManager(),
    physics:new PhysicsEngine(),
    sound:new SoundController(),
    gamepadController:new GamepadController(),
    mapGenerator:new MapGenerator()
};


document.body.appendChild(app.pixi.view);

app.pixi.loader
    .add("main_atlas", "assets/main_atlas.json?v=" + C_Game.ASSET_VER)
    .add("tilemap", "assets/maps/map1.tmj?v=" + C_Game.ASSET_VER)
    .add("tileset", "assets/maps/tiles.tsj?v=" + C_Game.ASSET_VER)
    .load(start);


function start():void
{
    PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

    app.assets.init();
    app.gamepadController.init();
    app.game.init();
    app.viewManager.init();
    app.enemyManager.init();
    app.sound.init();
    app.mapGenerator.init();


}


