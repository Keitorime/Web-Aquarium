import * as THREE from 'three';
import { initCore } from './core.js';
import { createEnvironment } from './environment.js';
import { initGame, fishes } from './game.js';
import { animateScene } from './animate.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Инициализация
const { scene } = initCore();
createEnvironment();
initGame();

// Загрузчик моделей
const loader = new GLTFLoader().setPath('public/');

// Конфигурация рыб
const fishConfigs = [
    { file: 'Lionfish.glb', scale: 0.2 },
    { file: 'Goldfish.glb', scale: 0.02 },
    { file: 'shark.glb', scale: 0.5 }
];

// Загрузка рыб
fishConfigs.forEach(cfg => {
    loader.load(cfg.file, (gltf) => {
        const mesh = gltf.scene;
        mesh.scale.set(cfg.scale, cfg.scale, cfg.scale);
        mesh.position.set(Math.random() * 4 - 2, 2, Math.random() * 4 - 2);
        mesh.traverse(child => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });

        const fish = {
            mesh,
            originalFile: cfg.file,
            angle: Math.random() * 100,
            offset: Math.random() * 100,
            target: new THREE.Vector3(),
            speed: 0.03,
            hunger: 100,
            mood: 100,
            isDead: false
        };
        fishes.push(fish);
        scene.add(mesh);
    });
});

// Объекты на песке
const sandObjects = [
    { file: 'chest.glb', scale: 0.07, pos: new THREE.Vector3(-4, 0.4, -2), rotY: Math.PI / 3 },
    { file: 'turtle.glb', scale: 0.6, pos: new THREE.Vector3(-1, 0.4, 1), rotY: -Math.PI / 4 },
    { file: 'coral.glb', scale: 0.19, pos: new THREE.Vector3(3.8, 0.7, -1.7), rotY: -Math.PI / 4 },
    { file: 'coral1.glb', scale: 1, pos: new THREE.Vector3(-4, 0.2, 1.8), rotY: Math.PI / 3 },
    { file: 'lotus.glb', scale: 50, pos: new THREE.Vector3(3, 1, 2), rotY: Math.PI / 3 },
    { file: 'grass.glb', scale: 1, pos: new THREE.Vector3(-5.6, 0.4, 40.8), rotY: Math.PI / 3 }
];

sandObjects.forEach(obj => {
    loader.load(obj.file, (gltf) => {
        const mesh = gltf.scene;
        mesh.scale.set(obj.scale, obj.scale, obj.scale);
        mesh.position.copy(obj.pos);
        mesh.rotation.y = obj.rotY;
        mesh.traverse(child => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });
        scene.add(mesh);
    }, undefined, console.error);
});

// Главный цикл анимации
function animate() {
    requestAnimationFrame(animate);
    animateScene();
}

animate();