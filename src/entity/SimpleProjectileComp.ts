import BaseComp from "./BaseComp";
import E_UpdateStep from "../const/E_UpdateStep";
import {app} from "../index";
import PhysicsComp from "./PhysicsComp";
import BaseEnemyComp from "./BaseEnemyComp";
import AnimSpriteComp from "./AnimSpriteComp";
import {TweenMax} from "gsap";
import {E_EFlag} from "./Entity";

export default class SimpleProjectileComp extends BaseComp
{
    private numHits:number;
    private physics:PhysicsComp;
    private minDamage:number;
    private deltaDamage:number;
    private lifetime:number = 0;




    init():void
    {
        this.physics = this.entity.getComponent(PhysicsComp)!;
        this.numHits = this.data.numHits;
        this.minDamage = this.data.minDamage;
        this.deltaDamage = this.data.deltaDamage;

        this.updateCallback = app.game.addUpdateCallback(this.update.bind(this), E_UpdateStep.COLLISION_HANDLING);
    }


    update(delta:number):void
    {
        this.lifetime += delta;
        if (this.lifetime > 3000)
        {
            this.numHits = 0;
        }

        const collisions = this.physics.collider.collisions;
        while (collisions.length > 0 && this.numHits > 0)
        {
            const collision = collisions.pop()!;
            const e = collision.physics.entity;
            const enemyComp = e.getComponent(BaseEnemyComp);
            if (enemyComp)
            {
                this.numHits--;
                const damage = this.minDamage + Math.floor(Math.random() * this.deltaDamage);
                enemyComp.applyDamage(damage);
            }
            else if (e.hasFlag(E_EFlag.WALL))
            {
                this.numHits = 0;
            }
        }

        if (this.numHits === 0)
        {
            app.game.removeUpdateCallback(this.updateCallback);
            const animComp = this.entity.getComponent(AnimSpriteComp)!;
            this.physics.velocity.set(0,0);
            this.physics.collider.collisionRatioIn = 0;
            TweenMax.to(animComp.anim.sprite, .1, {alpha:0, onComplete:() =>
                {
                    this.destroyEntity();
                }})
        }
    }





}