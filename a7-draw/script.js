const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = 400;
canvas.height = 400;

const lineWidth = 25; // Line thickness for the letter "A"
const radius = lineWidth / 2; // Radius for rounded edges

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

function drawLineWithCircles(x1, y1, x2, y2, color, text, textX, textY) {
    // Draw the starting circle
    drawCircle(x1, y1, color);

    // Draw the text (number) at the specified position before the line
    ctx.fillStyle = color;
    ctx.font = "20px Arial";
    ctx.fillText(text, textX, textY);

    // Draw the line after the text
    drawLine(x1, y1, x2, y2, color);

    // Draw the ending circle after the line
    drawCircle(x2, y2, color);
}

// Coordinates for the letter "A"
const lines = [
    { x1: 100, y1: 300, x2: 200, y2: 100, color: 'red', text: '1', textX: 90, textY: 250 },  // Left of the red line
    { x1: 200, y1: 100, x2: 300, y2: 300, color: 'green', text: '2', textX: 310, textY: 250 }, // Right of the green line (aligned with number 1)
    { x1: 150, y1: 200, x2: 250, y2: 200, color: 'blue', text: '3', textX: 190, textY: 260 }  // Below the blue line (moved further down)
];

function drawLetterA() {
    setupCanvas(); // Clear and set up the canvas
    for (let i = 0; i < lines.length; i++) {
        drawLineWithCircles(
            lines[i].x1, lines[i].y1,
            lines[i].x2, lines[i].y2,
            lines[i].color,
            lines[i].text,
            lines[i].textX,
            lines[i].textY
        );
    }
}

drawLetterA(); // Call the function to draw the letter A