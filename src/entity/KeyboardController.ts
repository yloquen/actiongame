import * as PIXI from "pixi.js"
import BaseComp from "./BaseComp";
import PhysicsComp from "./PhysicsComp";
import Point from "../geom/Point";

export default class KeyboardController extends BaseComp
{

    private physics:PhysicsComp;

    private axisState:boolean[][];
    private lastPressedDir:number[];
    private axes:number[];
    private dirVectors:Point;
    private velocity:Point;

    init():void
    {

        this.physics = this.entity.getComponent(PhysicsComp)!;

        // [X Axis, Y Axis]
        this.axisState = [[false, false], [false, false]];
        this.lastPressedDir = [0,0];
        this.axes = [0,0];

        this.dirVectors = new Point(0,0);
        this.velocity = new Point(0,0);

        document.addEventListener("keydown", this.handleKey.bind(this));
        document.addEventListener("keyup", this.handleKey.bind(this));
    }


    handleKey(e:KeyboardEvent):void
    {
        if (e.repeat)
        {
            return;
        }

        const pressed = e.type === "keydown";

        switch (e.key)
        {

            case "a":
            case "ArrowLeft":
            {
                this.updateAxis(0, 0, -1, pressed);

                break;
            }

            case "d":
            case "ArrowRight":
            {
                this.updateAxis(0, 1, 1, pressed);

                break;
            }

            case "w":
            case "ArrowUp":
            {
                this.updateAxis(1, 0, -1, pressed);
                break;
            }

            case "s":
            case "ArrowDown":
            {
                this.updateAxis(1, 1, 1, pressed);
                break;
            }
        }

    }


    updateAxis(axisIndex:number, dirIndex:number, dirVector:number, pressed:boolean):void
    {
        this.lastPressedDir[axisIndex] = (pressed ? dirVector : this.lastPressedDir[axisIndex]);
        const axisState = this.axisState[axisIndex];
        axisState[dirIndex] = pressed;

        if (axisState[0] && axisState[1])
        {
            this.axes[axisIndex] = dirVector;
        }
        else if (axisState[0])
        {
            this.axes[axisIndex] = -1;
        }
        else if (axisState[1])
        {
            this.axes[axisIndex] = 1;
        }
        else
        {
            this.axes[axisIndex] = 0;
        }

        let velocityMag = 0.3;
        if (axisIndex === 0)
        {
            this.dirVectors.x = this.axes[axisIndex];
        }
        else
        {
            this.dirVectors.y = this.axes[axisIndex];
        }

        this.velocity.x = this.dirVectors.x;
        this.velocity.y = this.dirVectors.y;

        this.velocity.normalize();
        this.velocity.scale(velocityMag);

        this.physics.setVelocity(this.velocity);
    }

}