import Collider, {BoundsData} from "./physics/Collider";
import Util from "./util/Util";

export default class PhysicsEngine
{

    private readonly colliders:Collider[];
    private activeBounds:BoundsData[];
    private bounds:BoundsData[];

    constructor()
    {
        this.colliders = [];
        this.bounds = [];
        this.activeBounds = [];
    }

    addCollider(c:Collider):void
    {
        this.colliders.push(c);
        const bounds = c.getBounds();
        this.bounds.push(bounds[0], bounds[1]);
    }

    removeCollider(c:Collider):void
    {
        this.colliders.splice(this.colliders.indexOf(c), 1);
        const bounds = c.getBounds();
        this.bounds.splice(this.bounds.indexOf(bounds[0]), 1);
        this.bounds.splice(this.bounds.indexOf(bounds[1]), 1);
    }


    checkCollisions2():void
    {
        Util.startBenchmark();
        let numTests = 0;
        let numCollisions = 0;
        for (let c1idx = 0; c1idx < this.colliders.length - 1; c1idx++)
        {
            const c1 = this.colliders[c1idx];
            for (let c2idx = c1idx + 1; c2idx < this.colliders.length ; c2idx++)
            {
                const c2 = this.colliders[c2idx];
                numTests++;
                const collisionResult = c1.test(c2);
                if (collisionResult)
                {

                    c1.physics.position.add(collisionResult[0]);
                    c2.physics.position.add(collisionResult[1]);
                    numCollisions++;
                    //console.log(collisionResult[0]);
                    //console.log(collisionResult[1]);
                }
            }
        }
        Util.endBenchmark();
        console.log(numCollisions + "/" + numTests);
    }


    checkCollisions():void
    {
        //Util.startBenchmark();

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
                this.activeBounds.push(boundsData);
                for (let c2Idx = activeIdx; c2Idx < this.activeBounds.length - 1; c2Idx++)
                {
                    const c2 = this.activeBounds[c2Idx].collider;
                    const collisionResult = c1.test(c2);
                    if (collisionResult)
                    {
                        collisionResult[0].scale(c2.collisionRatioOut * c1.collisionRatioIn);
                        c1.physics.position.add(collisionResult[0]);
                        c1.collisions.push(c2);

                        collisionResult[1].scale(c1.collisionRatioOut * c2.collisionRatioIn);
                        c2.physics.position.add(collisionResult[1]);
                        c2.collisions.push(c1);
                    }
                }
            }
            else
            {
                activeIdx++;
            }
        }

        //Util.endBenchmark();
        //console.log(numCollisions + "/" + numTests);
    }

}