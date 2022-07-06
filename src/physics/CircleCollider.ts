import PhysicsComp from "../entity/PhysicsComp";
import Point from "../geom/Point";
import BaseCollider, {BoundsData} from "./BaseCollider";

export default class CircleCollider extends BaseCollider
{


    public radius:number;



    constructor(data:any, physics:PhysicsComp)
    {
        super(data, physics);

        this.radius = data.radius;
    }


    updateBounds():void
    {
        const pos = this.physics.position;
        this.bounds[0].x= pos.x - this.radius;
        this.bounds[1].x = pos.x + this.radius;
    }



}