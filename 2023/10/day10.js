import { envIs } from "../../utils.js";

export const EXAMPLE = [
  `
7-F7-
.FJ|7
SJLL7
|F--J
LJ.LJ
`,
  `
FF7FSF7F7F7F7F7F---7
L|LJ||||||||||||F--J
FL-7LJLJ||||||LJL-77
F--JF--7||LJLJ7F7FJ-
L---JF-JLJ.||-FJLJJ7
|F|F-JF---7F7-L7L|7|
|FFJF7L7F-JF7|JL---7
7-L-JL7||F7|L7F-7F7|
L.L7LFJ|||||FJL7||LJ
L7JLJL-JLJLJL--JLJ.L
`,
];
export const EXPECTED = [8, 10];

/**
 * @param {string[]} lines
 */
const getLoop = (lines) => {
  /**
   * @param {string} key
   * @param {string} value
   */
  const connect = (key, value) => {
    if (connections[key]) {
      connections[key].add(value);
    } else {
      connections[key] = new Set([value]);
    }
  };

  /** @type {Record<string, Set<string>>} */
  const connections = {};

  let start = [0, 0].join(",");
  /** @type {(number[][] | boolean)[][]} */
  for (let y = 0; y < lines.length; y++) {
    const line = lines[y];
    for (let x = 0; x < line.length; x++) {
      const connector = CONNECTORS[line[x]];
      const current = [x, y].join(",");
      if (connector === true) {
        start = current;
      } else if (connector) {
        for (const [dx, dy] of connector) {
          const next = [x + dx, y + dy].join(",");
          connect(current, next);
          if (next === start) {
            connect(start, current);
          }
        }
      }
    }
  }

  for (const [point, pointConnections] of Object.entries(connections)) {
    for (const otherPoint of pointConnections) {
      if (!connections[otherPoint]?.has(point) && otherPoint !== start) {
        pointConnections.delete(otherPoint);
      }
    }
  }

  let point = start;
  let previous = null;
  const loop = new Set([start]);
  while (point !== start || loop.size === 1) {
    for (const next of connections[point]) {
      if (next !== previous) {
        previous = point;
        point = next;
        loop.add(point);
        break;
      }
    }
  }

  return loop;
};

/** @param {string} c */
const toBoxSymbol = (c) => {
  switch (c) {
    case "F":
      return "┌";
    case "7":
      return "┐";
    case "J":
      return "┘";
    case "L":
      return "└";
    case "|":
      return "│";
    case "-":
      return "─";
    default:
      return c;
  }
};

/**
 * @param {string[]} lines
 * @param {Set<string>} loop
 * @param {Set<string>} [enclosed]
 */
const visualize = (lines, loop, enclosed) => {
  for (let y = 0; y < lines.length; y++) {
    for (let x = 0; x < lines[0].length; x++) {
      const point = [x, y].join(",");
      if (loop.has(point)) {
        process.stdout.write(toBoxSymbol(lines[y][x]));
      } else if (enclosed?.has(point)) {
        process.stdout.write("x");
      } else {
        process.stdout.write(".");
      }
    }
    process.stdout.write("\n");
  }
};

/** @type {Record<string, number[][] | boolean>} */
const CONNECTORS = {
  "|": [
    [0, -1],
    [0, +1],
  ],
  "-": [
    [-1, 0],
    [+1, 0],
  ],
  L: [
    [0, -1],
    [+1, 0],
  ],
  J: [
    [0, -1],
    [-1, 0],
  ],
  7: [
    [-1, 0],
    [0, +1],
  ],
  F: [
    [+1, 0],
    [0, +1],
  ],
  ".": false,
  S: true,
};

/**
 * @param {string[]} lines
 */
export const partOne = async (lines) => {
  const loop = getLoop(lines);
  if (envIs("test")) {
    visualize(lines, loop);
  }
  return loop.size / 2;
};

/**
 * @param {string[]} lines
 */
export const partTwo = async (lines) => {
  const loop = getLoop(lines);
  const rows = lines.length;
  const columns = lines[0].length;

  /**
   * @param {number} x
   * @param {number} y
   * @param {[number, number]} delta
   */
  const getLoopSegment = (x, y, [dx, dy]) => {
    const points = [];
    let up = false;
    let down = false;
    let left = false;
    let right = false;
    let point = [x, y].join(",");
    while (loop.has(point)) {
      points.push(point);
      switch (lines[y][x]) {
        case "F":
          right = !right;
          down = !down;
          break;
        case "7":
          left = !left;
          down = !down;
          break;
        case "J":
          left = !left;
          up = !up;
          break;
        case "L":
          right = !right;
          up = !up;
          break;
        case "|":
          up = !up;
          down = !down;
          break;
        case "-":
          left = !left;
          right = !right;
          break;
      }
      x += dx;
      y += dy;
      point = [x, y].join(",");
    }
    return {
      length: points.length,
      point,
      left,
      right,
      up,
      down,
    };
  };

  /** @type {Set<string>} */
  const rowEnclosed = new Set();
  for (let y = 0; y < rows; y++) {
    let inLoopX = false;
    for (let x = 0; x < columns; x++) {
      const segment = getLoopSegment(x, y, [+1, 0]);
      if (segment.length) {
        x += segment.length - 1;
        if (segment.up && segment.down) {
          inLoopX = !inLoopX;
        }
      } else if (inLoopX) {
        rowEnclosed.add(segment.point);
      }
    }
  }

  const enclosed = new Set();
  for (let x = 0; x < columns; x++) {
    let inLoopY = false;
    for (let y = 0; y < rows; y++) {
      const segment = getLoopSegment(x, y, [0, +1]);
      if (segment.length) {
        y += segment.length - 1;
        if (segment.left && segment.right) {
          inLoopY = !inLoopY;
        }
      } else if (inLoopY) {
        enclosed.add(segment.point);
      }
    }
  }

  if (envIs("test")) {
    visualize(lines, loop, enclosed);
  }

  return enclosed.size;
};
