const cells = document.querySelectorAll('.cell');
const statusDiv = document.querySelector('.status');
const resetBtn = document.querySelector('button.reset');

let board = Array(9).fill(null);
let currentPlayer = 'X';
let gameActive = true;

const winningConditions = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

function updateStatus(message, winner = false, draw = false) {
  statusDiv.textContent = message;
  statusDiv.classList.toggle('winner', winner);
  statusDiv.classList.toggle('draw', draw);
}

function handleResultValidation() {
  for (const condition of winningConditions) {
    const [a, b, c] = condition;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      condition.forEach(index => {
        cells[index].classList.add('winner');
        cells[index].setAttribute('aria-label', `Cell ${index + 1}, winning ${board[a]}`);
      });
      gameActive = false;
      updateStatus(`Player ${board[a]} wins! 🎉`, true);
      disableBoard();
      return true;
    }
  }

  if (!board.includes(null)) {
    gameActive = false;
    updateStatus("It's a draw! 🤝", false, true);
    return true;
  }

  return false;
}

function disableBoard() {
  cells.forEach(cell => {
    if (!cell.classList.contains('winner')) {
      cell.classList.add('disabled');
    }
    cell.setAttribute('tabindex', '-1');
  });
}

function handleCellClick(e) {
  const clickedCell = e.target;
  const clickedIndex = parseInt(clickedCell.dataset.index, 10);

  if (board[clickedIndex] !== null || !gameActive) return;

  board[clickedIndex] = currentPlayer;
  clickedCell.textContent = currentPlayer;
  clickedCell.classList.add('disabled');
  clickedCell.setAttribute('aria-label', `Cell ${clickedIndex + 1}, ${currentPlayer}`);

  if (handleResultValidation()) return;

  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  updateStatus(`Player ${currentPlayer}'s turn`);
}

function resetGame() {
  board.fill(null);
  currentPlayer = 'X';
  gameActive = true;

  cells.forEach(cell => {
    cell.textContent = '';
    cell.classList.remove('disabled', 'winner');
    cell.setAttribute('tabindex', '0');
    cell.setAttribute('aria-label', `Cell ${parseInt(cell.dataset.index) + 1}`);
  });

  updateStatus(`Player ${currentPlayer}'s turn`);
}

cells.forEach(cell => {
  cell.addEventListener('click', handleCellClick);
  cell.addEventListener('keydown', e => {
    if (!gameActive) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      cell.click();
    }
  });
});

resetBtn.addEventListener('click', resetGame);
updateStatus(`Player ${currentPlayer}'s turn`);
