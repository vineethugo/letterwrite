const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = 400;
canvas.height = 400;

const lineWidth = 25; // Line thickness for the example lines
const userLineWidth = lineWidth * 1.5; // User-drawn lines will be 1.5x as thick as the example lines
const radius = lineWidth / 2; // Radius for rounded edges
const userLineColor = 'rgba(255, 0, 0, 0.5)'; // Transparent red color for user lines
const delay = 1000; // Delay in milliseconds (1 second) before user drawing

let drawing = false;
let startX = 0;
let startY = 0;
let hasDrawn = false; // Flag to prevent multiple user drawings

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

    }, delay);
}

// Function to draw the "L3" label
function drawLabel() {
    ctx.fillStyle = 'black'; // Color for the label
    ctx.font = "20px Arial";
    ctx.fillText('L3', 10, 30); // Position for the label (top-left corner)
}

// Coordinates for the letter "A"
const lines = [
    { x1: 100, y1: 300, x2: 200, y2: 100, color: 'red', text: '1', textX: 90, textY: 250 },  // Left of the red line
    { x1: 200, y1: 100, x2: 300, y2: 300, color: 'green', text: '2', textX: 310, textY: 250 }, // Right of the green line (aligned with number 1)
    { x1: 150, y1: 200, x2: 250, y2: 200, color: 'blue', text: '3', textX: 190, textY: 260 }  // Below the blue line (moved further down)
];

function drawLetterA() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas before drawing
    lines.forEach((line, index) => {
        const delay = index * 3000; // Each line starts with a delay of 3000ms (3 seconds)
        drawLineWithCircles(line.x1, line.y1, line.x2, line.y2, line.color, delay, line.text, line.textX, line.textY);
    });
    
    // Draw the "L3" label
    drawLabel();
}

// Function to handle touch start
function touchStart(e) {
    if (!hasDrawn && !drawing && Date.now() > endTime) { // Only start drawing if the delay period has passed
        const touch = e.touches[0];
        startX = touch.clientX - canvas.offsetLeft;
        startY = touch.clientY - canvas.offsetTop;
        drawing = true;
    }
}

// Function to handle touch move
function touchMove(e) {
    if (drawing && !hasDrawn) {
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
    if (drawing) {
        drawing = false;
        hasDrawn = true; // Set flag to prevent further drawing
    }
}

// Set up touch event listeners
canvas.addEventListener('touchstart', touchStart);
canvas.addEventListener('touchmove', touchMove);
canvas.addEventListener('touchend', touchEnd);

// Calculate end time for user drawing
let endTime = Date.now() + (lines.length * 3000) + delay; // End time to allow user drawing

drawLetterA(); // Call the function to draw the letter A