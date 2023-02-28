import * as THREE from "three";
import { sillyDancingCharacter, getCurrentAnimation, animationTransition, initCharacter, getMixer, getModel, walkingCharacter, idleCharacter, fallingCharacter, setCurrentAnimation, turnRight, turnLeft } from "./animationManager.js";
import { LEVEL1, LEVEL2 } from '../assets/maps.js';

// Set our main variables
let scene,
    renderer,
    camera,
    targetObject,
    map,
    isMoving = false,
    multiplier = 1,
    isRotating = false,
    clock = new THREE.Clock()// Used for anims, which run to a clock instead of frame rate

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

init();

function init() {
    // Set our maze map
    map = LEVEL2;
    const canvas = document.querySelector("#c");

    // Init the scene
    scene = new THREE.Scene();

    // Init the renderer
    renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    document.body.appendChild(renderer.domElement);

    // Add a camera
    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );

    camera.position.z = -map.length + 2;
    camera.position.y = map.length + 2;
    camera.position.x = map.length / 2;
    camera.rotation.y = -Math.PI;
    camera.rotation.z = Math.PI;
    camera.rotation.x = 0.7;

    targetObject = new THREE.Object3D();


    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.x = map[0].length;
    directionalLight.position.y = 0;
    directionalLight.position.z = -map.length;
    scene.add(directionalLight);

    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight2.position.x = 0;
    directionalLight2.position.y = map.length;
    directionalLight2.position.z = -map.length * 2;
    scene.add(directionalLight2);

    const planeGeo = new THREE.PlaneGeometry(map.length, map[0].length);
    const planeMat = new THREE.MeshBasicMaterial({
        color: 0x048c14,
        side: THREE.DoubleSide,
    });
    const plane = new THREE.Mesh(planeGeo, planeMat);
    scene.add(plane);
    plane.position.z = 0;
    plane.position.y = (map.length - 1) / 2;
    plane.position.x = (map[0].length - 1) / 2;

    // Create basic 3D green cube
    const boxGeo = new THREE.BoxGeometry(1, 1, 1);
    //const boxMat = new THREE.MeshBasicMaterial( { color: 0x00aa00, wireframe: true } );
    const boxMat = new THREE.MeshStandardMaterial({ color: "#6903ad" });

    for (let y = 0; y < map.length; ++y) {
        for (let x = 0; x < map[y].length; ++x) {
            if (map[y][x] == 1) {
                // Create 3D cube Mesh and adding them to the scene
                const cube = new THREE.Mesh(boxGeo, boxMat);
                //scene.add( cube );
                targetObject.add(cube);
                // Setting cube position based on map position
                cube.position.x = x;
                // Y position inverted because positive y goes up on threejs and goes down on out map
                cube.position.y = y;
            }
        }
    }
    directionalLight.target = targetObject;
    directionalLight2.target = targetObject;
    scene.add(directionalLight.target);
    initCharacter(scene, '../assets/MouseCharacter.glb', { x: 4, y: 4, z: -0.1 }, { x: -Math.PI / 2, y: Math.PI / 2 });
    document.body.addEventListener("keydown", moveCharacter);
}

const keyToFnMap = new Map();
keyToFnMap.set('ArrowUp', moveCharacterUp);
keyToFnMap.set('ArrowDown', moveCharacterDown);
keyToFnMap.set('ArrowLeft', moveCharacterLeft);
keyToFnMap.set('ArrowRight', moveCharacterRight);

const movingAction = { x: 0, y: 0 };
const targetPosition = { x: 0, y: 0 };
let targetYRotation = Math.PI / 2;
let isDown = false;
let shouldFall = false;
let countAnimation = 0;

function turnCharacter(characterYRotation, targetRotation) {
    targetYRotation = targetRotation;
    const diffRotation = characterYRotation - targetRotation;
    if (characterYRotation !== targetRotation) {
        isRotating = true;
        const currentAnimation = getCurrentAnimation();
        const rotationLeft = characterYRotation + Math.PI / 2 > Math.PI ? -Math.PI / 2 : characterYRotation + Math.PI / 2;
        const nextAnimation = rotationLeft === targetRotation ? turnLeft() : turnRight();
        if (Math.abs(diffRotation) === Math.PI || diffRotation === 0) {
            countAnimation = 1;
        }
        animationTransition(currentAnimation, 0, nextAnimation);
        multiplier = 2;
    }
}

function moveCharacterDown() {
    const character = getModel();
    if (character.position.y + 1 < map.length) {
        turnCharacter(character.rotation.y, 0);
        movingAction.x = 0;
        movingAction.y = 0.02;
        targetPosition.x = character.position.x;
        if (map[character.position.y + 1][character.position.x] != 1) {
            targetPosition.y = character.position.y + 1;
        }
        else {
            targetPosition.y = character.position.y + 0.3;
            shouldFall = true
        }
        return true;
    }
    return false;
}
function moveCharacterUp() {
    const character = getModel();
    if (character.position.y - 1 >= 0) {
        turnCharacter(character.rotation.y, Math.PI);
        movingAction.x = 0;
        movingAction.y = -0.02;
        targetPosition.x = character.position.x;
        if (map[character.position.y - 1][character.position.x] != 1) {
            targetPosition.y = character.position.y - 1;
        }
        else {
            targetPosition.y = character.position.y - 0.3;
            shouldFall = true;
        }
        return true;
    }
    return false;
}
function moveCharacterLeft() {
    const character = getModel();
    if (character.position.x - 1 >= 0) {
        turnCharacter(character.rotation.y, -Math.PI / 2);
        movingAction.x = -0.02;
        movingAction.y = 0;
        targetPosition.y = character.position.y;
        if (map[character.position.y][character.position.x - 1] != 1) {
            targetPosition.x = character.position.x - 1;
        }
        else {
            targetPosition.x = character.position.x - 0.3;
            shouldFall = true;
        }
        return true;
    }
    return false;
}
function moveCharacterRight() {
    const character = getModel();
    if (character.position.x + 1 < map[0].length) {
        turnCharacter(character.rotation.y, Math.PI / 2);
        movingAction.x = 0.02;
        movingAction.y = 0;
        targetPosition.y = character.position.y;
        if (map[character.position.y][character.position.x + 1] != 1) {
            targetPosition.x = character.position.x + 1;
        } else {
            targetPosition.x = character.position.x + 0.3;
            shouldFall = true;
        }
        return true;
    }
    return false;
}

function moveCharacter(e) {
    let playAnim = false;
    if (!isDown && !isMoving && keyToFnMap.has(e.key)) {
        playAnim = keyToFnMap.get(e.key)();
    }
    if (playAnim) {
        isMoving = true;
        if (!isRotating) {
            const currentAnimation = getCurrentAnimation();
            const nextAnimation = walkingCharacter();
            animationTransition(currentAnimation, 0, nextAnimation);
        }
    }
}

function update() {
    const mixer = getMixer();
    const character = getModel();
    let skip_rendering = false;
    if (mixer) {
        mixer.update(clock.getDelta() * multiplier);
        const currentAnimation = getCurrentAnimation();
        if (isRotating && (currentAnimation === turnRight() || currentAnimation === turnLeft()) && !currentAnimation.isRunning()) {
            skip_rendering = true;
            if (countAnimation === 0) {
                const nextAnimation = walkingCharacter();
                animationTransition(currentAnimation, 0, nextAnimation);
                character.rotation.y = targetYRotation;
                isRotating = false;
                multiplier = 1;
            } else {
                if (character.rotation.y === -Math.PI / 2 && currentAnimation === turnRight()) {
                    character.rotation.y = Math.PI
                } else {
                    character.rotation.y += currentAnimation === turnLeft() ? Math.PI / 2 : -Math.PI / 2;
                }
                countAnimation -= 1;
                animationTransition(currentAnimation, 0, currentAnimation);
            }
        }
        else if (!isRotating && isMoving && (character.position.x !== targetPosition.x || character.position.y !== targetPosition.y)) {
            character.position.x += movingAction.x;
            character.position.x = parseFloat((Math.round(character.position.x * 100) / 100).toFixed(2))
            character.position.y += movingAction.y;
            character.position.y = parseFloat((Math.round(character.position.y * 100) / 100).toFixed(2))
            if (character.position.x === targetPosition.x && character.position.y === targetPosition.y) {
                isMoving = false;
                let nextAnimation;
                if (targetPosition.x === 8 && targetPosition.y === 6) {
                    character.rotation.y = 0;
                    nextAnimation = sillyDancingCharacter();
                } else if (shouldFall) {
                    nextAnimation = fallingCharacter();
                    isDown = true
                } else {
                    nextAnimation = idleCharacter();
                }
                animationTransition(currentAnimation, 0.2, nextAnimation);
            }
        }
    }

    if (resizeRendererToDisplaySize(renderer)) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
    }
    if (!skip_rendering) {
        renderer.render(scene, camera);
    }
    requestAnimationFrame(update);
}

update();

function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    let width = window.innerWidth;
    let height = window.innerHeight;
    let canvasPixelWidth = canvas.width / window.devicePixelRatio;
    let canvasPixelHeight = canvas.height / window.devicePixelRatio;

    const needResize = canvasPixelWidth !== width || canvasPixelHeight !== height;
    if (needResize) {
        renderer.setSize(width, height, false);
    }
    return needResize;
}
