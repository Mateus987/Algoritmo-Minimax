
const JOGADOR_X = 'X';
const JOGADOR_O = 'O';


const tabuleiro = ['', '', '', '', '', '', '', '', ''];



function pontuacaoDoEstado(estado) {

const combinacoesVencedoras = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // linhas
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // colunas
    [0, 4, 8], [2, 4, 6] // diagonais
];

for (const combinacao of combinacoesVencedoras) {
    const [a, b, c] = combinacao;
    if (estado[a] !== '' && estado[a] === estado[b] && estado[a] === estado[c]) {
    return estado[a] === JOGADOR_X ? 1 : -1;
    }
}

// Verifica se é empate
if (!estado.includes('')) {
    return 0;
}

// O jogo ainda em andamento
return null;
}

//
function jogoTerminou(estado) {
return pontuacaoDoEstado(estado) !== null || !estado.includes('');
}


function minimaxAlphaBeta(estado, profundidade, alpha, beta, jogadorMaximizador) {
if (jogoTerminou(estado) || profundidade === 0) {
    return pontuacaoDoEstado(estado);
}

if (jogadorMaximizador) {
    let melhorPontuacao = -Infinity;

    for (let i = 0; i < estado.length; i++) {
    if (estado[i] === '') {
        estado[i] = JOGADOR_X;
        let pontuacao = minimaxAlphaBeta(estado, profundidade - 1, alpha, beta, false);
        estado[i] = '';
        melhorPontuacao = Math.max(melhorPontuacao, pontuacao);
        alpha = Math.max(alpha, pontuacao);
        if (beta <= alpha) {
        break; 
        }
    }
    }

    return melhorPontuacao;
} else {
    let melhorPontuacao = Infinity;

    for (let i = 0; i < estado.length; i++) {
    if (estado[i] === '') {
        estado[i] = JOGADOR_O;
        let pontuacao = minimaxAlphaBeta(estado, profundidade - 1, alpha, beta, true);
        estado[i] = '';
        melhorPontuacao = Math.min(melhorPontuacao, pontuacao);
        beta = Math.min(beta, pontuacao);
        if (beta <= alpha) {
        break;
        }
    }
    }

    return melhorPontuacao;
}
}


function encontrarMelhorMovimento() {
let melhorPontuacao = -Infinity;
let melhorMovimento;

for (let i = 0; i < tabuleiro.length; i++) {
    if (tabuleiro[i] === '') {
        tabuleiro[i] = JOGADOR_X;
  let pontuacao = minimaxAlphaBeta(tabuleiro, 5, -Infinity, Infinity, false);
  tabuleiro[i] = '';
  if (pontuacao > melhorPontuacao) {
    melhorPontuacao = pontuacao;
    melhorMovimento = i;
  }
}
}

return melhorMovimento;
}


function makeMove(index) {
if (!jogoTerminou(tabuleiro) && tabuleiro[index] === '') {
tabuleiro[index] = JOGADOR_O;
atualizarTabuleiro();

if (!jogoTerminou(tabuleiro)) {
  const melhorMovimento = encontrarMelhorMovimento();
  tabuleiro[melhorMovimento] = JOGADOR_X;
  atualizarTabuleiro();
}

if (jogoTerminou(tabuleiro)) {
  setTimeout(function() {
    alert("Fim do jogo!");
    reiniciarJogo();
  }, 100);
}
}
}

// Função que atualiza o tabuleiro
function atualizarTabuleiro() {
const cells = document.getElementsByClassName('cell');
for (let i = 0; i < tabuleiro.length; i++) {
cells[i].textContent = tabuleiro[i];
}
}

// Função que reinicia o jogo
function reiniciarJogo() {
for (let i = 0; i < tabuleiro.length; i++) {
tabuleiro[i] = '';
}
atualizarTabuleiro();
}

// Adiciona um evento de reinício do jogo ao carregar a página
window.onload = reiniciarJogo;
