import Util from "../util/Util";
import Tile from "./Tile";



export default class Puzzle
{

    public tiles:Tile[][];
    public x:any;
    public y:any;

    constructor(data:any)
    {
        this.tiles = [];

        this.x = data.x;
        this.y = data.y;

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


    onTileUpdate()
    {
        let solved = true;

        for (let x=0; x < this.tiles.length; x++)
        {
            let n = 0;
            for (let y=0; y < this.tiles[x].length; y++)
            {
                const t = this.tiles[x][y];
                n += (t.dotPositions[1] + t.dotPositions[3]);
            }
            solved = solved && n === 1;
        }

        for (let y=0; y < this.tiles[0].length; y++)
        {
            let n = 0;
            for (let x=0; x < this.tiles.length; x++)
            {
                const t = this.tiles[x][y];
                n += (t.dotPositions[0] + t.dotPositions[2]);
            }

            solved = solved && n === 1;
        }

        console.log(solved);
    }


}