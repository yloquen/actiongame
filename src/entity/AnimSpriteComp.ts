import {app} from "../index";
import AnimSprite from "../AnimSprite";
import E_SpriteState from "../const/E_SpriteState";
import BaseComp from "./BaseComp";
import PhysicsComp from "./PhysicsComp";
import E_UpdateStep from "../const/E_UpdateStep";
import {gsap} from "gsap";
import {E_ViewLayer} from "../ViewManager";
import * as PIXI from "pixi.js";
import Entity from "./Entity";

export default class AnimSpriteComp extends BaseComp
{
    public anim:AnimSprite;

    private physics:PhysicsComp;

    private tempPt:PIXI.Point;


    constructor(e:Entity, data:any)
    {
        super(e, data);
        this.tempPt = new PIXI.Point();
        this.anim = new AnimSprite(this.data.animData);
    }

    init():void
    {
        this.physics = this.entity.getComponent(PhysicsComp)!;

        this.anim.sprite.x = this.physics.position.x;
        this.anim.sprite.y = this.physics.position.y;
        this.anim.sprite.alpha = this.data.alpha || 1;
        // this.anim.sprite.scale.set(15);
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
        gsap.to(this.anim.sprite, .2, {alpha:0, onComplete:() =>
            {
                this.destroyEntity();
            }});
    }


    playDamageAnim(damageQty:number):void
    {
        this.anim.sprite.tint = 0xff0000;

        const damageText = app.assets.createNumber(damageQty);

        const interfaceLayer = app.viewManager.getLayer(E_ViewLayer.INTERFACE);
        interfaceLayer.toLocal(this.anim.sprite.position, this.anim.sprite.parent, this.tempPt);
        damageText.position.x = this.tempPt.x;
        damageText.position.y = this.tempPt.y;
        interfaceLayer.addChild(damageText);

        gsap.to(damageText, 1, {y:this.tempPt.y - 50});
        gsap.to(damageText, .2, {delay:.8, alpha:0, onComplete:() => {interfaceLayer.removeChild(damageText)}});

        gsap.delayedCall(.2, () => {this.anim.sprite.tint = 0xffffff});
    }


    destroy():void
    {
        this.anim.destroy();
        super.destroy();
    }

}