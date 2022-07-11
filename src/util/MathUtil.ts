import Point from "../geom/Point";

export default class MathUtil
{


    static sign(v:number)
    {
        return v<0 ? -1 : 1;
    }

    static radToDeg(angleRad:number):number
    {
        return angleRad * 180/Math.PI;
    }
}