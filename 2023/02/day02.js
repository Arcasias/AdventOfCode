import { safeSplit } from "../../utils.js";

export const EXAMPLE = `
Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green
`;
export const EXPECTED = [8, 2286];

/** @type {Record<string, number>} */
const DEFAULT_VALUES = { red: 0, green: 0, blue: 0 };
/** @type {Record<string, number>} */
const CONSTRAINTS = { red: 12, green: 13, blue: 14 };

/**
 * @param {string[]} lines
 */
export const partOne = async (lines) => {
  return lines.reduce((acc, line) => {
    const [, id, strSets] = line.match(/game\s+(\d+)\s*:\s*(.*)/i) || [];
    const maxValues = { ...DEFAULT_VALUES };
    for (const strSet of strSets.split(/\s*;\s*/g)) {
      for (const strValue of strSet.split(/\s*,\s*/g)) {
        const [count, color] = strValue.split(/\s+/g);
        maxValues[color] = Math.max(maxValues[color], Number(count));
      }
    }

    if (
      Object.entries(maxValues).some(
        ([color, value]) => value > CONSTRAINTS[color]
      )
    ) {
      return acc;
    }

    return acc + Number(id);
  }, 0);
};

/**
 * @param {string[]} lines
 */
export const partTwo = async (lines) => {
  return lines.reduce((acc, line) => {
    const [, strSets] = line.match(/game\s+\d+\s*:\s*(.*)/i) || [];
    const maxValues = { ...DEFAULT_VALUES };
    for (const strSet of safeSplit(strSets, ";")) {
      for (const strValue of safeSplit(strSet, ",")) {
        const [count, color] = safeSplit(strValue, " ");
        maxValues[color] = Math.max(maxValues[color], Number(count));
      }
    }

    const values = Object.values(maxValues).filter(Boolean);
    return acc + values.reduce((a, b) => a * b, 1);
  }, 0);
};
