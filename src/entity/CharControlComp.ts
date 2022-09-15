import * as PIXI from "pixi.js";
import BaseComp from "./BaseComp";
import {app} from "../index";
import E_UpdateStep from "../const/E_UpdateStep";
import PhysicsComp from "./PhysicsComp";
import ShooterComp from "./ShooterComp";

enum E_GamepadButtons
{
    L1 = 4,
    R1 = 5,
    R2 = 7
}


export default class CharControlComp extends BaseComp
{
    private physics:PhysicsComp;

    private gpButChanges:number[];
    private gpButStates:boolean[];

    private skillsState:boolean[];


    init():void
    {
        this.addUpdateCallback(E_UpdateStep.POST_INPUT);

        this.physics = this.entity.getComponent(PhysicsComp)!;

        this.gpButChanges = app.gamepadController.buttonChanges;
        this.gpButStates = app.gamepadController.buttonsState;

        this.skillsState = [];
    }


    update(delta:number):void
    {
        this.physics.setVelocity(app.gamepadController.velocity);

        if (this.gpButChanges.length > 0)
        {
            for (let changeIdx = 0; changeIdx < this.gpButChanges.length; changeIdx++)
            {
                const butChangedIdx = this.gpButChanges[changeIdx];

                switch (butChangedIdx)
                {
                    case E_GamepadButtons.L1:
                    {
                        this.skillsState[1] = this.gpButStates[butChangedIdx];
                        break;
                    }

                    case E_GamepadButtons.R1:
                    {
                        this.skillsState[3] = this.gpButStates[butChangedIdx];
                        break;
                    }

                    case E_GamepadButtons.R2:
                    {
                        this.skillsState[4] = this.gpButStates[butChangedIdx];
                        break;
                    }
                }
            }

        }
    }


    getAimVector()
    {
        return app.gamepadController.aimVector;
    }


    isSkillActive(skillId:number):boolean
    {
        return this.skillsState[skillId];
    }


}