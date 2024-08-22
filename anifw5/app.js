const { useState, useEffect, useRef } = React;
const { gsap } = window;

const LetterTracingGame = () => {
    const [letter, setLetter] = useState('A');
    const [isTracing, setIsTracing] = useState(false);
    const [strokes, setStrokes] = useState([]);
    const svgRef = useRef(null);

    const letters = {
        A: {
            path: 'M10,80 L50,10 L90,80 Z',
            strokes: [
                { path: 'M10,80 L50,10', label: '1' },
                { path: 'M90,80 L50,10', label: '2' }
            ]
        },
        a: {
            path: 'M30,70 Q20,30 30,30 Q40,30 40,50 Q40,70 30,70',
            strokes: [
                { path: 'M30,70 Q20,30 30,30', label: '1' },
                { path: 'Q40,30 40,50 Q40,70 30,70', label: '2' }
            ]
        },
        B: {
            path: 'M20,20 Q20,50 50,50 Q80,50 80,20 Q80,-10 50,-10 Q20,-10 20,20 Z',
            strokes: [
                { path: 'M20,20 Q20,50 50,50', label: '1' },
                { path: 'Q80,50 80,20 Q80,-10 50,-10', label: '2' }
            ]
        },
        b: {
            path: 'M30,80 Q20,60 30,30 Q40,10 50,30 Q60,60 50,80',
            strokes: [
                { path: 'M30,80 Q20,60 30,30', label: '1' },
                { path: 'Q40,10 50,30 Q60,60 50,80', label: '2' }
            ]
        },
        C: {
            path: 'M60,20 Q20,20 20,60 Q20,100 60,100',
            strokes: [
                { path: 'M60,20 Q20,20 20,60', label: '1' },
                { path: 'Q20,100 60,100', label: '2' }
            ]
        },
        c: {
            path: 'M40,30 Q20,30 20,50 Q20,70 40,70 Q60,70 60,50 Q60,30 40,30',
            strokes: [
                { path: 'M40,30 Q20,30 20,50', label: '1' },
                { path: 'Q20,70 40,70 Q60,70 60,50 Q60,30 40,30', label: '2' }
            ]
        }
    };

    useEffect(() => {
        drawLetter();
        disableTouchZoom();
    }, [letter]);

    const drawLetter = () => {
        const letterData = letters[letter];
        const svg = svgRef.current;

        if (svg) {
            // Clear existing content
            svg.innerHTML = '';

            // Draw letter paths
            letterData.strokes.forEach((stroke, index) => {
                const pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                pathElement.setAttribute('d', stroke.path);
                pathElement.setAttribute('class', `stroke stroke-${index + 1}`);
                svg.appendChild(pathElement);

                const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                label.setAttribute('x', '10');
                label.setAttribute('y', 20 + index * 20);
                label.setAttribute('class', 'stroke-label');
                label.textContent = `Stroke ${stroke.label}`;
                svg.appendChild(label);
            });

            // Animate strokes
            gsap.timeline()
                .staggerTo(svg.querySelectorAll('path'), 1, { strokeDashoffset: 0, strokeDasharray: 1000 }, 0.5);
        }
    };

    const disableTouchZoom = () => {
        document.addEventListener('gesturestart', (e) => e.preventDefault(), { passive: false });
        document.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });
        document.addEventListener('contextmenu', (e) => e.preventDefault(), { passive: false });
    };

    const handleTouchStart = (e) => {
        if (!isTracing) return;
        // Handle touch start logic
        setIsTracing(true);
    };

    const handleTouchEnd = (e) => {
        if (!isTracing) return;
        // Handle touch end logic
        setIsTracing(false);
    };

    return (
        <div>
            <div style={{ position: 'absolute', top: '10px', left: '10px', color: 'black' }}>v1</div>
            <svg
                ref={svgRef}
                width="100vw"
                height="100vh"
                xmlns="http://www.w3.org/2000/svg"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
            />
            <button onClick={() => setLetter('A')}>A</button>
            <button onClick={() => setLetter('a')}>a</button>
            <button onClick={() => setLetter('B')}>B</button>
            <button onClick={() => setLetter('b')}>b</button>
            <button onClick={() => setLetter('C')}>C</button>
            <button onClick={() => setLetter('c')}>c</button>
        </div>
    );
};

ReactDOM.render(<LetterTracingGame />, document.getElementById('root'));