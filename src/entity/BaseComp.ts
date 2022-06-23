import Entity from "./Entity";
import {app} from "../index";
import E_UpdateStep from "../const/E_UpdateStep";
import {UpdateData} from "../Game";

export default class
{
    entity:Entity;
    protected data:any;
    protected updateCallback:UpdateData;
    protected updateCallbacks:UpdateData[];


    constructor(e:Entity, data:any)
    {
        this.entity = e;
        this.data = data;
        this.updateCallbacks = [];
    }


    init():void
    {

    }


    addUpdateCallback(callback:Function, updateStep:E_UpdateStep):void
    {
        this.updateCallbacks.push(app.game.addUpdateCallback(callback, updateStep));
    }


    update(delta:number):void
    {

    }


    destroyEntity():void
    {
        this.entity.destroy();
    }


    destroy():void
    {
        for (let updateIdx = 0; updateIdx < this.updateCallbacks.length; updateIdx++)
        {
            app.game.removeUpdateCallback(this.updateCallbacks[updateIdx]);

        }
    }


}