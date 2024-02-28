/*----- constants -----*/
const COLORS = {
    '0': 'white',
    '1': 'purple',
    '-1': 'orange'
}

/*----- state variables -----*/
let board; // array of 7 column arrays
let turn; // 1 or -1
let winner; // null = no winner, tie = 'T', winner = 1/-1

/*----- cached elements  -----*/
const messageEl = document.querySelector('h1')
const playAgainBtn = document.querySelector('button')
const markerEls = [...document.querySelectorAll('#markers > div')]

/*----- event listeners -----*/
document.getElementById('markers').addEventListener('click', handleDrop)
playAgainBtn.addEventListener('click', init)


/*----- functions -----*/
init()

function init() {
    board = [
        [0, 0, 0, 0, 0, 0], // <
        [0, 0, 0, 0, 0, 0], // <
        [0, 0, 0, 0, 0, 0], // <
        [0, 0, 0, 0, 0, 0], // <
        [0, 0, 0, 0, 0, 0], // <
        [0, 0, 0, 0, 0, 0], // <
        [0, 0, 0, 0, 0, 0], // <
    ]
    turn = 1
    winner = null
    render()
}

function handleDrop(evt) {
    const colIdx = markerEls.indexOf(evt.target)
    if (colIdx === -1) return
    // create shortcut to the column array
    const colArr = board[colIdx]
    const rowIdx = colArr.indexOf(0)
    // Update the board state with the correct player value
    board[colIdx][rowIdx] = turn
    turn *= -1 // turn = turn * -1
    winner = getWinner(colIdx, rowIdx)
    render()
}

function getWinner(colIdx, rowIdx) {
    // Check for a winner in the board state
    // return null for no winner, 1/-1 winner, 'T' for tie
    return checkVerticalWin(colIdx, rowIdx) ||
    checkHorizontalWin(colIdx, rowIdx) ||
    checkDiagonalWinNESW(colIdx, rowIdx) ||
    checkDiagonalWinNWSE(colIdx, rowIdx)
}

function checkVerticalWin(colIdx, rowIdx) {
    return countAdjacent(colIdx, rowIdx, 0, -1) === 3 ? board[colIdx][rowIdx] : null
}

function checkHorizontalWin(colIdx, rowIdx) {
    const countAdjacentLeft = countAdjacent(colIdx, rowIdx, -1 ,0)
    const countAdjacentRight = countAdjacent(colIdx, rowIdx, 1 ,0)
    return (countAdjacentLeft + countAdjacentRight) >= 3 ? board[colIdx][rowIdx] : null
}

function checkDiagonalWinNESW(colIdx, rowIdx) {
    const countAdjacentNE = countAdjacent(colIdx, rowIdx, 1, 1)
    const countAdjacentSW = countAdjacent(colIdx, rowIdx, -1, -1)
    return (countAdjacentNE + countAdjacentSW) >= 3 ? board[colIdx][rowIdx] : null
}

function checkDiagonalWinNWSE(colIdx, rowIdx) {
    const countAdjacentNW = countAdjacent(colIdx, rowIdx, -1, 1)
    const countAdjacentSE = countAdjacent(colIdx, rowIdx, 1, -1)
    return (countAdjacentNW + countAdjacentSE) >= 3 ? board[colIdx][rowIdx] : null
}

function countAdjacent(colIdx, rowIdx, colOffset, rowOffset) {
    // Shorthand variable for the player value
    const player = board[colIdx][rowIdx]
    let count = 0
    colIdx += colOffset
    rowIdx += rowOffset
    // Ensure colIdx is with bounds of the array and same value
    while (
        board[colIdx] !== undefined &&
        board[colIdx][rowIdx] !== undefined &&
        board[colIdx][rowIdx] === player
        ) {
            count++
            colIdx += colOffset
            rowIdx += rowOffset
    }
    return count
}

function render() {
    renderBoard()
    renderMessage()
    renderControls()
}

function renderBoard() {
    board.forEach(function(colArr, colIdx) {
        // iterate over the cells in the current column
        colArr.forEach(function(cellVal, rowIdx) {
            const cellId = `c${colIdx}r${rowIdx}`
            const cellEl = document.getElementById(cellId)
            cellEl.style.backgroundColor = COLORS[cellVal]
        })
    })
}

function renderMessage() {
    if (winner === 'T') {
        messageEl.innerText = "It's a Tie!!!"
    } else if (winner) {
        messageEl.innerHTML = `<span style="color: ${COLORS[winner]}">${COLORS[winner]}</span> Wins!`
    } else {
        messageEl.innerHTML = `<span style="color: ${COLORS[turn]}">${COLORS[turn]}</span>'s Turn`
    }
}

function renderControls() {
    // Ternary expression is our go to when you want
    // 1 of 2 values returned
    // <conditional expression> ? <truthy value> : <falsy value>
    playAgainBtn.style.visibility = winner ? 'visible' : 'hidden'

    // Bonus: make arrows disappear when column is full
}