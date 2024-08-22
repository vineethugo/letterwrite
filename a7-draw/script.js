const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = 400;
canvas.height = 400;

const lineWidth = 25; // Line thickness for the example lines
const userLineWidth = lineWidth * 2; // User-drawn lines will be twice as thick
const radius = lineWidth / 2; // Radius for rounded edges
const userLineColor = 'rgba(255, 0, 0, 0.5)'; // Transparent red color for user lines
const delay = 1000; // Delay in milliseconds (1 second) before user drawing

function drawCircle(x, y, color) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, false);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
}

function drawLine(x1, y1, x2, y2, color, width) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.stroke();
    ctx.closePath();
}

function drawLineWithCircles(x1, y1, x2, y2, color, delayBefore, text, textX, textY) {
    setTimeout(() => {
        // Step 1: Draw the starting circle
        drawCircle(x1, y1, color);

        // Step 2: Draw the text (number) at the specified position before the line
        ctx.fillStyle = color;
        ctx.font = "20px Arial";
        ctx.fillText(text, textX, textY);

        // Step 3: Draw the line after the text
        drawLine(x1, y1, x2, y2, color, lineWidth);

        // Step 4: Draw the ending circle after the line
        drawCircle(x2, y2, color);

    }, delayBefore);
}

function drawTextL1() {
    ctx.fillStyle = 'black'; // Color of the text
    ctx.font = "20px Arial";
    ctx.fillText('L1', 10, 30); // Position at the top-left corner
}

// Coordinates for the letter "A"
const lines = [
    { x1: 100, y1: 300, x2: 200, y2: 100, color: 'red', text: '1', textX: 90, textY: 250 },  // Left of the red line
    { x1: 200, y1: 100, x2: 300, y2: 300, color: 'green', text: '2', textX: 310, textY: 250 }, // Right of the green line (aligned with number 1)
    { x1: 150, y1: 200, x2: 250, y2: 200, color: 'blue', text: '3', textX: 190, textY: 260 }  // Below the blue line (moved further down)
];

lines.forEach((line, index) => {
    const lineDelay = index * 3000; // Each line starts with a delay of 3000ms (3 seconds)
    drawLineWithCircles(line.x1, line.y1, line.x2, line.y2, line.color, lineDelay, line.text, line.textX, line.textY);
});

// User drawing setup
let drawing = false;
let startX = 0;
let startY = 0;

// Function to handle touch start
function touchStart(e) {
    if (!drawing && Date.now() > endTime) { // Only start drawing if the delay period has passed
        const touch = e.touches[0];
        startX = touch.clientX - canvas.offsetLeft;
        startY = touch.clientY - canvas.offsetTop;
        drawing = true;
    }
}

// Function to handle touch move
function touchMove(e) {
    if (drawing) {
        const touch = e.touches[0];
        const endX = touch.clientX - canvas.offsetLeft;
        const endY = touch.clientY - canvas.offsetTop;
        drawLine(startX, startY, endX, endY, userLineColor, userLineWidth);
        startX = endX;
        startY = endY;
    }
}

// Function to handle touch end
function touchEnd() {
    drawing = false;
}

// Set up touch event listeners
canvas.addEventListener('touchstart', touchStart);
canvas.addEventListener('touchmove', touchMove);
canvas.addEventListener('touchend', touchEnd);

// Calculate end time for user drawing
let endTime = Date.now() + (lines.length * 3000) + delay; // End time to allow user drawing

// Draw the letter A and the text L1
function drawAll() {
    drawTextL1(); // Draw "L1" text
    lines.forEach((line, index) => {
        const lineDelay = index * 3000; // Each line starts with a delay of 3000ms (3 seconds)
        drawLineWithCircles(line.x1, line.y1, line.x2, line.y2, line.color, lineDelay, line.text, line.textX, line.textY);
    });
}

drawAll(); // Call the function to draw everything