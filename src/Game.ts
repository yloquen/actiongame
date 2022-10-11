import Entity from "./entity/Entity";
import PhysicsComp from "./entity/PhysicsComp";
import {app} from "./index";
import AnimSpriteComp from "./entity/AnimSpriteComp";
import E_SpriteState from "./const/E_SpriteState";
import E_UpdateStep from "./const/E_UpdateStep";
import ShooterComp from "./entity/ShooterComp";
import CharControlComp from "./entity/CharControlComp";
import MouseControlComp from "./entity/MouseControlComp";
import BeamComp from "./entity/BeamComp";
import GrowingProjectileWeaponComp from "./entity/GrowingProjectileWeaponComp";
import PolyCollider from "./physics/PolyCollider";
import CircleCollider from "./physics/CircleCollider";
import C_Game from "./const/C_Game";

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

        //this.character = e;

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