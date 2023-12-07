import { safeSplit } from "../../utils.js";

export const EXAMPLE = `
32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483
`;
export const EXPECTED = [6440, 5905];

/**
 * @param {string} cards
 */
const getCounts = (cards) => {
  /** @type {Record<string, number>} */
  const counts = {};
  for (const card of cards) {
    if (!counts[card]) {
      counts[card] = 0;
    }
    counts[card]++;
  }
  return new Map(Object.entries(counts).sort((a, b) => b[1] - a[1]));
};

/**
 * @param {string} cards
 * @param {string} values
 */
const getScore = (cards, values) =>
  Number(
    [...cards]
      .map((card) => String(values.indexOf(card)).padStart(2, "0"))
      .join("")
  );

/** @type {Record<string, (first: number, second: number) => boolean>} */
const TYPES = {
  five: (first) => first === 5,
  four: (first) => first === 4,
  full: (first, second) => first === 3 && second === 2,
  three: (first) => first === 3,
  twoPairs: (first, second) => first === 2 && second === 2,
  pair: (first) => first === 2,
  high: () => true,
};
const STRENGTHS = Object.keys(TYPES).reverse();

/**
 * @param {string[]} lines
 */
export const partOne = async (lines) => {
  return lines
    .map((line) => {
      const [cards, value] = safeSplit(line, " ");
      const [first, second] = getCounts(cards).values();
      const [type = ""] =
        Object.entries(TYPES).find(([, fn]) => fn(first, second)) || [];
      return {
        score: getScore(cards, "23456789TJQKA"),
        strength: STRENGTHS.indexOf(type),
        value: Number(value),
      };
    })
    .sort((a, b) => a.strength - b.strength || a.score - b.score)
    .reduce((acc, { value }, i) => acc + value * (i + 1), 0);
};

/**
 * @param {string[]} lines
 */
export const partTwo = async (lines) => {
  return lines
    .map((line) => {
      const [cards, value] = safeSplit(line, " ");
      const countMap = getCounts(cards);
      const jCount = countMap.get("J");
      if (jCount && countMap.size > 1) {
        const [key, count] = [...countMap].find(([card]) => card !== "J") || [
          "2",
          0,
        ];
        countMap.delete("J");
        countMap.set(key, count + jCount);
      }
      const [first, second] = countMap.values();
      const [type = ""] =
        Object.entries(TYPES).find(([, fn]) => fn(first, second)) || [];
      return {
        score: getScore(cards, "J23456789TQKA"),
        strength: STRENGTHS.indexOf(type),
        value: Number(value),
      };
    })
    .sort((a, b) => a.strength - b.strength || a.score - b.score)
    .reduce((acc, { value }, i) => acc + value * (i + 1), 0);
};
