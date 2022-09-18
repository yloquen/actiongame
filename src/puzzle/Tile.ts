import Puzzle from "./Puzzle";

export default class Tile
{
    public static ROTATION_FLAGS = [0,6,-4,-6];

    public readonly textureIds:number[];
    public readonly textureFlags:any[];

    private dotPositions:number[];
    private puzzle:Puzzle;


    constructor(layers:any[], index:number, puzzle:Puzzle)
    {
        this.puzzle = puzzle;
        this.dotPositions = [0,0,0,0];
        this.textureIds = [];
        this.textureFlags = [];

        for (let layerIdx = 0; layerIdx < layers.length; layerIdx++)
        {
            const layerArray = layers[layerIdx].data;
            const tileData = layerArray[index];

            const tileElementId = 0x0fffffff & tileData;
            this.textureIds.push(tileElementId);

            const tileFlags = (tileData & 0xf0000000) >> 28;
            this.textureFlags.push(tileFlags);

            switch (tileElementId)
            {
                case 46:
                {
                    this.dotPositions[Tile.ROTATION_FLAGS.indexOf(tileFlags)] = 1;

                    break;
                }
            }
        }
    }


    onActivate()
    {
        const temp = this.dotPositions[0];
        const n = this.dotPositions.length;
        for (let dotIdx = 0; dotIdx <= n; dotIdx++)
        {
            this.dotPositions[dotIdx] = this.dotPositions[(dotIdx+1)%n];
        }
        this.dotPositions[n-1] = temp;
        console.log(this.dotPositions);
    }



}