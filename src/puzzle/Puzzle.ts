import Util from "../util/Util";
import Tile from "./Tile";



export default class Puzzle
{
    public tiles:Tile[][];

    constructor(data:any)
    {
        this.tiles = [];

        const w = data.width;
        const h = data.height;

        const type = Util.getProp(data, "type");

        this.tiles = [];
        for (let x=0; x < w; x++)
        {
            this.tiles[x] = [];
            for (let y=0; y<h; y++)
            {
                this.tiles[x][y] = new Tile(data.layers, y*w + x, this);
            }
        }

    }


}