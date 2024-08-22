const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = 400;
canvas.height = 400;

const lineWidth = 25; // Line thickness for the letter "A"
const radius = lineWidth / 2; // Radius for rounded edges
const delay = 500; // Delay in milliseconds (half a second)

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

function drawLineWithCircles(x1, y1, x2, y2, color, text, textX, textY, delayBefore) {
    return new Promise((resolve) => {
        setTimeout(() => {
            // Step 1: Draw the starting circle
            drawCircle(x1, y1, color);

            // Step 2: Draw the text (number) at the specified position before the line
            ctx.fillStyle = color;
            ctx.font = "20px Arial";
            ctx.fillText(text, textX, textY);

            // Step 3: Draw the line
            drawLine(x1, y1, x2, y2, color);

            // Step 4: Draw the ending circle
            drawCircle(x2, y2, color);

            resolve();
        }, delayBefore);
    });
}

// Coordinates for the letter "A"
const lines = [
    { x1: 150, y1: 300, x2: 200, y2: 100, color: 'red', text: '1', textX: 140, textY: 250 },  // Left of the red line
    { x1: 200, y1: 100, x2: 250, y2: 300, color: 'green', text: '2', textX: 260, textY: 250 }, // Right of the green line (aligned with number 1)
    { x1: 175, y1: 200, x2: 225, y2: 200, color: 'blue', text: '3', textX: 200, textY: 270 }  // Below the blue line (moved further down)
];

async function drawLetterA() {
    setupCanvas(); // Clear and set up the canvas
    
    await drawLineWithCircles(
        lines[0].x1, lines[0].y1,
        lines[0].x2, lines[0].y2,
        lines[0].color,
        lines[0].text,
        lines[0].textX,
        lines[0].textY,
        0 // No delay for the first line
    );

    await drawLineWithCircles(
        lines[1].x1, lines[1].y1,
        lines[1].x2, lines[1].y2,
        lines[1].color,
        lines[1].text,
        lines[1].textX,
        lines[1].textY,
        delay // Delay before drawing the green circle and line
    );

    await drawLineWithCircles(
        lines[2].x1, lines[2].y1,
        lines[2].x2, lines[2].y2,
        lines[2].color,
        lines[2].text,
        lines[2].textX,
        lines[2].textY,
        delay // Delay before drawing the blue circle and line
    );
}

drawLetterA(); // Call the function to draw the letter A