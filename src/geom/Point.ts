export default class Point
{

    public x:number;
    public y:number;

    constructor(x:number, y:number)
    {
        this.x = x;
        this.y = y;
    }

    normalize():void
    {
        if (this.x > 0 && this.y > 0)
        {
            const scaleFactor = 1 / this.length();
            this.x *= scaleFactor;
            this.y *= scaleFactor;
        }
    }

    toString():string
    {
        return "x: " + this.x + " y:" + this.y;
    }

    scale(scale:number):void
    {
        this.x *= scale;
        this.y *= scale;
    }

    length():number
    {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
}