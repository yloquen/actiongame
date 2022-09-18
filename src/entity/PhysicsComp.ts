import * as PIXI from "pixi.js";
import BaseComp from "./BaseComp";
import Entity from "./Entity";
import {app} from "../index";
import Point from "../geom/Point";
import CircleCollider from "../physics/CircleCollider";
import E_UpdateStep from "../const/E_UpdateStep";
import CharControlComp from "./CharControlComp";
import AnimSpriteComp from "./AnimSpriteComp";
import PolyCollider from "../physics/PolyCollider";
import SpriteComp from "./SpriteComp";
import C_Game from "../const/C_Game";


export default class PhysicsComp extends BaseComp
{
    public collider:CircleCollider;
    public position:Point;
    public velocity:Point;

    constructor(e:Entity, data:any)
    {
        super(e,data);
        this.velocity = this.data.velocity ? this.data.velocity.clone() : new Point(0,0);
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
            g.lineTextureStyle({ width:C_Game.SCALE, color:0xff00ff,
                cap:PIXI.LINE_CAP.BUTT, join:PIXI.LINE_JOIN.ROUND, alignment:0 });
            g.scale.set(1/C_Game.SCALE);
            g.drawCircle(0, 0, this.collider.radius);

            if (colliderData.type === PolyCollider)
            {
                const points = colliderData.points;
                const numPoints = points.length;

                for (let ptIdx = 0; ptIdx <= numPoints; ptIdx++)
                {
                    const p = points[ptIdx%numPoints];
                    if (ptIdx === 0)
                    {
                        g.moveTo(p.x, p.y);
                    }
                    else
                    {
                        g.lineTo(p.x, p.y);
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
        this.addUpdateCallback(E_UpdateStep.MOVEMENT);
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