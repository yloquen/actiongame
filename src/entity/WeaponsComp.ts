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
import BLEND_MODES = PIXI.BLEND_MODES;


export default class WeaponsComp extends BaseComp
{
    private cooldown:number;
    private aimVector:Point;
    private physics:PhysicsComp;
    private time:number;
    private waveBeamSprite:PIXI.Sprite;
    private waveBeam:PIXI.Sprite;
    private waveBeamRenderTexture:PIXI.RenderTexture;


    init():void
    {
        this.physics = this.entity.getComponent(PhysicsComp)!;
        this.cooldown = 0;
        this.addUpdateCallback(this.update.bind(this), E_UpdateStep.CREATION);

        this.waveBeamRenderTexture = new PIXI.RenderTexture(new PIXI.BaseRenderTexture({width:810, height:400}));
        this.waveBeam = new PIXI.Sprite(this.waveBeamRenderTexture);

        this.waveBeamSprite = app.assets.getSprite("beam");
        this.waveBeamSprite.blendMode = BLEND_MODES.ADD;
        this.waveBeam.anchor.set(.01, .5);

        app.viewManager.addChild(E_ViewLayer.CHARACTERS, this.waveBeam);

        this.time = 0;
    }


    update(delta:number):void
    {
        this.time += delta;

        let x = 0;
        const timeCoef = Math.min(1, this.time/3000);

        this.waveBeam.alpha = .2 + timeCoef * .4;

        const numPoints = 80;
        const amplitudeCoef = 1.5;
        const maxAmplitude = (numPoints-1) * amplitudeCoef;
        const spriteHalfHeight = this.waveBeamSprite.height * .5;
        for (let sIdx = 0; sIdx < numPoints; sIdx++)
        {
            this.waveBeamSprite.scale.set(1.5 + 1.5 * timeCoef);
            this.waveBeamSprite.x = x;
            const theta = x * .033;
            const amplitude = sIdx * amplitudeCoef * timeCoef;
            this.waveBeamSprite.y = 200 + Math.sin(theta) * amplitude - spriteHalfHeight;

            const step = (1.5 - Math.abs(Math.cos(theta))) * 10 + (maxAmplitude-amplitude) * .02;
            x += step;

            app.pixi.renderer.render(this.waveBeamSprite, this.waveBeamRenderTexture, sIdx === 0);
        }

        this.waveBeam.x = this.physics.position.x;
        this.waveBeam.y = this.physics.position.y;

        this.cooldown -= delta;

        if (this.cooldown <= 0 && this.aimVector.length() > 0)
        {
            this.cooldown = 100;
            this.shoot();

            const targetAngle = Math.atan2(this.aimVector.y, this.aimVector.x);

            TweenMax.to(this.waveBeam, .15, {ease:Cubic.easeIn, rotation:targetAngle});
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
                        collisionRatioOut:.25,
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

        this.physics.position.x -= this.aimVector.x * 2.5;
        this.physics.position.y -= this.aimVector.y * 2.5;

        app.sound.playSound("shoot", .4);
    }
}