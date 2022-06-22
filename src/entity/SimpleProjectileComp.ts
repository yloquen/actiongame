import BaseComp from "./BaseComp";
import E_UpdateStep from "../const/E_UpdateStep";
import {app} from "../index";
import PhysicsComp from "./PhysicsComp";
import BaseEnemy from "./BaseEnemy";

export default class SimpleProjectileComp extends BaseComp
{
    private numHits:number;
    private physics:PhysicsComp;
    private minDamage:number;
    private deltaDamage:number;



    init():void
    {
        this.physics = this.entity.getComponent(PhysicsComp)!;
        this.numHits = this.data.numHits;
        this.minDamage = this.data.minDamage;
        this.deltaDamage = this.data.deltaDamage;

        app.game.addUpdateCallback(this.update.bind(this), E_UpdateStep.COLLISION_HANDLING);
    }


    update(delta:number):void
    {
        const collisions = this.physics.collider.collisions;
        while (collisions.length > 0 && this.numHits > 0)
        {
            const collision = collisions.pop()!;
            const e = collision.physics.entity;
            const enemyComp = e.getComponent(BaseEnemy);
            if (enemyComp)
            {
                this.numHits--;
                const damage = this.minDamage + Math.floor(Math.random() * this.deltaDamage);
                enemyComp.applyDamage(damage);
            }
        }
    }



}