import * as PIXI from "pixi.js";
import {app} from "./index";
import E_UpdateStep from "./const/E_UpdateStep";

export enum E_ViewLayer
{
    TERRAIN_UNDER_1,
    TERRAIN_UNDER_2,
    CHARACTERS,
    TERRAIN_OVER_1,
    TERRAIN_OVER_2
}

export default class
{
    private layers:PIXI.Sprite[];
    private mainContainer:PIXI.Sprite;


    constructor()
    {
        this.layers = [];
        this.mainContainer = new PIXI.Sprite();

        for (let layer in E_ViewLayer)
        {
            if (!isNaN(Number(layer)))
            {
                const s = new PIXI.Sprite();
                this.mainContainer.addChild(s);
                this.layers[layer] = s;
            }
        }
    }


    init():void
    {
        app.pixi.stage.addChild(this.mainContainer);
        this.layers.forEach(l => this.mainContainer.addChild(l));
    }


    addChild(layerName:E_ViewLayer, s:PIXI.Sprite):void
    {
        this.layers[layerName].addChild(s);
    }



}