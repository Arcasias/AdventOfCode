import { getNumbers } from "../../utils.js";

export const EXAMPLE = `
Time:      7  15   30
Distance:  9  40  200
`;
export const EXPECTED = [288, 71503];

/**
 * @param {number} time
 * @param {number} distance
 */
const findChoices = (time, distance) => {
  let choices = 0;
  for (let t = 0; t < time; t++) {
    if ((time - t) * t > distance) {
      choices++;
    }
  }
  return choices;
};

/**
 * @param {string[]} lines
 */
export const partOne = async ([timeLine, distanceLine]) => {
  const times = getNumbers(timeLine);
  return getNumbers(distanceLine).reduce(
    (acc, distance, i) => acc * findChoices(times[i], distance),
    1
  );
};

/**
 * @param {string[]} lines
 */
export const partTwo = async ([timeLine, distanceLine]) => {
  return findChoices(
    Number(timeLine.replace(/\D+/g, "")),
    Number(distanceLine.replace(/\D+/g, ""))
  );
};
