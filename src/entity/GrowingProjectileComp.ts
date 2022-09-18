import BaseComp from "./BaseComp";
import E_UpdateStep from "../const/E_UpdateStep";
import {app} from "../index";
import PhysicsComp from "./PhysicsComp";
import BaseEnemyComp from "./BaseEnemyComp";
import AnimSpriteComp from "./AnimSpriteComp";
import {TweenMax} from "gsap";
import {E_EFlag} from "./Entity";
import CircleCollider from "../physics/CircleCollider";
import * as PIXI from "pixi.js";
import BLEND_MODES = PIXI.BLEND_MODES;
import C_Game from "../const/C_Game";

export default class GrowingProjectileComp extends BaseComp
{
    private numHits:number;
    private physics:PhysicsComp;
    private minDamage:number;
    private deltaDamage:number;
    private lifetime:number = 0;
    private maxLifetime:number;
    private anim:AnimSpriteComp;
    private collider:CircleCollider;
    private cooldown:number;




    init():void
    {
        this.physics = this.entity.getComponent(PhysicsComp)!;
        this.collider = this.physics.collider as CircleCollider;
        this.anim = this.entity.getComponent(AnimSpriteComp)!;
        this.numHits = Number.POSITIVE_INFINITY;
        this.minDamage = this.data.minDamage;
        this.deltaDamage = this.data.deltaDamage;
        this.maxLifetime = this.data.maxLifetime || Number.POSITIVE_INFINITY;
        this.cooldown = 0;
        this.anim.anim.sprite.blendMode = BLEND_MODES.ADD;

        this.updateCallback = app.game.addUpdateCallback(this.update.bind(this), E_UpdateStep.COLLISION_HANDLING);
    }


    update(delta:number):void
    {
        this.lifetime += delta;
        this.cooldown -= delta;

        const scale = 1 + this.lifetime/200;

        this.anim.anim.sprite.scale.set(C_Game.SCALE * scale);
        this.collider.radius = C_Game.SCALE * 3 * scale;

        const collisions = this.physics.collider.collisions;
        if (this.cooldown <= 0)
        {
            this.cooldown = 200;
            const v = this.physics.velocity.clone();
            v.scale(10);
            while (collisions.length > 0 && this.numHits > 0)
            {
                const collision = collisions.pop()!;
                const e = collision.physics.entity;

                const enemyComp = e.getComponent(BaseEnemyComp);
                if (enemyComp)
                {
                    this.numHits--;
                    collision.physics.position.sub(v);
                    const damage = this.minDamage + Math.floor(Math.random() * (this.deltaDamage + 1));
                    enemyComp.applyDamage(damage);
                }
                else if (e.hasFlag(E_EFlag.WALL))
                {
                    this.numHits = 0;
                }
            }
        }


        if (this.numHits === 0)
        {
            app.game.removeUpdateCallback(this.updateCallback);
            this.physics.velocity.set(0,0);
            this.physics.collider.ratioIn = 0;

            const animComp = this.entity.getComponent(AnimSpriteComp)!;
            if (animComp)
            {
                TweenMax.to(animComp.anim.sprite, .1, {alpha:0, onComplete:() =>
                    {
                        this.destroyEntity();
                    }})
            }
            else
            {
                this.destroyEntity();
            }

        }

        if (this.lifetime > this.maxLifetime)
        {
            this.numHits = 0;
        }
    }





}