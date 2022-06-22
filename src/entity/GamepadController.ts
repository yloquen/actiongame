import BaseComp from "./BaseComp";
import PhysicsComp from "./PhysicsComp";
import Point from "../geom/Point";
import {app} from "../index";
import E_UpdateStep from "../const/E_UpdateStep";
import WeaponsComp from "./WeaponsComp";


export default class GamepadController extends BaseComp
{

    private physics:PhysicsComp;

    private velocity:Point;
    private gamepad:Gamepad;

    private deadZone:number = .2;
    private aimVector:Point;
    private weapons:WeaponsComp;

    init():void
    {
        this.velocity = new Point(0,0);
        this.aimVector = new Point(0,0);

        this.physics = this.entity.getComponent(PhysicsComp)!;
        this.weapons = this.entity.getComponent(WeaponsComp)!;
        this.weapons.setAimVector(this.aimVector);

        window.addEventListener("gamepadconnected", (e:any) =>
        {
            this.gamepad = e.gamepad;
            app.game.addUpdateCallback(this.update.bind(this), E_UpdateStep.INPUT);
        });

    }


    update(delta:number):void
    {
        this.velocity.x = this.gamepad.axes[0];
        this.velocity.y = this.gamepad.axes[1];
        this.processVector(this.velocity);
        this.velocity.scale(.3);

        this.physics.setVelocity(this.velocity);

        this.aimVector.x = this.gamepad.axes[2];
        this.aimVector.y = this.gamepad.axes[3];
        this.processVector(this.aimVector);
        this.aimVector.scale(1);
        if (this.aimVector.length() > 0)
        {
            this.aimVector.add(this.velocity);
        }
    }


    processVector(v:Point):void
    {
        v.toPolar();
        v.x = Math.max(0, v.x - this.deadZone);
        v.toRect();
        v.normalize();
    }


}