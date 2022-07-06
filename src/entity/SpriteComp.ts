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

export default class SpriteComp extends BaseComp
{

    public sprite:PIXI.Sprite;
    private physics:PhysicsComp;


    constructor(e:Entity, data:any)
    {
        super(e, data);

        this.sprite = app.assets.getSprite(data.textureId);
        this.sprite.anchor.set(.5);
        this.sprite.scale.set(app.model.scale);
        app.viewManager.addChild(data.layer, this.sprite);
    }

    init():void
    {
        const p = this.entity.getComponent(PhysicsComp)!;
        this.sprite.x = p.position.x;
        this.sprite.y = p.position.y;
    }


}