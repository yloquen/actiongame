import Entity from "./entity/Entity";
import KeyboardController from "./KeyboardController";
import PhysicsComp, {E_ColliderType} from "./entity/PhysicsComp";
import {app} from "./index";
import Point from "./geom/Point";
import AnimSpriteComp from "./entity/AnimSpriteComp";
import E_SpriteState from "./const/E_SpriteState";
import E_UpdateStep from "./const/E_UpdateStep";
import GamepadController from "./GamepadController";
import Util from "./util/Util";
import ShooterComp from "./entity/ShooterComp";
import CharControlComp from "./entity/CharControlComp";
import CircleCollider from "./physics/CircleCollider";
import SimpleProjectileComp from "./entity/SimpleProjectileComp";
import Rectangle = PIXI.Rectangle;
import RectCollider from "./physics/RectCollider";
import BeamComp from "./entity/BeamComp";
import GrowingProjectileComp from "./entity/GrowingProjectileComp";
import GrowingProjectileWeaponComp from "./entity/GrowingProjectileWeaponComp";
import PolyCollider from "./physics/PolyCollider";

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
        let e = new Entity({
            components:
            [
                {
                    compType:PhysicsComp,
                    pos:{x:0, y:0},
                    // collider:
                    // {
                    //     type: CircleCollider,
                    //     radius:app.model.scale*10,
                    //     ratioOut:1,
                    //     ratioIn:1
                    // }
                    collider:
                    {
                        type: PolyCollider,
                        points:[

                            {x:0, y:-80},
                            {x:110, y:10},
                            {x:0, y:70},
                            {x:-90, y:0}
                        ],
                        // type: RectCollider,
                        // width:app.model.scale * 18,
                        // height:app.model.scale * 18,
                        ratioOut:1,
                        ratioIn:0,
                        mass:1000,
                    }
                },
                {
                    compType:AnimSpriteComp,
                    animData:
                    [
                        {
                            stateName:E_SpriteState.IDLE,
                            numFrames:6, updateTime:100,
                            texturePrefix:"knight_idle_anim_f",
                            frame:0
                        },
                        {
                            stateName:E_SpriteState.WALK,
                            numFrames:6, updateTime:100,
                            texturePrefix:"knight_run_anim_f",
                            frame:0
                        }
                    ]
                },
                {
                    compType:CharControlComp
                },
                {
                    compType:ShooterComp
                },
                {
                    compType:BeamComp
                },
                {
                    compType:GrowingProjectileWeaponComp
                }
            ]
        });

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
        // Util.startBenchmark();

        const delta = app.pixi.ticker.deltaMS;
        this.updateCallbacks[E_UpdateStep.INPUT].forEach(c => { c(delta); });
        this.updateCallbacks[E_UpdateStep.POST_INPUT].forEach(c => { c(delta); });
        this.updateCallbacks[E_UpdateStep.PRE_MOVEMENT].forEach(c => { c(delta); });
        this.updateCallbacks[E_UpdateStep.MOVEMENT].forEach(c => { c(delta); });
        app.physics.checkCollisions();
        this.updateCallbacks[E_UpdateStep.COLLISION_HANDLING].forEach(c => { c(delta); });
        this.updateCallbacks[E_UpdateStep.CREATION].forEach(c => { c(delta); });
        this.updateCallbacks[E_UpdateStep.FINAL].forEach(c => { c(delta); });

        // Util.endBenchmark();
        // this.runDiag();
    }


    runDiag():void
    {
        let n = 0;
        for (let step in E_UpdateStep)
        {
            if (!isNaN(Number(step)))
            {
                n += this.updateCallbacks[step].length;
            }
        }
        // console.log("Update callbacks : " + n);
    }


}