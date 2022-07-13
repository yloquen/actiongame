import {app} from "./index";
import {E_ViewLayer} from "./ViewManager";
import Entity from "./entity/Entity";
import PhysicsComp, {E_ColliderType} from "./entity/PhysicsComp";
import AnimSpriteComp from "./entity/AnimSpriteComp";
import E_SpriteState from "./const/E_SpriteState";
import CharControlComp from "./entity/CharControlComp";

import RectCollider from "./physics/RectCollider";
import { E_EFlag } from "./entity/Entity";
import PolyCollider from "./physics/PolyCollider";
import SpriteComp from "./entity/SpriteComp";


export default class MapGenerator
{
    public textureDictionary:any[];
    private layers:number[][][];



    init():void
    {
        this.textureDictionary = [];

        const mapData = JSON.parse(app.assets.resources.tilemap1?.data);
        const tileSetData = JSON.parse(app.assets.resources.tileset?.data);

        tileSetData.tiles.forEach((tileData:any) =>
        {
            const textureName = /(\w+).png/gm.exec(tileData.image)![1];
            this.textureDictionary[tileData.id+1] = textureName;
        });

        this.layers = [];
        mapData.layers.forEach((layerData:any, index:number) =>
        {
            this.layers[index] = [];
            const w = layerData.width;
            const h = layerData.height;
            for (let x = 0; x < w; x++)
            {
                this.layers[index][x] = [];
                for (let y = 0; y < h; y++)
                {
                    this.layers[index][x][y] = layerData.data[y * w + x];
                }
            }
        });

        this.drawMap();
    }


    drawMap():void
    {
        const layerOrder =
        [
            E_ViewLayer.TERRAIN_UNDER_1,
            E_ViewLayer.TERRAIN_UNDER_2,
            E_ViewLayer.TERRAIN_OVER_1,
            E_ViewLayer.TERRAIN_OVER_2
        ];

        for (let layerIdx = 0; layerIdx < this.layers.length; layerIdx++)
        {
            const layer = this.layers[layerIdx];
            const layerId = layerOrder[layerIdx];
            for (let x = 0; x < layer.length; x++)
            {
                const layerColumn = layer[x];
                for (let y = 0; y < layerColumn.length; y++)
                {
                    const tileId = layerColumn[y];

                    const xPos = (8 + x * 16) * app.model.scale;
                    const yPos = (8 + y * 16) * app.model.scale;

                    this.createTileEntities(tileId, xPos, yPos, layerId);
                }
            }
        }
    }


    createTileEntities(tileId:number, xPos:number, yPos:number, layerId:E_ViewLayer):void
    {
        /*
        if (tileId !== 0)
        {
            if (textureId !== "empty")
            {
                const s = app.assets.getSprite(textureId);
                s.scale.set(app.model.scale);
                s.anchor.set(.5);
                s.x = xPos;
                s.y = yPos;
                app.viewManager.addChild(layerIdx, s);
            }
        }
        */

        const entityData:any =
        {
            components:[],
            flags:[]
        };

        const textureId = this.textureDictionary[tileId];
        if (textureId && textureId !== "empty")
        {
            entityData.components.push({
                compType:SpriteComp,
                textureId:textureId,
                layer:layerId
            });
        }

        switch (tileId)
        {

            case 40:
            {
                const w = app.model.scale * 18;
                const h = app.model.scale * 18;
                const hw = w * .5;
                const hh = h * .5;
                entityData.components.push({
                    compType:PhysicsComp,
                    pos:{x:xPos, y:yPos},
                    collider:
                    {
                        type: PolyCollider,
                        isStatic: true,
                        points:[
                            // {x:xPos - hw, y:yPos - hh},
                            // {x:xPos + hw, y:yPos - hh},
                            // {x:xPos + hw, y:yPos + hh},
                            // {x:xPos - hw, y:yPos + hh}
                            {x:0, y:-100},
                            {x:100, y:0},
                            {x:0, y:100},
                            {x:-100, y:0}
                            // {x:-100, y:0}
                            //{x:xPos - hw, y:yPos - hh}
                        ],
                        // type: RectCollider,
                        // width:app.model.scale * 18,
                        // height:app.model.scale * 18,
                        ratioOut:1,
                        ratioIn:0,
                        mass:1000,
                    }
                });

                entityData.flags.push(E_EFlag.WALL);

                break;
            }

            default:
            {
                entityData.components.push({
                    compType:PhysicsComp,
                    pos:{x:xPos, y:yPos}});

                break;
            }
        }

        const e = new Entity(entityData);

    }


}