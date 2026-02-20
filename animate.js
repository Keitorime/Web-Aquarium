import * as THREE from 'three';
import { scene, renderer, camera, controls } from './core.js';
import { fishes, updateFishStats } from './game.js';

export function animateScene() {
    updateFishMovement();
    updateFishStats();
    drawBars();
    controls.update();
    renderer.render(scene, camera);
}

function updateFishMovement() {
    fishes.forEach(f => {
        if (!f.isDead) {
            f.angle += 0.002;
            const newX = Math.sin(f.angle + f.offset) * 2;
            const newZ = Math.cos(f.angle * 1.1 + f.offset) * 1.5;
            const newY = 1.8 + Math.sin(f.angle * 2 + f.offset) * 0.3;

            f.target.set(newX, newY, newZ);
            f.mesh.position.lerp(f.target, f.speed);

            const dir = new THREE.Vector3().subVectors(f.target, f.mesh.position).normalize();
            if (dir.length() > 0.001) {
                const quaternion = new THREE.Quaternion();
                quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), dir);
                f.mesh.quaternion.slerp(quaternion, 0.05);
            }
        }
    });
}

function drawBars() {
    fishes.forEach(f => {
        // Remove old bars
        if (f.hungerBar) scene.remove(f.hungerBar);
        if (f.hungerBarOutline) scene.remove(f.hungerBarOutline);
        if (f.moodBar) scene.remove(f.moodBar);
        if (f.moodBarOutline) scene.remove(f.moodBarOutline);

        const barWidth = 0.8;
        const barHeight = 0.1;
        const barDepth = 0.05;

        // Hunger bar
        const hungerGeom = new THREE.BoxGeometry(barWidth * (f.hunger / 100), barHeight, barDepth);
        const hungerMat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
        f.hungerBar = new THREE.Mesh(hungerGeom, hungerMat);
        f.hungerBar.position.set(f.mesh.position.x, f.mesh.position.y + 1, f.mesh.position.z);
        scene.add(f.hungerBar);

        const hungerOutlineGeom = new THREE.EdgesGeometry(new THREE.BoxGeometry(barWidth, barHeight, barDepth));
        const hungerOutlineMat = new THREE.LineBasicMaterial({ color: 0x000000 });
        f.hungerBarOutline = new THREE.LineSegments(hungerOutlineGeom, hungerOutlineMat);
        f.hungerBarOutline.position.set(f.mesh.position.x, f.mesh.position.y + 1, f.mesh.position.z);
        scene.add(f.hungerBarOutline);

        // Mood bar
        const moodGeom = new THREE.BoxGeometry(barWidth * (f.mood / 100), barHeight, barDepth);
        const moodMat = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        f.moodBar = new THREE.Mesh(moodGeom, moodMat);
        f.moodBar.position.set(f.mesh.position.x, f.mesh.position.y + 1.15, f.mesh.position.z);
        scene.add(f.moodBar);

        const moodOutlineGeom = new THREE.EdgesGeometry(new THREE.BoxGeometry(barWidth, barHeight, barDepth));
        const moodOutlineMat = new THREE.LineBasicMaterial({ color: 0x000000 });
        f.moodBarOutline = new THREE.LineSegments(moodOutlineGeom, moodOutlineMat);
        f.moodBarOutline.position.set(f.mesh.position.x, f.mesh.position.y + 1.15, f.mesh.position.z);
        scene.add(f.moodBarOutline);
    });
}