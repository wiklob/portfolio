import { useState, useEffect, useRef } from 'react';

const EPS = Math.pow(2, -23);
const SIZE = 1000;
const PROB = 0.85;
const DECAY = 0.95;
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

function VoronoiRandomPoints( n: number, size: number) { //getting the random points generated
    const points = [];
    const used = new Set<string>();

    while (points.length < n) {
        const x = Math.floor(Math.random()*size);
        const y = Math.floor(Math.random()*size);
        const id = `${x},${y}`;

        if(!used.has(id)) {
            used.add(id);
            points.push({x, y, color: `rgba(255,255,255,100)`})
        }
    }
    Offsetter(points);
    return points;
}

function Offsetter(points: {x: number, y:number, color: string}[]) {
    const magX = EPS*100*100;
    const magY = EPS*100*100;

    for(let i=0;i<points.length;i++) {
        points[i].x = points[i].x+(Math.random()*magX);
        points[i].y = points[i].y+(Math.random()*magY);
    }
}

function isClose(a:number, b:number, tolerance: number = EPS): boolean {
    return Math.abs(a-b)<tolerance;
}

function theRightPart(point: {x: number, y: number}, polygon: {x: number, y: number}[]) {
    const n=polygon.length;
    for (let i=0;i<n;i++) {
        var t = {x: polygon[i].x - polygon[(i+1)%n].x, y: polygon[i].y - polygon[(i+1)%n].y};
        var u = {x: point.x - polygon[(i+1)%n].x, y: point.y - polygon[(i+1)%n].y};
        var v = {x: polygon[(i+2)%n].x - polygon[(i+1)%n].x, y: polygon[(i+2)%n].y - polygon[(i+1)%n].y};
        var a = t.x*u.y-t.y*u.x; //tu
        var b = t.x*v.y-t.y*v.x; //tv
        var c = v.x*u.y-v.y*u.x; //vu
        var d = v.x*t.y-v.y*t.x; //vt
        if(!(a*b>=0&&c*d>=0)) {
            return false;
        }
    }
    return true;
}

function intersectionLineSegment({line, p1, p2}: {line: {a: number, b: number, c: number}, p1: {x: number, y: number}, p2: {x:number, y:number} }){ 
    const u = line;
    const v = {a: p1.y-p2.y, b: p2.x-p1.x, c: p1.x*p2.y-p2.x*p1.y};
    if((u.a/u.b==v.a/v.b)&&(u.c/u.b==v.c/v.b)) {
        return null; //they are parallel, no intersections
    }
    const z1 = u.b*v.c - u.c*v.b;
    const z2 = u.c*v.a - u.a*v.c;
    const z3 = u.a*v.b - u.b*v.a;
    if (isClose (z3, 0)) {
        return null; //secont check whether they are parallel (or equal)
    }
    const intersection = {x: z1/z3,y: z2/z3};

    const isVertical = isClose(p1.x, p2.x);
    const isHorizontal = isClose(p1.y, p2.y);

    if(isVertical&&isHorizontal) {
        return samePoint({p1: intersection, p2: p1}) ? intersection : null;
    }
    if(isVertical) {
        const yMin=Math.min(p1.y, p2.y);
        const yMax=Math.max(p1.y, p2.y);
        return (intersection.y >= yMin - EPS && intersection.y <= yMax + EPS && isClose(intersection.x, p1.x)) ? intersection : null;
    }

    const xMin = Math.min(p1.x, p2.x);
    const xMax = Math.max(p1.x, p2.x);
    const yMin = Math.min(p1.y, p2.y);
    const yMax = Math.max(p1.y, p2.y);
    //technically, we should also be checking whether some of those aint vertical/horizontal, but it seems little of an error on this level and its 2am so if it breaks we know why
    //update - it broke exactly because of that, now we know why
    return (intersection.x >= xMin - EPS && intersection.x <= xMax + EPS && intersection.y >= yMin - EPS && intersection.y <= yMax + EPS) ? intersection : null;
}

function samePoint ({p1, p2}: {p1: {x:number, y:number}, p2: {x:number, y:number}}) {
    /*if((p1.x==p2.x)&&(p1.y==p2.y)) {
        return true;
    }
    return false;*/
    return isClose(p1.x, p2.x) && isClose(p1.y, p2.y);
}

function Voronoi(n:number, size:number) {
    const points = VoronoiRandomPoints(n, size);
    var cells = []; // this is the output
    //getting the initial box points ready to mark their borders
    const initCell = []; // initial points of a cell, precalced
    initCell.push({x: 0, y:size});
    initCell.push({x: size, y:size});
    initCell.push({x: size, y: 0});
    initCell.push({x: 0, y:0});
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
        var cell = initCell.map(vertex => ({...vertex}));
        for(let j=0; j<points.length; j++) {
            if (i!=j) {
                var m=cell.length;
                var newCell: {x: number, y: number}[] = [];
                //calculating the bisector
                const p = {x1: points[i].x, y1:points[i].y};
                const q = {x2: points[j].x, y2:points[j].y};
                const a = q.x2-p.x1;
                const b = q.y2-p.y1;
                const c = (-a*((p.x1+q.x2)/2))+(-b*((p.y1+q.y2)/2));
                const bisector = {a: a, b: b, c: c};
                //calculating the intersection of bisector and segments
                var fii = 0;
                var sii = 0;
                var firstIntersect = null;
                for(var k=0; k<m; k++) {
                    var cv = cell[k]; //current vertex
                    var nv = cell[(k+1)%m]; //next vertex
                    firstIntersect = intersectionLineSegment({line:bisector, p1: cv, p2: nv});
                    
                    if(firstIntersect) {
                        if(isClose(firstIntersect.x,nv.x)&&isClose(firstIntersect.y,nv.y)) {
                            newCell.push(nv, cell[(k+2)%m]);
                            fii = (k+2)%m; //first intersection index
                        }
                        else {
                            newCell.push(firstIntersect, nv)
                            fii = (k+1)%m;
                        }
                        break;
                    }
                }
                if (newCell.length==0) {
                    //console.log(`Point ${i} vs Point ${j}: No intersections found, keeping cell as-is (${cell.length} vertices)`);
                    newCell=cell;
                }
                else {
                    var secondIntersect = null;
                    for( var k=fii;k<m; k++) {
                        var cv = cell[k];
                        var nv = cell[(k+1)%m];
                        secondIntersect = intersectionLineSegment({line: bisector, p1:cv, p2:nv});
                        if (secondIntersect) {
                            newCell.push(secondIntersect);
                            sii=k+1;
                            break;
                        }
                        else {
                            newCell.push(nv);
                        }
                    }
                    if(!theRightPart(points[i], newCell)) { //checking whether the point is included in the first part
                        //console.log(`Point ${i}: Taking OPPOSITE part (newCell had ${newCell.length} vertices)`);
                        newCell=(secondIntersect && samePoint({p1: secondIntersect, p2:cell[sii%m]})) ? [] : (secondIntersect ? [secondIntersect] : []);
                        //console.log(`  -> After reset, newCell has ${newCell.length} vertices`);
                        var lcv = null;
                        for (let k=sii; k%m!=fii; k++) {
                            lcv=cell[k%m];
                            if(samePoint({p1: cell[k%m], p2: cell[(k+1)%m]})) {
                                continue;
                            }
                            newCell.push(cell[k%m]);
                        }
                        //console.log(`  -> After loop, newCell has ${newCell.length} vertices (sii=${sii}, fii=${fii}, m=${m})`);
                        if(firstIntersect != null && lcv != null) {
                            if(!samePoint({p1: firstIntersect, p2: lcv})) {
                                newCell.push(firstIntersect);
                            }
                        }
                        
                        //console.log(`  -> Final newCell has ${newCell.length} vertices`);
                        if(newCell.length < 3) {
                            newCell = [];
                            console.warn(`  -> WARNING: Cell has < 3 vertices! This will cause issues.`);
                        }
                    }
                }
                cell=newCell;
                //console.log(`Point ${i} vs Point ${j}: cell now has ${cell.length} vertices`);
                if(cell.length == 0) {
                    //console.log(`  -> Cell became EMPTY after clipping with point ${j}`);
                }
            }
        }
        if(cell.length > 0){
            cells.push(cell);
        }
        else{
            //console.log(`Cell ${i} is NULL for point (${points[i].x}, ${points[i].y})`);
            cells.push(null);
        }
    }
    return {points, cells};
}

function computeAdjacency (cells: ({x:number, y:number}[] | null)[]) {
    const adjacency: Set<number>[] = cells.map(() => new Set());
    for( let i=0;i<cells.length;i++) {
        if(!cells[i]) continue;
        for( let j=i+1; j<cells.length;j++) {
            if(!cells[j]) continue;
            if(cellsShareEdge(cells[i]!, cells[j]!)) {
                adjacency[i].add(j);
                adjacency[j].add(i);
            }
        }
    }
    return adjacency;
} 

function cellsShareEdge(a:{x:number,y:number}[], b:{x:number, y:number}[]): boolean {
    let sV=0;
    for(let i=0;i<a.length;i++) {
        for(let j=0;j<b.length;j++) {
            if(samePoint({p1:a[i], p2:b[j]})) {
                sV++;
                if(sV>=2) return true;
            }
        }
    }
    return false;
}

//beginning the island creation
function createIsland(start:number, adjacency: Set<number>[], initialProbability: number): Set<number> {
    const visited = new Set<number>();
    const terrain = new Set<number>();
    generateIsland(start, adjacency, visited, terrain, initialProbability);
    return terrain;
}

//creating the island
function generateIsland(index: number, adjacency: Set<number>[], visited: Set<number>, terrain: Set<number>, p: number): void {
    visited.add(index);
    terrain.add(index);
    for(const ind of adjacency[index]) {
        if(visited.has(ind)) continue;
        //visited.add(ind);
        if(Math.random()<p) {
            const newP=p*DECAY;
            generateIsland(ind, adjacency, visited, terrain, newP);
        }
    }
}

//old, now we use voronoi
// this function generates a map based on the seeding data - this is how we keep the state of the map
function PlanetGenerator(seed: { size: number, color: string}) { 
    return Array(seed.size).fill(null).map(() =>
        Array(seed.size).fill(seed.color)
    );
}

function VoronoiRenderer({vD, cellColors, size, mapRef}: {vD: {points: {x: number, y: number, color: string}[], cells: ({x:number, y:number}[] | null)[] }, cellColors: Map<number, string>, size: number, mapRef: React.RefObject<SVGSVGElement>}) {
    return (
        <svg ref={mapRef} width={size*10} height={size*10}>
            {vD.cells.map((cell, i) => {
                if (!cell) return null;
                const conversion = cell.map(vertex => `${vertex.x*10}, ${vertex.y*10}`).join(' ');

                const fillColor = cellColors.get(i) || vD.points[i].color;
                return < polygon 
                    key={i}
                    points={conversion}
                    fill={fillColor}
                    stroke="black"
                    strokeWidth={1}
                />
            })}
        </svg>
    )
    /*return (
        <svg width={size*10} height={size*10}> {
            a.cells.map((cell, i) => {
                if(!cell) return null;
                const conversion = cell.map(vertex => `${vertex.x*10}, ${vertex.y*10}`).join(' ');
                return ( polygon key={i} points={conversion} fill={a.points[i].color} stroke="black" strokeWidth={1});
            })
        }
        </svg>
    ); */
}
//this function renders the planet - this is its visual representation in svg
/*function PlanetRenderer({ grid, seed, pixelSize, mapRef }: { grid: string[][], seed: { size: number, color: string }, pixelSize: number, mapRef: React.RefObject<SVGSVGElement> }) {
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
}*/

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
    const [voronoiData, setVoronoiData] = useState(()=> {
        //console.log("Generating new Voronoi");
        return Voronoi(SIZE, 100);
        
    });
    //generating the island for the first time
    const [islands, setIslands] = useState<{cells: number[], color: string}[]>(() => {
        const genStart = Math.floor(Math.random()*SIZE); //where to start
        const adjacency = computeAdjacency(voronoiData.cells); //calc the adj
        const terrain = createIsland(genStart, adjacency, PROB); //create the terrain
        return [{cells: Array.from(terrain), color: '#777777'}];
    })

    const cellColors = new Map<number, string>();
    islands.forEach(island => {
        island.cells.forEach(cellIndex => {
            cellColors.set(cellIndex, island.color);
        });
    });
    
    const [planetGrid, setPlanetGrid] = useState<string[][]>(() => {
        const seed = Seeder();
        return PlanetGenerator(seed);
    });

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
                <VoronoiRenderer vD={voronoiData} cellColors={cellColors} size={100} mapRef={mapRef} />
                
            </div>
        </div>
        //<PlanetRenderer grid={planetGrid} seed={Seeder()} pixelSize={10} mapRef={mapRef}/>
    );
}
export default Spacecannon