import * as PIXI from "pixi.js";
import {app} from "./index";

export enum E_ViewLayer
{
    CHARACTERS
}

export default class
{
    private layers:PIXI.Sprite[];


    constructor()
    {
        this.layers = [];
        this.layers[E_ViewLayer.CHARACTERS] = new PIXI.Sprite();
    }


    init():void
    {
        this.layers.forEach(l => app.pixi.stage.addChild(l));
    }


    addChild(layerName:E_ViewLayer, s:PIXI.Sprite):void
    {
        this.layers[layerName].addChild(s);
    }



}