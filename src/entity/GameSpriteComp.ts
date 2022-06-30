import * as PIXI from "pixi.js"
import {app} from "../index";
import Entity from "./Entity";
import BaseComp from "./BaseComp";
import PhysicsComp from "./PhysicsComp";

export default class GameSpriteComp extends BaseComp
{
    protected sprite:PIXI.Sprite;
    protected physics:PhysicsComp;


    init():void
    {

        this.sprite = app.assets.getSprite(this.data.texId);
        this.sprite.anchor.set(.5);
        this.sprite.scale.set(app.model.scale);
        app.pixi.stage.addChild(this.sprite);

        const p = this.entity.getComponent(PhysicsComp);
        if (p)
        {
            this.physics = p;
        }
        else
        {
            throw new Error("Sprites need physics component.");
        }

        app.pixi.ticker.add(this.update.bind(this));
    }


    update(delta:number):void
    {
        this.sprite.x = this.physics.position.x;
        this.sprite.y = this.physics.position.y;
        this.sprite.scale.x = Math.abs(this.sprite.scale.x) * ((this.physics.velocity.x > 0) ? 1 : -1);
    }





}