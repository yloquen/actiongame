import {app} from "./index";

export default class MapGenerator
{


    init():void
    {
        const mapData = JSON.parse(app.assets.resources.tilemap?.data);
        const tileSetData = JSON.parse(app.assets.resources.tileset?.data);

        debugger;
    }


}