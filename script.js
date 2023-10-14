// Sélection des éléments du DOM
const table = document.getElementById('table');
const resetButton = document.getElementById('resetButton');
const eraseButton = document.getElementById('eraseButton');
const saveButton = document.getElementById('saveButton');
const createTableButton = document.getElementById('createTableButton');
const drawCircleButton = document.getElementById('drawCircleButton');
const rowsInput = document.getElementById('rows');
const columnsInput = document.getElementById('columns');
const imageInput = document.getElementById('imageInput');

// Variables de contrôle
let isDrawing = false;
let eraseMode = false;
let drawCircleMode = false; 

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

// Fonction pour sauvegarder le dessin au format SVG
function saveDrawing() {
   
    const cells = document.querySelectorAll('td');

    
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute('width', '100%'); 
    svg.setAttribute('height', '100%'); 
    const svgNS = svg.namespaceURI;

    
    const tableWidth = columnsInput.value;
    const tableHeight = rowsInput.value;
    const cellWidth = 100 / tableWidth;
    const cellHeight = 100 / tableHeight;

    // Fonction pour convertir une couleur RGB en HSL
    function rgbToHsl(rgbColor) {
        const rgbArray = rgbColor.substring(4, rgbColor.length - 1).split(',').map(Number);
        const r = rgbArray[0] / 255;
        const g = rgbArray[1] / 255;
        const b = rgbArray[2] / 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0; // Nuance de gris
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

            switch (max) {
                case r:
                    h = (g - b) / d + (g < b ? 6 : 0);
                    break;
                case g:
                    h = (b - r) / d + 2;
                    break;
                case b:
                    h = (r - g) / d + 4;
                    break;
            }

            h /= 6;
        }

        return [h, s, l];
    }

    
    cells.forEach((cell, index) => {
        const backgroundColor = window.getComputedStyle(cell).backgroundColor;
        const hslColor = rgbToHsl(backgroundColor);
        const lightness = hslColor[2] * 100; 

        if (lightness <= 50) { 
            const x = (index % tableWidth) * cellWidth;
            const y = Math.floor(index / tableWidth) * cellHeight;

            if (cell.style.borderRadius === '50%') {
                
                const svgElement = document.createElementNS(svgNS, 'circle');
                svgElement.setAttribute('cx', `${x + cellWidth / 2}%`);
                svgElement.setAttribute('cy', `${y + cellHeight / 2}%`);
                svgElement.setAttribute('r', `${Math.min(cellWidth, cellHeight) / 2}%`);
                svgElement.setAttribute('fill', backgroundColor);
                svg.appendChild(svgElement);
            } else {
                
                const svgElement = document.createElementNS(svgNS, 'rect');
                svgElement.setAttribute('x', `${x}%`);
                svgElement.setAttribute('y', `${y}%`);
                svgElement.setAttribute('width', `${cellWidth}%`);
                svgElement.setAttribute('height', `${cellHeight}%`);
                svgElement.setAttribute('fill', backgroundColor);
                svg.appendChild(svgElement);
            }
        }
    });

   //download
    const svgBlob = new Blob([new XMLSerializer().serializeToString(svg)], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(svgBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'mon_superdessin.svg';
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

// Ajoutez un gestionnaire d'événements pour l'élément input de type fichier
imageInput.addEventListener('change', handleImageUpload);

function handleImageUpload() {
    const image = new Image();
    const file = imageInput.files[0];
    const reader = new FileReader();

    reader.onload = function(event) {
        image.src = event.target.result;

        
        image.onload = function() {
            
            updateTableFromImage(image);
        };
    };

    if (file) {
        reader.readAsDataURL(file);
    }
}

// Fonction pour analyser l'image et mettre à jour le tableau
function updateTableFromImage(image) {
    
    const img = new Image();
    img.src = image.src;

    img.onload = () => {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        context.drawImage(img, 0, 0, img.width, img.height);

        const cells = document.querySelectorAll('td');
        const tableWidth = columnsInput.value;
        const cellWidth = canvas.width / tableWidth;
        const tableHeight = rowsInput.value;
        const cellHeight = canvas.height / tableHeight;

        for (let i = 0; i < tableHeight; i++) {
            for (let j = 0; j < tableWidth; j++) {
                const x = j * cellWidth;
                const y = i * cellHeight;
                const pixelData = context.getImageData(x, y, cellWidth, cellHeight).data;
                let red = 0;
                let green = 0;
                let blue = 0;

                // Calcul de la couleur dominante dans la région
                for (let k = 0; k < pixelData.length; k += 4) {
                    red += pixelData[k];
                    green += pixelData[k + 1];
                    blue += pixelData[k + 2];
                }

                red = Math.round(red / (cellWidth * cellHeight));
                green = Math.round(green / (cellWidth * cellHeight));
                blue = Math.round(blue / (cellWidth * cellHeight));

                
                const cellIndex = i * tableWidth + j;
                const cell = cells[cellIndex];
                cell.style.backgroundColor = `rgb(${red},${green},${blue})`;
                cell.style.borderRadius = '0';
            }
        }
    };
}
