export default class Util
{
    private static benchmarkStartTS:number;
    private static uidCounter:number = 0;

    static startBenchmark():void
    {
        Util.benchmarkStartTS = new Date().getTime();
    }

    static endBenchmark():void
    {
        console.log("===> " + (new Date().getTime() - Util.benchmarkStartTS));
    }

    static getUID():number
    {
        return Util.uidCounter++;
    }

    static swap(tuple:[any, any] | undefined)
    {
        if (tuple)
        {
            const temp = tuple[0];
            tuple[0] = tuple[1];
            tuple[1] = temp;
            return tuple;
        }
        return undefined;
    }
}