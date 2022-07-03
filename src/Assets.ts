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


    getTF(text:string, size:number, font:string|undefined=undefined, color:string|undefined=undefined, options:any={}):PIXI.Text
    {
        font = font === undefined ? 'Upheaval' : font;
        color = color === undefined ? '#ffffff' : color;
        size = Math.round(size);

        if (font !== "Upheaval")
        {
            font = "\"" + font + "\", Geneva, Arial, sans-serif";
        }

        const styleVars =
        {
            fontFamily: font,
            fontSize: size,
            fill: color,
            align: options.align ? options.align : 'center',
            ...options
        };


        if (options.lineHeight !== undefined)
        {
            styleVars.lineHeight = Math.round(size * options.lineHeight);
        }

        if (options.wrapWidth !== undefined)
        {
            styleVars.wordWrap = true;
            styleVars.wordWrapWidth = options.wrapWidth;
        }

        const defTextStyle = new PIXI.TextStyle(styleVars);

        return new PIXI.Text(text, defTextStyle);
    }


    createNumber(n:number):PIXI.Sprite
    {
        const container = new PIXI.Sprite();
        const digits = n.toFixed(0).split("");
        digits.forEach(d =>
        {
            const s = app.assets.getSprite("d" + d);
            s.tint = 0xff0000;
            s.scale.set(app.model.scale * .6);
            container.addChild(s);
        });

        return container;
    }



}