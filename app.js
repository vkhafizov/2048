const grid = document.querySelector('.grid');
const scoreElement = document.getElementById('score');
let score = 0;
let board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
];

// Инициализация игры
function init() {
    addTile();
    addTile();
    updateGrid();
    setupTouchControls(); // Добавляем обработку свайпов
}

// Добавление новой плитки
function addTile() {
    const emptyCells = [];
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (board[i][j] === 0) {
                emptyCells.push({ i, j });
            }
        }
    }
    if (emptyCells.length > 0) {
        const { i, j } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        board[i][j] = Math.random() < 0.9 ? 2 : 4;
    }
}

// Обновление игрового поля
function updateGrid() {
    grid.innerHTML = '';
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            const tile = document.createElement('div');
            tile.textContent = board[i][j] === 0 ? '' : board[i][j];
            tile.style.backgroundColor = getTileColor(board[i][j]);
            grid.appendChild(tile);
        }
    }
    scoreElement.textContent = score;
}

// Получение цвета плитки
function getTileColor(value) {
    const colors = {
        0: '#cdc1b4',
        2: '#eee4da',
        4: '#ede0c8',
        8: '#f2b179',
        16: '#f59563',
        32: '#f67c5f',
        64: '#f65e3b',
        128: '#edcf72',
        256: '#edcc61',
        512: '#edc850',
        1024: '#edc53f',
        2048: '#edc22e'
    };
    return colors[value] || '#cdc1b4';
}

// Логика движения влево
function moveLeft() {
    let moved = false;
    for (let i = 0; i < 4; i++) {
        for (let j = 1; j < 4; j++) {
            if (board[i][j] !== 0) {
                let k = j;
                while (k > 0 && board[i][k - 1] === 0) {
                    board[i][k - 1] = board[i][k];
                    board[i][k] = 0;
                    k--;
                    moved = true;
                }
                if (k > 0 && board[i][k - 1] === board[i][k]) {
                    board[i][k - 1] *= 2;
                    score += board[i][k - 1];
                    board[i][k] = 0;
                    moved = true;
                }
            }
        }
    }
    return moved;
}

// Логика движения вправо
function moveRight() {
    let moved = false;
    for (let i = 0; i < 4; i++) {
        for (let j = 2; j >= 0; j--) {
            if (board[i][j] !== 0) {
                let k = j;
                while (k < 3 && board[i][k + 1] === 0) {
                    board[i][k + 1] = board[i][k];
                    board[i][k] = 0;
                    k++;
                    moved = true;
                }
                if (k < 3 && board[i][k + 1] === board[i][k]) {
                    board[i][k + 1] *= 2;
                    score += board[i][k + 1];
                    board[i][k] = 0;
                    moved = true;
                }
            }
        }
    }
    return moved;
}

// Логика движения вверх
function moveUp() {
    let moved = false;
    for (let j = 0; j < 4; j++) {
        for (let i = 1; i < 4; i++) {
            if (board[i][j] !== 0) {
                let k = i;
                while (k > 0 && board[k - 1][j] === 0) {
                    board[k - 1][j] = board[k][j];
                    board[k][j] = 0;
                    k--;
                    moved = true;
                }
                if (k > 0 && board[k - 1][j] === board[k][j]) {
                    board[k - 1][j] *= 2;
                    score += board[k - 1][j];
                    board[k][j] = 0;
                    moved = true;
                }
            }
        }
    }
    return moved;
}

// Логика движения вниз
function moveDown() {
    let moved = false;
    for (let j = 0; j < 4; j++) {
        for (let i = 2; i >= 0; i--) {
            if (board[i][j] !== 0) {
                let k = i;
                while (k < 3 && board[k + 1][j] === 0) {
                    board[k + 1][j] = board[k][j];
                    board[k][j] = 0;
                    k++;
                    moved = true;
                }
                if (k < 3 && board[k + 1][j] === board[k][j]) {
                    board[k + 1][j] *= 2;
                    score += board[k + 1][j];
                    board[k][j] = 0;
                    moved = true;
                }
            }
        }
    }
    return moved;
}

// Обработка нажатий клавиш
document.addEventListener('keydown', (event) => {
    let moved = false;
    switch (event.key) {
        case 'ArrowUp':
            moved = moveUp();
            break;
        case 'ArrowDown':
            moved = moveDown();
            break;
        case 'ArrowLeft':
            moved = moveLeft();
            break;
        case 'ArrowRight':
            moved = moveRight();
            break;
    }
    if (moved) {
        addTile();
        updateGrid();
        if (isGameOver()) {
            alert('Game Over! Your score: ' + score);
        }
    }
});

// Проверка на завершение игры
function isGameOver() {
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (board[i][j] === 0) return false;
            if (j < 3 && board[i][j] === board[i][j + 1]) return false;
            if (i < 3 && board[i][j] === board[i + 1][j]) return false;
        }
    }
    return true;
}

// Добавляем обработку свайпов
function setupTouchControls() {
    let touchStartX = 0;
    let touchStartY = 0;

    grid.addEventListener('touchstart', (event) => {
        touchStartX = event.touches[0].clientX;
        touchStartY = event.touches[0].clientY;
    });

    grid.addEventListener('touchend', (event) => {
        const touchEndX = event.changedTouches[0].clientX;
        const touchEndY = event.changedTouches[0].clientY;
        const dx = touchEndX - touchStartX;
        const dy = touchEndY - touchStartY;

        if (Math.abs(dx) > Math.abs(dy)) {
            // Горизонтальный свайп
            if (dx > 0) {
                moveRight();
            } else {
                moveLeft();
            }
        } else {
            // Вертикальный свайп
            if (dy > 0) {
                moveDown();
            } else {
                moveUp();
            }
        }

        addTile();
        updateGrid();
        if (isGameOver()) {
            alert('Game Over! Your score: ' + score);
        }
    });
}

// Запуск игры
init();
