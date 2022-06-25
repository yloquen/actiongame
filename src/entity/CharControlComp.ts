import * as PIXI from "pixi.js";
import BaseComp from "./BaseComp";
import {app} from "../index";
import E_UpdateStep from "../const/E_UpdateStep";
import PhysicsComp, {E_ColliderType} from "./PhysicsComp";
import WeaponsComp from "./WeaponsComp";

enum E_GamepadButtons
{
    R2 = 7
}


export default class CharControlComp extends BaseComp
{
    private physics:PhysicsComp;
    private weapons:WeaponsComp;
    private gpButChanges:number[];
    private gpButStates:boolean[];


    init():void
    {
        this.addUpdateCallback(this.update.bind(this), E_UpdateStep.POST_INPUT);

        this.physics = this.entity.getComponent(PhysicsComp)!;
        this.weapons = this.entity.getComponent(WeaponsComp)!;

        this.gpButChanges = app.gamepadController.buttonChanges;
        this.gpButStates = app.gamepadController.buttonsState;
    }


    update(delta:number):void
    {
        this.physics.setVelocity(app.gamepadController.velocity);
        this.weapons.setAimVector(app.gamepadController.aimVector);

        if (this.gpButChanges.length > 0)
        {
            for (let changeIdx = 0; changeIdx < this.gpButChanges.length; changeIdx++)
            {
                const butChangedIdx = this.gpButChanges[changeIdx];

                switch (butChangedIdx)
                {
                    case E_GamepadButtons.R2:
                    {
                        this.weapons.setWaveBeamState(this.gpButStates[butChangedIdx]);
                        break;
                    }
                }
            }

        }
    }


}