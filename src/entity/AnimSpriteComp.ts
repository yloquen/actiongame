import {app} from "../index";
import AnimSprite from "../AnimSprite";
import E_SpriteState from "../const/E_SpriteState";
import BaseComp from "./BaseComp";
import PhysicsComp from "./PhysicsComp";
import E_UpdateStep from "../const/E_UpdateStep";

export default class AnimSpriteComp extends BaseComp
{
    private anim:AnimSprite;
    private physics:PhysicsComp;

    init():void
    {
        this.physics = this.entity.getComponent(PhysicsComp)!;
        this.anim = new AnimSprite(this.data.animData);
        app.game.addUpdateCallback(this.update.bind(this), E_UpdateStep.FINAL);
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





}