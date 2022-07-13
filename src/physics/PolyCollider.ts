import PhysicsComp from "../entity/PhysicsComp";
import Point from "../geom/Point";
import BaseCollider, {BoundsData} from "./BaseCollider";

export default class PolyCollider extends BaseCollider
{
    public points:Point[];
    public pointsLocal:Point[];
    public numLines:number;
    public lineVectors:Point[];
    public normals:Point[];


    constructor(data:any, physics:PhysicsComp)
    {
        super(data, physics);

        this.points = [];
        this.pointsLocal = [];
        this.lineVectors = [];
        this.normals = [];

        const numPoints = data.points.length;
        for (let ptIdx = 0; ptIdx < numPoints; ptIdx++)
        {
            const pointData = data.points[ptIdx];
            this.pointsLocal.push(new Point(pointData.x, pointData.y));
            this.points.push(new Point(0,0));
        }

        for (let ptIdx = 0; ptIdx < numPoints; ptIdx++)
        {
            const p1 = this.pointsLocal[ptIdx];
            const p2 = this.pointsLocal[(ptIdx+1) % numPoints];
            const line = new Point(p2.x - p1.x, p2.y - p1.y);
            this.lineVectors.push(line);
            const normal = new Point(line.y, -line.x);
            normal.normalize();
            this.normals.push(normal);
        }

        this.numLines = this.points.length;

        this.updateBounds();
    }


    updateBounds():void
    {
        const pos = this.physics.position;
        this.bounds[0].x = Number.POSITIVE_INFINITY;
        this.bounds[1].x = Number.NEGATIVE_INFINITY;
        this.points.forEach((p,idx) =>
        {
            p.copyFrom(this.pointsLocal[idx]);
            p.add(pos);
            this.bounds[0].x = Math.min(this.bounds[0].x, p.x);
            this.bounds[1].x = Math.max(this.bounds[1].x, p.x);
        });
    }



}