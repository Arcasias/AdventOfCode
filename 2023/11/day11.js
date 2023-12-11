export const EXAMPLE = `
...#......
.......#..
#.........
..........
......#...
.#........
.........#
..........
.......#..
#...#.....
`;
export const EXPECTED = [374, 82000210];

/**
 * @param {string[]} lines
 * @param {number} expansion
 */
const sumShortestPaths = (lines, expansion) => {
  const galaxies = [];
  const doubledRows = [];
  const doubledColumns = [];

  // double empty columns
  for (let i = 0; i < lines[0].length; i++) {
    const column = lines.map((l) => l[i]).join("");
    if (!column.includes("#")) {
      doubledColumns.push(i);
    }
  }

  for (let y = 0; y < lines.length; y++) {
    const line = lines[y];
    if (!line.includes("#")) {
      doubledRows.push(y);
    } else {
      for (let x = 0; x < line.length; x++) {
        if (line[x] === "#") {
          galaxies.push([x, y]);
        }
      }
    }
  }

  for (const galaxy of galaxies) {
    let dx = 0;
    let dy = 0;
    for (const x of doubledColumns) {
      if (x < galaxy[0]) {
        dx += expansion - 1;
      } else {
        break;
      }
    }
    for (const y of doubledRows) {
      if (y < galaxy[1]) {
        dy += expansion - 1;
      } else {
        break;
      }
    }
    galaxy[0] += dx;
    galaxy[1] += dy;
  }

  let result = 0;
  for (let i = 0; i < galaxies.length; i++) {
    for (let j = i + 1; j < galaxies.length; j++) {
      let [ax, ay] = galaxies[i];
      let [bx, by] = galaxies[j];
      result += Math.abs(ax - bx) + Math.abs(ay - by);
    }
  }
  return result;
};

/**
 * @param {string[]} lines
 */
export const partOne = async (lines) => {
  return sumShortestPaths(lines, 2);
};

/**
 * @param {string[]} lines
 */
export const partTwo = async (lines) => {
  return sumShortestPaths(lines, 1_000_000);
};
