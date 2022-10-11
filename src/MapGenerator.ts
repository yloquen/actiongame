import {app} from "./index";
import {E_ViewLayer} from "./ViewManager";
import Entity, {E_EFlag} from "./entity/Entity";
import PhysicsComp from "./entity/PhysicsComp";
import PolyCollider from "./physics/PolyCollider";
import SpriteComp from "./entity/SpriteComp";
import CircleCollider from "./physics/CircleCollider";
import C_LayerObjType from "./const/C_LayerObjType";
import Util from "./util/Util";
import Puzzle from "./puzzle/Puzzle";
import C_Game from "./const/C_Game";
import AnimSpriteComp from "./entity/AnimSpriteComp";
import E_SpriteState from "./const/E_SpriteState";
import CharControlComp from "./entity/CharControlComp";
import MouseControlComp from "./entity/MouseControlComp";
import ShooterComp from "./entity/ShooterComp";
import BeamComp from "./entity/BeamComp";
import GrowingProjectileWeaponComp from "./entity/GrowingProjectileWeaponComp";
import PuzzleGroup from "./puzzle/PuzzleGroup";
import PuzzleComp from "./entity/PuzzleComp";


export default class MapGenerator
{
    public textureDictionary:any[];

    private layers:number[][][];

    private readonly puzzleGroups:PuzzleGroup[];


    constructor()
    {
        this.puzzleGroups = [];
    }


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

            if (layerData.properties)
            {
                // Parse layer props
                // const props = JSON.parse(layerData.properties[0].value);
            }

            if (layerData.objects)
            {

                for (let objIdx=0; objIdx<layerData.objects.length; objIdx++)
                {
                    const object = layerData.objects[objIdx];
                    // Util.coordToGrid(object);

                    switch (object.type)
                    {

                        case C_LayerObjType.PUZZLE:
                        {
                            const groupId = Util.getProp(object, "group_id");
                            const id = Util.getProp(object, "id");
                            const x = Util.getProp(object, "x");
                            const y = Util.getProp(object, "y");

                            if (!this.puzzleGroups[groupId])
                            {
                                this.puzzleGroups[groupId] = new PuzzleGroup();
                            }

                            const name = `puzzle_${groupId}_${id}`;
                            const data = JSON.parse(app.assets.resources[name].data);
                            data.x = x;
                            data.y = y;

                            const puzzleGroup = this.puzzleGroups[groupId];
                            puzzleGroup.puzzles[id] = new Puzzle(data);

                            break;
                        }
                    }
                }
            }
        }, this);

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

                    const xPos = (C_Game.TILE_HALF_SIZE + x * C_Game.TILE_SIZE) * C_Game.SCALE;
                    const yPos = (C_Game.TILE_HALF_SIZE + y * C_Game.TILE_SIZE) * C_Game.SCALE;

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
                s.scale.set(C_Game.SCALE);
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

        const w = C_Game.SCALE * 18;
        const h = C_Game.SCALE * 18;
        const hw = w * .5;
        const hh = h * .5;

        switch (tileId)
        {

            case 40:
            {
                entityData.components.push({
                    compType:PhysicsComp,
                    pos:{x:xPos, y:yPos},
                    collider:
                    {
                        type: PolyCollider,
                        // isStatic: true,
                        points:[
                            {x: -hw, y: -hh},
                            {x: hw, y: -hh},
                            {x: hw, y: hh},
                            {x: -hw, y: hh}
                            // {x:0, y:-120},
                            // {x:90, y:0},
                            // {x:0, y:80},
                            // {x:-70, y:0},
                            // {x:-50, y:-80}
                        ],
                        ratioOut:1,
                        ratioIn:0,
                        mass:1//Number.MAX_VALUE
                    }
                });

                entityData.flags.push(E_EFlag.WALL);

                break;
            }

            case 44:
            {
                for (let pgIdx = 0; pgIdx < this.puzzleGroups.length; pgIdx++)
                {
                    const puzzleGroup = this.puzzleGroups[pgIdx];
                    for (let pIdx = 0; pIdx < puzzleGroup.puzzles.length; pIdx++)
                    {
                        const p = puzzleGroup.puzzles[pgIdx];
                        if (p.x === xPos && p.y === yPos)
                        {
                            entityData.components.push({compType:PuzzleComp, puzzle:p});
                        }
                    }
                }

                entityData.components.push({
                    compType:PhysicsComp,
                    pos:{x:xPos, y:yPos},
                    collider:
                        {
                            type: PolyCollider,
                            points:[
                                {x: -hw, y: -hh},
                                {x: hw, y: -hh},
                                {x: hw, y: hh},
                                {x: -hw, y: hh}
                            ],
                            ratioOut:0,
                            ratioIn:0,
                            hasResponse:false,
                            mass:1//Number.MAX_VALUE
                        }
                });

                break;
            }

            case 47:
            {
                // const pc = app.game.character.getComponent(PhysicsComp)!;
                // pc.position.set(xPos, yPos);
                entityData.components.length = 0;
                entityData.components.push(
                    {
                        compType:PhysicsComp,
                        pos:{x:xPos, y:yPos},
                        collider:
                            {
                                type: CircleCollider,
                                radius:C_Game.SCALE*5,
                                ratioOut:1,
                                ratioIn:1
                            }
                    },
                    {
                        compType:AnimSpriteComp,
                        animData:
                            [
                                {
                                    stateName:E_SpriteState.IDLE,
                                    numFrames:6,
                                    updateTime:100,
                                    texturePrefix:"knight_idle_anim_f",
                                    frame:0
                                },
                                {
                                    stateName:E_SpriteState.WALK,
                                    numFrames:6,
                                    updateTime:100,
                                    texturePrefix:"knight_run_anim_f",
                                    frame:0
                                }
                            ]
                    },
                    {
                        compType:CharControlComp
                    },
                    {
                        compType:MouseControlComp
                    },
                    {
                        compType:ShooterComp
                    },
                    {
                        compType:BeamComp
                    },
                    {
                        compType:GrowingProjectileWeaponComp
                    });

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

        if (tileId === 47)
        {
            app.game.character = e;
        }

    }


}