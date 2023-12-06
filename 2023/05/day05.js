import { getNumbers, spawnWorkers } from "../../utils.js";

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
      steps[currentName].push(new Uint32Array(getNumbers(line)));
    }
  }
  return Object.values(steps).map((specs) => specs.sort((a, b) => a[1] - b[1]));
};

const MAX_CHUNK_SIZE = 100_000_000;
const WORKER_PATH = new URL("./day05.worker.js", import.meta.url);

const workers = spawnWorkers(WORKER_PATH, 8);

/**
 * @param {string[]} lines
 */
export const partOne = async (lines) => {
  const [, strSeeds] = (lines.shift() || "").match(/seeds:\s*(.*)/i) || [];
  const seeds = new Uint32Array(getNumbers(strSeeds));
  const steps = parseSteps(lines);
  return workers.start({ seeds, steps });
};

/**
 * @param {string[]} lines
 */
export const partTwo = async (lines) => {
  const solveCurrentSeeds = async () => {
    const result = await workers.start({ seeds: currentSeeds, steps });
    if (result < min) {
      min = result;
    }
  };

  const [, strSeeds] = (lines.shift() || "").match(/seeds:\s*(.*)/i) || [];
  const flatSeedRanges = getNumbers(strSeeds);
  const steps = parseSteps(lines);

  // Sort seed ranges
  const seedRanges = [];
  for (let i = 0; i < flatSeedRanges.length; i++) {
    seedRanges.push([flatSeedRanges[i], flatSeedRanges[++i] || 0]);
  }
  seedRanges.sort((a, b) => a[0] - b[0]);

  // Start processing seeds
  const currentSeeds = new Uint32Array(MAX_CHUNK_SIZE);
  let cursor = 0;
  let min = Infinity;
  for (let i = 0; i < seedRanges.length; i++) {
    const [start, length] = seedRanges[i];
    for (let j = 0; j < length; j++) {
      currentSeeds[cursor++] = start + j;
      if (cursor >= MAX_CHUNK_SIZE) {
        cursor = 0;
        await workers.free();
        solveCurrentSeeds();
      }
    }
    console.log(`parsed seeds ${i + 1}/${seedRanges.length}`);
  }

  // Solve remaining seeds
  if (cursor > 0) {
    await workers.free().then(solveCurrentSeeds);
  }

  return min;
};
