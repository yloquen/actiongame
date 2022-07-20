import Point from "./geom/Point";

export default class Pool
{
    private points:Point[];

    constructor()
    {

    }

    init()
    {
        this.points = [];
    }



    getPoint():Point
    {
        if (this.points.length > 0)
        {
            return this.points.pop()!;
        }
        else
        {
            return new Point(0,0);
        }
    }


    releasePoint(p:Point):void
    {
        this.points.push(p);
    }


}