
import Assets from "./Assets";
import {Howl, Howler} from "howler";
import {TweenMax} from "gsap";
import C_Game from "./const/C_Game";
import {app} from "./index";


export default class SoundController
{

    init():void
    {
        [
            "hit",
            "shoot"
        ]
            .forEach(sndId => {app.sound.playSound(sndId, 0)});
    }
    
    playSound(sndId:string, volume:number=1):void
    {
        const path = "./assets/audio/";
        const extension = ".wav?v=" + C_Game.ASSET_VER;
        const snd = new Howl({
            src: [path + sndId + extension],
            volume: volume
        });

        snd.play();
    }

}
