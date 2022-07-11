import PhysicsComp from "../entity/PhysicsComp";
import Point from "../geom/Point";
import BaseCollider, {BoundsData} from "./BaseCollider";

export default class CircleCollider extends BaseCollider
{


    public radius:number;
    private position:Point;



    constructor(data:any, physics:PhysicsComp)
    {
        super(data, physics);
        this.radius = data.radius;
        this.position = physics.position;
    }


    updateBounds():void
    {
        this.bounds[0].x= this.position.x - this.radius;
        this.bounds[1].x = this.position.x + this.radius;
    }



}