import * as PIXI from "pixi.js";
import Entity from "./Entity";
import BaseComp from "./BaseComp";
import Puzzle from "../puzzle/Puzzle";
import E_UpdateStep from "../const/E_UpdateStep";
import {app} from "../index";
import {E_ViewLayer} from "../ViewManager";
import C_Game from "../const/C_Game";
import Tile from "../puzzle/Tile";
import C_PointerEvt from "../const/C_PointerEvt";
import gsap from "gsap";
import {InteractionEvent} from "pixi.js";
import PhysicsComp from "./PhysicsComp";
import CircleCollider from "../physics/CircleCollider";

export default class PuzzleComp extends BaseComp
{

    private puzzle:Puzzle;
    private puzzleContainer:PIXI.Sprite;
    private tileContainer:PIXI.Sprite;
    private collisions:CircleCollider[];


    constructor(e:Entity, data:any)
    {
        super(e, data);
        this.puzzle = data.puzzle;

        this.puzzleContainer = new PIXI.Sprite();
        this.puzzleContainer.x = (C_Game.TILE_HALF_SIZE + this.puzzle.x * C_Game.TILE_SIZE)  * C_Game.SCALE;
        this.puzzleContainer.y = (C_Game.TILE_HALF_SIZE + this.puzzle.y * C_Game.TILE_SIZE)  * C_Game.SCALE;
        app.viewManager.addChild(E_ViewLayer.TERRAIN_UNDER_2, this.puzzleContainer);

        const tiles = this.puzzle.tiles;
        const offsetX = -Math.floor(tiles.length * .5);
        const offsetY = -Math.floor(tiles[0].length * .5);

        for (let x = 0; x < tiles.length; x++)
        {
            for (let y = 0; y < tiles[x].length; y++)
            {
                const tile = tiles[x][y];

                const tc = new PIXI.Sprite();
                this.tileContainer = tc;
                tc.x = (offsetX + x) * C_Game.TILE_SIZE  * C_Game.SCALE;
                tc.y = (offsetY + y) * C_Game.TILE_SIZE  * C_Game.SCALE;
                this.puzzleContainer.addChild(tc);

                tc.interactive = true;
                tc.addListener(C_PointerEvt.DOWN, (e:InteractionEvent) =>
                {
                    e.stopPropagation();
                    const tc = e.currentTarget;
                    tile.onActivate(tc);
                },
                    this);

                for (let tIdx = 0; tIdx < tile.textureIds.length; tIdx++)
                {
                    const textureId = tile.textureIds[tIdx];

                    if (textureId === 0)
                    {
                        continue;
                    }

                    const s = app.assets.getSprite(app.mapGenerator.textureDictionary[textureId]);
                    s.scale.set(C_Game.SCALE);
                    s.anchor.set(.5);
                    tc.addChild(s);

                    const flags = tile.textureFlags[tIdx];

                    s.rotation = -Tile.ROTATION_FLAGS.indexOf(flags) * Math.PI * .5;
                }
            }
        }
    }


    init():void
    {
        const physics = this.entity.getComponent(PhysicsComp)!;
        debugger;
        // .collider.collisions;
        this.addUpdateCallback(E_UpdateStep.POST_INPUT);
    }


    update(delta:number):void
    {
        if (this.collisions.length > 0)
        {
            console.log(1);
        }
    }


}