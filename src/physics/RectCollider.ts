import PhysicsComp from "../entity/PhysicsComp";
import Point from "../geom/Point";
import CircleCollider, {BoundsData} from "./CircleCollider";

export default class RectCollider extends CircleCollider
{


    public width:number;
    public halfWidth:number;
    public height:number;
    public halfHeight:number;


    constructor(data:any, physics:PhysicsComp)
    {
        super(data, physics);

        this.width = data.width;
        this.halfWidth = this.width * .5;
        this.height = data.height;
        this.halfHeight = this.height * .5;

        this.updateBounds();
    }


    updateBounds():void
    {
        const pos = this.physics.position;
        this.bounds[0].x= pos.x - this.halfWidth;
        this.bounds[1].x = pos.x + this.halfWidth;
    }



}