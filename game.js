import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { scene, renderer, camera } from './core.js';
import { getDirtSpots, removeDirtSpot, createDirtSpot as createEnvDirtSpot } from './environment.js';

export let fishes = [];
export let action = null;
export let cleanMode = false;
export let score = Number(localStorage.getItem('score')) || 0;

const loader = new GLTFLoader().setPath('public/');
const HUNGER_DECAY = 0.05;
const MOOD_DECAY = 0.03;


const foodBtn = createButton('public/food.png', '20px', '20px');
const heartBtn = createButton('public/heart.jpg', '20px', '80px');
const spongeBtn = createButton('public/sponge.jpg', '20px', '140px');



export function initGame() {
    setupUI();
    setupClickHandlers();
    setupDirtSpawning();
}

function createButton(src, top, left) {
    const btn = document.createElement('img');
    btn.src = src;
    btn.style.position = 'absolute';
    btn.style.top = top;
    btn.style.left = left;
    btn.style.width = '50px';
    btn.style.cursor = 'pointer';
    btn.style.border = '2px solid black';
    btn.style.borderRadius = '8px';
    document.body.appendChild(btn);
    return btn;
}

function setupUI() {
    foodBtn.addEventListener('click', () => {
        action = 'feed';
        cleanMode = false;
    });

    heartBtn.addEventListener('click', () => {
        action = 'pet';
        cleanMode = false;
    });

    spongeBtn.addEventListener('click', () => {
        cleanMode = true;
        action = null;
    });
}

function setupClickHandlers() {
    renderer.domElement.addEventListener('pointerdown', handleClick);
}

function handleClick(event) {
    const rect = renderer.domElement.getBoundingClientRect();
    const mouse = new THREE.Vector2(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        -((event.clientY - rect.top) / rect.height) * 2 + 1
    );

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);

    // 👉 Режим очищення плям
    if (cleanMode) {
        const dirtSpotsArray = getDirtSpots();
        const hits = raycaster.intersectObjects(dirtSpotsArray);
        if (hits.length > 0) {
            const spot = hits[0].object;
            removeDirtSpot(spot);
            cleanMode = false;
            addScore(5);
        }
        return;
    }

    // Взаємодія з рибами
    const intersects = raycaster.intersectObjects(fishes.map(f => f.mesh), true);

    if (intersects.length > 0 && action) {
        let clicked = intersects[0].object;


        while (clicked.parent && !fishes.some(f => f.mesh === clicked)) {
            clicked = clicked.parent;
        }

        const fish = fishes.find(f => f.mesh === clicked);
        if (fish) {
            if (action === 'feed' && !fish.isDead) {
                fish.hunger = Math.min(100, fish.hunger + 20);
                addScore(5);
            }
            if (action === 'pet' && !fish.isDead) {
                fish.mood = Math.min(100, fish.mood + 20);
                addScore(10);
            }
        }
        action = null;
    }
}

function setupDirtSpawning() {
    setInterval(() => {
        const dirtSpotsArray = getDirtSpots();
        if (dirtSpotsArray.length < 15) {
            createEnvDirtSpot();
        }
    }, 5000);
}


export function addScore(points) {
    score += points;
    localStorage.setItem('score', score);
}

// --------------------------
// Fish Stats Update
// --------------------------
export function updateFishStats() {
    fishes.forEach(f => {
        if (!f.isDead) {
            f.hunger = Math.max(0, f.hunger - HUNGER_DECAY);
            f.mood = Math.max(0, f.mood - MOOD_DECAY);

            if (f.hunger <= 0) {
                f.isDead = true;
                killFish(f);
            }
        }
    });
}

function killFish(fish) {
    loader.load('dead.glb', (gltf) => {
        const pos = fish.mesh.position.clone();
        scene.remove(fish.mesh);

        const mesh = gltf.scene;
        mesh.scale.set(1.5, 1.5, 1.5);
        mesh.position.set(pos.x, 0.4, pos.z);
        mesh.rotation.set(0, 0, 0);

        scene.add(mesh);
        fish.mesh = mesh;

        // Перевіряємо, чи всі риби мертві
        const allDead = fishes.length > 0 && fishes.every(f => f.isDead);

        if (allDead) {
            endGame();
        }
    });
}

// --------------------------
// Game Over
// --------------------------
export function endGame() {
    saveToHallOfFame();

    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.inset = '0';
    overlay.style.background = 'rgba(0,0,0,0.7)';
    overlay.style.display = 'flex';
    overlay.style.flexDirection = 'column';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.color = 'white';
    overlay.style.fontSize = '24px';
    overlay.style.zIndex = '100';

    overlay.innerHTML = `
        <h1>Game Over</h1>
        <p>Score: ${score}</p>
    `;

    const backBtn = document.createElement('button');
    backBtn.innerText = 'Back to Menu';

    // Стиль кнопки
    backBtn.style.marginTop = '20px';
    backBtn.style.padding = '15px 30px';
    backBtn.style.fontSize = '20px';
    backBtn.style.border = 'none';
    backBtn.style.borderRadius = '10px';
    backBtn.style.cursor = 'pointer';
    backBtn.style.background = '#ffffff';
    backBtn.style.color = '#000';
    backBtn.style.boxShadow = '0 4px 10px rgba(0,0,0,0.3)';
    backBtn.onmouseover = () => backBtn.style.background = '#eee';
    backBtn.onmouseout = () => backBtn.style.background = '#ffffff';

    backBtn.onclick = () => window.location.href = 'index.html';

    overlay.appendChild(backBtn);
    document.body.appendChild(overlay);
}

function saveToHallOfFame() {
    const nickname = localStorage.getItem('nickname') || 'Unknown';
    const score = Number(localStorage.getItem('score'));

    const hall = JSON.parse(localStorage.getItem('hallOfFame')) || [];

    hall.push({
        name: nickname,
        score: score,
        date: new Date().toLocaleDateString()
    });

    hall.sort((a, b) => b.score - a.score);
    hall.splice(10); // залишаємо топ 10

    localStorage.setItem('hallOfFame', JSON.stringify(hall));
}