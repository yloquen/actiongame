import PhysicsComp from "../entity/PhysicsComp";
import Point from "../geom/Point";

export default class Collider
{
    public type:any;
    public physics:PhysicsComp;

    private radius:number;

    constructor(data:any, physics:PhysicsComp)
    {
        this.type = data.type;
        this.physics = physics;
        this.radius = data.radius;
    }

/*    test(collider:Collider):boolean
    {
        const deltaX = this.physics.position.x - collider.physics.position.x;
        const deltaY = this.physics.position.y - collider.physics.position.y;
        const v = new Point(deltaX, deltaY);

        v.length()
    }*/

}