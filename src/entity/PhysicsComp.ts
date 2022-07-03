
import BaseComp from "./BaseComp";
import Entity from "./Entity";
import {app} from "../index";
import Point from "../geom/Point";
import BaseCollider from "../physics/BaseCollider";
import E_UpdateStep from "../const/E_UpdateStep";
import CharControlComp from "./CharControlComp";

export enum E_ColliderType
{
    RECTANGLE,
    CIRCLE
}

export default class PhysicsComp extends BaseComp
{

    public collider:BaseCollider;
    public position:Point;
    public velocity:Point;

    private mass:number;


    init():void
    {
        this.velocity = this.data.velocity ? this.data.velocity.clone() : new Point(0,0);
        this.mass = 10;
        this.position = new Point(this.data.pos.x, this.data.pos.y);

        const colliderData = this.data.collider;
        if (colliderData)
        {
            this.collider = new colliderData.type(colliderData, this);
            app.physics.addCollider(this.collider);
        }
        this.addUpdateCallback(this.update.bind(this), E_UpdateStep.MOVEMENT);
    }


    update(delta:number):void
    {
        this.position.x += this.velocity.x * delta;
        this.position.y += this.velocity.y * delta;
    }


    setVelocity(v:Point):void
    {
        this.velocity = v;
    }


    destroy():void
    {
        app.physics.removeCollider(this.collider);
        super.destroy();
    }


}