
import ThreeMap from "./ThreeMap"

class ThreeMapLight extends ThreeMap{

    //构造函数，new对象时自动执行
    constructor(set){
        super(set);
        this.data=set.data;
        this.initThreeMapLight();
    }

    initThreeMapLight(){
        console.log("ThreeMapLight初始化",this.data);
    }

    createA(){
        console.log("我是子类自定义的方法");
    }
    
}

export default ThreeMapLight;