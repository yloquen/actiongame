import Entity from "./entity/Entity";
import KeyboardController from "./entity/KeyboardController";
import PhysicsComp, {E_ColliderType} from "./entity/PhysicsComp";
import {app} from "./index";
import Point from "./geom/Point";
import AnimSpriteComp from "./entity/AnimSpriteComp";
import E_SpriteState from "./const/E_SpriteState";
import E_UpdateStep from "./const/E_UpdateStep";
import GamepadController from "./entity/GamepadController";
import Util from "./util/Util";
import WeaponsComp from "./entity/WeaponsComp";

export type UpdateData =
{
    callback:Function;
    step:E_UpdateStep;
}

export default class Game
{

    public character:Entity;

    private updateCallbacks:Function[][];


    constructor()
    {
        this.updateCallbacks = [];

        for (let step in E_UpdateStep)
        {
            if (!isNaN(Number(step)))
            {
                this.updateCallbacks[step] = [];
            }
        }
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
                                radius:25,
                                collisionRatioOut:1,
                                collisionRatioIn:0
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
                        },
                        {
                            compType:GamepadController
                        },
                        {
                            compType:WeaponsComp
                        }
                    ]
            }
        );

        this.character = e;

        app.pixi.ticker.add(this.update.bind(this));
    }


    addUpdateCallback(callback:Function, updateStep:E_UpdateStep):UpdateData
    {
        this.updateCallbacks[updateStep].push(callback);
        return {callback:callback, step:updateStep};
    }


    removeUpdateCallback(updateData:UpdateData):void
    {
        const u = this.updateCallbacks[updateData.step];
        u.splice(u.indexOf(updateData.callback), 1);
    }


    update():void
    {
        const delta = app.pixi.ticker.deltaMS;
        this.updateCallbacks[E_UpdateStep.INPUT].forEach(c => { c(delta); });
        this.updateCallbacks[E_UpdateStep.PRE_MOVEMENT].forEach(c => { c(delta); });
        this.updateCallbacks[E_UpdateStep.MOVEMENT].forEach(c => { c(delta); });
        app.physics.checkCollisions();
        this.updateCallbacks[E_UpdateStep.COLLISION_HANDLING].forEach(c => { c(delta); });
        this.updateCallbacks[E_UpdateStep.CREATION].forEach(c => { c(delta); });
        this.updateCallbacks[E_UpdateStep.FINAL].forEach(c => { c(delta); });

        this.runDiag();
    }


    runDiag():void
    {
        let n=0;
        for (let step in E_UpdateStep)
        {
            if (!isNaN(Number(step)))
            {
                n+=this.updateCallbacks[step].length;
            }
        }
        // console.log("Update callbacks : " + n);
    }


}