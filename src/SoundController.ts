import {Howl} from "howler";
import C_Game from "./const/C_Game";
import {app} from "./index";
import E_UpdateStep from "./const/E_UpdateStep";


export default class SoundController
{
    private soundsToPlay:Record<string, number>;

    init():void
    {
        this.soundsToPlay = {};

        [
            "hit",
            "shoot",
            "beam"
        ]
            .forEach(sndId => {app.sound.playSound(sndId, 0)});

        app.game.addUpdateCallback(this.update.bind(this), E_UpdateStep.FINAL);
    }


    playSound(sndId:string, volume:number=1):void
    {
        this.soundsToPlay[sndId] = volume;
    }


    createSound(sndId:string, volume:number):Howl
    {
        const path = "./assets/audio/";
        const extension = ".wav?v=" + C_Game.ASSET_VER;
        const snd = new Howl({
            src: [path + sndId + extension],
            volume: volume
        });
        return snd;
    }


    update(delta:number):void
    {
        for (let sndId in this.soundsToPlay)
        {
            const snd = this.createSound(sndId, this.soundsToPlay[sndId]);
            delete this.soundsToPlay[sndId];
            snd.play();
        }

    }




}
