import { Suspense, useCallback, useEffect, useRef, useState } from "react";

import { OrbitControls, Torus, useGLTF } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Physics, RigidBody, CuboidCollider } from "@react-three/rapier";

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useLoader } from '@react-three/fiber';

import WorldModel from '../assets/models/kicc.glb';

import { useAnimations } from "@react-three/drei";

import * as THREE from 'three';

const World = ({position}) => {
    const model = useGLTF(WorldModel, true)
   
    return <Model url={WorldModel} castShadow position={position}/>
}

function Model({ url, ...props }) {
    const gltfRef = useRef();
  
    useEffect(() => {
      const loader = new GLTFLoader();
      loader.load(url, (gltf) => {
        gltf.scene.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true; // Enable shadow casting for each mesh in the model
            child.receiveShadow = true; // Enable shadow receive for each mesh in the model
          }
        });
        gltfRef.current.add(gltf.scene);
      });
    }, [url]);
  
    return <group ref={gltfRef} {...props}/>;
  }

export default World;
