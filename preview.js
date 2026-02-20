// --------------------------
// Clear & base styles
// --------------------------
document.body.innerHTML = '';
document.body.style.margin = '0';
document.body.style.display = 'flex';
document.body.style.flexDirection = 'column';
document.body.style.justifyContent = 'center';
document.body.style.alignItems = 'center';
document.body.style.height = '100vh';
document.body.style.background = 'linear-gradient(#88ccff, #003366)';
document.body.style.fontFamily = 'Arial';
document.body.style.overflow = 'hidden';

// --------------------------
// Title
// --------------------------
const title = document.createElement('h1');
title.innerText = 'Aquarium Game';
title.style.color = 'white';
title.style.marginBottom = '40px';
document.body.appendChild(title);

// --------------------------
// Buttons
// --------------------------
const startBtn = document.createElement('button');
startBtn.innerText = 'Start';
styleButton(startBtn);
document.body.appendChild(startBtn);

const hofBtn = document.createElement('button');
hofBtn.innerText = 'Hall of Fame';
styleButton(hofBtn);
document.body.appendChild(hofBtn);

// Додаємо нову кнопку How to Play
const howToPlayBtn = document.createElement('button');
howToPlayBtn.innerText = 'How to Play';
styleButton(howToPlayBtn);
document.body.appendChild(howToPlayBtn);

// --------------------------
// Button style
// --------------------------
function styleButton(btn) {
    btn.style.width = '220px';
    btn.style.padding = '15px';
    btn.style.margin = '10px';
    btn.style.fontSize = '20px';
    btn.style.borderRadius = '10px';
    btn.style.border = 'none';
    btn.style.cursor = 'pointer';
    btn.style.background = '#ffffff';
    btn.style.boxShadow = '0 4px 10px rgba(0,0,0,0.3)';
    btn.onmouseover = () => btn.style.background = '#eee';
    btn.onmouseout = () => btn.style.background = '#ffffff';
}

// --------------------------
// START - красивий оверлей для ніку
// --------------------------
startBtn.onclick = () => {
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.inset = '0';
    overlay.style.background = 'rgba(0,0,50,0.85)';
    overlay.style.display = 'flex';
    overlay.style.flexDirection = 'column';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.style.zIndex = '100';

    const box = document.createElement('div');
    box.style.background = 'white';
    box.style.padding = '30px 40px';
    box.style.borderRadius = '15px';
    box.style.textAlign = 'center';
    box.style.display = 'flex';
    box.style.flexDirection = 'column';
    box.style.alignItems = 'center';
    box.style.minWidth = '300px';

    const h2 = document.createElement('h2');
    h2.innerText = 'Enter your nickname';
    h2.style.marginBottom = '20px';
    h2.style.color = '#000';
    h2.style.fontFamily = 'Arial, sans-serif';
    box.appendChild(h2);

    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Your nickname';
    input.style.padding = '12px 15px';
    input.style.fontSize = '18px';
    input.style.borderRadius = '10px';
    input.style.border = '1px solid #ccc';
    input.style.marginTop = '15px';
    input.style.width = '80%';
    input.style.outline = 'none';
    input.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.1)';
    box.appendChild(input);

    // Створюємо елемент для повідомлення про помилку
    const errorMsg = document.createElement('div');
    errorMsg.style.color = 'red';
    errorMsg.style.fontSize = '14px';
    errorMsg.style.marginTop = '5px';
    errorMsg.style.minHeight = '20px';
    errorMsg.style.display = 'none';
    box.appendChild(errorMsg);

    const btn = document.createElement('button');
    btn.innerText = 'Start Game';
    btn.style.marginTop = '20px';
    btn.style.padding = '12px 25px';
    btn.style.fontSize = '18px';
    btn.style.borderRadius = '10px';
    btn.style.border = 'none';
    btn.style.cursor = 'pointer';
    btn.style.background = '#ffffff';
    btn.style.color = '#000';
    btn.style.boxShadow = '0 4px 10px rgba(0,0,0,0.3)';
    btn.style.transition = '0.2s';
    btn.onmouseover = () => btn.style.background = '#eee';
    btn.onmouseout = () => btn.style.background = '#ffffff';
    box.appendChild(btn);

    overlay.appendChild(box);
    document.body.appendChild(overlay);

    // Додаємо фокус на інпут при відкритті
    input.focus();

    // Функція для перевірки імені
    function validateName() {
        const nickname = input.value.trim();
        if (!nickname) {
            errorMsg.innerText = 'Please enter your nickname!';
            errorMsg.style.display = 'block';
            input.style.borderColor = 'red';
            input.style.boxShadow = '0 0 0 1px red';
            return false;
        }

        errorMsg.style.display = 'none';
        input.style.borderColor = '#4CAF50';
        input.style.boxShadow = '0 0 0 1px #4CAF50';
        return true;
    }

    // Перевірка при кожному введенні
    input.addEventListener('input', () => {
        validateName();
    });

    // Перевірка при натисканні Enter
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            if (validateName()) {
                const nickname = input.value.trim();
                localStorage.setItem('nickname', nickname);
                localStorage.setItem('score', '0');
                window.location.href = 'game.html';
            }
        }
    });

    btn.onclick = () => {
        if (validateName()) {
            const nickname = input.value.trim();
            localStorage.setItem('nickname', nickname);
            localStorage.setItem('score', '0');
            window.location.href = 'game.html';
        }
    };
};


// --------------------------
// HALL OF FAME - красивий оверлей
// --------------------------
hofBtn.onclick = () => {
    const records = JSON.parse(localStorage.getItem('hallOfFame') || '[]');

    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.inset = '0';
    overlay.style.background = 'rgba(0,0,50,0.95)';
    overlay.style.display = 'flex';
    overlay.style.flexDirection = 'column';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.style.color = 'white';
    overlay.style.padding = '40px';
    overlay.style.overflowY = 'auto';
    overlay.style.zIndex = '100';

    let content = `<h2>🏆 Hall of Fame</h2>`;
    if (records.length === 0) {
        content += `<p>No records yet.</p>`;
    } else {
        content += `<ol style="font-size: 20px; line-height: 1.6;">`;
        records.forEach(r => {
            content += `<li>${r.name} — ${r.score}</li>`;
        });
        content += `</ol>`;
    }
    content += `<button id="closeHof" style="
        margin-top: 25px;
        padding: 12px 25px;
        font-size: 18px;
        border-radius: 10px;
        border: none;
        cursor: pointer;
        background: #ffffff;
        color: #000;
        box-shadow: 0 4px 10px rgba(0,0,0,0.3);
    ">Close</button>`;

    overlay.innerHTML = content;
    document.body.appendChild(overlay);

    document.getElementById('closeHof').onclick = () => overlay.remove();
};

// --------------------------
// HOW TO PLAY - інструкція
// --------------------------
howToPlayBtn.onclick = () => {
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.inset = '0';
    overlay.style.background = 'rgba(0,0,50,0.95)';
    overlay.style.display = 'flex';
    overlay.style.flexDirection = 'column';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.style.color = 'white';
    overlay.style.padding = '40px';
    overlay.style.overflowY = 'auto';
    overlay.style.zIndex = '100';

    let content = `<h2>How to Play</h2>`;

    content += `
        <div style="text-align: left; max-width: 600px;">
            <p style="font-size: 20px; line-height: 1.6; margin-bottom: 20px;">
                Welcome to Aquarium Game! You have 3 fish to take care of. 
                Your job is to keep them happy and healthy.
            </p>
            
            <h3 style="color: #88ccff; margin-top: 25px;">🍖 Feeding Fish</h3>
            <p style="font-size: 18px; line-height: 1.6; margin-bottom: 15px;">
                1. Click on the <strong>food icon</strong> in the top-left corner<br>
                2. Click on any fish to feed it<br>
                3. This fills up the <strong style="color: red;">red hunger bar</strong>
            </p>
            
            <h3 style="color: #88ccff; margin-top: 25px;">💖 Petting Fish</h3>
            <p style="font-size: 18px; line-height: 1.6; margin-bottom: 15px;">
                1. Click on the <strong>heart icon</strong><br>
                2. Click on any fish to pet it<br>
                3. This fills up the <strong style="color: #00ff00;">green mood bar</strong>
            </p>
            
            <h3 style="color: #88ccff; margin-top: 25px;">🧽 Cleaning Aquarium</h3>
            <p style="font-size: 18px; line-height: 1.6; margin-bottom: 15px;">
                1. Click on the <strong>sponge icon</strong><br>
                2. Click on dirt spots that appear on the glass<br>
                3. Keep your aquarium clean!
            </p>
            
            <h3 style="color: #88ccff; margin-top: 25px;">⚠️ Important</h3>
            <ul style="font-size: 18px; line-height: 1.6; padding-left: 20px;">
                <li>Fish will die if hunger reaches zero!</li>
                <li>Check the bars above each fish regularly</li>
                <li>Clean dirt spots before they build up</li>
                <li>The game ends when all fish die</li>
                <li>Earn points for every action</li>
            </ul>
        </div>
    `;

    content += `<button id="closeHowTo" style="
        margin-top: 25px;
        padding: 12px 25px;
        font-size: 18px;
        border-radius: 10px;
        border: none;
        cursor: pointer;
        background: #ffffff;
        color: #000;
        box-shadow: 0 4px 10px rgba(0,0,0,0.3);
    ">Close</button>`;

    overlay.innerHTML = content;
    document.body.appendChild(overlay);

    document.getElementById('closeHowTo').onclick = () => overlay.remove();
};

// --------------------------
// BUBBLES
// --------------------------
function spawnBubble() {
    const bubble = document.createElement('div');

    const size = Math.random() * 12 + 6;
    const x = Math.random() * window.innerWidth;

    bubble.style.position = 'fixed';
    bubble.style.left = `${x}px`;
    bubble.style.bottom = `-30px`;
    bubble.style.width = bubble.style.height = `${size}px`;
    bubble.style.border = '2px solid rgba(255,255,255,0.6)';
    bubble.style.borderRadius = '50%';
    bubble.style.opacity = '0.6';
    bubble.style.pointerEvents = 'none';

    document.body.appendChild(bubble);

    let y = -30;
    const speed = Math.random() * 0.6 + 0.4;

    function rise() {
        y += speed;
        bubble.style.bottom = `${y}px`;

        if (y < window.innerHeight + 50) {
            requestAnimationFrame(rise);
        } else {
            bubble.remove();
        }
    }

    rise();
}

setInterval(spawnBubble, 350);