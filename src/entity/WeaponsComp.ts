import BaseComp from "./BaseComp";
import {app} from "../index";
import E_UpdateStep from "../const/E_UpdateStep";
import Point from "../geom/Point";
import Entity from "./Entity";
import PhysicsComp, {E_ColliderType} from "./PhysicsComp";
import AnimSpriteComp from "./AnimSpriteComp";
import E_SpriteState from "../const/E_SpriteState";
import KeyboardController from "./KeyboardController";
import GamepadController from "./GamepadController";
import SimpleProjectileComp from "./SimpleProjectileComp";




export default class WeaponsComp extends BaseComp
{
    private cooldown:number;
    private aimVector:Point;
    private physics:PhysicsComp;


    init():void
    {
        this.physics = this.entity.getComponent(PhysicsComp)!;
        this.cooldown = 0;
        app.game.addUpdateCallback(this.update.bind(this), E_UpdateStep.INPUT);
    }


    update(delta:number):void
    {
        this.cooldown -= delta;
        if (this.cooldown <= 0 && this.aimVector.length() > 0)
        {
            this.cooldown = 100;
            this.shoot();
        }
    }


    setAimVector(aimVector:Point):void
    {
        this.aimVector = aimVector;
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
                        type: E_ColliderType.CIRCLE,
                        radius:15,
                        collisionRatioOut:1,
                        collisionRatioIn:0
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
                    minDamage:1,
                    deltaDamage:7
                }
            ]
        });

        app.sound.playSound("shoot", .3);
    }
}