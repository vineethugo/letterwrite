const canvas = document.getElementById('letterCanvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('startButton');
const winnerMessage = document.getElementById('winnerMessage');

canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;

let currentLetter = '';
let strokes = [];
let currentStrokeIndex = 0;
let isDrawing = false;

const letters = {
    'A': [
        { start: [50, 200], end: [150, 50], color: 'red' },
        { start: [150, 50], end: [250, 200], color: 'blue' },
        { start: [90, 125], end: [210, 125], color: 'green' }
    ],
    // Add more letters here with their strokes.
    'a': [
        { start: [150, 150], end: [200, 200], color: 'red' },
        { start: [200, 200], end: [150, 250], color: 'blue' },
        { start: [150, 250], end: [100, 200], color: 'green' }
    ]
};

function drawLetterAnimation(letter) {
    let i = 0;
    function drawNextStroke() {
        if (i < strokes.length) {
            ctx.strokeStyle = strokes[i].color;
            ctx.lineWidth = 5;
            ctx.lineCap = 'round';
            ctx.beginPath();
            ctx.moveTo(strokes[i].start[0], strokes[i].start[1]);
            ctx.lineTo(strokes[i].end[0], strokes[i].end[1]);
            ctx.stroke();
            i++;
            setTimeout(drawNextStroke, 1000); // Adjust speed here
        } else {
            startButton.disabled = false;
        }
    }
    drawNextStroke();
}

function startTracing() {
    currentStrokeIndex = 0;
    isDrawing = true;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawLetterAnimation(currentLetter);
}

canvas.addEventListener('mousedown', function (e) {
    if (!isDrawing) return;

    const { offsetX: x, offsetY: y } = e;
    const currentStroke = strokes[currentStrokeIndex];
    const [startX, startY] = currentStroke.start;

    if (Math.abs(x - startX) < 20 && Math.abs(y - startY) < 20) {
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        canvas.addEventListener('mousemove', onMouseMove);
        canvas.addEventListener('mouseup', onMouseUp);
    }
});

function onMouseMove(e) {
    const { offsetX: x, offsetY: y } = e;
    ctx.lineTo(x, y);
    ctx.strokeStyle = strokes[currentStrokeIndex].color;
    ctx.lineWidth = 5;
    ctx.stroke();
}

function onMouseUp(e) {
    const { offsetX: x, offsetY: y } = e;
    const currentStroke = strokes[currentStrokeIndex];
    const [endX, endY] = currentStroke.end;

    if (Math.abs(x - endX) < 20 && Math.abs(y - endY) < 20) {
        currentStrokeIndex++;
        if (currentStrokeIndex === strokes.length) {
            isDrawing = false;
            winnerMessage.style.display = 'block';
        }
    } else {
        alert('Try Again!');
    }

    canvas.removeEventListener('mousemove', onMouseMove);
    canvas.removeEventListener('mouseup', onMouseUp);
}

startButton.addEventListener('click', function () {
    winnerMessage.style.display = 'none';
    currentLetter = getRandomLetter();
    strokes = letters[currentLetter];
    startButton.disabled = true;
    startTracing();
});

function getRandomLetter() {
    const keys = Object.keys(letters);
    return keys[Math.floor(Math.random() * keys.length)];
}