/* eslint-disable */
import { OrbitControls, Torus, useGLTF } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Physics, RigidBody, CuboidCollider } from "@react-three/rapier";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useLoader } from '@react-three/fiber';

import WorldModel from '../assets/models/kicc.glb';

import { useAnimations } from "@react-three/drei";

import * as THREE from 'three';

const World = ({position}) => {
    const model = useGLTF(WorldModel, true)
    return <primitive scale={[1, 1, 1]} position={position} material={model.materials} object={model.scene} />;
}

export default World;
