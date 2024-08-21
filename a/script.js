const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');

// Adjusted stroke data for letter "A"
const strokes = [
    { x1: 0.25, y1: 0.75, x2: 0.75, y2: 0.25 },  // First stroke: left diagonal
    { x1: 0.75, y1: 0.75, x2: 0.25, y2: 0.25 },  // Second stroke: right diagonal
    { x1: 0.25, y1: 0.55, x2: 0.75, y2: 0.55 }    // Third stroke: crossbar
];

let currentStroke = 0;
let isDrawing = false;
let startX, startY;

function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    clearCanvas();
}

function drawGuideLines() {
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'gray';
    ctx.font = '20px Arial';
    ctx.fillStyle = 'black';

    // Draw arrows and numbers
    strokes.forEach((stroke, index) => {
        const x1 = stroke.x1 * canvas.width;
        const y1 = (1 - stroke.y1) * canvas.height;
        const x2 = stroke.x2 * canvas.width;
        const y2 = (1 - stroke.y2) * canvas.height;
        drawArrow(ctx, x1, y1, x2, y2);
        ctx.fillText(index + 1, (x1 + x2) / 2, (y1 + y2) / 2);
    });
}

function drawArrow(context, fromx, fromy, tox, toy) {
    const headlen = 10 * (canvas.width / 300); // scale arrowhead size
    const angle = Math.atan2(toy - fromy, tox - fromx);
    context.moveTo(fromx, fromy);
    context.lineTo(tox, toy);
    context.lineTo(tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6));
    context.moveTo(tox, toy);
    context.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6));
    context.stroke();
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGuideLines();
}

function startDrawing(e) {
    isDrawing = true;
    [startX, startY] = [e.offsetX, e.offsetY];
}

function draw(e) {
    if (!isDrawing) return;

    const userX1 = startX;
    const userY1 = startY;
    const userX2 = e.offsetX;
    const userY2 = e.offsetY;

    ctx.lineWidth = 4;
    ctx.strokeStyle = 'blue'; // User stroke color

    ctx.beginPath();
    ctx.moveTo(userX1, userY1);
    ctx.lineTo(userX2, userY2);
    ctx.stroke();

    const expected = strokes[currentStroke];
    const correct = checkStroke(expected, userX1, userY1, userX2, userY2);

    if (!correct) {
        setTimeout(clearCanvas, 200);
    } else if (correct && e.type === 'mouseup') {
        currentStroke++;
        if (currentStroke >= strokes.length) {
            alert('Well done!');
            currentStroke = 0;
            setTimeout(clearCanvas, 500);
        }
    }

    [startX, startY] = [userX2, userY2];
}

function checkStroke(expected, x1, y1, x2, y2) {
    const expectedX1 = expected.x1 * canvas.width;
    const expectedY1 = (1 - expected.y1) * canvas.height;
    const expectedX2 = expected.x2 * canvas.width;
    const expectedY2 = (1 - expected.y2) * canvas.height;

    // Basic check: ensure direction and length are somewhat correct
    const len1 = Math.hypot(expectedX2 - expectedX1, expectedY2 - expectedY1);
    const len2 = Math.hypot(x2 - x1, y2 - y1);
    const angle1 = Math.atan2(expectedY2 - expectedY1, expectedX2 - expectedX1);
    const angle2 = Math.atan2(y2 - y1, x2 - x1);

    return Math.abs(len1 - len2) < 50 && Math.abs(angle1 - angle2) < 0.5;
}

function stopDrawing() {
    isDrawing = false;
}

canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);
window.addEventListener('resize', resizeCanvas);

// Initial setup
resizeCanvas();