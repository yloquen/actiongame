import * as PIXI from "pixi.js";
import BaseComp from "./BaseComp";
import {app} from "../index";
import E_UpdateStep from "../const/E_UpdateStep";
import Point from "../geom/Point";
import Entity from "./Entity";
import PhysicsComp, {E_ColliderType} from "./PhysicsComp";
import AnimSpriteComp from "./AnimSpriteComp";
import E_SpriteState from "../const/E_SpriteState";
import SimpleProjectileComp from "./SimpleProjectileComp";
import CircleCollider from "../physics/CircleCollider";
import CharControlComp from "./CharControlComp";
import GrowingProjectileComp from "./GrowingProjectileComp";


export default class GrowingProjectileWeaponComp extends BaseComp
{
    private aimVector:Point;
    private physics:PhysicsComp;

    private cooldown:number;


    private charController:CharControlComp;


    init():void
    {
        this.physics = this.entity.getComponent(PhysicsComp)!;
        this.charController = this.entity.getComponent(CharControlComp)!;

        this.cooldown = 0;
        this.addUpdateCallback(this.update.bind(this), E_UpdateStep.CREATION);

    }


    update(delta:number):void
    {
        this.cooldown -= delta;

        this.aimVector = this.charController.getAimVector();

        if (this.aimVector.length() > 0 && this.charController.isSkillActive(1) && this.cooldown <= 0)
        {
            this.cooldown = 1000;
            this.shoot();
        }
    }


    private shoot():void
    {
        const velocity = this.aimVector.clone();
        velocity.scale(.2);

        const e = new Entity(
        {
            components:
            [
                {
                    compType:PhysicsComp,
                    pos:this.physics.position,
                    velocity:velocity,
                    collider:
                    {
                        type:CircleCollider,
                        radius:app.model.scale*3,
                        ratioOut:0,
                        ratioIn:0
                    }
                },
                {
                    compType:AnimSpriteComp,
                    alpha:.6,
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
                },
                {
                    compType:GrowingProjectileComp,
                    numHits:1,
                    minDamage:2,
                    deltaDamage:2,
                    maxLifetime:4000
                }
            ]
        });

        //this.physics.position.x -= this.aimVector.x * 1.5;
        //this.physics.position.y -= this.aimVector.y * 1.5;

        app.sound.playSound("shoot", .4);
    }


}