import * as PIXI from "pixi.js";
import BaseComp from "./BaseComp";
import {app} from "../index";
import E_UpdateStep from "../const/E_UpdateStep";
import Point from "../geom/Point";
import Entity from "./Entity";
import PhysicsComp from "./PhysicsComp";
import AnimSpriteComp from "./AnimSpriteComp";
import E_SpriteState from "../const/E_SpriteState";
import SimpleProjectileComp from "./SimpleProjectileComp";
import CircleCollider from "../physics/CircleCollider";
import CharControlComp from "./CharControlComp";
import C_Game from "../const/C_Game";


export default class ShooterComp extends BaseComp
{
    private aimVector:Point;
    private physics:PhysicsComp;

    private cooldown:number;
    private chargeTime:number;

    private charController:CharControlComp;


    init():void
    {
        this.physics = this.entity.getComponent(PhysicsComp)!;
        this.charController = this.entity.getComponent(CharControlComp)!;

        this.cooldown = 0;
        this.addUpdateCallback(E_UpdateStep.CREATION);

        this.chargeTime = 0;
    }


    update(delta:number):void
    {
        this.cooldown -= delta;

        this.aimVector = this.charController.getAimVector();

        if (this.aimVector.length() > 0 && this.charController.isSkillActive(3) && this.cooldown <= 0)
        {
            this.cooldown = 100;
            this.shoot();
        }
    }


    private shoot():void
    {
        const e = new Entity(
        {
            components:
            [
                {
                    compType:PhysicsComp,
                    pos:this.physics.position,
                    velocity:this.aimVector,
                    collider:
                    {
                        type:CircleCollider,
                        radius:C_Game.SCALE*3,
                        ratioOut:.25,
                        ratioIn:1
                    }
                },
                {
                    compType:AnimSpriteComp,
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
                    compType:SimpleProjectileComp,
                    numHits:1,
                    minDamage:5,
                    deltaDamage:20,
                    maxLifetime:3000
                }
            ]
        });

        //this.physics.position.x -= this.aimVector.x * 1.5;
        //this.physics.position.y -= this.aimVector.y * 1.5;

        app.sound.playSound("shoot", .4);
    }


}