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

function VoronoiRandomPoints( n: number, size: number) {
    const points = [];
    const used = new Set<string>();

    while (points.length < n) {
        const x = Math.floor(Math.random()*size);
        const y = Math.floor(Math.random()*size);
        const id = '${x},${y}';

        if(!used.has(id)) {
            used.add(id);
            points.push({x, y, color: 'hsl${(points.length * 360)/number}, 70%, 60%)'})
        }
    }
    return points;
}
function intersectionLineSegment({line, p1, p2}: {line: {a: number, b: number, c: number}, p1: {x: number, y: number}, p2: {x:number, y:number} }){ 
    const u = line;
    const v = {a: p1.y-p2.y, b: p1.x-p2.x, c: p1.x*p2.y-p2.x*p1.y};
    if((u.a/u.b==v.a/v.b)&&(u.c/u.b==v.c/v.b)) {
        return null; //they are parallel, no intersections
    }
    const z1 = u.b*v.c - u.c*v.b;
    const z2 = u.c*v.a - u.a*v.c;
    const z3 = u.a*v.b - u.b*v.a;
    if (z3==0) {
        return null; //secont check whether they are parallel (or equal)
    }
    const intersection = {x: z1/z3,y: z2/z3};
    const x1 = Math.min(p1.x, p2.x);
    const x2 = Math.max(p1.x, p2.x);
    const y1 = Math.min(p1.y, p2.y);
    const y2 = Math.max(p1.y, p2.y);
    //technically, we should also be checking whether some of those aint vertical/horizontal, but it seems little of an error on this level and its 2am so if it breaks we know why
    if(intersection.x>=x1 && intersection.x<=x2 && intersection.y>=y1 && intersection.y<=y2) {
        return intersection;
    }
    else{
        return null;
    }
}

function Voronoi(n:number, size:number) {
    const points = VoronoiRandomPoints(n, size);
    var cells = []; // this is the output
    //getting the initial box points ready to mark their borders
    const initCell = []; // initial points of a cell, precalced
    initCell.push({x: 0, y:0});
    initCell.push({x: 0, y:size});
    initCell.push({x: size, y: size});
    initCell.push({x: size, y:0});
    //marking the borders of the initial cell - turned out to be pointless lol
    /*
    const preCell: {a: number, b: number, c: number}[] = []; //initial borders of a cell, precalced
    for(let i=0;i<initCell.length;i++) {
        const p = {x1: initCell[i].x, y1:initCell[i].y};
        const q = {x2: initCell[(i+1)%initCell.length].x, y2:initCell[(i+1)%initCell.length].y};
        const a = p.y1 - q.y2;
        const b = p.x1 - q.x2;
        const c = p.x1*q.y2 - q.x2*p.y1;
        preCell.push({a: a,b: b,c: c});
    }*/
    //'cutting through' the cell with our bisectors so to mark the final cell
    for(let i=0; i<points.length; i++) {
        const cell = initCell;
        for(let j=0; j<points.length; j++) {
            if (i!=j) {
                var m=cell.length;
                var newCell=[];
                //calculating the bisector
                const p = {x1: points[i].x, y1:points[i].y};
                const q = {x2: points[j].x, y2:points[j].y};
                const a = q.x2-p.x1;
                const b = q.y2-p.y1;
                const c = (-a*((p.x1+q.x2)/2))+(-b*((p.y1+q.y2)/2));
                const bisector = {a: a, b: b, c: c};
                //calculating the intersection of bisector and segments
                for(var k=0; k<m; k++) {
                    var cv = cell[k]; //current vertex
                    var nv = cell[(k+1)%m]; //next vertex
                    var firstIntersect = intersectionLineSegment({line:bisector, p1: cv, p2: nv});
                    if(firstIntersect) {
                        if((firstIntersect.x==nv.x)&&(firstIntersect.y==nv.y)) {
                            newCell.push({x: nv, y: cell[(k+2)%m]});
                            var fii= (k+2)%m; //first intersection index
                        }
                        else {
                            newCell.push({x: firstIntersect, y: nv})
                            var fii= (k+1)%m;
                        }
                        break;
                    }
                    if (newCell.length==0) {
                        newCell=cell;
                    }
                    else {
                        for( var k=fii;k<m; k++) {

                        }
                    }
                }
            }
        }
    }
    /*
    //finding the mins and maxes is not needed because we already have the "box" we operate inside - our map
    var x_max = 0;
    var y_max = 0;
    var x_min = 10001;
    var y_min = 10001;
    for(let i=0; i<points.length; i++) {
        if(points[i].x>x_max) x_max=points[i].x;
        if(points[i].y>y_max) y_max=points[i].y;
        if(points[i].x<x_min) x_min=points[i].x;
        if(points[i].y<y_min) y_min=points[i].y;
    }*/
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