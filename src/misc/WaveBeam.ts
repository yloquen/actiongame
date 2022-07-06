import PhysicsComp from "../entity/PhysicsComp";
import E_UpdateStep from "../const/E_UpdateStep";
import * as PIXI from "pixi.js";
import {app} from "../index";
import {E_ViewLayer} from "../ViewManager";
import BLEND_MODES = PIXI.BLEND_MODES;
import Entity from "../entity/Entity";
import CircleCollider from "../physics/CircleCollider";
import AnimSpriteComp from "../entity/AnimSpriteComp";
import E_SpriteState from "../const/E_SpriteState";
import SimpleProjectileComp from "../entity/SimpleProjectileComp";

export default class WaveBeam
{
    public sprite:PIXI.Sprite;

    private renderTexture:PIXI.RenderTexture;

    private sourceSprite:PIXI.Sprite;
    private pt:PIXI.Point;
    private mainContainer:PIXI.Sprite;

    constructor()
    {
        this.renderTexture = new PIXI.RenderTexture(new PIXI.BaseRenderTexture({width:850, height:400}));
        this.sprite = new PIXI.Sprite(this.renderTexture);

        this.sourceSprite = app.assets.getSprite("beam");
        this.sourceSprite.scale.set(app.model.scale * .5);
        this.sourceSprite.blendMode = BLEND_MODES.ADD;
        this.sprite.anchor.set(0, .5);

        this.pt = new PIXI.Point();
        this.mainContainer = app.viewManager.mainContainer;
    }


    render(progress:number, applyDamage:boolean = false):void
    {
        const spriteHalfHeight = this.sourceSprite.height * .5;

        let x=0;
        let cnt=0;
        while(x < 660 * progress)
        {
            const scale = app.model.scale * .5 * (1.5 + (x) / 660);
            const jitter = scale * .8;
            this.sourceSprite.scale.set(scale);
            this.sourceSprite.x = x - jitter + Math.random() * jitter * 2;
            this.sourceSprite.alpha = progress * (applyDamage ? .6 : .4);
            const amplitude = 0;//x * .3 * progress;
            this.sourceSprite.y = Math.sin(x * .03 * progress) * amplitude - jitter + Math.random() * jitter * 2;

            if (applyDamage && cnt % 2 === 0)
            {
                this.mainContainer.toLocal(this.sourceSprite.position, this.sprite, this.pt);
                this.createProjectile(scale);
            }
            cnt++;

            this.sourceSprite.y = this.sourceSprite.y + (200 - (spriteHalfHeight));

            app.pixi.renderer.render(this.sourceSprite, this.renderTexture, x === 0);

            const yPrime = amplitude * .03 * Math.cos(x * .03 * progress);

            const step = 10 / Math.sqrt(1 + yPrime * yPrime);
            x+=step;
        }
    }


    createProjectile(size:number)
    {
        const e = new Entity(
        {
            components:
            [
                {
                    compType:PhysicsComp,
                    pos:this.pt,
                    velocity:0,
                    collider:
                    {
                        type:CircleCollider,
                        radius:size,
                        ratioOut:.25,
                        ratioIn:1
                    }
                },
                /*{
                    compType:AnimSpriteComp,
                    scale:size,
                    animData:
                    [
                        {
                            stateName:E_SpriteState.IDLE,
                            numFrames:2,
                            updateTime:100,
                            texturePrefix:"fireball_f",
                            frame:0
                        },
                        {
                            stateName:E_SpriteState.WALK,
                            numFrames:2, updateTime:100,
                            texturePrefix:"fireball_f",
                            frame:0
                        }
                    ]
                },*/
                {
                    compType:SimpleProjectileComp,
                    numHits:1,
                    minDamage:1,
                    deltaDamage:1,
                    maxLifetime:1
                }
            ]
        });
    }


    get rotation():number
    {
        return this.sprite.rotation;
    }


    set rotation(value:number)
    {
        this.sprite.rotation = value;
    }

}