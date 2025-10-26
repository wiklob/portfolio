import { useState, useEffect, useRef } from 'react';

function useMousePosition() {
    const [position, setPosition] = useState({x: 0, y:0});

    useEffect(() => {
        const updatePosition = (e: MouseEvent) => {
            setPosition({ x: e.clientX, y: e.clientY});
        };
        window.addEventListener('mousemove', updatePosition)
    }, [])
    
    return position;
}
//this function has the seeding data for a map; for now contains only two parameters.
function Seeder() { 
    const mapSize=100;
    const mapColor='#00ff00';
    const seed = {size: mapSize, color: mapColor};
    return seed;
}
// this function generates a map based on the seeding data - this is how we keep the state of the map
function PlanetGenerator(seed: { size: number, color: string}) { 
    return Array(seed.size).fill(null).map(() =>
        Array(seed.size).fill(seed.color)
    );
}
//this function renders the planet - this is its visual representation in svg
function PlanetRenderer({ grid, seed, pixelSize, mapRef }: { grid: string[][], seed: { size: number, color: string }, pixelSize: number, mapRef: React.RefObject<SVGSVGElement> }) {
    return (
        <svg
            ref={mapRef}
            width={seed.size * pixelSize}
            height={seed.size * pixelSize}
        >
            {grid.map((row: string[], y: number) =>
                row.map((color: string, x: number) => (
                    <rect
                        key={`${y}-${x}`}
                        x={x * pixelSize}
                        y={y * pixelSize}
                        width={pixelSize}
                        height={pixelSize}
                        fill={color}
                    />
                ))
            )}
        </svg>
    )
}
// this function updates the pixel we shot at 
function ShotResults(grid: string[][], x: number, y:number, color:string): string [][] {
    const newGrid = grid.map(row => [...row]);
    if (y >= 0 && y < grid.length && x >= 0 && x < grid[0].length) {
        newGrid[y][x] = color;
        if(y+1<grid.length && grid[y+1][x]!='#ff0000') {
            newGrid[y+1][x] = '#6B580B';
        }
        if(y-1>=0 && grid[y-1][x]!='#ff0000') {
            newGrid[y-1][x] = '#6B580B';
        }
        if(x+1<grid[0].length && grid[y][x+1]!='#ff0000') {
            newGrid[y][x+1] = '#6B580B';
        }
        if(x-1>=0 && grid[y][x-1]!='#ff0000') {
            newGrid[y][x-1] = '#6B580B';
        }
    }
    return newGrid;
}

// this is the main function that serves both the aiming system and the shooting.
function Spacecannon() {
    const position = useMousePosition();
    const mapRef = useRef<SVGSVGElement>(null);

    const [planetGrid, setPlanetGrid] = useState<string[][]>(() => {
        const seed = Seeder();
        return PlanetGenerator(seed);
    })

    const shooting = () => {
        const map = mapRef.current;
        if (!map) return;

        const ref = map.getBoundingClientRect(); // getting the actual position of the map after centering, so that our shot is relative
        const relX = position.x - ref.left; //position is where the mouse is
        const relY = position.y - ref.top;

        const gX = Math.floor(relX/10);//calculating the grid we hit from the mouse position
        const gY = Math.floor(relY/10);
        const newGrid = ShotResults(planetGrid, gX, gY, "#ff0000");

        setPlanetGrid(newGrid);
    }

    useEffect(() => { 
        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.key === ' ') {
                e.preventDefault();
                shooting();
            }
        }
        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [position, planetGrid]);

    

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
            <div className='spacecannon-map'>
                <PlanetRenderer grid={planetGrid} seed={Seeder()} pixelSize={10} mapRef={mapRef}/>
            </div>
        </div>
    );
}
export default Spacecannon