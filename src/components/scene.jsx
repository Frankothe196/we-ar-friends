import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// import { XRButton } from "three/addons/webxr/XRButton.js";

// Import glb/gltf loader
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { useLoader } from "@react-three/fiber";

import GLB_Model from "../assets/models/kicc.glb";
import UserInterface from "../components/userInterface";

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
  const model_mesh = new THREE.Mesh(geometry, material);
  model_mesh.castShadow = true; //default is false
  model_mesh.receiveShadow = true; //default
  model_mesh.scale.set(0.1, 0.1, 0.1); // its alittle too large lets scale it down
  model_mesh.rotation.y = 0.9;
  model_mesh.position.set(0, 0, -5);
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

  // Init Controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 0, 0);
  controls.update();
  controls.enablePan = false;
  controls.enableDamping = true;

  // Animate
  function animate() {
    // We need to adjust the animate function from what three.js usually recommends does'nt work with web xr
    // requestAnimationFrame(animate) // This should'nt work
    renderer.setAnimationLoop(function () {
      renderer.render(scene, camera);
    });
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

  // Handle arrow key presses to move the cube
  const handleKeyPress = (event) => {
    console.log("key!")
    const speed = 0.1;
    switch (event.key) {
    case "ArrowUp":
      cube.current.position.y += speed;
      break;
    case "ArrowDown":
      cube.current.position.y -= speed;
      break;
    case "ArrowLeft":
      cube.current.position.x -= speed;
      break;
    case "ArrowRight":
      cube.current.position.x += speed;
      break;
    default:
      break;
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
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
