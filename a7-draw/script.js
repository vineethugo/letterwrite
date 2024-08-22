const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = 400;
canvas.height = 400;

const lineWidth = 25; // Line thickness for example lines
const userLineWidth = lineWidth * 2; // User line thickness (twice as thick as example)
const radius = lineWidth / 2; // Radius for rounded edges
const circleRadius = radius; // Radius for starting and ending circles
const exampleLines = [
    { x1: 100, y1: 300, x2: 200, y2: 100, color: 'red', text: '1', textX: 90, textY: 250 },
    { x1: 200, y1: 100, x2: 300, y2: 300, color: 'green', text: '2', textX: 310, textY: 250 },
    { x1: 150, y1: 200, x2: 250, y2: 200, color: 'blue', text: '3', textX: 190, textY: 260 }
];

let isExampleDrawn = false;
let isUserLineDrawn = false;

// Function to draw the letter example
function drawExampleLetter() {
    exampleLines.forEach((line, index) => {
        const delay = index * 3000; // Each line starts with a delay of 3000ms (3 seconds)
        setTimeout(() => {
            // Draw the starting circle
            drawCircle(line.x1, line.y1, line.color);

            // Draw the text (number) at the specified position before the line
            ctx.fillStyle = line.color;
            ctx.font = "20px Arial";
            ctx.fillText(line.text, line.textX, line.textY);

            // Immediately draw the line after the text
            drawLine(line.x1, line.y1, line.x2, line.y2, line.color, lineWidth);

            // Immediately draw the ending circle after the line
            drawCircle(line.x2, line.y2, line.color);

            if (line.color === 'blue') {
                isExampleDrawn = true; // Mark the example as fully drawn
            }
        }, delay);
    });
}

// Function to draw a circle
function drawCircle(x, y, color) {
    ctx.beginPath();
    ctx.arc(x, y, circleRadius, 0, Math.PI * 2, false);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
}

// Function to draw a line
function drawLine(x1, y1, x2, y2, color, width, opacity = 1.0) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.globalAlpha = opacity; // Set opacity
    ctx.stroke();
    ctx.closePath();
    ctx.globalAlpha = 1.0; // Reset opacity
}

// Function to check if a point is within a circle
function isPointInCircle(px, py, cx, cy, r) {
    return Math.hypot(px - cx, py - cy) <= r;
}

// Function to clear user lines
function clearUserLines() {
    // Clear user lines without clearing the example
    const image = ctx.getImageData(0, 0, canvas.width, canvas.height);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.putImageData(image, 0, 0);
}

// Function to set up user drawing
function setupUserDrawing() {
    let isDrawing = false;
    let startX = 0;
    let startY = 0;

    canvas.addEventListener('touchstart', (e) => {
        if (isExampleDrawn && !isUserLineDrawn) {
            isDrawing = true;
            const touch = e.touches[0];
            startX = touch.clientX - canvas.offsetLeft;
            startY = touch.clientY - canvas.offsetTop;
        }
    });

    canvas.addEventListener('touchmove', (e) => {
        if (isDrawing) {
            // Clear previous strokes and redraw example
            clearUserLines();
            const touch = e.touches[0];
            drawLine(startX, startY, touch.clientX - canvas.offsetLeft, touch.clientY - canvas.offsetTop, 'red', userLineWidth, 0.5); // Draw user's line with 50% transparency
        }
    });

    canvas.addEventListener('touchend', (e) => {
        if (isDrawing) {
            isDrawing = false;
            const touch = e.changedTouches[0];
            const endX = touch.clientX - canvas.offsetLeft;
            const endY = touch.clientY - canvas.offsetTop;

            // Check if the user's line starts and ends in the correct circles
            if (isPointInCircle(startX, startY, exampleLines[0].x1, exampleLines[0].y1, circleRadius) &&
                isPointInCircle(endX, endY, exampleLines[0].x2, exampleLines[0].y2, circleRadius)) {
                drawLine(startX, startY, endX, endY, 'red', userLineWidth); // Finalize user's line with full opacity
                isUserLineDrawn = true; // Mark user's line as drawn
            } else {
                clearUserLines(); // Dissolve user's line if not correct
            }
        }
    });
}

// Initialize
drawExampleLetter(); // Draw the example letter once
setupUserDrawing();  // Set up user drawing