const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = 400;
canvas.height = 400;

const lineWidth = 25; // Line thickness for the letter "A"
const userLineWidth = lineWidth * 2; // User-drawn lines will be twice as thick
const radius = lineWidth / 2; // Radius for rounded edges
let isDrawing = false;
let startX = 0;
let startY = 0;
let linesDrawn = 0;
let letterDrawingComplete = false;
const dissolveTime = 1000; // Time in ms for the incorrect line to dissolve

// Set up the canvas background
function setupCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    ctx.fillStyle = 'white'; // Background color
    ctx.fillRect(0, 0, canvas.width, canvas.height); // Fill with white background
}

function drawCircle(x, y, color) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, false);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
}

function drawLine(x1, y1, x2, y2, color) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
    ctx.closePath();
}

function drawLineWithCircles(x1, y1, x2, y2, color, delay, text, textX, textY) {
    return new Promise((resolve) => {
        setTimeout(() => {
            // Step 1: Draw the starting circle
            drawCircle(x1, y1, color);

            // Step 2: Draw the text (number) at the specified position before the line
            ctx.fillStyle = color;
            ctx.font = "20px Arial";
            ctx.fillText(text, textX, textY);

            // Step 3: Immediately draw the line after the text
            drawLine(x1, y1, x2, y2, color);

            // Step 4: Immediately draw the ending circle after the line
            drawCircle(x2, y2, color);

            resolve();
        }, delay);
    });
}

// Coordinates for the letter "A"
const lines = [
    { x1: 100, y1: 300, x2: 200, y2: 100, color: 'red', text: '1', textX: 90, textY: 250 },  // Left of the red line
    { x1: 200, y1: 100, x2: 300, y2: 300, color: 'green', text: '2', textX: 310, textY: 250 }, // Right of the green line (aligned with number 1)
    { x1: 150, y1: 200, x2: 250, y2: 200, color: 'blue', text: '3', textX: 190, textY: 260 }  // Below the blue line (moved further down)
];

// Define the correct start and end points for user strokes
const correctPoints = [
    { startX: 200, startY: 100, endX: 100, endY: 300 },  // Red stroke
    { startX: 200, startY: 100, endX: 300, endY: 300 },  // Green stroke
    { startX: 150, startY: 200, endX: 250, endY: 200 }   // Blue stroke
];

async function drawLetterA() {
    for (let i = 0; i < lines.length; i++) {
        await drawLineWithCircles(
            lines[i].x1, lines[i].y1,
            lines[i].x2, lines[i].y2,
            lines[i].color,
            i * 3000, // Delay of 3000ms (3 seconds) per line
            lines[i].text,
            lines[i].textX,
            lines[i].textY
        );
    }
    letterDrawingComplete = true; // Allow user drawing after letter is complete
}

// Function to check if the user's stroke is correct
function isCorrectStroke(startX, startY, endX, endY) {
    const tolerance = 10; // Allow a small tolerance for user accuracy
    const correctStart = correctPoints[linesDrawn];
    
    return (
        Math.abs(startX - correctStart.startX) <= tolerance &&
        Math.abs(startY - correctStart.startY) <= tolerance &&
        Math.abs(endX - correctStart.endX) <= tolerance &&
        Math.abs(endY - correctStart.endY) <= tolerance
    );
}

// Handle touch start event
canvas.addEventListener('touchstart', (e) => {
    if (letterDrawingComplete && linesDrawn < 3) { // Allow user to draw after letter drawing is complete
        isDrawing = true;
        const touch = e.touches[0];
        startX = touch.clientX - canvas.offsetLeft;
        startY = touch.clientY - canvas.offsetTop;
    }
});

// Handle touch move event
canvas.addEventListener('touchmove', (e) => {
    if (isDrawing) {
        setupCanvas(); // Redraw the background to avoid trails
        // Redraw the letter "A"
        lines.forEach((line) => {
            drawLine(line.x1, line.y1, line.x2, line.y2, line.color);
            drawCircle(line.x1, line.y1, line.color);
            drawCircle(line.x2, line.y2, line.color);
            ctx.fillStyle = line.color;
            ctx.font = "20px Arial";
            ctx.fillText(line.text, line.textX, line.textY);
        });

        const touch = e.touches[0];
        const colors = ['red', 'green', 'blue'];
        const currentColor = colors[linesDrawn]; // Determine color based on number of lines drawn
        
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(touch.clientX - canvas.offsetLeft, touch.clientY - canvas.offsetTop);
        ctx.strokeStyle = `${currentColor}`; // Use solid color for the stroke
        ctx.globalAlpha = 0.5; // Set transparency
        ctx.lineWidth = userLineWidth; // Set the user line width to be twice as thick
        ctx.stroke();
        ctx.globalAlpha = 1; // Reset transparency
        ctx.closePath();
    }
});

// Handle touch end event
canvas.addEventListener('touchend', (e) => {
    if (isDrawing) {
        isDrawing = false;
        const touch = e.changedTouches[0];
        const colors = ['red', 'green', 'blue'];
        const currentColor = colors[linesDrawn]; // Determine color based on number of lines drawn

        const endX = touch.clientX - canvas.offsetLeft;
        const endY = touch.clientY - canvas.offsetTop;

        if (isCorrectStroke(startX, startY, endX, endY)) {
            // Correct stroke, finalize the line
            ctx.beginPath();
            ctx.moveTo(startX, startY);
            ctx.lineTo(endX, endY);
            ctx.strokeStyle = `${currentColor}`;
            ctx.lineWidth = userLineWidth;
            ctx.stroke();
            ctx.closePath();
            linesDrawn++;
        } else {
            // Incorrect stroke, dissolve the line
            let opacity = 1.0;
            const interval = setInterval(() => {
                opacity -= 0.1;
                if (opacity <= 0) {
                    clearInterval(interval);
                    setupCanvas(); // Clear the incorrect line and redraw the letter
                    lines.forEach((line) => {
                        drawLine(line.x1, line.y1, line.x2, line.y2, line.color);
                        drawCircle(line.x1, line.y1, line.color);
                        drawCircle(line.x2, line.y2, line.color);
                        ctx.fillStyle = line.color;
                        ctx.font = "20px Arial";
                        ctx.fillText(line.text, line.textX, line.textY);
                    });
                } else {
                    setupCanvas();
                    lines.forEach((line) => {
                        drawLine(line.x1, line.y1, line.x2, line.y2, line.color);
                        drawCircle(line.x1, line.y1, line.color);
                        drawCircle(line.x2, line.y2, line.color);
                        ctx.fillStyle = line.color;
                        ctx.font = "20px Arial";
                        ctx.fillText(line.text, line.textX, line.textY);
                    });
                    ctx.globalAlpha = opacity;
                    ctx.beginPath();
                    ctx.moveTo(startX, startY);
                    ctx.lineTo(endX, endY);
                    ctx.strokeStyle = `${currentColor}`;
                    ctx.lineWidth = userLineWidth;
                    ctx.stroke();
                    ctx.globalAlpha = 1;
                    ctx.closePath();
                }
            }, dissolveTime / 10);
        }
    }
});

//