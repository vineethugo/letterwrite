const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = 400;
canvas.height = 400;

const lineWidth = 25; // Line thickness for example lines
const userLineWidth = lineWidth * 2; // User line thickness (twice as thick as example)
const radius = lineWidth / 2; // Radius for rounded edges
let isExampleDrawn = false;

function drawCircle(x, y, color) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, false);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
}

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

function drawLineWithCircles(x1, y1, x2, y2, color, delay, text, textX, textY) {
    setTimeout(() => {
        // Step 1: Draw the starting circle
        drawCircle(x1, y1, color);

        // Step 2: Draw the text (number) at the specified position before the line
        ctx.fillStyle = color;
        ctx.font = "20px Arial";
        ctx.fillText(text, textX, textY);

        // Step 3: Immediately draw the line after the text
        drawLine(x1, y1, x2, y2, color, lineWidth);

        // Step 4: Immediately draw the ending circle after the line
        drawCircle(x2, y2, color);

        if (color === 'blue') {
            isExampleDrawn = true; // Mark the example as fully drawn
        }
    }, delay);
}

// Coordinates for the letter "A"
const lines = [
    { x1: 100, y1: 300, x2: 200, y2: 100, color: 'red', text: '1', textX: 90, textY: 250 },  // Left of the red line
    { x1: 200, y1: 100, x2: 300, y2: 300, color: 'green', text: '2', textX: 310, textY: 250 }, // Right of the green line (aligned with number 1)
    { x1: 150, y1: 200, x2: 250, y2: 200, color: 'blue', text: '3', textX: 190, textY: 260 }  // Below the blue line (moved further down)
];

// Draw each line with its circles and text
lines.forEach((line, index) => {
    const delay = index * 3000; // Each line starts with a delay of 3000ms (3 seconds)
    drawLineWithCircles(line.x1, line.y1, line.x2, line.y2, line.color, delay, line.text, line.textX, line.textY);
});

// Allow the user to draw after the example is done
setTimeout(() => {
    let isDrawing = false;
    let startX = 0;
    let startY = 0;

    canvas.addEventListener('mousedown', (e) => {
        if (isExampleDrawn) {
            isDrawing = true;
            startX = e.offsetX;
            startY = e.offsetY;
        }
    });

    canvas.addEventListener('mousemove', (e) => {
        if (isDrawing) {
            // Redraw the example letter without clearing the canvas
            drawLine(startX, startY, e.offsetX, e.offsetY, 'red', userLineWidth, 0.5); // Draw user's line with 50% transparency
        }
    });

    canvas.addEventListener('mouseup', (e) => {
        if (isDrawing) {
            isDrawing = false;
            drawLine(startX, startY, e.offsetX, e.offsetY, 'red', userLineWidth, 0.5); // Finalize user's line with 50% transparency
        }
    });

    canvas.addEventListener('touchstart', (e) => {
        if (isExampleDrawn) {
            isDrawing = true;
            const touch = e.touches[0];
            startX = touch.clientX - canvas.offsetLeft;
            startY = touch.clientY - canvas.offsetTop;
        }
    });

    canvas.addEventListener('touchmove', (e) => {
        if (isDrawing) {
            const touch = e.touches[0];
            drawLine(startX, startY, touch.clientX - canvas.offsetLeft, touch.clientY - canvas.offsetTop, 'red', userLineWidth, 0.5); // Draw user's line with 50% transparency
        }
    });

    canvas.addEventListener('touchend', (e) => {
        if (isDrawing) {
            isDrawing = false;
            const touch = e.changedTouches[0];
            drawLine(startX, startY, touch.clientX - canvas.offsetLeft, touch.clientY - canvas.offsetTop, 'red', userLineWidth, 0.5); // Finalize user's line with 50% transparency
        }
    });

}, lines.length * 3000 + 500); // Allow the user to draw after all lines have been drawn with an additional half-second delay

// Function to redraw the example letter (used for persistent example drawing)
function drawLetterA() {
    lines.forEach((line) => {
        drawLineWithCircles(line.x1, line.y1, line.x2, line.y2, line.color, 0, line.text, line.textX, line.textY);
    });
}