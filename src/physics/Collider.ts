import PhysicsComp from "../entity/PhysicsComp";
import Point from "../geom/Point";

export type BoundsData =
    {
        collider:Collider,
        isBeginning:boolean,
        coord:number
    };

export default class Collider
{


    public type:any;
    public physics:PhysicsComp;
    public radius:number;
    public collisionRatioOut:number;
    public collisionRatioIn:number;

    private bounds:[BoundsData, BoundsData];
    collisions:Collider[];


    constructor(data:any, physics:PhysicsComp)
    {
        this.type = data.type;
        this.physics = physics;
        this.radius = data.radius;
        this.collisionRatioOut = data.collisionRatioOut;
        this.collisionRatioIn = data.collisionRatioIn;
        this.collisions = [];

        this.bounds =
        [
            {collider:this, isBeginning:true, coord:0},
            {collider:this, isBeginning:false, coord:0}
        ];
    }

    test(collider:Collider):[Point, Point]|undefined
    {
        const deltaX = this.physics.position.x - collider.physics.position.x;
        const deltaY = this.physics.position.y - collider.physics.position.y;

        const v1 = new Point(deltaX, deltaY);
        const distance = v1.length();
        const radiusSum = (this.radius + collider.radius);
        const penetration = radiusSum - distance;

        if (penetration <= 0)
        {
            return
        }

        if (distance === 0)
        {
            v1.x = (Math.random() - .5) * 0.01;
            v1.y = (Math.random() - .5) * 0.01;
        }

        v1.normalize();
        const v2 = v1.clone();

        const knockbackAmplifyCoef = .95;

        v1.scale(knockbackAmplifyCoef * penetration * (this.radius / radiusSum));
        v2.scale(knockbackAmplifyCoef * -penetration * (collider.radius / radiusSum));

        return [v1, v2];
    }


    getBounds():[BoundsData, BoundsData]
    {
        return this.bounds;
    }

    updateBounds():void
    {
        const pos = this.physics.position;
        this.bounds[0].coord= pos.x - this.radius;
        this.bounds[1].coord = pos.x + this.radius;
    }



}