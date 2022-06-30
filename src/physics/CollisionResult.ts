import Point from "../geom/Point";

export default class CollisionResult
{
    public min:Point;
    public max:Point;
    public target:Point;

    constructor()
    {
        this.min = new Point(0, 0);
        this.max = new Point(0, 0);
        this.target = new Point(0, 0);
        this.reset();
    }


    reset()
    {
        this.min.set(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY);
        this.max.set(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY);
        this.target.set(0,0);
    }

}