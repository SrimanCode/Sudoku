let grid = Array(9).fill().map(() => Array(9).fill(0));
let answer;
let numberList = [1, 2, 3, 4, 5, 6, 7, 8 , 9];
Available_hints = 10;
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));            
        let temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}
let counter;
function checkGrid(grid) {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (grid[row][col] === 0) {
                return false;
            }
        }
    }
    return true;
}
function fillGrid(grid) {
    let row, col;
    for (let i = 0; i < 81; i++) {
      row = Math.floor(i / 9);
      col = i % 9;
      if (grid[row][col] == 0) {
        shuffle(numberList); 
        for (let value of numberList) {
          if (!grid[row].includes(value)) {
            let columnValues = [grid[0][col], grid[1][col], grid[2][col], grid[3][col], grid[4][col], grid[5][col], grid[6][col], grid[7][col], grid[8][col]];
            if (!columnValues.includes(value)) {
              let square = [];
              if (row < 3) {
                if (col < 3)
                  square = grid.slice(0, 3).map(row => row.slice(0, 3));
                else if (col < 6)
                  square = grid.slice(0, 3).map(row => row.slice(3, 6));
                else
                  square = grid.slice(0, 3).map(row => row.slice(6, 9));
              } else if (row < 6) {
                if (col < 3)
                  square = grid.slice(3, 6).map(row => row.slice(0, 3));
                else if (col < 6)
                  square = grid.slice(3, 6).map(row => row.slice(3, 6));
                else
                  square = grid.slice(3, 6).map(row => row.slice(6, 9));
              } else {
                if (col < 3)
                  square = grid.slice(6, 9).map(row => row.slice(0, 3));
                else if (col < 6)
                  square = grid.slice(6, 9).map(row => row.slice(3, 6));
                else
                  square = grid.slice(6, 9).map(row => row.slice(6, 9));
              }
              if (![].concat(...square).includes(value)) {
                grid[row][col] = value;
                if (checkGrid(grid)) {
                  return true;
                } else {
                  if (fillGrid(grid)) {
                    return true;
                  }
                }
              }
            }
          }
        }
        break;
      }
    }
    grid[row][col] = 0;
}
function renderBoard() {
    var table = document.getElementById('board');
    for (var i = 0; i < 9; ++i) {
        var row = document.createElement('tr');
        for (var j = 0; j < 9; ++j) {
            var cell = document.createElement('td');
            if (board[i][j] !== 0) {
                cell.textContent = board[i][j];
            } else {
                var input = document.createElement('input');
                input.type = 'text';
                input.maxLength = '1';
                input.id = `cell-${i}-${j}`; // Assign an ID to the input element
                cell.appendChild(input);
            }
            row.appendChild(cell);
        }
        table.appendChild(row);
    }
}

function checkSolution() {
    var table = document.getElementById('board');
    var userBoard = Array.from({length: 9}, () => new Array(9).fill(0));
    for (var i = 0; i < 9; ++i) {
        for (var j = 0; j < 9; ++j) {
            var cell = table.rows[i].cells[j] 
            if (board[i][j] !== 0) {
                userBoard[i][j] = board[i][j];
            } else {
                userBoard[i][j] = parseInt(cell.firstElementChild.value);
            }
        }
    }
    if (isValidSudoku(userBoard)) {
        alert("Correct solution!");
    } else {
        alert("Incorrect solution.");
    }
}

function valid(board, row, col, num) {
    for (let i = 0; i < 9; i++) {
        const m = 3 * Math.floor(row / 3) + Math.floor(i / 3);
        const n = 3 * Math.floor(col / 3) + i % 3;
        if (board[row][i] === num || board[i][col] === num || board[m][n] === num) {
            return false;
        }
    }
    return true;
}

function solveBoard(board) {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (board[i][j] === 0) {
                for (let num = 1; num <= 9; num++) {
                    if (valid(board, i, j, num)) {
                        board[i][j] = num;
                        if (solveBoard(board)) {
                            return true;
                        } else {
                            board[i][j] = 0;
                        }
                    }
                }
                return false;
            }
        }
    }
    return true;
}


function displaySolution(board) {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            let cell = document.getElementById(`cell-${i}-${j}`);
            if (cell != null) {
                if (cell.value != board[i][j]) {
                    cell.value = board[i][j];
                    cell.classList.add("cell-solved");
                } else {
                    cell.classList.add("correct");
                }
            }
        }
    }
}

function generateBoard() {
    grid = Array(9).fill().map(() => Array(9).fill(0));
    fillGrid(grid);
    for (let i = 0; i < 60; i++) {
        let row = Math.floor(Math.random() * 9);
        let col = Math.floor(Math.random() * 9);
        grid[row][col] = 0;
    }
    answer = JSON.parse(JSON.stringify(grid));
    solveBoard(answer);
    board = grid;
}

function resetBoard() {
    let boardElement = document.getElementById('board');
    while (boardElement.firstChild) {
        boardElement.firstChild.remove();
    }
    generateBoard();
    renderBoard();
}

const textarea = document.getElementById('myTextarea');
textarea.addEventListener('focus', function() {
  if (textarea.value === 'Import a board here') {
    textarea.value = '';
  }
});

textarea.addEventListener('input', function() {
  if (textarea.value !== 'Import a board here') {
    let boardElement = document.getElementById('board');
    while (boardElement.firstChild) {
        boardElement.firstChild.remove();
    }
    board = input_board(textarea.value);
    renderBoard();
  }
});

function input_board(value) {
    let board = [];
    let row = [];
    console.log(value.length);
    for (let i = 1; i < value.length - 1; ++i) {
        if (value[i] != '[' && value[i] != ']' && value[i] != '"' && value[i] != ',' && value[i] != ' ') {
            if (value[i] === '.') {
                row.push(0);
            } else if (/[0-9]/.test(value[i])) {
                row.push(parseInt(value[i], 10));
            }
        } else if (value[i] === ']' && row.length > 0) {
            board.push(row);
            row = [];
        }
    }

    return board;
}

document.getElementById('solve').addEventListener('click', function(event) {
    event.preventDefault();
    const hintButton = document.getElementById('Hint');
    hintButton.disabled = true;
    let boardCopy = JSON.parse(JSON.stringify(board));
    if (solveBoard(boardCopy)) {
        displaySolution(boardCopy);
    } else {
        alert('No solution found for the given Sudoku board.');
    }
});

document.getElementById('size-form').addEventListener('submit', function(event) {
    event.preventDefault();
    var size = document.getElementById('board-size').value;
    document.getElementById('board').innerHTML = '';
    renderBoard();
});

document.getElementById('reset').addEventListener('click', function (event) {
    const hintButton = document.getElementById('Hint');
    hintButton.disabled = false;
    Available_hints = 10;
    const hintsCounter = document.getElementById('hintsCounter');
    hintsCounter.textContent = Available_hints;
    event.preventDefault();
    resetBoard();
});

document.getElementById('Hint').addEventListener('click', function(event) {
    let row, col;
    let emptyCells = [];

    // Find all empty cells (user input cells)
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            if (board[i][j] === 0) {
                emptyCells.push({ row: i, col: j });
            }
        }
    }
    if (emptyCells.length > 0) {
        let randomIndex = Math.floor(Math.random() * emptyCells.length);
        row = emptyCells[randomIndex].row;
        col = emptyCells[randomIndex].col;

        // Fill the cell with the corresponding value from the answer array
        board[row][col] = answer[row][col];
        let cell = document.getElementById(`cell-${row}-${col}`);
        cell.value = board[row][col];
        cell.classList.add("cell-solved"); // Add a CSS class to mark hinted cells
    }
    Available_hints--;
    if (Available_hints === 0) {
        event.target.disabled = true;
    }
    const hintsCounter = document.getElementById('hintsCounter');
    hintsCounter.textContent = Available_hints;
});

document.getElementById('done-box').addEventListener('click',function(event) {
    textarea.value = "Import a board here";
    let boardElement = document.getElementById('board');
    while (boardElement.firstChild) {
        boardElement.firstChild.remove();
    }
    renderBoard();
});
const hintsCounter = document.getElementById('hintsCounter');
hintsCounter.textContent = Available_hints;
generateBoard();
renderBoard();