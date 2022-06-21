
import BaseComp from "./BaseComp";

export type Constructor<T> = { new (...args: any[]): T };

export default class Entity
{

    public components: BaseComp[];


    constructor(entityData:any)
    {
        this.components = [];

        if (entityData && entityData.components)
        {
            entityData.components.forEach( (compData:any) => this.createComponent(compData) );
        }

        this.components.forEach(c => c.init());
    }


    createComponent(data:any):BaseComp
    {
        const comp = new data.compType(this, data);
        this.components.push(comp);

        return comp;
    }


    removeComponent(c:BaseComp):void
    {
        const idx = this.components.indexOf(c);
        if (idx !== -1)
        {
            this.components.splice(idx, 1);
        }
    }


    getComponent<T>(compType:{ new (...args: any[]): T }):T|undefined
    {
        let compFound;
        for (let compIdx = 0; compIdx < this.components.length; compIdx++)
        {
            const comp = this.components[compIdx];
            if (comp instanceof compType)
            {
                compFound = comp;
                break;
            }
        }
        return compFound as T;
    }


    destroy():void
    {
        this.components.forEach(c => c.destroy());
    }
}