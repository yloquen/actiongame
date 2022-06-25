import PhysicsComp from "../entity/PhysicsComp";
import E_UpdateStep from "../const/E_UpdateStep";
import * as PIXI from "pixi.js";
import {app} from "../index";
import {E_ViewLayer} from "../ViewManager";
import BLEND_MODES = PIXI.BLEND_MODES;

export default class WaveBeam
{
    private renderTexture:PIXI.RenderTexture;
    sprite:PIXI.Sprite;
    private sourceSprite:PIXI.Sprite;

    constructor()
    {
        this.renderTexture = new PIXI.RenderTexture(new PIXI.BaseRenderTexture({width:850, height:400}));
        this.sprite = new PIXI.Sprite(this.renderTexture);

        this.sourceSprite = app.assets.getSprite("beam");
        this.sourceSprite.scale.set(3);
        this.sourceSprite.blendMode = BLEND_MODES.ADD;
        this.sprite.anchor.set(.01, .5);
    }


    render(progress:number):void
    {
        const spriteHalfHeight = this.sourceSprite.height * .5;

        let x=0, n=0;
        const jitter = .1;
        while(x < 660)
        {
            n++;
            this.sourceSprite.scale.set(1.5 + x*3/660);
            this.sourceSprite.x = x - jitter + Math.random() * jitter * 2;
            const amplitude = x * .2 * progress;
            this.sourceSprite.y = 200 + Math.sin(x * .03) * amplitude - spriteHalfHeight - jitter + Math.random() * jitter * 2;

            app.pixi.renderer.render(this.sourceSprite, this.renderTexture, x === 0);

            const yPrime = amplitude * .03 * Math.cos(x * .03);

            const step = 7 / Math.sqrt(1 + yPrime * yPrime);
            x+=step;
        }
        // console.log(n);
    }


    set rotation(value:number)
    {
        this.sprite.rotation = value;
    }

}