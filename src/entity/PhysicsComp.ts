import * as PIXI from "pixi.js";
import BaseComp from "./BaseComp";
import Entity from "./Entity";
import {app} from "../index";
import Point from "../geom/Point";
import BaseCollider from "../physics/BaseCollider";
import E_UpdateStep from "../const/E_UpdateStep";
import CharControlComp from "./CharControlComp";
import CircleCollider from "../physics/CircleCollider";
import AnimSpriteComp from "./AnimSpriteComp";
import PolyCollider from "../physics/PolyCollider";
import SpriteComp from "./SpriteComp";

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


    constructor(e:Entity, data:any)
    {
        super(e,data);
        this.velocity = this.data.velocity ? this.data.velocity.clone() : new Point(0,0);
        this.mass = 10;
        this.position = new Point(this.data.pos.x, this.data.pos.y);
    }


    init():void
    {
        const colliderData = this.data.collider;
        if (colliderData)
        {
            this.collider = new colliderData.type(colliderData, this);
            app.physics.addCollider(this.collider);
        }

        if (app.physics.debug && colliderData)
        {
            const g = new PIXI.Graphics();
            g.beginFill(0xff00ff,0);
            g.lineStyle(5, 0xff00ff);
            g.scale.set(1/app.model.scale);
            if (colliderData.type === CircleCollider)
            {
                g.drawCircle(0,0,colliderData.radius);
            }
            else if (colliderData.type === PolyCollider)
            {
                const points = colliderData.points;
                const numPoints = points.length;

                for (let ptIdx = 0; ptIdx <= numPoints; ptIdx++)
                {
                    const p = points[ptIdx%numPoints];
                    if (ptIdx === 0)
                    {
                        g.moveTo(p.x - this.position.x, p.y - this.position.y);
                    }
                    else
                    {
                        g.lineTo(p.x - this.position.x, p.y - this.position.y);
                    }
                }

            }
            g.endFill();

            const container = this.entity.getComponent(AnimSpriteComp)?.anim.sprite || this.entity.getComponent(SpriteComp)?.sprite;
            if (container)
            {
                container.addChild(g);
            }

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