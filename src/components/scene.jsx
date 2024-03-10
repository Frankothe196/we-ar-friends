import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// import { XRButton } from "three/addons/webxr/XRButton.js";

// Import glb/gltf loader
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { useLoader } from "@react-three/fiber";

import GLB_Model from "../assets/models/kicc.glb";
// import Bot_GLB from "../assets/models/Xbot.glb";
import Bot_GLB from "../assets/models/Soldier.glb";
import UserInterface from "../components/userInterface";

import { CharacterControls } from "./botControls";
import { KeyDisplay } from "./utils";

function Scene() {
  const cube = useRef(null);
  const ref = useRef();

  // Init renderer
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.xr.enabled = true;

  // Init Scene
  const scene = new THREE.Scene();

  // Add Grid
  const gridHelper = new THREE.GridHelper(10, 10);
  scene.add(gridHelper);

  // Add a square
  const Model_3D = useLoader(GLTFLoader, GLB_Model);

  console.log(Model_3D); // This will help you understand how the 3D model was structured and how to work with it
  const geometry = Model_3D.nodes.building.geometry;
  const material = new THREE.MeshPhongMaterial({
    color: 0x909090,
    dithering: true,
  });
  let model_mesh = new THREE.Mesh(geometry, material);
  model_mesh.castShadow = true; //default is false
  model_mesh.receiveShadow = true; //default
  model_mesh.scale.set(0.5, 0.5, 0.5); // its alittle too large lets scale it down
  model_mesh.rotation.y = 0.9;
  model_mesh.position.set(0, 7.9, -5);
  // Useful code, note needed anymore but ill leave it here for future

  // Model_3D.nodes.building.traverse(function(node) {
  //   if(node.isMesh) {
  //     // console.log(node)
  // 		node.castShadow = node.receiveShadow = true;
  // 	}
  // });

  scene.add(model_mesh);

  // Add lights
  const AmbientLight = new THREE.AmbientLight(0x404040, 1);
  scene.add(AmbientLight);

  // Add point light
  const light = new THREE.PointLight(0xffffff, 150, 100);
  light.position.set(15, 15, 15);
  light.castShadow = true; // default false

  light.shadow.mapSize.width = 1024;
  light.shadow.mapSize.height = 1024;
  light.shadow.camera.near = 1;
  light.shadow.camera.far = 500;

  const pointLightHelper = new THREE.PointLightHelper(light, 1);

  scene.add(light);
  scene.add(pointLightHelper);

  // Init Camera
  const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  camera.position.set(8, 5, 8);

  // // Init Controls
  // const controls = new OrbitControls(camera, renderer.domElement);
  // controls.target.set(0, 0, 0);
  // controls.update();
  // controls.enablePan = false;
  // controls.enableDamping = true;
  // CONTROLS
  const orbitControls = new OrbitControls(camera, renderer.domElement);
  orbitControls.enableDamping = true
  orbitControls.minDistance = 5
  orbitControls.maxDistance = 15
  orbitControls.enablePan = false
  orbitControls.maxPolarAngle = Math.PI / 2 - 0.05
  orbitControls.update();

  // CONTROL KEYS
  var characterControls
  const keysPressed = {  }
  const keyDisplayQueue = new KeyDisplay();
  document.addEventListener('keydown', (event) => {
      keyDisplayQueue.down(event.key)
      if (event.shiftKey && characterControls) {
          characterControls.switchRunToggle()
      } else {
          (keysPressed)[event.key.toLowerCase()] = true
      }
  }, false);
  document.addEventListener('keyup', (event) => {
      keyDisplayQueue.up(event.key);
      (keysPressed)[event.key.toLowerCase()] = false
  }, false);

  const clock = new THREE.Clock();

  // Animate
  function animate() {
    // We need to adjust the animate function from what three.js usually recommends does'nt work with web xr
    // requestAnimationFrame(animate) // This should'nt work
    // renderer.setAnimationLoop(function () {
    //   renderer.render(scene, camera);
    // });
    let mixerUpdateDelta = clock.getDelta();
    if (characterControls) {
        characterControls.update(mixerUpdateDelta, keysPressed);
    }
    orbitControls.update()
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
  }
  // cube
  const spriteGeometry = new THREE.BoxGeometry(0.1, 1, 0.1);
  const spriteMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const spriteMesh = new THREE.Mesh(spriteGeometry, spriteMaterial);
  cube.current = spriteMesh;
  scene.add(spriteMesh);


  new GLTFLoader().load(Bot_GLB, function(gltf){
    const model = gltf.scene
    model.traverse(function(object){
      if(object.isMesh) object.castShadow=true
    });
    scene.add(model)

    const gltfAnimations= gltf.animations;
    const mixer = new THREE.AnimationMixer(model);
    const animationsMap= new Map()
    gltfAnimations.filter(a => a.name != 'TPose').forEach((a) => {
        animationsMap.set(a.name, mixer.clipAction(a))
    })

    characterControls = new CharacterControls(model, mixer, animationsMap, orbitControls, camera,  'Idle')
  }

  )
  // const Bot_Model = useLoader(GLTFLoader, Bot_GLB);
  // console.log(Bot_Model)
  // const Bot_geometry = Bot_Model.nodes.building.geometry;
  // const Bot_Material = new THREE.MeshPhongMaterial({
  //   color: 0x909090,
  //   dithering: true,
  // });
  // let bot_mesh = new THREE.Mesh(Bot_geometry, Bot_Material);
  // bot_mesh.castShadow = true; //default is false
  // bot_mesh.receiveShadow = true; //default
  // bot_mesh.position.set(0, 0, 0);
  // Useful code, note needed anymore but ill leave it here for future

  // Model_3D.nodes.building.traverse(function(node) {
  //   if(node.isMesh) {
  //     // console.log(node)
  // 		node.castShadow = node.receiveShadow = true;
  // 	}
  // });

  scene.add(model_mesh);


  useEffect(() => {
    window.addEventListener("resize", onWindowResize);
    if (ref.current) {
      ref.current.appendChild(renderer.domElement);
      // window.removeEventListener("keydown", handleKeyPress);
      // document.body.appendChild(XRButton.createButton(renderer));
    }
    animate();
  }, []);

  return (
    <>
      <UserInterface />
      <div className="App" id="App" ref={ref}></div>
    </>
  );
}

export default Scene;
