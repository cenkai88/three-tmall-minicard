import { WebGLRenderer } from "../three/renderers/WebGLRenderer";
import { ACESFilmicToneMapping, sRGBEncoding, NearestFilter, UnsignedByteType, RGBEFormat, RGBEEncoding, CubeUVReflectionMapping, EquirectangularReflectionMapping } from "../three/constants";
import { PerspectiveCamera } from "../three/cameras/PerspectiveCamera";
import { Scene } from "../three/scenes/Scene";
import { GLTFLoader } from "../three/loaders/GLTFLoader";
import { TaobaoPlatform } from "../adapter/adapter"
import { OrbitControls } from "../three/controls/OrbitControls"
import { MeshoptDecoder } from "../three/loaders/meshopt_decoder.asm.module.js"
import { AnimationMixer } from "../three/animation/AnimationMixer" 
import { Clock } from '../three/core/Clock';
import { Box3 } from '../three/math/Box3';
import { AmbientLight } from '../three/lights/AmbientLight';
import { DirectionalLight } from '../three/lights/DirectionalLight';
import { Vector3 } from '../three/math/Vector3';
import { KTX2Loader } from '../three/loaders/KTX2Loader';


function traverseMaterials(object, callback) {
  object.traverse(node => {
    if (!node.isMesh) return;
    const materials = Array.isArray(node.material)
      ? node.material
      : [node.material];
    materials.forEach(callback);
  });
}

class Viewer {
  constructor({ containerWidth, containerHeight, ctx, canvas }) {
    this.lights = [];
    this.canvas = canvas;
    this.ctx = ctx;

    this.state = {
      showWireframe: false,
      useNormalmap: true,
      useRoughmap: true,
      useAmbient: true,
      useDirectional: true
    };

    this.prevTime = 0;

    this.scene = new Scene();

    const fov = 60;

    console.log(createImageBitmap)

    this.defaultCamera = new PerspectiveCamera(
      fov,
      containerWidth / containerHeight,
      0.01,
      1000
    );
    this.activeCamera = this.defaultCamera;
    this.scene.add(this.defaultCamera);

    this.renderer = new WebGLRenderer({
      antialias: true,
      canvas,
      context: ctx
    });
    // this.renderer.physicallyCorrectLights = true;
    this.renderer.outputEncoding = sRGBEncoding;
    console.log(this.renderer)
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = 2;
    // this.renderer.setClearColor(0xeceade);
    this.renderer.setClearColor(0xf1ebdd);
    this.renderer.setPixelRatio(my.getSystemInfoSync().pixelRatio);
    this.renderer.setSize(containerWidth, containerHeight);

    this.controls = new OrbitControls(this.defaultCamera, this.canvas);
    this.controls.screenSpacePanning = true;
    this.controls.enabled = true;

    this.clock = new Clock();
    // this.render();
    this.animate = this.animate.bind(this);
    this.canvas.requestAnimationFrame(this.animate);
  }

  animate() {
    this.canvas.requestAnimationFrame(this.animate);
    if (this.mixer) this.mixer.update(this.clock.getDelta());
    this.controls.update();
    this.render();
  }

  render() {
    this.renderer.render(this.scene, this.activeCamera);
  }

  load(url) {
    return new Promise(resolve => {

      const gltfLoader = new GLTFLoader();
      gltfLoader.setMeshoptDecoder(MeshoptDecoder);
      const ktx2Loader = new KTX2Loader();
      ktx2Loader.detectSupport(this.renderer);
      gltfLoader.setKTX2Loader(ktx2Loader);

      gltfLoader.load(url, gltf => {
        this.setContent(gltf.scene);
        this.model = gltf.scene
        this.mixer = new AnimationMixer(gltf.scene);
        // if (gltf.animations.length > 0) this.mixer.clipAction(gltf.animations[0]).reset().play();
        if (gltf.animations.length > 0){
          const animationAction = this.mixer.clipAction(gltf.animations[0]);
          animationAction.play();
          animationAction.halt();
        }
        resolve();
        this.model.children[0].traverse(item=>item.castShadow=true);
        // this.model.children[2].receiveShadow=true;
        // this.model.scale.set(10, 10, 10);
        this.setShoe(1);
      });
    });
  }

  setShoe(index){
    const shoeList = ['Hoodie_1','MALE_CNY_JACKET_1'];
    this.model.traverse(item=>{
      if (shoeList.includes(item.name)) {
        item.visible=item.name===shoeList[index];
      }
    });
    
    // const shoes = this.model.children[1].children.filter(item=>item.name==='SHOE');
    // shoes[0].children.map(item=>item.visible=false);
    // shoes[0].children[index].visible = true;
    // const clothes = this.model.children[0].children.find(item=>item.name==="group1");
    // clothes.children.map(item=>item.visible=false);
    // clothes.children[index].visible = true;
  }

  /**
   * @param {THREE.Object3D} object
   * @param {Array<THREE.AnimationClip} clips
   */
  setContent(object) {
    const box = new Box3().setFromObject(object);
    const size = box.getSize(new Vector3()).length();
    const center = box.getCenter(new Vector3());
    this.controls.reset();

    object.position.x += object.position.x - center.x;
    object.position.y += object.position.y - center.y;
    object.position.z += object.position.z - center.z;
    this.controls.maxDistance = size * 10;
    this.defaultCamera.near = size / 10000;
    this.defaultCamera.far = size * 10000;
    this.defaultCamera.updateProjectionMatrix();
    this.defaultCamera.position.copy(center);
    this.defaultCamera.position.x += size / 2.0;
    this.defaultCamera.position.y += size / 5.0;
    this.defaultCamera.position.z += size / 2.0;
    this.defaultCamera.lookAt(center);

    this.controls.saveState();
    this.content = object;

    // // save original maps
    // traverseMaterials(this.content, material => {
    //   material.wireframe = this.state.showWireframe;
    //   if (material.roughnessMap)
    //     material.originalRoughnessMap = material.roughnessMap;
    //   if (material.normalMap) material.originalNormalMap = material.normalMap;
    // });
    this.scene.add(object);
    this.refreshLights();
  }

  refreshLights() {
    this.lights.forEach(light => light.parent.remove(light));
    this.lights.length = 0;

    const light1 = new AmbientLight(0xffffff, 0.16);
    this.scene.add(light1);
    this.lights.push(light1);

    const light2 = new DirectionalLight(0xfed7d7, 0.6);
    light2.position.set(1.708, 0.058, 0.176); 
    this.scene.add(light2);
    this.lights.push(light2);

    const light3 = new DirectionalLight( 0xffffff, 0.3);
    light3.position.set(-0.675, 0.302, -2.743); 
    this.scene.add(light3);
    this.lights.push(light3);

    const light4 = new DirectionalLight( 0xffffff, 1.36);
    light4.position.set(-0.995, 3.142, 2.861); 
    light4.castShadow = true;
    light4.shadow.mapSize.width = 2048;
    light4.shadow.mapSize.height = 2048;
    // light4.shadowCameraVisible=true;
    // light4.shadow.camera.top=10000;
    // light4.shadow.camera.bottom=-10000;
    // light4.shadow.camera.left=-10000;
    // light4.shadow.camera.right=10000;
    // light4.shadow.camera.near=-0.01;
    // light4.shadow.camera.far=7000;
    this.scene.add(light4);
    this.lights.push(light4);
  }

  setState(key) {
    this.state[key] = !this.state[key];
    this.refreshLights();
    traverseMaterials(this.content, material => {
      material.wireframe = this.state.showWireframe;
      // if (material.roughnessMap) material.roughnessMap.dispose();
      // if (material.normalMap) material.normalMap.dispose();
      material.roughnessMap = this.state.useRoughmap
        ? material.originalRoughnessMap
        : null;
      material.normalMap = this.state.useNormalmap
        ? material.originalNormalMap
        : null;
      material.needsUpdate = true;
    });
  }
}

Component({
  data: {
  
  },
  didMount() {
    console.log('-------> didMount')
  },
  methods: {
    onCanvasReady() {
      my.createCanvas({
        id: "canvas",
        success: async (canvas) => {
          if (canvas) {
              const {windowWidth, windowHeight} = my.getSystemInfoSync();
              canvas._width = windowWidth;
              canvas._height = windowHeight*0.8;
              canvas.width = canvas._width;
              canvas.height = canvas._height;

              this.canvas = canvas;
              // for Three GLTFParser ImageLoader loading
              const taobaoPlatform = new TaobaoPlatform(canvas);
              my.global = taobaoPlatform.getGlobals();
              my.global.canvas = canvas;

              const ctx = canvas.getContext('webgl', { alpha: true });
              this.ctx = ctx;

              this.viewer = new Viewer({
                containerWidth: windowWidth,
                containerHeight: windowHeight*0.8,
                canvas,
                ctx
              });
              await this.viewer.load(
                //  'https://test-blender.oss-cn-shanghai.aliyuncs.com/tmall/5MB_compressed.gltf'
                'https://test-blender.oss-cn-shanghai.aliyuncs.com/3d/xiezi_comp.gltf'
              );
          } else {
            throw "success but no canvas";
          }
        },
      });
    },
    onTapAJ(){
      this.viewer.setShoe(1);
    },
    onTapDunk(){
      this.viewer.setShoe(0);
    },
    onTouchStart(e) {
      console.log(e)
      this.viewer.controls.onTouchStart(e);
    },
    onTouchMove(e) {
      console.log(e)
      this.viewer.controls.onTouchMove(e);
    },
    onTouchEnd(e) {
      console.log(e)
      this.viewer.controls.onTouchEnd(e);
    },
  }
})
