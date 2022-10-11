import PhysicsComp from "../entity/PhysicsComp";
import Point from "../geom/Point";

export type BoundsData =
{
    collider:CircleCollider,
    isBeginning:boolean,
    x:number
};

export default class CircleCollider
{

    public type:any;
    public physics:PhysicsComp;

    public collisions:CircleCollider[];
    public ratioOut:number;
    public ratioIn:number;

    public isStatic:boolean;
    public hasResponse:boolean;

    public radius:number;
    public mass:number;

    protected position:Point;

    protected bounds:[BoundsData, BoundsData];

    protected collisionResult:Point;
    protected totalMass:number;




    constructor(data:any, physics:PhysicsComp)
    {
        this.type = data.type;
        this.physics = physics;

        this.ratioOut = data.ratioOut;
        this.ratioIn = data.ratioIn;

        this.isStatic = Boolean(data.isStatic);

        this.hasResponse = data.hasResponse === undefined;

        this.collisions = [];

        this.bounds =
        [
            {collider:this, isBeginning:true, x:0},
            {collider:this, isBeginning:false, x:0}
        ];

        this.resetCollisions();

        this.radius = data.radius;
        this.position = physics.position;
        this.mass = data.mass ? data.mass : 1;
    }


    getBounds():[BoundsData, BoundsData]
    {
        return this.bounds;
    }


    updateBounds():void
    {
        this.bounds[0].x= this.position.x - this.radius;
        this.bounds[1].x = this.position.x + this.radius;
    }


    resetCollisions():void
    {
        this.totalMass = 0;
        this.collisionResult = new Point(0,0);
    }


    addCollisionResult(moveVec:Point, c:CircleCollider):void
    {
        const newTotalMass = this.totalMass + c.mass;
        if (this.totalMass === 0)
        {
            this.collisionResult.copyFrom(moveVec);
        }
        else
        {
            const oldWeight = this.totalMass / newTotalMass;
            const newWeight = c.mass / newTotalMass;
            const x = this.collisionResult.x * oldWeight + newWeight * moveVec.x;
            const y = this.collisionResult.y * oldWeight + newWeight * moveVec.y;
            this.collisionResult.set(x,y);
        }
        this.totalMass = newTotalMass;
    }


    applyCollision()
    {
        if (this.totalMass > 0)
        {
            this.physics.position.add(this.collisionResult);
            this.resetCollisions();
        }

    }


}