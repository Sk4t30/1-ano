let currentLevel = 0;
const totalLevels = 10;
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
    nextLevelButton.classList.add('hidden');

    switch (currentLevel) {
        case 0:
            fishingGame(); break;
        case 1:
            memoryGame(); break;
        case 2:
            labirintoGame(); break;
        case 3:
            termoGame(); break;
        case 4:
            quizGame(); break;
        case 5:
            wordSearchGame(); break;
        case 6:
            hangmanGame(); break;
        case 7:
            puzzleGame(); break;
        case 8:
            sequenceGame(); break;
        case 9:
            fillInTheBlankGame(); break;
        default:
            minigameArea.innerHTML = '<p>Minigame não implementado!</p>';
            nextLevelButton.classList.remove('hidden');
    }
    currentLevel++;

}

function updateWordList() {
    wordList.innerHTML = '';
    words.forEach(word => {
        const li = document.createElement('li');
        li.textContent = word;
        wordList.appendChild(li);
    });
}

// quiz

function quizGame() {
    minigameArea.innerHTML = `
        <h2>Quiz: Quando foi o dia que eu te pedi em namoro</h2>
        <button class="quiz-option">Poder</button>
        <button class="quiz-option">Respeito</button>
        <button class="quiz-option">Dinheiro</button>
    `;

    document.querySelectorAll('.quiz-option').forEach(button => {
        button.addEventListener('click', () => {
            if (button.textContent === 'Respeito') {
                words.push('Z');
                updateWordList();
                nextLevelButton.classList.remove('hidden');
            } else {
                alert('Tente novamente!');
            }
        });
    });
}

// jogo da memoria 

function memoryGame() {
    const emojis = ['💖', '🌹', '💖', '🌹','🌸' ,'💘' ,'💏' ,'💞','💍','🌸' ,'💘' ,'💏' ,'💞','💍','😍','🇬🇬','😍','🇬🇬'];
    const shuffled = emojis.sort(() => 0.5 - Math.random());

    const cards = shuffled.map((emoji, index) => `
        <div class="memory-card" data-emoji="${emoji}" data-index="${index}">
            <div class="emoji">${emoji}</div>
        </div>
    `).join('');

    minigameArea.innerHTML = `<h2>Jogo da Memória</h2><div>${cards}</div>`;

    let flippedCards = [];

    document.querySelectorAll('.memory-card').forEach(card => {
        card.addEventListener('click', () => {
            if (flippedCards.length < 2 && !card.classList.contains('flip')) {
                card.classList.add('flip');
                flippedCards.push(card);

                if (flippedCards.length === 2) {
                    const [first, second] = flippedCards;
                    if (first.dataset.emoji === second.dataset.emoji) {
                        first.classList.add('matched');
                        second.classList.add('matched');
                        flippedCards = [];

                        // Verifica se todas as cartas foram encontradas
                        const allMatched = [...document.querySelectorAll('.memory-card')]
                            .every(card => card.classList.contains('matched'));
                        if (allMatched) {
                            words.push('E');
                            updateWordList();
                            nextLevelButton.classList.remove('hidden');
                        }
                    } else {
                        setTimeout(() => {
                            first.classList.remove('flip');
                            second.classList.remove('flip');
                            flippedCards = [];
                        }, 1000);
                    }
                }
            }
        });
    });
}

// jogo da pesca 

function fishingGame() {
    minigameArea.innerHTML = '<h2>Pesque o peixe certo!</h2><div id="fishArea"></div>';

    const fishArea = document.getElementById('fishArea');
    const totalFish = 7;
    const correctFishIndex = Math.floor(Math.random() * totalFish);

    for (let i = 0; i < totalFish; i++) {
        const fish = document.createElement('div');
        fish.classList.add('fish');
        fish.innerText = '🐟';

        const startTop = Math.random() * 250;
        const startLeft = Math.random() * 90;

        fish.style.top = `${startTop}px`;
        fish.style.left = `${startLeft}%`;

        if (i === correctFishIndex) {
            fish.dataset.correct = 'true';
        }

        fish.addEventListener('click', () => {
            if (fish.dataset.correct === 'true') {
                fish.classList.add('correct');
                document.querySelectorAll('.fish').forEach(f => {
                    if (f !== fish) f.classList.add('hidden');
                });
                minigameArea.innerHTML += `<p>Parabens, você pescou o peixe certo! 💖</p>`;
                words.push('F');
                updateWordList();
                nextLevelButton.classList.remove('hidden');
            } else {
                alert('Esse não é o peixe certo! 🎣');
            }
        });

        animateFish(fish);
        fishArea.appendChild(fish);
    }
}

function animateFish(fish) {
    const area = document.getElementById('fishArea');
    const areaWidth = area.clientWidth;
    const areaHeight = area.clientHeight;

    // posição inicial
    let x = parseFloat(fish.style.left) || Math.random() * 90;
    let y = parseFloat(fish.style.top) || Math.random() * 250;

    // direção aleatória
    let dx = (Math.random() * 1.5 + 0.5) * (Math.random() < 0.5 ? 1 : -1);
    let dy = (Math.random() * 1.5 + 0.5) * (Math.random() < 0.5 ? 1 : -1);

    function move() {
        // atualizar posição
        x += dx;
        y += dy;

        // bordas horizontais
        if (x < 0 || x > 90) dx *= -1;
        if (y < 0 || y > (areaHeight - 60)) dy *= -1;

        fish.style.left = `${x}%`;
        fish.style.top = `${y}px`;

        requestAnimationFrame(move);
    }

    move();
}

// caça palavra

function wordSearchGame() {
    const targetWords = ['AMOR', 'ZUL','1ANO'];
    let foundWords = [];

    const grid = [
        ['A', 'U', 'P', 'D', 'X', 'Y'],
        ['H', 'I', 'A', 'K', 'Q', 'P'],
        ['B', 'A', 'M', 'O', 'R', 'G'],
        ['Z', 'U', 'L', 'K', 'L', 'M'],
        ['N', 'O', 'P', 'Q', 'R', 'S'],
        ['T', 'U', '1', 'A', 'N', 'O'],
    ];

    minigameArea.innerHTML = `
        <h2>Arraste para encontrar: <span>${targetWords.join(', ')}</span></h2>
        <div id="wordSearchGrid" class="grid"></div>
    `;

    const gridContainer = document.getElementById('wordSearchGrid');

    let isMouseDown = false;
    let currentSelection = '';
    let selectedCells = [];

    // Cria a grade
    grid.forEach((row, rowIndex) => {
        row.forEach((letter, colIndex) => {
            const cell = document.createElement('div');
            cell.classList.add('grid-cell');
            cell.textContent = letter;
            cell.dataset.row = rowIndex;
            cell.dataset.col = colIndex;

            // Início do arrasto
            cell.addEventListener('mousedown', () => {
                if (cell.classList.contains('found')) return;
                isMouseDown = true;
                currentSelection = letter;
                selectedCells = [cell];
                cell.classList.add('selected');
            });

            // Enquanto arrasta
            cell.addEventListener('mouseenter', () => {
                if (isMouseDown && !selectedCells.includes(cell) && !cell.classList.contains('found')) {
                    currentSelection += letter;
                    selectedCells.push(cell);
                    cell.classList.add('selected');
                }
            });

            // Final do arrasto
            cell.addEventListener('mouseup', () => {
                isMouseDown = false;

                // Verifica se é uma palavra válida
                if (targetWords.includes(currentSelection)) {
                    selectedCells.forEach(c => {
                        c.classList.remove('selected');
                        c.classList.add('found');
                    });
                    foundWords.push(currentSelection);

                    if (foundWords.length === targetWords.length) {
                        words.push('1');
                        updateWordList();
                        nextLevelButton.classList.remove('hidden');
                    }
                } else {
                    // Resetar se estiver errado
                    selectedCells.forEach(c => c.classList.remove('selected'));
                }

                currentSelection = '';
                selectedCells = [];
            });

            gridContainer.appendChild(cell);
        });
    });

    // Se o usuário soltar fora de uma célula
    document.addEventListener('mouseup', () => {
        isMouseDown = false;
        selectedCells.forEach(c => c.classList.remove('selected'));
        currentSelection = '';
        selectedCells = [];
    });
}

// forca

function hangmanGame() {
    const palavras = ['AMOR', 'EU TE AMO', 'CARINHO', 'RESPEITO', 'UM ANO'];
    const palavra = palavras[Math.floor(Math.random() * palavras.length)];
    let erros = 0;
    let maxErros = 10;
    let letrasCertas = [];
    let letrasErradas = [];

    minigameArea.innerHTML = `
        <h2>Jogo da Forca</h2>
        <div class="hangman-container">
            <div class="hangman-drawing">
                <div class="gallow"></div>
                <div class="boneco cabeça"></div>
                <div class="boneco corpo"></div>
                <div class="boneco braco-esq"></div>
                <div class="boneco braco-dir"></div>
                <div class="boneco perna-esq"></div>
                <div class="boneco perna-dir"></div>
            </div>
            <div class="palavra" id="palavraOculta"></div>
            <div class="letras-erradas" id="letrasErradas">Letras erradas: </div>
            <div class="letras" id="teclado"></div>
        </div>
    `;

    const palavraOculta = document.getElementById('palavraOculta');
    const letrasErradasEl = document.getElementById('letrasErradas');
    const teclado = document.getElementById('teclado');

    atualizarPalavra();

    // Cria teclas A-Z
    for (let i = 65; i <= 90; i++) {
        const letra = String.fromCharCode(i);
        const botao = document.createElement('button');
        botao.textContent = letra;
        botao.classList.add('letra-btn');
        botao.addEventListener('click', () => processarLetra(letra, botao));
        teclado.appendChild(botao);
    }

    function atualizarPalavra() {
        const exibicao = palavra.split('').map(l => (letrasCertas.includes(l) ? l : '_')).join(' ');
        palavraOculta.textContent = exibicao;
    }

    function processarLetra(letra, botao) {
        botao.disabled = true;

        if (palavra.includes(letra)) {
            letrasCertas.push(letra);
            atualizarPalavra();

            const venceu = palavra.split('').every(l => letrasCertas.includes(l));
            if (venceu) {
                palavraOculta.textContent = palavra;
                words.push('A');
                updateWordList();
                nextLevelButton.classList.remove('hidden');
            }
        } else {
            if (!letrasErradas.includes(letra)) {
                letrasErradas.push(letra);
                erros++;
                atualizarBoneco();
                letrasErradasEl.textContent = `Letras erradas: ${letrasErradas.join(', ')}`;

                if (erros >= maxErros) {
                    palavraOculta.textContent = palavra;
                    letrasErradasEl.textContent += ' — Você perdeu! 😢';

                    document.querySelectorAll('.letra-btn').forEach(btn => btn.disabled = true);

                    const retryBtn = document.createElement('button');
                    retryBtn.textContent = 'Tentar novamente';
                    retryBtn.classList.add('retry-button');
                    retryBtn.addEventListener('click', hangmanGame);
                    minigameArea.appendChild(retryBtn);
                }
            }
        }
    }

    function atualizarBoneco() {
        const partes = ['cabeça', 'corpo', 'braco-esq', 'braco-dir', 'perna-esq', 'perna-dir'];
        for (let i = 0; i < partes.length; i++) {
            if (i < erros) {
                document.querySelector(`.${partes[i]}`).classList.add('visivel');
            }
        }
    }
}

//quebra cabeça de imagens 

function puzzleGame() {
    const size = 3; // 3x3
    const imageURL = 'eu e a gio.jpg';

    minigameArea.innerHTML = `
        <h2>Monte o Quebra-Cabeça do Amor 💖</h2>
        <div id="puzzleGrid" style="display: grid; grid-template-columns: repeat(${size}, 100px); gap: 5px; justify-content: center;"></div>
    `;

    const grid = document.getElementById('puzzleGrid');

    // Gera peças (índices de 0 a 8)
    const pieces = Array.from({ length: size * size }, (_, i) => i);
    shuffleArray(pieces);

    let first = null;
    let second = null;

    function drawPuzzle() {
        grid.innerHTML = '';
        pieces.forEach((index, pos) => {
            const row = Math.floor(index / size);
            const col = index % size;
            const div = document.createElement('div');
            div.classList.add('puzzle-piece');
            div.style.width = '100px';
            div.style.height = '100px';
            div.style.backgroundImage = `url('${imageURL}')`;
            div.style.backgroundSize = `${size * 100}px ${size * 100}px`;
            div.style.backgroundPosition = `-${col * 100}px -${row * 100}px`;
            div.style.border = '2px solid #e91e63';
            div.dataset.pos = pos;
            div.addEventListener('click', () => selectPiece(pos));
            grid.appendChild(div);
        });
    }

    function selectPiece(pos) {
        if (first === null) {
            first = pos;
            highlightPiece(pos);
        } else if (second === null && pos !== first) {
            second = pos;
            swapPieces(first, second);
            first = null;
            second = null;
        }
    }

    function highlightPiece(pos) {
        document.querySelectorAll('.puzzle-piece')[pos].style.outline = '3px solid #2196f3';
    }

    function swapPieces(i, j) {
        [pieces[i], pieces[j]] = [pieces[j], pieces[i]];
        drawPuzzle();
        checkWin();
    }

    function checkWin() {
        const won = pieces.every((val, i) => val === i);
        if (won) {
            minigameArea.innerHTML += `<p>✨ Quebra-cabeça completo! ✨</p>`;
            words.push('N');
            updateWordList();
            nextLevelButton.classList.remove('hidden');
        }
    }

    function shuffleArray(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
    }

    drawPuzzle();
}

// jogo de sequencia 

function sequenceGame() {
  const colors = ['#e91e63', '#2196f3', '#4caf50', '#ffeb3b']; // rosa, azul, verde, amarelo
  const colorNames = ['Rosa', 'Azul', 'Verde', 'Amarelo'];

  minigameArea.innerHTML = `
    <h2>Jogo da Sequência: Repita a sequência!</h2>
    <div id="colorButtons" style="display:flex; justify-content:center; gap:15px; margin-top:20px;"></div>
    <p id="message" style="font-size:1.2em; margin-top:15px;"></p>
  `;

  const colorButtons = document.getElementById('colorButtons');
  const message = document.getElementById('message');

  let sequence = [];
  let playerSequence = [];
  let level = 0;
  let acceptingInput = false;
  let maxLevel = 5;

  colors.forEach((color, i) => {
    const btn = document.createElement('button');
    btn.style.width = '100px';
    btn.style.height = '100px';
    btn.style.backgroundColor = color;
    btn.style.border = '4px solid transparent';
    btn.style.borderRadius = '15px';
    btn.style.cursor = 'pointer';
    btn.title = colorNames[i];
    btn.disabled = true;
    btn.style.transition = 'box-shadow 0.3s ease, border-color 0.3s ease';
    btn.addEventListener('click', () => handlePlayerInput(i));
    colorButtons.appendChild(btn);
  });

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async function flashButton(idx) {
    const btn = colorButtons.querySelectorAll('button')[idx];
    btn.style.borderColor = '#fff';
    btn.style.boxShadow = `0 0 20px 10px ${colors[idx]}, 0 0 40px 20px ${colors[idx]}`;
    await sleep(300);
    btn.style.borderColor = 'transparent';
    btn.style.boxShadow = 'none';
  }

  async function playSequence() {
    acceptingInput = false;
    message.textContent = 'Observe a sequência...';

    for (let i = 0; i < sequence.length; i++) {
      await flashButton(sequence[i]);
      await sleep(200);
    }

    message.textContent = 'Sua vez! Repita a sequência.';
    colorButtons.querySelectorAll('button').forEach(b => b.disabled = false);
    acceptingInput = true;
  }

  function nextRound() {
    playerSequence = [];
    level++;
    if (level > maxLevel) {
      words.push('O');
      updateWordList();
      nextLevelButton.classList.remove('hidden');
      message.textContent = `Parabéns! Você completou todos os níveis! Clique em Próxima Fase.`;
      colorButtons.querySelectorAll('button').forEach(b => b.disabled = true);
      acceptingInput = false;
      return;
    }
    message.textContent = `Nível ${level}`;
    sequence.push(Math.floor(Math.random() * colors.length));
    playSequence();
  }

  function gameOver() {
    message.textContent = 'Você errou! Tente novamente.';
    colorButtons.querySelectorAll('button').forEach(b => b.disabled = true);
    acceptingInput = false;
    setTimeout(() => {
      message.textContent = 'Vamos tentar de novo!';
      nextRound();
    }, 2000);
  }

  async function handlePlayerInput(colorIndex) {
    if (!acceptingInput) return;
    colorButtons.querySelectorAll('button')[colorIndex].disabled = true;
    await flashButton(colorIndex);
    playerSequence.push(colorIndex);

    if (playerSequence[playerSequence.length - 1] !== sequence[playerSequence.length - 1]) {
      gameOver();
      return;
    }

    if (playerSequence.length === sequence.length) {
      nextRound();
    } else {
      colorButtons.querySelectorAll('button').forEach(b => b.disabled = false);
    }
  }

  nextRound();
}

// escreva no buraco vazio

function fillInTheBlankGame() {
  const frases = [
    {
      texto: "Você é o ____ da minha vida.",
      opcoes: ["tempestade", "amor", "dívida"],
      correta: "amor"
    },
    {
      texto: "seu peido parece ______",
      opcoes: ["o cheiro de flores e rosas", "hiroshima e nagasaki", "uma bomba nuclear"],
      correta: "hiroshima e nagasaki"
    },
    {
      texto: "Nosso amor é mais forte que ____.",
      opcoes: ["o saitama", "cbum", "goku"],
      correta: "cbum"
    }
  ];

  let atual = 0;

  function mostrarFrase() {
    const frase = frases[atual];

    minigameArea.innerHTML = `
      <h2>Complete a Frase</h2>
      <p style="font-size:1.3em; margin-bottom: 20px;"><strong>${frase.texto.replace("____", "_____")}</strong></p>
      <div id="opcoes"></div>
      <p id="mensagem" style="margin-top: 20px;"></p>
    `;

    const opcoesContainer = document.getElementById("opcoes");

    frase.opcoes.forEach(opcao => {
      const btn = document.createElement("button");
      btn.textContent = opcao;
      btn.style.margin = "10px";
      btn.addEventListener("click", () => verificarResposta(opcao));
      opcoesContainer.appendChild(btn);
    });
  }

  function verificarResposta(opcaoEscolhida) {
    const frase = frases[atual];
    const mensagem = document.getElementById("mensagem");

    if (opcaoEscolhida === frase.correta) {
      atual++;
      if (atual >= frases.length) {
        mensagem.textContent = "✅ Muito bem! Você completou todas as frases!";
        words.push("!");
        updateWordList();
        nextLevelButton.classList.remove("hidden");
        minigameArea.innerHTML += `<p style="margin-top:20px; font-weight:bold;">Palavra liberada: Frase ✨</p>`;
      } else {
        mensagem.textContent = "✔️ Boa! Próxima frase...";
        setTimeout(mostrarFrase, 1000);
      }
    } else {
      mensagem.textContent = "❌ Tente novamente!";
    }
  }

  mostrarFrase();
}

function termoGame() {
  const palavraSecreta = "adoro"; // deve ter 5 letras
  const maxTentativas = 6;
  let tentativas = [];

  minigameArea.innerHTML = `
    <h2>Jogo do Palpite Romântico 💘</h2>
    <p>Adivinhe a palavra em até ${maxTentativas} tentativas.</p>
    <input type="text" id="entrada" maxlength="5" placeholder="5 letras" style="text-transform: uppercase; padding: 10px; font-size: 1.2em;" />
    <button id="enviarTentativa">Enviar</button>
    <div id="resultado" style="margin-top:20px;"></div>
    <p id="mensagem"></p>
  `;

  const entrada = document.getElementById("entrada");
  const btn = document.getElementById("enviarTentativa");
  const resultado = document.getElementById("resultado");
  const mensagem = document.getElementById("mensagem");

  btn.addEventListener("click", tentar);

  function tentar() {
    const palavra = entrada.value.toUpperCase();
    if (palavra.length !== 5) {
      mensagem.textContent = "Digite uma palavra com 5 letras!";
      return;
    }
    if (tentativas.length >= maxTentativas) return;

    tentativas.push(palavra);
    mostrarTentativas();

    if (palavra === palavraSecreta) {
      mensagem.innerHTML = "✨ Você acertou! A palavra era <strong>" + palavraSecreta + "</strong>";
      words.push("i");
      updateWordList();
      nextLevelButton.classList.remove("hidden");
      btn.disabled = true;
      entrada.disabled = true;
    } else if (tentativas.length === maxTentativas) {
      mensagem.innerHTML = "💔 Fim de tentativas. A palavra era <strong>" + palavraSecreta + "</strong>";
      btn.disabled = true;
      entrada.disabled = true;
    } else {
      mensagem.textContent = "";
    }

    entrada.value = "";
  }

  function mostrarTentativas() {
    resultado.innerHTML = "";
    tentativas.forEach(tentativa => {
      const linha = document.createElement("div");
      linha.style.display = "flex";
      linha.style.justifyContent = "center";
      linha.style.marginBottom = "5px";

      for (let i = 0; i < 5; i++) {
        const letra = tentativa[i];
        const span = document.createElement("span");
        span.textContent = letra;
        span.style.width = "40px";
        span.style.height = "40px";
        span.style.lineHeight = "40px";
        span.style.margin = "3px";
        span.style.fontSize = "1.5em";
        span.style.fontWeight = "bold";
        span.style.border = "2px solid #e91e63";
        span.style.display = "inline-block";
        span.style.textAlign = "center";
        span.style.textTransform = "uppercase";

        if (letra === palavraSecreta[i]) {
          span.style.backgroundColor = "#81c784"; // 🟩 verde
        } else if (palavraSecreta.includes(letra)) {
          span.style.backgroundColor = "#fff176"; // 🟨 amarelo
        } else {
          span.style.backgroundColor = "#e0e0e0"; // ⬜ cinza
        }

        linha.appendChild(span);
      }

      resultado.appendChild(linha);
    });
  }
}


// labirinto game 

function labirintoGame() {
  const mapa = [
    ['#', '#', '#', '#', '#', '#', '#', '#'],
    ['#', ' ', ' ', ' ', '#', ' ', '💌', '#'],
    ['#', ' ', '#', ' ', '#', ' ', '#', '#'],
    ['#', ' ', '#', ' ', ' ', ' ', ' ', '#'],
    ['#', ' ', '#', '#', '#', '#', ' ', '#'],
    ['#', '❤️', ' ', ' ', ' ', '#', ' ', '#'],
    ['#', '#', '#', '#', '#', '#', '#', '#']
  ];

  const emojis = {
    '#': '⬛',
    ' ': '▫️',
    '❤️': '❤️',
    '💌': '💌'
  };

  let jogador = { linha: 5, coluna: 1 };
  let ganhou = false;

  minigameArea.innerHTML = `
    <h2>Labirinto do Amor 💘</h2>
    <p>Use as setas do teclado ou os botões para mover o coração até a carta 💌</p>
    <div id="labirinto" class="labirinto-grid" style="display: grid; grid-template-columns: repeat(8, 40px); gap: 4px; justify-content: center; margin: 20px 0;"></div>
    <div style="display:flex; flex-direction:column; align-items:center; gap:5px;">
      <button onclick="mover('cima')">⬆️</button>
      <div>
        <button onclick="mover('esquerda')">⬅️</button>
        <button onclick="mover('baixo')">⬇️</button>
        <button onclick="mover('direita')">➡️</button>
      </div>
    </div>
    <p id="labMsg"></p>
  `;

  const labEl = document.getElementById("labirinto");
  const labMsg = document.getElementById("labMsg");

  function render() {
    window.mover = mover;
    labEl.innerHTML = "";
    for (let l = 0; l < mapa.length; l++) {
      for (let c = 0; c < mapa[l].length; c++) {
        const cell = document.createElement("div");
        const valor = (l === jogador.linha && c === jogador.coluna) ? '❤️' : mapa[l][c];
        cell.textContent = emojis[valor] || valor;
        cell.style.width = "40px";
        cell.style.height = "40px";
        cell.style.fontSize = "1.5em";
        cell.style.display = "flex";
        cell.style.justifyContent = "center";
        cell.style.alignItems = "center";
        cell.style.border = "1px solid #ccc";
        cell.style.background = "#fff";
        labEl.appendChild(cell);
      }
    }
  }

  function mover(direcao) {
    if (ganhou) return;

    const { linha, coluna } = jogador;
    let novaLinha = linha;
    let novaColuna = coluna;

    if (direcao === 'cima') novaLinha--;
    if (direcao === 'baixo') novaLinha++;
    if (direcao === 'esquerda') novaColuna--;
    if (direcao === 'direita') novaColuna++;

    // Limite
    if (
      novaLinha < 0 || novaLinha >= mapa.length ||
      novaColuna < 0 || novaColuna >= mapa[0].length
    ) return;

    const destino = mapa[novaLinha][novaColuna];

    if (destino === '#') return; // parede

    if (destino === '💌') {
      ganhou = true;
      words.push("L");
      updateWordList();
      nextLevelButton.classList.remove("hidden");
      labMsg.innerHTML = "✨ Você encontrou a carta do amor! 💌";
    }

    jogador.linha = novaLinha;
    jogador.coluna = novaColuna;
    render();
  }

  // Teclado
  document.onkeydown = (e) => {
    if (e.key === "ArrowUp") mover("cima");
    if (e.key === "ArrowDown") mover("baixo");
    if (e.key === "ArrowLeft") mover("esquerda");
    if (e.key === "ArrowRight") mover("direita");
  };

  render();
}

// fim do labirinto 

const bgMusic = document.getElementById('bgMusic');
const volumeControl = document.getElementById('volumeRange');

bgMusic.volume = 0.5;

volumeControl.addEventListener('input', () => {
  bgMusic.volume = volumeControl.value;
});

// Inicia a música quando clicar em "Começar"
startButton.addEventListener('click', () => {
  bgMusic.play();
});



