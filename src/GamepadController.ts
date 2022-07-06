import BaseComp from "./entity/BaseComp";
import PhysicsComp from "./entity/PhysicsComp";
import Point from "./geom/Point";
import {app} from "./index";
import E_UpdateStep from "./const/E_UpdateStep";



export default class GamepadController
{
    public buttonsState:boolean[];
    public buttonChanges:number[];
    public velocity:Point;

    private deadZone:number = .5;
    private aimVector:Point;



    init():void
    {
        this.velocity = new Point(0,0);
        this.aimVector = new Point(0,0);

        this.buttonsState = [];
        this.buttonChanges = [];

        app.game.addUpdateCallback(this.update.bind(this), E_UpdateStep.INPUT);
    }


    update(delta:number):void
    {
        //@ts-ignore
        const gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads : []);
        for (let gpIdx = 0; gpIdx < gamepads.length; gpIdx++)
        {
            const gamepad = gamepads[gpIdx];
            if (gamepad)
            {
                this.processInput(gamepad);
                break;
            }
        }
    }

    processInput(gamepad:Gamepad):void
    {
        this.velocity.x = gamepad.axes[0];
        this.velocity.y = gamepad.axes[1];
        this.processVector(this.velocity);
        this.velocity.scale(.4);

        this.aimVector.x = gamepad.axes[2];
        this.aimVector.y = gamepad.axes[3];
        this.processVector(this.aimVector);
        // this.aimVector.scale(1);
        // if (this.aimVector.length() > 0)
        // {
        //     this.aimVector.add(this.velocity);
        // }

        this.buttonChanges.length = 0;
        gamepad.buttons.forEach((b,index) =>
        {
            if (b.pressed !== this.buttonsState[index])
            {
                this.buttonChanges.push(index);
                this.buttonsState[index] = b.pressed;
            }
        });

        gamepad.buttons.forEach((b, index) =>
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