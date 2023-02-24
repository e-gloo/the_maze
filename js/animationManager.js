import * as THREE from "three";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader';

let mixer, model, fileAnimations;
var loader = new GLTFLoader();
let currentAnimation;

export function initCharacter(scene, modelPath, position, rotation) {
    let animation;
    loader.load(
        modelPath,
        async function(gltf) {
            // A lot is going to happen here
            model = gltf.scene;
            fileAnimations = gltf.animations;
            model.scale.set(1, 1, 1);
            model.position.x = position.x;
            model.position.y = position.y;
            model.position.z = position.z;
            //            model.position.x = 1;
            //            model.position.y = 2;
            //            model.position.z = -0.1;

            //            model.rotation.x = -Math.PI / 2;
            //            model.rotation.y = Math.PI / 2;
            model.rotation.x = -Math.PI / 2;
            model.rotation.y = Math.PI / 2;
            scene.add(model);
            //loaderAnim.remove();
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
        "idle"
    );
    const idleAnimation = mixer.clipAction(idleClip);
    idleAnimation.setLoop(THREE.LoopRepeat);
    //idleAnimation.play();
    currentAnimation = idleAnimation;
    return idleAnimation;
}


export function walkingCharacter() {
    const walkingClip = THREE.AnimationClip.findByName(
        fileAnimations,
        "walking_in_place"
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
        "falling"
    );
    const fallingAnimation = mixer.clipAction(fallingClip);
    fallingAnimation
        .setDuration(1.5)
        .setLoop(THREE.LoopOnce)
    fallingAnimation.clampWhenFinished = true;
    //fallingAnimation.play();
    return fallingAnimation;
}

export function sillyDancingCharacter() {
    const sillyDancingClip = THREE.AnimationClip.findByName(
        fileAnimations,
        "silly_dancing"
    );
    const sillyDancingAnimation = mixer.clipAction(sillyDancingClip);
    sillyDancingAnimation
        .setDuration(10)
        .setLoop(THREE.LoopRepeat)
    //sillyDancingAnimation.clampWhenFinished = true;
    //fallingAnimation.play();
    return sillyDancingAnimation;
}

export function animationTransition(fromAnimation, fromSpeed, toAnimation) {
    toAnimation.reset();
    toAnimation.play();
    fromAnimation.crossFadeTo(toAnimation, fromSpeed, true);
    //fromAnimation.stop();
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
