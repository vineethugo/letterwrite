const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
canvas.width = 400;
canvas.height = 400;

const lineWidth = 25; // Line thickness
const radius = lineWidth / 2; // Radius for rounded edges
const transparency = 0.5; // Transparency level for lines

let isDrawing = false;
let startX = 0;
let startY = 0;

// Define the circles (starting and ending points)
const circles = [
    { x: 100, y: 300, color: 'red' },
    { x: 200, y: 100, color: 'red' },
    { x: 300, y: 300, color: 'green' },
    { x: 150, y: 200, color: 'blue' },
    { x: 250, y: 200, color: 'blue' }
];

// Draw circles at the defined positions
function drawCircle(x, y, color) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, false);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
}

// Draw all circles
function drawAllCircles() {
    circles.forEach(circle => drawCircle(circle.x, circle.y, circle.color));
}

// Check if a point is inside a circle
function isInCircle(x, y, circle) {
    const dx = x - circle.x;
    const dy = y - circle.y;
    return dx * dx + dy * dy <= radius * radius;
}

// Find the circle at a given point
function findCircleAtPoint(x, y) {
    return circles.find(circle => isInCircle(x, y, circle));
}

// Start drawing a line
canvas.addEventListener('mousedown', (e) => {
    const rect = canvas.getBoundingClientRect();
    startX = e.clientX - rect.left;
    startY = e.clientY - rect.top;

    const startCircle = findCircleAtPoint(startX, startY);
    if (startCircle) {
        isDrawing = true;
        ctx.beginPath();
        ctx.moveTo(startCircle.x, startCircle.y);
        ctx.strokeStyle = `${startCircle.color}`;
        ctx.lineWidth = lineWidth;
        ctx.globalAlpha = transparency; // Set transparency for the line
    }
});

// Continue drawing the line
canvas.addEventListener('mousemove', (e) => {
    if (isDrawing) {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
        drawAllCircles(); // Redraw all circles

        ctx.lineTo(x, y);
        ctx.stroke();
    }
});

// Finish the line
canvas.addEventListener('mouseup', (e) => {
    if (isDrawing) {
        const rect = canvas.getBoundingClientRect();
        const endX = e.clientX - rect.left;
        const endY = e.clientY - rect.top;

        const endCircle = findCircleAtPoint(endX, endY);
        if (endCircle) {
            ctx.lineTo(endCircle.x, endCircle.y);
            ctx.stroke();
        } else {
            // If the line does not end in a circle, discard it by clearing the canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        ctx.globalAlpha = 1.0; // Reset transparency
        drawAllCircles(); // Redraw all circles
        isDrawing = false;
    }
});

// Draw the initial circles when the page loads
drawAllCircles();
