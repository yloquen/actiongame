import PhysicsComp from "../entity/PhysicsComp";
import Point from "../geom/Point";
import BaseCollider, {BoundsData} from "./BaseCollider";

export default class PolyCollider extends BaseCollider
{
    public points:Point[];
    public numLines:number;



    constructor(data:any, physics:PhysicsComp)
    {
        super(data, physics);

        this.points = data.points.map((p:any) => new Point(p.x, p.y));

        this.numLines = this.points.length;// === 2 ? 1 : this.points.length;

        this.updateBounds();
    }


    updateBounds():void
    {
        const pos = this.physics.position;
        this.bounds[0].x = Number.POSITIVE_INFINITY;
        this.bounds[1].x = Number.NEGATIVE_INFINITY;
        this.points.forEach(p =>
        {
            this.bounds[0].x = Math.min(this.bounds[0].x, p.x);
            this.bounds[1].x = Math.max(this.bounds[1].x, p.x);
        });
    }



}