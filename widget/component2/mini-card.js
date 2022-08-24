import { OrbitControls } from "../three/controls/OrbitControls"
import { sRGBEncoding, LoopOnce } from "../three/constants"
import { DirectionalLight } from "../three/lights/DirectionalLight"
import { AmbientLight } from "../three/lights/AmbientLight"
import { Mesh } from "../three/objects/Mesh"
import { MeshPhongMaterial } from "../three/materials/MeshPhongMaterial"
import { Color } from "../three/math/Color"
import { GLTFLoader } from "../three/loaders/GLTFLoader"
import { WebGL1Renderer } from "../three/renderers/WebGL1Renderer"
import { PerspectiveCamera } from "../three/cameras/PerspectiveCamera"
import { AnimationMixer } from "../three/animation/AnimationMixer"
import { Vector3 } from "../three/math/Vector3"
import { Fog } from "../three/scenes/Fog"
import { Scene } from "../three/scenes/Scene"
import { PlaneGeometry } from "../three/geometries/PlaneGeometry"
import { TaobaoPlatform } from "../adapter/adapter"
import { LoadingManager } from "../three/loaders/LoadingManager"

Component({
  data: {
  },
  onInit() {
    
  },
  didMount() {
    
  },
  methods: {
    canvasOnReady(e) {
      new Promise((resolve, reject) => {
          my.createCanvas({
            id: 'gl',
            success: resolve,
            fail: reject
          });
      })
      .then((canvas) => {console.log(canvas);this.initCanvas(canvas)})
      .catch((e) => {console.log(e);my.alert({ content: '初始canvas失败' + JSON.stringify(e) })})
    },
    async initCanvas(canvas) {
      try {
        console.log("进canvas了",canvas.width,canvas.height);
        const dpr = 1;
        const canW = Math.round(canvas.width * 1.01) 
        const canH = Math.round(canvas.height * 1.01)

        this.platForm = new TaobaoPlatform(canvas, canW, canH);
        my.global = this.platForm.getGlobals()
        my.global.canvas = canvas;
        console.log(canW, canH);

        const renderer = new WebGL1Renderer({ canvas, antialias: false, alpha: true });
        const camera = new PerspectiveCamera(75, canW / canH, 0.001, 50);
        camera.position.set(1,1.9,2.4);
        camera.lookAt(0,1.5,0);
        const scene = new Scene();
        const gltfLoader = new GLTFLoader(new LoadingManager(()=>{console.log(11);},()=>{console.log(22);},()=>{console.log(33);}));

        // renderer.setClearColorHex( 0xF1EBDD, 1 );
        renderer.outputEncoding = sRGBEncoding;
        renderer.setPixelRatio(dpr);
        renderer.setSize(canW, canH);

        scene.background = new Color(0xF1EBDD);
        // Draco 解码库
        // const dracoLoader = new DRACOLoader();
        // dracoLoader.setDecoderPath("https://duiba.oss-cn-hangzhou.aliyuncs.com/db_games/activity/widgetTest/draco/");
        // dracoLoader.setDecoderConfig({ type: 'js' });
        // dracoLoader.preload();

        // gltfLoader.setDRACOLoader(dracoLoader);

        gltfLoader.load(
          // 'https://duiba.oss-cn-hangzhou.aliyuncs.com/db_games/activity/widgetTest/scene.gltf',
          // 'https://duiba.oss-cn-hangzhou.aliyuncs.com/db_games/activity/widgetTest/%E7%AF%AE%E7%BD%91%E5%8A%A8%E7%94%BB0820.gltf',
          'https://test-blender.oss-cn-shanghai.aliyuncs.com/duiba0413/0413-processed.gltf',
          // 'https://duiba.oss-cn-hangzhou.aliyuncs.com/db_games/activity/widgetTest/0414.gltf',
          (gltf) => {
            console.log("加载成功",gltf)
            this.gltf = gltf;
            let model = gltf.scene;
            scene.add( model );
            console.log(model);
            model.castShadow = true;
            model.children.forEach((itm)=>{
              console.log(this);
              this.costShadow(itm)
            })
            // init animtion
            this.mixer = new AnimationMixer(model);
            let walkAction = this.mixer.clipAction(gltf.animations[0]);
            walkAction.play();

            this.change(2)
          },
          undefined,
          function ( error ) {
            console.log( JSON.stringify(error));
          }
        )
        

        const light = new DirectionalLight(0xffffff, 1);
        light.position.set(-1,3,5)
        light.castShadow = true;
        light.shadow.mapSize.width = 2048
        light.shadow.mapSize.height = 2048
        scene.add(light);

        scene.add(new AmbientLight(0xffffff, 1));
        renderer.shadowMap.enabled = true;

        const plane = new Mesh(new PlaneGeometry(40, 40), new MeshPhongMaterial({ color: 0xfff000, specular: 0x101010 }));
        plane.rotation.x = -Math.PI / 2;
        plane.position.y = 0;
        // plane.material.blending = 4;
        plane.receiveShadow = true;
        scene.add(plane);

        // this.add(new AmbientLight(0x444444));
        this.orbitControl = new OrbitControls(camera, canvas);
        // this.orbitControl.center.set(0,1.5,0)
        this.orbitControl.enableZoom = false
        this.orbitControl.enablePan = false
        this.orbitControl.minPolarAngle = Math.PI/2
        this.orbitControl.maxPolarAngle = Math.PI/2
        // this.orbitControl.target.set( 0, 1.5, 0 );
        this.orbitControl.update();
        // this.orbitControl.listenToKeyEvents(canvas)
        // this.orbitControl.enableDamping = true;
        // this.orbitControl.dampingFactor = 0.05;

        const render = () => {
          if (this.disposing) return
          canvas.requestAnimationFrame(render);
          this.mixer && this.mixer.update( 1 / 60 );
          this.orbitControl.update();
          renderer.render(scene, camera);
        };

        render();
      } catch (error) {
        console.error(error);
        // @ts-ignore
        my.alert({ content: error + ':' + JSON.stringify(error) });
      }
    },
    costShadow(node){
      if(node.type.indexOf("Mesh")>0){
        node.castShadow = true;
      }
      if(node.children.length>0){
        node.children.forEach(itm=>{
          this.costShadow(itm)
        })
      }
    },
    change(e){
      if(e.currentTarget){
        var idx = e.currentTarget.id
      }else{
        var idx = e
      }
      if(idx == 1){
        this.gltf.scene.children[0].children.forEach(child=>{
          if(child.name == "MALE_CNY_JACKET_1"){
            child.visible=true
          }
          if(child.name == "Hoodie_1"){
            child.visible=false
          }
        })
      }else if(idx == 2){
        this.gltf.scene.children[0].children.forEach(child=>{
          if(child.name == "Hoodie_1"){
            child.visible=true
          }
          if(child.name == "MALE_CNY_JACKET_1"){
            child.visible=false
          }
        })
      }
    },
    onTX(e) {
      console.log(999);
      this.platForm.dispatchTouchEvent(e);
    },
    onTouchStart(e){
      e.touches.forEach((t)=>{
        t.pageX=t.x;
        t.pageY=t.y;
      })
      e.changedTouches.forEach((t)=>{
        t.pageX=t.x;
        t.pageY=t.y;
      })
      this.orbitControl && this.orbitControl.onTouchStart(e);
    },
    onTouchMove(e){
      // console.log(e);
      e.touches.forEach((t)=>{
        t.pageX=t.x;
        t.pageY=t.y;
      })
      e.changedTouches.forEach((t)=>{
        t.pageX=t.x;
        t.pageY=t.y;
      })
      
      // this.platForm.dispatchTouchEvent(e);
      this.orbitControl && this.orbitControl.onTouchMove(e);
    },
    onTouchEnd(e){
      e.touches.forEach((t)=>{
        t.pageX=t.x;
        t.pageY=t.y;
      })
      e.changedTouches.forEach((t)=>{
        t.pageX=t.x;
        t.pageY=t.y;
      })
      
      // this.platForm.dispatchTouchEvent(e);
      this.orbitControl && this.orbitControl.onTouchEnd(e);
    }
  }
})
