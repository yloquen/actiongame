import BaseCollider, {BoundsData} from "./BaseCollider";
import Point from "../geom/Point";
import CircleCollider from "./CircleCollider";
import RectCollider from "./RectCollider";
import MathUtil from "../util/MathUtil";
import CollisionResult from "./CollisionResult";
import PolyCollider from "./PolyCollider";
import Util from "../util/Util";

export default class PhysicsEngine
{
    public debug:boolean = true;

    private readonly colliders:BaseCollider[];
    private activeBounds:BoundsData[];
    private bounds:BoundsData[];
    private collisionResults:[CollisionResult, CollisionResult];
    private tempPts:[Point, Point];


    constructor()
    {
        this.colliders = [];
        this.bounds = [];
        this.activeBounds = [];

        this.collisionResults = [new CollisionResult(), new CollisionResult()];
        this.tempPts = [new Point(0,0), new Point(0,0)];
    }


    addCollider(c:BaseCollider):void
    {
        this.colliders.push(c);
        const bounds = c.getBounds();
        this.bounds.push(bounds[0], bounds[1]);
    }


    removeCollider(c:BaseCollider):void
    {
        const index = this.colliders.indexOf(c);
        if (index !== -1)
        {
            this.colliders.splice(index, 1);
            const bounds = c.getBounds().forEach(b =>
            {
                const bIdx = this.bounds.indexOf(b);
                if (bIdx !== -1)
                {
                    this.bounds.splice(bIdx, 1);
                }
                else
                {
                    throw new Error("Bounds error");
                }
            });
        }
    }


    // each vs each (slow), keep for testing
    checkCollisions2():void
    {
        // Util.startBenchmark();
        let numTests = 0;
        let numCollisions = 0;
        for (let c1idx = 0; c1idx < this.colliders.length - 1; c1idx++)
        {
            const c1 = this.colliders[c1idx];
            for (let c2idx = c1idx + 1; c2idx < this.colliders.length ; c2idx++)
            {
                const c2 = this.colliders[c2idx];
                numTests++;
                const collisionResult = this.test(c1, c2);
                if (collisionResult)
                {
                    // c1.physics.position.add(collisionResult[0]);
                    // c2.physics.position.add(collisionResult[1]);
                    numCollisions++;
                }
            }
        }
        // Util.endBenchmark();
        // console.log(numCollisions + "/" + numTests);
    }


    checkCollisions():void
    {
        // Util.startBenchmark();
        // console.log(">" + this.colliders.length);

        this.colliders.forEach(c =>
        {
            if (!c.isStatic)
            {
                c.updateBounds();
            }
            c.collisions.length = 0;
        });
        this.bounds.sort((e1, e2) => {return e1.x - e2.x});

        this.activeBounds.length = 0;
        let activeIdx = 0;

        for (let bIdx = 0; bIdx < this.bounds.length ; bIdx++)
        {
            const boundsData = this.bounds[bIdx];
            if (boundsData.isBeginning)
            {
                const c1 = boundsData.collider;
                c1.resetCollisions();
                this.activeBounds.push(boundsData);
                for (let c2Idx = activeIdx; c2Idx < this.activeBounds.length - 1; c2Idx++)
                {
                    const c2 = this.activeBounds[c2Idx].collider;
                    const collisionResult = this.test(c1, c2);
                    if (collisionResult)
                    {
                        // c1.addCollisionResult(collisionResult[0]);
                        c1.collisions.push(c2);
                        let v = collisionResult[0].targetPos;
                        v.scale(c1.ratioIn * c2.ratioOut);
                        c1.physics.position.add(v);

                        // c2.addCollisionResult(collisionResult[1]);
                        c2.collisions.push(c1);
                        v = collisionResult[1].targetPos;
                        v.scale(c1.ratioOut * c2.ratioIn);
                        c2.physics.position.add(v);
                    }
                }
            }
            else
            {
                activeIdx++;
            }
        }

        // this.colliders.forEach(c => c.applyCollision());

        // Util.endBenchmark();
        // console.log(numCollisions + "/" + numTests);
    }


    test(c1:BaseCollider, c2:BaseCollider):[CollisionResult, CollisionResult]|undefined
    {
        if (c1.type === CircleCollider && c2.type === CircleCollider)
        {
            return this.testCircVsCirc(c1 as CircleCollider, c2 as CircleCollider);
        }
        else if (c1.type === CircleCollider && c2.type === PolyCollider)
        {
            return this.testCircVsPoly(c1 as CircleCollider, c2 as PolyCollider);
        }
        else if (c1.type === PolyCollider && c2.type === CircleCollider)
        {
            return Util.swap(this.testCircVsPoly(c2 as CircleCollider, c1 as PolyCollider));
        }
    }


    testCircVsPoly(cc:CircleCollider, pc:PolyCollider):[CollisionResult, CollisionResult]|undefined
    {
        const circCenter = cc.physics.position;

        for (let ptIdx = 0; ptIdx < pc.numLines; ptIdx++)
        {
            const p1 = pc.points[ptIdx];
            const p2 = pc.points[(ptIdx+1) % pc.numLines];

            const left = Math.min(p1.x, p2.x);
            const right = Math.max(p1.x, p2.x);

            const bottom = Math.min(p1.y, p2.y);
            const top = Math.max(p1.y, p2.y);

            const deltaX = (p2.x - p1.x);
            const deltaY = (p2.y - p1.y);

            let xCross, yCross;
            if (deltaY === 0)
            {
                xCross = circCenter.x;
                yCross = p1.y;
            }
            else if (deltaX === 0)
            {
                xCross = p1.x;
                yCross = circCenter.y;
            }
            else
            {
                // y = ax + b collider line
                const a = deltaY / deltaX;
                const b = ((p1.y + p2.y) - a * (p1.x + p2.x)) * .5;

                // y = ap.x + bp perpendicular to line through circle center
                const ap = -1/a;
                const bp = circCenter.y
                    + circCenter.x/a;

                // crossing point of line and perpendicular
                xCross = (bp - b) / (a - ap);
                yCross = a * xCross + b;
            }

            this.tempPts[0].set(circCenter.x - xCross, circCenter.y - yCross);
            const perpLen = this.tempPts[0].length();

            this.tempPts[1].set(circCenter.x - p1.x, circCenter.y - p1.y);

            if ((perpLen < cc.radius && (left < xCross && xCross < right) || (bottom < yCross && yCross < top)))
            {
                this.tempPts[0].normalize();
                this.tempPts[0].scale(cc.radius - perpLen);
                this.collisionResults[0].targetPos.copyFrom(this.tempPts[0]);
                return this.collisionResults;
            }
            else if (this.tempPts[1].length() < cc.radius)
            {
                if (pc.numLines === 1)
                {

                }
                else
                {

                }
            }
        }

        return;
    }


    testCircVsCirc(c1:CircleCollider, c2:CircleCollider):[CollisionResult, CollisionResult]|undefined
    {
        const deltaX = c1.physics.position.x - c2.physics.position.x;
        const deltaY = c1.physics.position.y - c2.physics.position.y;

        this.tempPts[0].set(deltaX, deltaY);
        const distance = this.tempPts[0].length();
        const radiusSum = (c1.radius + c2.radius);
        const penetration = radiusSum - distance;

        if (penetration <= 0)
        {
            return;
        }

        if (distance === 0)
        {
            this.tempPts[0].x = (Math.random() - .5) * 0.01;
            this.tempPts[0].y = (Math.random() - .5) * 0.01;
        }

        this.tempPts[0].normalize();
        this.tempPts[0].scale(penetration * (c1.radius / radiusSum));

        this.tempPts[1].copyFrom(this.tempPts[0]);
        this.tempPts[1].scale(-1);

        this.collisionResults[0].targetPos.copyFrom(this.tempPts[0]);
        this.collisionResults[1].targetPos.copyFrom(this.tempPts[1]);

        return this.collisionResults;
    }


    testCircVsRect(c1:BaseCollider, c2:BaseCollider):[CollisionResult, CollisionResult]|undefined
    {
        let c:CircleCollider, r:RectCollider;

        let rectIndex = 1;
        if (c1.type === CircleCollider)
        {
            c = c1 as CircleCollider;
            r = c2 as RectCollider;
        }
        else
        {
            c = c2 as CircleCollider;
            r = c1 as RectCollider;
            let rectIndex = 0;
        }

        const circleCenter = c.physics.position;
        const rectCenter = r.physics.position;

        const left = rectCenter.x - r.halfWidth;
        const right = rectCenter.x + r.halfWidth;

        const top = rectCenter.y + r.halfHeight;
        const bottom = rectCenter.y - r.halfHeight;

        let hQuadrant = circleCenter.x <= left ? 0 : circleCenter.x < right ? 1 : 2;
        let vQuadrant = circleCenter.y <= bottom ? 0 : circleCenter.y < top ? 1 : 2;

        const q = vQuadrant * 3 + hQuadrant;

        let xMove = 0;
        let yMove = 0;

        const xTouchDist = c.radius + r.halfWidth;
        const yTouchDist = c.radius + r.halfHeight;

        if (q === 1 || q === 7)
        {
            const d = circleCenter.y - rectCenter.y;
            if (Math.abs(d) < xTouchDist)
            {
                yMove = MathUtil.sign(d) * yTouchDist - d;
            }
        }
        else if (q === 3 || q === 5)
        {
            const d = circleCenter.x - rectCenter.x;
            if (Math.abs(d) < yTouchDist)
            {
                xMove = MathUtil.sign(d) * yTouchDist - d;
            }
        }
        else if (q !== 4)
        {
            if (q === 0)
            {
                this.tempPts[0].set(left, bottom);
            }
            else if (q === 2)
            {
                this.tempPts[0].set(right, bottom);
            }
            else if (q === 6)
            {
                this.tempPts[0].set(left, top);
            }
            else if (q === 8)
            {
                this.tempPts[0].set(right, top);
            }

            this.tempPts[1].copyFrom(circleCenter);
            this.tempPts[1].sub(this.tempPts[0]);
            const d = this.tempPts[1].length() - c.radius;
            if (d < 0)
            {
                this.tempPts[1].toPolar();
                this.tempPts[1].x = c.radius - this.tempPts[1].x;
                this.tempPts[1].toRect();
                xMove = this.tempPts[1].x;
                yMove = this.tempPts[1].y;
            }
        }

        if (xMove === 0 && yMove === 0)
        {
            return;
        }

        this.collisionResults[0].targetPos.set(0,0);
        this.collisionResults[1].targetPos.set(0,0);

        const circleIndex = c1.type === CircleCollider ? 0 : 1;

        this.collisionResults[circleIndex].targetPos.set(xMove, yMove);

        return this.collisionResults;
    }


}