import ThreeMap from "./bk/ThreeMap";
import { util } from './lib/util';

var mycim={}


$.extend(mycim,{
    
        createMap: function (options) {
                
            var threeMap = new ThreeMap({ mapData: options.mapData });
            threeMap.createMap();
        },

        createCity: function (options) {
                
            var threeMap = new ThreeMap({ mapData: options.mapData });
            threeMap.createCity();
        }
})

export default mycim;
