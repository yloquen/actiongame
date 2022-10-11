import CircleCollider, {BoundsData} from "./CircleCollider";
import Point from "../geom/Point";
import CollisionResult from "./CollisionResult";
import PolyCollider from "./PolyCollider";
import MathUtil from "../util/MathUtil";


export default class PhysicsEngine
{
    public debug:boolean = false;

    private readonly colliders:CircleCollider[];
    private readonly activeBounds:Record<number, BoundsData>;
    private readonly bounds:BoundsData[];
    private readonly collisionResults:[CollisionResult, CollisionResult];
    private readonly tempPts:Point[];


    constructor()
    {
        this.colliders = [];
        this.bounds = [];
        this.activeBounds = {};

        this.collisionResults = [new CollisionResult(), new CollisionResult()];
        this.tempPts = [new Point(0,0), new Point(0,0), new Point(0,0)];
    }


    addCollider(c:CircleCollider):void
    {
        this.colliders.push(c);
        const bounds = c.getBounds();
        this.bounds.push(bounds[0], bounds[1]);
    }


    removeCollider(c:CircleCollider):void
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
        this.colliders.forEach(c =>
        {
            if (!c.isStatic)
            {
                c.updateBounds();
            }
            c.collisions.length = 0;
        });
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
            }
        }

        this.colliders.forEach(c => c.applyCollision());
    }


    checkCollisions():void
    {
        this.colliders.forEach(c =>
        {
            if (!c.isStatic)
            {
                c.updateBounds();
            }
            c.collisions.length = 0;
        });

        this.bounds.sort((e1, e2) => {return e1.x - e2.x});

        let activeIdx = 0;

        for (let bIdx = 0; bIdx < this.bounds.length ; bIdx++)
        {
            const boundsData = this.bounds[bIdx];
            const c1 = boundsData.collider;
            const uid = c1.physics.entity.uid;
            if (boundsData.isBeginning)
            {
                const uid = c1.physics.entity.uid;
                this.activeBounds[uid] = boundsData;

                for(let uid in this.activeBounds)
                {
                    const c2 = this.activeBounds[uid].collider;
                    if (c1 !== c2)
                    {
                        this.test(c1, c2);
                    }
                }
            }
            else
            {
                delete this.activeBounds[uid];
            }
        }

        this.colliders.forEach(c => c.applyCollision());
    }


    test(c1:CircleCollider, c2:CircleCollider):void
    {
        if (c1.isStatic && c2.isStatic)
        {
            return;
        }

        if (c1.type === CircleCollider && c2.type === CircleCollider)
        {
            this.testCircVsCirc(c1 as CircleCollider, c2 as CircleCollider);
        }
        else if (c1.type === CircleCollider && c2.type === PolyCollider)
        {
            this.testCircVsPoly(c1 as CircleCollider, c2 as PolyCollider);
        }
        else if (c1.type === PolyCollider && c2.type === CircleCollider)
        {
            this.testCircVsPoly(c2 as CircleCollider, c1 as PolyCollider);
        }
        else if (c1.type === PolyCollider && c2.type === PolyCollider)
        {
            this.testPolyVsPoly(c1 as PolyCollider, c2 as PolyCollider);
        }
    }


    testCircVsPoly(cc:CircleCollider, pc:PolyCollider):void
    {
        if (!this.circleBoundsTest(cc, pc))
        {
            return;
        }

        const circCenter = cc.physics.position;

        const moveVec = this.tempPts[2];
        moveVec.set(0,0);
        let minMoveDist = Number.MAX_VALUE;
        const centerVec = this.tempPts[1];


        for (let ptIdx = 0; ptIdx < pc.numPoints; ptIdx++)
        {
            const lineVector = pc.lineVectors[ptIdx];

            centerVec.copyFrom(circCenter);
            centerVec.sub(pc.points[ptIdx]);

            const r = lineVector.projectionRatio(centerVec);
            const lineLen = lineVector.length();
            const crossProduct = (lineVector.x * centerVec.y - lineVector.y * centerVec.x) / lineLen;

            if (r < 0)
            {
                const centerVecLen = centerVec.length();
                if (centerVecLen < cc.radius)
                {
                    centerVec.normalize().scale(cc.radius - centerVecLen);
                    if (centerVecLen < minMoveDist)
                    {
                        minMoveDist = centerVecLen;
                        moveVec.copyFrom(centerVec);
                    }
                }
            }
            else if (r < 1)
            {
                if (Math.abs(crossProduct) < cc.radius)
                {
                    const moveDist = cc.radius + crossProduct;
                    if (moveDist > 0 && moveDist < minMoveDist)
                    {
                        minMoveDist = moveDist;
                        moveVec.copyFrom(pc.normals[ptIdx]).scale(moveDist);
                    }
                }


            }
        }

        this.applyCollisionResult(cc, pc, moveVec);
    }


    testCircVsCirc(c1:CircleCollider, c2:CircleCollider):void
    {
        this.tempPts[0].copyFrom(c1.physics.position).sub(c2.physics.position);
        const distance = this.tempPts[0].length();
        const radiusSum = (c1.radius + c2.radius);

        if (distance < radiusSum)
        {
            if (distance === 0)
            {
                this.tempPts[0].set((Math.random() - .5) * 0.01, (Math.random() - .5) * 0.01);
            }

            this.tempPts[0].normalize();
            this.tempPts[0].scale(radiusSum - distance);
            this.applyCollisionResult(c1, c2, this.tempPts[0]);
        }
    }


    testPolyVsPoly(c1:PolyCollider, c2:PolyCollider):void
    {
        if (!this.circleBoundsTest(c1, c2))
        {
            return;
        }

        let collision = true;

        const minMoveVec:Point = this.tempPts[0];
        minMoveVec.set(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY);
        const currMoveVec:Point = this.tempPts[1];
        let sideIndex = -1;
        let collider:PolyCollider|undefined;

        [[c1,c2],[c2,c1]].forEach((c:PolyCollider[], index:number) =>
        {
            for (let oIdx = 0; oIdx < c[0].points.length; oIdx++)
            {
                const p = c[0].points[oIdx];
                const o = c[0].orthogonals[oIdx];
                const m1 = c[0].findMinMaxProjection(c[1], p, o);
                const m2 = c[0].projMinMax[oIdx];

                const mv1 = m1[1] - m2[0];
                const mv2 = m2[1] - m1[0];

                const relMove = Math.min(mv1, mv2);
                currMoveVec.copyFrom(o).scale(relMove);

                if (relMove < 0)
                {
                    collision = false;
                    break;
                }
                else if (currMoveVec.length() < minMoveVec.length())
                {
                    let sign = relMove === mv1 ? 1 : -1;
                    sign *= (index === 0 ? 1 : -1);
                    sideIndex = oIdx;
                    minMoveVec.copyFrom(currMoveVec).scale(sign);
                    collider = c[0];
                }
            }
        });

        if (collision)
        {
            this.applyCollisionResult(c1, c2, minMoveVec);
        }
    }


    circleBoundsTest(c1:CircleCollider, c2:CircleCollider):boolean
    {
        const centerDist = this.tempPts[0].copyFrom(c1.physics.position).sub(c2.physics.position).length();
        return centerDist < (c1.radius + c2.radius);
    }


    applyCollisionResult(c1:CircleCollider, c2:CircleCollider, moveVec:Point):void
    {
        if (!(c1.hasResponse && c2.hasResponse))
        {
            return;
        }

        this.tempPts[0].copyFrom(moveVec);
        this.tempPts[1].copyFrom(moveVec);

        let r1 = 0, r2 = 0;
        if (c1.isStatic)
        {
            r2 = 1;
        }
        else if (c2.isStatic)
        {
            r1 = 1;
        }
        else
        {
            const totalMass = c1.mass + c2.mass;
            r1 = 1 - c1.mass / totalMass;
            r2 = 1 - c2.mass / totalMass;
        }

        this.tempPts[0].scale(r1);
        c1.addCollisionResult(this.tempPts[0], c2);
        this.tempPts[1].scale(-r2);
        c2.addCollisionResult(this.tempPts[1], c1);
    }



}