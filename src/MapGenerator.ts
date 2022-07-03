import {app} from "./index";
import {E_ViewLayer} from "./ViewManager";
import Entity from "./entity/Entity";
import PhysicsComp, {E_ColliderType} from "./entity/PhysicsComp";
import AnimSpriteComp from "./entity/AnimSpriteComp";
import E_SpriteState from "./const/E_SpriteState";
import CharControlComp from "./entity/CharControlComp";

import RectCollider from "./physics/RectCollider";
import { E_EFlag } from "./entity/Entity";


export default class MapGenerator
{
    public textureDictionary:any[];
    private layers:number[][][];



    init():void
    {
        this.textureDictionary = [];

        const mapData = JSON.parse(app.assets.resources.tilemap2?.data);
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

                    if (tileId !== 0)
                    {
                        const textureId = this.textureDictionary[tileId];
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

                    this.createTileEntities(tileId, xPos, yPos);
                }
            }
        }
    }


    createTileEntities(tileId:number, xPos:number, yPos:number):void
    {
        switch (tileId)
        {
            case 41:
            {
                const e = new Entity({
                    components:
                    [
                        {
                            compType:PhysicsComp,
                            pos:{x:xPos, y:yPos},
                            collider:
                            {
                                type: RectCollider,
                                width:app.model.scale * 18,
                                height:app.model.scale * 18,
                                collisionRatioOut:1,
                                collisionRatioIn:0
                            }
                        }
                    ],
                    flags:[E_EFlag.WALL]
                });

                break;
            }
        }
    }


}