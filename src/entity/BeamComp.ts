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
import CharControlComp from "./CharControlComp";
import {Howl} from "howler";


export default class BeamComp extends BaseComp
{
    private aimVector:Point;
    private physics:PhysicsComp;

    private cooldown:number;
    private chargeTime:number;

    private waveBeamChargeTime:number = 1000;
    private waveBeam:WaveBeam;
    private waveBeamState:boolean;
    private charController:CharControlComp;
    private sound:Howl;


    init():void
    {
        this.physics = this.entity.getComponent(PhysicsComp)!;
        this.charController = this.entity.getComponent(CharControlComp)!;
        this.cooldown = 0;
        this.chargeTime = 0;
        this.addUpdateCallback(this.update.bind(this), E_UpdateStep.CREATION);

        this.waveBeam = new WaveBeam();
        app.viewManager.addChild(E_ViewLayer.CHARACTERS_2, this.waveBeam.sprite);
    }


    update(delta:number):void
    {
        this.aimVector = this.charController.getAimVector();
        this.cooldown -= delta;

        if (this.aimVector.length() > 0 && this.charController.isSkillActive(4))
        {
            if (!this.waveBeam.sprite.visible)
            {
                this.waveBeam.sprite.visible = true;
                this.sound = app.sound.playLoopedSound('beam', .5, 1.6);
            }

            this.chargeTime += delta;
            const progress = Math.min(1, this.chargeTime / this.waveBeamChargeTime);
            this.waveBeam.render(progress);

            this.waveBeam.sprite.position.copyFrom(this.physics.position);

            if (this.cooldown <= 0)
            {
                this.cooldown = 100;
                this.waveBeam.render(progress, true);
            }
            else
            {
                this.waveBeam.render(progress);
            }

            let targetAngle = Math.atan2(this.aimVector.y, this.aimVector.x);
            this.waveBeam.rotation = targetAngle;

            // if (targetAngle < 0)
            // {
            //     targetAngle+= Math.PI * 2;
            // }
            // TweenMax.to(this.waveBeam, .05, {ease:Cubic.easeIn, rotation:targetAngle});

        }
        else
        {
            this.sound?.stop();
            this.sound?.off('end');
            this.waveBeam.sprite.visible = false;
            this.chargeTime = 0;
        }
    }


    setWaveBeamState(state:boolean):void
    {
        this.chargeTime = 0;
        this.waveBeam.sprite.visible = state;
        this.waveBeamState = state;
    }


}