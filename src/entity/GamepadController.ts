import BaseComp from "./BaseComp";
import PhysicsComp from "./PhysicsComp";
import Point from "../geom/Point";
import {app} from "../index";
import E_UpdateStep from "../const/E_UpdateStep";
import WeaponsComp from "./WeaponsComp";


export default class GamepadController
{
    public buttonsState:boolean[];
    public buttonChanges:number[];
    public velocity:Point;

    // private physics:PhysicsComp;

    private gamepad:Gamepad|undefined;

    private deadZone:number = .2;
    private aimVector:Point;
    // private weapons:WeaponsComp;




    init():void
    {
        this.velocity = new Point(0,0);
        this.aimVector = new Point(0,0);

        this.buttonsState = [];
        this.buttonChanges = [];

/*        window.addEventListener("gamepadconnected", (e:any) =>
        {
            this.gamepad = e.gamepad;
            app.game.addUpdateCallback(this.update.bind(this), E_UpdateStep.INPUT);

            this.gamepad.buttons.forEach((b, index) =>
            {
                this.buttonsState[index] = b.pressed;
            });
        });*/


        app.game.addUpdateCallback(this.update.bind(this), E_UpdateStep.INPUT);
    }


    update(delta:number):void
    {
        this.gamepad = undefined;
        //@ts-ignore
        const gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads : []);
        for (let gpIdx = 0; gpIdx < gamepads.length; gpIdx++)
        {
            this.gamepad = gamepads[gpIdx];
            if (this.gamepad)
            {
                break;
            }
        }

        if (!this.gamepad)
        {
            return;
        }

        console.log(this.buttonsState);

        this.velocity.x = this.gamepad.axes[0];
        this.velocity.y = this.gamepad.axes[1];
        this.processVector(this.velocity);
        this.velocity.scale(.3);

        this.aimVector.x = this.gamepad.axes[2];
        this.aimVector.y = this.gamepad.axes[3];
        this.processVector(this.aimVector);
        this.aimVector.scale(1);
        if (this.aimVector.length() > 0)
        {
            this.aimVector.add(this.velocity);
        }

        this.buttonChanges.length = 0;
        this.gamepad.buttons.forEach((b,index) =>
        {
            if (b.pressed !== this.buttonsState[index])
            {
                debugger;
                this.buttonChanges.push(index);
                this.buttonsState[index] = b.pressed;
            }
        });

        this.gamepad.buttons.forEach((b, index) =>
        {
            this.buttonsState[index] = b.pressed;
        });

    }


    processVector(v:Point):void
    {
        v.toPolar();
        v.x = Math.max(0, v.x - this.deadZone);
        v.toRect();
        v.normalize();
    }


}