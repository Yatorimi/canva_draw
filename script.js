// Sélection des éléments du DOM
const table = document.getElementById('table');
const resetButton = document.getElementById('resetButton');
const eraseButton = document.getElementById('eraseButton');
const saveButton = document.getElementById('saveButton');
const createTableButton = document.getElementById('createTableButton');
const drawCircleButton = document.getElementById('drawCircleButton');
const rowsInput = document.getElementById('rows');
const columnsInput = document.getElementById('columns');

// Variables de contrôle
let isDrawing = false; // Pour indiquer si le dessin est en cours
let eraseMode = false; // Pour activer/désactiver la gomme
let drawCircleMode = false; // Pour activer/désactiver le dessin de cercles

// Ajout des gestionnaires d'événements pour les boutons et le tableau
createTableButton.addEventListener('click', createNewTable);
resetButton.addEventListener('click', resetTable);
eraseButton.addEventListener('click', toggleEraseMode);
saveButton.addEventListener('click', saveDrawing);
drawCircleButton.addEventListener('click', toggleDrawCircleMode);
table.addEventListener('mousedown', () => isDrawing = true);
table.addEventListener('mouseup', () => isDrawing = false);

// Fonction pour créer un nouveau tableau
function createNewTable() {
    clearTable();
    const rows = parseInt(rowsInput.value, 10);
    const columns = parseInt(columnsInput.value, 10);
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

// Fonction pour réinitialiser le tableau
function resetTable() {
    const cells = document.querySelectorAll('td');
    cells.forEach(cell => {
        cell.style.backgroundColor = 'white';
        cell.style.borderRadius = '0';
    });
    eraseMode = false;
    eraseButton.innerText = 'Prendre la gomme';
    drawCircleMode = false;
    drawCircleButton.innerText = 'Dessiner un cercle';
}

// Fonction pour activer/désactiver la gomme
function toggleEraseMode() {
    eraseMode = !eraseMode;
    eraseButton.innerText = eraseMode ? 'Poser la gomme' : 'Prendre la gomme';
    if (eraseMode) {
        eraseButton.style.fontWeight = '700'; 
        drawCircleMode = false; 
        drawCircleButton.innerText = 'Dessiner un cercle';
        drawCircleButton.style.fontWeight = '400'; 
    } else {
        eraseButton.style.fontWeight = '400'; 
    }
}

// Fonction pour sauvegarder le dessin
function saveDrawing() {
    const blackCells = document.querySelectorAll('td[style*="background-color: black"]');
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute('width', '800');
    svg.setAttribute('height', '800');
    const svgNS = svg.namespaceURI;
    blackCells.forEach(cell => {
        const shape = drawCircleMode && cell.style.borderRadius === '50%' ? 'circle' : 'rect';
        const svgElement = document.createElementNS(svgNS, shape);
        svgElement.setAttribute('fill', 'black');
        if (shape === 'circle') {
            const svgElement = document.createElementNS(svgNS, 'circle');
            svgElement.setAttribute('cx', cell.cellIndex * 40 + 20);
            svgElement.setAttribute('cy', cell.parentElement.rowIndex * 40 + 20);
            svgElement.setAttribute('r', '20');
            svgElement.setAttribute('fill', 'black');
            svg.appendChild(svgElement);
        } else {
            const svgElement = document.createElementNS(svgNS, 'rect');
            svgElement.setAttribute('x', cell.cellIndex * 40);
            svgElement.setAttribute('y', cell.parentElement.rowIndex * 40);
            svgElement.setAttribute('width', '40');
            svgElement.setAttribute('height', '40');
            svgElement.setAttribute('fill', 'black');
            svg.appendChild(svgElement);
        }
    });
    const svgBlob = new Blob([svg.outerHTML], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(svgBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'super_dessin.svg';
    link.click();
}

// Fonction pour activer/désactiver le dessin de cercles
function toggleDrawCircleMode() {
    drawCircleMode = !drawCircleMode;
    drawCircleButton.innerText = drawCircleMode ? 'Dessiner un cercle (actif)' : 'Dessiner un cercle';
    if (drawCircleMode) {
        drawCircleButton.style.fontWeight = '700'; 
        eraseMode = false; 
        eraseButton.innerText = 'Prendre la gomme';
        eraseButton.style.fontWeight = '400'; 
    } else {
        drawCircleButton.style.fontWeight = '400'; 
    }
}

// Gestionnaire d'événement pour le survol des cellules (pour le dessin)
function handleCellHover(e) {
    if (isDrawing) {
        e.target.style.backgroundColor = eraseMode ? 'white' : 'black';
        e.target.style.borderRadius = drawCircleMode && !eraseMode ? '50%' : '0';
    }
}

// Gestionnaire d'événement pour le clic sur une cellule (pour le dessin)
function handleCellClick(e) {
    if (eraseMode) {
        e.target.style.backgroundColor = 'white';
        e.target.style.borderRadius = '0';
    } else if (drawCircleMode) {
        e.target.style.backgroundColor = 'black';
        e.target.style.borderRadius = '50%';
    } else {
        e.target.style.backgroundColor = 'black';
        e.target.style.borderRadius = '0';
    }
}

// Fonction pour effacer le tableau
function clearTable() {
    table.innerHTML = '';
}
