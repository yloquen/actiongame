import PhysicsComp from "../entity/PhysicsComp";
import Point from "../geom/Point";
import BaseCollider, {BoundsData} from "./BaseCollider";

export default class PolyCollider extends BaseCollider
{
    public points:Point[];
    public pointsLocal:Point[];
    public numPoints:number;
    public lineVectors:Point[];
    public orthogonals:Point[];
    public normals:Point[];
    public center:Point;
    public centerLocal:Point;
    public projMinMax:[number, number][];


    constructor(data:any, physics:PhysicsComp)
    {
        super(data, physics);

        this.points = [];
        this.pointsLocal = [];
        this.lineVectors = [];
        this.orthogonals = [];
        this.normals = [];
        this.center = new Point();
        this.centerLocal = new Point();
        this.projMinMax = [];

        const numPoints = data.points.length;
        this.numPoints = numPoints;

        for (let ptIdx = 0; ptIdx < numPoints; ptIdx++)
        {
            this.points.push(new Point(0,0));

            const pointData = data.points[ptIdx];

            const lp = new Point(pointData.x, pointData.y);
            this.pointsLocal.push(lp);

            this.centerLocal.add(lp);
        }

        this.centerLocal.scale(1/numPoints);

        for (let ptIdx = 0; ptIdx < numPoints; ptIdx++)
        {
            const p1 = this.pointsLocal[ptIdx];
            const p2 = this.pointsLocal[(ptIdx+1) % numPoints];
            const line = new Point(p2.x - p1.x, p2.y - p1.y);
            this.lineVectors.push(line);
            const orthogonal = new Point(-line.y, line.x);
            this.orthogonals.push(orthogonal);
            const normal = new Point(line.y, -line.x);
            normal.normalize();
            this.normals.push(normal);
        }

        this.updateBounds();

        this.projMinMax = this.points.map((p, index) =>
        {
            return this.findMinMaxProjection(this, p, this.orthogonals[index]);
        });
    }


    findMinMaxProjection(c:PolyCollider, p:Point, o:Point):[number, number]
    {
        const res:[number, number] = [Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY];

        const pTemp = new Point();

        for (let ptIdx = 0; ptIdx < c.numPoints; ptIdx++)
        {
            pTemp.copyFrom(c.points[ptIdx]).sub(p);
            const r = o.projectionRatio(pTemp);
            res[0] = Math.min(r, res[0]);
            res[1] = Math.max(r, res[1]);
        }

        return res;
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
        this.center.copyFrom(this.centerLocal);
        this.center.add(pos);
    }



}