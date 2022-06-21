import * as PIXI from "pixi.js"
import Game from "./Game";
import Assets from "./Assets";
import ViewManager from "./ViewManager";
import EnemyManager from "./EnemyManager";
import PhysicsEngine from "./PhysicsEngine";





export const app:any =
{
    pixi:new PIXI.Application({
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundColor: 0x2c3e50
    }),
    assets:new Assets(),
    game:new Game(),
    viewManager:new ViewManager(),
    enemyManager:new EnemyManager(),
    physics:new PhysicsEngine()
};


document.body.appendChild(app.pixi.view);

let assetVer = "?v=1";

app.pixi.loader
    .add("main_atlas", "assets/main_atlas.json" + assetVer)
    .load(start);


function start():void
{
    PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST;

    app.assets.init();
    app.game.init();
    app.viewManager.init();
    app.enemyManager.init();
}