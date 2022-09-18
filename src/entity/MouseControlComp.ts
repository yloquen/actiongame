import * as PIXI from "pixi.js";
import BaseComp from "./BaseComp";
import {app} from "../index";
import E_UpdateStep from "../const/E_UpdateStep";
import PhysicsComp from "./PhysicsComp";
import C_PointerEvt from "../const/C_PointerEvt";
import InteractionEvent = PIXI.InteractionEvent;
import Point from "../geom/Point";



export default class MouseControlComp extends BaseComp
{
    private physics:PhysicsComp;
    private tempPt:PIXI.Point;
    private targetPos:Point;
    private tempPt2:Point;
    private MAX_VELOCITY:number = 5;


    init():void
    {
        this.addUpdateCallback(E_UpdateStep.POST_INPUT);
        this.physics = this.entity.getComponent(PhysicsComp)!;
        this.tempPt = new PIXI.Point();
        this.targetPos = new Point();
        this.tempPt2 = new Point();
        app.pixi.stage.addListener(C_PointerEvt.DOWN, this.handlePointerDown.bind(this));
        app.pixi.stage.addListener(C_PointerEvt.UP, this.handlePointerUp.bind(this));
        app.pixi.stage.addListener(C_PointerEvt.UPOUTSIDE, this.handlePointerUp.bind(this));
    }


    handlePointerDown(e:InteractionEvent):void
    {
        app.pixi.stage.addListener(C_PointerEvt.MOVE, this.handlePointerMove, this);
        this.handlePointerMove(e);
    }


    handlePointerMove(e:InteractionEvent):void
    {
        app.viewManager.mainContainer.toLocal(e.data.global, undefined, this.tempPt);
        this.targetPos.set(this.tempPt.x, this.tempPt.y);
    }


    handlePointerUp(e:InteractionEvent):void
    {
        app.pixi.stage.removeListener(C_PointerEvt.MOVE, this.handlePointerMove, this);
    }


    update(delta:number):void
    {
        this.tempPt2.copyFrom(this.targetPos).sub(this.physics.position);
        const distance = this.tempPt2.length();
        this.tempPt2.normalize();
        this.tempPt2.scale(Math.min(this.MAX_VELOCITY, distance)/delta);
        this.physics.setVelocity(this.tempPt2);
    }


}