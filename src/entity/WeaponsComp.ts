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
import {Cubic, TweenMax} from "gsap";
import {E_ViewLayer} from "../ViewManager";
import WaveBeam from "../misc/WaveBeam";
import CircleCollider from "../physics/CircleCollider";


export default class WeaponsComp extends BaseComp
{
    private cooldown:number;
    private aimVector:Point;
    private physics:PhysicsComp;
    private chargeTime:number;
    private maxChargeTime:number = 1000;

    private waveBeam:WaveBeam;
    private waveBeamState:boolean;


    init():void
    {
        this.physics = this.entity.getComponent(PhysicsComp)!;
        this.cooldown = 0;
        this.addUpdateCallback(this.update.bind(this), E_UpdateStep.CREATION);

        this.waveBeam = new WaveBeam();
        app.viewManager.addChild(E_ViewLayer.CHARACTERS, this.waveBeam.sprite);
        this.waveBeam.sprite.visible = false;

        this.chargeTime = 0;
    }


    update(delta:number):void
    {
        const aimVecLen = this.aimVector.length();

        this.chargeTime += delta;
        const p = Math.min(1, this.chargeTime/this.maxChargeTime);
        this.waveBeam.render(p);

        this.waveBeam.sprite.x = this.physics.position.x;
        this.waveBeam.sprite.y = this.physics.position.y;

        this.cooldown -= delta;

        if (aimVecLen > 0)
        {
            if (this.waveBeamState)
            {
                const targetAngle = Math.atan2(this.aimVector.y, this.aimVector.x) + Math.PI * 10;
                TweenMax.to(this.waveBeam.sprite, .15, {ease:Cubic.easeIn, rotation:targetAngle});
            }
            else
            {
                if (this.cooldown <= 0)
                {
                    this.cooldown = 100;
                    this.shoot();
                }
            }
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
                        type:CircleCollider,
                        radius:app.model.scale*3,
                        collisionRatioOut:.25,
                        collisionRatioIn:1
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

        this.physics.position.x -= this.aimVector.x * 2.5;
        this.physics.position.y -= this.aimVector.y * 2.5;

        app.sound.playSound("shoot", .4);
    }


    setWaveBeamState(state:boolean):void
    {
        this.waveBeam.sprite.visible = state;
        this.waveBeamState = state;
    }
}