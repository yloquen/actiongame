import Point from "../geom/Point";

export default class CollisionResult
{
    public minPos:Point;
    public maxPos:Point;
    public targetPos:Point;

    constructor()
    {
        this.minPos = new Point(0, 0);
        this.maxPos = new Point(0, 0);
        this.targetPos = new Point(0, 0);
        this.reset();
    }


    reset()
    {
        this.minPos.set(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY);
        this.maxPos.set(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY);
        this.targetPos.set(0,0);
    }


}