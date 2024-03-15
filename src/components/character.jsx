import React from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
// import { Physics, RigidBody, CuboidCollider } from "@react-three/rapier";
import { useCallback, useEffect, useRef } from "react";

import bot from "../assets/models/Xbot.glb";

import * as THREE from "three";
import { isCompositeComponent } from "react-dom/test-utils";

const Character = ({ camera }) => {
  // const model = useLoader(GLTFLoader, bot);

  const model = useGLTF(bot, true);

  useEffect(()=>{
    model.scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true; // Enable shadow casting for each mesh in the model
        child.receiveShadow = true; // Enable shadow receive for each mesh in the model
      }
    })

  },[]
  )

  // Extract animation actions
  // const { ref, actions, names } = useAnimations(model.animations)
  const group = useRef(); // Reference to the model's group for animations
  // const { actions } = useAnimations(model.animations, group); // Access animations

  // Here's the animation part
  let mixer = new THREE.AnimationMixer(model.scene);
  // console.log(model.animations);
  const animations = {};
  animations["idle"] = {
    clip: mixer.clipAction(model.animations[2]),
  };

  animations["walk"] = {
    clip: mixer.clipAction(model.animations[6]),
  };

  animations["run"] = {
    clip: mixer.clipAction(model.animations[3]),
  };

  animations["dance"] = {
    clip: mixer.clipAction(model.animations[0]),
  };

  // set current Action
  let currAction = animations["idle"].clip;
  let prevAction;
  const activeAnimation = {
    forward: false,
    backward: false,
    left: false,
    right: false,
    run: false,
    dance: false,
  };

  // Movements
  const currentPosition = new THREE.Vector3();
  const currentLookAt = new THREE.Vector3();
  const decceleration = new THREE.Vector3(-0.0005, -0.0001, -5.0);
  const acceleration = new THREE.Vector3(1, 0.125, 20.0);
  const velocity = new THREE.Vector3(0, 0, 0);

  const characterState = (delta) => {
    const newVelocity = velocity;
    const frameDecceleration = new THREE.Vector3(
      newVelocity.x * decceleration.x,
      newVelocity.y * decceleration.y,
      newVelocity.z * decceleration.z
    );
    frameDecceleration.multiplyScalar(delta);
    frameDecceleration.z =
      Math.sign(frameDecceleration.z) *
      Math.min(Math.abs(frameDecceleration.z), Math.abs(newVelocity.z));

    newVelocity.add(frameDecceleration);

    const controlObject = group.current;
    const _Q = new THREE.Quaternion();
    const _A = new THREE.Vector3();
    const _R = controlObject.quaternion.clone();

    const acc = acceleration.clone();
    if (activeAnimation.run) {
      acc.multiplyScalar(2.0);
    }

    // if (currAction === animations["dance"].clip) {
    //   acc.multiplyScalar(0.0);
    // }

    if (activeAnimation.forward) {
      newVelocity.z += acc.z * delta;
    }
    if (activeAnimation.backward) {
      newVelocity.z -= acc.z * delta;
    }
    if (activeAnimation.left) {
      _A.set(0, 1, 0);
      _Q.setFromAxisAngle(_A, 4.0 * Math.PI * delta * acceleration.y);
      _R.multiply(_Q);
    }
    if (activeAnimation.right) {
      _A.set(0, 1, 0);
      _Q.setFromAxisAngle(_A, 4.0 * -Math.PI * delta * acceleration.y);
      _R.multiply(_Q);
    }

    controlObject.quaternion.copy(_R);

    const oldPosition = new THREE.Vector3();
    oldPosition.copy(controlObject.position);

    const forward = new THREE.Vector3(0, 0, 1);
    forward.applyQuaternion(controlObject.quaternion);
    forward.normalize();

    const sideways = new THREE.Vector3(1, 0, 0);
    sideways.applyQuaternion(controlObject.quaternion);
    sideways.normalize();

    sideways.multiplyScalar(newVelocity.x * delta);
    forward.multiplyScalar(newVelocity.z * delta);

    controlObject.position.add(forward);
    controlObject.position.add(sideways);

    group.current.position.copy(controlObject.position);
    updateCameraTarget(delta);
  };

  // Movements end

  // Camera

  const calculateIdealOffset = () => {
    const idealOffset = new THREE.Vector3(0, 2, -2);
    idealOffset.applyQuaternion(group.current.quaternion);
    idealOffset.add(group.current.position);
    return idealOffset;
  };

  const calculateIdealLookat = () => {
    const idealLookat = new THREE.Vector3(0, 2, 50);
    idealLookat.applyQuaternion(group.current.quaternion);
    idealLookat.add(group.current.position);
    return idealLookat;
  };

  function updateCameraTarget(delta) {
    const idealOffset = calculateIdealOffset();
    const idealLookat = calculateIdealLookat();

    const t = 1.0 - Math.pow(0.01, delta);

    currentPosition.lerp(idealOffset, t);
    currentLookAt.lerp(idealLookat, t);

    camera.position.copy(currentPosition);
  }

  useFrame((state, delta) => {
    prevAction = currAction;

    if (activeAnimation.forward) {
      if (activeAnimation.run) {
        currAction = animations["run"].clip;
      } else {
        currAction = animations["walk"].clip;
      }
    } else if (activeAnimation.left) {
      if (activeAnimation.run) {
        currAction = animations["run"].clip;
      } else {
        currAction = animations["walk"].clip;
      }
    } else if (activeAnimation.right) {
      if (activeAnimation.run) {
        currAction = animations["run"].clip;
      } else {
        currAction = animations["walk"].clip;
      }
    } else if (activeAnimation.backward) {
      if (activeAnimation.run) {
        currAction = animations["run"].clip;
      } else {
        currAction = animations["walk"].clip;
      }
    } else if (activeAnimation.dance) {
      currAction = animations["dance"].clip;
    } else {
      currAction = animations["idle"].clip;
    }

    if (prevAction !== currAction) {
      prevAction.fadeOut(0.2);

      if (prevAction === animations["walk"].clip) {
        const ratio =
          currAction.getClip().duration / prevAction.getClip().duration;
        currAction.time = prevAction.time * ratio;
      }

      currAction.reset().play();
    } else {
      currAction.play();
    }

    characterState(delta);
    const idealLookat = calculateIdealLookat();

    state.camera.lookAt(idealLookat);
    state.camera.updateProjectionMatrix();

    characterState(delta);
    mixer?.update(delta);
  });

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);

    document.addEventListener("keyup", handleKeyUp);
    currAction.play();
    return () => {
      document.removeEventListener("keydown", handleKeyPress);

      document.removeEventListener("keyup", handleKeyUp);
    };
  });

  // Control Input
  const handleKeyPress = useCallback((event) => {
    // console.log(group.current);
    switch (event.keyCode) {
      case 87: //w
        activeAnimation.forward = true;
        //   setPos(curr=>curr[0] += 0.1)
        break;

      case 65: //a
        activeAnimation.left = true;

        break;

      case 83: //s
        activeAnimation.backward = true;

        break;

      case 68: // d
        activeAnimation.right = true;

        break;

      case 69: //e dance
        activeAnimation.dance = true;

        break;
      case 16: // shift
        activeAnimation.run = true;
        break;
    }
  }, []);

  const handleKeyUp = useCallback((event) => {
    switch (event.keyCode) {
      case 87: //w
        activeAnimation.forward = false;
        break;

      case 65: //a
        activeAnimation.left = false;
        break;

      case 83: //s
        activeAnimation.backward = false;
        break;

      case 68: // d
        activeAnimation.right = false;
        break;

      case 69: //e dance
        activeAnimation.dance = false;
        break;

      case 16: // shift
        activeAnimation.run = false;
        break;
    }
  }, []);

  return (
    <primitive ref={group} material={model.materials} object={model.scene} castShadow receiveShadow/>
  );
};

export default Character;
