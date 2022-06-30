import * as PIXI from "pixi.js"
import E_SpriteState from "./const/E_SpriteState";
import {app} from "./index";
import {E_ViewLayer} from "./ViewManager";
import E_UpdateStep from "./const/E_UpdateStep";
import {UpdateData} from "./Game";


type SpriteAnimData =
{
    stateName:E_SpriteState,
    texturePrefix:string,
    updateTime:number,
    numFrames:number,
    frame:number,
}

export default class AnimSprite
{
    public sprite:PIXI.Sprite;

    private spriteMap:Record<E_SpriteState, SpriteAnimData>;
    private state:E_SpriteState;
    private updateTime:number = 0;
    private updateData:UpdateData;


    constructor(spriteAnimData:SpriteAnimData[], initialState:E_SpriteState = E_SpriteState.IDLE)
    {
        const map:any = {};
        spriteAnimData.forEach((d:SpriteAnimData) =>
        {
            d.updateTime = d.updateTime ? d.updateTime : 100;
            d.frame = Math.floor(Math.random() * d.numFrames);
            map[d.stateName] = d;
        });
        this.spriteMap = map;
        this.state = initialState;
        this.sprite = new PIXI.Sprite(PIXI.Texture.EMPTY);
        this.setTexture();
        this.sprite.anchor.set(.5);
        this.sprite.scale.set(app.model.scale);

        app.viewManager.addChild(E_ViewLayer.CHARACTERS, this.sprite);

        this.updateData = app.game.addUpdateCallback(this.update.bind(this), E_UpdateStep.FINAL);
    }


    update(delta:number):void
    {
        this.updateTime += delta;
        const animData = this.spriteMap[this.state];

        if (this.updateTime > animData.updateTime)
        {
            this.updateTime %= animData.updateTime;
            animData.frame = ++animData.frame % animData.numFrames;
            this.setTexture();
        }
    }


    setTexture():void
    {
        const animData = this.spriteMap[this.state];
        this.sprite.texture = app.assets.getTexture(animData.texturePrefix + animData.frame);
    }


    setState(newState:E_SpriteState):void
    {
        if (this.state === newState)
        {
            return;
        }

        this.updateTime = 0;
        this.state = newState;
    }


    getState():E_SpriteState
    {
        return this.state;
    }


    destroy():void
    {
        this.sprite.parent.removeChild(this.sprite);
        app.game.removeUpdateCallback(this.updateData);
    }
}