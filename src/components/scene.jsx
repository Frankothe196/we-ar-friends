/* eslint-disable */
import { OrbitControls, Torus } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Physics, RigidBody, CuboidCollider } from "@react-three/rapier";
import { Suspense, useEffect, useState, useRef } from "react";

import Character from "./character";

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useLoader } from '@react-three/fiber';

import bot from '../assets/models/Soldier.glb'

import { useAnimations } from "@react-three/drei"
import World from "./World.jsx";

const App = () => {

  const [index, setIndex] = useState(4)

  const [setPos,pos] = useState([0,0,0]);


  return (
    <Canvas style={{width: '100vw', height:'100vh'}}>
      <ambientLight intensity={1}/>
      <OrbitControls />
      <Character setPos={setPos} Pos={[0,0,0]} index={index} setIndex={setIndex}/>
      <World position={[3, -5, 30]}/>
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