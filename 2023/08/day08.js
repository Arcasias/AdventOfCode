import { lcm } from "../../utils.js";

export const EXAMPLE = [
  `
LLR

AAA = (BBB, BBB)
BBB = (AAA, ZZZ)
ZZZ = (ZZZ, ZZZ)
`,
  `
LR

11A = (11B, XXX)
11B = (XXX, 11Z)
11Z = (11B, XXX)
22A = (22B, XXX)
22B = (22C, 22C)
22C = (22Z, 22Z)
22Z = (22B, 22B)
XXX = (XXX, XXX)
`,
];
export const EXPECTED = [6, 6];

/**
 * @param {string} value
 * @param {Record<string, [string, string]>} map
 * @param {string} instructions
 */
const getCount = (value, map, instructions) => {
  let count = 0;
  let instructionIndex = 0;
  while (value[2] !== "Z") {
    count++;
    value = map[value][Number(instructions[instructionIndex++] === "R")];
    if (instructionIndex >= instructions.length) {
      instructionIndex = 0;
    }
  }
  return count;
};

/**
 * @param {string[]} lines
 */
export const partOne = async (lines) => {
  const instructions = lines.shift() || "";
  /** @type {Record<string, [string, string]>} */
  const map = Object.fromEntries(
    lines.map((line) => {
      const [, key, left, right] =
        line.match(/(\w+)\s*=\s*\((\w+)\s*,\s*(\w+)\)/) || [];
      return [key, [left, right]];
    })
  );

  return getCount("AAA", map, instructions);
};

/**
 * @param {string[]} lines
 */
export const partTwo = async (lines) => {
  const instructions = lines.shift() || "";
  /** @type {Record<string, [string, string]>} */
  const map = Object.fromEntries(
    lines.map((line) => {
      const [, key, left, right] =
        line.match(/(\w+)\s*=\s*\((\w+)\s*,\s*(\w+)\)/) || [];
      return [key, [left, right]];
    })
  );

  return Object.keys(map)
    .filter((s) => s[2] === "A")
    .map((value) => getCount(value, map, instructions))
    .reduce(lcm, 1);
};
