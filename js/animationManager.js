import * as THREE from "three";
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader';

let mixer;
let model;
let fileAnimations;
var loader = new GLTFLoader();

export function initCharacter(scene, modelPath, position, rotation) {
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
            idleCharacter();
        },
        undefined, // We don't need this export function
        function(error) {
            console.error(error);
        }
    );
}

export function idleCharacter() {
    let idleAnim = THREE.AnimationClip.findByName(
        fileAnimations,
        "idle"
    );
    const idle = mixer.clipAction(idleAnim);
    idle.setLoop(THREE.LoopRepeat);
    idle.play();
}

export function getMixer() {
    return mixer;
}

export function getModel() {
    return model;
}

export function walkingCharacter() {
    mixer
        .clipAction(
            THREE.AnimationClip.findByName(
                fileAnimations,
                "walking_in_place"
            )
        )
        .setDuration(1.2)
        .setLoop(THREE.LoopRepeat)
        .play();
}


//module.exports = { initCharacter, getMixer, getModel, walkingCharacter, idleCharacter }
