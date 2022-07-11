import IPointData = PIXI.IPointData;
export default class Point implements IPointData
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
        if (Math.abs(this.x) > 0 || Math.abs(this.y) > 0)
        {
            const scaleFactor = 1 / this.length();
            this.x *= scaleFactor;
            this.y *= scaleFactor;
        }
    }

    toString():string
    {
        return "x:" + this.x.toFixed(2) + " y:" + this.y.toFixed(2);
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

    clone():Point
    {
        return new Point(this.x, this.y);
    }

    add(p:Point):void
    {
        this.x += p.x;
        this.y += p.y;
    }

    sub(p:Point):void
    {
        this.x -= p.x;
        this.y -= p.y;
    }

    toPolar():void
    {
        const x = this.x;
        const y = this.y;
        this.x = this.length();
        this.y = Math.atan2(y,x);
    }

    toRect():void
    {
        const x = this.x;
        const y = this.y;
        this.x = x * Math.cos(y);
        this.y = x * Math.sin(y);
    }

    copyFrom(p:Point):void
    {
        this.x = p.x;
        this.y = p.y;
    }

    set(x:number, y:number)
    {
        this.x = x;
        this.y = y;
    }


    dotProduct(p:Point):number
    {
        return this.x * p.x + this.y * p.y;
    }



}