const table = document.getElementById('table');
const resetButton = document.getElementById('resetButton');
let isDrawing = false;

function createTable(rows, columns) {
    for (let i = 0; i < rows; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < columns; j++) {
            const cell = document.createElement('td');
            cell.addEventListener('mousemove', handleCellHover);
            row.appendChild(cell);
        }
        table.appendChild(row);
    }
}

function handleCellHover(e) {
    if (isDrawing) {
        e.target.style.backgroundColor = 'black';
    }
}

resetButton.addEventListener('click', function () {
    const cells = document.querySelectorAll('td');
    cells.forEach(cell => cell.style.backgroundColor = 'white');
});

table.addEventListener('mousedown', () => {
    isDrawing = true;
});

table.addEventListener('mouseup', () => {
    isDrawing = false;
});

createTable(50, 50); // cases du tableau
