/* eslint-disable */
import { OrbitControls, Torus } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Physics, RigidBody, CuboidCollider } from "@react-three/rapier";
import { Suspense, useEffect, useState, useRef } from "react";

import Character from "./character";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { useLoader } from "@react-three/fiber";

import bot from "../assets/models/Soldier.glb";
import { useAnimations } from "@react-three/drei";
import World from "./World.jsx";

import * as THREE from "three";

const App = () => {
  const fov = 60;
  const aspect = 1920 / 1080;
  const near = 1.0;
  const far = 500.0;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(25, 10, 25);

  return (
    <Canvas
      style={{ width: "100vw", height: "100vh" }}
      camera={camera}
      shadowMap
      shadows="true"
    >
      <Suspense>
        <ambientLight intensity={0.1} />
        {/* <OrbitControls /> */}
        <directionalLight
          position={[50, 100, -100]}
          intensity={1}
          castShadow={true}
          shadowBias={-0.001}
          shadow-camera-near={0.1}
          shadow-mapSize-width={4096}
          shadow-mapSize-height={4096}
          shadow-camera-far={120}
          shadow-camera-left={10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={10}
       />
        <perspectiveCamera {...camera} />
        <Character camera={camera} />
        <World position={[20, 15,100]} />
      </Suspense>
      {/* <Suspense>
        <Physics debug gravity={[0, -9.81, 0]}>
          <RigidBody colliders={"hull"} position={[0, 0, 0]} >
            <Character index={index} setIndex={setIndex}/>
          </RigidBody>
       
          <RigidBody colliders={"hull"} restitution={2}>
            <Torus />
          </RigidBody>
          <CuboidCollider position={[0, -5, 0]} args={[20, 0.5, 20]} />
            <World position={[3, -5, 30]}/>
        </Physics>
      </Suspense> */}
    </Canvas>
  );
};

export default App;
