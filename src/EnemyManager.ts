import {app} from "./index";
import Entity from "./entity/Entity";
import PhysicsComp, {E_ColliderType} from "./entity/PhysicsComp";
import AnimSpriteComp from "./entity/AnimSpriteComp";
import E_SpriteState from "./const/E_SpriteState";
import Point from "./geom/Point";
import E_UpdateStep from "./const/E_UpdateStep";
import BaseEnemy from "./entity/BaseEnemy";

export default class EnemyManager
{
    private spawnInterval:number;
    private spawnTimer:number;

    constructor()
    {
        this.spawnInterval = 200;
        this.spawnTimer = this.spawnInterval;
    }


    init():void
    {
         app.game.addUpdateCallback(this.update.bind(this), E_UpdateStep.FINAL);
        // for (let i = 0; i < 100; i++)
        // {
        //     this.createEnemy();
        // }
    }


    update(delta:number):void
    {
        this.spawnTimer += delta;
        if (this.spawnTimer > this.spawnInterval)
        {
            this.createEnemy();
            this.spawnTimer = 0;
        }
    }


    private createEnemy():void
    {
        const pos = new Point(Math.random()*2000, Math.random()*1000);
        // const pos = new Point(1000,500);

        const e = new Entity(
            {
                components:
                    [
                        {
                            compType:PhysicsComp,
                            pos:pos,
                            collider:
                            {
                                type: E_ColliderType.CIRCLE,
                                radius:20,
                                receiveCollisions:true,
                                collisionRatioOut:1,
                                collisionRatioIn:1
                            }
                        },
                        {
                            compType:AnimSpriteComp,
                            animData:
                            [
                                { stateName:E_SpriteState.IDLE, numFrames:4, updateTime:100, texturePrefix:"fly_anim_f", frame:0 },
                                { stateName:E_SpriteState.WALK, numFrames:4, updateTime:100, texturePrefix:"fly_anim_f", frame:0 }
                            ]
                        },
                        {
                            compType:BaseEnemy,
                            health:5
                        }
                    ]
            }
        );


    }
}