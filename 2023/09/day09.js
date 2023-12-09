import { first, getNumbers, last } from "../../utils.js";

export const EXAMPLE = `
0 3 6 9 12 15
1 3 6 10 15 21
10 13 16 21 30 45
`;
export const EXPECTED = [114, 2];

/**
 * @param {number[]} initialSequence
 */
const getSequences = (initialSequence) => {
  const sequences = [initialSequence];
  let lastSequence;
  while ((lastSequence = last(sequences, [])).some((n) => n !== 0)) {
    const nextSequence = [];
    for (let i = 0; i < lastSequence.length - 1; i++) {
      nextSequence.push(lastSequence[i + 1] - lastSequence[i]);
    }
    sequences.push(nextSequence);
  }
  return sequences;
};

/**
 * @param {string[]} lines
 */
export const partOne = async (lines) => {
  return lines.reduce((acc, line) => {
    const sequences = getSequences(getNumbers(line));
    for (let i = sequences.length - 1; i > 0; i--) {
      const [target, source] = sequences.slice(i - 1, i + 1);
      target.push(last(target, 0) + last(source, 0));
    }
    return acc + last(first(sequences, []), 0);
  }, 0);
};

/**
 * @param {string[]} lines
 */
export const partTwo = async (lines) => {
  return lines.reduce((acc, line) => {
    const sequences = getSequences(getNumbers(line));
    for (let i = sequences.length - 1; i > 0; i--) {
      const [target, source] = sequences.slice(i - 1, i + 1);
      target.unshift(first(target, 0) - first(source, 0));
    }
    return acc + first(first(sequences, []), 0);
  }, 0);
};
