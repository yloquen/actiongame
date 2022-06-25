import * as PIXI from "pixi.js";
import {app} from "./index";

export default class
{
    public resources:PIXI.IResourceDictionary;


    init():void
    {
        this.resources = app.pixi.loader.resources;
        const a = this.resources["main_atlas"];
        a.spritesheet!.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
    }


    getTexture(textureId:string):PIXI.Texture
    {
        let texture;
        for (let atlasName in this.resources)
        {
            let atlas = this.resources[atlasName];
            if (atlas.textures)
            {
                texture = atlas.textures[textureId];
                if (texture !== undefined)
                {
                    break;
                }
            }
        }

        if (texture === undefined)
        {
            console.log("Could not find texture : " + textureId);
            texture = PIXI.Texture.EMPTY;
        }

        return texture;
    }


    getSingleTexture(texureId:string):PIXI.Texture
    {
        return this.resources[texureId].texture;
    }


    getSprite(texId:string):PIXI.Sprite
    {
        const t = this.getTexture(texId);
        return new PIXI.Sprite(t);
    }



}