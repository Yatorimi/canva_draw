const table = document.getElementById('table');
const resetButton = document.getElementById('resetButton');
const eraseButton = document.getElementById('eraseButton');
const saveButton = document.getElementById('saveButton');
let isDrawing = false;
let eraseMode = false;

function createTable(rows, columns) {
    for (let i = 0; i < rows; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < columns; j++) {
            const cell = document.createElement('td');
            cell.addEventListener('mousemove', handleCellHover);
            cell.addEventListener('click', handleCellClick);
            row.appendChild(cell);
        }
        table.appendChild(row);
    }
}

function handleCellHover(e) {
    if (isDrawing) {
        if (eraseMode) {
            e.target.style.backgroundColor = 'white';
        } else {
            e.target.style.backgroundColor = 'black';
        }
    }
}

function handleCellClick(e) {
    if (eraseMode) {
        e.target.style.backgroundColor = 'white';
    }
}

resetButton.addEventListener('click', function () {
    const cells = document.querySelectorAll('td');
    cells.forEach(cell => cell.style.backgroundColor = 'white');
    eraseMode = false;
    eraseButton.innerText = 'Prendre la gomme';
});

eraseButton.addEventListener('click', () => {
    eraseMode = !eraseMode;
    if (eraseMode) {
        eraseButton.innerText = 'Poser la gomme';
    } else {
        eraseButton.innerText = 'Prendre la gomme';
    }
});

saveButton.addEventListener('click', function () {
    const blackCells = document.querySelectorAll('td[style*="background-color: black"]');
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    const svgNS = svg.namespaceURI;

    svg.setAttribute('width', '800'); 
    svg.setAttribute('height', '800');

    blackCells.forEach(cell => {
        const rect = document.createElementNS(svgNS, 'rect');
        rect.setAttribute('x', cell.cellIndex * 40);
        rect.setAttribute('y', cell.parentElement.rowIndex * 40);
        rect.setAttribute('width', '40');
        rect.setAttribute('height', '40');
        rect.setAttribute('fill', 'black');
        svg.appendChild(rect);
    });

    const svgBlob = new Blob([svg.outerHTML], {type: 'image/svg+xml'});
    const url = URL.createObjectURL(svgBlob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'my_drawing.svg';
    link.click();
});

table.addEventListener('mousedown', () => {
    isDrawing = true;
});

table.addEventListener('mouseup', () => {
    isDrawing = false;
});

createTable(20, 20);
