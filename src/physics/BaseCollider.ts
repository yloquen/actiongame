import PhysicsComp from "../entity/PhysicsComp";
import Point from "../geom/Point";
import CircleCollider from "./CircleCollider";
import RectCollider from "./RectCollider";
import CollisionResult from "./CollisionResult";

export type BoundsData =
{
    collider:BaseCollider,
    isBeginning:boolean,
    x:number
};

export default class BaseCollider
{

    public type:any;
    public physics:PhysicsComp;

    public collisions:BaseCollider[];
    public ratioOut:number;
    public ratioIn:number;

    public isStatic:boolean;

    protected bounds:[BoundsData, BoundsData];

    protected collisionResult:Point;
    protected numCollisions:number;


    constructor(data:any, physics:PhysicsComp)
    {
        this.type = data.type;
        this.physics = physics;

        this.ratioOut = data.ratioOut;
        this.ratioIn = data.ratioIn;

        this.isStatic = Boolean(data.isStatic);

        this.collisions = [];

        this.bounds =
        [
            {collider:this, isBeginning:true, x:0},
            {collider:this, isBeginning:false, x:0}
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
        this.numCollisions = 0;
        this.collisionResult = new Point(0,0);
    }


    addCollisionResult(moveVec:Point, c:BaseCollider):void
    {
        this.numCollisions += c.physics.mass;

        moveVec.scale(c.ratioOut * this.ratioIn);

        if (this.numCollisions === 1)
        {
            this.collisionResult.copyFrom(moveVec);
        }
        else
        {
            const oldWeight = (this.numCollisions-c.physics.mass) / this.numCollisions;
            const x = this.collisionResult.x * oldWeight + moveVec.x / this.numCollisions;
            const y = this.collisionResult.y * oldWeight + moveVec.y / this.numCollisions;
            this.collisionResult.set(x,y);
        }
    }

    applyCollision()
    {
        if (this.numCollisions > 0)
        {
            this.physics.position.add(this.collisionResult);
            this.resetCollisions();
        }

    }


}