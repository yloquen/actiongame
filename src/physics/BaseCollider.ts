import PhysicsComp from "../entity/PhysicsComp";
import Point from "../geom/Point";
import CircleCollider from "./CircleCollider";
import RectCollider from "./RectCollider";
import CollisionResult from "./CollisionResult";

export type BoundsData =
{
    collider:BaseCollider,
    isBeginning:boolean,
    coord:number
};

export default class BaseCollider
{

    public type:any;
    public physics:PhysicsComp;

    public collisions:BaseCollider[];
    public collisionRatioOut:number;
    public collisionRatioIn:number;

    protected bounds:[BoundsData, BoundsData];

    protected collisionResult:CollisionResult;
    protected numCollisions:number;


    constructor(data:any, physics:PhysicsComp)
    {
        this.type = data.type;
        this.physics = physics;

        this.collisionRatioOut = data.collisionRatioOut;
        this.collisionRatioIn = data.collisionRatioIn;
        this.collisions = [];

        this.bounds =
        [
            {collider:this, isBeginning:true, coord:0},
            {collider:this, isBeginning:false, coord:0}
        ];

        this.resetCollisions();
    }


    getBounds():[BoundsData, BoundsData]
    {
        return this.bounds;
    }


    updateBounds():void
    {

    }


    resetCollisions():void
    {
        // this.numCollisions = 0;
        // this.collisionResult = new Point(0,0);
    }


    addCollisionResult(c:CollisionResult)
    {
        // this.numCollisions++;
        // if (this.numCollisions === 1)
        // {
        //     this.collisionResult.copyFrom(p);
        // }
        // else
        // {
        //     const oldWeight = (this.numCollisions-1)/this.numCollisions;
        //     const x = this.collisionResult.x * oldWeight + p.x / this.numCollisions;
        //     const y = this.collisionResult.y * oldWeight + p.y / this.numCollisions;
        //     this.collisionResult.set(x,y);
        // }
    }

    applyCollision()
    {
        if (this.numCollisions > 0)
        {
            /*
            console.log(this.physics.position.toString() + " " + this.collisionResult.toString());
            this.physics.position.add(this.collisionResult);
            this.resetCollisions();
            */
        }

    }


}