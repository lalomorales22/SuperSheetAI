
import React, { useMemo } from 'react';

interface MazeProps {
  width: number;
  height: number;
  seed: number;
  themeColor?: string;
}

const MazeGenerator: React.FC<MazeProps> = ({ width = 10, height = 10, seed, themeColor = '#3b82f6' }) => {
  const grid = useMemo(() => {
    // Safety caps to prevent browser hang if AI returns huge numbers
    const safeWidth = Math.min(Math.max(Math.floor(width), 5), 25);
    const safeHeight = Math.min(Math.max(Math.floor(height), 5), 25);
    
    // Basic LCG for seeded randomness
    let currentSeed = seed || 12345;
    const random = () => {
      currentSeed = (currentSeed * 1664525 + 1013904223) % 4294967296;
      return currentSeed / 4294967296;
    };

    const cells = Array.from({ length: safeHeight }, () => Array(safeWidth).fill(15)); 
    const stack: [number, number][] = [[0, 0]];
    const visited = new Set(['0,0']);

    while (stack.length > 0) {
      const [r, c] = stack[stack.length - 1];
      const neighbors: [number, number, number, number][] = [];

      if (r > 0 && !visited.has(`${r-1},${c}`)) neighbors.push([r - 1, c, 1, 4]); 
      if (c < safeWidth - 1 && !visited.has(`${r},${c+1}`)) neighbors.push([r, c + 1, 2, 8]); 
      if (r < safeHeight - 1 && !visited.has(`${r+1},${c}`)) neighbors.push([r + 1, c, 4, 1]); 
      if (c > 0 && !visited.has(`${r},${c-1}`)) neighbors.push([r, c - 1, 8, 2]); 

      if (neighbors.length > 0) {
        const [nr, nc, currentWall, neighborWall] = neighbors[Math.floor(random() * neighbors.length)];
        cells[r][c] &= ~currentWall;
        cells[nr][nc] &= ~neighborWall;
        visited.add(`${nr},${nc}`);
        stack.push([nr, nc]);
      } else {
        stack.pop();
      }
    }
    return { cells, safeWidth, safeHeight };
  }, [width, height, seed]);

  return (
    <div className="flex flex-col items-center">
      <div 
        className="grid bg-gray-50 border-4 border-gray-800 p-1"
        style={{ 
          gridTemplateColumns: `repeat(${grid.safeWidth}, 1fr)`,
          width: 'fit-content'
        }}
      >
        {grid.cells.map((row, r) => 
          row.map((cell, c) => (
            <div 
              key={`${r}-${c}`}
              className="w-8 h-8 md:w-9 md:h-9 border-gray-800 relative bg-white"
              style={{
                borderTopWidth: (cell & 1) ? 3 : 0,
                borderRightWidth: (cell & 2) ? 3 : 0,
                borderBottomWidth: (cell & 4) ? 3 : 0,
                borderLeftWidth: (cell & 8) ? 3 : 0,
              }}
            >
              {r === 0 && c === 0 && <div className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-green-500">IN</div>}
              {r === grid.safeHeight - 1 && c === grid.safeWidth - 1 && <div className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-red-500">OUT</div>}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MazeGenerator;
