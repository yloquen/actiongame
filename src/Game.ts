import Entity from "./entity/Entity";
import KeyboardController from "./entity/KeyboardController";
import PhysicsComp, {E_ColliderType} from "./entity/PhysicsComp";
import {app} from "./index";
import Point from "./geom/Point";
import AnimSpriteComp from "./entity/AnimSpriteComp";
import E_SpriteState from "./const/E_SpriteState";
import E_UpdateStep from "./const/E_UpdateStep";

export default class Game
{
    static GRID_SIZE = new Point(10,10);
    static GRID_TILE_SIZE = new Point(100,100);

    private updateCallbacks:Function[][];

    constructor()
    {
        const physicsGrid:[][][] = [];

        for (let x = 0; x < Game.GRID_SIZE.x; x++)
        {
            physicsGrid[x] = [];
            for (let y = 0; y < Game.GRID_SIZE.y; y++)
            {
                physicsGrid[x][y] = [];
            }
        }

        this.updateCallbacks = [];
        this.updateCallbacks[E_UpdateStep.MOVEMENT] = [];
        this.updateCallbacks[E_UpdateStep.COLLISION_HANDLING] = [];
        this.updateCallbacks[E_UpdateStep.FINAL] = [];
    }



    init():void
    {
        const e = new Entity(
            {
                components:
                    [
                        {
                            compType:PhysicsComp,
                            pos:{x:200, y:200},
                            collider:
                            {
                                type: E_ColliderType.CIRCLE,
                                radius:30
                            }
                        },
                        {
                            compType:AnimSpriteComp,
                            animData:
                            [
                                { stateName:E_SpriteState.IDLE, numFrames:6, updateTime:100, texturePrefix:"knight_idle_anim_f", frame:0 },
                                { stateName:E_SpriteState.WALK, numFrames:6, updateTime:100, texturePrefix:"knight_run_anim_f", frame:0 }
                            ]
                        },
                        {
                            compType:KeyboardController
                        }
                    ]
            }
        );


        this.addEntity(e);

        app.pixi.ticker.add(this.update.bind(this));
    }


    addEntity(e:Entity):void
    {

    }


    addUpdateCallback(callback:Function, updateStep:E_UpdateStep):void
    {
        this.updateCallbacks[updateStep].push(callback);
    }


    update():void
    {
        const delta = app.pixi.ticker.deltaMS;

        this.updateCallbacks[E_UpdateStep.MOVEMENT].forEach(c => { c(delta); });
        app.physics.checkCollisions();
        this.updateCallbacks[E_UpdateStep.COLLISION_HANDLING].forEach(c => { c(delta); });
        this.updateCallbacks[E_UpdateStep.FINAL].forEach(c => { c(delta); });
    }


}