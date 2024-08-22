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
let tempStartX = 0; // Temporary start position for user line
let tempStartY = 0; // Temporary start position for user line
let tempEndX = 0; // Temporary end position for user line
let tempEndY = 0; // Temporary end position for user line
let hasDrawn = false; // Flag to prevent multiple user drawings
let userLine = null; // Store the user line for validation

// Coordinates for validation
const topRedCircle = { x: 100, y: 300 };
const bottomRedCircle = { x: 100, y: 300 + (200 - 100) }; // Assuming vertical distance is 200

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
    ctx.fillText('L4', 10, 30); // Position for the label (top-left corner)
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawLetterA() {
    clearCanvas(); // Clear the canvas before drawing
    lines.forEach((line, index) => {
        const delay = index * 3000; // Each line starts with a delay of 3000ms (3 seconds)
        drawLineWithCircles(line.x1, line.y1, line.x2, line.y2, line.color, delay, line.text, line.textX, line.textY);
    });
    
    // Draw the "L3" label
    drawLabel();
}

function validateUserLine(x1, y1, x2, y2) {
    // Check if the start and end points match the red circles
    const startIsValid = Math.abs(x1 - topRedCircle.x) < radius && Math.abs(y1 - topRedCircle.y) < radius;
    const endIsValid = Math.abs(x2 - bottomRedCircle.x) < radius && Math.abs(y2 - bottomRedCircle.y) < radius;
    return startIsValid && endIsValid;
}

function drawUserLine() {
    if (hasDrawn) return; // Prevent further drawing
    if (validateUserLine(tempStartX, tempStartY, tempEndX, tempEndY)) {
        drawLine(tempStartX, tempStartY, tempEndX, tempEndY, userLineColor, userLineWidth);
        hasDrawn = true; // Set flag to prevent further drawing
    } else {
        // Clear invalid line if drawn
        clearCanvas();
        drawLetterA();
        drawLabel();
    }
}

function touchStart(e) {
    if (!hasDrawn && !drawing && Date.now() > endTime) { // Only start drawing if the delay period has passed
        const touch = e.touches[0];
        tempStartX = touch.clientX - canvas.offsetLeft;
        tempStartY = touch.clientY - canvas.offsetTop;
        drawing = true;
    }
}

function touchMove(e) {
    if (drawing && !hasDrawn) {
        const touch = e.touches[0];
        tempEndX = touch.clientX - canvas.offsetLeft;
        tempEndY = touch.clientY - canvas.offsetTop;
        drawUserLine(); // Draw the line as the user moves their finger
    }
}

function touchEnd() {
    if (drawing) {
        drawing = false;
        drawUserLine(); // Validate and finalize the user line
    }
}

// Set up touch event listeners
canvas.addEventListener('touchstart', touchStart);
canvas.addEventListener('touchmove', touchMove);
canvas.addEventListener('touchend', touchEnd);

// Calculate end time for user drawing
let endTime = Date.now() + (lines.length * 3000) + delay; // End time to allow user drawing

drawLetterA(); // Call the function to draw the letter A