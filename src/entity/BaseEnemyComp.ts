import Entity from "./Entity";
import {app} from "../index";
import BaseComp from "./BaseComp";
import PhysicsComp from "./PhysicsComp";
import AnimSpriteComp from "./AnimSpriteComp";

export default class BaseEnemyComp extends BaseComp
{
    private health:any;
    private physics:PhysicsComp;


    init():void
    {
        this.health = this.data.health;
        this.physics = this.entity.getComponent(PhysicsComp)!
    }


    applyDamage(damageQty:number):void
    {
        app.sound.playSound("hit");

        this.health = Math.max(0, this.health - damageQty);

        const s = this.entity.getComponent(AnimSpriteComp)!;
        s.playDamageAnim();

        if (this.health === 0)
        {
            app.physics.removeCollider(this.physics.collider);
            s.playDeathAnimation();
        }
    }


}