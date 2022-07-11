import BaseCollider, {BoundsData} from "./BaseCollider";
import Point from "../geom/Point";
import CircleCollider from "./CircleCollider";
import RectCollider from "./RectCollider";
import MathUtil from "../util/MathUtil";
import CollisionResult from "./CollisionResult";
import PolyCollider from "./PolyCollider";
import Util from "../util/Util";
import has = Reflect.has;

export default class PhysicsEngine
{
    public debug:boolean = true;

    private readonly colliders:BaseCollider[];
    private activeBounds:Record<number, BoundsData>;
    private readonly bounds:BoundsData[];
    private readonly collisionResults:[CollisionResult, CollisionResult];
    private readonly tempPts:[Point, Point];


    constructor()
    {
        this.colliders = [];
        this.bounds = [];
        this.activeBounds = {};

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
        this.colliders.forEach(c =>
        {
            //if (!c.isStatic)
            {
                c.updateBounds();
            }
            c.collisions.length = 0;
        });
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
            //if (!c.isStatic)
            {
                c.updateBounds();
            }
            c.collisions.length = 0;
        });

        this.bounds.sort((e1, e2) => {return e1.x - e2.x});

        // this.activeBounds.length = 0;

        let activeIdx = 0;

        //console.log("\n======");
        for (let bIdx = 0; bIdx < this.bounds.length ; bIdx++)
        {
            const boundsData = this.bounds[bIdx];
            const c1 = boundsData.collider;
            const uid = c1.physics.entity.uid;
            if (boundsData.isBeginning)
            {

                c1.resetCollisions();

                const uid = c1.physics.entity.uid;
                this.activeBounds[uid] = boundsData;

                // this.activeBounds.push(boundsData);
                for(let uid in this.activeBounds)
                {
                    const c2 = this.activeBounds[uid].collider;
                    const collisionResult = this.test(c1, c2);
                }
            }
            else
            {
                delete this.activeBounds[uid];
            }
        }

        // this.colliders.forEach(c => c.applyCollision());

        // Util.endBenchmark();
        // console.log(numCollisions + "/" + numTests);
    }


    test(c1:BaseCollider, c2:BaseCollider):void
    {
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
    }


    testCircVsPoly(cc:CircleCollider, pc:PolyCollider):[CollisionResult, CollisionResult]|undefined
    {
        const circCenter = cc.physics.position;
        // this.collisionResults.forEach(cr => cr.targetPos.set(0,0));

        let moveDist = Number.POSITIVE_INFINITY;
        let moveIdx = -1;
        let hasNegative = false;

        for (let ptIdx = 0; ptIdx < pc.numLines; ptIdx++)
        {
            const lineVector = pc.lineVectors[ptIdx];
            const centerVec = this.tempPts[0];

            const centerLen = centerVec.length();

            centerVec.copyFrom(circCenter);
            centerVec.sub(pc.points[ptIdx]);

            const lineLen = lineVector.length();
            const cosAlpha = lineVector.dotProduct(centerVec) / (lineLen * centerLen);
            const outstretch = Math.max(0, Math.abs(.5 - (centerLen/lineLen) * cosAlpha) * 2 - 1.0) * lineLen;

            let pushDecrease = cc.radius;
            if (cc.radius > outstretch)
            {
                pushDecrease = cc.radius - Math.sqrt(cc.radius * cc.radius - outstretch * outstretch);
            }

            const crossProduct = (lineVector.x * centerVec.y - lineVector.y * centerVec.x) / lineLen;
            if (crossProduct < 0 )
            {
                if (!hasNegative)
                {
                    hasNegative = true;
                    moveIdx = -1;
                    moveDist = 0;
                }

                if (-cc.radius < crossProduct)
                {
                    const move = crossProduct + cc.radius - pushDecrease;
                    if (move > moveDist)
                    {
                        moveDist = move;
                        moveIdx = ptIdx;
                    }
                }
            }
            else if (!hasNegative)
            {
                const move = crossProduct + cc.radius;

                if (move > 0 && move < moveDist)
                {
                    moveDist = move;
                    moveIdx = ptIdx;
                }
            }

        }

        if (moveIdx !== -1)
        {
            this.tempPts[0].copyFrom(pc.normals[moveIdx]);
            this.tempPts[0].scale(moveDist);
            cc.addCollisionResult(this.tempPts[0], pc);
            pc.addCollisionResult(this.tempPts[0], cc);
        }

        return ;
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


}