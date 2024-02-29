"use client"
// components/ThreeScene.js
import { Canvas } from 'react-three-fiber';
import { Suspense } from 'react';
import { Html } from '@react-three/drei';

const Cube = () => {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color={0x00ff00} />
    </mesh>
  );
};

const ThreeScene = () => {
  return (
    <Canvas style={{ height: '100vh', width: '100vw' }}>
      <Suspense fallback={null}>
        <Cube />
        <Html center>
          <div style={{ color: 'white' }}>
            <h1>Hello World!</h1>
          </div>
        </Html>
      </Suspense>
    </Canvas>
  );
};

export default ThreeScene;