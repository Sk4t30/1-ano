let currentLevel = 0;
const totalLevels = 9;
const words = [];
const startButton = document.getElementById('startButton');
const gameArea = document.getElementById('gameArea');
const nextLevelButton = document.getElementById('nextLevel');
const minigameArea = document.getElementById('minigameArea');
const wordList = document.getElementById('words');

startButton.addEventListener('click', startGame);
nextLevelButton.addEventListener('click', nextLevel);

function startGame() {
    document.querySelector('.game-container h1').classList.add('hidden');
    startButton.classList.add('hidden');
    gameArea.classList.remove('hidden');
    nextLevel();
}

function nextLevel() {
    if (currentLevel >= totalLevels) {
        window.location.href = "final.html";
        return;
    }

    minigameArea.innerHTML = '';
    switch (currentLevel) {
        case 0:
            memoryGame();
            break;
        case 1:
            quizGame();
            break;
        case 2:
            wordGame();
            break;
        case 3:
            fishingGame();
            break;
        case 4:
            mazeGame();
            break;
        case 5:
            associationGame();
            break;
        case 6:
            mathGame();
            break;
        case 7:
            crosswordGame();
            break;
        default:
            alert('Minigame não implementado!');
    }

    currentLevel++;
    nextLevelButton.classList.add('hidden'); // Esconde o botão de próxima fase até completar o minigame
}

function memoryGame() {
    const cards = [
        '❤️', '💍', '💌', '❤️', '💍', '💌', '🌹', '🥰', '🌹', '🥰'
    ];
    shuffle(cards);

    let html = '';
    cards.forEach(() => {
        html += `<div class="memory-card"><div class="emoji"></div></div>`;
    });
    minigameArea.innerHTML = html;

    const memoryCards = document.querySelectorAll('.memory-card');
    let flippedCards = [];
    let matchedCards = 0;
    const totalPairs = cards.length / 2;

    memoryCards.forEach(card => {
        card.addEventListener('click', function() {
            if (flippedCards.length < 2 && !card.classList.contains('flip')) {
                const index = Array.from(memoryCards).indexOf(card);
                card.classList.add('flip');
                card.querySelector('.emoji').textContent = cards[index]; // Exibe o emoji ao virar a carta
                flippedCards.push(card);

                if (flippedCards.length === 2) {
                    setTimeout(() => {
                        if (flippedCards[0].querySelector('.emoji').textContent === flippedCards[1].querySelector('.emoji').textContent) {
                            flippedCards[0].classList.add('matched');
                            flippedCards[1].classList.add('matched');
                            matchedCards += 2;

                            // Só adiciona as palavras quando todos os pares forem encontrados
                            if (matchedCards === cards.length) {
                                words.push('Memória');
                                updateWordList();
                                nextLevelButton.classList.remove('hidden');
                            }
                        } else {
                            // Caso as cartas não sejam iguais, as "desvira" removendo o emoji
                            flippedCards[0].querySelector('.emoji').textContent = '';
                            flippedCards[1].querySelector('.emoji').textContent = '';
                            flippedCards[0].classList.remove('flip');
                            flippedCards[1].classList.remove('flip');
                        }
                        flippedCards = [];
                    }, 1000); // 1 segundo para as cartas voltarem ao estado inicial
                }
            }
        });
    });
}

function fishingGame() {
    minigameArea.innerHTML = `
        <h2>Pescaria: Clique nos peixes para pescar as palavras!</h2>
        <div id="fishArea"></div>
    `;
    const fishArea = document.getElementById('fishArea');
    let fishCaught = 0;
    let fishPositions = [
        {top: '50px', left: '100px', text: 'Juntos'},
        {top: '150px', left: '200px', text: 'Amor'},
        {top: '250px', left: '300px', text: 'Felicidade'}
    ];

    fishPositions.forEach((fish, index) => {
        const fishElement = document.createElement('button');
        fishElement.classList.add('fish');
        fishElement.style.top = fish.top;
        fishElement.style.left = fish.left;
        fishElement.textContent = '🐟';
        fishElement.dataset.word = fish.text;

        fishElement.addEventListener('click', () => {
            if (!fishElement.classList.contains('hidden')) {
                fishElement.classList.add('hidden');
                fishCaught++;
                words.push(fishElement.dataset.word);
                updateWordList();
                if (fishCaught === fishPositions.length) {
                    nextLevelButton.classList.remove('hidden');
                }
            }
        });

        fishArea.appendChild(fishElement);

        setTimeout(() => fishElement.classList.remove('hidden'), index * 1000);
    });
}

function associationGame() {
    minigameArea.innerHTML = `
        <h2>Arraste o item até a área correspondente:</h2>
        <div id="dragContainer">
            <div class="word-box" id="sun">🌞</div>
            <div class="word-box" id="moon">🌙</div>
        </div>
        <div id="dropContainer">
            <div class="drop-area" id="light">Luz</div>
            <div class="drop-area" id="darkness">Escuridão</div>
        </div>
    `;

    const sun = document.getElementById('sun');
    const moon = document.getElementById('moon');
    const light = document.getElementById('light');
    const darkness = document.getElementById('darkness');

    sun.setAttribute('draggable', true);
    moon.setAttribute('draggable', true);

    sun.addEventListener('dragstart', dragStart);
    moon.addEventListener('dragstart', dragStart);

    light.addEventListener('dragover', dragOver);
    darkness.addEventListener('dragover', dragOver);

    light.addEventListener('drop', drop.bind(null, 'sun', 'light'));
    darkness.addEventListener('drop', drop.bind(null, 'moon', 'darkness'));

    function dragStart(event) {
        event.dataTransfer.setData('text', event.target.id);
    }

    function dragOver(event) {
        event.preventDefault();
    }

    function drop(item, area) {
        const draggedItem = document.getElementById(event.dataTransfer.getData('text')).id;
        if (draggedItem === item) {
            words.push(area);
            updateWordList();
            nextLevel();
        } else {
            alert('Tente novamente.');
        }
    }
}

function updateWordList() {
    wordList.innerHTML = '';
    words.forEach(word => {
        const li = document.createElement('li');
        li.textContent = word;
        wordList.appendChild(li);
    });
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
