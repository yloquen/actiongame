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
import CameraController from "./CameraController";
import {gsap} from "gsap";
import Pool from "./Pool";




export const app:any =
{
    pixi:new PIXI.Application({
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundColor: 0x000000
    }),
    model:new Model(),
    assets:new Assets(),
    game:new Game(),
    viewManager:new ViewManager(),
    enemyManager:new EnemyManager(),
    physics:new PhysicsEngine(),
    sound:new SoundController(),
    gamepadController:new GamepadController(),
    mapGenerator:new MapGenerator(),
    camera:new CameraController(),
    pool:new Pool()
};

document.body.appendChild(app.pixi.view);


let fontsToPrecache = ["Upheaval"];

for (let fntIdx=0; fntIdx < fontsToPrecache.length; fntIdx++)
{
    const tfStyle = new PIXI.TextStyle({fontFamily: [fontsToPrecache[fntIdx]], fontSize: 2, fill: "#ffffff"});
    const tf = new PIXI.Text(".", tfStyle);
    tf.alpha = 0.01;
    app.pixi.stage.addChild(tf);
    gsap.delayedCall(1, () => {app.pixi.stage.removeChild(tf);} );
}

app.pixi.loader
    .add("main_atlas", "assets/main_atlas.json?v=" + C_Game.ASSET_VER)
    .add("tilemap1", "assets/maps/map1.tmj?v=" + C_Game.ASSET_VER)
    .add("tilemap2", "assets/maps/map2.tmj?v=" + C_Game.ASSET_VER)
    .add("tileset", "assets/maps/tiles.tsj?v=" + C_Game.ASSET_VER)
    .add("puzzle_1_1", "assets/maps/puzzle_1_1.tmj?v=" + C_Game.ASSET_VER)
    .load(start);


function start():void
{
    PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

    app.pixi.stage.interactive = true;

    app.assets.init();
    app.gamepadController.init();
    app.game.init();
    app.viewManager.init();
    app.enemyManager.init();
    app.sound.init();
    app.mapGenerator.init();
    app.camera.init();
    app.pool.init();


}


