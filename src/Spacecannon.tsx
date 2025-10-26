import { useState, useEffect } from 'react';

function useMousePosition() {
    const [position, setPosition] = useState({x: 0, y:0});

    useEffect(() => {
        const updatePosition = (e: MouseEvent) => {
            setPosition({ x: e.clientX, y: e.clientY});
        };
        window.addEventListener('mousemove', updatePosition)
    }, [])
    
    return position
}

function Spacecannon() {
    const position = useMousePosition();
    return (
        <div>
            <div className="spacecannon-aim" style={{
            left: position.x,
            top: position.y
            }}
            />
            <div className="spacecannon-aim-north" style={{
            left: position.x,
            top: position.y
            }}
            />
            <div className="spacecannon-aim-south" style={{
            left: position.x,
            top: position.y
            }}
            />
            <div className="spacecannon-aim-east" style={{
            left: position.x,
            top: position.y
            }}
            />
            <div className="spacecannon-aim-west" style={{
            left: position.x,
            top: position.y
            }}
            />
        </div>
    );
    
}

export default Spacecannon