import { Worker } from "worker_threads";
import { safeSplit } from "../../utils.js";

export const EXAMPLE = `
seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4
`;
export const EXPECTED = [35, 46];

/**
 * @param {Uint32Array} seeds
 * @param {Uint32Array[][]} steps
 */
const solveChunk = (seeds, steps) => {
  return new Promise((resolve) => {
    const worker = new Worker(new URL("./day05.worker.js", import.meta.url));
    worker.on("message", (result) => {
      worker.terminate();
      console.log(
        `${new Date().toISOString().split("Z")[0]} solved chunk (size: ${
          seeds.length
        }):`,
        result
      );
      resolve(result);
    });
    worker.postMessage({ seeds, steps });
  });
};

/**
 * @param {string[]} lines
 */
const parseSteps = (lines) => {
  /** @type {Record<string, Uint32Array[]>} */
  const steps = {};
  let currentName = "";
  for (const line of lines) {
    if (/[a-z]/i.test(line)) {
      currentName = line;
      steps[currentName] = [];
    } else {
      steps[currentName].push(
        new Uint32Array(safeSplit(line, " ").map(Number))
      );
    }
  }
  return Object.values(steps).map((specs) => specs.sort((a, b) => a[0] - b[0]));
};

const MAX_CHUNK_SIZE = 10_000_000;

/**
 * @param {string[]} lines
 */
export const partOne = async (lines) => {
  const [, strSeeds] = (lines.shift() || "").match(/seeds:\s*(.*)/i) || [];
  const seeds = new Uint32Array(safeSplit(strSeeds, " ").map(Number));
  const steps = parseSteps(lines);
  return solveChunk(seeds, steps);
};

/**
 * @param {string[]} lines
 */
export const partTwo = async (lines) => {
  const [, strSeeds] = (lines.shift() || "").match(/seeds:\s*(.*)/i) || [];
  const seedSpecs = safeSplit(strSeeds, " ").map(Number);
  const steps = parseSteps(lines);

  const currentChunk = new Uint32Array(MAX_CHUNK_SIZE);
  let chunkIndex = 0;
  let min = Infinity;
  for (let i = 0; i < seedSpecs.length; i++) {
    const start = seedSpecs[i];
    const length = seedSpecs[++i] || 0;
    for (let j = 0; j < length; j++) {
      currentChunk[chunkIndex++] = start + j;
      if (chunkIndex >= MAX_CHUNK_SIZE) {
        chunkIndex = 0;
        const result = await solveChunk(currentChunk, steps);
        if (result < min) {
          min = result;
        }
      }
    }
    console.log(`parsed seeds ${(i + 1) / 2}/${seedSpecs.length / 2}`);
  }

  const result = await solveChunk(currentChunk, steps);
  if (result < min) {
    min = result;
  }

  return min;
};
