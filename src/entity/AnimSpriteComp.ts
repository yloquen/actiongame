import {app} from "../index";
import AnimSprite from "../AnimSprite";
import E_SpriteState from "../const/E_SpriteState";
import BaseComp from "./BaseComp";
import PhysicsComp from "./PhysicsComp";
import E_UpdateStep from "../const/E_UpdateStep";
import { TweenMax } from "gsap";

export default class AnimSpriteComp extends BaseComp
{
    public anim:AnimSprite;

    private physics:PhysicsComp;

    init():void
    {
        this.physics = this.entity.getComponent(PhysicsComp)!;
        this.anim = new AnimSprite(this.data.animData);
        this.anim.sprite.x = this.physics.position.x;
        this.anim.sprite.y = this.physics.position.y;
        this.addUpdateCallback(this.update.bind(this), E_UpdateStep.MOVEMENT);
    }

    update():void
    {
        this.anim.sprite.x = this.physics.position.x;
        this.anim.sprite.y = this.physics.position.y;

        if (this.physics.velocity.x > 0)
        {
            this.anim.sprite.scale.x = Math.abs(this.anim.sprite.scale.x);
        }
        else if (this.physics.velocity.x < 0)
        {
            this.anim.sprite.scale.x = -Math.abs(this.anim.sprite.scale.x);
        }

        if (this.physics.velocity.length() > 0)
        {
            this.anim.setState(E_SpriteState.WALK);
        }
        else
        {
            this.anim.setState(E_SpriteState.IDLE);
        }
    }


    playDeathAnimation():void
    {
        TweenMax.to(this.anim.sprite, .2, {alpha:0, onComplete:() =>
            {
                this.destroyEntity();
            }});
    }


    playDamageAnim():void
    {
        this.anim.sprite.tint = 0xff0000;
        TweenMax.delayedCall(.2, () => {this.anim.sprite.tint = 0xffffff});
    }


    destroy():void
    {
        this.anim.destroy();
        super.destroy();
    }

}