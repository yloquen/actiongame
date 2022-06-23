import Entity from "./Entity";
import {app} from "../index";
import BaseComp from "./BaseComp";
import PhysicsComp from "./PhysicsComp";
import AnimSpriteComp from "./AnimSpriteComp";
import E_UpdateStep from "../const/E_UpdateStep";
import Point from "../geom/Point";

export default class EnemyMover extends BaseComp
{

    private health:any;
    private physics:PhysicsComp;
    private characterPhysics:PhysicsComp;
    private charVector:Point;


    init():void
    {
        this.charVector = new Point(0,0);
        this.characterPhysics = app.game.character.getComponent(PhysicsComp)!;
        this.health = this.data.health;
        this.physics = this.entity.getComponent(PhysicsComp)!;

        this.addUpdateCallback(this.update.bind(this), E_UpdateStep.PRE_MOVEMENT);
    }


    update():void
    {
        this.charVector.copyFrom(this.characterPhysics.position);
        this.charVector.sub(this.physics.position);

        this.charVector.normalize();
        this.charVector.scale(.1);

        this.physics.setVelocity(this.charVector);
    }



}