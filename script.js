const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const resetButton = document.getElementById('resetButton');

let drawing = false;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

ctx.lineWidth = 5;
ctx.lineJoin = 'round';
ctx.lineCap = 'round';
ctx.strokeStyle = 'black';

function startPosition(e) {
    drawing = true;
    draw(e);
}

function endPosition() {
    drawing = false;
    ctx.beginPath();
}

function draw(e) {
    if (!drawing) return;

    ctx.lineTo(e.clientX, e.clientY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(e.clientX, e.clientY);
}

resetButton.addEventListener('click', function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

canvas.addEventListener('mousedown', startPosition);
canvas.addEventListener('mouseup', endPosition);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseleave', endPosition);
