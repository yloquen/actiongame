import IPointData = PIXI.IPointData;
export default class Point implements IPointData
{
    public x:number;
    public y:number;

    static max(p1:Point, p2:Point):Point
    {
        return p1.length() > p2.length() ? p1 : p2;
    }

    constructor(x:number=0, y:number=0)
    {
        this.x = x;
        this.y = y;
    }

    normalize():Point
    {
        if (Math.abs(this.x) > 0 || Math.abs(this.y) > 0)
        {
            const scaleFactor = 1 / this.length();
            this.x *= scaleFactor;
            this.y *= scaleFactor;
        }
        return this;
    }

    toString():string
    {
        return "x:" + this.x.toFixed(2) + " y:" + this.y.toFixed(2);
    }

    scale(scale:number):Point
    {
        this.x *= scale;
        this.y *= scale;
        return this;
    }

    length():number
    {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    clone():Point
    {
        return new Point(this.x, this.y);
    }

    add(p:Point):Point
    {
        this.x += p.x;
        this.y += p.y;
        return this;
    }

    sub(p:Point):Point
    {
        this.x -= p.x;
        this.y -= p.y;
        return this;
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

    copyFrom(p:Point):Point
    {
        this.x = p.x;
        this.y = p.y;
        return this;
    }

    set(x:number, y:number):Point
    {
        this.x = x;
        this.y = y;
        return this;
    }


    dotProduct(p:Point):number
    {
        return this.x * p.x + this.y * p.y;
    }


    projectionRatio(p:Point)
    {
        return (this.x * p.x + this.y * p.y) / (this.x * this.x + this.y * this.y);
    }


}