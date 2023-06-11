function generateBoard() {
    let board = new Array(9).fill(0).map(() => new Array(9).fill(0));
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            board[i][j] = (i*3 + Math.floor(i/3) + j) % 9 + 1;
        }
    }
    return board;
}

function removeNumbers(board, count) {
    let i = 0;
    while (i < count) {
        let row = Math.floor(Math.random() * 9);
        let col = Math.floor(Math.random() * 9);
        if (board[row][col] !== 0) {
            board[row][col] = 0;
            i++;
        }
    }
    return board;
}
let x;
function generatePuzzle() {
    let board = generateBoard();
    board = removeNumbers(board, 40);
    return board;
}
let board = [[7, 8, 0, 4, 0, 0, 1, 2, 0],
    [6, 0, 0, 0, 7, 5, 0, 0, 9],
    [0, 0, 0, 6, 0, 1, 0, 7, 8],
    [0, 0, 7, 0, 4, 0, 2, 6, 0],
    [0, 0, 1, 0, 5, 0, 9, 3, 0],
    [9, 0, 4, 0, 6, 0, 0, 0, 5],
    [0, 7, 0, 3, 0, 0, 0, 1, 2],
    [1, 2, 0, 0, 0, 7, 4, 0, 0],
    [0, 4, 9, 2, 0, 6, 0, 0, 7]]

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
                        let cell = document.getElementById(`cell-${i}-${j}`);
                        board[i][j] = num;
                        cell.classList.add("cell-solved");
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

document.getElementById('solve').addEventListener('click', function(event) {
    event.preventDefault();
    let boardCopy = JSON.parse(JSON.stringify(board));
    if (solveBoard(boardCopy)) {
        displaySolution(boardCopy);
    } else {
        alert('No solution found for the given Sudoku board.');
    }
});

function displaySolution(board) {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            let cell = document.getElementById(`cell-${i}-${j}`);
            if (cell != null) {
                cell.value = board[i][j];
                cell.classList.add("cell-solved");
            } else {
                console.log("I'm null!!!");
            }
        }
    }
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


document.getElementById('size-form').addEventListener('submit', function(event) {
    event.preventDefault();
    var size = document.getElementById('board-size').value;
    document.getElementById('board').innerHTML = '';
    renderBoard();
});

document.getElementById('reset').addEventListener('click', function(event) {
    event.preventDefault();
    let boardElement = document.getElementById('board');
    while (boardElement.firstChild) {
        boardElement.firstChild.remove();
    }
    board = generatePuzzle();
    renderBoard();
});

document.getElementById('done-box').addEventListener('click',function(event) {
    textarea.value = "Import a board here";
    let boardElement = document.getElementById('board');
    while (boardElement.firstChild) {
        boardElement.firstChild.remove();
    }
    renderBoard();
});
renderBoard();