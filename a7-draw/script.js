const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = 400;
canvas.height = 400;

const lineWidth = 25; // Line thickness
const radius = lineWidth / 2; // Radius for rounded edges
let isDrawing = false;
let startX = 0;
let startY = 0;
let linesDrawn = 0;
let letterDrawingComplete = false;

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

// Handle mouse down event
canvas.addEventListener('mousedown', (e) => {
    if (letterDrawingComplete && linesDrawn < 3) { // Allow user to draw after letter drawing is complete
        isDrawing = true;
        startX = e.offsetX;
        startY = e.offsetY;
    }
});

// Handle mouse move event
canvas.addEventListener('mousemove', (e) => {
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

        const colors = ['red', 'green', 'blue'];
        const currentColor = colors[linesDrawn]; // Determine color based on number of lines drawn
        
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.strokeStyle = `rgba(${currentColor}, 0.5)`; // Slightly transparent color
        ctx.lineWidth = lineWidth;
        ctx.stroke();
        ctx.closePath();
    }
});

// Handle mouse up event
canvas.addEventListener('mouseup', (e) => {
    if (isDrawing) {
        isDrawing = false;
        const colors = ['red', 'green', 'blue'];
        const currentColor = colors[linesDrawn]; // Determine color based on number of lines drawn
        
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.strokeStyle = `rgba(${currentColor}, 0.5)`; // Slightly transparent color
        ctx.lineWidth = lineWidth;
        ctx.stroke();
        ctx.closePath();
        linesDrawn++;
    }
});

// Initial setup and start drawing the letter "A"
setupCanvas();
drawLetterA();