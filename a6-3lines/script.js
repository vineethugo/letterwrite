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

function drawLineWithCircles(x1, y1, x2, y2, color, delay, text) {
    setTimeout(() => {
        // Step 1: Draw the starting circle
        drawCircle(x1, y1, color);

        // Step 2: Immediately draw the line after the first circle
        drawLine(x1, y1, x2, y2, color);

        // Step 3: Immediately draw the ending circle after the line
        drawCircle(x2, y2, color);

        // Draw the text (number) at the midpoint of the line
        ctx.fillStyle = color;
        const midX = (x1 + x2) / 2;
        const midY = (y1 + y2) / 2;
        ctx.font = "20px Arial";
        ctx.fillText(text, midX - 10, midY - 10);
    }, delay);
}

// Coordinates for the letter "A"
const lines = [
    { x1: 100, y1: 300, x2: 200, y2: 100, color: 'red', text: '1' },
    { x1: 200, y1: 100, x2: 300, y2: 300, color: 'green', text: '2' },
    { x1: 150, y1: 200, x2: 250, y2: 200, color: 'blue', text: '3' }
];

lines.forEach((line, index) => {
    const delay = index * 3000; // Each line starts with a delay of 3000ms (3 seconds)

    // Draw each line with its circles
    drawLineWithCircles(line.x1, line.y1, line.x2, line.y2, line.color, delay, line.text);
});