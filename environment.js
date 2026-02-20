import * as THREE from 'three';
import { scene } from './core.js';

export let ground, aquarium, water, waves, sand;
export let dirtSpots = []; // Экспортируем массив плям грязи

export function createEnvironment() {
    // --------------------------
    // Ground
    // --------------------------
    const groundGeometry = new THREE.PlaneGeometry(20, 20);
    groundGeometry.rotateX(-Math.PI / 2);
    const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
    ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.receiveShadow = true;
    scene.add(ground);

    // --------------------------
    // Aquarium
    // --------------------------
    const aquariumMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x88ccff,
        transparent: true,
        opacity: 0.15,
        roughness: 0,
        metalness: 0,
        reflectivity: 0.9,
        ior: 1.45,
        side: THREE.DoubleSide
    });
    aquarium = new THREE.Mesh(new THREE.BoxGeometry(10, 5, 6), aquariumMaterial);
    aquarium.position.y = 2.5;
    aquarium.renderOrder = 1;
    scene.add(aquarium);

    // Aquarium edges
    const edges = new THREE.EdgesGeometry(aquarium.geometry);
    const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0xffffff }));
    line.position.copy(aquarium.position);
    scene.add(line);

    // --------------------------
    // Water
    // --------------------------
    const waterMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x3366cc,
        transparent: true,
        opacity: 0.5,
        roughness: 0,
        metalness: 0,
        reflectivity: 0.6,
        ior: 1.33,
        side: THREE.DoubleSide
    });
    water = new THREE.Mesh(new THREE.BoxGeometry(9.8, 4.8, 5.8), waterMaterial);
    water.position.y = 2.2;
    water.renderOrder = 0;
    scene.add(water);

    // --------------------------
    // Waves
    // --------------------------
    const wavesGeometry = new THREE.PlaneGeometry(9.8, 5.8, 80, 80);
    wavesGeometry.rotateX(-Math.PI / 2);

    const pos = wavesGeometry.attributes.position;
    for (let i = 0; i < pos.count; i++) {
        const y = pos.getY(i);
        pos.setY(i, y + (Math.random() - 0.5) * 0.2);
    }
    wavesGeometry.computeVertexNormals();

    const wavesMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x66aaff,
        transparent: true,
        opacity: 0.25,
        roughness: 0.1,
        metalness: 0,
        side: THREE.DoubleSide
    });

    waves = new THREE.Mesh(wavesGeometry, wavesMaterial);
    waves.position.y = 2.18 + 2.4 + 0.01;
    scene.add(waves);

    // --------------------------
    // Sand
    // --------------------------
    const sandWidth = 9.7;
    const sandHeight = 0.3;
    const sandDepth = 5.7;

    const sandGeometry = new THREE.BoxGeometry(sandWidth, sandHeight, sandDepth, 50, 1, 50);
    const position = sandGeometry.attributes.position;
    for (let i = 0; i < position.count; i++) {
        const y = position.getY(i);
        if (y > 0) position.setY(i, y + Math.random() * 0.05);
    }
    sandGeometry.computeVertexNormals();

    const sandTexture = new THREE.TextureLoader().load('public/sand1.jpg');
    sandTexture.wrapS = sandTexture.wrapT = THREE.RepeatWrapping;
    sandTexture.repeat.set(4, 4);

    const sandNormal = new THREE.TextureLoader().load('public/sand1.jpg');
    sandNormal.wrapS = sandNormal.wrapT = THREE.RepeatWrapping;
    sandNormal.repeat.set(4, 4);

    const sandMaterial = new THREE.MeshStandardMaterial({
        map: sandTexture,
        normalMap: sandNormal,
        roughness: 1,
        metalness: 0
    });

    sand = new THREE.Mesh(sandGeometry, sandMaterial);
    sand.position.y = sandHeight / 2;
    scene.add(sand);

    // --------------------------
    // Lights
    // --------------------------
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const spotLight = new THREE.SpotLight(0xffffff, 1.8);
    spotLight.position.set(5, 10, 5);
    spotLight.castShadow = true;
    scene.add(spotLight);

    const bottomLight = new THREE.PointLight(0xffffff, 0.5, 20);
    bottomLight.position.set(0, 0.5, 0);
    scene.add(bottomLight);

    const sideLight1 = new THREE.PointLight(0xffffff, 0.5, 20);
    sideLight1.position.set(-5, 3, 0);
    scene.add(sideLight1);

    const sideLight2 = new THREE.PointLight(0xffffff, 0.5, 20);
    sideLight2.position.set(5, 3, 0);
    scene.add(sideLight2);
}

export function getDirtSpots() {
    return dirtSpots;
}

export function removeDirtSpot(spot) {
    const index = dirtSpots.indexOf(spot);
    if (index > -1) {
        dirtSpots.splice(index, 1);
        scene.remove(spot);
    }
}

export function createDirtSpot() {
    const dirtMaterial = new THREE.MeshBasicMaterial({
        color: 0x553311,
        transparent: true,
        opacity: 0.35,
        depthWrite: false
    });

    const size = Math.random() * 0.4 + 0.2;
    const geom = new THREE.PlaneGeometry(size, size);
    const spot = new THREE.Mesh(geom, dirtMaterial);

    const side = Math.floor(Math.random() * 4); // 0–3
    const y = Math.random() * 4 + 0.5;

    switch (side) {
        case 0:
            spot.position.set(
                (Math.random() - 0.5) * 9,
                y,
                3.01
            );
            spot.rotation.y = Math.PI;
            break;

        case 1:
            spot.position.set(
                (Math.random() - 0.5) * 9,
                y,
                -3.01
            );
            spot.rotation.y = 0;
            break;

        case 2:
            spot.position.set(
                -5.01,
                y,
                (Math.random() - 0.5) * 5.5
            );
            spot.rotation.y = Math.PI / 2;
            break;

        case 3:
            spot.position.set(
                5.01,
                y,
                (Math.random() - 0.5) * 5.5
            );
            spot.rotation.y = -Math.PI / 2;
            break;
    }

    spot.userData.isDirt = true;
    dirtSpots.push(spot);
    scene.add(spot);
}