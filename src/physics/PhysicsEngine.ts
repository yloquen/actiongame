import BaseCollider, {BoundsData} from "./BaseCollider";
import Point from "../geom/Point";
import CircleCollider from "./CircleCollider";
import RectCollider from "./RectCollider";
import MathUtil from "../util/MathUtil";
import CollisionResult from "./CollisionResult";

export default class PhysicsEngine
{
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
        this.colliders.splice(this.colliders.indexOf(c), 1);
        const bounds = c.getBounds();
        this.bounds.splice(this.bounds.indexOf(bounds[0]), 1);
        this.bounds.splice(this.bounds.indexOf(bounds[1]), 1);
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

        console.log(">" + this.colliders.length);
        this.colliders.forEach(c =>
        {
            c.updateBounds();
            c.collisions.length = 0;
        });
        this.bounds.sort((e1, e2) => {return e1.coord - e2.coord});

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
                        c1.physics.position.add(collisionResult[0].target);

                        // c2.addCollisionResult(collisionResult[1]);
                        c2.collisions.push(c1);
                        c2.physics.position.add(collisionResult[1].target);
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
        /*
        if (c1.type === CircleCollider && c2.type === CircleCollider)
        {
            return this.testCirclesCollision(c1, c2);
        }
        else
        */
        if (c1.type === CircleCollider && c2.type === RectCollider ||
            c1.type === RectCollider && c2.type === CircleCollider)
        {
            return this.testCircVsRect(c1, c2);
        }
    }


    /*
    testCirclesCollision(col1:BaseCollider, col2:BaseCollider):CollisionResult|undefined
    {
        let c1 = col1 as CircleCollider;
        let c2 = col2 as CircleCollider;

        const deltaX = c1.physics.position.x - c2.physics.position.x;
        const deltaY = c1.physics.position.y - c2.physics.position.y;

        this.collisionResults[0].set(deltaX, deltaY);
        const distance = this.collisionResults[0].length();
        const radiusSum = (c1.radius + c2.radius);
        const penetration = radiusSum - distance;

        if (penetration <= 0)
        {
            return;
        }

        if (distance === 0)
        {
            this.collisionResults[0].x = (Math.random() - .5) * 0.01;
            this.collisionResults[0].y = (Math.random() - .5) * 0.01;
        }

        this.collisionResults[0].normalize();
        this.collisionResults[0].scale(penetration * (c1.radius / radiusSum));
        this.collisionResults[1].copyFrom(this.collisionResults[0]);

        this.collisionResults[1].scale(-1);

        return this.collisionResults;
    }
    */


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

        console.log(xMove + " " + yMove);

        this.collisionResults[0].target.set(0,0);
        this.collisionResults[1].target.set(0,0);

        const circleIndex = c1.type === CircleCollider ? 0 : 1;

        this.collisionResults[circleIndex].target.set(xMove, yMove);

        return this.collisionResults;
    }


}