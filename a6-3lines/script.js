const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = 400;
canvas.height = 400;

let step = 0;
const steps = 100; // Increase for slower drawing

function drawLine(x1, y1, x2, y2, color, delay, text) {
    setTimeout(() => {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = color;
        ctx.lineWidth = 25; // Make the lines 5 times thicker
        ctx.stroke();
        ctx.closePath();

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
    drawLine(line.x1, line.y1, line.x2, line.y2, line.color, index * 1000, line.text);
});