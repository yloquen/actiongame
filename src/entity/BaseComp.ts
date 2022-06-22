import Entity from "./Entity";
import {app} from "../index";

export default class
{
    entity:Entity;
    protected data:any;


    constructor(e:Entity, data:any)
    {
        this.entity = e;
        this.data = data;
    }


    init():void
    {

    }


    destroy():void
    {

    }


}