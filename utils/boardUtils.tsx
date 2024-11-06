import { BoardData } from "../components/Board";
import { CellData } from "../components/Cell";

// Função que gera o tabuleiro vazio (sem bombas)
export const generateEmptyBoard = (rows: number, cols: number) => {
  return Array(rows)
    .fill(null)
    .map(() =>
      Array(cols).fill({
        isBomb: false,
        isOpen: false,
        isFlagged: false,
        adjacentBombs: 0,
      })
    );
};

// Função que conta quantas bombas estão nas células adjacentes
export const countAdjacentBombs = (
  board: BoardData,
  row: number,
  col: number,
  rows: number,
  cols: number
) => {
  const directions = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];

  let bombCount = 0;
  directions.forEach(([dx, dy]) => {
    const newRow = row + dx;
    const newCol = col + dy;
    if (
      newRow >= 0 &&
      newRow < rows &&
      newCol >= 0 &&
      newCol < cols &&
      board[newRow][newCol].isBomb
    ) {
      bombCount++;
    }
  });

  return bombCount;
};

// Função para colocar bombas no tabuleiro, garantindo que a primeira célula aberta não seja uma bomba
export const placeBombs = (
  board: BoardData,
  bombs: number,
  initialRow: number,
  initialCol: number
) => {
  const rows = board.length;
  const cols = board[0].length;
  let bombCount = 0;

  while (bombCount < bombs) {
    const row = Math.floor(Math.random() * rows);
    const col = Math.floor(Math.random() * cols);

    // Evitar colocar uma bomba na célula que o jogador abriu primeiro
    if (!board[row][col].isBomb && (row !== initialRow || col !== initialCol)) {
      board[row][col] = { ...board[row][col], isBomb: true };
      bombCount++;
    }
  }

  // Atualiza o número de bombas adjacentes
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (!board[row][col].isBomb) {
        const adjacentBombs = countAdjacentBombs(board, row, col, rows, cols);
        board[row][col] = { ...board[row][col], adjacentBombs };
      }
    }
  }

  return board;
};

// Função para abrir células adjacentes recursivamente
export const openAdjacentCells = (
  board: BoardData,
  row: number,
  col: number,
  rows: number,
  cols: number
) => {
  const directions = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];

  directions.forEach(([dx, dy]) => {
    const newRow = row + dx;
    const newCol = col + dy;
    if (
      newRow >= 0 &&
      newRow < rows &&
      newCol >= 0 &&
      newCol < cols &&
      !board[newRow][newCol].isOpen &&
      !board[newRow][newCol].isFlagged
    ) {
      board[newRow][newCol].isOpen = true;
      if (board[newRow][newCol].adjacentBombs === 0) {
        openAdjacentCells(board, newRow, newCol, rows, cols);
      }
    }
  });
};

// Função para verificar se um usuário venceu
export const checkWinCondition = (newBoard: BoardData, rows: number, cols: number) => {
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      if (!newBoard[row][col].isBomb && !newBoard[row][col].isOpen) {
        return false; // Ainda há células não abertas que não são bombas
      }
    }
  }
  return true; // Todas as células que não são bombas foram abertas
};