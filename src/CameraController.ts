import {app} from "./index";
import E_UpdateStep from "./const/E_UpdateStep";
import {UpdateData} from "./Game";
import PhysicsComp from "./entity/PhysicsComp";
import Point from "./geom/Point";

export default class CameraController
{
    private updateData:UpdateData;
    private charPosition:Point;
    private mainContainer:PIXI.Sprite;

    private centerX:number;
    private centerY:number;
    private targetPos:Point;

    constructor()
    {

    }


    init()
    {
        this.updateData = app.game.addUpdateCallback(this.update.bind(this), E_UpdateStep.POST_INPUT);
        this.charPosition = app.game.character.getComponent(PhysicsComp).position;
        this.mainContainer = app.viewManager.mainContainer;

        window.addEventListener("resize", this.onResize.bind(this));
        this.onResize();
        this.targetPos = new Point(0, 0);
    }


    onResize()
    {
        this.centerX = window.innerWidth *.5;
        this.centerY = window.innerHeight *.5;
    }


    update(delta:number):void
    {
        this.targetPos.x = this.centerX - this.charPosition.x;
        this.targetPos.y = this.centerY - this.charPosition.y;

        const cameraDamp = .05;
        this.mainContainer.x += (this.targetPos.x - this.mainContainer.x) * cameraDamp;
        this.mainContainer.y += (this.targetPos.y - this.mainContainer.y) * cameraDamp;
    }

}