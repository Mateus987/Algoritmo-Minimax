
const JOGADOR_X = 'X';
const JOGADOR_O = 'O';

let tabuleiro = ['', '', '', '', '', '', '', '', ''];

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

  // O jogo em andamento
  return null;
}


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

function encontrarMelhorMovimento(jogador) {
  let melhorPontuacao = jogador === JOGADOR_X ? -Infinity : Infinity;
  let melhorMovimento;

  for (let i = 0; i < tabuleiro.length; i++) {
    if (tabuleiro[i] === '') {
      tabuleiro[i] = jogador;
      let pontuacao = minimaxAlphaBeta(tabuleiro, 5, -Infinity, Infinity, jogador === JOGADOR_X ? false : true);
      tabuleiro[i] = '';
      if ((jogador === JOGADOR_X && pontuacao > melhorPontuacao) || (jogador === JOGADOR_O && pontuacao < melhorPontuacao)) {
        melhorPontuacao = pontuacao;
        melhorMovimento = i;
      }
    }
  }

  return melhorMovimento;
}

function fazerMovimento(jogador, index) {
  if (!jogoTerminou(tabuleiro) && tabuleiro[index] === '') {
    tabuleiro[index] = jogador;
    atualizarTabuleiro();

    if (!jogoTerminou(tabuleiro)) {
      const proximoJogador = jogador === JOGADOR_X ? JOGADOR_O : JOGADOR_X;

      
      const startTime = performance.now();

      const melhorMovimento = encontrarMelhorMovimento(proximoJogador);

      const endTime = performance.now();
      const tempoProcessamento = endTime - startTime;
      console.log(`Tempo de processamento: ${tempoProcessamento}ms`);

      setTimeout(function() {
        fazerMovimento(proximoJogador, melhorMovimento);
      }, 500);
    }

    if (jogoTerminou(tabuleiro)) {
      const pontuacao = pontuacaoDoEstado(tabuleiro);
      exibirPontuacao(pontuacao);
    }
  }
}


function atualizarTabuleiro() {
  const cells = document.querySelectorAll('.cell');
  for (let i = 0; i < cells.length; i++) {
    cells[i].innerText = tabuleiro[i];
  }
}


function exibirPontuacao(pontuacao) {
  const score = document.getElementById('score');
  if (pontuacao === 0) {
    score.innerText = 'Empate!';
  } else {
    score.innerText = 'Você venceu!';
  }
}

document.getElementById('board').addEventListener('click', function(event) {
  const index = Array.from(event.target.parentNode.children).indexOf(event.target);
  fazerMovimento(JOGADOR_O, index);
});


fazerMovimento(JOGADOR_X, 0);