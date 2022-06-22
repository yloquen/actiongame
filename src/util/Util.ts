export default class Util
{
    static benchmarkStartTS:number;

    static startBenchmark():void
    {
        Util.benchmarkStartTS = new Date().getTime();
    }

    static endBenchmark():void
    {
        console.log("===> " + (new Date().getTime() - Util.benchmarkStartTS));
    }
}