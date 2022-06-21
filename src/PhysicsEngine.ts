import Collider from "./physics/Collider";

export default class PhysicsEngine
{

    private readonly colliders:any[];

    constructor()
    {
        this.colliders = [];
    }

    addCollider(c:Collider):void
    {
        this.colliders.push(c);
    }


    checkCollisions():void
    {
        for (let c1idx = 0; c1idx < this.colliders.length - 1; c1idx++)
        {
            const c1 = this.colliders[c1idx];
            for (let c2idx = 0; c2idx < this.colliders.length ; c2idx++)
            {
                const c2 = this.colliders[c2idx];
                c1.test(c2);
            }
        }
    }

}