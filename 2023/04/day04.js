import { getNumbers } from "../../utils.js";

export const EXAMPLE = `
Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11
`;
export const EXPECTED = [13, 30];

/**
 * @param {string[]} lines
 */
export const partOne = async (lines) => {
  let answer = 0;
  for (const line of lines) {
    const match = line.match(/^card\s+\d+:\s*(.*)\s*\|\s*(.*)$/i) || [];
    const winning = new Set(getNumbers(match[1]));
    const actual = new Set(getNumbers(match[2]));

    let score = 0;
    for (const number of actual) {
      if (winning.has(number)) {
        if (score) {
          score *= 2;
        } else {
          score = 1;
        }
      }
    }
    answer += score;
  }

  return answer;
};

/**
 * @param {string[]} lines
 */
export const partTwo = async (lines) => {
  const cards = [];
  for (const line of lines) {
    const match = line.match(/^card\s+\d+:\s*(.*)\s*\|\s*(.*)$/i) || [];
    const winning = new Set(getNumbers(match[1]));
    const actual = new Set(getNumbers(match[2]));
    const matching = new Set([...actual].filter((x) => winning.has(x))).size;

    cards.push([1, matching]);
  }

  for (let i = 0; i < cards.length; i++) {
    const [mult, value] = cards[i];
    for (let j = 0; j < value; j++) {
      cards[i + 1 + j][0] += mult;
    }
  }

  return cards.reduce((acc, card) => acc + card[0], 0);
};
