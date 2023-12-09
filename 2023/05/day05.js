import { getNumbers } from "../../utils.js";

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
  /** @type {Record<string, number[][]>} */
  const steps = {};
  let currentName = "";
  for (const line of lines) {
    if (/[a-z]/i.test(line)) {
      currentName = line;
      steps[currentName] = [];
    } else {
      const [target, source, length] = getNumbers(line);
      steps[currentName].push([target, source, source + length - 1]);
    }
  }
  return Object.values(steps).map((step) => step.sort((a, b) => a[1] - b[1]));
};

/**
 * @param {number[][]} ranges
 * @param {ReturnType<typeof parseSteps>} steps
 */
const solveSteps = (ranges, steps) => {
  /** @type {number[][]} */
  let input = [];
  let min = Infinity;
  let output = ranges;
  for (const stepRange of steps) {
    input = output;
    output = [];
    while (input.length) {
      let [seedStart, seedLength] = input.shift() || [];
      for (const [targetStart, sourceStart, sourceEnd] of stepRange) {
        let seedEnd = seedStart + seedLength - 1;
        if (seedEnd < sourceStart) {
          break;
        }

        if (sourceEnd < seedEnd) {
          // seed end is after range
          if (sourceEnd < seedStart) {
            // seed start is also after range: hand off to next iteration
            continue;
          } else {
            // seed start is before|in range: send excess to next iteration
            const outputLength = seedEnd - sourceEnd;
            input.unshift([sourceEnd + 1, outputLength]); // after range
            seedLength -= outputLength;
            seedEnd = sourceEnd;
          }
        }
        if (sourceStart <= seedStart) {
          // both seed start and seed end are in range
          output.push([seedStart + (targetStart - sourceStart), seedLength]); // in range
          seedLength = 0;
        } else {
          // only seed end is in range
          const outputLength = seedEnd - sourceStart + 1;
          output.push(
            [seedStart, sourceStart - seedStart], // before range
            [targetStart, outputLength] // in range
          );
          seedLength = 0;
        }
        break;
      }
      if (seedLength) {
        output.push([seedStart, seedLength]);
      }
    }
  }
  for (const range of output) {
    min = Math.min(min, range[0]);
  }
  return min;
};

/**
 * @param {string[]} lines
 */
export const partOne = async (lines) => {
  const [, strSeeds] = (lines.shift() || "").match(/seeds:\s*(.*)/i) || [];
  const seedRanges = getNumbers(strSeeds).map((seed) => [seed, 1]);
  const steps = parseSteps(lines);
  return solveSteps(seedRanges, steps);
};

/**
 * @param {string[]} lines
 */
export const partTwo = async (lines) => {
  const [, strSeeds] = (lines.shift() || "").match(/seeds:\s*(.*)/i) || [];
  const flatSeedRanges = getNumbers(strSeeds);
  const steps = parseSteps(lines);
  const seedRanges = [];
  for (let i = 0; i < flatSeedRanges.length; i++) {
    seedRanges.push([flatSeedRanges[i], flatSeedRanges[++i] || 0]);
  }
  return solveSteps(seedRanges, steps);
};
