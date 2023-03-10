import * as THREE from "three";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader';

let mixer, model, fileAnimations;
var loader = new GLTFLoader();
let currentAnimation;

export function initFlag(scene, modelPath, position, rotation) {
    loader.load(
        modelPath,
        function(gltf) {
            const flagModel = gltf.scene;
            flagModel.scale.set(1, 1, 1);
            flagModel.position.x = position.x;
            flagModel.position.y = position.y;
            flagModel.position.z = position.z;

            flagModel.rotation.x = rotation.x;
            flagModel.rotation.y = rotation.y;
            scene.add(flagModel);
        },
        undefined,
        function(error) {
            console.error(error);
        }
    );
}

export function initCharacter(scene, modelPath, position, rotation) {
    let animation;
    loader.load(
        modelPath,
        function(gltf) {
            // A lot is going to happen here
            model = gltf.scene;
            fileAnimations = gltf.animations;
            model.scale.set(1, 1, 1);
            model.position.x = position.x;
            model.position.y = position.y;
            model.position.z = position.z;

            model.rotation.x = rotation.x;
            model.rotation.y = rotation.y;
            scene.add(model);
            mixer = new THREE.AnimationMixer(model);
            console.log(fileAnimations);
            animation = idleCharacter();
            animation.play();
        },
        undefined, // We don't need this export function
        function(error) {
            console.error(error);
        }
    );
    return animation;
}

export function idleCharacter() {
    let idleClip = THREE.AnimationClip.findByName(
        fileAnimations,
        "Idle"
    );
    const idleAnimation = mixer.clipAction(idleClip);
    idleAnimation.setLoop(THREE.LoopRepeat);
    currentAnimation = idleAnimation;
    return idleAnimation;
}


export function walkingCharacter() {
    const walkingClip = THREE.AnimationClip.findByName(
        fileAnimations,
        "WalkCycle"
    );
    const walkingAnimation = mixer.clipAction(walkingClip);
    walkingAnimation
        .setDuration(1.2)
        .setLoop(THREE.LoopRepeat)
    //walkingAnimation.play();
    currentAnimation = walkingAnimation;
    return walkingAnimation;
}

export function fallingCharacter() {
    const fallingClip = THREE.AnimationClip.findByName(
        fileAnimations,
        "FallingDown"
    );
    const fallingAnimation = mixer.clipAction(fallingClip);
    fallingAnimation
        .setDuration(2)
        .setLoop(THREE.LoopOnce)
    fallingAnimation.clampWhenFinished = true;
    return fallingAnimation;
}

export function sillyDancingCharacter() {
    const sillyDancingClip = THREE.AnimationClip.findByName(
        fileAnimations,
        "SillyDance001"
    );
    const sillyDancingAnimation = mixer.clipAction(sillyDancingClip);
    sillyDancingAnimation
        .setDuration(20)
        .setLoop(THREE.LoopRepeat)
    return sillyDancingAnimation;
}

export function turnRight() {
    const turnRightClip = THREE.AnimationClip.findByName(
        fileAnimations,
        "TurnRight"
    );
    const turnRightAnimation = mixer.clipAction(turnRightClip);
    turnRightAnimation
        .setLoop(THREE.LoopOnce)
    turnRightAnimation.clampWhenFinished = true;
    return turnRightAnimation;
}

export function turnLeft() {
    const turnLeftClip = THREE.AnimationClip.findByName(
        fileAnimations,
        "TurnLeft"
    );
    const turnLeftAnimation = mixer.clipAction(turnLeftClip);
    turnLeftAnimation
        .setLoop(THREE.LoopOnce)
    turnLeftAnimation.clampWhenFinished = true;
    return turnLeftAnimation;
}

export function animationTransition(fromAnimation, fromSpeed, toAnimation) {
    toAnimation.reset();
    toAnimation.play();
    fromAnimation.crossFadeTo(toAnimation, fromSpeed, true);
    currentAnimation = toAnimation;
}

export function getMixer() {
    return mixer;
}

export function getModel() {
    return model;
}

export function getCurrentAnimation() {
    return currentAnimation;
}

export function setCurrentAnimation(animation) {
    currentAnimation = animation;
}
