const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = 400;
canvas.height = 400;

const lineWidth = 25; // Line thickness
const radius = lineWidth / 2; // Radius for rounded edges

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

    }, delay);
}

// Coordinates for the letter "A"
const lines = [
    { x1: 100, y1: 300, x2: 200, y2: 100, color: 'red', text: '1', textX: 90, textY: 250 },  // Left of the red line
    { x1: 200, y1: 100, x2: 300, y2: 300, color: 'green', text: '2', textX: 310, textY: 200 }, // Right of the green line
    { x1: 150, y1: 200, x2: 250, y2: 200, color: 'blue', text: '3', textX: 190, textY: 220 }  // Below the blue line
];

lines.forEach((line, index) => {
    const delay = index * 3000; // Each line starts with a delay of 3000ms (3 seconds)

    // Draw each line with its circles and text
    drawLineWithCircles(line.x1, line.y1, line.x2, line.y2, line.color, delay, line.text, line.textX, line.textY);
});