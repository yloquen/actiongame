import * as PIXI from "pixi.js"
import E_SpriteState from "./const/E_SpriteState";
import {app} from "./index";
import {E_ViewLayer} from "./ViewManager";
import E_UpdateStep from "./const/E_UpdateStep";


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


    constructor(spriteAnimData:SpriteAnimData[], initialState:E_SpriteState = E_SpriteState.IDLE)
    {
        const map:any = {};
        spriteAnimData.forEach((d:SpriteAnimData) =>
        {
            d.updateTime = d.updateTime ? d.updateTime : 100;
            map[d.stateName] = d;
        });
        this.spriteMap = map;
        this.state = initialState;
        this.sprite = new PIXI.Sprite(PIXI.Texture.EMPTY);
        this.sprite.anchor.set(.5);
        this.sprite.scale.set(5);

        app.viewManager.addChild(E_ViewLayer.CHARACTERS, this.sprite);

        app.game.addUpdateCallback(this.update.bind(this), E_UpdateStep.FINAL);
    }


    update(delta:number):void
    {
        this.updateTime += delta;
        const animData = this.spriteMap[this.state];

        if (this.updateTime > animData.updateTime)
        {
            this.updateTime %= animData.updateTime;
            animData.frame = ++animData.frame % animData.numFrames;
            this.sprite.texture = app.assets.getTexture(animData.texturePrefix + animData.frame);
        }
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
}