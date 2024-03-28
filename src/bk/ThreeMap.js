import * as THREE from "three/build/three.module";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import * as d3 from 'd3-geo';

// const THREE = window.THREE;
class ThreeMap {


    //构造方法，new对象自动执行
    constructor(set) {
        this.mapData = set.mapData;
        this.color = '#006de0';

        this.scene=this.initThree(); //初始化Threejs场景相关
        
    }

    

    //初始化
    createMap() {
        console.log("创建地图板块");
        this.drawMap();
        
    }

    //创建城市建筑群
    createCity(){
        console.log("创建城市建筑群");
        this.drawCity();
    }

    createObj() {
        console.log("我是父类自定义的方法！");
    }

    initThree() {
        let camera, light,  renderer, scene,mesh, material, raycaster, group, texture;
        
        function initCamera() {
            camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 10000);
            camera.position.set(400, 400, 400);
        }

        function initLight() {
            light = new THREE.AmbientLight(0xffffff);
        }

        function initScene() {
            scene = new THREE.Scene();
            //坐标辅助线
            let helper = new THREE.AxisHelper(1000);
            //网格辅助线
            let gridHelper = new THREE.GridHelper(1000, 50);

            scene.add(helper);
            scene.add(light);
            // scene.add(gridHelper);
        }


        function initRender() {
            renderer = new THREE.WebGLRenderer();
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setClearColor(0xFFFFFF, 1.0);
            document.body.appendChild(renderer.domElement);

            //添加鼠标控制

            let controls = new OrbitControls(camera, renderer.domElement);//创建控件对象

            window.addEventListener('resize', onWindowResize, false);
        }

        function animate() {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);


        }

        function onWindowResize() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }

        function init() {
            initCamera();
            initLight();
            initScene()
            // initMesh();
            initRender()
            animate();
            
        }

        init();

        return scene;

    }

    /**
   * @desc 绘制地图
   */
  drawMap() {
   
    if (!this.mapData) {
      console.error('this.mapData 数据不能是null');
      return;
    }
    // 把经纬度转换成x,y,z 坐标
    this.mapData.features.forEach(d => {
      d.vector3 = [];
      d.geometry.coordinates.forEach((coordinates, i) => {
        d.vector3[i] = [];
        coordinates.forEach((c, j) => {
          if (c[0] instanceof Array) {
            d.vector3[i][j] = [];
            c.forEach(cinner => {
              let cp = this.lnglatToMectorCity(cinner,[108.904496, 32.668849]);
              d.vector3[i][j].push(cp);
            });
          } else {
            let cp = this.lnglatToMectorCity(c,[108.904496, 32.668849]);
            d.vector3[i].push(cp);
          }
        });
      });
    });

    console.log("看看转换后的",this.mapData);

    // 绘制地图模型
    const group = new THREE.Group();
    const lineGroup = new THREE.Group();
    this.mapData.features.forEach(d => {
      const g = new THREE.Group(); // 用于存放每个地图模块。||省份
      g.data = d;
      d.vector3.forEach(points => {
        // 多个面
        if (points[0][0] instanceof Array) {
          points.forEach(p => {
            const mesh = this.drawModel(p);
            const lineMesh = this.drawLine(p);
            lineGroup.add(lineMesh);
            g.add(mesh);
          });
        } else {
          // 单个面
          const mesh = this.drawModel(points);
          const lineMesh = this.drawLine(points);
          lineGroup.add(lineMesh);
          g.add(mesh);
        }
      });
      group.add(g);
    });
    const lineGroupBottom = lineGroup.clone();
    lineGroupBottom.position.z = -2;

    const groupAll = new THREE.Group();
    groupAll.add(lineGroup);
    groupAll.add(lineGroupBottom);
    groupAll.add(group);
    this.scene.add(groupAll);

    groupAll.rotateX(Math.PI*3/2);
    // groupAll.rotateY(Math.PI*2);

    groupAll.scale.set(10,10,10);
  }

  /**
   * @desc 绘制地图
   */
   drawCity() {
   debugger
    if (!this.mapData) {
      console.error('this.mapData 数据不能是null');
      return;
    }
    // 把经纬度转换成x,y,z 坐标
    this.mapData.features.forEach(d => {
      d.vector3 = [];
      d.geometry.coordinates.forEach((coordinates, i) => {
        d.vector3[i] = [];
        coordinates.forEach((c, j) => {
          if (c[0] instanceof Array) {
            d.vector3[i][j] = [];
            c.forEach(cinner => {
              let cp = this.lnglatToMectorCity(cinner,[102.708502984872666, 25.05307674407959]);
              d.vector3[i][j].push(cp);
            });
          } else {
            let cp = this.lnglatToMectorCity(c,[102.708502984872666, 25.05307674407959]);
            d.vector3[i].push(cp);
          }
        });
      });
    });

    console.log("看看转换后的",this.mapData);

    // 绘制地图模型
    const group = new THREE.Group();
    const lineGroup = new THREE.Group();
    this.mapData.features.forEach(d => {
        //获取建筑高度
       var height= d.properties.height||30;
      const g = new THREE.Group(); // 用于存放每个地图模块。||省份
      g.data = d;
      d.vector3.forEach(points => {
        // 多个面
        if (points[0][0] instanceof Array) {
          points.forEach(p => {
            const mesh = this.drawModel(p,height*0.00001);
            // const lineMesh = this.drawLine(p);
            // lineGroup.add(lineMesh);
            g.add(mesh);
          });
        } else {
          // 单个面
          const mesh = this.drawModel(points,height*0.00001);
        //   const lineMesh = this.drawLine(points);
        //   lineGroup.add(lineMesh);
          g.add(mesh);
        }
      });
      group.add(g);
    });
    // const lineGroupBottom = lineGroup.clone();
    // lineGroupBottom.position.z = -2;

    const groupAll = new THREE.Group();
    // groupAll.add(lineGroup);
    // groupAll.add(lineGroupBottom);
    groupAll.add(group);
    this.scene.add(groupAll);

    groupAll.rotateX(Math.PI*3/2);
    // groupAll.rotateY(Math.PI/2);

    groupAll.scale.set(30000,30000,30000);
  }

  /**
   * @desc 绘制线条
   * @param {} points
   */
  drawLine(points) {
    const material = new THREE.LineBasicMaterial({
      color: '#ccc',
      transparent: true,
      opacity: 0.7
    });
    const geometry = new THREE.Geometry();
    points.forEach(d => {
      const [x, y, z] = d;
      geometry.vertices.push(new THREE.Vector3(x, y, z + 0.1));
    });
    const line = new THREE.Line(geometry, material);
    return line;
  }

  /**
   * @desc 绘制地图模型 points 是一个二维数组 [[x,y], [x,y], [x,y]]
   */
  drawModel(points,height) {
    const shape = new THREE.Shape();
    points.forEach((d, i) => {
      const [x, y] = d;
      if (i === 0) {
        shape.moveTo(x, y);
      } else if (i === points.length - 1) {
        shape.quadraticCurveTo(x, y, x, y);
      } else {
        shape.lineTo(x, y, x, y);
      }
    });

    const geometry = new THREE.ExtrudeGeometry(shape, {
      amount: height||-2,
      bevelEnabled: false
    });
    const material = new THREE.MeshBasicMaterial({
      color: this.color,
      transparent: true,
      opacity: 0.6,
      side: THREE.DoubleSide
    });
    const mesh = new THREE.Mesh(geometry, material);
    return mesh;
  }

  /**
   * @desc 经纬度转换成墨卡托投影
   * @param {array} 传入经纬度
   * @return array [x,y,z]
   */
  lnglatToMector(lnglat,center) {
    // console.log("看看lan",lnglat);
    if (!this.projection) {
      this.projection = d3
        .geoMercator()
        .center(center)
        .scale(80)
        .rotate(Math.PI / 4)
        .translate([0, 0]);
    }
    const [y, x] = this.projection([...lnglat]);
    let z = 0;
    return [x, y, z];
  }

  /**
   * @desc 经纬度转换成墨卡托投影
   * @param {array} 传入经纬度
   * @return array [x,y,z]
   */
   lnglatToMectorCity(lnglat,center) {
    // console.log("看看lan",lnglat);
    if (!this.projection) {
      this.projection = d3
        .geoMercator()
        .center(center)
        .scale(80)
        .rotate(Math.PI / 4)
        .translate([0, 0]);
    }
    const [y, x] = this.projection([...lnglat]);
    let z = 0;
    return [x, y, z];
  }

}

export default ThreeMap;