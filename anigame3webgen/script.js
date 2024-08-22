document.addEventListener("DOMContentLoaded", function() {
    const exampleCanvas = document.getElementById("exampleCanvas");
    const tracingCanvas = document.getElementById("tracingCanvas");
    const winnerMessage = document.getElementById("winnerMessage");

    const ctxExample = exampleCanvas.getContext("2d");
    const ctxTrace = tracingCanvas.getContext("2d");

    const letters = [
        { char: 'A', strokes: [[{x: 50, y: 100}, {x: 100, y: 50}], [{x: 100, y: 50}, {x: 150, y: 100}], [{x: 75, y: 75}, {x: 125, y: 75}]] },
        { char: 'a', strokes: [[{x: 50, y: 100}, {x: 100, y: 100}], [{x: 100, y: 100}, {x: 100, y: 150}], [{x: 50, y: 150}, {x: 100, y: 150}]] }
    ];

    function drawExample(letter) {
        ctxExample.clearRect(0, 0, exampleCanvas.width, exampleCanvas.height);
        letter.strokes.forEach((stroke, index) => {
            ctxExample.strokeStyle = `hsl(${index * 60}, 100%, 50%)`;
            ctxExample.lineWidth = 5;
            ctxExample.beginPath();
            ctxExample.moveTo(stroke[0].x, stroke[0].y);
            ctxExample.lineTo(stroke[1].x, stroke[1].y);
            ctxExample.stroke();
        });
    }

    function traceLetter(letter) {
        // Implementation of tracing functionality...
    }

    function checkWinner() {
        winnerMessage.classList.remove("hidden");
    }

    drawExample(letters[0]);
    traceLetter(letters[0]);
});